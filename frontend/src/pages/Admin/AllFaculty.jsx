import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

const AllFaculty = () => {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/users?role=teacher");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to load faculty", err);
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

      <h1 className="text-2xl font-bold text-green-700 mb-6">👨‍🏫 All Faculty</h1>

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {teachers.length === 0 ? (
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
              {teachers.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">{t.email}</td>
                  <td className="border p-2">{t.designation || "—"}</td>
                  <td className="border p-2 capitalize">{t.status}</td>
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
