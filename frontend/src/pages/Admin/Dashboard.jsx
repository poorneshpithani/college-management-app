import { useEffect, useState } from "react";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  addNews,
  getNews,
  updateNews,
  deleteNews,
  getStudentsByBranch,
  getStudentsByYear,
  getTeachersByRole,
  getStudentCount,
  getTeacherCount,
  deleteUser,
  getTeacherRoles,
  updateUser,
  getFilterData,
  deleteBranch,
} from "../../api/admin.js";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import ManageExams from "./ManageExams.jsx"; 

const AdminDashboard = () => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const [pendingUsers, setPendingUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [designation, setDesignation] = useState("");
  const [filterResults, setFilterResults] = useState([]);
  const [newsList, setNewsList] = useState([])
  const [editingId, setEditingId] = useState(null);

  
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  // ✅ Dynamic filter data from backend
const [branches, setBranches] = useState([]);
const [semesters, setSemesters] = useState([]);
const [semester, setSemester] = useState(""); // selected semester



  const [activeTab, setActiveTab] = useState("pending"); // default 
  
  const [teacherRoles, setTeacherRoles] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});


const [newBranch, setNewBranch] = useState("");



  useEffect(() => {
    fetchPendingUsers();
    fetchNotifications();
    fetchCounts();
    fetchTeacherRoles();
    loadDynamicFilters(); 
  }, []);

  const fetchTeacherRoles = async () => {
  const roles = await getTeacherRoles();
  setTeacherRoles(roles);
};

  const fetchPendingUsers = async () => {
    const data = await getPendingUsers();
    setPendingUsers(data);
  };

  const fetchNotifications = async () => {
  const data = await getNews();
  setNewsList(data); // reusing filterResults for notifications
};

const loadDynamicFilters = async () => {
  try {
    const data = await getFilterData();
    setBranches(data.branches);
    setSemesters(data.semesters);
  } catch (err) {
    console.error("❌ Failed to load dynamic filter data:", err);
  }
};

  const handleApprove = async (id) => {
    await approveUser(id);
    fetchPendingUsers();
  };

  const handleReject = async (id) => {
    await rejectUser(id);
    fetchPendingUsers();
  };

    const handleAddNotification = async () => {
    if (editingId) {
      await updateNews(editingId, { title, message });
      setEditingId(null);
    } else {
      await addNews({ title, message });
    }
    setTitle("");
    setMessage("");
    fetchNotifications();
  };

  const handleEdit = (n) => {
    setTitle(n.title);
    setMessage(n.message);
    setEditingId(n._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await deleteNews(id);
      fetchNotifications();
    }
  };

    const fetchCounts = async () => {
    const sCount = await getStudentCount();
    const tCount = await getTeacherCount();
    setStudentCount(sCount);
    setTeacherCount(tCount);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFilterBranch = async () => {
    const data = await getStudentsByBranch(branch);
    setFilterResults(data);
  };

  const handleFilterYear = async () => {
    const data = await getStudentsByYear(year);
    setFilterResults(data);
  };

  const handleFilterRole = async () => {
    const data = await getTeachersByRole(designation);
    setFilterResults(data);
  };

  const handleEditUser = (user) => {
  setEditingUser(user);
  setEditForm({ ...user });
};

const handleSaveUser = async () => {
  await updateUser(editingUser._id, editForm);

  // Refresh filters or pending users if needed
  setFilterResults(
    filterResults.map((u) => (u._id === editingUser._id ? { ...editForm } : u))
  );
  setEditingUser(null); // close modal
};


// Example function for adding a branch
const handleAddBranch = async () => {
  const res = await fetch("/api/admin/branches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name: newBranch }),
  });
  const data = await res.json();
  setBranches([...branches, data]);
  setNewBranch("");
};


  return (
     <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Welcome, Admin
        </h1>

        
        {/* ✅ Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{studentCount}</p>
          </div>
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Faculty</h3>
            <p className="text-3xl font-bold text-green-600">{teacherCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b pb-2 mb-6">
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Users
          </button>
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "filters"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("filters")}
          >
            Filters
          </button>

          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "branches"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("branches")}
          >
            Branches
          </button>

          <button
  className={`px-4 py-2 rounded-t ${
    activeTab === "exams"
      ? "bg-blue-600 text-white"
      : "bg-gray-200 text-gray-700"
  }`}
  onClick={() => setActiveTab("exams")}
>
  Manager
</button>

        </div>

         {/* Tab Content */}
      {activeTab === "pending" && (
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
      )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-2">
              {editingId ? "Edit Notification" : "Add Notification"}
            </h2>
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
              onClick={handleAddNotification}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update Notification" : "Add Notification"}
            </button>

            {/* Previous Notifications */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Previous Notifications
              </h3>
              {newsList.length === 0 ? (
                <p className="text-gray-500">No notifications yet.</p>
              ) : (
                <ul className="space-y-2">
                  {newsList.map((n) => (
                    <li
                      key={n._id}
                      className="p-2 border rounded bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <strong>{n.title}</strong>: {n.message}
                        <div className="text-sm text-gray-500">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(n)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
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
        )}

     
{activeTab === "filters" && (
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-xl font-semibold mb-3">🔍 Dynamic Filters</h2>

    {/* Load dynamic options */}
    <button
      onClick={loadDynamicFilters}
      className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
    >
      🔄 Load Filter Options
    </button>

    {/* Branch Filter */}
    <div className="flex space-x-2 mb-3">
      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Branch</option>
        {branches.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>

    {/* Year & Semester Filter */}
    <div className="flex space-x-2 mb-3">
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border p-2 rounded w-1/2"
      >
        <option value="">Select Year</option>
        {[1, 2, 3, 4].map((y) => (
          <option key={y} value={y}>
            {y} Year
          </option>
        ))}
      </select>

      {semesters
  .filter((s) => s.branch?._id === branch)
  .map((s) => (
    <option key={s._id} value={s._id}>
      Year {s.year} - Sem {s.semNumber}
    </option>
  ))}

    </div>

    {/* Filter Buttons */}
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={handleFilterBranch}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Filter by Branch
      </button>
      <button
        onClick={handleFilterYear}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Filter by Year
      </button>
      <button
        onClick={handleFilterRole}
        className="bg-purple-600 text-white px-3 py-1 rounded"
      >
        Filter Teachers
      </button>
    </div>

    {/* Results */}
    <div>
      {filterResults.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <ul className="divide-y">
          {filterResults.map((user) => (
            <li key={user._id} className="py-2 flex justify-between items-center">
              <span>
                {user.name} ({user.email}) –{" "}
                {user.role === "student"
                  ? `${user.branch?.name || user.branch}, Year ${user.year}`
                  : user.designation}
              </span>

              <div className="space-x-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(`Are you sure you want to delete ${user.name}?`)
                    ) {
                      await deleteUser(user._id);
                      setFilterResults(
                        filterResults.filter((u) => u._id !== user._id)
                      );
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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
)}


{activeTab === "branches" && (
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-xl font-semibold mb-4">🏫 Manage Branches</h2>

    {/* Add Branch Form */}
    <div className="flex space-x-2 mb-4">
      <input
        type="text"
        placeholder="Enter new branch name"
        className="border p-2 rounded w-full"
        value={newBranch}
        onChange={(e) => setNewBranch(e.target.value)}
      />
      <button
        onClick={handleAddBranch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </div>

    {/* Existing Branches */}
    <ul className="divide-y">
      {branches.length === 0 ? (
        <p className="text-gray-500">No branches added yet.</p>
      ) : (
        branches.map((b) => (
          <li
            key={b._id}
            className="flex justify-between items-center py-2 border-b"
          >
            <span>{b.name}</span>
            <button
              onClick={async () => {
                if (window.confirm(`Delete branch "${b.name}"?`)) {
                  await deleteBranch(b._id);
                  setBranches(branches.filter((br) => br._id !== b._id));
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
)}




     

      {activeTab === "exams" && (
  <div className="bg-white p-4 shadow rounded">
    <ManageExams />
  </div>
)}

{editingUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>

      <input
        type="text"
        className="border p-2 w-full mb-2"
        value={editForm.name || ""}
        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="email"
        className="border p-2 w-full mb-2"
        value={editForm.email || ""}
        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
        placeholder="Email"
      />

      {/* Conditional fields based on role */}
      {editingUser.role === "student" && (
        <>
          <input
            type="text"
            className="border p-2 w-full mb-2"
            value={editForm.branch || ""}
            onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
            placeholder="Branch"
          />
          <input
            type="text"
            className="border p-2 w-full mb-2"
            value={editForm.year || ""}
            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
            placeholder="Year"
          />
        </>
      )}

      {editingUser.role === "teacher" && (
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={editForm.designation || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, designation: e.target.value })
          }
          placeholder="Designation"
        />
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setEditingUser(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}




    </div>
    </div>
  );
};

export default AdminDashboard;
