import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// ✅ Teacher Dashboard (basic info)
router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("teacher"),
  (req, res) => {
    res.json({
      message: `Welcome Teacher: ${req.user.id}, this is your Teacher Dashboard.`,
    });
  }
);

// ✅ Fetch all courses assigned to teacher
router.get(
  "/courses",
  verifyToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const courses = await Course.find({ teacher: req.user.id }).populate(
        "students",
        "name email"
      );
      res.json({ courses });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ View all attendance records for teacher
router.get(
  "/attendance",
  verifyToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const records = await Attendance.find({ teacher: req.user.id })
        .populate("student", "name email")
        .populate("course", "name code");

      res.json({ attendance: records });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ View attendance records for a specific course
router.get(
  "/attendance/:courseId",
  verifyToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const records = await Attendance.find({
        course: req.params.courseId,
        teacher: req.user.id,
      })
        .populate("student", "name email")
        .populate("course", "name code");

      res.json(records);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ Mark attendance
router.post(
  "/attendance",
  verifyToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const { courseId, studentId, status } = req.body;

      if (!["Present", "Absent"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status, use Present or Absent" });
      }

      const attendance = new Attendance({
        course: courseId,
        student: studentId,
        status,
        teacher: req.user.id, // ensure teacher is linked
      });

      await attendance.save();
      res.json({
        message: "Attendance marked successfully",
        attendance,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
