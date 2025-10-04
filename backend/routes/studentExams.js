import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Marks from "../models/Marks.js";
import { calculateGPA } from "../utils/grades.js";

const router = express.Router();

/* Get Results by Semester */
router.get("/results/:semesterId", verifyToken, authorizeRoles("student"), async (req, res) => {
  try {
    const results = await Marks.find({ student: req.user.id, semester: req.params.semesterId })
      .populate("subject", "name code");

    const gpa = calculateGPA(results.map(r => ({
      marksObtained: r.marksObtained,
      maxMarks: r.maxMarks
    })));

    res.json({
      semester: req.params.semesterId,
      results: results.map(r => ({
        subjectName: r.subject.name,
        subjectCode: r.subject.code,
        marksObtained: r.marksObtained,
        maxMarks: r.maxMarks,
        grade: r.grade
      })),
      gpa
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================================
   Get Logged-in Student Marks
================================== */
router.get("/marks", verifyToken, authorizeRoles("student"), async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.user.id })
      .populate("subject", "name code")
      .populate("semester", "semNumber year")
      .sort({ createdAt: -1 });

    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
