import API from "./axiosInstance.js";

// ✅ Get all subjects assigned to teacher
export const getTeacherSubjects = async () => {
  const res = await API.get("/teacher/exams/subjects");
  return res.data;
};

// ✅ Get all students for a subject
export const getStudentsBySubject = async (subjectId) => {
  const res = await API.get(`/teacher/exams/students/${subjectId}`);
  return res.data;
};

// ✅ Upload marks (bulk or single)
export const uploadMarks = async (data) => {
  const res = await API.post("/teacher/exams/marks/upload", data);
  return res.data;
};

// ✅ Get marks sheet for a subject
export const getMarksBySubject = async (subjectId) => {
  const res = await API.get(`/teacher/exams/marks/${subjectId}`);
  return res.data;
};

// ✅ Update marks for a student
export const updateMarks = async (markId, data) => {
  const res = await API.put(`/teacher/exams/marks/${markId}`, data);
  return res.data;
};

// ✅ Delete marks for a student
export const deleteMarks = async (markId) => {
  const res = await API.delete(`/teacher/exams/marks/${markId}`);
  return res.data;
};
