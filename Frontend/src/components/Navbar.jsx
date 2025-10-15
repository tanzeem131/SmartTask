import { LogOut } from "lucide-react";

const Navbar = ({ user, logout }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">SmartTask</h1>
          <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="hover:cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
