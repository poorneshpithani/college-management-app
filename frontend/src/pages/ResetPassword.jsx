// frontend/src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState(""); // for resending

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
      });
      setMessage("✅ Password reset successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Reset failed");
    }
  };

  const handleResend = async () => {
    try {
      if (!email) return setMessage("❌ Please enter your email.");
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      setMessage("✅ A new reset link has been sent to your email.");
      setExpired(false);
      setTimeLeft(15 * 60); // reset timer
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to resend link");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      {!expired ? (
        <>
          <p className="mb-4 text-gray-600">
            ⏳ This link is valid for: <strong>{formatTime(timeLeft)}</strong>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded"
            >
              Reset Password
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-red-500 font-semibold">
            ❌ This link has expired.
          </p>
          <input
            type="email"
            placeholder="Enter your email to resend link"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleResend}
            className="bg-blue-600 text-white p-2 rounded w-full"
          >
            Resend Reset Link
          </button>
        </div>
      )}

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
