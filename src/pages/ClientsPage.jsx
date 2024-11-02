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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clients List</h1>
      <ul>
        {clients.map((client) => (
          <li
            key={client.id}
            className="mb-4 p-4 border flex items-center justify-between rounded border-primary text-gray-600 gap-4"
          >
            <div className="flex items-center">
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
                <p className="font-bold">{client.name}</p>

                <a
                  href={`https://wa.me/${client.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 items-center"
                >
                  {client.phone}
                  <span className="material-symbols-outlined text-gray-600 text-lg">
                    sms
                  </span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleEditClick(client)}
                className="flex items-center"
              >
                <span className="material-symbols-outlined text-primary">
                  edit
                </span>
              </button>
            </div>
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
