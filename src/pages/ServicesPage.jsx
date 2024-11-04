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
            className="mb-4 text-gray border flex justify-between rounded border-primary text-gray-600 gap-4 "
          >
            <div className="p-4 ">
              <p className="font-bold mb-2 text-primary">{service.serviceName}</p>
              <p className="flex gap-2 text-xs items-center ">
                <span className="material-symbols-outlined leading-3 text-base">timer</span>
                {service.serviceDuration} min
              </p>
              <p className="flex gap-2 text-xs items-center">
                <span className="material-symbols-outlined  leading-3 text-base">payments</span>$
                {service.servicePrice}
              </p>
            </div>

            <button
              onClick={() => handleEditServiceClick(service)}
              className="flex bg-primary items-center "
            >
              <span className="material-symbols-outlined text-white px-3">
                edit
              </span>
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
