import { useState } from "react";
import { createBranch, createSemester, createSubject, assignSubject } from "../../api/adminExams.js";

const ManageExams = () => {
  const [branchName, setBranchName] = useState("");
  const [semNumber, setSemNumber] = useState("");
  const [year, setYear] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAction = async (action, payload, successMsg) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await action(payload);
      setSuccess(successMsg);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">⚙️ Manage Exams</h2>

      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-2">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-2">{success}</div>}
      {loading && <p className="text-blue-600 mb-2">⏳ Processing...</p>}

      {/* Add Branch */}
      <div className="mb-4">
        <input value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="Branch Name" className="border p-2 w-full mb-2"/>
        <button 
          onClick={() => handleAction(createBranch, { name: branchName, code: branchName.slice(0,3).toUpperCase() }, "✅ Branch created!")} 
          className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Branch
        </button>
      </div>

      {/* Add Semester */}
      <div className="mb-4">
        <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className="border p-2 w-full mb-2"/>
        <input value={semNumber} onChange={(e) => setSemNumber(e.target.value)} placeholder="Semester Number" className="border p-2 w-full mb-2"/>
        <button 
          onClick={() => handleAction(createSemester, { year, semNumber, branchId: "BRANCH_ID" }, "✅ Semester created!")} 
          className="bg-green-600 text-white px-4 py-2 rounded">
          Add Semester
        </button>
      </div>

      {/* Add Subject */}
      <div className="mb-4">
        <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Subject Name" className="border p-2 w-full mb-2"/>
        <input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="Subject Code" className="border p-2 w-full mb-2"/>
        <button 
          onClick={() => handleAction(createSubject, { name: subjectName, code: subjectCode, branchId: "BRANCH_ID", semesterId: "SEM_ID" }, "✅ Subject created!")} 
          className="bg-purple-600 text-white px-4 py-2 rounded">
          Add Subject
        </button>
      </div>
    </div>
  );
};

export default ManageExams;
