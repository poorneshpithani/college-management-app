import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance.js";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
  
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-center bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
    
  );
};

export default Login;
