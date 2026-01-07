import { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import {
  getAdmins,
  deleteAdmin,
  createAdmin,
} from "../../services/adminAPI";

const AdminRoles = () => {
  /* ------------------ API DATA ------------------ */
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  /* ------------------ FETCH ADMINS ------------------ */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      alert("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ STATS ------------------ */
  const totalUsers = admins.length;
  const totalAdmins = admins.filter((a) => a.role === "admin").length;
  const totalModerators = admins.filter((a) => a.role === "moderator").length;

  const stats = useMemo(
    () => [
      {
        title: "Total Admins & Mods",
        value: totalUsers,
        subtitle: "All system staff",
        Icon: Users,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
      },
      {
        title: "Admins",
        value: totalAdmins,
        subtitle: "System managers",
        Icon: ShieldCheck,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        title: "Moderators",
        value: totalModerators,
        subtitle: "Content reviewers",
        Icon: UserCheck,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
    ],
    [totalUsers, totalAdmins, totalModerators]
  );

  /* ------------------ FORM STATE ------------------ */
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    role: "admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------ CREATE ADMIN ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, phoneNumber, role } = form;

    if (!username || !email || !phoneNumber || !role) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await createAdmin({ username, email, phoneNumber, role });

      alert("Admin created successfully. Login credentials sent via email.");

      setShowForm(false);
      setForm({
        username: "",
        email: "",
        phoneNumber: "",
        role: "admin",
      });

      fetchAdmins();
    } catch (error) {
      console.error("Create failed:", error);
      alert(error.message || "Failed to create admin");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({
      username: "",
      email: "",
      phoneNumber: "",
      role: "admin",
    });
  };

  /* ------------------ DELETE ADMIN ------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await deleteAdmin(id);
      setAdmins((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message || "Failed to delete admin.");
    }
  };

  /* ------------------ RENDER ------------------ */
  return (
    <div className="space-y-6">
      {/* ----------- STAT CARDS ----------- */}
      <StatCard
        pageTitle="Roles & Admins"
        pageSubtitle="Manage system admins and moderators"
        buttonText="Create Admin / Moderator"
        onButtonClick={() => setShowForm((prev) => !prev)}
        stats={stats}
      />

      {/* ----------- CREATE FORM ----------- */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Create Admin / Moderator
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
              >
                Create & Send Email
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------- DATA TABLE ----------- */}
      <DataTable
        title="Roles & Admins"
        subtitle="Manage admins and moderators"
        columns={["Username", "Email", "Phone Number", "Role"]}
        data={admins}
        searchableKeys={["username", "email", "phoneNumber"]}
        filterKey="role"
        filterOptions={[
          { label: "Admin", value: "admin" },
          { label: "Moderator", value: "moderator" },
          { label: "Super Admin", value: "super_admin" },
        ]}
        emptyState={loading ? "Loading..." : "No admins found"}
        renderRow={(row) => (
          <>
            <td className="px-6 py-4">{row.username}</td>
            <td className="px-6 py-4">{row.email}</td>
            <td className="px-6 py-4">{row.phoneNumber || "—"}</td>
            <td className="px-6 py-4 capitalize">
              {row.role.replace("_", " ")}
            </td>
          </>
        )}
        actions={(row) => (
          <div className="flex justify-center gap-2">
            <button className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-100">
              Edit
            </button>
            <button
              onClick={() => handleDelete(row._id)}
              className="text-sm px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default AdminRoles;
