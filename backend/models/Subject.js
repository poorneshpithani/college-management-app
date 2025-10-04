import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ NEW FIELD
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);
