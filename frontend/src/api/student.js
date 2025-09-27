import axios from "axios";
import API from "./axiosInstance.js";

// ✅ normal protected calls
export const getStudentCourses = async () => {
  const res = await API.get("/student/courses");
  return res.data;
};

export const getStudentProfile = async () => {
  const res = await API.get("/student/profile");
  return res.data;
};


export const getStudentAttendance = async () => {
  const res = await API.get("/student/attendance");
  return res.data;
};


// export const getStudentNews = async () => {
//   const publicAPI = axios.create({
//     baseURL: "https://college-management-app-ine5.onrender.com/api",
//   });
//   const res = await publicAPI.get("/news"); // ✅ no token
//   return res.data;
// };

export const getStudentNews = async () => {
  // ✅ goes to /api/news
  const res = await API.get("/news");
  return res.data;
};

