import API from "./axiosInstance.js";

// ✅ Get results for a specific semester
export const getStudentResults = async (semesterId) => {
  const res = await API.get(`/student/exams/results/${semesterId}`);
  return res.data;
};
