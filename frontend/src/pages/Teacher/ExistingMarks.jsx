import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";

const ExistingMarks = ({ subjectId }) => {
  const [marksList, setMarksList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subjectId) fetchMarks();
  }, [subjectId]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/teacher/exams/marks/${subjectId}`);
      setMarksList(res.data);
    } catch (err) {
      console.error("❌ Failed to load marks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setEditData({
      marksObtained: record.marksObtained,
      maxMarks: record.maxMarks,
      examType: record.examType || "Mid",
    });
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
    try {
      setSaving(true);
      await API.put(`/teacher/exams/marks/${id}`, editData);
      alert("✅ Marks updated successfully!");
      setEditingId(null);
      fetchMarks();
    } catch (err) {
      alert("❌ Failed to update marks");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this record?")) return;
    try {
      await API.delete(`/teacher/exams/marks/${id}`);
      setMarksList((prev) => prev.filter((m) => m._id !== id));
      alert("✅ Record deleted");
    } catch (err) {
      alert("❌ Failed to delete record");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">📋 Existing Marks</h3>

      {loading ? (
        <p className="text-gray-500">Loading marks...</p>
      ) : marksList.length === 0 ? (
        <p className="text-gray-500">No marks found for this subject.</p>
      ) : (
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Exam Type</th>
              <th className="p-2 border">Marks</th>
              <th className="p-2 border">Max</th>
              <th className="p-2 border">Grade</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marksList.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50 transition-colors border-b">
                <td className="border p-2 font-medium">{m.student?.name}</td>

                {/* Exam Type */}
                <td className="border p-2">
                  {editingId === m._id ? (
                    <select
                      value={editData.examType}
                      onChange={(e) => handleChange("examType", e.target.value)}
                      className="border rounded p-1 text-sm w-full focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Mid">Mid</option>
                      <option value="Internal">Internal</option>
                      <option value="External">External</option>
                    </select>
                  ) : (
                    m.examType
                  )}
                </td>

                {/* Marks Obtained */}
                <td className="border p-2">
                  {editingId === m._id ? (
                    <input
                      type="number"
                      value={editData.marksObtained}
                      onChange={(e) =>
                        handleChange("marksObtained", e.target.value)
                      }
                      className="border rounded p-1 text-center w-16 focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    m.marksObtained
                  )}
                </td>

                {/* Max Marks */}
                <td className="border p-2">
                  {editingId === m._id ? (
                    <input
                      type="number"
                      value={editData.maxMarks}
                      onChange={(e) => handleChange("maxMarks", e.target.value)}
                      className="border rounded p-1 text-center w-16 focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    m.maxMarks
                  )}
                </td>

                {/* Grade */}
                <td
                  className={`border p-2 font-semibold ${
                    m.grade === "F" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {m.grade}
                </td>

                {/* Actions */}
                <td className="border p-2 space-x-2">
                  {editingId === m._id ? (
                    <>
                      <button
                        onClick={() => handleSave(m._id)}
                        disabled={saving}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExistingMarks;
