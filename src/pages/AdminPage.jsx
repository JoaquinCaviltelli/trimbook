// src/pages/AdminPage.jsx
import { Link, Outlet } from "react-router-dom";

function AdminPage() {
  return (
    <div className="p-4 w-full max-w-lg m-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav className="mb-4">
        <Link to="/admin/clients" className="text-blue-500 hover:underline">
          View Clients
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default AdminPage;
