import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";

import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

// NOTE: create a ../../services/userAPI with getUsers, updateUser, deleteUser
import { getUsers, updateUser, deleteUser } from "../../services/productAPI";

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

  /* ---------- FETCH ---------- */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
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

  /* ---------- ACTIONS ---------- */
  const handleBlockToggle = async (user) => {
    const id = user._id || user.id || user.userid;
    try {
      // toggle isBlocked flag (assumes user model has `isBlocked` boolean)
      await updateUser(id, { isBlocked: !user.isBlocked });
      fetchUsers();
    } catch (err) {
      console.error("handleBlockToggle:", err);
      alert("Failed to update user status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("handleDelete:", err);
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
      const created = new Date(u.createdAt || u.registeredAt || u.createdAtAt || null);
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

  /* ---------- ROLES FOR FILTER ---------- */
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(users.map((u) => u.role || "user")));
    return roles.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), value: r }));
  }, [users]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ---------- DASHBOARD ---------- */}
      <StatCard
        pageTitle="User Management"
        pageSubtitle="Overview & user actions"
        buttonText="Refresh"
        onButtonClick={fetchUsers}
        stats={statsData}
      />

      {/* ---------- USER TABLE ---------- */}
      <DataTable
        title="Users"
        subtitle="Manage registered users"
        columns={["User ID", "Name", "Email", "Role", "Status", "Registered"]}
        data={users}

        /* 🔍 SEARCH */
        searchableKeys={["username", "email"]}

        /* 🎯 FILTER */
        filterKey="role"
        filterOptions={roleOptions}

        renderRow={(user) => {
          const id = user._id || user.id || user.userid || "—";

          const statusLabel = user.isBlocked ? "Blocked" : "Active";
          const statusStyle = user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";

          const createdAt = user.createdAt || user.registeredAt || user.createdAtAt || null;

          return (
            <>
              {/* User ID */}
              <td className="px-4 py-4 text-xs text-gray-500">{id}</td>

              {/* Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}`}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.username || "—"}</p>
                    <p className="text-xs text-gray-500">{user.authProvider || "local"}</p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-4 py-4 text-sm">{user.email || "—"}</td>

              {/* Role */}
              <td className="px-4 py-4 text-sm">{user.role || "user"}</td>

              {/* Status */}
              <td className="px-4 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                  {statusLabel}
                </span>
              </td>

              {/* Registered */}
              <td className="px-4 py-4 text-sm">{formatDate(createdAt)}</td>
            </>
          );
        }}

        actions={(user) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleBlockToggle(user)}
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

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">Loading users...</div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
