import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import Branch from "../models/Branch.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js"; // teacher comes from User
const router = express.Router();


// ✅ Public route - anyone can fetch branches (used in registration page)
// ✅ Public route to get all branches
router.get("/public/branches", async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Public route to get all semesters (by branch)
router.get("/public/semesters/:branchId", async (req, res) => {
  try {
    const semesters = await Semester.find({ branch: req.params.branchId })
      .sort({ year: 1, semNumber: 1 })
      .select("year semNumber branch");

    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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
// router.post("/semester", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const { year, semNumber, branchId } = req.body;
//     const semester = await Semester.create({ year, semNumber, branch: branchId });
//     res.status(201).json(semester);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

/* Create Semester (prevent duplicates) */
router.post("/semester", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { year, semNumber, branchId } = req.body;

    // 🔹 Prevent duplicate semester for same branch + year + semNumber
    const existing = await Semester.findOne({ year, semNumber, branch: branchId });
    if (existing) {
      return res.status(400).json({
        message: `Semester ${semNumber} for Year ${year} already exists for this branch.`,
      });
    }

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

/* Get All Branches */
router.get("/branches", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get Semesters for a Branch */
// router.get("/semesters/:branchId", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const semesters = await Semester.find({ branch: req.params.branchId }).sort({ semNumber: 1 });
//     res.json(semesters);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

/* Get Semesters for a Branch (with optional subjects) */
router.get("/semesters/:branchId", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const semesters = await Semester.find({ branch: req.params.branchId })
      .populate("subjects", "name code")
      .sort({ year: 1, semNumber: 1 });

    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* Get Subjects for a Semester (optional) */
// router.get("/subjects/:semesterId", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const subjects = await Subject.find({ semester: req.params.semesterId })
//       .populate("faculty", "name email")
//       .populate("branch", "name code");
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

/* Get Subjects for a Semester */
router.get("/subjects/:semesterId", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    if (!req.params.semesterId || req.params.semesterId === "undefined") {
      return res.status(400).json({ message: "Invalid semester ID" });
    }

    const subjects = await Subject.find({ semester: req.params.semesterId })
      .populate("faculty", "name email")
      .populate("branch", "name code");

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add or update assigned students for a subject
router.put("/subject/:id/students", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { studentIds } = req.body; // array of student _ids

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { students: studentIds },
      { new: true }
    ).populate("students", "name email branch year");

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.json({ message: "✅ Students assigned successfully", subject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.get("/students/filter", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const { branch, year } = req.query;
//     const query = { role: "student", status: "active" };
//     if (branch) query.branch = branch;
//     if (year) query.year = year;
//     const students = await User.find(query).select("name email branch year");
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// ✅ Get all students filtered by branch + year
// router.get("/students/filter", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const { branch, year } = req.query;

//     const query = { role: "student", status: "active" };
//     if (branch) query.branch = branch;
//     if (year) query.year = year;

//     const students = await User.find(query)
//       .select("name email branch year")
//       .populate("branch", "name");

//     res.json(students);
//   } catch (err) {
//     console.error("❌ Error fetching students:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get("/students/filter", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const { branch, year } = req.query;

//     const query = { role: "student" };
//     if (branch) query.branch = branch;
//     if (year) query.year = year;

//     const students = await User.find(query)
//       .select("name email branch year status") // ✅ include status
//       .populate("branch", "name"); // ✅ get branch name

//     res.json(students);
//   } catch (err) {
//     console.error("❌ Error fetching students:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// ✅ Get all students filtered by branch + year (with branch name)
router.get("/students/filter", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { branch, year } = req.query;

    const query = { role: "student" };
    if (branch) query.branch = branch;
    if (year) query.year = year;

    const students = await User.find(query)
      .populate("branch", "name code") // ✅ get proper branch info
      .select("name email year status branch"); // ✅ ensure branch field included

    res.json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: err.message });
  }
});



// ✅ Get all branches with years + semesters (for dynamic filters)
router.get("/filters/data", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const branches = await Branch.find().select("name code");
    const semesters = await Semester.find()
      .populate("branch", "name")
      .select("year semNumber branch");
    res.json({ branches, semesters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;
