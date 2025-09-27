import API from "./axiosInstance.js";

export const getPendingUsers = async () => {
  const res = await API.get("/admin/pending-users");
  return res.data;
};

export const approveUser = async (id) => {
  const res = await API.put(`/admin/approve/${id}`);
  return res.data;
};

export const rejectUser = async (id) => {
  const res = await API.put(`/admin/reject/${id}`);
  return res.data;
};

export const getNews = async () => {
  const res = await API.get("/admin/news");
  return res.data;
};

export const addNews = async (news) => {
  const res = await API.post("/admin/news", news);
  return res.data;
};


export const getCourses = async () => {
  const res = await API.get("/admin/courses");
  return res.data;
};

export const addCourse = async (course) => {
  const res = await API.post("/admin/courses", course);
  return res.data;
};


// Students by Branch
export const getStudentsByBranch = async (branch) => {
  const res = await API.get(`/admin/students/branch/${branch}`);
  return res.data;
};

// Students by Year
export const getStudentsByYear = async (year) => {
  const res = await API.get(`/admin/students/year/${year}`);
  return res.data;
};

// Teachers by Designation
export const getTeachersByRole = async (designation) => {
  const res = await API.get(`/admin/teachers/role/${designation}`);
  return res.data;
};

export const updateNews = async (id, news) => {
  const res = await API.put(`/admin/news/${id}`, news);
  return res.data;
};

export const deleteNews = async (id) => {
  const res = await API.delete(`/admin/news/${id}`);
  return res.data;
};

export const getStudentCount = async () => {
  const res = await API.get("/admin/students/count");
  return res.data.count;
};

export const getTeacherCount = async () => {
  const res = await API.get("/admin/teachers/count");
  return res.data.count;
};
