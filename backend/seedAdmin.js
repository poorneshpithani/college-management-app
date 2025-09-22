import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@collegeapp.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@collegeapp.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("✅ Admin created:", admin);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
