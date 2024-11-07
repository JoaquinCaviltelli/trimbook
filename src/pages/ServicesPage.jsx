import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ServiceModal from "../components/ServiceModal";

function ServicesPage() {
  const { services} = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleAddServiceClick = () => {
    setSelectedService(null); // Para agregar un nuevo servicio
    setIsModalOpen(true);
  };

  const handleEditServiceClick = (service) => {
    setSelectedService(service); // Para editar un servicio existente
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };


  return (
    <div className="">
      <h4 className="text-xl font-bold mb-4 text-gray">Servicios</h4>
      <button
        onClick={handleAddServiceClick}
        className="mb-4 py-2 px-4 bg-primary text-white rounded"
      >
        Añadir Servicio
      </button>
      <ul>
        {services.map((service) => (
          <li
            key={service.id}
            className="mb-4 text-gray flex justify-between  text-gray-600 gap-4 bg-white shadow-xl"
          >
            <div className="p-4 w-full">
              <div className="flex justify-between w-full items-center gap-4">

              <p className="font-bold  text-primary">{service.serviceName}</p>
              <p className="flex gap-2 text-xs items-center ">
                
                <i className="fa-solid fa-clock text-base"></i>
                {service.serviceDuration}min
              </p>
              </div>
              <p className="flex gap-1 text-xs items-center text-gray">
                
              <i className="fa-solid fa-dollar-sign"></i>
                {service.servicePrice}
              </p>
            </div>

            <button
              onClick={() => handleEditServiceClick(service)}
              className="flex bg-primary items-center "
            >
              
              <i className="fa-solid fa-edit text-white px-3"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal para agregar y editar servicio */}
      {isModalOpen && (
        <ServiceModal service={selectedService} onClose={closeModal} />
      )}
    </div>
  );
}

export default ServicesPage;
