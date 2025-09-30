import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "DBMS Notes"
  description: { type: String },
  fileUrl: { type: String, required: true }, // path of uploaded file
  branch: { type: String, required: true }, // e.g. "Mechanical Engineering"
  year: { type: String, required: true }, // e.g. "2nd Year"
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Material", materialSchema);
