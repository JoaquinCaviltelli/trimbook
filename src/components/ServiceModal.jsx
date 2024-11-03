import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function ServiceModal({ service, onClose }) {
  const { user, loadServices } = useAuth();
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (service) {
      setServiceName(service.serviceName);
      setDuration(service.serviceDuration);
      setPrice(service.servicePrice);
    } else {
      setServiceName("");
      setDuration("");
      setPrice("");
    }
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (service) {
        // Editar servicio
        const serviceRef = doc(
          db,
          "Admin",
          service.adminUid,
          "services",
          service.id
        );
        await updateDoc(serviceRef, {
          serviceName,
          serviceDuration: duration,
          servicePrice: price,
        });
      } else {
        // Añadir servicio
        const serviceRef = collection(db, "Admin", user.uid, "services");
        await addDoc(serviceRef, {
          adminUid: user.uid,
          adminName: user.name,
          serviceName,
          serviceDuration: duration,
          servicePrice: price,
        });
      }
      loadServices();
      onClose();
    } catch (error) {
      console.error(
        service ? "Error updating service:" : "Error adding service:",
        error
      );
      alert("Failed to save service.");
    }
  };

  const handleDelete = async () => {
    if (service) {
      try {
        const serviceRef = doc(
          db,
          "Admin",
          service.adminUid,
          "services",
          service.id
        );
        await deleteDoc(serviceRef);
        loadServices();
        onClose();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service.");
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className="flex justify-center items-center flex-col h-full max-w-lg m-auto">
        <h4 className="mb-16 text-center w-full text-primary">
          {service ? "Editar Servicio" : "Añadir Servicio"}
        </h4>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full items-center w-full"
        >
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
                type="number"
                className="input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ "--index": 0 }}>
                  D
                </span>
                <span className="label-char" style={{ "--index": 1 }}>
                  u
                </span>
                <span className="label-char" style={{ "--index": 2 }}>
                  r
                </span>
                <span className="label-char" style={{ "--index": 3 }}>
                  a
                </span>
                <span className="label-char" style={{ "--index": 4 }}>
                  c
                </span>
                <span className="label-char" style={{ "--index": 5 }}>
                  i
                </span>
                <span className="label-char" style={{ "--index": 6 }}>
                  ó
                </span>
                <span className="label-char" style={{ "--index": 7 }}>
                  n
                </span>
                <span className="label-char" style={{ "--index": 8 }}>
                  &nbsp;
                </span>
                <span className="label-char" style={{ "--index": 9 }}>
                  (min)
                </span>
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
                <span className="label-char" style={{ "--index": 0 }}>
                  P
                </span>
                <span className="label-char" style={{ "--index": 1 }}>
                  r
                </span>
                <span className="label-char" style={{ "--index": 2 }}>
                  e
                </span>
                <span className="label-char" style={{ "--index": 3 }}>
                  c
                </span>
                <span className="label-char" style={{ "--index": 4 }}>
                  i
                </span>
                <span className="label-char" style={{ "--index": 5 }}>
                  o
                </span>
                <span className="label-char" style={{ "--index": 6 }}>
                  &nbsp;
                </span>
                <span className="label-char" style={{ "--index": 7 }}>
                  ($)
                </span>
              </label>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <button
              type="submit"
              className="bg-secundary text-center w-full rounded h-12 relative text-white font-semibold group"
            >
              <div className="rounded h-12 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-primary">
                <span className="material-symbols-outlined">save</span>
              </div>
              <p className="">{service ? "Guardar Cambios" : "Guardar"}</p>
            </button>
            {service && ( // Mostrar botón de eliminar solo si estamos editando
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-center w-full rounded h-12 relative text-white font-semibold group"
              >
                <div className="rounded h-12 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-red-600">
                  <span className="material-symbols-outlined">delete</span>
                </div>
                <p className="">Eliminar</p>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
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

export default ServiceModal;
