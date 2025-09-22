// backend/server.js
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
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// tiny logger to know route files loaded
console.log("Loading routes...");

app.use(
  cors({
    origin: "https://college-management-app-eight.vercel.app", // frontend address
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin/courses", adminCourseRoutes);

// simple healthcheck
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
