import API from "./axiosInstance.js";

export const getPublicNews = async () => {
  const res = await API.get("/news"); // ✅ points to /api/news
  return res.data;
};
