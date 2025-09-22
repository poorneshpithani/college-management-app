import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // NEW
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now }, // default today
  status: { type: String, enum: ["Present", "Absent"], required: true }
}, { timestamps: true });


const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
