// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
       <div className="flex items-center space-x-3">
    <img
      src="/images/logo.jpg"  
      alt="SIET Logo"
      className="h-10 w-10 object-contain"
    />
    <h1 className="text-xl font-bold">SIET Portal</h1>
  </div>
      <div className="space-x-6 flex items-center">
        {/* ✅ Home Button */}
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}

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
