// src/pages/HomePage.jsx
import ClientDashboard from "../components/ClientDashboard";

function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Bienvenido a la peluquería</h1>
      <ClientDashboard />
    </div>
  );
}

export default HomePage;
