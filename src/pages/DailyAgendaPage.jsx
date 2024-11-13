import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { collection, query, where, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import AssignTurnModal from "../components/AssignTurnModal";

// Mapeo de días de la semana en inglés a español
const dayMap = {
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miércoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sábado",
  sunday: "domingo",
};

const DailyAgendaPage = () => {
  const { schedules, isWorkingDay, clients, services, user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);

  const fetchReservations = useCallback(() => {
    const reservationsRef = collection(db, "Admin", user.uid, "reservations");
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const q = query(reservationsRef, where("date", ">=", startOfDay), where("date", "<=", endOfDay));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReservations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReservations(newReservations);
    });

    return () => unsubscribe();
  }, [currentDate, user.uid]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const generateTimeBlocks = useCallback(() => {
    const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const dayInSpanish = dayMap[dayOfWeek];
    const daySchedule = schedules[dayInSpanish];
    if (!daySchedule) return [];

    const blocks = [];
    const reservedTimes = new Set();

    daySchedule.forEach(({ startTime, endTime }) => {
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);
      let start = new Date(currentDate);
      start.setHours(startHour, startMin, 0, 0);
      let end = new Date(currentDate);
      end.setHours(endHour, endMin, 0, 0);

      while (start < end) {
        const time = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
        const reservation = reservations.find((res) => res.time === time);

        if (reservation) {
          const reservationEndTime = new Date(reservation.date.seconds * 1000);
          reservationEndTime.setMinutes(reservationEndTime.getMinutes() + reservation.service.duration);

          let blocksToMark = Math.ceil(reservation.service.duration / 15);
          let currentBlock = start;
          let isFirstBlock = true;

          while (currentBlock < reservationEndTime && blocksToMark > 0) {
            const blockTime = currentBlock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
            if (!reservedTimes.has(blockTime)) {
              if (isFirstBlock) {
                blocks.push({
                  time: blockTime,
                  available: false,
                  client: reservation.client,
                  service: reservation.service,
                  reservationId: reservation.id,  // Añadimos el ID de la reserva
                });
                isFirstBlock = false;
              } else {
                reservedTimes.add(blockTime);
              }
            }
            currentBlock = new Date(currentBlock.getTime() + 15 * 60000);
            blocksToMark--;
          }
        } else {
          if (!reservedTimes.has(time)) {
            blocks.push({
              time,
              available: true,
              client: null,
              service: null,
            });
            reservedTimes.add(time);
          }
        }
        start = new Date(start.getTime() + 15 * 60000);
      }
    });

    return blocks;
  }, [currentDate, reservations, schedules]);

  useEffect(() => {
    const blocks = generateTimeBlocks();
    setTimeBlocks(blocks);
  }, [generateTimeBlocks]);

  const goToPreviousDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  const goToNextDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));

  const openAssignModal = (time) => {
    setSelectedDate(currentDate);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const incrementTimeBy15Minutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    date.setMinutes(date.getMinutes() + 15);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const handleAssignTurn = async ({ client, service, time }) => {
    const durationInBlocks = Math.ceil(service.serviceDuration / 15);
    const availableBlocks = [];
    let foundStartBlock = false;
    let currentTime = time;

    for (let i = 0; i < durationInBlocks; i++) {
      const block = timeBlocks.find((block) => block.time === currentTime && block.available);
      if (block) {
        availableBlocks.push(block);
        if (!foundStartBlock) foundStartBlock = true;
      } else {
        break;
      }
      currentTime = incrementTimeBy15Minutes(currentTime);
    }

    if (availableBlocks.length !== durationInBlocks) {
      alert("No hay suficientes bloques disponibles para este servicio.");
      return;
    }

    availableBlocks.forEach((block) => {
      block.available = false;
      block.client = client;
      block.service = service;
    });

    setTimeBlocks([...timeBlocks]);

    try {
      const reservationRef = collection(db, "Admin", user.uid, "reservations");
      const reservation = {
        client: { id: client.id, name: client.name, email: client.email, phone: client.phone },
        service: { id: service.id, serviceName: service.serviceName, duration: service.serviceDuration, price: service.servicePrice },
        time,
        date: selectedDate,
        createdAt: new Date(),
      };

      await addDoc(reservationRef, reservation);
      console.log("Reserva guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Hubo un problema al guardar la reserva. Intenta de nuevo.");
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      // Eliminamos la reserva en Firestore
      await deleteDoc(doc(db, "Admin", user.uid, "reservations", reservationId));

      // Actualizamos el estado de timeBlocks para reflejar la eliminación
      setTimeBlocks(timeBlocks.map((block) => 
        block.reservationId === reservationId ? { ...block, available: true, client: null, service: null, reservationId: null } : block
      ));

      console.log("Reserva eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      alert("Hubo un problema al eliminar la reserva. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Agenda Diaria</h2>
      <p className="text-lg text-gray-600 mb-6">
        Horario para el día:{" "}
        <span className="font-semibold text-blue-600">
          {currentDate.toLocaleDateString()}
        </span>
      </p>

      <div className="flex justify-center mb-6">
        <button onClick={goToPreviousDay} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
          Día anterior
        </button>
        <button onClick={goToNextDay} className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
          Día siguiente
        </button>
      </div>

      <div className="w-full max-w-3xl px-4">
        <ul className="space-y-2">
          {timeBlocks.length > 0 ? (
            timeBlocks.map((block, index) => (
              <li
                key={index}
                className={`bg-white grid grid-cols-6 ${block.available ? "border-gray" : "text-green-800"}`}
                onClick={() => block.available && openAssignModal(block.time)}
              >
                <span className="text-xs col-span-1 text-gray p-2 text-nowrap text-left">{block.time}</span>
                <div className={`flex flex-col rounded border w-full p-4 col-span-5 ${block.available ? "border-gray" : "border-green-800"}`}>
                  <span className={`text-sm font-medium ${block.available ? "text-gray" : ""}`}>
                    {block.available ? (
                      "Disponible"
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <p>{block.client.name}</p>
                          <p>{block.service.duration} min</p>
                        </div>
                        <p>{block.client.phone}</p>
                        <div className="mt-2">
                          <p>{block.service.serviceName}</p>
                          <p>${block.service.price}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReservation(block.reservationId);
                          }}
                          className="mt-2 text-red-500 hover:text-red-700"
                        >
                          Eliminar reserva
                        </button>
                      </>
                    )}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600 text-center">No hay bloques de tiempo disponibles para este día.</p>
          )}
        </ul>
      </div>

      <AssignTurnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssignTurn={handleAssignTurn}
        time={selectedTime}
        date={selectedDate}
        clients={clients}
        services={services}
      />
    </div>
  );
};

export default DailyAgendaPage;
