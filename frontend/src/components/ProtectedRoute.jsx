import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    // Logged in but wrong role → redirect to their own dashboard
    return <Navigate to={`/${user.role}`} replace />;
  }

  // Allowed → show the page
  return children;
};

export default ProtectedRoute;
