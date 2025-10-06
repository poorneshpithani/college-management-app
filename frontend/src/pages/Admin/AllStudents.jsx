import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
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

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      branch: student.branch?._id || "",
      year: student.year,
      status: student.status,
    });
  };

  const handleSave = async () => {
    try {
      await API.put(`/admin/users/${editingStudent._id}`, editForm);
      setEditingStudent(null);
      fetchStudents(selectedBranch, selectedYear);
    } catch (err) {
      console.error("Failed to update student", err);
      alert("❌ Failed to update student");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchStudents(selectedBranch, selectedYear);
      } catch (err) {
        console.error("Failed to delete student", err);
        alert("❌ Failed to delete student");
      }
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
          {[1, 2, 3].map((y) => (
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
                {/* <th className="border p-2">Branch</th> */}
                <th className="border p-2">Year</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.email}</td>
                  {/* <td className="border p-2">{s.branch?.name || "—"}</td> */}
                  <td className="border p-2">{s.year}</td>
                  {/* <td className="border p-2 capitalize">{s.status}</td> */}
                  <td
  className={`border p-2 capitalize font-semibold ${
    s.status === "active"
      ? "text-green-600"
      : s.status === "pending"
      ? "text-yellow-600"
      : "text-red-600"
  }`}
>
  {s.status || "—"}
</td>

                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id, s.name)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>

            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Name"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />

            <input
              type="email"
              className="border p-2 w-full mb-2"
              placeholder="Email"
              value={editForm.email || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />

            <select
              value={editForm.branch || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, branch: e.target.value })
              }
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Year"
              value={editForm.year || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, year: e.target.value })
              }
            />

            <select
              value={editForm.status || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
              className="border p-2 w-full mb-4"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingStudent(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudents;
