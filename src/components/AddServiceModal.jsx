import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function AddServiceModal({ onClose }) {
  const { user, loadServices } = useAuth(); // Obtener UID del admin y cargar servicios
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  // Función para manejar la adición de un nuevo servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceRef = collection(db, "Admin", user.uid, "services");
      await addDoc(serviceRef, {
        adminUid: user.uid,
        adminName: user.name,
        serviceName,
        duration,
        price,
      });
      loadServices(); // Actualizar la lista de servicios
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className="flex justify-center items-center flex-col h-full max-w-lg m-auto">
        <h4 className="mb-16 text-center w-full text-primary">Añadir Servicio</h4>
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full items-center w-full">
          <div className="w-full flex flex-col gap-6">
            <div className="wave-group">
              <input
                required
                type="text"
                className="input"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>N</span>
                <span className="label-char" style={{ "--index": 1 }}>o</span>
                <span className="label-char" style={{ "--index": 2 }}>m</span>
                <span className="label-char" style={{ "--index": 3 }}>b</span>
                <span className="label-char" style={{ "--index": 4 }}>r</span>
                <span className="label-char" style={{ "--index": 5 }}>e</span>
              </label>
            </div>

            <div className="wave-group">
              <input
                required
                type="text"
                className="input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>D</span>
                <span className="label-char" style={{ "--index": 1 }}>u</span>
                <span className="label-char" style={{ "--index": 2 }}>r</span>
                <span className="label-char" style={{ "--index": 3 }}>a</span>
                <span className="label-char" style={{ "--index": 4 }}>c</span>
                <span className="label-char" style={{ "--index": 5 }}>i</span>
                <span className="label-char" style={{ "--index": 6 }}>ó</span>
                <span className="label-char" style={{ "--index": 7 }}>n</span>
                <span className="label-char" style={{ "--index": 8 }}>&nbsp;</span>
                <span className="label-char" style={{ "--index": 9 }}>(min)</span>
              </label>
            </div>

            <div className="wave-group">
              <input
                required
                type="number"
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>P</span>
                <span className="label-char" style={{ "--index": 1 }}>r</span>
                <span className="label-char" style={{ "--index": 2 }}>e</span>
                <span className="label-char" style={{ "--index": 3 }}>c</span>
                <span className="label-char" style={{ "--index": 4 }}>i</span>
                <span className="label-char" style={{ "--index": 5 }}>o</span>
                <span className="label-char" style={{ "--index": 6 }}>&nbsp;</span>
                <span className="label-char" style={{ "--index": 7 }}>($)</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 mt-4">
            <button
              className="bg-secundary text-center w-full rounded h-14 relative text-white font-semibold group"
              type="submit"
            >
              <div className="rounded h-14 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-primary">
                <span className="material-symbols-outlined">save</span>
              </div>
              <p className="">Guardar</p>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="bg-ligth-gray text-center w-full rounded h-12 relative text-white font-semibold group"
            >
              <div className="rounded h-12 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-gray">
                <span className="material-symbols-outlined">close</span>
              </div>
              <p className="">Cancelar</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddServiceModal;
