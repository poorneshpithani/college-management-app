// backend/routes/news.js
import express from "express";
import News from "../models/News.js";

const router = express.Router();

// Public: fetch all news
router.get("/", async (req, res) => {
  try {
    const updates = await News.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    console.error("❌ Error fetching news:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
