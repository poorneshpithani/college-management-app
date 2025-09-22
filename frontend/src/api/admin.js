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
