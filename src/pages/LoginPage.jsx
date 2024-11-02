// src/pages/LoginPage.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-6">
      <button
        onClick={signInWithGoogle}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
      >
        Iniciar con Google 
      </button>
    </div>
  );
}

export default LoginPage;
