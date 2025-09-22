// frontend/src/pages/Admin/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  addNews,
  getNews,
} from "../../api/admin.js";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
    fetchNews();
  }, []);

  const fetchPendingUsers = async () => {
    const data = await getPendingUsers();
    setPendingUsers(data);
  };

  const fetchNews = async () => {
    const data = await getNews();
    setNewsList(data);
  };

  const handleApprove = async (id) => {
    await approveUser(id);
    fetchPendingUsers();
  };

  const handleReject = async (id) => {
    await rejectUser(id);
    fetchPendingUsers();
  };

  const handleAddNews = async () => {
    if (!title || !message) return alert("Please enter title and message");
    await addNews({ title, message });
    setTitle("");
    setMessage("");
    alert("✅ News Added!");
    fetchNews(); // refresh list
  };

  return (
    <div><Navbar />
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Pending Users */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Pending Users</h2>
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending users</p>
        ) : (
          pendingUsers.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {user.name} ({user.role})
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add News */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Add News</h2>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Message"
          className="border p-2 w-full mb-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleAddNews}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </div>

      {/* Recent News */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Recent News</h2>
        {newsList.length === 0 ? (
          <p className="text-gray-500">No news available</p>
        ) : (
          <ul className="space-y-2">
            {newsList.map((n) => (
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

export default AdminDashboard;
