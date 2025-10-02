import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Attendance from "../models/Attendance.js";
import AttendanceSummary from "../models/AttendanceSummary.js";

import Course from "../models/Course.js";
import User from "../models/User.js";


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


// 📌 Teacher Profile
router.get("/profile", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select("name designation email");
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



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

// router.post("/attendance-summary", verifyToken, authorizeRoles("teacher"), async (req, res) => {
//   try {
//     const { studentId, month, totalDays, presentDays } = req.body;

//     const absentDays = totalDays - presentDays;
//     const percentage = ((presentDays / totalDays) * 100).toFixed(2);

//     let record = await AttendanceSummary.findOne({ student: studentId, month });

//     if (record) {
//       // update
//       record.totalDays = totalDays;
//       record.presentDays = presentDays;
//       record.absentDays = absentDays;
//       record.percentage = percentage;
//       await record.save();
//     } else {
//       // create
//       record = await AttendanceSummary.create({
//         student: studentId,
//         month,
//         totalDays,
//         presentDays,
//         absentDays,
//         percentage,
//       });
//     }

//     res.status(201).json(record);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post("/attendance-summary", verifyToken, authorizeRoles("teacher"), async (req, res) => {
//   try {
//     const { studentId, month, year, totalDays, presentDays, absentDays, percentage } = req.body;

//     const record = new AttendanceSummary({
//       student: studentId,
//       month,
//       year,
//       totalDays,
//       presentDays,
//       absentDays,
//       percentage,
//     });

//     await record.save();
//     res.status(201).json(record);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// POST or UPDATE Attendance Summary
router.post("/attendance-summary", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { studentId, month, year, totalDays, presentDays } = req.body;

    const absentDays = totalDays - presentDays;
    const percentage = ((presentDays / totalDays) * 100).toFixed(2);

    let record = await AttendanceSummary.findOne({ student: studentId, month, year });

    if (record) {
      // Update existing
      record.totalDays = totalDays;
      record.presentDays = presentDays;
      record.absentDays = absentDays;
      record.percentage = percentage;
      await record.save();
    } else {
      // Create new
      record = new AttendanceSummary({
        student: studentId,
        month,
        year,
        totalDays,
        presentDays,
        absentDays,
        percentage,
      });
      await record.save();
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/attendance-summary/:id", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { totalDays, presentDays } = req.body;

    const absentDays = totalDays - presentDays;
    const percentage = ((presentDays / totalDays) * 100).toFixed(2);

    const updated = await AttendanceSummary.findByIdAndUpdate(
      req.params.id,
      { totalDays, presentDays, absentDays, percentage },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Record not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/attendance-summary/:id", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const deleted = await AttendanceSummary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// 📌 Get Attendance for a Student
router.get("/attendance-summary/:studentId", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const records = await AttendanceSummary.find({ student: req.params.studentId }).sort({ month: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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

// 📌 Get all active students
router.get("/students", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const students = await User.find({ role: "student", status: "active" })
      .select("name email branch year");
    res.json(students);
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
