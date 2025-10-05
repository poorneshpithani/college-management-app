import { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getTeacherNews,
  getTeacherProfile,
  getAttendanceSummary,
  saveAttendanceSummary,
  getAllStudents,
  deleteAttendanceSummary,
  updateAttendanceSummary,
} from "../../api/teacher.js";
import Navbar from "../../components/Navbar.jsx";
import UploadMaterial from "./UploadMaterial.jsx";

import TeacherMarks from "./TeacherMarks.jsx";


const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear()); // default current year

  const [totalDays, setTotalDays] = useState("");
  const [presentDays, setPresentDays] = useState("");
  const [records, setRecords] = useState([]);

  const [students, setStudents] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [percentage, setPercentage] = useState(0);




  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 10 }, (_, i) => 2022 + i); 



  useEffect(() => {
    fetchTeacherData();
    fetchStudents();
  }, []);

  useEffect(() => {
  if (totalDays && presentDays) {
    const percent = ((presentDays / totalDays) * 100).toFixed(2);
    setPercentage(percent);
  } else {
    setPercentage(0);
  }
}, [totalDays, presentDays]);


  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [pData, cData, nData] = await Promise.all([
        getTeacherProfile(),
        getTeacherCourses(),
        // getTeacherAttendance(),
        getTeacherNews(),
      ]);

      setProfile(pData);
      setCourses(cData.courses || cData || []);
      // setAttendance(aData.attendance || aData || []);
      setNews(nData || []);
    } catch (err) {
      console.error("❌ Error fetching teacher data:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchStudents = async () => {
  try {
    const data = await getAllStudents();
    setStudents(data);
  } catch (err) {
    console.error("❌ Failed to load students:", err);
  }
};

const handleSaveAttendance = async () => {
  if (!selectedStudent || !month || !year || !totalDays || !presentDays) {
    alert("⚠️ Please fill all fields");
    return;
  }

  const dataToSend = {
    totalDays,
    presentDays,
    absentDays: totalDays - presentDays,
    percentage,
  };

  if (editingId) {
    const updated = await updateAttendanceSummary(editingId, dataToSend);
    setRecords(records.map((r) => (r._id === editingId ? updated : r)));
    alert("✅ Attendance updated!");
    setEditingId(null);
  } else {
    const data = await saveAttendanceSummary(
      selectedStudent,
      month,
      year,
      totalDays,
      presentDays,
      percentage
    );
    setRecords([...records, data]);
    alert("✅ Attendance saved!");
  }

  // Reset form
  setMonth("");
  setYear(new Date().getFullYear());
  setTotalDays("");
  setPresentDays("");
  setPercentage(0);
};



const handleDeleteAttendance = async (id) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  await deleteAttendanceSummary(id);
  setRecords(records.filter((r) => r._id !== id));
  alert("🗑️ Attendance record deleted!");
};


const fetchStudentRecords = async (id) => {
  const data = await getAttendanceSummary(id);
  setRecords(data);
};


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700">
          Teacher Dashboard
        </h1>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6">
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-gray-600">{profile.designation}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
        )}

        {loading && <p className="text-gray-600">Loading...</p>}

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Courses Assigned
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {courses.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Attendance Records
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {attendance.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              News Articles
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {news.length}
            </p>
          </div>
        </div> */}

        {/* study materials */}

          <UploadMaterial />



        {/* Attendance Summary Section */}
<div className="bg-white p-6 shadow rounded mt-6">
  <h2 className="text-xl font-semibold mb-4">📊 Manage Attendance</h2>

  <select
    className="border p-2 rounded mb-2 w-full"
    value={selectedStudent}
    onChange={(e) => {
      setSelectedStudent(e.target.value);
      fetchStudentRecords(e.target.value);
    }}
  >
    <option value="">Select Student</option>
    {students.map((student) => (
      <option key={student._id} value={student._id}>
        {student.name} ({student.branch}, {student.year})
      </option>
    ))}
  </select>

  {/* Month & Year Selection */}
  <div className="flex space-x-2 mb-2">
    <select
      className="border p-2 rounded w-1/2"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
    >
      <option value="">Select Month</option>
      {months.map((m, index) => (
        <option key={index} value={index + 1}>{m}</option>
      ))}
    </select>

    <select
      className="border p-2 rounded w-1/2"
      value={year}
      onChange={(e) => setYear(e.target.value)}
    >
      <option value="">Select Year</option>
      {years.map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>

<input
  type="number"
  placeholder="Total Working Days"
  value={totalDays}
  onChange={(e) => setTotalDays(Number(e.target.value))}
  className="border p-2 rounded mb-2 w-full"
/>

<input
  type="number"
  placeholder="Present Days"
  value={presentDays}
  onChange={(e) => setPresentDays(Number(e.target.value))}
  className="border p-2 rounded mb-2 w-full"
/>

{/* Auto Calculated Percentage */}
<div className="p-2 mb-2 bg-gray-100 rounded text-gray-700">
  <strong>Attendance %: </strong> {percentage}%
</div>


  <button
    onClick={handleSaveAttendance}
    className="bg-green-600 text-white px-4 py-2 rounded w-full"
  >
    {editingId ? "Update Attendance" : "Save Attendance"}
  </button>

  {/* Display Records */}
  <div className="mt-4">
    <h3 className="font-semibold mb-2">Attendance History</h3>
    {records.length === 0 ? (
      <p className="text-gray-500">No records yet.</p>
    ) : (
      <ul className="divide-y">
        {records.map((r) => (
          <li key={r._id} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-medium">
                {months[r.month - 1]} {r.year}
              </span>
              <span className="ml-4 text-gray-600">
                {r.presentDays}/{r.totalDays} days
              </span>
              <span className="ml-4 font-semibold">{r.percentage}%</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingId(r._id);
                  setMonth(r.month);
                  setYear(r.year);
                  setTotalDays(r.totalDays);
                  setPresentDays(r.presentDays);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAttendance(r._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

<div className="bg-white p-6 shadow rounded-lg mt-6">
  <h2 className="text-xl font-semibold mb-4">📑 Manage Marks</h2>
  <TeacherMarks />
</div>




        {/* Courses */}
        {/* <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📘 My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses assigned</p>
          ) : (
            <ul className="space-y-2">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="p-3 border rounded flex justify-between bg-gray-50"
                >
                  <span className="font-medium">{course.name}</span>
                  <span className="text-sm text-gray-500">
                    {course.students?.length || 0} students
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div> */}

          

        {/* News */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📰 Latest News</h2>
          {news.length === 0 ? (
            <p className="text-gray-500">No news</p>
          ) : (
            <ul className="space-y-3">
              {news.map((n) => (
                <li
                  key={n._id}
                  className="p-3 border rounded bg-gray-50 shadow-sm"
                >
                  <strong>{n.title}</strong>: {n.message}
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
