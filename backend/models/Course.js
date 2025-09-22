
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // optional, e.g., MATH101
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // assigned teacher
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // enrolled students
});

export default mongoose.model("Course", courseSchema);
