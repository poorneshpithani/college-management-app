import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";   // ✅ missing before
import User from "../models/User.js";          // ✅ missing before
import Marks from "../models/Marks.js";
import { calculateGrade } from "../utils/grades.js";

const router = express.Router();

/* ================================
   Get Assigned Subjects
================================== */
router.get("/subjects", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const subjects = await Subject.find({ faculty: req.user.id })
      .populate("semester branch");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   Get Students for a Subject
================================== */
router.get("/students/:subjectId", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).populate("semester branch");
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const semester = await Semester.findById(subject.semester);
    if (!semester) return res.status(404).json({ message: "Semester not found" });

    // Find active students in same branch + year
    const students = await User.find({
      role: "student",
      status: "active",
      branch: semester.branch,
      year: semester.year
    }).select("name email branch year");

    res.json({ subject: subject.name, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   Bulk Upload Marks
================================== */
router.post("/marks/upload", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { semesterId, subjectId, marks } = req.body; 
    // marks = [ { studentId, marksObtained, maxMarks } ]

    const ops = marks.map(m => {
      const grade = calculateGrade(m.marksObtained, m.maxMarks ?? 100);
      return {
        updateOne: {
          filter: { student: m.studentId, subject: subjectId, semester: semesterId },
          update: { $set: { marksObtained: m.marksObtained, maxMarks: m.maxMarks ?? 100, grade } },
          upsert: true
        }
      };
    });

    if (ops.length) {
      await Marks.bulkWrite(ops);
    }

    res.json({ message: "Marks uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   Update Marks for a Single Student
================================== */
router.put("/marks/:markId", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { marksObtained, maxMarks } = req.body;

    const record = await Marks.findById(req.params.markId).populate("subject");
    if (!record) return res.status(404).json({ message: "Marks record not found" });

    // ✅ Ensure teacher owns this subject
    if (String(record.subject.faculty) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to update this record" });
    }

    record.marksObtained = marksObtained;
    record.maxMarks = maxMarks ?? record.maxMarks;
    record.grade = calculateGrade(record.marksObtained, record.maxMarks);

    await record.save();
    res.json({ message: "Marks updated successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   Get All Marks for a Subject (Marks Sheet)
================================== */
router.get("/marks/:subjectId", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const marks = await Marks.find({ subject: req.params.subjectId })
      .populate("student", "name email")
      .populate("subject", "name code");

    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   Delete Marks for a Single Student
================================== */
router.delete("/marks/:markId", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const record = await Marks.findById(req.params.markId).populate("subject");
    if (!record) return res.status(404).json({ message: "Marks record not found" });

    // ✅ Ensure teacher owns this subject
    if (String(record.subject.faculty) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to delete this record" });
    }

    await record.deleteOne();
    res.json({ message: "Marks record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
