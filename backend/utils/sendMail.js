// utils/sendMail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


/**
 * Send email to one or multiple recipients
 */
const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"College Management App" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html,
    });
    console.log("📩 Email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending mail:", err);
  }
};

export default sendMail;
