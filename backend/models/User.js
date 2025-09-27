import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },
//   status: { type: String, enum: ["pending", "active"], default: "pending" },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
// });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  status: { type: String, enum: ["pending", "active", "rejected"], default: "pending" },

    // ✅ Add this for students
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // ✅ Extra fields
  branch: { type: String },   // only for students
  year: { type: String },     // only for students
  designation: { type: String }, // only for teachers
}, { timestamps: true });


// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
