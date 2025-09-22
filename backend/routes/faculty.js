import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// 📌 Faculty: Mark Attendance
router.post("/attendance", verifyToken, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const record = await Attendance.create({ student: studentId, date, status });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
