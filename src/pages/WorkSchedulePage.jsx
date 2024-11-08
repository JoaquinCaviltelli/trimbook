import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AddTimeRangeModal from "../components/AddTimeRangeModal";
import { db } from "../services/firebase";
import { doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";

const daysOfWeek = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

function WorkSchedulePage() {
  const { user, schedules, loadSchedules } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingRange, setEditingRange] = useState(null);

  useEffect(() => {
    if (user) {
      loadSchedules(user.uid);
    }
  }, [user, loadSchedules]);
  

  
  const handleAddScheduleClick = (day) => {
    setSelectedDay(day);
    setEditingRange(null);
    setIsModalOpen(true);
  };


  const handleEditScheduleClick = (day, range, index) => {
    setSelectedDay(day);
    setEditingRange({ ...range, index });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
    setEditingRange(null);
  };

  const addOrUpdateTimeRange = async (day, startTime, endTime) => {
    if (!user) return;

    const dayDocRef = doc(db, "Admin", user.uid, "workSchedules", day);
    const newTimeRanges = editingRange
      ? schedules[day].map((range, index) =>
          index === editingRange.index ? { startTime, endTime } : range
        )
      : [...(schedules[day] || []), { startTime, endTime }];

    await setDoc(dayDocRef, { timeRanges: newTimeRanges });
    await loadSchedules(user.uid); // Recargar horarios después de añadir/editar
    closeModal();
  };

  const deleteTimeRange = async (day, index) => {
    if (!user) return;
  
    const dayDocRef = doc(db, "Admin", user.uid, "workSchedules", day);
    const updatedTimeRanges = schedules[day].filter((_, i) => i !== index);
  
    // Si ya no hay rangos de tiempo, eliminar el documento del día
    if (updatedTimeRanges.length === 0) {
      await deleteDoc(dayDocRef); // Eliminar el documento
    } else {
      await setDoc(dayDocRef, { timeRanges: updatedTimeRanges }); // Actualizar el documento con los nuevos rangos
    }
  
    await loadSchedules(user.uid); // Recargar horarios después de eliminar
  };
  

  return (
    <div className="">
      <h4 className="text-xl font-bold mb-4 text-gray">Horarios Laborales</h4>
      <ul className="flex flex-col gap-4">
        {daysOfWeek.map((day) => (
          <li key={day} className="  text-gray gap-4 bg-white shadow">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleAddScheduleClick(day)}
                className=" w-6 h-full px-4 py-2 flex justify-center items-center bg-primary text-white"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <p className="font-bold text-sm capitalize text-primary">{day}</p>
            </div>
            <ul className={`flex gap-1 px-4 flex-col justify-center items-start ${schedules[day] && "pb-4"}`}>
              {schedules[day] && (
                <div className="flex gap-2 mt-4 font-medium justify-between items-center  text-xs">
                  <p className="w-16">Desde</p>
                  <p className="w-16">Hasta</p>
                </div>
              )}
              {(schedules[day] || []).map((range, index) => (
                <li
                  key={index}
                  className="flex gap-2 font-medium justify-between items-center  text-xs w-full"
                >
                  <div className="flex gap-2">
                    <span className="bg-ligth-gray text-white w-16 h-8 flex justify-center items-center rounded">
                      {range.startTime}
                    </span>
                    <span className="bg-ligth-gray text-white w-16 h-8 flex justify-center items-center rounded">
                      {range.endTime}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditScheduleClick(day, range, index)}
                      className="p-2 w-8 h-8 flex justify-center items-center bg-sky-800 text-white rounded"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={() => deleteTimeRange(day, index)}
                      className="p-2 w-8 h-8 flex justify-center items-center bg-red-800 text-white rounded"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <AddTimeRangeModal
          day={selectedDay}
          onAdd={addOrUpdateTimeRange}
          onClose={closeModal}
          editingRange={editingRange}
        />
      )}
    </div>
  );
}

export default WorkSchedulePage;
