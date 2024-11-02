// src/pages/PhonePage.jsx
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

function PhonePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (user && phone) {
      const userRef = doc(db, "clientes", user.uid);
      await updateDoc(userRef, { phone });
      navigate(user.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handlePhoneSubmit}
        className="bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-xl mb-4">Completa tu número de teléfono</h2>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Número de teléfono"
          className="border border-gray-300 p-2 rounded w-full mb-4"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default PhonePage;
