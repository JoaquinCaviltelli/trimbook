import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para la navegación
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome para íconos
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Íconos de apertura y cierre

// Importación de los íconos personalizados (SVG)
import { Home, Users, Calendar, Scissors, Clock, XCircle } from "react-feather"; 

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para cambiar el estado del menú
  const toggleMenu = () => setIsOpen(!isOpen);

  // Definimos los ítems del menú con iconos y rutas
  const items = [
    { icon: <XCircle className="" />, label: "NoWork", link: "/admin/non-working-days" },
    { icon: <Clock className="" />, label: "Horarios", link: "/admin/work-hours" },
    { icon: <Scissors className="" />, label: "Servicios", link: "/admin/services" },
    { icon: <Users className="" />, label: "Clientes", link: "/admin/clients" },
    { icon: <Calendar className="" />, label: "Home", link: "/admin" },
    
  ];

  // Función para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic es fuera de la zona del menú, cerramos el menú
      const menu = document.getElementById("menu-container");
      const button = document.getElementById("menu-open-button");

      if (menu && !menu.contains(event.target) && !button.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed  right-14 bottom-14 flex justify-center shadow-xl items-center">
      {/* Checkbox oculto que controla el estado del menú */}
      <div className={` w-8 h-8 bg-primary transition-all duration-500 absolute rounded-full  ${isOpen ? 'w-96 h-96' : ' '}`}></div>
      <input
        type="checkbox"
        id="menu-open"
        className="hidden"
        checked={isOpen}
        onChange={toggleMenu}
      />
      
      {/* Botón que abre/cierra el menú */}
      <label
        htmlFor="menu-open"
        id="menu-open-button"
        className={`cursor-pointer absolute  bg-primary  w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center transition-all duration-500 transform ${isOpen ? 'scale-75 bg-white' : 'shadow-md shadow-gray '}  z-50 `}
      >
        {/* Aquí cambiamos el ícono entre faBars y faTimes dependiendo del estado del menú */}
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars} // Cambiar entre los íconos
          className={`text-2xl transition-all  duration-300 transform ${isOpen ? 'rotate-90 text-primary ' : 'text-white '}`} // Transición suave al cambiar entre íconos
        />
      </label>

      {/* Contenedor de los íconos del menú */}
      <div
        id="menu-container"
        className={`absolute flex justify-center items-center transition-all duration-300 z-40 ${
          isOpen ? "opacity-100 " : "opacity-0"
        }`}
      >
        {items.map((item, index) => {
          // Calculamos el ángulo para la disposición circular de los íconos
          const angle = (index / items.length) * 110;
          const radius = 150; // Radio del círculo en píxeles

          // Calculamos las posiciones X e Y para los íconos
          const x = -radius * Math.cos((angle * Math.PI) / 180); // Movimiento en X
          const y = -radius * Math.sin((angle * Math.PI) / 180); // Movimiento en Y

          return (
            <Link
              key={item.label}
              to={item.link} // Usamos el Link para la navegación
              className={`absolute bg-white  rounded-full w-12 h-12 flex justify-center  text-primary  items-center transition-all duration-300 z-40`}
              style={{
                transform: isOpen ? `translate(${x}px, ${y}px)` : "translate(0, 0)", // Posición circular
                opacity: isOpen ? 1 : 0, // Desvanecimiento
                transitionDelay: `${index * 0.05}s`, // Retraso para animación
                transitionDuration: '0.3s', // Duración de la animación
              }}
            >
              {/* Íconos de React Icons */}
              {item.icon}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Menu;
