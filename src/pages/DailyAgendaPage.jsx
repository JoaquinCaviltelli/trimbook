import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
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

  // Función para calcular la fecha según el offset (ayer, hoy, mañana, pasado mañana)
  const getDateFor = (baseDate, offset) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + offset);
    return date;
  };

  // Estado para manejar las fechas de ayer, hoy, mañana y pasado mañana
  const [dates, setDates] = useState({
    yesterday: getDateFor(currentDate, -1),
    today: currentDate,
    tomorrow: getDateFor(currentDate, 1),
    dayAfterTomorrow: getDateFor(currentDate, 2),
  });

  // Función para formatear la fecha en el formato adecuado
  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Función para manejar el cambio de fecha cuando el usuario selecciona una fecha del carrusel
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);

    // Actualizamos el estado de las fechas (ayer, hoy, mañana, pasado mañana) según la nueva fecha seleccionada
    setDates({
      yesterday: getDateFor(newDate, -1),
      today: newDate,
      tomorrow: getDateFor(newDate, 1),
      dayAfterTomorrow: getDateFor(newDate, 2),
    });
  };

  // Función para separar el día, la fecha (día del mes) y el mes para estilos independientes
  const getDateParts = (date) => {
    const day = date.getDate(); // Día (12, 13, etc.)
    const weekday = date.toLocaleDateString("es-ES", { weekday: "short" }); // Nombre del día (lunes, martes, etc.)
    const month = date.toLocaleDateString("es-ES", { month: "short" }); // Mes (enero, febrero, noviembre, etc.)
    return { day, weekday, month };
  };

  // Función para obtener las reservas
  const fetchReservations = useCallback(() => {
    const reservationsRef = collection(db, "Admin", user.uid, "reservations");
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const q = query(
      reservationsRef,
      where("date", ">=", startOfDay),
      where("date", "<=", endOfDay)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReservations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(newReservations);
    });

    return () => unsubscribe();
  }, [currentDate, user.uid]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const generateTimeBlocks = useCallback(() => {
    const dayOfWeek = currentDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
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
        const time = start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const reservation = reservations.find((res) => res.time === time);
  
        if (reservation) {
          const reservationEndTime = new Date(reservation.date.seconds * 1000);
          reservationEndTime.setMinutes(
            reservationEndTime.getMinutes() + reservation.service.duration
          );
  
          let blocksToMark = Math.ceil(reservation.service.duration / 15);
          let currentBlock = start;
          let isFirstBlock = true;
  
          while (currentBlock < reservationEndTime && blocksToMark > 0) {
            const blockTime = currentBlock.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            if (!reservedTimes.has(blockTime)) {
              if (isFirstBlock) {
                blocks.push({
                  time: blockTime,
                  available: false,
                  client: reservation.client,
                  service: reservation.service,
                  reservationId: reservation.id, // Añadimos el ID de la reserva
                  date: reservation.date, // Agregamos la fecha de la reserva al bloque
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
              date: null, // En caso de que no haya reserva, asignamos null a la fecha
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
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleAssignTurn = async ({ client, service, time }) => {
    const durationInBlocks = Math.ceil(service.serviceDuration / 15);
    const availableBlocks = [];
    let foundStartBlock = false;
    let currentTime = time;

    for (let i = 0; i < durationInBlocks; i++) {
      const block = timeBlocks.find(
        (block) => block.time === currentTime && block.available
      );
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
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
        },
        service: {
          id: service.id,
          serviceName: service.serviceName,
          duration: service.serviceDuration,
          price: service.servicePrice,
        },
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
      await deleteDoc(
        doc(db, "Admin", user.uid, "reservations", reservationId)
      );

      // Actualizamos el estado de timeBlocks para reflejar la eliminación
      setTimeBlocks(
        timeBlocks.map((block) =>
          block.reservationId === reservationId
            ? {
                ...block,
                available: true,
                client: null,
                service: null,
                reservationId: null,
              }
            : block
        )
      );

      console.log("Reserva eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      alert("Hubo un problema al eliminar la reserva. Intenta de nuevo.");
    }
  };

  // Función para generar la URL de WhatsApp con el mensaje de confirmación
  const generateWhatsAppUrl = (client, service, time, date) => {
    // Asegúrate de que 'date' es un objeto Date
    if (date && date.seconds) {
      date = new Date(date.seconds * 1000); // Convertimos a un objeto Date
    }
  
    // Verificamos si 'date' es un objeto Date válido
    if (!(date instanceof Date) || isNaN(date)) {
      alert("Fecha inválida");
      return;
    }
  
    const message = `¡Hola ${client.name}!\nTu turno ha sido confirmado\n${formatDate(date)} a las ${time}.\n${service.serviceName}: $${service.price}\n\n¡Te esperamos!`;
    const phoneNumber = client.phone.replace(/[^\d]/g, ""); // Eliminar cualquier caracter no numérico
    const url = `https://wa.me/+549${phoneNumber}?text=${encodeURIComponent(message)}`;
    return url;
  };
  

  // Función para manejar el clic en el botón de compartir en WhatsApp
  const handleShareOnWhatsApp = (block) => {
    if (block.client && block.client.phone) {
      const { client, service, time, date } = block;
      
      // Verificamos si 'date' está disponible antes de intentar compartir
      if (date) {
        const url = generateWhatsAppUrl(client, service, time, date);
        window.open(url, "_blank"); // Abre la URL en una nueva pestaña
      } else {
        alert("Este bloque no tiene una fecha asociada.");
      }
    } else {
      alert("Este cliente no tiene un número de teléfono registrado.");
    }
  };
  

  return (
    <div className="flex flex-col items-center">
      <h2 className="self-start text-4xl font-bold text-gray">Moreletti</h2>
      <p className="mb-6 self-start leading-3 text-gray">Gonzalo Moreno</p>

      {/* Carrusel de fechas */}
      <div className="grid grid-cols-4 gap-2 mb-8 w-full max-w-md justify-between items-center">
        {["yesterday", "today", "tomorrow", "dayAfterTomorrow"].map((key) => {
          const dateParts = getDateParts(dates[key]);
          const isSelected = key === "today"; // Compara si la clave es 'today' (día actual)

          return (
            <div
              key={key}
              className={`flex col-span-1 items-center cursor-pointer ${
                isSelected ? "bg-gray-800 text-white" : "text-gray"
              }`} // Cambia el fondo y color del texto si es el día seleccionado
              onClick={() => handleDateChange(dates[key])}
            >
              <div
                className={`flex  border rounded  w-full flex-col items-center ${
                  isSelected ? "bg-gray text-white" : ""
                }`}
              >
                <span
                  className={`font-medium text-xs w-full bg-gray text-center p-1 ${
                    isSelected
                      ? "bg-white font-bold text-gray border rounded-t"
                      : "text-white "
                  }`}
                >
                  {dateParts.weekday}
                </span>
                <span className="font-bold text-3xl pt-2">{dateParts.day}</span>
                <span className="font-bold text-xs p-1">{dateParts.month}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-3xl">
        <ul className="space-y-2">
          {timeBlocks.length > 0 ? (
            timeBlocks.map((block, index) => (
              <li
                key={index}
                className={`bg-white flex ${
                  block.available ? "border-gray" : " text-gray"
                }`}
                onClick={() => block.available && openAssignModal(block.time)}
              >
                <span className="text-xs w-14 text-gray py-3 text-nowrap text-left">
                  {block.time}
                </span>
                <div
                  className={`flex flex-col rounded border w-full py-2 px-4 ${
                    block.available
                      ? "border-gray"
                      : "border-green-600  bg-green-100"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      block.available ? "text-gray" : ""
                    }`}
                  >
                    {block.available ? (
                      "Disponible"
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-base">
                            {block.client.name}
                          </p>
                          <p className="text-xs">
                            {block.service.duration} min
                          </p>
                        </div>
                        <p className="text-xs">{block.client.phone}</p>
                        <div className="mt-2 flex justify-between">
                          <div>
                            <p className="font-semibold">
                              {block.service.serviceName}
                            </p>
                            <p className="text-xs">${block.service.price}</p>
                          </div>
                          <div className="flex gap-1">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareOnWhatsApp(block);
                            }}
                            className="mt-2 text-white py-2 px-4  rounded bg-green-600"
                            >
                            <i className="fa-brands fa-whatsapp"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReservation(block.reservationId);
                            }}
                            className="mt-2 text-white py-2 px-4 text-xs rounded bg-red-700"
                            >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                            </div>
                        </div>
                      </>
                    )}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600 text-center">
              No hay bloques de tiempo disponibles para este día.
            </p>
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
