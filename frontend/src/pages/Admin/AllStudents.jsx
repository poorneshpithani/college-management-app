import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await API.get("/admin/exams/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("Failed to load branches", err);
    }
  };

  const fetchStudents = async (branch = "", year = "") => {
    try {
      let url = "/admin/exams/students/filter?";
      if (branch) url += `branch=${branch}&`;
      if (year) url += `year=${year}`;
      const res = await API.get(url);
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/admin")}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-6">🎓 All Students</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Years</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={y}>
              Year {y}
            </option>
          ))}
        </select>

        <button
          onClick={() => fetchStudents(selectedBranch, selectedYear)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {students.length === 0 ? (
          <p className="text-gray-500 text-center">No students found.</p>
        ) : (
          <table className="min-w-full text-center border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Branch</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.branch?.name || "—"}</td>
                  <td className="border p-2">{s.year}</td>
                  <td className="border p-2 capitalize">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllStudents;
