// src/components/ClientDashboard.jsx
import { useAuth } from "../contexts/AuthContext";

function ClientDashboard() {
  
  const { user } = useAuth(); // Obtener clientes desde el contexto
  console.log(user)
  return (
    <div>
      <p>{user.name}</p>
      {/* Aquí puedes añadir el listado de reservas */}
    </div>
  );
}

export default ClientDashboard;
