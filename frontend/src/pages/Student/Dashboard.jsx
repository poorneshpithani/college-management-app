import { useEffect, useState } from "react";
import {
  getStudentCourses,
  getStudentAttendance,
  getStudentNews,
  getStudentProfile,
  getStudentAttendanceSummary, // ✅ new API call
} from "../../api/student.js";
import Navbar from "../../components/Navbar.jsx";
import StudentMaterials from "./StudentMaterials.jsx";

import StudentResults from "./StudentResults.jsx";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [attendanceSummary, setAttendanceSummary] = useState([]);


  useEffect(() => {
    fetchStudentData();
  }, []);


  const fetchStudentData = async () => {
  try {
    setLoading(true);
    const [pData, cData, aData, nData, sData] = await Promise.all([
  getStudentProfile(),
  getStudentCourses(),
  getStudentAttendance(),
  getStudentNews(),
  getStudentAttendanceSummary()
    ]);


    console.log("📌 Attendance Summary API response:", sData);


    setProfile(pData);
    setCourses(cData.courses || cData || []);
    setAttendance(aData.attendance || aData || []);
    setNews(nData || []);
    setAttendanceSummary(sData || []);
  } catch (err) {
    console.error("❌ Error fetching student data:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700">
          Student Dashboard
        </h1>

        {/* ✅ Student Profile Card */}
        {profile && (
          <div className="bg-white shadow rounded p-6 flex flex-col items-start">
            <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
            <p className="text-gray-600 text-lg">
              {profile.branch?.name || "Branch not assigned"} – {profile.year}
            </p>
          </div>
        )}

        


        {loading && <p className="text-gray-600">Loading...</p>}

        {/* Stats Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Courses Enrolled</h3>
            <p className="text-3xl font-bold text-green-600">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Attendance Records</h3>
            <p className="text-3xl font-bold text-blue-600">{attendance.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">News Articles</h3>
            <p className="text-3xl font-bold text-purple-600">{news.length}</p>
          </div>
        </div> */}


        {/* student materials */}


        <StudentMaterials />

        {/* Attendance Summary */}
<div className="bg-white p-6 shadow rounded-lg mt-6">
  <h2 className="text-xl font-semibold mb-4">📅 Monthly Attendance Summary</h2>
  {attendanceSummary.length === 0 ? (
    <p className="text-gray-500">No attendance summary available</p>
  ) : (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Month</th>
          <th className="p-2 border">Year</th>
          <th className="p-2 border">Total Days</th>
          <th className="p-2 border">Present</th>
          <th className="p-2 border">Absent</th>
          <th className="p-2 border">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {attendanceSummary.map((r) => (
          <tr key={r._id} className="text-center">
            <td className="p-2 border">{r.month}</td>
            <td className="p-2 border">{r.year}</td>
            <td className="p-2 border">{r.totalDays}</td>
            <td className="p-2 border text-green-600">{r.presentDays}</td>
            <td className="p-2 border text-red-600">{r.absentDays}</td>
            <td className="p-2 border font-semibold">{r.percentage}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


        {/* Courses */}
        {/* <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📘 My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">Not enrolled in any courses</p>
          ) : (
            <ul className="space-y-2">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="p-3 border rounded flex justify-between bg-gray-50"
                >
                  <span className="font-medium">{course.name}</span>
                  <span className="text-sm text-gray-500">
                    {course.teacher?.name || "No teacher"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div> */}

        {/* Attendance */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Attendance Records</h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500">No attendance records yet</p>
          ) : (
            <ul className="divide-y">
              {attendance.map((a) => (
                <li key={a._id} className="py-3 flex justify-between items-center">
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                  <span
                    className={`font-semibold ${
                      a.status === "Present" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* student results */}

        <div className="bg-white p-6 shadow rounded-lg mt-6">
  <h2 className="text-xl font-semibold mb-4">📊 My Results</h2>
  <StudentResults />
</div>

        {/* News */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📰 Latest News</h2>
          {news.length === 0 ? (
            <p className="text-gray-500">No news available</p>
          ) : (
            <ul className="space-y-3">
              {news.map((n) => (
                <li key={n._id} className="p-3 border rounded bg-gray-50 shadow-sm">
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

export default StudentDashboard;
