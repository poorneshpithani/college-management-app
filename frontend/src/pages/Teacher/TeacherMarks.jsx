import { useEffect, useState } from "react";
import { getTeacherSubjects, getStudentsBySubject, uploadMarks } from "../../api/teacherExams.js";

const TeacherMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getTeacherSubjects();
      setSubjects(data);
    } catch (err) {
      setError("❌ Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (id) => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentsBySubject(id);
      setStudents(data.students);
    } catch (err) {
      setError("❌ Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const subject = subjects.find(s => s._id === selectedSubject);
      const marksData = students.map(s => ({
        studentId: s._id,
        marksObtained: Number(marks[s._id]) || 0,
        maxMarks: 100
      }));
      await uploadMarks({ semesterId: subject.semester._id, subjectId: selectedSubject, marks: marksData });
      setSuccess("✅ Marks uploaded successfully");
    } catch (err) {
      setError("❌ Failed to upload marks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">📑 Upload Marks</h3>

      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-2">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-2">{success}</div>}
      {loading && <p className="text-blue-600">⏳ Loading...</p>}

      <select onChange={(e) => { setSelectedSubject(e.target.value); fetchStudents(e.target.value); }} className="border p-2 mb-4 w-full">
        <option value="">Select Subject</option>
        {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
      </select>

      {students.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">
                  <input type="number" onChange={(e) => handleMarksChange(s._id, e.target.value)} className="border p-1 w-20"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {students.length > 0 && (
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
          Save Marks
        </button>
      )}
    </div>
  );
};

export default TeacherMarks;
