import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  year: { type: Number, required: true },      // 1, 2, 3, 4
  semNumber: { type: Number, required: true }, // 1 or 2
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
}, { timestamps: true });

semesterSchema.index({ year: 1, semNumber: 1, branch: 1 }, { unique: true });

export default mongoose.model("Semester", semesterSchema);
