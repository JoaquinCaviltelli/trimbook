// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, signInWithGoogle } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [nonWorkingDays, setNonWorkingDays] = useState([]);
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

  // Función para cargar la lista de servicios del administrador
  const loadServices = async (uid) => {
    try {
      const servicesCollection = collection(db, "Admin", uid, "services");
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesList);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  // Función para cargar horarios laborales
  const loadSchedules = async (uid) => {
    try {
      const scheduleCollection = collection(db, "Admin", uid, "workSchedules");
      const scheduleSnapshot = await getDocs(scheduleCollection);
      const scheduleData = {};
      scheduleSnapshot.forEach((doc) => {
        scheduleData[doc.id] = doc.data().timeRanges;
      });
      setSchedules(scheduleData);
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  // Cargar días no laborables desde Firestore
  const loadNonWorkingDays = async (uid) => {
    try {
      const scheduleRef = doc(db, "Admin", uid);
      const scheduleDoc = await getDoc(scheduleRef);

      if (scheduleDoc.exists()) {
        const scheduleData = scheduleDoc.data();
        const nonWorkingDaysList = scheduleData.nonWorkingDays || [];
        setNonWorkingDays(nonWorkingDaysList);
      } else {
        setNonWorkingDays([]);
      }
    } catch (error) {
      console.error("Error loading non-working days:", error);
    }
  };

  // Función para verificar si un día es laborable o no
  const isWorkingDay = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return !nonWorkingDays.includes(dateString);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "clientes", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
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
          navigate("/phone");
        } else {
          const existingUser = userDoc.data();
          setUser(existingUser);

          if (existingUser.role === "admin") {
            await loadClients();
            await loadServices(user.uid);
            await loadSchedules(user.uid);
            await loadNonWorkingDays(user.uid);
          }

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
      value={{
        user,
        clients,
        services,
        schedules,
        loading,
        signInWithGoogle,
        loadClients,
        loadServices,
        loadSchedules,
        nonWorkingDays,
        loadNonWorkingDays,
        isWorkingDay, // Proveer isWorkingDay
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
