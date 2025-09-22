import { useEffect, useState } from "react";
import {
  getStudentCourses,
  getStudentAttendance,
   // ✅ updated
} from "../../api/student.js";
// import { getPublicNews } from "../../api/public.js";
import Navbar from "../../components/Navbar.jsx";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);
  
const fetchStudentData = async () => {
  try {
    setLoading(true);
    const [cData, aData, nData] = await Promise.all([
      getStudentCourses(),
      getStudentAttendance(),
      axios.get("http://localhost:5000/api/news"), // ✅ direct bypass
    ]);

    setCourses(cData.courses || cData || []);
    setAttendance(aData.attendance || aData || []);
    setNews(nData.data || []); // ✅ .data
  } catch (err) {
    console.error("❌ Error fetching student data:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-green-700">Student Dashboard</h1>

        {loading && <p>Loading...</p>}

        {/* Courses */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses enrolled</p>
          ) : (
            <ul className="list-disc pl-6">
              {courses.map((course) => (
                <li key={course._id} className="mb-1">
                  {course.name} –{" "}
                  <span className="text-sm text-gray-500">
                    {course.teacher?.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Attendance */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">My Attendance</h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500">No attendance records yet</p>
          ) : (
            <ul className="divide-y">
              {attendance.map((a) => (
                <li key={a._id} className="py-2 flex justify-between">
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                  <span
                    className={`font-semibold ${
                      a.status === "Present"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* News */}
      {/* News */}
<div className="bg-white p-4 shadow rounded">
  <h2 className="text-xl font-semibold mb-3">Latest News</h2>
  {news.length === 0 ? (
    <p className="text-gray-500">No news available</p>
  ) : (
    <ul className="space-y-2">
      {news.map((n) => (
        <li key={n._id} className="p-2 border rounded bg-gray-50">
          <strong>{n.title}</strong>: {n.message || "No content"}
          <div className="text-sm text-gray-500">
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
