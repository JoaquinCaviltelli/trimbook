import { useState, useEffect } from "react";

function AddTimeRangeModal({ day, onAdd, onClose, editingRange }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (editingRange) {
      setStartTime(editingRange.startTime);
      setEndTime(editingRange.endTime);
    } else {
      setStartTime("");
      setEndTime("");
    }
  }, [editingRange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(day, startTime, endTime);
  };

  const close = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className=" flex justify-center items-center flex-col  h-full max-w-lg m-auto">
        <h4 className=" mb-28 text-center w-full text-primary">
          {editingRange
            ? `Editar Horario para ${day}`
            : `Añadir Horario para ${day}`}
        </h4>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full  items-center w-full"
        >
          <div className="w-full flex flex-col gap-6">
            <div>
              <label className="block mb-1">Hora de inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Hora de fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <button
              className="bg-secundary text-center w-full rounded h-14 relative text-white  font-semibold group"
              type="submit"
            >
              <div className="rounded h-14 w-1/6 flex items-center justify-center absolute top-0 group-hover:w-[100%] z-10 duration-500 bg-primary">
                <span className="material-symbols-outlined">save</span>
              </div>
              <p className="">{editingRange ? "Actualizar" : "Guardar"}</p>
            </button>

            <button
              onClick={close}
              type="button"
              className="bg-ligth-gray text-center w-full rounded h-12 relative text-white  font-semibold group"
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

export default AddTimeRangeModal;
