// src/components/EditClientModal.jsx
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

function EditClientModal({ client, onClose }) {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);

  const { loadClients } = useAuth(); // Obtener clientes desde el contexto

  const close = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  // Función para manejar la actualización de los datos del cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setTimeout(() => {
        onClose();
      }, 500);
      const clientRef = doc(db, "clientes", client.id);
      await updateDoc(clientRef, {
        name,
        phone,
      });
      loadClients();
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className=" flex justify-center items-center flex-col  h-full max-w-lg m-auto">
        <h4 className=" mb-16 text-center w-full text-primary">Edit Client</h4>
        <img
          src={client.urlPhoto}
          alt={`${client.name}'s profile`}
          className="w-20 h-20 rounded-full mb-8 "
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full  items-center w-full"
        >
          <div className="w-full flex flex-col gap-6">
            <div className="wave-group">
              <input
                required
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>
                  N
                </span>
                <span className="label-char" style={{ "--index": 1 }}>
                  o
                </span>
                <span className="label-char" style={{ "--index": 2 }}>
                  m
                </span>
                <span className="label-char" style={{ "--index": 3 }}>
                  b
                </span>
                <span className="label-char" style={{ "--index": 4 }}>
                  r
                </span>
                <span className="label-char" style={{ "--index": 5 }}>
                  e
                </span>
              </label>
            </div>

            <div className="wave-group">
              <input
                required
                type="text"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>
                  T
                </span>
                <span className="label-char" style={{ "--index": 1 }}>
                  e
                </span>
                <span className="label-char" style={{ "--index": 2 }}>
                  l
                </span>
                <span className="label-char" style={{ "--index": 3 }}>
                  e
                </span>
                <span className="label-char" style={{ "--index": 4 }}>
                  f
                </span>
                <span className="label-char" style={{ "--index": 5 }}>
                  o
                </span>
                <span className="label-char" style={{ "--index": 6 }}>
                  n
                </span>
                <span className="label-char" style={{ "--index": 7 }}>
                  o
                </span>
              </label>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <button
              className="bg-secundary text-center w-full rounded h-14 relative text-white  font-semibold group"
              type="submit"
            >
              <div className="rounded h-14 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-primary">
              <i className="fa-solid fa-floppy-disk "></i>
              </div>
              <p className="">Guardar</p>
            </button>

            <button
              onClick={close}
              type="button"
              className="bg-ligth-gray text-center w-full rounded h-12 relative text-white  font-semibold group"
            >
              <div className="rounded h-12 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-gray">
              <i className="fa-solid fa-xmark"></i>
              </div>
              <p className="">Cancelar</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClientModal;
