import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AddServiceModal from "../components/AddServiceModal";
import EditServiceModal from "../components/EditServiceModal"; // Importar el modal de edición

function ServicesPage() {
  const { services } = useAuth(); // Obtener servicios desde el contexto
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado del modal de añadir
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal de edición
  const [selectedService, setSelectedService] = useState(null); // Servicio seleccionado para editar

  // Función para abrir el modal de añadir servicio
  const handleAddServiceClick = () => {
    setIsAddModalOpen(true);
  };

  // Función para abrir el modal de edición de servicio
  const handleEditServiceClick = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  // Función para cerrar ambos modales
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="">
      <h4 className="text-xl font-bold mb-4 text-gray">Servicios</h4>
      <button
        onClick={handleAddServiceClick}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Añadir Servicio
      </button>
      <ul>
        {services.map((service) => (
          <li
            key={service.id}
            className="mb-4 p-4 text-gray border flex items-center justify-between rounded border-gray-600 text-gray-600 gap-4"
          >
            <div>
              <p className="font-bold text-lg">{service.serviceName}</p>
              <p>Duración: {service.serviceDuration} min</p>
              <p>Precio: ${service.servicePrice}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleEditServiceClick(service)}
                className="flex items-center"
              >
                <span className="material-symbols-outlined text-gray">
                  edit
                </span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para añadir servicio */}
      {isAddModalOpen && <AddServiceModal onClose={closeModals} />}

      {/* Modal para editar servicio */}
      {isEditModalOpen && (
        <EditServiceModal service={selectedService} onClose={closeModals} />
      )}
    </div>
  );
}

export default ServicesPage;
