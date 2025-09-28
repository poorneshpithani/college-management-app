import mongoose from "mongoose";

const attendanceSummarySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true },   // e.g. "January"
  year: { type: Number, required: true },
  totalDays: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  absentDays: { type: Number, required: true },
  percentage: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("AttendanceSummary", attendanceSummarySchema);
