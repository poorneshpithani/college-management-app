import API from "./axiosInstance.js";

export const getTeacherCourses = async () => {
  const res = await API.get("/teacher/courses");
  return res.data;
};

export const getTeacherAttendance = async () => {
  const res = await API.get("/teacher/attendance");
  return res.data;
};

// ✅ fetch news/announcements (shared with students)
export const getTeacherNews = async () => {
  const res = await API.get("/news"); // this is mounted in server.js → app.use("/api/news", newsRoutes)
  return res.data;
};
