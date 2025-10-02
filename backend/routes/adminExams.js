import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Branch from "../models/Branch.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js"; // teacher comes from User
const router = express.Router();

/* Create Branch */
router.post("/branch", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, code } = req.body;
    const branch = await Branch.create({ name, code });
    res.status(201).json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Create Semester */
router.post("/semester", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { year, semNumber, branchId } = req.body;
    const semester = await Semester.create({ year, semNumber, branch: branchId });
    res.status(201).json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Create Subject */
router.post("/subject", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, code, branchId, semesterId, facultyId } = req.body;
    const subject = await Subject.create({ name, code, branch: branchId, semester: semesterId, faculty: facultyId });

    // link subject to semester
    await Semester.findByIdAndUpdate(semesterId, { $push: { subjects: subject._id } });

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Assign Subject to Faculty */
router.put("/subject/:id/assign", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { facultyId } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { faculty: facultyId },
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.json({ message: "Subject assigned to faculty", subject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
