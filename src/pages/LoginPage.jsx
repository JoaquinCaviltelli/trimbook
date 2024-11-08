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
    <div className="fixed inset-0 bg-primary p-6">
      <div className="flex items-center justify-center h-full bg-gray-100 p-6">
        <button
          onClick={signInWithGoogle}
          className="px-5 py-3 bg-white text-primary rounded shadow-md font-medium"
        >
          <i className="fa-brands fa-google mr-3"></i>
          Iniciar con Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
