import { useEffect, useState } from "react";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../../api/admin.js";

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingUsers();
      setUsers(data);
    } catch (err) {
      setMessage("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      setMessage("✅ User approved");
      fetchPending();
    } catch {
      setMessage("❌ Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectUser(id);
      setMessage("❌ User rejected");
      fetchPending();
    } catch {
      setMessage("❌ Failed to reject user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Pending Users</h2>

      {message && (
        <div className="mb-4 p-3 text-white bg-gray-700 rounded">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No pending users</p>
      ) : (
        <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleApprove(u._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(u._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingUsers;
