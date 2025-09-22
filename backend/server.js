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


// tiny logger to know route files loaded
console.log("Loading routes...");

const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://college-management-app-eight.vercel.app/" // your Vercel frontend URL
];


app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
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
}));



// app.use(cors({
//   origin: allowedOrigins,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // if you’re using cookies/JWT in headers
// }));

// app.use(
//   cors({
//     origin: "https://college-management-app-eight.vercel.app", // frontend address
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );


const app = express();
app.use(express.json());




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


// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
