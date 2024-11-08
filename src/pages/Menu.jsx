import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Clock, XCircle } from "react-feather"; // Importamos los íconos de Feather

function Menu() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el menú está abierto o cerrado
  const menuRef = useRef(null); // Referencia al contenedor del menú
  const buttonRef = useRef(null); // Referencia al botón que abre o cierra el menú
  const location = useLocation(); // Usamos el hook useLocation para detectar cambios de ruta

  // Función para alternar el estado de apertura/cierre
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Alternamos el estado del menú
  };

  // Función para manejar clics fuera del menú
  const handleClickOutside = (e) => {
    // Verificamos si el clic ocurrió fuera del menú y fuera del botón
    if (
      menuRef.current && !menuRef.current.contains(e.target) &&
      buttonRef.current && !buttonRef.current.contains(e.target)
    ) {
      setIsOpen(false); // Si el clic está fuera del menú y del botón, lo cerramos
    }
  };

  // Usamos useEffect para escuchar clics fuera del menú
  useEffect(() => {
    // Agregamos el listener para detectar clics fuera del menú
    document.addEventListener("click", handleClickOutside);

    // Limpiamos el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Este useEffect solo se ejecuta una vez al montar el componente

  // Detectamos cuando cambia la ruta y cerramos el menú
  useEffect(() => {
    setIsOpen(false); // Cerramos el menú al cambiar la ruta
  }, [location]); // Dependemos de `location` para saber cuándo la ruta cambia

  return (
    <div>
      {/* Botón de abrir/cerrar menú */}
      <button
        ref={buttonRef} // Asignamos la referencia al botón
        onClick={toggleMenu}
        className={`fixed top-6 right-6 w-12 h-12 p-2 rounded z-10 ${
          isOpen ? "bg-white text-primary" : "bg-primary text-white"
        }`} // Cambio de fondo según el estado del menú
      >
        {isOpen ? (
          <i className="fa-solid fa-times text-2xl"></i> // Ícono de cerrar cuando el menú está abierto
        ) : (
          <i className="fa-solid fa-bars text-2xl"></i> // Ícono de abrir cuando el menú está cerrado
        )}
      </button>

      {/* Menú lateral con animación */}
      <div
        ref={menuRef} // Asignamos la referencia al contenedor del menú
        className={`fixed top-0 right-0 h-full bg-primary p-6 pt-32 transition-all duration-300 transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <ul className="grid grid-cols-2 gap-4">
          {/* Item de menú 1 */}
          <li className="rounded-lg transition duration-300 bg-white transform">
            <Link
              to="/admin"
              className="flex flex-col items-center gap-2 p-6 text-center"
            >
              <Home className="text-primary text-4xl" />
              <p className="text-xs text-primary">Home</p>
            </Link>
          </li>

          {/* Item de menú 2 */}
          <li className="rounded-lg transition duration-300 bg-white transform">
            <Link
              to="/admin/clients"
              className="flex flex-col items-center gap-2 p-6 text-center"
            >
              <Users className="text-primary text-4xl" />
              <p className="text-xs text-primary">Clientes</p>
            </Link>
          </li>

          {/* Item de menú 3 */}
          <li className="bg-white rounded-lg transition duration-300 transform">
            <Link
              to="/admin/services"
              className="flex flex-col items-center gap-2 p-6 text-center"
            >
              <Calendar className="text-primary text-4xl" />
              <p className="text-xs text-primary">Servicios</p>
            </Link>
          </li>

          {/* Item de menú 4 */}
          <li className="rounded-lg transition duration-300 bg-white transform">
            <Link
              to="/admin/work-hours"
              className="flex flex-col items-center gap-2 p-6 text-center"
            >
              <Clock className="text-primary text-4xl" />
              <p className="text-xs text-primary">Horarios</p>
            </Link>
          </li>

          {/* Item de menú 5 */}
          <li className="rounded-lg transition duration-300 bg-white transform">
            <Link
              to="/admin/NonWorkingDaysPage"
              className="flex flex-col items-center gap-2 p-6 text-center"
            >
              <XCircle className="text-primary text-4xl" />
              <p className="text-xs text-primary">NoWork</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
