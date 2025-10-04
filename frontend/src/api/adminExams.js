import API from "./axiosInstance.js";

// ✅ Create a branch
export const createBranch = async (branch) => {
  const res = await API.post("/admin/exams/branch", branch);
  return res.data;
};

// ✅ Create a semester
export const createSemester = async (semester) => {
  const res = await API.post("/admin/exams/semester", semester);
  return res.data;
};

// ✅ Create a subject
export const createSubject = async (subject) => {
  const res = await API.post("/admin/exams/subject", subject);
  return res.data;
};

// ✅ Assign subject to a teacher
export const assignSubject = async (subjectId, facultyId) => {
  const res = await API.put(`/admin/exams/subject/${subjectId}/assign`, { facultyId });
  return res.data;
};

// Get active students for a branch/year
export const getStudents = async (branch, year) => {
  const res = await API.get(`/admin/students/filter?branch=${branch}&year=${year}`);
  return res.data;
};

// Assign students to a subject
export const assignStudentsToSubject = async (subjectId, studentIds) => {
  const res = await API.put(`/admin/exams/subject/${subjectId}/students`, { studentIds });
  return res.data;
};
