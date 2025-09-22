import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true }, // ✅ change description → message
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);
export default News;
