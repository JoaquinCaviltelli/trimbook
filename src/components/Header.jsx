// src/components/Header.jsx
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user } = useAuth();

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-lg">Peluquería App</h1>
      {user && <p>{user.name}</p>}
    </header>
  );
}

export default Header;
