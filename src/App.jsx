// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PhonePage from "./pages/PhonePage";
import ClientsPage from "./pages/ClientsPage";
import ServicesPage from "./pages/ServicesPage";
import WorkHoursPage from "./pages/WorkSchedulePage";
import NonWorkingDaysPage from "./pages/NonWorkingDaysPage";
import DailyAgendaPage from "./pages/DailyAgendaPage"; // Importar la nueva página de agenda diaria
import Spinner from "./components/Spinner";
import '@fortawesome/fontawesome-free/css/all.min.css';

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
        <Route path="services" element={<ServicesPage />} />
        <Route path="work-hours" element={<WorkHoursPage />} />
        <Route path="non-working-days" element={<NonWorkingDaysPage />} />
        <Route path="/admin" element={<DailyAgendaPage />} /> {/* Nueva ruta para agenda diaria */}
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/phone" element={<PhonePage />} />
    </Routes>
  );
}

export default App;
