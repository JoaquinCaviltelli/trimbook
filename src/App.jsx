// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PhonePage from "./pages/PhonePage";
import ClientsPage from "./pages/ClientsPage";
import ServicesPage from "./pages/ServicesPage";
import WorkHoursPage from "./pages/WorkSchedulePage"; // Importar la nueva página de horarios
import NonWorkingDaysPage from "./pages/NonWorkingDaysPage"; // Importar la nueva página de horarios
import Spinner from "./components/Spinner";
// En tu archivo index.js o App.js
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />}>
      <Route path="clients" element={user ? <ClientsPage /> : <Navigate to="/login" />} />
      <Route path="services" element={user ? <ServicesPage /> : <Navigate to="/login" />} />
      <Route path="work-hours" element={user ? <WorkHoursPage /> : <Navigate to="/login" />} />
      <Route path="non-working-days" element={user ? <NonWorkingDaysPage /> : <Navigate to="/login" />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/phone" element={<PhonePage />} />
  </Routes>
  );
}

export default App;
