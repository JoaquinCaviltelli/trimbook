import React, { useState } from "react";

const AssignTurnModal = ({ isOpen, onClose, onAssignTurn, time, date, clients, services }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const handleAssign = () => {
    if (selectedClient && selectedService) {
      onAssignTurn({ client: selectedClient, service: selectedService, time });
      onClose();
    } else {
      alert("Por favor, selecciona un cliente y un servicio.");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-2xl font-semibold mb-4">Asignar Turno</h3>
          <p className="mb-4">
            <strong>Fecha:</strong> {date.toLocaleDateString()}<br />
            <strong>Hora:</strong> {time}
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Selecciona un Cliente</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md"
              onChange={(e) => setSelectedClient(JSON.parse(e.target.value))}
              value={selectedClient ? JSON.stringify(selectedClient) : ""}
            >
              <option value="">Selecciona un Cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={JSON.stringify(client)}>
                  {client.name}
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="mt-2">
                <strong>Teléfono:</strong> {selectedClient.phone}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Selecciona un Servicio</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md"
              onChange={(e) => setSelectedService(JSON.parse(e.target.value))}
              value={selectedService ? JSON.stringify(selectedService) : ""}
            >
              <option value="">Selecciona un Servicio</option>
              {services.map((service) => (
                <option key={service.id} value={JSON.stringify(service)}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-500 text-primary border border-primary rounded"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleAssign}
            >
              Asignar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AssignTurnModal;
