import express from "express";
import User from "../models/User.js";
import News from "../models/News.js"; // ✅ use News model
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   USER APPROVAL SYSTEM
=============================== */

// Get all pending users
router.get("/pending-users", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve a user
router.put("/approve/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "active";
    await user.save();
    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject a user
router.put("/reject/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "rejected";
    await user.save();
    res.json({ message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================
   NEWS SYSTEM
=============================== */

// Create News
router.post("/news", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { title, message } = req.body;
    const news = await News.create({
      title,
      message,
      createdBy: req.user.id,
    });
    res.status(201).json(news);
  } catch (err) {
    console.error("❌ Error adding news:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get all news (public)
router.get("/news", async (req, res) => {
  try {
    const updates = await News.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete News
// router.delete("/news/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const news = await News.findById(req.params.id);
//     if (!news) return res.status(404).json({ message: "News not found" });

//     await news.deleteOne();
//     res.json({ message: "News deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// Update news
router.put("/news/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { title, message } = req.body;
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, message },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "News not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete news
router.delete("/news/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/* ======================
   Branch / Year / Role Filters
======================= */

// Get all students by branch
router.get("/students/branch/:branch", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const students = await User.find({ role: "student", branch: req.params.branch, status: "active" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students by year
router.get("/students/year/:year", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const students = await User.find({ role: "student", year: req.params.year, status: "active" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all teachers by designation
router.get("/teachers/role/:designation", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher", designation: req.params.designation, status: "active" });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get total students count
router.get("/students/count", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get total teachers/faculty count
router.get("/teachers/count", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "teacher" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
