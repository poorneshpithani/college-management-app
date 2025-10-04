import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance.js";
import Navbar from "../components/Navbar.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    branch: "",
    semester: "", // ✅ new
    year: "",
    designation: "",
  });

  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Load branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await API.get("/admin/exams/public/branches");
        setBranches(res.data);
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    };
    fetchBranches();
  }, []);

  // ✅ Fetch semesters when branch changes
  const handleBranchSelect = async (branchId) => {
    setFormData({ ...formData, branch: branchId, semester: "", year: "" });
    if (!branchId) {
      setSemesters([]);
      return;
    }
    try {
      const res = await API.get(`/admin/exams/public/semesters/${branchId}`);
      setSemesters(res.data);
    } catch (err) {
      console.error("Failed to load semesters:", err);
    }
  };

  // ✅ Auto-fill year when semester selected
  const handleSemesterSelect = (semId) => {
    const selectedSem = semesters.find((s) => s._id === semId);
    if (selectedSem) {
      setFormData({
        ...formData,
        semester: semId,
        year: selectedSem.year,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/auth/register", formData);
      setMessage(res.data.message || "Registered successfully! Wait for admin approval.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Register
          </h2>

          {message && (
            <div className="mb-4 p-3 rounded text-white text-center bg-blue-500">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            {/* Student fields */}
            {formData.role === "student" && (
              <>
                {/* Branch */}
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={(e) => handleBranchSelect(e.target.value)}
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                {/* Semester */}
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={(e) => handleSemesterSelect(e.target.value)}
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Year & Semester</option>
                  {semesters.map((s) => (
                    <option key={s._id} value={s._id}>
                      Year {s.year} - Sem {s.semNumber}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Teacher fields */}
            {formData.role === "teacher" && (
              <input
                type="text"
                name="designation"
                placeholder="Teacher Role (e.g. Professor, Assistant Prof.)"
                value={formData.designation}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
