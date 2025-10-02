import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },   // "CSE"
  code: { type: String, required: true },   // "CSE101"
}, { timestamps: true });

export default mongoose.model("Branch", branchSchema);
