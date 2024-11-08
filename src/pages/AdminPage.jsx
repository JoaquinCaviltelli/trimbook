// src/pages/AdminPage.jsx
import { Link, Outlet } from "react-router-dom";
import Menu from "/src/pages/Menu.jsx";

function AdminPage() {
  return (
    <div className="w-full">
      <Menu />
     

      <div className="p-6 mt-10 mb-16">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage;
