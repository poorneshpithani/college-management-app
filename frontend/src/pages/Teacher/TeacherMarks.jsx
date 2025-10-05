import { useEffect, useState } from "react";
import {
  getTeacherSubjects,
  getStudentsBySubject,
  uploadMarks,
} from "../../api/teacherExams.js";
import ExistingMarks from "./ExistingMarks.jsx";

const TeacherMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [examType, setExamType] = useState("Mid");
  const [maxMarks, setMaxMarks] = useState(100);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getTeacherSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("❌ Error fetching subjects:", err);
      setError("Failed to load subjects");
    }
  };

  const fetchStudents = async (id) => {
    try {
      setLoading(true);
      const data = await getStudentsBySubject(id);
      setStudents(data.students);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !examType) {
      setError("Please select subject and exam type");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const subject = subjects.find((s) => s._id === selectedSubject);
      const marksData = students.map((s) => ({
        studentId: s._id,
        marksObtained: Number(marks[s._id]) || 0,
        maxMarks: Number(maxMarks),
        year: s.year,
      }));

      await uploadMarks({
        semesterId: subject.semester._id,
        subjectId: selectedSubject,
        examType,
        marks: marksData,
      });

      setSuccess("✅ Marks uploaded successfully!");
      setMarks({});
    } catch (err) {
      setError("❌ Failed to upload marks");
    } finally {
      setLoading(false);
    }
  };

const getResult = (mark) => {
  const percentage = (mark / maxMarks) * 100;
  return percentage >= 35 ? "Pass" : "Fail";
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        📑 Manage Marks
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-2">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-600 p-2 rounded mb-2">
          {success}
        </div>
      )}

      {/* Top Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            fetchStudents(e.target.value);
          }}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>

        <select
  value={examType}
  onChange={(e) => setExamType(e.target.value)}
  className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
>
  <option value="Mid-1">Mid-1</option>
  <option value="Mid-2">Mid-2</option>
  <option value="Internal">Internal</option>
  <option value="External">External</option>
</select>


        <input
          type="number"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
          placeholder="Max Marks"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Students Table */}
      {students.length > 0 && (
        <div className="overflow-x-auto rounded border mt-4">
          <table className="min-w-full border text-center text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Marks</th>
                <th className="border p-2">%</th>
                <th className="border p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">{s.year}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={marks[s._id] || ""}
                      onChange={(e) =>
                        handleMarksChange(s._id, e.target.value)
                      }
                      className="border p-1 rounded text-center w-20 focus:ring-2 focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-2 border text-gray-700">
                    {marks[s._id]
                      ? ((marks[s._id] / maxMarks) * 100).toFixed(2)
                      : "-"}
                  </td>
                  <td
                    className={`p-2 border font-semibold ${
                      marks[s._id]
                        ? getGrade(marks[s._id]) === "F"
                          ? "text-red-600"
                          : "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {marks[s._id] ? getGrade(marks[s._id]) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded mt-4 hover:bg-blue-700 transition-all w-full md:w-auto"
        >
          {loading ? "Saving..." : "💾 Save Marks"}
        </button>
      )}

      {/* Empty State */}
      {!students.length && (
        <p className="text-gray-500 text-center mt-4">
          Select a subject to view students.
        </p>
      )}

      {/* ✅ Existing Marks Table */}
{selectedSubject && (
  <ExistingMarks subjectId={selectedSubject} />
)}


    </div>
  );
};

export default TeacherMarks;
