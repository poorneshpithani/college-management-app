import axios from "axios";
import API from "./axiosInstance.js";

// ✅ normal protected calls
export const getStudentCourses = async () => {
  const res = await API.get("/student/courses");
  return res.data;
};

export const getStudentAttendance = async () => {
  const res = await API.get("/student/attendance");
  return res.data;
};


export const getStudentNews = async () => {
  const publicAPI = axios.create({
    baseURL: "http://localhost:5000/api",
  });
  const res = await publicAPI.get("/news"); // ✅ no token
  return res.data;
};

