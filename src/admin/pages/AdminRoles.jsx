// // // import { useState, useMemo, useEffect } from "react";
// // // import DataTable from "../components/DataTable";
// // // import StatCard from "../components/StatCard";
// // // import { Users, ShieldCheck, UserCheck } from "lucide-react";
// // // import {
// // //   getAdmins,
// // //   deleteAdmin,
// // //   createAdmin,
// // // } from "../../services/adminAPI";

// // // const AdminRoles = () => {
// // //   /* ------------------ API DATA ------------------ */
// // //   const [admins, setAdmins] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [showForm, setShowForm] = useState(false);

// // //   /* ------------------ FETCH ADMINS ------------------ */
// // //   useEffect(() => {
// // //     fetchAdmins();
// // //   }, []);

// // //   const fetchAdmins = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await getAdmins();
// // //       setAdmins(data);
// // //     } catch (error) {
// // //       console.error("Failed to fetch admins:", error);
// // //       alert("Failed to load admins");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   /* ------------------ STATS ------------------ */
// // //   const totalUsers = admins.length;
// // //   const totalAdmins = admins.filter((a) => a.role === "admin").length;
// // //   const totalModerators = admins.filter((a) => a.role === "moderator").length;

// // //   const stats = useMemo(
// // //     () => [
// // //       {
// // //         title: "Total Admins & Mods",
// // //         value: totalUsers,
// // //         subtitle: "All system staff",
// // //         Icon: Users,
// // //         iconBg: "bg-emerald-100",
// // //         iconColor: "text-emerald-600",
// // //       },
// // //       {
// // //         title: "Admins",
// // //         value: totalAdmins,
// // //         subtitle: "System managers",
// // //         Icon: ShieldCheck,
// // //         iconBg: "bg-blue-100",
// // //         iconColor: "text-blue-600",
// // //       },
// // //       {
// // //         title: "Moderators",
// // //         value: totalModerators,
// // //         subtitle: "Content reviewers",
// // //         Icon: UserCheck,
// // //         iconBg: "bg-yellow-100",
// // //         iconColor: "text-yellow-600",
// // //       },
// // //     ],
// // //     [totalUsers, totalAdmins, totalModerators]
// // //   );

// // //   /* ------------------ FORM STATE ------------------ */
// // //   const [form, setForm] = useState({
// // //     username: "",
// // //     email: "",
// // //     phoneNumber: "",
// // //     role: "admin",
// // //   });

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   /* ------------------ CREATE ADMIN ------------------ */
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     const { username, email, phoneNumber, role } = form;

// // //     if (!username || !email || !phoneNumber || !role) {
// // //       alert("Please fill in all fields.");
// // //       return;
// // //     }

// // //     try {
// // //       await createAdmin({ username, email, phoneNumber, role });

// // //       alert("Admin created successfully. Login credentials sent via email.");

// // //       setShowForm(false);
// // //       setForm({
// // //         username: "",
// // //         email: "",
// // //         phoneNumber: "",
// // //         role: "admin",
// // //       });

// // //       fetchAdmins();
// // //     } catch (error) {
// // //       console.error("Create failed:", error);
// // //       alert(error.message || "Failed to create admin");
// // //     }
// // //   };

// // //   const handleCancel = () => {
// // //     setShowForm(false);
// // //     setForm({
// // //       username: "",
// // //       email: "",
// // //       phoneNumber: "",
// // //       role: "admin",
// // //     });
// // //   };

// // //   /* ------------------ DELETE ADMIN ------------------ */
// // //   const handleDelete = async (id) => {
// // //     if (!window.confirm("Are you sure you want to delete this admin?")) return;

// // //     try {
// // //       await deleteAdmin(id);
// // //       setAdmins((prev) => prev.filter((item) => item._id !== id));
// // //     } catch (error) {
// // //       console.error("Delete failed:", error);
// // //       alert(error.message || "Failed to delete admin.");
// // //     }
// // //   };

// // //   /* ------------------ RENDER ------------------ */
// // //   return (
// // //     <div className="space-y-6">
// // //       {/* ----------- STAT CARDS ----------- */}
// // //       <StatCard
// // //         pageTitle="Roles & Admins"
// // //         pageSubtitle="Manage system admins and moderators"
// // //         buttonText="Create Admin / Moderator"
// // //         onButtonClick={() => setShowForm((prev) => !prev)}
// // //         stats={stats}
// // //       />

// // //       {/* ----------- CREATE FORM ----------- */}
// // //       {showForm && (
// // //         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
// // //           <h3 className="text-lg font-semibold mb-4">
// // //             Create Admin / Moderator
// // //           </h3>

// // //           <form
// // //             onSubmit={handleSubmit}
// // //             className="grid grid-cols-1 md:grid-cols-2 gap-5"
// // //           >
// // //             {/* Username */}
// // //             <div>
// // //               <label className="text-sm font-medium text-gray-700">
// // //                 Username
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 name="username"
// // //                 value={form.username}
// // //                 onChange={handleChange}
// // //                 required
// // //                 className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
// // //               />
// // //             </div>

// // //             {/* Email */}
// // //             <div>
// // //               <label className="text-sm font-medium text-gray-700">
// // //                 Email
// // //               </label>
// // //               <input
// // //                 type="email"
// // //                 name="email"
// // //                 value={form.email}
// // //                 onChange={handleChange}
// // //                 required
// // //                 className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
// // //               />
// // //             </div>

// // //             {/* Phone Number */}
// // //             <div>
// // //               <label className="text-sm font-medium text-gray-700">
// // //                 Phone Number
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 name="phoneNumber"
// // //                 value={form.phoneNumber}
// // //                 onChange={handleChange}
// // //                 required
// // //                 className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
// // //               />
// // //             </div>

// // //             {/* Role */}
// // //             <div>
// // //               <label className="text-sm font-medium text-gray-700">
// // //                 Role
// // //               </label>
// // //               <select
// // //                 name="role"
// // //                 value={form.role}
// // //                 onChange={handleChange}
// // //                 className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
// // //               >
// // //                 <option value="super_admin">Super Admin</option>
// // //                 <option value="admin">Admin</option>
// // //                 <option value="moderator">Moderator</option>
// // //               </select>
// // //             </div>

// // //             {/* Buttons */}
// // //             <div className="md:col-span-2 flex justify-end gap-3">
// // //               <button
// // //                 type="submit"
// // //                 className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
// // //               >
// // //                 Create & Send Email
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={handleCancel}
// // //                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
// // //               >
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </form>
// // //         </div>
// // //       )}

// // //       {/* ----------- DATA TABLE ----------- */}
// // //       <DataTable
// // //         title="Roles & Admins"
// // //         subtitle="Manage admins and moderators"
// // //         columns={["Username", "Email", "Phone Number", "Role"]}
// // //         data={admins}
// // //         searchableKeys={["username", "email", "phoneNumber"]}
// // //         filterKey="role"
// // //         filterOptions={[
// // //           { label: "Admin", value: "admin" },
// // //           { label: "Moderator", value: "moderator" },
// // //           { label: "Super Admin", value: "super_admin" },
// // //         ]}
// // //         emptyState={loading ? "Loading..." : "No admins found"}
// // //         renderRow={(row) => (
// // //           <>
// // //             <td className="px-6 py-4">{row.username}</td>
// // //             <td className="px-6 py-4">{row.email}</td>
// // //             <td className="px-6 py-4">{row.phoneNumber || "—"}</td>
// // //             <td className="px-6 py-4 capitalize">
// // //               {row.role.replace("_", " ")}
// // //             </td>
// // //           </>
// // //         )}
// // //         actions={(row) => (
// // //           <div className="flex justify-center gap-2">
// // //             <button className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-100">
// // //               Edit
// // //             </button>
// // //             <button
// // //               onClick={() => handleDelete(row._id)}
// // //               className="text-sm px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
// // //             >
// // //               Delete
// // //             </button>
// // //           </div>
// // //         )}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default AdminRoles;



// // import { useState, useMemo, useEffect } from "react";
// // import DataTable from "../components/DataTable";
// // import StatCard from "../components/StatCard";
// // import { Users, ShieldCheck, UserCheck } from "lucide-react";
// // import {
// //   getAdmins,
// //   deleteAdmin,
// //   createAdmin,
// // } from "../../services/adminAPI";

// // const MODULES = {
// //   products: "Product Management",
// //   users: "User Management",
// //   orders: "Order Processing",
// //   payments: "Payment Gateway",
// //   content: "Content Management",
// // };

// // const defaultPermissions = {
// //   products: { view: true, create: false, edit: false, delete: false },
// //   users: { view: false, create: false, edit: false, delete: false },
// //   orders: { view: true, create: false, edit: false, delete: false },
// //   payments: { view: false, create: false, edit: false, delete: false },
// //   content: { view: true, create: true, edit: true, delete: true },
// // };

// // const AdminRoles = () => {
// //   /* ------------------ API DATA ------------------ */
// //   const [admins, setAdmins] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);

// //   /* ------------------ FORM STATE ------------------ */
// //   const [form, setForm] = useState({
// //     username: "",
// //     email: "",
// //     phoneNumber: "",
// //     role: "admin",
// //     permissions: defaultPermissions,
// //   });

// //   /* ------------------ FETCH ADMINS ------------------ */
// //   useEffect(() => {
// //     fetchAdmins();
// //   }, []);

// //   const fetchAdmins = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAdmins();
// //       setAdmins(data);
// //     } catch (error) {
// //       console.error("Failed to fetch admins:", error);
// //       alert("Failed to load admins");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ------------------ STATS ------------------ */
// //   const totalUsers = admins.length;
// //   const totalAdmins = admins.filter((a) => a.role === "admin").length;
// //   const totalModerators = admins.filter((a) => a.role === "moderator").length;

// //   const stats = useMemo(
// //     () => [
// //       {
// //         title: "Total Admins & Mods",
// //         value: totalUsers,
// //         subtitle: "All system staff",
// //         Icon: Users,
// //         iconBg: "bg-emerald-100",
// //         iconColor: "text-emerald-600",
// //       },
// //       {
// //         title: "Admins",
// //         value: totalAdmins,
// //         subtitle: "System managers",
// //         Icon: ShieldCheck,
// //         iconBg: "bg-blue-100",
// //         iconColor: "text-blue-600",
// //       },
// //       {
// //         title: "Moderators",
// //         value: totalModerators,
// //         subtitle: "Content reviewers",
// //         Icon: UserCheck,
// //         iconBg: "bg-yellow-100",
// //         iconColor: "text-yellow-600",
// //       },
// //     ],
// //     [totalUsers, totalAdmins, totalModerators]
// //   );

// //   /* ------------------ FORM HANDLERS ------------------ */
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const togglePermission = (module, action) => {
// //     setForm((prev) => {
// //       const updated = JSON.parse(JSON.stringify(prev.permissions));

// //       if (action === "view") {
// //         const newValue = !updated[module].view;
// //         updated[module] = {
// //           view: newValue,
// //           create: newValue ? updated[module].create : false,
// //           edit: newValue ? updated[module].edit : false,
// //           delete: newValue ? updated[module].delete : false,
// //         };
// //       } else {
// //         updated[module][action] = !updated[module][action];
// //       }

// //       return { ...prev, permissions: updated };
// //     });
// //   };

// //   const selectAllPermissions = () => {
// //     const all = {};
// //     Object.keys(defaultPermissions).forEach((m) => {
// //       all[m] = {
// //         view: true,
// //         create: true,
// //         edit: true,
// //         delete: true,
// //       };
// //     });

// //     setForm((prev) => ({ ...prev, permissions: all }));
// //   };

// //   const resetForm = () => {
// //     setForm({
// //       username: "",
// //       email: "",
// //       phoneNumber: "",
// //       role: "admin",
// //       permissions: defaultPermissions,
// //     });
// //   };

// //   /* ------------------ CREATE ADMIN ------------------ */
// //   const handleSubmit = async () => {
// //     const { username, email, phoneNumber, role } = form;

// //     if (!username || !email || !phoneNumber) {
// //       alert("Please fill in all fields.");
// //       return;
// //     }

// //     try {
// //       await createAdmin({
// //         username,
// //         email,
// //         phoneNumber,
// //         role,
// //         permissions: form.permissions,
// //       });

// //       alert("Admin created successfully.");

// //       setShowModal(false);
// //       resetForm();
// //       fetchAdmins();
// //     } catch (error) {
// //       console.error("Create failed:", error);
// //       alert(error.message || "Failed to create admin");
// //     }
// //   };

// //   /* ------------------ DELETE ADMIN ------------------ */
// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this admin?")) return;

// //     try {
// //       await deleteAdmin(id);
// //       setAdmins((prev) => prev.filter((item) => item._id !== id));
// //     } catch (error) {
// //       console.error("Delete failed:", error);
// //       alert(error.message || "Failed to delete admin.");
// //     }
// //   };

// //   /* ------------------ RENDER ------------------ */
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 space-y-6">
// //       {/* ----------- STAT CARDS ----------- */}
// //       <StatCard
// //         pageTitle="Roles & Admins"
// //         pageSubtitle="Manage system admins and moderators"
// //         buttonText="Create Admin / Moderator"
// //         onButtonClick={() => setShowModal(true)}
// //         stats={stats}
// //       />

// //       {/* ----------- MODAL ----------- */}
// //       {showModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
// //           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
// //             {/* HEADER */}
// //             <div className="flex justify-between items-start px-8 py-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
// //               <div>
// //                 <h2 className="text-2xl font-bold text-gray-900">
// //                   Create New Admin User
// //                 </h2>
// //                 <p className="text-sm text-gray-600 mt-1">
// //                   Add a new user and assign system permissions.
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   setShowModal(false);
// //                   resetForm();
// //                 }}
// //                 className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
// //               >
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
// //               {/* PERSONAL INFO */}
// //               <div>
// //                 <h3 className="text-xs font-bold tracking-wider text-emerald-700 mb-4 uppercase flex items-center gap-2">
// //                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// //                   </svg>
// //                   Personal Information
// //                 </h3>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //                   <div className="space-y-2">
// //                     <label className="text-sm font-medium text-gray-700">Email Address</label>
// //                     <input
// //                       name="email"
// //                       type="email"
// //                       placeholder="admin@company.com"
// //                       value={form.email}
// //                       onChange={handleChange}
// //                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <label className="text-sm font-medium text-gray-700">Full Name</label>
// //                     <input
// //                       name="username"
// //                       placeholder="John Doe"
// //                       value={form.username}
// //                       onChange={handleChange}
// //                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <label className="text-sm font-medium text-gray-700">Phone Number</label>
// //                     <input
// //                       name="phoneNumber"
// //                       placeholder="+1 (555) 000-0000"
// //                       value={form.phoneNumber}
// //                       onChange={handleChange}
// //                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
// //                   <p className="text-xs text-blue-700 flex items-start gap-2">
// //                     <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                     </svg>
// //                     <span>Password will be automatically generated using the admin's name and phone number.</span>
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* PERMISSIONS */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-xs font-bold tracking-wider text-emerald-700 uppercase flex items-center gap-2">
// //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
// //                     </svg>
// //                     Assign Permissions
// //                   </h3>
// //                   <button
// //                     type="button"
// //                     onClick={selectAllPermissions}
// //                     className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
// //                   >
// //                     Select All
// //                   </button>
// //                 </div>

// //                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
// //                   <div className="grid grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-bold text-gray-700 p-4 uppercase tracking-wider">
// //                     <span>Module</span>
// //                     <span className="text-center">View</span>
// //                     <span className="text-center">Create</span>
// //                     <span className="text-center">Edit</span>
// //                     <span className="text-center">Delete</span>
// //                   </div>

// //                   {Object.entries(form.permissions).map(
// //                     ([module, perms], idx) => (
// //                       <div
// //                         key={module}
// //                         className={`grid grid-cols-5 items-center p-4 text-sm ${
// //                           idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
// //                         } hover:bg-emerald-50/50 transition-colors`}
// //                       >
// //                         <span className="font-medium text-gray-700">
// //                           {MODULES[module] || module}
// //                         </span>

// //                         {["view", "create", "edit", "delete"].map(
// //                           (action) => (
// //                             <div
// //                               key={action}
// //                               className="flex justify-center"
// //                             >
// //                               <input
// //                                 type="checkbox"
// //                                 checked={perms[action]}
// //                                 disabled={
// //                                   action !== "view" && !perms.view
// //                                 }
// //                                 onChange={() =>
// //                                   togglePermission(
// //                                     module,
// //                                     action
// //                                   )
// //                                 }
// //                                 className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
// //                               />
// //                             </div>
// //                           )
// //                         )}
// //                       </div>
// //                     )
// //                   )}
// //                 </div>

// //                 <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
// //                   <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                   </svg>
// //                   <span>Deselecting "View" will automatically disable all other actions for that module.</span>
// //                 </p>
// //               </div>

// //               {/* FOOTER */}
// //               <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setShowModal(false);
// //                     resetForm();
// //                   }}
// //                   className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={handleSubmit}
// //                   className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
// //                 >
// //                   Create Admin
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ----------- DATA TABLE ----------- */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
// //         <DataTable
// //           title="Roles & Admins"
// //           subtitle="Manage admins and moderators"
// //           columns={["Full Name", "Email", "Phone Number", "Role"]}
// //           data={admins}
// //           searchableKeys={["username", "email", "phoneNumber"]}
// //           filterKey="role"
// //           filterOptions={[
// //             { label: "Admin", value: "admin" },
// //             { label: "Moderator", value: "moderator" },
// //             { label: "Super Admin", value: "super_admin" },
// //           ]}
// //           emptyState={loading ? "Loading..." : "No admins found"}
// //           renderRow={(row) => (
// //             <>
// //               <td className="px-6 py-4 font-medium text-gray-900">
// //                 {row.username || "—"}
// //               </td>
// //               <td className="px-6 py-4 text-gray-600">{row.email}</td>
// //               <td className="px-6 py-4 text-gray-600">
// //                 {row.phoneNumber || "—"}
// //               </td>
// //               <td className="px-6 py-4">
// //                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
// //                   row.role === 'super_admin' 
// //                     ? 'bg-purple-100 text-purple-700'
// //                     : row.role === 'admin'
// //                     ? 'bg-blue-100 text-blue-700'
// //                     : 'bg-yellow-100 text-yellow-700'
// //                 }`}>
// //                   {row.role.replace("_", " ").toUpperCase()}
// //                 </span>
// //               </td>
// //             </>
// //           )}
// //           actions={(row) => (
// //             <div className="flex justify-center gap-2">
// //               <button className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
// //                 Edit
// //               </button>
// //               <button
// //                 onClick={() => handleDelete(row._id)}
// //                 className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           )}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminRoles;

// // import { useState, useMemo, useEffect } from "react";
// // import DataTable from "../components/DataTable";
// // import StatCard from "../components/StatCard";
// // import { Users, ShieldCheck, UserCheck } from "lucide-react";
// // import {
// //   getAdmins,
// //   deleteAdmin,
// //   createAdmin,
// //   updateAdmin, // Add this import
// // } from "../../services/adminAPI";

// // const MODULES = {
// //   products: "Product Management",
// //   users: "User Management",
// //   orders: "Order Processing",
// //   payments: "Payment Gateway",
// //   content: "Content Management",
// // };

// // const defaultPermissions = {
// //   products: { view: true, create: false, edit: false, delete: false },
// //   users: { view: false, create: false, edit: false, delete: false },
// //   orders: { view: true, create: false, edit: false, delete: false },
// //   payments: { view: false, create: false, edit: false, delete: false },
// //   content: { view: true, create: true, edit: true, delete: true },
// // };

// // const AdminRoles = () => {
// //   /* ------------------ API DATA ------------------ */
// //   const [admins, setAdmins] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [editingAdminId, setEditingAdminId] = useState(null);

// //   /* ------------------ FORM STATE ------------------ */
// //   const [form, setForm] = useState({
// //     username: "",
// //     email: "",
// //     phoneNumber: "",
// //     role: "admin",
// //     permissions: defaultPermissions,
// //   });

// //   /* ------------------ FETCH ADMINS ------------------ */
// //   useEffect(() => {
// //     fetchAdmins();
// //   }, []);

// //   const fetchAdmins = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAdmins();
// //       setAdmins(data);
// //     } catch (error) {
// //       console.error("Failed to fetch admins:", error);
// //       alert("Failed to load admins");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ------------------ STATS ------------------ */
// //   const totalUsers = admins.length;
// //   const totalAdmins = admins.filter((a) => a.role === "admin").length;
// //   const totalModerators = admins.filter((a) => a.role === "moderator").length;

// //   const stats = useMemo(
// //     () => [
// //       {
// //         title: "Total Admins & Mods",
// //         value: totalUsers,
// //         subtitle: "All system staff",
// //         Icon: Users,
// //         iconBg: "bg-emerald-100",
// //         iconColor: "text-emerald-600",
// //       },
// //       {
// //         title: "Admins",
// //         value: totalAdmins,
// //         subtitle: "System managers",
// //         Icon: ShieldCheck,
// //         iconBg: "bg-blue-100",
// //         iconColor: "text-blue-600",
// //       },
// //       {
// //         title: "Moderators",
// //         value: totalModerators,
// //         subtitle: "Content reviewers",
// //         Icon: UserCheck,
// //         iconBg: "bg-yellow-100",
// //         iconColor: "text-yellow-600",
// //       },
// //     ],
// //     [totalUsers, totalAdmins, totalModerators]
// //   );

// //   /* ------------------ FORM HANDLERS ------------------ */
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const togglePermission = (module, action) => {
// //     setForm((prev) => {
// //       const updated = JSON.parse(JSON.stringify(prev.permissions));

// //       if (action === "view") {
// //         const newValue = !updated[module].view;
// //         updated[module] = {
// //           view: newValue,
// //           create: newValue ? updated[module].create : false,
// //           edit: newValue ? updated[module].edit : false,
// //           delete: newValue ? updated[module].delete : false,
// //         };
// //       } else {
// //         updated[module][action] = !updated[module][action];
// //       }

// //       return { ...prev, permissions: updated };
// //     });
// //   };

// //   const selectAllPermissions = () => {
// //     const all = {};
// //     Object.keys(defaultPermissions).forEach((m) => {
// //       all[m] = {
// //         view: true,
// //         create: true,
// //         edit: true,
// //         delete: true,
// //       };
// //     });

// //     setForm((prev) => ({ ...prev, permissions: all }));
// //   };

// //   const resetForm = () => {
// //     setForm({
// //       username: "",
// //       email: "",
// //       phoneNumber: "",
// //       role: "admin",
// //       permissions: defaultPermissions,
// //     });
// //     setIsEditMode(false);
// //     setEditingAdminId(null);
// //   };

// //   /* ------------------ EDIT ADMIN ------------------ */
// //   const handleEdit = (admin) => {
// //     setIsEditMode(true);
// //     setEditingAdminId(admin._id);
// //     setForm({
// //       username: admin.username || "",
// //       email: admin.email || "",
// //       phoneNumber: admin.phoneNumber || "",
// //       role: admin.role || "admin",
// //       permissions: admin.permissions || defaultPermissions,
// //     });
// //     setShowModal(true);
// //   };

// //   /* ------------------ CREATE/UPDATE ADMIN ------------------ */
// //   const handleSubmit = async () => {
// //     const { username, email, phoneNumber, role } = form;

// //     if (!username || !email || !phoneNumber) {
// //       alert("Please fill in all fields.");
// //       return;
// //     }

// //     try {
// //       if (isEditMode) {
// //         // Update existing admin (only permissions)
// //         await updateAdmin(editingAdminId, {
// //           permissions: form.permissions,
// //         });
// //         alert("Admin permissions updated successfully.");
// //       } else {
// //         // Create new admin
// //         await createAdmin({
// //           username,
// //           email,
// //           phoneNumber,
// //           role,
// //           permissions: form.permissions,
// //         });
// //         alert("Admin created successfully.");
// //       }

// //       setShowModal(false);
// //       resetForm();
// //       fetchAdmins();
// //     } catch (error) {
// //       console.error(isEditMode ? "Update failed:" : "Create failed:", error);
// //       alert(error.message || `Failed to ${isEditMode ? "update" : "create"} admin`);
// //     }
// //   };

// //   /* ------------------ DELETE ADMIN ------------------ */
// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this admin?")) return;

// //     try {
// //       await deleteAdmin(id);
// //       setAdmins((prev) => prev.filter((item) => item._id !== id));
// //     } catch (error) {
// //       console.error("Delete failed:", error);
// //       alert(error.message || "Failed to delete admin.");
// //     }
// //   };

// //   /* ------------------ RENDER ------------------ */
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 space-y-6">
// //       {/* ----------- STAT CARDS ----------- */}
// //       <StatCard
// //         pageTitle="Roles & Admins"
// //         pageSubtitle="Manage system admins and moderators"
// //         buttonText="Create Admin / Moderator"
// //         onButtonClick={() => setShowModal(true)}
// //         stats={stats}
// //       />

// //       {/* ----------- MODAL ----------- */}
// //       {showModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
// //           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
// //             {/* HEADER */}
// //             <div className="flex justify-between items-start px-8 py-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
// //               <div>
// //                 <h2 className="text-2xl font-bold text-gray-900">
// //                   {isEditMode ? "Edit Admin Permissions" : "Create New Admin User"}
// //                 </h2>
// //                 <p className="text-sm text-gray-600 mt-1">
// //                   {isEditMode 
// //                     ? "Update permissions for this admin user." 
// //                     : "Add a new user and assign system permissions."}
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   setShowModal(false);
// //                   resetForm();
// //                 }}
// //                 className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
// //               >
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
// //               {/* PERSONAL INFO */}
// //               <div>
// //                 <h3 className="text-xs font-bold tracking-wider text-emerald-700 mb-4 uppercase flex items-center gap-2">
// //                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// //                   </svg>
// //                   Personal Information
// //                 </h3>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //                   <div className="space-y-2">
// //                     <label className="text-sm font-medium text-gray-700">Email Address</label>
// //                     <input
// //                       name="email"
// //                       type="email"
// //                       placeholder="admin@company.com"
// //                       value={form.email}
// //                       onChange={handleChange}
// //                       disabled={isEditMode}
// //                       className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-all outline-none ${
// //                         isEditMode 
// //                           ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
// //                           : 'focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
// //                       }`}
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <label className="text-sm font-medium text-gray-700">Full Name</label>
// //                     <input
// //                       name="username"
// //                       placeholder="John Doe"
// //                       value={form.username}
// //                       onChange={handleChange}
// //                       disabled={isEditMode}
// //                       className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-all outline-none ${
// //                         isEditMode 
// //                           ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
// //                           : 'focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
// //                       }`}
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <label className="text-sm font-medium text-gray-700">Phone Number</label>
// //                     <input
// //                       name="phoneNumber"
// //                       placeholder="+1 (555) 000-0000"
// //                       value={form.phoneNumber}
// //                       onChange={handleChange}
// //                       disabled={isEditMode}
// //                       className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-all outline-none ${
// //                         isEditMode 
// //                           ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
// //                           : 'focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
// //                       }`}
// //                     />
// //                   </div>
// //                 </div>

// //                 {!isEditMode && (
// //                   <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
// //                     <p className="text-xs text-blue-700 flex items-start gap-2">
// //                       <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                       </svg>
// //                       <span>Password will be automatically generated using the admin's name and phone number.</span>
// //                     </p>
// //                   </div>
// //                 )}

// //                 {isEditMode && (
// //                   <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
// //                     <p className="text-xs text-amber-700 flex items-start gap-2">
// //                       <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                       </svg>
// //                       <span>Personal information cannot be modified in edit mode. Only permissions can be updated.</span>
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* PERMISSIONS */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-xs font-bold tracking-wider text-emerald-700 uppercase flex items-center gap-2">
// //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
// //                     </svg>
// //                     Assign Permissions
// //                   </h3>
// //                   <button
// //                     type="button"
// //                     onClick={selectAllPermissions}
// //                     className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
// //                   >
// //                     Select All
// //                   </button>
// //                 </div>

// //                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
// //                   <div className="grid grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-bold text-gray-700 p-4 uppercase tracking-wider">
// //                     <span>Module</span>
// //                     <span className="text-center">View</span>
// //                     <span className="text-center">Create</span>
// //                     <span className="text-center">Edit</span>
// //                     <span className="text-center">Delete</span>
// //                   </div>

// //                   {Object.entries(form.permissions).map(
// //                     ([module, perms], idx) => (
// //                       <div
// //                         key={module}
// //                         className={`grid grid-cols-5 items-center p-4 text-sm ${
// //                           idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
// //                         } hover:bg-emerald-50/50 transition-colors`}
// //                       >
// //                         <span className="font-medium text-gray-700">
// //                           {MODULES[module] || module}
// //                         </span>

// //                         {["view", "create", "edit", "delete"].map(
// //                           (action) => (
// //                             <div
// //                               key={action}
// //                               className="flex justify-center"
// //                             >
// //                               <input
// //                                 type="checkbox"
// //                                 checked={perms[action]}
// //                                 disabled={
// //                                   action !== "view" && !perms.view
// //                                 }
// //                                 onChange={() =>
// //                                   togglePermission(
// //                                     module,
// //                                     action
// //                                   )
// //                                 }
// //                                 className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
// //                               />
// //                             </div>
// //                           )
// //                         )}
// //                       </div>
// //                     )
// //                   )}
// //                 </div>

// //                 <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
// //                   <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                   </svg>
// //                   <span>Deselecting "View" will automatically disable all other actions for that module.</span>
// //                 </p>
// //               </div>

// //               {/* FOOTER */}
// //               <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setShowModal(false);
// //                     resetForm();
// //                   }}
// //                   className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={handleSubmit}
// //                   className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
// //                 >
// //                   {isEditMode ? "Update Permissions" : "Create Admin"}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ----------- DATA TABLE ----------- */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
// //         <DataTable
// //           title="Roles & Admins"
// //           subtitle="Manage admins and moderators"
// //           columns={["Full Name", "Email", "Phone Number", "Role"]}
// //           data={admins}
// //           searchableKeys={["username", "email", "phoneNumber"]}
// //           filterKey="role"
// //           filterOptions={[
// //             { label: "Admin", value: "admin" },
// //             { label: "Moderator", value: "moderator" },
// //             { label: "Super Admin", value: "super_admin" },
// //           ]}
// //           emptyState={loading ? "Loading..." : "No admins found"}
// //           renderRow={(row) => (
// //             <>
// //               <td className="px-6 py-4 font-medium text-gray-900">
// //                 {row.username || "—"}
// //               </td>
// //               <td className="px-6 py-4 text-gray-600">{row.email}</td>
// //               <td className="px-6 py-4 text-gray-600">
// //                 {row.phoneNumber || "—"}
// //               </td>
// //               <td className="px-6 py-4">
// //                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
// //                   row.role === 'super_admin' 
// //                     ? 'bg-purple-100 text-purple-700'
// //                     : row.role === 'admin'
// //                     ? 'bg-blue-100 text-blue-700'
// //                     : 'bg-yellow-100 text-yellow-700'
// //                 }`}>
// //                   {row.role.replace("_", " ").toUpperCase()}
// //                 </span>
// //               </td>
// //             </>
// //           )}
// //           actions={(row) => (
// //             <div className="flex justify-center gap-2">
// //               <button 
// //                 onClick={() => handleEdit(row)}
// //                 className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
// //               >
// //                 Edit
// //               </button>
// //               <button
// //                 onClick={() => handleDelete(row._id)}
// //                 className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           )}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminRoles;

// import { useState, useMemo, useEffect } from "react";
// import DataTable from "../components/DataTable";
// import StatCard from "../components/StatCard";
// import { Users, ShieldCheck, UserCheck } from "lucide-react";
// import {
//   getAdmins,
//   deleteAdmin,
//   createAdmin,
//   updateAdmin,
// } from "../../services/adminAPI";

// // ================= MODULE LABELS =================
// const MODULES = {
//   products: "Product Management",
//   users: "User Management",
//   orders: "Order Processing",
//   payments: "Payment Gateway",
//   content: "Content Management",
// };

// // ================= DEFAULT PERMISSIONS =================
// // USERS: no "create" allowed at all
// const defaultPermissions = {
//   products: { view: true, create: false, edit: false, delete: false },
//   users: { view: false, create: false, edit: false, delete: false },
//   orders: { view: true, create: false, edit: false, delete: false },
//   payments: { view: false, create: false, edit: false, delete: false },
//   content: { view: true, create: true, edit: true, delete: true },
// };

// const AdminRoles = () => {
//   /* ------------------ API DATA ------------------ */
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingAdminId, setEditingAdminId] = useState(null);

//   /* ------------------ FORM STATE ------------------ */
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phoneNumber: "",
//     role: "admin",
//     permissions: defaultPermissions,
//   });

//   /* ------------------ FETCH ADMINS ------------------ */
//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     try {
//       setLoading(true);
//       const data = await getAdmins();
//       setAdmins(data);
//     } catch (error) {
//       console.error("Failed to fetch admins:", error);
//       alert("Failed to load admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------ STATS ------------------ */
//   const totalUsers = admins.length;
//   const totalAdmins = admins.filter((a) => a.role === "admin").length;
//   const totalModerators = admins.filter((a) => a.role === "moderator").length;

//   const stats = useMemo(
//     () => [
//       {
//         title: "Total Admins & Mods",
//         value: totalUsers,
//         subtitle: "All system staff",
//         Icon: Users,
//         iconBg: "bg-emerald-100",
//         iconColor: "text-emerald-600",
//       },
//       {
//         title: "Admins",
//         value: totalAdmins,
//         subtitle: "System managers",
//         Icon: ShieldCheck,
//         iconBg: "bg-blue-100",
//         iconColor: "text-blue-600",
//       },
//       {
//         title: "Moderators",
//         value: totalModerators,
//         subtitle: "Content reviewers",
//         Icon: UserCheck,
//         iconBg: "bg-yellow-100",
//         iconColor: "text-yellow-600",
//       },
//     ],
//     [totalUsers, totalAdmins, totalModerators]
//   );

//   /* ------------------ FORM HANDLERS ------------------ */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Toggle permissions (create is DISABLED for users module)
//   const togglePermission = (module, action) => {
//     if (module === "users" && action === "create") return;

//     setForm((prev) => {
//       const updated = JSON.parse(JSON.stringify(prev.permissions));

//       if (action === "view") {
//         const newValue = !updated[module].view;
//         updated[module] = {
//           view: newValue,
//           create:
//             module === "users"
//               ? false
//               : newValue
//               ? updated[module].create
//               : false,
//           edit: newValue ? updated[module].edit : false,
//           delete: newValue ? updated[module].delete : false,
//         };
//       } else {
//         updated[module][action] = !updated[module][action];
//       }

//       return { ...prev, permissions: updated };
//     });
//   };

//   // Select all EXCEPT users.create
//   const selectAllPermissions = () => {
//     const all = {};
//     Object.keys(defaultPermissions).forEach((m) => {
//       all[m] = {
//         view: true,
//         create: m === "users" ? false : true,
//         edit: true,
//         delete: true,
//       };
//     });

//     setForm((prev) => ({ ...prev, permissions: all }));
//   };

//   const resetForm = () => {
//     setForm({
//       username: "",
//       email: "",
//       phoneNumber: "",
//       role: "admin",
//       permissions: defaultPermissions,
//     });
//     setIsEditMode(false);
//     setEditingAdminId(null);
//   };

//   /* ------------------ EDIT ADMIN ------------------ */
//   const handleEdit = (admin) => {
//     setIsEditMode(true);
//     setEditingAdminId(admin._id);
//     setForm({
//       username: admin.username || "",
//       email: admin.email || "",
//       phoneNumber: admin.phoneNumber || "",
//       role: admin.role || "admin",
//       permissions: admin.permissions || defaultPermissions,
//     });
//     setShowModal(true);
//   };

//   /* ------------------ CREATE/UPDATE ADMIN ------------------ */
//   const handleSubmit = async () => {
//     const { username, email, phoneNumber, role } = form;

//     if (!username || !email || !phoneNumber) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       if (isEditMode) {
//         await updateAdmin(editingAdminId, {
//           permissions: form.permissions,
//         });
//         alert("Admin permissions updated successfully.");
//       } else {
//         await createAdmin({
//           username,
//           email,
//           phoneNumber,
//           role,
//           permissions: form.permissions,
//         });
//         alert("Admin created successfully.");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchAdmins();
//     } catch (error) {
//       console.error(isEditMode ? "Update failed:" : "Create failed:", error);
//       alert(error.message || `Failed to ${isEditMode ? "update" : "create"} admin`);
//     }
//   };

//   /* ------------------ DELETE ADMIN ------------------ */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this admin?")) return;

//     try {
//       await deleteAdmin(id);
//       setAdmins((prev) => prev.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Delete failed:", error);
//       alert(error.message || "Failed to delete admin.");
//     }
//   };

//   /* ------------------ RENDER ------------------ */
//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-6">
//       <StatCard
//         pageTitle="Roles & Admins"
//         pageSubtitle="Manage system admins and moderators"
//         buttonText="Create Admin / Moderator"
//         onButtonClick={() => setShowModal(true)}
//         stats={stats}
//       />

//       {/* ----------- MODAL ----------- */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
//             <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
//               {/* PERMISSIONS */}
//               <div>
//                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                   <div className="grid grid-cols-5 bg-gray-100 text-xs font-bold text-gray-700 p-4 uppercase">
//                     <span>Module</span>
//                     <span className="text-center">View</span>
//                     <span className="text-center">Create</span>
//                     <span className="text-center">Edit</span>
//                     <span className="text-center">Delete</span>
//                   </div>

//                   {Object.entries(form.permissions).map(
//                     ([module, perms], idx) => (
//                       <div
//                         key={module}
//                         className={`grid grid-cols-5 items-center p-4 text-sm ${
//                           idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                         }`}
//                       >
//                         <span className="font-medium text-gray-700">
//                           {MODULES[module] || module}
//                         </span>

//                         {["view", "create", "edit", "delete"].map((action) => {
//                           const isUsersCreate =
//                             module === "users" && action === "create";

//                           return (
//                             <div key={action} className="flex justify-center">
//                               {isUsersCreate ? (
//                                 <span className="text-gray-400 text-xs italic">
//                                   N/A
//                                 </span>
//                               ) : (
//                                 <input
//                                   type="checkbox"
//                                   checked={perms[action]}
//                                   disabled={
//                                     (action !== "view" && !perms.view) ||
//                                     isUsersCreate
//                                   }
//                                   onChange={() =>
//                                     togglePermission(module, action)
//                                   }
//                                   className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
//                                 />
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )
//                   )}
//                 </div>

//                 <p className="text-xs text-gray-500 mt-3">
//                   User creation is disabled. Website users can only register
//                   themselves.
//                 </p>
//               </div>

//               {/* FOOTER */}
//               <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//                 >
//                   {isEditMode ? "Update Permissions" : "Create Admin"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ----------- DATA TABLE ----------- */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <DataTable
//           title="Roles & Admins"
//           subtitle="Manage admins and moderators"
//           columns={["Full Name", "Email", "Phone Number", "Role"]}
//           data={admins}
//           searchableKeys={["username", "email", "phoneNumber"]}
//           filterKey="role"
//           filterOptions={[
//             { label: "Admin", value: "admin" },
//             { label: "Moderator", value: "moderator" },
//             { label: "Super Admin", value: "super_admin" },
//           ]}
//           emptyState={loading ? "Loading..." : "No admins found"}
//           renderRow={(row) => (
//             <>
//               <td className="px-6 py-4 font-medium text-gray-900">
//                 {row.username || "—"}
//               </td>
//               <td className="px-6 py-4 text-gray-600">{row.email}</td>
//               <td className="px-6 py-4 text-gray-600">
//                 {row.phoneNumber || "—"}
//               </td>
//               <td className="px-6 py-4">
//                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
//                   {row.role.replace("_", " ").toUpperCase()}
//                 </span>
//               </td>
//             </>
//           )}
//           actions={(row) => (
//             <div className="flex justify-center gap-2">
//               <button
//                 onClick={() => handleEdit(row)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(row._id)}
//                 className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminRoles;

import { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import {
  getAdmins,
  deleteAdmin,
  createAdmin,
  updateAdmin,
} from "../../services/adminAPI";

// ================= MODULE LABELS =================
const MODULES = {
  products: "Product Management",
  users: "User Management",
  orders: "Order Processing",
  payments: "Payment Gateway",
  content: "Content Management",
};

// ================= DEFAULT PERMISSIONS =================
const defaultPermissions = {
  products: { view: true, create: false, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
  orders: { view: true, create: false, edit: false, delete: false },
  payments: { view: false, create: false, edit: false, delete: false },
  content: { view: true, create: true, edit: true, delete: true },
};

const AdminRoles = () => {
  /* ------------------ API DATA ------------------ */
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState(null);

  /* ------------------ FORM STATE ------------------ */
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    role: "admin",
    permissions: defaultPermissions,
  });

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

  /* ------------------ FORM HANDLERS ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (module, action) => {
    if (module === "users" && action === "create") return;

    setForm((prev) => {
      const updated = JSON.parse(JSON.stringify(prev.permissions));

      if (action === "view") {
        const newValue = !updated[module].view;
        updated[module] = {
          view: newValue,
          create:
            module === "users"
              ? false
              : newValue
              ? updated[module].create
              : false,
          edit: newValue ? updated[module].edit : false,
          delete: newValue ? updated[module].delete : false,
        };
      } else {
        updated[module][action] = !updated[module][action];
      }

      return { ...prev, permissions: updated };
    });
  };

  const selectAllPermissions = () => {
    const all = {};
    Object.keys(defaultPermissions).forEach((m) => {
      all[m] = {
        view: true,
        create: m === "users" ? false : true,
        edit: true,
        delete: true,
      };
    });

    setForm((prev) => ({ ...prev, permissions: all }));
  };

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      phoneNumber: "",
      role: "admin",
      permissions: defaultPermissions,
    });
    setIsEditMode(false);
    setEditingAdminId(null);
  };

  const handleEdit = (admin) => {
    setIsEditMode(true);
    setEditingAdminId(admin._id);
    setForm({
      username: admin.username || "",
      email: admin.email || "",
      phoneNumber: admin.phoneNumber || "",
      role: admin.role || "admin",
      permissions: admin.permissions || defaultPermissions,
    });
    setShowModal(true);
  };

  /* ------------------ CREATE/UPDATE ADMIN ------------------ */
  const handleSubmit = async () => {
    const { username, email, phoneNumber, role } = form;

    if (!username || !email || !phoneNumber) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (isEditMode) {
        await updateAdmin(editingAdminId, {
          permissions: form.permissions,
        });
        alert("Admin permissions updated successfully.");
      } else {
        await createAdmin({
          username,
          email,
          phoneNumber,
          role,
          permissions: form.permissions,
        });
        alert("Admin created successfully.");
      }

      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch (error) {
      console.error(isEditMode ? "Update failed:" : "Create failed:", error);
      alert(error.message || `Failed to ${isEditMode ? "update" : "create"} admin`);
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <StatCard
        pageTitle="Roles & Admins"
        pageSubtitle="Manage system admins and moderators"
        buttonText="Create Admin / Moderator"
        onButtonClick={() => setShowModal(true)}
        stats={stats}
      />

      {/* ----------- MODAL ----------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">

              {/* ===== BASIC INFO FIELDS ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              {/* ===== PERMISSIONS TABLE ===== */}
              <div>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-5 bg-gray-100 text-xs font-bold text-gray-700 p-4 uppercase">
                    <span>Module</span>
                    <span className="text-center">View</span>
                    <span className="text-center">Create</span>
                    <span className="text-center">Edit</span>
                    <span className="text-center">Delete</span>
                  </div>

                  {Object.entries(form.permissions).map(([module, perms], idx) => (
                    <div
                      key={module}
                      className={`grid grid-cols-5 items-center p-4 text-sm ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-medium text-gray-700">
                        {MODULES[module] || module}
                      </span>

                      {["view", "create", "edit", "delete"].map((action) => {
                        const isUsersCreate = module === "users" && action === "create";
                        return (
                          <div key={action} className="flex justify-center">
                            {isUsersCreate ? (
                              <span className="text-gray-400 text-xs italic">N/A</span>
                            ) : (
                              <input
                                type="checkbox"
                                checked={perms[action]}
                                disabled={(action !== "view" && !perms.view) || isUsersCreate}
                                onChange={() => togglePermission(module, action)}
                                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  User creation is disabled. Website users can only register themselves.
                </p>
              </div>

              {/* ===== FOOTER ===== */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isEditMode ? "Update Permissions" : "Create Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------- DATA TABLE ----------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          title="Roles & Admins"
          subtitle="Manage admins and moderators"
          columns={["Full Name", "Email", "Phone Number", "Role"]}
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
              <td className="px-6 py-4 font-medium text-gray-900">{row.username || "—"}</td>
              <td className="px-6 py-4 text-gray-600">{row.email}</td>
              <td className="px-6 py-4 text-gray-600">{row.phoneNumber || "—"}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {row.role.replace("_", " ").toUpperCase()}
                </span>
              </td>
            </>
          )}
          actions={(row) => (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(row)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row._id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default AdminRoles;
