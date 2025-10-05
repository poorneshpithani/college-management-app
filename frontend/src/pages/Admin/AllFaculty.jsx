import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

const AllFaculty = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  // 🔹 Load teachers & dynamic designations
  useEffect(() => {
    fetchTeachers();
    fetchDesignations();
  }, []);

  // ✅ Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/users?role=teacher");
      setTeachers(res.data);
      setFilteredTeachers(res.data);
    } catch (err) {
      console.error("❌ Failed to load faculty:", err);
    }
  };

  // ✅ Fetch all unique designations (from backend)
  const fetchDesignations = async () => {
    try {
      const res = await API.get("/admin/teachers/roles");
      setDesignations(res.data);
    } catch (err) {
      console.error("❌ Failed to load designations:", err);
    }
  };

  // ✅ Apply filters whenever state changes
  useEffect(() => {
    let results = teachers;

    if (designation) {
      results = results.filter(
        (t) => t.designation?.toLowerCase() === designation.toLowerCase()
      );
    }

    if (status) {
      results = results.filter(
        (t) => t.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(keyword) ||
          t.email.toLowerCase().includes(keyword)
      );
    }

    setFilteredTeachers(results);
  }, [search, designation, status, teachers]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back to Dashboard */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-green-700 mb-6">👨‍🏫 All Faculty</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 mb-4 rounded shadow flex flex-wrap gap-4 items-center">
        {/* Search Field */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        {/* Dynamic Designation Dropdown */}
        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Designations</option>
          {designations.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Reset Filters Button */}
        <button
          onClick={() => {
            setSearch("");
            setDesignation("");
            setStatus("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Faculty Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {filteredTeachers.length === 0 ? (
          <p className="text-gray-500 text-center">No faculty found.</p>
        ) : (
          <table className="min-w-full text-center border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Designation</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">{t.email}</td>
                  <td className="border p-2">{t.designation || "—"}</td>
                  <td
                    className={`border p-2 capitalize font-semibold ${
                      t.status === "active"
                        ? "text-green-600"
                        : t.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllFaculty;
