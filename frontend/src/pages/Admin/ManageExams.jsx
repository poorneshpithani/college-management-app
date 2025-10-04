import { useState, useEffect } from "react";
import {
  createBranch,
  createSemester,
  createSubject,
  assignSubject,
  assignStudentsToSubject,
} from "../../api/adminExams.js";
import API from "../../api/axiosInstance.js";

const ManageExams = () => {
  const [branchName, setBranchName] = useState("");
  const [semNumber, setSemNumber] = useState("");
  const [year, setYear] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // ✅ Persistent active tab using localStorage
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeExamTab") || "branch"
  );

  useEffect(() => {
    fetchBranches();
    fetchTeachers();
  }, []);

  // ✅ Save current tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeExamTab", activeTab);
  }, [activeTab]);

  const fetchBranches = async () => {
    try {
      const res = await API.get("/admin/exams/branches");
      setBranches(res.data);
    } catch {
      setError("Failed to load branches");
    }
  };

  const fetchSemesters = async (branchId) => {
    try {
      const res = await API.get(`/admin/exams/semesters/${branchId}`);
      setSemesters(res.data);
      setSubjects([]);
    } catch {
      setError("Failed to load semesters");
    }
  };

  const fetchSubjects = async (semesterId) => {
    try {
      const res = await API.get(`/admin/exams/subjects/${semesterId}`);
      setSubjects(res.data);
    } catch {
      setError("Failed to load subjects");
    }
  };

  const fetchTeachers = async () => {
    try {
      const teacherList = await API.get("/admin/users?role=teacher");
      setTeachers(teacherList.data || []);
    } catch {
      setError("Failed to load teachers");
    }
  };

  const handleAddBranch = async () => {
    try {
      setLoading(true);
      await createBranch({
        name: branchName,
        code: branchName.slice(0, 3).toUpperCase(),
      });
      setSuccess("✅ Branch created!");
      setBranchName("");
      fetchBranches();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSemester = async () => {
    try {
      setLoading(true);
      await createSemester({ year, semNumber, branchId: selectedBranch });
      setSuccess("✅ Semester created!");
      setYear("");
      setSemNumber("");
      fetchSemesters(selectedBranch);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    try {
      setLoading(true);
      await createSubject({
        name: subjectName,
        code: subjectCode,
        branchId: selectedBranch,
        semesterId: selectedSemester,
      });
      setSuccess("✅ Subject created!");
      setSubjectName("");
      setSubjectCode("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async () => {
    try {
      setLoading(true);
      await assignSubject(selectedSubject, selectedTeacher);
      setSuccess("✅ Teacher assigned successfully!");
      setSelectedSubject("");
      setSelectedTeacher("");
      fetchSubjects(selectedSemester);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">⚙️ Academic Management</h2>

      {/* ✅ Alerts */}
      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-2">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-2">{success}</div>}
      {loading && <p className="text-blue-600">⏳ Processing...</p>}

      {/* 🔹 Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        {[
          { key: "branch", label: "Add Branch" },
          { key: "semester", label: "Add Semester" },
          { key: "subject", label: "Add Subject" },
          { key: "teacher", label: "Assign Subject to Teacher" },
          { key: "students", label: "Assign Students to Subject" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ Tab Content */}
      <div className="space-y-6">
        {/* 🧩 Add Branch */}
        {activeTab === "branch" && (
          <div>
            <h3 className="font-semibold mb-2">🧩 Add Branch</h3>
            <input
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Branch Name"
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleAddBranch}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Branch
            </button>
          </div>
        )}

        {/* 📚 Add Semester */}
        {activeTab === "semester" && (
          <div>
            <h3 className="font-semibold mb-2">📚 Add Semester</h3>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                fetchSemesters(e.target.value);
              }}
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
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              className="border p-2 w-full mb-2"
            />
            <input
              value={semNumber}
              onChange={(e) => setSemNumber(e.target.value)}
              placeholder="Semester Number"
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleAddSemester}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Semester
            </button>
          </div>
        )}

        {/* 📘 Add Subject */}
        {activeTab === "subject" && (
          <div>
            <h3 className="font-semibold mb-2">📘 Add Subject</h3>

            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                fetchSemesters(e.target.value);
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                fetchSubjects(e.target.value);
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s._id} value={s._id}>
                  Year {s.year} - Sem {s.semNumber}
                </option>
              ))}
            </select>

            <input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Subject Name"
              className="border p-2 w-full mb-2"
            />
            <input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="Subject Code"
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleAddSubject}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add Subject
            </button>
          </div>
        )}

        {/* 👩‍🏫 Assign Subject to Teacher */}
        {/* {activeTab === "teacher" && (
          <div>
            <h3 className="font-semibold mb-2">👩‍🏫 Assign Subject to Teacher</h3>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>

            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignTeacher}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              Assign Teacher
            </button>
          </div>
        )} */}

        {/* 👩‍🏫 Assign Subject to Teacher */}
{activeTab === "teacher" && (
  <div>
    <h3 className="font-semibold mb-2">👩‍🏫 Assign Subject to Teacher</h3>

    {/* 🔹 Select Branch */}
    <select
      value={selectedBranch}
      onChange={async (e) => {
        const branchId = e.target.value;
        setSelectedBranch(branchId);
        setSelectedSemester("");
        setSelectedSubject("");
        setSemesters([]);
        setSubjects([]);
        if (branchId) {
          await fetchSemesters(branchId);
        }
      }}
      className="border p-2 w-full mb-3 rounded"
    >
      <option value="">Select Branch</option>
      {branches.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
        </option>
      ))}
    </select>

    {/* 🔹 Select Semester */}
    <select
      value={selectedSemester}
      onChange={async (e) => {
        const semId = e.target.value;
        setSelectedSemester(semId);
        setSelectedSubject("");
        if (semId) {
          await fetchSubjects(semId);
        }
      }}
      className="border p-2 w-full mb-3 rounded"
      disabled={!selectedBranch}
    >
      <option value="">Select Semester</option>
      {semesters.map((s) => (
        <option key={s._id} value={s._id}>
          Year {s.year} - Sem {s.semNumber}
        </option>
      ))}
    </select>

    {/* 🔹 Select Subject */}
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="border p-2 w-full mb-3 rounded"
      disabled={!selectedSemester}
    >
      <option value="">Select Subject</option>
      {subjects.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name} ({s.code})
        </option>
      ))}
    </select>

    {/* 🔹 Select Teacher */}
    <select
      value={selectedTeacher}
      onChange={(e) => setSelectedTeacher(e.target.value)}
      className="border p-2 w-full mb-3 rounded"
    >
      <option value="">Select Teacher</option>
      {teachers.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name} ({t.email})
        </option>
      ))}
    </select>

    <button
      onClick={handleAssignTeacher}
      className="bg-orange-600 text-white px-4 py-2 rounded shadow hover:bg-orange-700"
      disabled={!selectedSubject || !selectedTeacher}
    >
      Assign Teacher
    </button>
  </div>
)}


        {/* 🎓 Assign Students */}
        {activeTab === "students" && (
          // <div>
          //   <h3 className="font-semibold mb-2">🎓 Assign Students to Subject</h3>

          //   <select
          //     value={selectedSubject}
          //     onChange={(e) => setSelectedSubject(e.target.value)}
          //     className="border p-2 w-full mb-2"
          //   >
          //     <option value="">Select Subject</option>
          //     {subjects.map((s) => (
          //       <option key={s._id} value={s._id}>
          //         {s.name} ({s.code})
          //       </option>
          //     ))}
          //   </select>

          //   <button
          //     onClick={async () => {
          //       if (!selectedBranch || !selectedSemester) {
          //         alert("Select branch and semester first!");
          //         return;
          //       }
          //       const students = await API.get(
          //         `/admin/exams/students/filter?branch=${selectedBranch}&year=${year}`
          //       );
          //       setStudents(students.data);
          //     }}
          //     className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          //   >
          //     Load Students
          //   </button>

          //   {students.length > 0 && (
          //     <div className="border p-3 rounded mb-2 max-h-60 overflow-y-auto">
          //       {students.map((st) => (
          //         <label key={st._id} className="block">
          //           <input
          //             type="checkbox"
          //             value={st._id}
          //             onChange={(e) => {
          //               const checked = e.target.checked;
          //               setSelectedStudents((prev) =>
          //                 checked
          //                   ? [...prev, st._id]
          //                   : prev.filter((id) => id !== st._id)
          //               );
          //             }}
          //           />{" "}
          //           {st.name} ({st.email})
          //         </label>
          //       ))}
          //     </div>
          //   )}

          //   <button
          //     onClick={async () => {
          //       await assignStudentsToSubject(selectedSubject, selectedStudents);
          //       setSuccess("✅ Students assigned to subject!");
          //     }}
          //     className="bg-green-600 text-white px-4 py-2 rounded"
          //   >
          //     Assign Students
          //   </button>
          // </div>

          <div>
            {/* 🔹 Assign Students to Subject */}
<div className="mb-6">
  <h3 className="font-semibold mb-3 text-lg border-b pb-2">
    🎓 Assign Students to Subject
  </h3>

  {/* 1️⃣ Select Branch */}
  <div className="mb-3">
    <label className="block text-gray-700 mb-1 font-medium">Select Branch</label>
    <select
      value={selectedBranch}
      onChange={async (e) => {
        const branchId = e.target.value;
        setSelectedBranch(branchId);
        setSelectedSemester("");
        setSelectedSubject("");
        setStudents([]);
        if (branchId) {
          await fetchSemesters(branchId);
        }
      }}
      className="border p-2 w-full rounded"
    >
      <option value="">Select Branch</option>
      {branches.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
        </option>
      ))}
    </select>
  </div>

  {/* 2️⃣ Select Year */}
  <div className="mb-3">
    <label className="block text-gray-700 mb-1 font-medium">Select Year</label>
    <select
      value={year}
      onChange={(e) => setYear(e.target.value)}
      className="border p-2 w-full rounded"
    >
      <option value="">Select Year</option>
      {[1, 2, 3, 4].map((y) => (
        <option key={y} value={y}>
          Year {y}
        </option>
      ))}
    </select>
  </div>

  {/* 3️⃣ Select Semester */}
  <div className="mb-3">
    <label className="block text-gray-700 mb-1 font-medium">Select Semester</label>
    <select
      value={selectedSemester}
      onChange={async (e) => {
        const semId = e.target.value;
        setSelectedSemester(semId);
        setSelectedSubject("");
        setStudents([]);
        if (semId) {
          await fetchSubjects(semId);
        }
      }}
      className="border p-2 w-full rounded"
      disabled={!selectedBranch}
    >
      <option value="">Select Semester</option>
      {semesters.map((s) => (
        <option key={s._id} value={s._id}>
          Year {s.year} - Sem {s.semNumber}
        </option>
      ))}
    </select>
  </div>

  {/* 4️⃣ Select Subject */}
  <div className="mb-3">
    <label className="block text-gray-700 mb-1 font-medium">Select Subject</label>
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="border p-2 w-full rounded"
      disabled={!selectedSemester}
    >
      <option value="">Select Subject</option>
      {subjects.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name} ({s.code})
        </option>
      ))}
    </select>
  </div>

  {/* 5️⃣ Load Students Button */}
  <button
    onClick={async () => {
      if (!selectedBranch || !year) {
        alert("Please select Branch and Year first.");
        return;
      }
      try {
        const res = await API.get(
          `/admin/exams/students/filter?branch=${selectedBranch}&year=${year}`
        );
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded mb-3"
  >
    📥 Load Students
  </button>

  {/* 6️⃣ Display Students with checkboxes */}
  {students.length > 0 && (
    <div className="border p-3 rounded mb-3 max-h-60 overflow-y-auto bg-gray-50">
      {students.map((st) => (
        <label key={st._id} className="block text-gray-700">
          <input
            type="checkbox"
            value={st._id}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedStudents((prev) =>
                checked
                  ? [...prev, st._id]
                  : prev.filter((id) => id !== st._id)
              );
            }}
          />{" "}
          {st.name} ({st.email})
        </label>
      ))}
    </div>
  )}

  {/* 7️⃣ Assign Students */}
  <button
    onClick={async () => {
      if (!selectedSubject || selectedStudents.length === 0) {
        alert("Select a subject and at least one student!");
        return;
      }
      try {
        await assignStudentsToSubject(selectedSubject, selectedStudents);
        setSuccess("✅ Students assigned successfully!");
        setSelectedStudents([]);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to assign students");
      }
    }}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    ✅ Assign Students
  </button>
</div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ManageExams;
