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
