import { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getTeacherAttendance,
  getTeacherNews,
} from "../../api/teacher.js";
import Navbar from "../../components/Navbar.jsx";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [cData, aData, nData] = await Promise.all([
        getTeacherCourses(),
        getTeacherAttendance(),
        getTeacherNews(),
      ]);

      setCourses(cData.courses || cData || []);
      setAttendance(aData.attendance || aData || []);
      setNews(nData || []);
    } catch (err) {
      console.error("❌ Error fetching teacher data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">Teacher Dashboard</h1>

        {loading && <p>Loading...</p>}

        {/* Courses */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses assigned</p>
          ) : (
            <ul className="list-disc pl-6">
              {courses.map((course) => (
                <li key={course._id} className="mb-1">
                  {course.name} –{" "}
                  <span className="text-sm text-gray-500">
                    {course.students?.length || 0} students
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Attendance Records */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Attendance Records</h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500">No attendance marked yet</p>
          ) : (
            <ul className="divide-y">
              {attendance.map((a) => (
                <li key={a._id} className="py-2 flex justify-between">
                  <span>{a.student?.name}</span>
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
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-3">Latest News</h2>
          {notifications.length === 0 ? (
  <p className="text-gray-500">No notifications</p>
) : (
  <ul className="space-y-2">
    {news.map((n) => (
      <li key={n._id} className="p-2 border rounded bg-gray-50">
        <strong>{n.title}</strong>: {n.message}
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

export default TeacherDashboard;
