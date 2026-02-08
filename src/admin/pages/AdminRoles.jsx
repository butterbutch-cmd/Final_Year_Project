// // src/admin/AdminRoles.jsx
// import { useState, useMemo, useEffect } from "react";
// import DataTable from "../components/DataTable";
// import StatCard from "../components/StatCard";
// import { Users, ShieldCheck, Building2 } from "lucide-react";
// import {
//   getAdmins,
//   deleteAdmin,
//   createAdmin,
//   updateAdmin,
// } from "../../services/adminAPI";

// import {
//   getDepartments,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../../services/departmentAPI";

// // ================= MODULE LABELS =================
// const MODULES = {
//   products: "Product Management",
//   users: "User Management",
//   orders: "Order Processing",
//   payments: "Payment Gateway",
//   content: "Content Management",
// };

// // ================= DEFAULT PERMISSIONS =================
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
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingAdminId, setEditingAdminId] = useState(null);

//   /* ------------------ DEPARTMENT MODAL ------------------ */
//   const [showDeptModal, setShowDeptModal] = useState(false);
//   const [deptEditMode, setDeptEditMode] = useState(false);
//   const [editingDeptId, setEditingDeptId] = useState(null);
//   const [isCreatingNew, setIsCreatingNew] = useState(false);
//   const [deptSearchQuery, setDeptSearchQuery] = useState("");
//   const [deptForm, setDeptForm] = useState({
//     name: "",
//     description: "",
//     permissions: defaultPermissions,
//   });

//   /* ------------------ FORM STATE ------------------ */
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phoneNumber: "",
//     role: "admin",
//     department: "", // department id
//     permissions: defaultPermissions,
//   });

//   /* ------------------ FETCH DATA ------------------ */
//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([fetchAdmins(), fetchDepartments()]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAdmins = async () => {
//     try {
//       const data = await getAdmins();
//       setAdmins(data || []);
//     } catch (error) {
//       console.error("Failed to fetch admins:", error);
//       alert("Failed to load admins");
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const d = await getDepartments();
//       setDepartments(d || []);
//     } catch (error) {
//       console.error("Failed to fetch departments:", error);
//       alert("Failed to load departments");
//     }
//   };

//   /* ------------------ STATS ------------------ */
//   const totalUsers = admins.length;
//   const totalAdmins = admins.filter((a) => a.role === "admin").length;
//   const totalSuperAdmins = admins.filter((a) => a.role === "super_admin").length;

//   const stats = useMemo(
//     () => [
//       {
//         title: "Total Admins & Staff",
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
//         title: "Super Admins",
//         value: totalSuperAdmins,
//         subtitle: "Full access",
//         Icon: Building2,
//         iconBg: "bg-yellow-100",
//         iconColor: "text-yellow-600",
//       },
//     ],
//     [totalUsers, totalAdmins, totalSuperAdmins]
//   );

//   /* ------------------ FORM HANDLERS ------------------ */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDepartmentSelect = (deptId) => {
//     const dept = departments.find((d) => d._id === deptId);
//     setForm((prev) => ({
//       ...prev,
//       department: deptId,
//       permissions: dept ? dept.permissions : defaultPermissions,
//     }));
//   };

//   const togglePermission = (module, action) => {
//     if (module === "users" && action === "create") return;

//     setForm((prev) => {
//       const updated = JSON.parse(JSON.stringify(prev.permissions || defaultPermissions));

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

//   const resetForm = () => {
//     setForm({
//       username: "",
//       email: "",
//       phoneNumber: "",
//       role: "admin",
//       department: "",
//       permissions: defaultPermissions,
//     });
//     setIsEditMode(false);
//     setEditingAdminId(null);
//   };

//   const handleEdit = (admin) => {
//     setIsEditMode(true);
//     setEditingAdminId(admin._id);
//     setForm({
//       username: admin.username || "",
//       email: admin.email || "",
//       phoneNumber: admin.phoneNumber || "",
//       role: admin.role || "admin",
//       department: admin.department?._id || admin.department || "",
//       permissions:
//         admin.permissions ||
//         (admin.department && admin.department.permissions) ||
//         defaultPermissions,
//     });
//     setShowModal(true);
//   };

//   /* ------------------ CREATE/UPDATE ADMIN ------------------ */
//   const handleSubmit = async () => {
//     const { username, email, phoneNumber, role, department, permissions } = form;

//     if (!username || !email || !phoneNumber) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (role === "admin" && !department) {
//       if (!window.confirm("Create admin without a department? (Not recommended)")) return;
//     }

//     try {
//       if (isEditMode) {
//         await updateAdmin(editingAdminId, {
//           phoneNumber,
//           permissions,
//           department,
//         });
//         alert("Admin updated successfully.");
//       } else {
//         await createAdmin({
//           username,
//           email,
//           phoneNumber,
//           role,
//           department,
//           permissions,
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

//   /* ------------------ DEPARTMENT HANDLERS ------------------ */
//   const openCreateDept = () => {
//     setDeptEditMode(false);
//     setEditingDeptId(null);
//     setIsCreatingNew(true);
//     setDeptForm({ name: "", description: "", permissions: defaultPermissions });
//   };

//   const handleDeptEdit = (dept) => {
//     setDeptEditMode(true);
//     setEditingDeptId(dept._id);
//     setIsCreatingNew(false);
//     setDeptForm({
//       name: dept.name,
//       description: dept.description || "",
//       permissions: dept.permissions || defaultPermissions,
//     });
//   };

//   const handleDeptSubmit = async () => {
//     const { name, description, permissions } = deptForm;
//     if (!name.trim()) {
//       alert("Department name is required");
//       return;
//     }
//     try {
//       if (deptEditMode) {
//         await updateDepartment(editingDeptId, { name, description, permissions });
//         alert("Department updated successfully!");
//       } else {
//         const newDept = await createDepartment({ name, description, permissions });
//         alert("Department created successfully!");
//         // Switch to edit mode for the newly created department
//         if (newDept && newDept._id) {
//           setDeptEditMode(true);
//           setEditingDeptId(newDept._id);
//           setIsCreatingNew(false);
//         }
//       }
//       await fetchDepartments();
//     } catch (err) {
//       console.error("Dept save failed:", err);
//       alert(err.message || "Failed to save department");
//     }
//   };

//   const handleDeptDelete = async (id) => {
//     const affectedAdmins = admins.filter(a => a.department?._id === id || a.department === id).length;
//     const confirmMsg = affectedAdmins > 0
//       ? `Delete this department? ${affectedAdmins} admin(s) are currently assigned and will lose their department assignment.`
//       : "Delete this department?";
    
//     if (!window.confirm(confirmMsg)) return;
    
//     try {
//       await deleteDepartment(id);
//       alert("Department deleted successfully");
//       // Reset form after deletion
//       setDeptForm({ name: "", description: "", permissions: defaultPermissions });
//       setDeptEditMode(false);
//       setEditingDeptId(null);
//       setIsCreatingNew(false);
//       await Promise.all([fetchDepartments(), fetchAdmins()]);
//     } catch (err) {
//       console.error("Dept delete failed:", err);
//       alert(err.message || "Failed to delete department");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-6">
//       <StatCard
//         pageTitle="Roles & Admins"
//         pageSubtitle="Manage system admins and departments"
//         buttonText="Create Admin / Manage Departments"
//         onButtonClick={() => setShowModal(true)}
//         stats={stats}
//       />

//       {/* ----------- MODAL (ADMIN CREATE/EDIT) ----------- */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
//             <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-lg font-semibold">
//                   {isEditMode ? "Edit Admin" : "Create Admin"}
//                 </h3>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       setIsCreatingNew(true);
//                       setDeptEditMode(false);
//                       setEditingDeptId(null);
//                       setDeptForm({ name: "", description: "", permissions: defaultPermissions });
//                       setShowDeptModal(true);
//                     }}
//                     className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
//                   >
//                     + New Dept
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       setIsCreatingNew(false);
//                       setDeptEditMode(false);
//                       setEditingDeptId(null);
//                       setShowDeptModal(true);
//                     }}
//                     className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
//                   >
//                     Manage Depts
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Username"
//                   value={form.username}
//                   onChange={handleChange}
//                   className="border rounded-lg px-4 py-2"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={form.email}
//                   onChange={handleChange}
//                   className="border rounded-lg px-4 py-2"
//                 />
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   placeholder="Phone Number"
//                   value={form.phoneNumber}
//                   onChange={handleChange}
//                   className="border rounded-lg px-4 py-2"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Assign Department (optional)</label>
//                 <select
//                   name="department"
//                   value={form.department}
//                   onChange={(e) => handleDepartmentSelect(e.target.value)}
//                   className="w-full border rounded-lg px-4 py-2"
//                 >
//                   <option value="">-- Select Department --</option>
//                   {departments.map((d) => (
//                     <option key={d._id} value={d._id}>
//                       {d.name}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="mt-2 text-xs text-gray-500">
//                   Selecting a department will seed default permissions which you can override per admin.
//                 </div>
//               </div>

//               {/* PERMISSIONS TABLE */}
//               <div>
//                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                   <div className="grid grid-cols-5 bg-gray-100 text-xs font-bold text-gray-700 p-4 uppercase">
//                     <span>Module</span>
//                     <span className="text-center">View</span>
//                     <span className="text-center">Create</span>
//                     <span className="text-center">Edit</span>
//                     <span className="text-center">Delete</span>
//                   </div>

//                   {Object.entries(form.permissions).map(([module, perms], idx) => (
//                     <div
//                       key={module}
//                       className={`grid grid-cols-5 items-center p-4 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
//                     >
//                       <div>
//                         <div className="font-medium text-gray-700">{MODULES[module] || module}</div>
//                         {form.department && (() => {
//                           const dept = departments.find((d) => d._id === form.department);
//                           if (dept && dept.permissions && dept.permissions[module]) {
//                             const same = JSON.stringify(dept.permissions[module]) === JSON.stringify(perms);
//                             return (
//                               <div className="text-xs text-gray-400 mt-1">{same ? "Inherited from dept" : "Custom override"}</div>
//                             );
//                           }
//                           return null;
//                         })()}
//                       </div>

//                       {["view", "create", "edit", "delete"].map((action) => {
//                         const isUsersCreate = module === "users" && action === "create";
//                         return (
//                           <div key={action} className="flex justify-center">
//                             {isUsersCreate ? (
//                               <span className="text-gray-400 text-xs italic">N/A</span>
//                             ) : (
//                               <input
//                                 type="checkbox"
//                                 checked={!!perms[action]}
//                                 disabled={(action !== "view" && !perms.view) || isUsersCreate}
//                                 onChange={() => togglePermission(module, action)}
//                                 className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
//                               />
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ))}
//                 </div>
//               </div>

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
//                   {isEditMode ? "Update Admin" : "Create Admin"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ----------- DEPARTMENT MODAL (IMPROVED) ----------- */}
//       {showDeptModal && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//           <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//             {/* Header */}
//             <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">Manage Departments</h3>
//                 <p className="text-sm text-gray-600 mt-1">Create, edit, and manage department permissions</p>
//               </div>
//               <button
//                 onClick={() => {
//                   setShowDeptModal(false);
//                   setDeptForm({ name: "", description: "", permissions: defaultPermissions });
//                   setDeptEditMode(false);
//                   setEditingDeptId(null);
//                   setIsCreatingNew(false);
//                   setDeptSearchQuery("");
//                   // Reopen admin modal if we came from there
//                   if (isEditMode || showModal) {
//                     setShowModal(true);
//                   }
//                 }}
//                 className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white transition-colors"
//               >
//                 Close
//               </button>
//             </div>

//             {/* Two-panel layout */}
//             <div className="flex flex-1 overflow-hidden">
//               {/* LEFT PANEL - Departments List */}
//               <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
//                 <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 space-y-3">
//                   <button
//                     onClick={openCreateDept}
//                     className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
//                   >
//                     <span className="text-xl">+</span>
//                     Create New Department
//                   </button>
                  
//                   {departments.length > 3 && (
//                     <input
//                       type="text"
//                       placeholder="Search departments..."
//                       value={deptSearchQuery}
//                       onChange={(e) => setDeptSearchQuery(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   )}
//                 </div>

//                 <div className="p-4 space-y-2">
//                   {(() => {
//                     const filteredDepts = departments.filter(dept => 
//                       dept.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
//                       (dept.description && dept.description.toLowerCase().includes(deptSearchQuery.toLowerCase()))
//                     );

//                     if (filteredDepts.length === 0) {
//                       return (
//                         <div className="text-center py-8 text-gray-500">
//                           {departments.length === 0 ? (
//                             <>
//                               <p className="text-sm">No departments yet</p>
//                               <p className="text-xs mt-1">Click above to create one</p>
//                             </>
//                           ) : (
//                             <p className="text-sm">No matching departments</p>
//                           )}
//                         </div>
//                       );
//                     }

//                     return filteredDepts.map((dept) => {
//                       const assignedAdmins = admins.filter(a => 
//                         a.department?._id === dept._id || a.department === dept._id
//                       ).length;
                      
//                       // Count active permissions
//                       const permCount = Object.values(dept.permissions || {}).reduce((acc, perms) => {
//                         return acc + Object.values(perms).filter(Boolean).length;
//                       }, 0);

//                       return (
//                         <div
//                           key={dept._id}
//                           onClick={() => handleDeptEdit(dept)}
//                           className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                             editingDeptId === dept._id
//                               ? "border-blue-500 bg-blue-50 shadow-md"
//                               : "border-gray-200 bg-white hover:border-blue-300 hover:shadow"
//                           }`}
//                         >
//                           <div className="flex justify-between items-start gap-2">
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-semibold text-gray-900 truncate">{dept.name}</h4>
//                               {dept.description && (
//                                 <p className="text-xs text-gray-600 mt-1 line-clamp-2">{dept.description}</p>
//                               )}
//                               <div className="flex items-center gap-2 mt-3 flex-wrap">
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
//                                   {assignedAdmins} admin{assignedAdmins !== 1 ? 's' : ''}
//                                 </span>
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
//                                   {permCount} permission{permCount !== 1 ? 's' : ''}
//                                 </span>
//                               </div>
//                             </div>
//                             {editingDeptId === dept._id && (
//                               <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     });
//                   })()}
//                 </div>
//               </div>

//               {/* RIGHT PANEL - Create/Edit Form */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 {!deptEditMode && !editingDeptId && !isCreatingNew ? (
//                   <div className="flex items-center justify-center h-full text-gray-400">
//                     <div className="text-center">
//                       <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                       <p className="text-lg font-medium">Select a department to edit</p>
//                       <p className="text-sm mt-2">or create a new one from the left panel</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div>
//                       <h4 className="text-lg font-semibold mb-4">
//                         {deptEditMode ? "Edit Department" : "Create New Department"}
//                       </h4>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Department Name *
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="e.g., Sales, Marketing, IT Support"
//                           value={deptForm.name}
//                           onChange={(e) => setDeptForm((p) => ({ ...p, name: e.target.value }))}
//                           className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Description
//                         </label>
//                         <textarea
//                           placeholder="Brief description of this department's responsibilities"
//                           value={deptForm.description}
//                           onChange={(e) => setDeptForm((p) => ({ ...p, description: e.target.value }))}
//                           rows={3}
//                           className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-3">
//                         Default Permissions
//                       </label>
//                       <div className="border border-gray-300 rounded-xl overflow-hidden">
//                         <div className="grid grid-cols-5 bg-gray-100 text-xs font-bold text-gray-700 p-3 uppercase">
//                           <span>Module</span>
//                           <span className="text-center">View</span>
//                           <span className="text-center">Create</span>
//                           <span className="text-center">Edit</span>
//                           <span className="text-center">Delete</span>
//                         </div>

//                         {Object.entries(deptForm.permissions).map(([module, perms], idx) => (
//                           <div key={module} className={`grid grid-cols-5 items-center p-3 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                             <div className="font-medium text-gray-700">{MODULES[module] || module}</div>
//                             {["view", "create", "edit", "delete"].map((action) => (
//                               <div key={action} className="flex justify-center">
//                                 {module === "users" && action === "create" ? (
//                                   <span className="text-gray-400 text-xs italic">N/A</span>
//                                 ) : (
//                                   <input
//                                     type="checkbox"
//                                     checked={!!perms[action]}
//                                     disabled={action !== "view" && !perms.view}
//                                     onChange={() => {
//                                       setDeptForm((prev) => {
//                                         const copy = JSON.parse(JSON.stringify(prev.permissions));
//                                         if (action === "view") {
//                                           const newVal = !copy[module].view;
//                                           copy[module] = {
//                                             view: newVal,
//                                             create: module === "users" ? false : newVal ? copy[module].create : false,
//                                             edit: newVal ? copy[module].edit : false,
//                                             delete: newVal ? copy[module].delete : false,
//                                           };
//                                         } else {
//                                           copy[module][action] = !copy[module][action];
//                                         }
//                                         return { ...prev, permissions: copy };
//                                       });
//                                     }}
//                                     className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                                   />
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         ))}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-2">
//                         💡 Tip: These permissions will be applied by default to all admins in this department
//                       </p>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//                       <div>
//                         {deptEditMode && (
//                           <button
//                             onClick={() => handleDeptDelete(editingDeptId)}
//                             className="px-5 py-2.5 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium transition-colors"
//                           >
//                             Delete Department
//                           </button>
//                         )}
//                       </div>
//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => {
//                             setDeptForm({ name: "", description: "", permissions: defaultPermissions });
//                             setDeptEditMode(false);
//                             setEditingDeptId(null);
//                             setIsCreatingNew(false);
//                             setDeptSearchQuery("");
//                           }}
//                           className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={handleDeptSubmit}
//                           className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm"
//                         >
//                           {deptEditMode ? "Update Department" : "Create Department"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ----------- DATA TABLE ----------- */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <DataTable
//         title="Roles & Admins"
//         subtitle="Manage admins and departments"
//         columns={["Full Name", "Email", "Phone Number", "Role", "Department"]}
//         data={admins.map(admin => ({
//           ...admin,
//           // Normalize department ID for filtering - handles both populated and unpopulated refs
//           departmentId: admin.department?._id?.toString() || admin.department?.toString() || ""
//         }))}
//         searchableKeys={["username", "email", "phoneNumber", "Department"]}
//         filterKey="departmentId"
//         filterOptions={departments.map((d) => ({
//           label: d.name,
//           value: d._id.toString(),
//         }))}
//         emptyState={loading ? "Loading..." : "No admins found"}
//         renderRow={(row) => (
//           <>
//             <td className="px-6 py-4 font-medium text-gray-900">{row.username || "—"}</td>
//             <td className="px-6 py-4 text-gray-600">{row.email}</td>
//             <td className="px-6 py-4 text-gray-600">{row.phoneNumber || "—"}</td>
//             <td className="px-6 py-4">
//               <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
//                 {(row.role || "unassigned").replace(/_/g, " ").toUpperCase()}
//               </span>
//             </td>
//             <td className="px-6 py-4 text-gray-600">
//               {row.department?.name || "—"}
//             </td>
//           </>
//         )}
//         actions={(row) => (
//           <div className="flex justify-center gap-2">
//             <button
//               onClick={() => handleEdit(row)}
//               className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => handleDelete(row._id)}
//               className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
//             >
//               Delete
//             </button>
//     </div>
//   )}
// />

//       </div>
//     </div>
//   );
// };

// export default AdminRoles;

// src/admin/AdminRoles.jsx
import { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";
import { Users, ShieldCheck, Building2 } from "lucide-react";
import {
  getAdmins,
  deleteAdmin,
  createAdmin,
  updateAdmin,
} from "../../services/adminAPI";
import { getDepartments } from "../../services/departmentAPI";
import DepartmentModal from "../components/DepartmentModal";

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
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState(null);

  /* ------------------ DEPARTMENT MODAL ------------------ */
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptModalMode, setDeptModalMode] = useState("list"); // 'list' or 'create'

  /* ------------------ FORM STATE ------------------ */
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    role: "admin",
    department: "", // department id
    permissions: defaultPermissions,
  });

  /* ------------------ FETCH DATA ------------------ */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAdmins(), fetchDepartments()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data || []);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      alert("Failed to load admins");
    }
  };

  const fetchDepartments = async () => {
    try {
      const d = await getDepartments();
      setDepartments(d || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      alert("Failed to load departments");
    }
  };

  /* ------------------ STATS ------------------ */
  const totalUsers = admins.length;
  const totalAdmins = admins.filter((a) => a.role === "admin").length;
  const totalSuperAdmins = admins.filter((a) => a.role === "super_admin").length;

  const stats = useMemo(
    () => [
      {
        title: "Total Admins & Staff",
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
        title: "Super Admins",
        value: totalSuperAdmins,
        subtitle: "Full access",
        Icon: Building2,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
    ],
    [totalUsers, totalAdmins, totalSuperAdmins]
  );

  /* ------------------ FORM HANDLERS ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentSelect = (deptId) => {
    const dept = departments.find((d) => d._id === deptId);
    setForm((prev) => ({
      ...prev,
      department: deptId,
      permissions: dept ? dept.permissions : defaultPermissions,
    }));
  };

  const togglePermission = (module, action) => {
    if (module === "users" && action === "create") return;

    setForm((prev) => {
      const updated = JSON.parse(JSON.stringify(prev.permissions || defaultPermissions));

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

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      phoneNumber: "",
      role: "admin",
      department: "",
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
      department: admin.department?._id || admin.department || "",
      permissions:
        admin.permissions ||
        (admin.department && admin.department.permissions) ||
        defaultPermissions,
    });
    setShowModal(true);
  };

  /* ------------------ CREATE/UPDATE ADMIN ------------------ */
  const handleSubmit = async () => {
    const { username, email, phoneNumber, role, department, permissions } = form;

    if (!username || !email || !phoneNumber) {
      alert("Please fill in all fields.");
      return;
    }

    if (role === "admin" && !department) {
      if (!window.confirm("Create admin without a department? (Not recommended)")) return;
    }

    try {
      if (isEditMode) {
        await updateAdmin(editingAdminId, {
          phoneNumber,
          permissions,
          department,
        });
        alert("Admin updated successfully.");
      } else {
        await createAdmin({
          username,
          email,
          phoneNumber,
          role,
          department,
          permissions,
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

  /* ------------------ DEPARTMENT MODAL HANDLERS ------------------ */
  const handleOpenDeptModal = (mode = "list") => {
    setShowModal(false);
    setDeptModalMode(mode);
    setShowDeptModal(true);
  };

  const handleCloseDeptModal = (returnToAdmin = false) => {
    setShowDeptModal(false);
    if (returnToAdmin && (isEditMode || showModal)) {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <StatCard
        pageTitle="Roles & Admins"
        pageSubtitle="Manage system admins and departments"
        buttonText="Create Admin / Manage Departments"
        onButtonClick={() => setShowModal(true)}
        stats={stats}
      />

      {/* ----------- MODAL (ADMIN CREATE/EDIT) ----------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {isEditMode ? "Edit Admin" : "Create Admin"}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDeptModal("create")}
                    className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
                  >
                    + New Dept
                  </button>
                  <button
                    onClick={() => handleOpenDeptModal("list")}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Manage Depts
                  </button>
                </div>
              </div>

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
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Assign Department (optional)
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={(e) => handleDepartmentSelect(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-gray-500">
                  Selecting a department will seed default permissions which you can override per
                  admin.
                </div>
              </div>

              {/* PERMISSIONS TABLE */}
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
                      <div>
                        <div className="font-medium text-gray-700">
                          {MODULES[module] || module}
                        </div>
                        {form.department &&
                          (() => {
                            const dept = departments.find((d) => d._id === form.department);
                            if (dept && dept.permissions && dept.permissions[module]) {
                              const same =
                                JSON.stringify(dept.permissions[module]) ===
                                JSON.stringify(perms);
                              return (
                                <div className="text-xs text-gray-400 mt-1">
                                  {same ? "Inherited from dept" : "Custom override"}
                                </div>
                              );
                            }
                            return null;
                          })()}
                      </div>

                      {["view", "create", "edit", "delete"].map((action) => {
                        const isUsersCreate = module === "users" && action === "create";
                        return (
                          <div key={action} className="flex justify-center">
                            {isUsersCreate ? (
                              <span className="text-gray-400 text-xs italic">N/A</span>
                            ) : (
                              <input
                                type="checkbox"
                                checked={!!perms[action]}
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
              </div>

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
                  {isEditMode ? "Update Admin" : "Create Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------- DEPARTMENT MODAL (EXTRACTED COMPONENT) ----------- */}
      <DepartmentModal
        show={showDeptModal}
        onClose={handleCloseDeptModal}
        departments={departments}
        admins={admins}
        onRefreshDepartments={fetchDepartments}
        onRefreshAdmins={fetchAdmins}
        initialMode={deptModalMode}
        returnToAdminModal={isEditMode || showModal}
      />

      {/* ----------- DATA TABLE ----------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          title="Roles & Admins"
          subtitle="Manage admins and departments"
          columns={["Full Name", "Email", "Phone Number", "Role", "Department"]}
          data={admins.map((admin) => ({
            ...admin,
            // Normalize department ID for filtering - handles both populated and unpopulated refs
            departmentId:
              admin.department?._id?.toString() || admin.department?.toString() || "",
          }))}
          searchableKeys={["username", "email", "phoneNumber", "Department"]}
          filterKey="departmentId"
          filterOptions={departments.map((d) => ({
            label: d.name,
            value: d._id.toString(),
          }))}
          emptyState={loading ? "Loading..." : "No admins found"}
          renderRow={(row) => (
            <>
              <td className="px-6 py-4 font-medium text-gray-900">{row.username || "—"}</td>
              <td className="px-6 py-4 text-gray-600">{row.email}</td>
              <td className="px-6 py-4 text-gray-600">{row.phoneNumber || "—"}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {(row.role || "unassigned").replace(/_/g, " ").toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">{row.department?.name || "—"}</td>
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