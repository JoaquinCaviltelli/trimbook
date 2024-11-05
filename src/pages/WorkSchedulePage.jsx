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

    await setDoc(dayDocRef, { timeRanges: updatedTimeRanges });
    await loadSchedules(user.uid); // Recargar horarios después de eliminar
  };

  return (
    <div className="">
      <h4 className="text-xl font-bold mb-4 text-gray">Horarios Laborales</h4>
      <ul>
        {daysOfWeek.map((day) => (
          <li key={day} className="mb-4 p-4  text-gray gap-4">
            <div className="flex gap-2 items-center mb-3">
              <button
                onClick={() => handleAddScheduleClick(day)}
                className="p-2 w-8 h-8 flex justify-center items-center bg-gray text-white rounded"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <p className="font-bold capitalize text-gray">{day}</p>
            </div>
            <ul className="flex gap-1 flex-col justify-center items-start">
              {schedules[day] && (
                <div className="flex gap-2 font-medium justify-between items-center  text-xs">
                  <p className="w-16">Desde</p>
                  <p className="w-16">Hasta</p>
                </div>
              )}
              {(schedules[day] || []).map((range, index) => (
                <li
                  key={index}
                  className="flex gap-2 font-medium justify-between items-center  text-xs"
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
                      className="p-2 w-8 h-8 flex justify-center items-center bg-teal-800 text-white rounded"
                    >
                      <span className="material-symbols-outlined  text-base">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => deleteTimeRange(day, index)}
                      className="p-2 w-8 h-8 flex justify-center items-center bg-red-800 text-white rounded"
                    >
                      <span className="material-symbols-outlined  text-base">
                        delete
                      </span>
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
