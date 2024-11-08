import { useState, useEffect } from "react";
import TimePicker from "./TimePicker"; // Asegúrate de importar correctamente el TimePicker

function AddTimeRangeModal({ day, onAdd, onClose, editingRange }) {
  const [startHour, setStartHour] = useState(0);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(0);
  const [endMinute, setEndMinute] = useState(0);
  const [error, setError] = useState(""); // Estado para manejar el error de validación
  const [success, setSuccess] = useState(false); // Nuevo estado para manejar el éxito

  useEffect(() => {
    if (editingRange) {
      const [startH, startM] = editingRange.startTime.split(":").map(Number);
      const [endH, endM] = editingRange.endTime.split(":").map(Number);
      setStartHour(startH);
      setStartMinute(startM);
      setEndHour(endH);
      setEndMinute(endM);
    } else {
      setStartHour(0);
      setStartMinute(0);
      setEndHour(0);
      setEndMinute(0);
    }
  }, [editingRange]);

  // Función para comparar si la hora de fin es mayor que la de inicio
  const isValidTimeRange = () => {
    if (endHour < startHour) return false; // Hora de fin menor que hora de inicio
    if (endHour === startHour && endMinute <= startMinute) return false; // Mismo hora pero minuto de fin menor o igual
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar si la hora de fin es mayor a la hora de inicio
    if (!isValidTimeRange()) {
      setError("La hora de fin debe ser mayor que la hora de inicio.");
      setTimeout(() => {
        setError(""); // Limpiar el error después de 1 segundo
      }, 1000);
      return;
    }

    // Si es válido, limpiar el error, activar el éxito y enviar el formulario
    setError(""); // Limpiar error
    setSuccess(true); // Activar éxito
    const formattedStartTime = `${String(startHour).padStart(2, "0")}:${String(
      startMinute
    ).padStart(2, "0")}`;
    const formattedEndTime = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;
    onAdd(day, formattedStartTime, formattedEndTime);

    // Limpiar el estado de éxito después de 1 segundo
    setTimeout(() => {
      setSuccess(false); // Limpiar el estado de éxito
    }, 3000);
  };

  const close = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-white p-6 z-40">
      <div className="flex justify-center items-center flex-col h-full max-w-lg m-auto">
        <h4 className="mb-28 text-center w-full text-primary uppercase font-bold">
          {day}
        </h4>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full items-center w-full"
        >
          <div className="w-full flex flex-col justify-between items-center">
            <div className="flex justify-center items-center gap-4 w-full relative">
              <label className="absolute left-0 text-white w-full p-3 -translate-y-1 bg-primary rounded font-semibold shadow-xl">Desde</label>
              <TimePicker
                selectedHour={startHour}
                selectedMinute={startMinute}
                setSelectedHour={setStartHour}
                setSelectedMinute={setStartMinute}
              />
            </div>
            <div className="flex justify-center items-center gap-4 w-full relative">
              <label className="absolute left-0 text-white  w-full p-3 -translate-y-1 bg-primary rounded font-semibold shadow-xl">Hasta</label>
              <TimePicker
                selectedHour={endHour}
                selectedMinute={endMinute}
                setSelectedHour={setEndHour}
                setSelectedMinute={setEndMinute}
              />
            </div>
          </div>

          <div className="flex flex-col w-full gap-2">
            {/* Mostrar mensaje de error */}
            {error && <p className="text-red-400 text-center">{error}</p>}
            <button
              className={`bg-secundary text-center w-full rounded h-14 relative text-white font-semibold group `}
              type="submit"
            >
              <div
                className={`rounded h-14 w-1/6 flex items-center justify-center absolute top-0 z-10 duration-500 bg-primary ${
                  error
                    ? "bg-red-500 group-hover:w-[100%]"
                    : success
                    && "group-hover:w-[100%]"
                }`}
              >
                {error ? <i className="fa-solid fa-circle-exclamation animate-shake"></i> : success ? <i className="fa-solid fa-check"></i>  : <i className="fa-solid fa-floppy-disk "></i>}
                {/* <span className={`material-symbols-outlined ${error && "animate-shake"}`}>
                  {error ? "error" : success ? "check" : "save"}
                </span> */}
              </div>
              <p>{editingRange ? "Actualizar" : "Agregar"}</p>
            </button>

            <button
              onClick={close}
              type="button"
              className="bg-ligth-gray text-center w-full rounded h-12 relative text-white font-semibold group"
            >
              <div className="rounded h-12 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-gray">
              <i className="fa-solid fa-xmark"></i>
              </div>
              <p>Cancelar</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTimeRangeModal;
