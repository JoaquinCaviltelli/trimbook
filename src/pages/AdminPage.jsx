// src/pages/AdminPage.jsx
import { Link, Outlet } from "react-router-dom";

function AdminPage() {
  return (
    <div className="p-6 w-full max-w-lg">
      <nav className="mb-4 space-y-2">
        <Link to="/admin/clients" className="text-blue-500 hover:underline">
          View Clients
        </Link>
        <br />
        <Link to="/admin/services" className="text-blue-500 hover:underline">
          Manage Services
        </Link>
        <br />
        <Link to="/admin/work-hours" className="text-blue-500 hover:underline">
          Set Work Hours
        </Link>
        <br />
        <Link to="/admin/NonWorkingDaysPage" className="text-blue-500 hover:underline">
          no work
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default AdminPage;
