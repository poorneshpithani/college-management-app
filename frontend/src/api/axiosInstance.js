import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://college-management-app-ine5.onrender.com/api/",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
