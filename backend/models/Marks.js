import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },

  examType: {
    type: String,
    enum: ["Mid-1", "Mid-2", "Internal", "External"], // ✅ Updated exam types
    required: true,
  },

  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },

  result: { type: String }, // ✅ "Pass" or "Fail"
}, { timestamps: true });

// ✅ Automatically calculate pass/fail before saving
marksSchema.pre("save", function (next) {
  if (this.marksObtained && this.maxMarks) {
    const percentage = (this.marksObtained / this.maxMarks) * 100;
    this.result = percentage >= 35 ? "Pass" : "Fail";
  }
  next();
});

export default mongoose.model("Marks", marksSchema);
