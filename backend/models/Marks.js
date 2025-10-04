import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  examType: {
    type: String,
    enum: ["internal", "mid", "external", "total"],
    required: true
  },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  grade: { type: String }
}, { timestamps: true });

// ✅ Automatically calculate percentage and grade before saving
marksSchema.pre("save", function (next) {
  if (this.marksObtained && this.maxMarks) {
    this.percentage = (this.marksObtained / this.maxMarks) * 100;

    // Grade logic
    if (this.percentage >= 90) this.grade = "A+";
    else if (this.percentage >= 80) this.grade = "A";
    else if (this.percentage >= 70) this.grade = "B";
    else if (this.percentage >= 60) this.grade = "C";
    else if (this.percentage >= 50) this.grade = "D";
    else this.grade = "F";
  }
  next();
});

export default mongoose.model("Marks", marksSchema);
