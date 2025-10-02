import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // student user
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  grade: { type: String }
}, { timestamps: true });

marksSchema.index({ student: 1, subject: 1, semester: 1 }, { unique: true });

export default mongoose.model("Marks", marksSchema);
