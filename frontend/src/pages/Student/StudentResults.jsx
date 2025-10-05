import { useEffect, useState } from "react";
import { getStudentMarks } from "../../api/student.js";

const StudentResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await getStudentMarks();
      setResults(res);
    } catch (err) {
      console.error("❌ Failed to fetch student results:", err);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">📚 Exam Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No marks uploaded yet</p>
      ) : (
        <table className="w-full border text-center text-sm">
         <thead className="bg-gray-100 text-gray-700">
  <tr>
    <th className="p-2 border">Subject</th>
    <th className="p-2 border">Exam Type</th>
    <th className="p-2 border">Marks</th>
    <th className="p-2 border">Max</th>
    <th className="p-2 border">%</th>
    <th className="p-2 border">Result</th>
  </tr>
</thead>
<tbody>
  {results.map((r) => {
    const percentage = ((r.marksObtained / r.maxMarks) * 100).toFixed(2);
    const result = percentage >= 35 ? "Pass" : "Fail";

    return (
      <tr key={r._id} className="hover:bg-gray-50">
        <td className="p-2 border">{r.subject?.name || "-"}</td>
        <td className="p-2 border">{r.examType}</td>
        <td className="p-2 border">{r.marksObtained}</td>
        <td className="p-2 border">{r.maxMarks}</td>
        <td className="p-2 border">{percentage}%</td>
        <td
          className={`p-2 border font-semibold ${
            result === "Fail" ? "text-red-600" : "text-green-600"
          }`}
        >
          {result}
        </td>
      </tr>
    );
  })}
</tbody>

  
        </table>
      )}
    </div>
  );
};

export default StudentResults;
