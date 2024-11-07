// src/pages/ClientsPage.jsx
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import EditClientModal from "../components/EditClientModal";

function ClientsPage() {
  const { clients } = useAuth(); // Obtener clientes desde el contexto
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

  // Función para abrir el modal de edición
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  // Filtrar solo clientes con el rol 'client'
  const filteredClients = clients.filter((client) => client.role === "client");

  return (
    <div className="">
      <h4 className="text-xl font-bold mb-4 text-gray">Clientes</h4>
      <ul>
        {clients.map((client) => (
          <li
            key={client.id}
            className="mb-4 text-gray flex justify-between text-gray-600 gap-4 bg-white shadow-xl"
          >
            <div className="p-4 flex">
              {client.urlPhoto ? (
                <img
                  src={client.urlPhoto}
                  alt={`${client.name}'s profile`}
                  className="w-12 h-12 rounded-full mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-gray-300 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
              <div>
                <p className="font-bold ">{client.name}</p>

                <a
                  href={`https://wa.me/${client.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray flex items-center "
                  >
                  <i className="fa-brands fa-whatsapp mr-1"></i>
                  {client.phone}
                  
                </a>
              </div>
            </div>

            <button
              onClick={() => handleEditClick(client)}
              className="flex bg-primary items-center "
            >
              
              <i className="fas fa-pen-to-square text-white px-3 text-lg"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal para editar cliente */}
      {isModalOpen && (
        <EditClientModal client={selectedClient} onClose={closeModal} />
      )}
    </div>
  );
}

export default ClientsPage;
