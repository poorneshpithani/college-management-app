import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "materials",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

export const uploadCloud = multer({ storage });  // ✅ exported here
