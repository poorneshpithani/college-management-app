import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";
import facultyRoutes from "./routes/faculty.js";
import newsRoutes from "./routes/news.js";
import teacherRoutes from "./routes/teacher.js";
import adminCourseRoutes from "./routes/adminCourses.js";
import materialRoutes from "./routes/material.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express(); // ✅ define app first
app.use(express.json());

// allowed origins
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://college-management-app-eight.vercel.app", // Vercel frontend
];



// ✅ register CORS middleware after app is defined
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin/courses", adminCourseRoutes);

app.use("/api/materials", materialRoutes);

// healthcheck
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});

// Serve uploads
app.use("/uploads", express.static("uploads"));

// global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
