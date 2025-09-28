import API from "./axiosInstance.js";

export const getTeacherCourses = async () => {
  const res = await API.get("/teacher/courses");
  return res.data;
};

// export const saveAttendanceSummary = async (studentId, month, totalDays, presentDays) => {
//   const res = await API.post("/teacher/attendance-summary", {
//     studentId,
//     month,
//     totalDays,
//     presentDays
//   });
//   return res.data;
// };

// export const saveAttendanceSummary = async (data) => {
//   const res = await API.post("/teacher/attendance-summary", data);
//   return res.data;
// };

export const saveAttendanceSummary = async (studentId, month, year, totalDays, presentDays, percentage) => {
  const res = await API.post("/teacher/attendance-summary", {
    studentId,
    month,
    year,
    totalDays,
    presentDays,
    absentDays: totalDays - presentDays,
    percentage,
  });
  return res.data;
};


// ✅ Get all students
export const getAllStudents = async () => {
  const res = await API.get("/teacher/students");
  return res.data;
};


// ✅ Get student attendance history
export const getAttendanceSummary = async (studentId) => {
  const res = await API.get(`/teacher/attendance-summary/${studentId}`);
  return res.data;
};

export const getTeacherNews = async () => {
  // ✅ goes to /api/news
  const res = await API.get("/news");
  return res.data;
};

// ✅ New API: Teacher Profile
export const getTeacherProfile = async () => {
  const res = await API.get("/teacher/profile");
  return res.data;
};

export const updateAttendanceSummary = async (id, data) => {
  const res = await API.put(`/teacher/attendance-summary/${id}`, data);
  return res.data;
};

export const deleteAttendanceSummary = async (id) => {
  const res = await API.delete(`/teacher/attendance-summary/${id}`);
  return res.data;
};
