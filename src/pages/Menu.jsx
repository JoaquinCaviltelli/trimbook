import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Para la navegación
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome para íconos
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Íconos de apertura y cierre

// Importación de los íconos personalizados (SVG)
import { Home, Users, Calendar, Clock, XCircle } from "react-feather"; 

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para cambiar el estado del menú
  const toggleMenu = () => setIsOpen(!isOpen);

  // Definimos los ítems del menú con iconos y rutas
  const items = [
    { icon: <Home className="text-white" />, label: "Home", link: "/admin" },
    { icon: <Users className="text-white" />, label: "Clientes", link: "/admin/clients" },
    { icon: <Calendar className="text-white" />, label: "Servicios", link: "/admin/services" },
    { icon: <Clock className="text-white" />, label: "Horarios", link: "/admin/work-hours" },
    { icon: <XCircle className="text-white" />, label: "NoWork", link: "/admin/non-working-days" },
    
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
    <nav className="fixed  right-14 bottom-14 flex justify-center items-center">
      {/* Checkbox oculto que controla el estado del menú */}
      <div className={` w-12 h-12 bg-emerald-50 transition-all  absolute rounded-full ${isOpen ? 'w-96 h-96' : 'scale-110 '}`}></div>
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
        className={`cursor-pointer absolute bg-primary  text-white w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center transition-all duration-500 transform ${isOpen ? 'scale-75 bg-secundary' : 'scale-110 '} shadow-md z-50`}
      >
        {/* Aquí cambiamos el ícono entre faBars y faTimes dependiendo del estado del menú */}
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars} // Cambiar entre los íconos
          className={`text-2xl transition-all duration-300 transform ${isOpen ? 'rotate-90 ' : ''}`} // Transición suave al cambiar entre íconos
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
              className={`absolute bg-primary  rounded-full w-12 h-12 flex justify-center items-center transition-all duration-300 shadow z-40`}
              style={{
                transform: isOpen ? `translate(${x}px, ${y}px)` : "translate(0, 0)", // Posición circular
                opacity: isOpen ? 1 : 0, // Desvanecimiento
                transitionDelay: `${index * 0.05}s`, // Retraso para animación
                transitionDuration: '0.3s' // Duración de la animación
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
