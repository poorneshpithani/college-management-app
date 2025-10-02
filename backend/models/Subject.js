import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },    // "Mathematics"
  code: { type: String, required: true },    // "MATH101"
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // teacher (User with role=teacher)
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);
