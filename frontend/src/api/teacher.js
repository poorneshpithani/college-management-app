import API from "./axiosInstance.js";

export const getTeacherCourses = async () => {
  const res = await API.get("/teacher/courses");
  return res.data;
};

export const getTeacherAttendance = async () => {
  const res = await API.get("/teacher/attendance");
  return res.data;
};

export const getTeacherNews = async () => {
  // ✅ goes to /api/news
  const res = await API.get("/news");
  return res.data;
};
