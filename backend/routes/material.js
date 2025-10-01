import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { uploadCloud } from "../middleware/upload.js";   // ✅ fixed import
import Material from "../models/Material.js";
import User from "../models/User.js";
import axios from "axios";

const router = express.Router();

// 📌 Teacher Upload Material
router.post(
  "/upload",
  verifyToken,
  authorizeRoles("teacher"),
  uploadCloud.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

const originalExt = req.file.originalname.split('.').pop();

const newMaterial = new Material({
  title: req.body.title,
  description: req.body.description,
  branch: req.body.branch,
  year: req.body.year,
  fileUrl: req.file.path, // Cloudinary URL
  originalName: req.file.originalname || `file.${originalExt}`,
  uploadedBy: req.user.id,
});




      await newMaterial.save();
      res.json(newMaterial);
    } catch (error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// 📌 Student Get Materials
router.get("/student", verifyToken, authorizeRoles("student"), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("branch year");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const materials = await Material.find({
      branch: student.branch,
      year: student.year,
    }).sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    console.error("❌ Error fetching materials:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get Teacher Materials
router.get("/teacher", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const materials = await Material.find({ uploadedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Delete Material
router.delete("/:id", verifyToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Not found" });

    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await material.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// routes/material.js
router.get("/download/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "File not found" });
    }

    const filename = material.originalName || `${material.title}.pdf`;

    // Fetch file from Cloudinary
    const response = await axios.get(material.fileUrl, { responseType: "stream" });

    // Force proper filename + PDF type
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    // Pipe Cloudinary stream to client
    response.data.pipe(res);
  } catch (err) {
    console.error("❌ Download error:", err.message);
    res.status(500).json({ message: "Failed to download file" });
  }
});

export default router;
