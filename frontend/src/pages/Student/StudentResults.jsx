import { useState } from "react";
import { getStudentResults } from "../../api/studentExams.js";

const StudentResults = () => {
  const [semesterId, setSemesterId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchResults = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentResults(semesterId);
      setResults(data);
    } catch (err) {
      setError("❌ Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">📊 My Results</h3>

      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-2">{error}</div>}
      {loading && <p className="text-blue-600">⏳ Loading...</p>}

      <select onChange={(e) => setSemesterId(e.target.value)} className="border p-2 mb-2 w-full">
        <option value="">Select Semester</option>
        {/* Replace with actual semesters */}
        <option value="SEM1_ID">Semester 1</option>
        <option value="SEM2_ID">Semester 2</option>
      </select>
      <button onClick={handleFetchResults} className="bg-blue-600 text-white px-3 py-1 rounded w-full">
        View Results
      </button>

      {results && (
        <div className="mt-4">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Marks</th>
                <th className="p-2 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.results.map(r => (
                <tr key={r.subjectCode}>
                  <td className="p-2 border">{r.subjectName}</td>
                  <td className="p-2 border">{r.marksObtained}/{r.maxMarks}</td>
                  <td className="p-2 border font-semibold">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-lg font-bold">GPA: {results.gpa}</div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
