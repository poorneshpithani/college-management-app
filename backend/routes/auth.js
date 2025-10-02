// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
};


// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role, branch, year, designation } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      branch: role === "student" ? branch : undefined,
      year: role === "student" ? year : undefined,
      designation: role === "teacher" ? designation : undefined,
    });

    await newUser.save();

    res.status(201).json({ message: "Registered successfully, wait for admin approval" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Login
// 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 /api/auth/login called - body:", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔑 Stored password hash:", user.password);

    const isMatch = await user.matchPassword(password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    const token = generateToken(user._id, user.role);
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error("💥 Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password
// Forgot Password
// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 🔥 Log the URL for debugging
    console.log(`🔗 Password reset link for ${user.email}: ${resetUrl}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    await transporter.sendMail({
      from: `"College Management App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request (New Link)",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #2c3e50;">New Password Reset Link</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>You requested a <strong>new password reset link</strong>. 
          Your previous link is now invalid. Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; margin: 20px 0; padding: 12px 20px; 
                    background-color: #3498db; color: #fff; text-decoration: none; 
                    border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
          <p>If the button doesn’t work, copy and paste this link:</p>
          <p style="color: #555;">${resetUrl}</p>
          <hr />
          <p style="font-size: 12px; color: #888;">
            If you didn’t request this, you can ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ message: "✅ New reset link sent to your email" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: err.message });
  }
});


// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password; // pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "✅ Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ message: err.message });
  }
});



export default router;
