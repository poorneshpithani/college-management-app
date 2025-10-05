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
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editForm, setEditForm] = useState({});

  const navigate = useNavigate();

  // 🔹 Load teachers & dynamic designations
  useEffect(() => {
    fetchTeachers();
    fetchDesignations();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/users?role=teacher");
      setTeachers(res.data);
      setFilteredTeachers(res.data);
    } catch (err) {
      console.error("❌ Failed to load faculty:", err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await API.get("/admin/teachers/roles");
      setDesignations(res.data);
    } catch (err) {
      console.error("❌ Failed to load designations:", err);
    }
  };

  // 🔸 Filtering
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

  // 📝 Edit
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setEditForm({
      name: teacher.name,
      email: teacher.email,
      designation: teacher.designation || "",
      status: teacher.status,
    });
  };

  const handleSave = async () => {
    try {
      await API.put(`/admin/users/${editingTeacher._id}`, editForm);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      console.error("❌ Failed to update teacher:", err);
      alert("Failed to update teacher");
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchTeachers();
      } catch (err) {
        console.error("❌ Failed to delete teacher:", err);
        alert("Failed to delete teacher");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-green-700 mb-6">👨‍🏫 All Faculty</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 mb-4 rounded shadow flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

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
                <th className="border p-2">Actions</th>
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
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id, t.name)}
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

      {/* ✏️ Edit Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Faculty</h2>

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

            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Designation"
              value={editForm.designation || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, designation: e.target.value })
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
                onClick={() => setEditingTeacher(null)}
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

export default AllFaculty;
