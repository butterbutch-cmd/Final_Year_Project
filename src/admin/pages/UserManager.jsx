import { useEffect, useMemo, useState } from "react";
import { Users, UserPlus, UserX, UserCheck, Trash2 } from "lucide-react";

import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import { getUsers, deleteUser, blockUser, unblockUser } from "../../services/userAPI";

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  } catch {
    return "—";
  }
};

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      const onlyUsers = (Array.isArray(data) ? data : []).filter(
        (u) => u.role === "user"
      );
      setUsers(onlyUsers);
    } catch (err) {
      console.error("fetchUsers:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------- BLOCK MODAL ---------- */
  const openBlockModal = (user) => {
    setSelectedUser(user);
    setBlockReason("");
    setBlockModalOpen(true);
  };

  const sendBlock = async () => {
    if (!blockReason.trim()) return alert("Please provide a reason");

    try {
      const userId = selectedUser._id || selectedUser.id || selectedUser.userid;
      await blockUser(userId, blockReason);
      setBlockModalOpen(false);
      fetchUsers();
      alert("User blocked and email sent");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to block user");
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      const userId = user._id || user.id || user.userid;
      if (user.isBlocked) {
        await unblockUser(userId);
        alert("User unblocked and email sent");
      } else {
        openBlockModal(user); // open modal to enter reason
        return;
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update block status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  /* ---------- STATS ---------- */
  const statsData = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const total = users.length;
    const blocked = users.filter((u) => !!u.isBlocked).length;
    const newUsers = users.filter((u) => {
      const created = new Date(u.createdAt || u.registeredAt || null);
      if (!created || Number.isNaN(created.getTime())) return false;
      return now - created.getTime() <= sevenDaysMs;
    }).length;

    return [
      {
        title: "Total Users",
        value: total,
        subtitle: "All registered accounts",
        Icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        title: "Blocked",
        value: blocked,
        subtitle: "Blocked accounts",
        Icon: UserX,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      },
      {
        title: "New (7 days)",
        value: newUsers,
        subtitle: "Recently registered",
        Icon: UserPlus,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
    ];
  }, [users]);

  const statusOptions = useMemo(() => [
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
  ], []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <StatCard
        pageTitle="User Management"
        pageSubtitle="Overview & user actions"
        buttonText="Refresh"
        onButtonClick={fetchUsers}
        stats={statsData}
      />

      <DataTable
        title="Users"
        subtitle="Manage registered users"
        columns={["User ID", "Name", "Email", "Status", "Registered"]}
        data={users}
        searchableKeys={["username", "email"]}
        filterKey="status"
        filterOptions={statusOptions}
        renderRow={(user) => {
          const id = user._id || user.id || user.userid || "—";
          const statusLabel = user.isBlocked ? "Blocked" : "Active";
          const statusStyle = user.isBlocked
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700";
          const createdAt = user.createdAt || user.registeredAt || null;

          return (
            <>
              <td className="px-4 py-4 text-xs text-gray-500">{id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}`
                    }
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.username || "—"}</p>
                    <p className="text-xs text-gray-500">{user.authProvider || "local"}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">{user.email || "—"}</td>
              <td className="px-4 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                  {statusLabel}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">{formatDate(createdAt)}</td>
            </>
          );
        }}
        actions={(user) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleToggleBlock(user)}
              className={`p-2 rounded-lg border hover:bg-gray-50 ${user.isBlocked ? "bg-yellow-50" : "bg-gray-100"}`}
              title={user.isBlocked ? "Unblock user" : "Block user"}
            >
              {user.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
            </button>
            <button
              onClick={() => handleDelete(user._id || user.id || user.userid)}
              className="p-2 bg-gray-100 rounded-lg text-red-500 hover:bg-red-50"
              title="Delete user"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {loading && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">Loading users...</div>
        </div>
      )}

      {/* ---------- BLOCK MODAL ---------- */}
      {blockModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Block User</h2>
            <p className="mb-2">Reason for blocking {selectedUser.username}:</p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              rows={4}
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={sendBlock}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Send & Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
