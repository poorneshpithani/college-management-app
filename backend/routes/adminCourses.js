import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create a new course
router.post("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, code, teacherId, studentIds } = req.body;

    const course = await Course.create({
      name,
      code,
      teacher: teacherId,
      students: studentIds || [],
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all courses
router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .populate("students", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update a course
router.put("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, code, teacherId, studentIds } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.name = name || course.name;
    course.code = code || course.code;
    course.teacher = teacherId || course.teacher;
    if (studentIds) course.students = studentIds;

    await course.save();
    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete a course
router.delete("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
