import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import Calendar from "react-calendar"; 
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../services/firebase";
import "react-calendar/dist/Calendar.css";

function NonWorkingDaysPage() {
  const { user, nonWorkingDays, loadNonWorkingDays } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadNonWorkingDays(user.uid); // Pasamos el 'uid' de 'user'
    }
  }, [user, loadNonWorkingDays]); 

  // Función para agregar un día no laborable
  const addNonWorkingDay = async () => {
    if (!user) return;
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (!nonWorkingDays.includes(formattedDate)) {
      const scheduleRef = doc(db, "Admin", user.uid);
      await updateDoc(scheduleRef, { nonWorkingDays: arrayUnion(formattedDate) });
      loadNonWorkingDays(user.uid);
    }
  };

  // Función para eliminar un día no laborable
  const deleteNonWorkingDay = async (date) => {
    if (!user) return;
    const scheduleRef = doc(db, "Admin", user.uid);
    await updateDoc(scheduleRef, { nonWorkingDays: arrayRemove(date) });
    loadNonWorkingDays(user.uid);
  };

  // Función para formatear la fecha sin coma
  const formatDate = (date) => {
    // Sumar un día
    const newDate = new Date(date); // Crear una copia de la fecha original
    newDate.setDate(newDate.getDate() + 1); // Sumar un día
  
    // Obtener el nombre del día, el día numérico y el mes
    const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(newDate);
    const day = new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(newDate);
    const month = new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(newDate);
    
    return { weekday, day, month };
  };

  // Función para filtrar fechas anteriores a hoy y ordenar
  const filterAndSortDates = (dates) => {
    const today = new Date();

    // Filtrar las fechas para mostrar solo las futuras
    const futureDates = dates.filter(date => {
      const dateObj = new Date(date);
      return dateObj >= today; // Compara las fechas
    });

    // Ordenar las fechas de forma cronológica
    return futureDates.sort((a, b) => new Date(a) - new Date(b));
  };

  // Filtrar y ordenar las fechas no laborables
  const sortedNonWorkingDays = filterAndSortDates(nonWorkingDays);

  return (
    <div>
      <h4 className="text-xl font-bold mb-4 text-gray">Días No Laborables</h4>
      <Calendar
        className="border-none w-full text-primary"
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) =>
          nonWorkingDays.includes(date.toISOString().split("T")[0])
            ? "bg-red-300 text-white"
            : "text-gray"
        }
      />
      <button
        onClick={addNonWorkingDay}
        className="mt-4 p-2 bg-primary text-white rounded w-full"
      >
        Ocupar día
      </button>

      {/* Mostrar la lista de días no laborables */}
      <ul className="mt-16 flex gap-4 flex-wrap justify-center">
        {sortedNonWorkingDays.map((day) => {
          const date = new Date(day);  // Convertir la cadena de la fecha en un objeto Date
          const { weekday, day: dayNumber, month } = formatDate(date); // Formateamos la fecha
          
          return (
            <li key={day} className="mb-2 flex flex-col justify-center border rounded border-red-500 items-center w-24 relative">
              {/* Renderizamos las partes de la fecha individualmente para poder estilizar */}
              <span className="font-bold text-xs bg-red-500 text-white w-full text-center p-2">{weekday}</span>
              <span className="text-gray text-2xl pt-3">{dayNumber}</span>
              <span className="text-gray text-sm font-medium p-1">{` de ${month}`}</span>

              <button
                onClick={() => deleteNonWorkingDay(day)}
                className="absolute -top-3 -right-3 bg-red-700 rounded-full w-8 h-8"
              >
                
              <i className="fa-solid fa-trash text-white"></i>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default NonWorkingDaysPage;
