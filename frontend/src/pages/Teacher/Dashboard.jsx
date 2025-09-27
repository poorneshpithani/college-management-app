import { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getTeacherAttendance,
  getTeacherNews,
  getTeacherProfile,
} from "../../api/teacher.js";
import Navbar from "../../components/Navbar.jsx";

const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
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
      const [pData, cData, aData, nData] = await Promise.all([
        getTeacherProfile(),
        getTeacherCourses(),
        getTeacherAttendance(),
        getTeacherNews(),
      ]);

      setProfile(pData);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        {/* Courses */}
        <div className="bg-white p-6 shadow rounded-lg">
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
        </div>

        {/* Attendance Records */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Attendance Records</h2>
          {attendance.length === 0 ? (
            <p className="text-gray-500">No attendance marked yet</p>
          ) : (
            <ul className="divide-y">
              {attendance.map((a) => (
                <li
                  key={a._id}
                  className="py-3 flex justify-between items-center"
                >
                  <span className="font-medium">{a.student?.name}</span>
                  <span className="text-gray-600">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
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
