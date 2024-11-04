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
          <li
            key={day}
            className="mb-4 p-4 border rounded border-primary text-gray gap-4"
          >
            <div className="flex gap-2 items-center mb-3">
              <button
                onClick={() => handleAddScheduleClick(day)}
                className="p-2 w-6 h-6 flex justify-center items-center bg-primary text-white rounded"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <p className="font-bold capitalize text-primary">{day}</p>
            </div>
            <ul className="flex gap-1">
              {(schedules[day] || []).map((range, index) => (
                <li
                  key={index}
                  className="flex gap-2 font-medium text-gray-700 border border-primary rounded justify-between items-center p-3 text-xs flex-col"
                >
                  <span>
                    {range.startTime} - {range.endTime}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditScheduleClick(day, range, index)}
                      className="p-2 w-6 h-6 flex justify-center items-center bg-gray text-white rounded"
                    >
                      <span className="material-symbols-outlined  text-base">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => deleteTimeRange(day, index)}
                      className="p-2 w-6 h-6 flex justify-center items-center bg-red-800 text-white rounded"
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
