// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, signInWithGoogle } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]); // Nuevo estado para almacenar clientes
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Función para cargar la lista de clientes
  const loadClients = async () => {
    try {
      const clientsCollection = collection(db, "clientes");
      const clientsSnapshot = await getDocs(clientsCollection);
      const clientsList = clientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsList);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "clientes", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // Crear nuevo usuario con rol "client" y sin teléfono
          const newUser = {
            name: user.displayName,
            email: user.email,
            phone: "",
            role: "client",
            uid: user.uid,
            urlPhoto: user.photoURL,
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
          navigate("/phone"); // Redirigir para completar el teléfono
        } else {
          const existingUser = userDoc.data();
          setUser(existingUser);

          // Cargar clientes si el usuario es "admin"
          if (existingUser.role === "admin") {
            await loadClients(); // Cargar lista de clientes solo si es admin
          }

          // Redirigir según el estado del usuario
          if (!existingUser.phone) {
            navigate("/phone");
          } else if (existingUser.role === "admin") {
            if (!location.pathname.startsWith("/admin")) {
              navigate("/admin");
            }
          } else {
            navigate("/");
          }
        }
      } else {
        setUser(null);
        // Redirigir a login si no está autenticado y no está en /login
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider
      value={{ user, clients, loading, signInWithGoogle, loadClients }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
