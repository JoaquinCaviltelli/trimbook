// src/pages/PhonePage.jsx
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

function PhonePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [buttonColor, setButtonColor] = useState("bg-secundary");
  const navigate = useNavigate();
  const [textButton, setTextButton] = useState("Confirmar");

  const validatePhoneNumber = (number) => {
    // Puedes ajustar esta expresión regular según el formato que necesites
    const regex = /^[0-9]{10,15}$/; // Ejemplo: número de 10 a 15 dígitos
    return regex.test(number);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phone)) {
      // Cambiar el color del botón a rojo
      setButtonColor("bg-red-500");
      setTextButton("Error")
      // Cambiar el color de nuevo después de 1 segundo
      
      setTimeout(() => {
        setTextButton("Confirmar")
        setButtonColor("bg-secundary")
      }, 1000);
      return;
    }else{
      setButtonColor("bg-primary")
    }

    if (user && phone) {
      const userRef = doc(db, "clientes", user.uid);
      await updateDoc(userRef, { phone });
      navigate(user.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className="flex justify-center items-center flex-col h-full max-w-lg m-auto">
        <h4 className="mb-24 text-center w-full text-primary">Completa tus datos</h4>
        <form
          onSubmit={handlePhoneSubmit}
          className="flex flex-col justify-between h-full items-center w-full"
        >
          <div className="w-full flex flex-col gap-6">
            <div className="wave-group">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input"
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>N</span>
                <span className="label-char" style={{ "--index": 1 }}>ú</span>
                <span className="label-char" style={{ "--index": 2 }}>m</span>
                <span className="label-char" style={{ "--index": 3 }}>e</span>
                <span className="label-char" style={{ "--index": 4 }}>r</span>
                <span className="label-char" style={{ "--index": 5 }}>o</span>
                <span className="label-char" style={{ "--index": 5 }}>&nbsp;</span>
                <span className="label-char" style={{ "--index": 6 }}>d</span>
                <span className="label-char" style={{ "--index": 7 }}>e</span>
                <span className="label-char" style={{ "--index": 8 }}>&nbsp;</span>
                <span className="label-char" style={{ "--index": 9 }}>t</span>
                <span className="label-char" style={{ "--index": 10 }}>e</span>
                <span className="label-char" style={{ "--index": 11 }}>l</span>
                <span className="label-char" style={{ "--index": 12 }}>é</span>
                <span className="label-char" style={{ "--index": 13 }}>f</span>
                <span className="label-char" style={{ "--index": 14 }}>o</span>
                <span className="label-char" style={{ "--index": 15 }}>n</span>
                <span className="label-char" style={{ "--index": 16 }}>o</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <button
              type="submit"
              className={`${buttonColor} text-center w-full rounded h-14 relative text-white font-semibold transition-all`}
            >
              <p className="">{textButton}</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhonePage;
