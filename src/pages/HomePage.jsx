// src/pages/HomePage.jsx
import ClientDashboard from "../components/ClientDashboard";

function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Nombre de la peluqueria</h1>
      <ClientDashboard />
    </div>
  );
}

export default HomePage;
