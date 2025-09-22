import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import TeacherDashboard from "./pages/Teacher/Dashboard.jsx";
import StudentDashboard from "./pages/Student/Dashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import TestNews from "./pages/TestNews.jsx";





function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // ✅ If logged in and visiting "/", redirect to their dashboard
  useEffect(() => {
    if (user && location.pathname === "/") {
      window.location.replace(`/${user.role}`);
    }
  }, [user, location]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/test-news" element={<TestNews />} />

      {/* Protected Dashboards */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
