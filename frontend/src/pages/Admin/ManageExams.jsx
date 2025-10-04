import { useState, useEffect } from "react";
import { createBranch, createSemester, createSubject, assignSubject,   assignStudentsToSubject } from "../../api/adminExams.js";
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


  // 🔹 Load branches and teachers at start
  useEffect(() => {
    fetchBranches();
    fetchTeachers();
  }, []);

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
      setSubjects([]); // clear previous subjects
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
      const res = await API.get("/admin/teachers/roles"); // we need list of teachers
      // You can replace this with a route `/admin/teachers/all` if you want detailed info
      const teacherList = await API.get("/admin/users?role=teacher");
      setTeachers(teacherList.data || []);
    } catch {
      setError("Failed to load teachers");
    }
  };

  const handleAddBranch = async () => {
    try {
      setLoading(true);
      await createBranch({ name: branchName, code: branchName.slice(0, 3).toUpperCase() });
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
      semesterId: selectedSemester 
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


const handleBranchSelect = async (e) => {
  const branchId = e.target.value;
  setSelectedBranch(branchId);
  if (branchId) {
    await fetchSemesters(branchId);
  }
};

const handleSemesterSelect = async (e) => {
  const semId = e.target.value;
  setSelectedSemester(semId);
  if (semId) {
    await fetchSubjects(semId);
  }
};



  // const handleAddSemester = async () => {
  //   try {
  //     setLoading(true);
  //     await createSemester({ year: Number(year), semNumber: Number(semNumber), branchId: selectedBranch });
  //     setSuccess("✅ Semester created!");
  //     setYear("");
  //     setSemNumber("");
  //     fetchSemesters(selectedBranch);
  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleAddSubject = async () => {
  //   try {
  //     setLoading(true);
  //     await createSubject({
  //       name: subjectName,
  //       code: subjectCode,
  //       branchId: selectedBranch,
  //       semesterId: selectedSemester,
  //     });
  //     setSuccess("✅ Subject created!");
  //     setSubjectName("");
  //     setSubjectCode("");
  //     fetchSubjects(selectedSemester);
  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    <div>
      <h2 className="text-xl font-bold mb-4">⚙️ Manage Exams</h2>

      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-2">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-2">{success}</div>}
      {loading && <p className="text-blue-600">⏳ Processing...</p>}

      {/* 🔹 Add Branch */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">🧩 Add Branch</h3>
        <input
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Branch Name"
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleAddBranch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Branch
        </button>
      </div>

      {/* 🔹 Add Semester */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">📚 Add Semester</h3>
        {/* <select
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

        </select> */}

        <select
  value={selectedBranch}
  onChange={handleBranchSelect}
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
        <button onClick={handleAddSemester} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Semester
        </button>
      </div>

      {/* 🔹 Add Subject */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">📘 Add Subject</h3>
        {/* <select
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
        </select> */}

        <select
  value={selectedSemester}
  onChange={handleSemesterSelect}
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
        <button onClick={handleAddSubject} className="bg-purple-600 text-white px-4 py-2 rounded">
          Add Subject
        </button>
      </div>

      {/* 🔹 Assign Teacher to Subject */}
      <div className="mb-6">
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

      {/* 🔹 Assign Students to Subject */}
<div className="mb-6">
  <h3 className="font-semibold mb-2">🎓 Assign Students to Subject</h3>

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

  <button
    onClick={async () => {
      if (!selectedBranch || !selectedSemester) {
        alert("Select branch and semester first!");
        return;
      }
      // const students = await API.get(`/admin/students/filter?branch=${selectedBranch}&year=${year}`);
      const students = await API.get(`/admin/exams/students/filter?branch=${selectedBranch}&year=${year}`);

      setStudents(students.data);
    }}
    className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
  >
    Load Students
  </button>

  {students.length > 0 && (
    <div className="border p-3 rounded mb-2 max-h-60 overflow-y-auto">
      {students.map((st) => (
        <label key={st._id} className="block">
          <input
            type="checkbox"
            value={st._id}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedStudents((prev) =>
                checked ? [...prev, st._id] : prev.filter((id) => id !== st._id)
              );
            }}
          />{" "}
          {st.name} ({st.email})
        </label>
      ))}
    </div>
  )}

  <button
    onClick={async () => {
      await assignStudentsToSubject(selectedSubject, selectedStudents);
      setSuccess("✅ Students assigned to subject!");
    }}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Assign Students
  </button>
</div>

    </div>
  );
};

export default ManageExams;
