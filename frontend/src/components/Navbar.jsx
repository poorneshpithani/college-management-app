import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="font-bold text-lg">College Management</h1>
      <div className="space-x-6 flex items-center">
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin Dashboard
          </Link>
        )}
        {user?.role === "teacher" && (
          <Link to="/teacher" className="hover:underline">
            Teacher Dashboard
          </Link>
        )}
        {user?.role === "student" && (
          <Link to="/student" className="hover:underline">
            Student Dashboard
          </Link>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
