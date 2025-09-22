import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Attendance from "../models/Attendance.js";
import News from "../models/News.js";

const router = express.Router();

// 📌 Student Dashboard
router.get("/dashboard", verifyToken, authorizeRoles("student"), (req, res) => {
  res.json({
    message: `Welcome ${req.user.role}: ${req.user.id}, this is your Student Dashboard.`,
  });
});

// 📌 View Courses (dummy data for now)
router.get("/courses", verifyToken, authorizeRoles("student"), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("courses");
    res.json(student.courses); // ✅ array only
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Student Profile (basic info)
router.get("/profile", verifyToken, authorizeRoles("student"), (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
    message: "This is your student profile data.",
  });
});

// 📌 View Attendance
router.get("/attendance", verifyToken, authorizeRoles("student"), async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id });
    res.json(records); // ✅ array only
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 View News/Updates (public - no login required)
router.get("/news", async (req, res) => {
  try {
    const updates = await News.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
