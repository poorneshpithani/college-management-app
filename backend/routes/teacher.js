import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// ✅ Teacher Dashboard
router.get("/dashboard", verifyToken, authorizeRoles("teacher"), (req, res) => {
  res.json({
    message: `Welcome Teacher: ${req.user.id}, this is your Teacher Dashboard.`,
  });
});

// ✅ Mark Attendance
router.post("/attendance", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { courseId, studentId, status } = req.body;

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status, use Present or Absent" });
    }

    const attendance = new Attendance({
      course: courseId,
      student: studentId,
      status,
    });

    await attendance.save();
    res.json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ View Attendance (all records for a course)
router.get("/attendance/:courseId", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId })
      .populate("student", "name email")
      .populate("course", "name code");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
