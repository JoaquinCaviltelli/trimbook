// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PhonePage from "./pages/PhonePage";
import ClientsPage from "./pages/ClientsPage";
import ServicesPage from "./pages/ServicesPage"; // Importar la nueva página de servicios
import Spinner from "./components/Spinner";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />}>
        <Route path="clients" element={<ClientsPage />} />
        <Route path="services" element={<ServicesPage />} /> {/* Nueva ruta para servicios */}
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/phone" element={<PhonePage />} />
    </Routes>
  );
}

export default App;
