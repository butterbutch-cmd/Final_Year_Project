// import { useState } from "react";
// import axios from "axios";
// import { Building2 } from "lucide-react";
// import {
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../../services/departmentAPI";

// const DepartmentModal = ({
//   show,
//   onClose,
//   departments,
//   admins,
//   modules,                         // <-- dynamic modules
//   onRefreshDepartments,
//   onRefreshAdmins,
//   onRefreshModules,                 // <-- to refresh modules after creation
//   initialMode = "list",
//   returnToAdminModal = false,
// }) => {
//   /* ------------------ STATE ------------------ */
//   const [deptEditMode, setDeptEditMode] = useState(false);
//   const [editingDeptId, setEditingDeptId] = useState(null);
//   const [isCreatingNew, setIsCreatingNew] = useState(initialMode === "create");
//   const [deptSearchQuery, setDeptSearchQuery] = useState("");
//   const [deptForm, setDeptForm] = useState({
//     name: "",
//     description: "",
//     permissions: {},
//   });

//   /* ------------------ HANDLERS ------------------ */
//   const openCreateDept = () => {
//     setDeptEditMode(false);
//     setEditingDeptId(null);
//     setIsCreatingNew(true);
//     setDeptForm({ name: "", description: "", permissions: {} });
//   };

//   const handleDeptEdit = (dept) => {
//     setDeptEditMode(true);
//     setEditingDeptId(dept._id);
//     setIsCreatingNew(false);
//     setDeptForm({
//       name: dept.name,
//       description: dept.description || "",
//       permissions: dept.permissions || {},
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
//       await onRefreshDepartments();
//     } catch (err) {
//       console.error("Dept save failed:", err);
//       alert(err.message || "Failed to save department");
//     }
//   };

//   const handleDeptDelete = async (id) => {
//     const affectedAdmins = admins.filter(
//       (a) => a.department?._id === id || a.department === id
//     ).length;
//     const confirmMsg =
//       affectedAdmins > 0
//         ? `Delete this department? ${affectedAdmins} admin(s) are currently assigned and will lose their department assignment.`
//         : "Delete this department?";

//     if (!window.confirm(confirmMsg)) return;

//     try {
//       await deleteDepartment(id);
//       alert("Department deleted successfully");
//       setDeptForm({ name: "", description: "", permissions: {} });
//       setDeptEditMode(false);
//       setEditingDeptId(null);
//       setIsCreatingNew(false);
//       await Promise.all([onRefreshDepartments(), onRefreshAdmins()]);
//     } catch (err) {
//       console.error("Dept delete failed:", err);
//       alert(err.message || "Failed to delete department");
//     }
//   };

//   const toggleDeptPermission = (moduleName, action) => {
//     setDeptForm((prev) => {
//       const currentPerms = prev.permissions || {};
//       const modulePerms = currentPerms[moduleName] || { view: false, create: false, edit: false, delete: false };

//       let updatedModule;
//       if (action === "view") {
//         const newView = !modulePerms.view;
//         updatedModule = {
//           view: newView,
//           create: newView ? modulePerms.create : false,
//           edit: newView ? modulePerms.edit : false,
//           delete: newView ? modulePerms.delete : false,
//         };
//       } else {
//         updatedModule = {
//           ...modulePerms,
//           [action]: !modulePerms[action],
//         };
//       }

//       return {
//         ...prev,
//         permissions: {
//           ...currentPerms,
//           [moduleName]: updatedModule,
//         },
//       };
//     });
//   };

//   const handleCancel = () => {
//     setDeptForm({ name: "", description: "", permissions: {} });
//     setDeptEditMode(false);
//     setEditingDeptId(null);
//     setIsCreatingNew(false);
//     setDeptSearchQuery("");
//   };

//   const handleClose = () => {
//     handleCancel();
//     onClose(returnToAdminModal);
//   };

//   /* ------------------ REFRESH MODULE PERMISSIONS ------------------ */
//   const refreshModulePermissions = async (moduleId) => {
//     if (!window.confirm("This will add this module's default permissions to all existing users and departments. Continue?"))
//       return;
//     try {
//       await axios.post(`/api/modules/${moduleId}/refresh`);
//       alert("Permissions refreshed for all users and departments.");
//       await Promise.all([onRefreshDepartments(), onRefreshAdmins(), onRefreshModules()]);
//     } catch (err) {
//       console.error("Refresh failed:", err);
//       alert(err.message || "Failed to refresh permissions");
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//       <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">Manage Departments</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Create, edit, and manage department permissions
//             </p>
//           </div>
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white transition-colors"
//           >
//             Close
//           </button>
//         </div>

//         {/* Two-panel layout */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* LEFT PANEL - Departments List */}
//           <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
//             <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 space-y-3">
//               <button
//                 onClick={openCreateDept}
//                 className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
//               >
//                 <span className="text-xl">+</span>
//                 Create New Department
//               </button>

//               {departments.length > 3 && (
//                 <input
//                   type="text"
//                   placeholder="Search departments..."
//                   value={deptSearchQuery}
//                   onChange={(e) => setDeptSearchQuery(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               )}
//             </div>

//             <div className="p-4 space-y-2">
//               {(() => {
//                 const filteredDepts = departments.filter(
//                   (dept) =>
//                     dept.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
//                     (dept.description &&
//                       dept.description.toLowerCase().includes(deptSearchQuery.toLowerCase()))
//                 );

//                 if (filteredDepts.length === 0) {
//                   return (
//                     <div className="text-center py-8 text-gray-500">
//                       {departments.length === 0 ? (
//                         <>
//                           <p className="text-sm">No departments yet</p>
//                           <p className="text-xs mt-1">Click above to create one</p>
//                         </>
//                       ) : (
//                         <p className="text-sm">No matching departments</p>
//                       )}
//                     </div>
//                   );
//                 }

//                 return filteredDepts.map((dept) => {
//                   const assignedAdmins = admins.filter(
//                     (a) => a.department?._id === dept._id || a.department === dept._id
//                   ).length;

//                   // Count active permissions
//                   const permCount = Object.values(dept.permissions || {}).reduce(
//                     (acc, perms) => {
//                       return acc + Object.values(perms).filter(Boolean).length;
//                     },
//                     0
//                   );

//                   return (
//                     <div
//                       key={dept._id}
//                       onClick={() => handleDeptEdit(dept)}
//                       className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                         editingDeptId === dept._id
//                           ? "border-blue-500 bg-blue-50 shadow-md"
//                           : "border-gray-200 bg-white hover:border-blue-300 hover:shadow"
//                       }`}
//                     >
//                       <div className="flex justify-between items-start gap-2">
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-semibold text-gray-900 truncate">{dept.name}</h4>
//                           {dept.description && (
//                             <p className="text-xs text-gray-600 mt-1 line-clamp-2">
//                               {dept.description}
//                             </p>
//                           )}
//                           <div className="flex items-center gap-2 mt-3 flex-wrap">
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
//                               {assignedAdmins} admin{assignedAdmins !== 1 ? "s" : ""}
//                             </span>
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
//                               {permCount} permission{permCount !== 1 ? "s" : ""}
//                             </span>
//                           </div>
//                         </div>
//                         {editingDeptId === dept._id && (
//                           <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 });
//               })()}
//             </div>
//           </div>

//           {/* RIGHT PANEL - Create/Edit Form */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {!deptEditMode && !editingDeptId && !isCreatingNew ? (
//               <div className="flex items-center justify-center h-full text-gray-400">
//                 <div className="text-center">
//                   <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium">Select a department to edit</p>
//                   <p className="text-sm mt-2">or create a new one from the left panel</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="text-lg font-semibold mb-4">
//                     {deptEditMode ? "Edit Department" : "Create New Department"}
//                   </h4>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Department Name *
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="e.g., Sales, Marketing, IT Support"
//                       value={deptForm.name}
//                       onChange={(e) => setDeptForm((p) => ({ ...p, name: e.target.value }))}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       placeholder="Brief description of this department's responsibilities"
//                       value={deptForm.description}
//                       onChange={(e) =>
//                         setDeptForm((p) => ({ ...p, description: e.target.value }))
//                       }
//                       rows={3}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Default Permissions
//                   </label>
//                   <div className="border border-gray-300 rounded-xl overflow-hidden">
//                     <div className="grid grid-cols-5 bg-gray-100 text-xs font-bold text-gray-700 p-3 uppercase">
//                       <span>Module</span>
//                       <span className="text-center">View</span>
//                       <span className="text-center">Create</span>
//                       <span className="text-center">Edit</span>
//                       <span className="text-center">Delete</span>
//                     </div>

//                     {modules.map((module, idx) => {
//                       const moduleName = module.name;
//                       const perms = deptForm.permissions[moduleName] || { view: false, create: false, edit: false, delete: false };
//                       return (
//                         <div
//                           key={module._id}
//                           className={`grid grid-cols-5 items-center p-3 text-sm ${
//                             idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                           }`}
//                         >
//                           <div className="font-medium text-gray-700">
//                             {module.label}
//                           </div>
//                           {["view", "create", "edit", "delete"].map((action) => (
//                             <div key={action} className="flex justify-center">
//                               {moduleName === "users" && action === "create" ? (
//                                 <span className="text-gray-400 text-xs italic">N/A</span>
//                               ) : (
//                                 <input
//                                   type="checkbox"
//                                   checked={perms[action] || false}
//                                   disabled={action !== "view" && !perms.view}
//                                   onChange={() => toggleDeptPermission(moduleName, action)}
//                                   className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 />
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     💡 Tip: These permissions will be applied by default to all admins in this
//                     department
//                   </p>
//                 </div>

//                 {/* Refresh button for new modules */}
//                 <div className="border-t border-gray-200 pt-4">
//                   <h4 className="font-medium mb-2">Module Management</h4>
//                   <p className="text-sm text-gray-600 mb-3">
//                     When you add a new module, click refresh to give existing users/departments default permissions.
//                   </p>
//                   <div className="space-y-2 max-h-40 overflow-y-auto">
//                     {modules.map((module) => (
//                       <div key={module._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                         <span className="text-sm font-medium">{module.label}</span>
//                         <button
//                           onClick={() => refreshModulePermissions(module._id)}
//                           className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
//                         >
//                           Refresh
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//                   <div>
//                     {deptEditMode && (
//                       <button
//                         onClick={() => handleDeptDelete(editingDeptId)}
//                         className="px-5 py-2.5 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium transition-colors"
//                       >
//                         Delete Department
//                       </button>
//                     )}
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleCancel}
//                       className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleDeptSubmit}
//                       className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm"
//                     >
//                       {deptEditMode ? "Update Department" : "Create Department"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DepartmentModal;

import { useState } from "react";
import axios from "axios";
import { Building2 } from "lucide-react";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentAPI";

const DepartmentModal = ({
  show,
  onClose,
  departments,
  admins,
  modules, // dynamic modules
  onRefreshDepartments,
  onRefreshAdmins,
  onRefreshModules, // refresh modules after changes
  initialMode = "list",
  returnToAdminModal = false,
}) => {
  /* ------------------ STATE ------------------ */
  const [deptEditMode, setDeptEditMode] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(initialMode === "create");
  const [deptSearchQuery, setDeptSearchQuery] = useState("");
  const [deptForm, setDeptForm] = useState({
    name: "",
    description: "",
    permissions: {},
  });

  /* ------------------ HANDLERS ------------------ */
  const openCreateDept = () => {
    setDeptEditMode(false);
    setEditingDeptId(null);
    setIsCreatingNew(true);
    setDeptForm({ name: "", description: "", permissions: {} });
  };

  const handleDeptEdit = (dept) => {
    setDeptEditMode(true);
    setEditingDeptId(dept._id);
    setIsCreatingNew(false);
    setDeptForm({
      name: dept.name,
      description: dept.description || "",
      permissions: dept.permissions || {},
    });
  };

  const handleDeptSubmit = async () => {
    const { name, description, permissions } = deptForm;
    if (!name.trim()) return alert("Department name is required");

    try {
      if (deptEditMode) {
        await updateDepartment(editingDeptId, { name, description, permissions });
        alert("Department updated successfully!");
      } else {
        const newDept = await createDepartment({ name, description, permissions });
        alert("Department created successfully!");
        if (newDept && newDept._id) {
          setDeptEditMode(true);
          setEditingDeptId(newDept._id);
          setIsCreatingNew(false);
        }
      }
      await onRefreshDepartments();
    } catch (err) {
      console.error("Dept save failed:", err);
      alert(err.message || "Failed to save department");
    }
  };

  const handleDeptDelete = async (id) => {
    const affectedAdmins = admins.filter(
      (a) => a.department?._id === id || a.department === id
    ).length;
    const confirmMsg =
      affectedAdmins > 0
        ? `Delete this department? ${affectedAdmins} admin(s) are currently assigned and will lose their department assignment.`
        : "Delete this department?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteDepartment(id);
      alert("Department deleted successfully");
      setDeptForm({ name: "", description: "", permissions: {} });
      setDeptEditMode(false);
      setEditingDeptId(null);
      setIsCreatingNew(false);
      await Promise.all([onRefreshDepartments(), onRefreshAdmins()]);
    } catch (err) {
      console.error("Dept delete failed:", err);
      alert(err.message || "Failed to delete department");
    }
  };

  const toggleDeptPermission = (moduleName, action) => {
    setDeptForm((prev) => {
      const currentPerms = prev.permissions || {};
      const modulePerms = currentPerms[moduleName] || {
        view: false,
        create: false,
        edit: false,
        delete: false,
      };

      let updatedModule;
      if (action === "view") {
        const newView = !modulePerms.view;
        updatedModule = {
          view: newView,
          create: newView ? modulePerms.create : false,
          edit: newView ? modulePerms.edit : false,
          delete: newView ? modulePerms.delete : false,
        };
      } else {
        updatedModule = { ...modulePerms, [action]: !modulePerms[action] };
      }

      return { ...prev, permissions: { ...currentPerms, [moduleName]: updatedModule } };
    });
  };

  const handleCancel = () => {
    setDeptForm({ name: "", description: "", permissions: {} });
    setDeptEditMode(false);
    setEditingDeptId(null);
    setIsCreatingNew(false);
    setDeptSearchQuery("");
  };

  const handleClose = () => {
    handleCancel();
    onClose(returnToAdminModal);
  };

  /* ------------------ REFRESH MODULE PERMISSIONS ------------------ */
  const refreshModulePermissions = async (moduleId) => {
    if (
      !window.confirm(
        "This will add this module's default permissions to all existing users and departments. Continue?"
      )
    )
      return;

    try {
      await axios.post(`/api/modules/${moduleId}/refresh`);
      alert("Permissions refreshed for all users and departments.");
      await Promise.all([onRefreshDepartments(), onRefreshAdmins(), onRefreshModules()]);
    } catch (err) {
      console.error("Refresh failed:", err);
      alert(err.message || "Failed to refresh permissions");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Manage Departments</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create, edit, and manage department permissions
            </p>
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL - Departments List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 space-y-3">
              <button
                onClick={openCreateDept}
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span className="text-xl">+</span>Create New Department
              </button>
              {departments.length > 3 && (
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={deptSearchQuery}
                  onChange={(e) => setDeptSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            <div className="p-4 space-y-2">
              {(() => {
                const filteredDepts = departments.filter(
                  (dept) =>
                    dept.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
                    (dept.description &&
                      dept.description.toLowerCase().includes(deptSearchQuery.toLowerCase()))
                );

                if (filteredDepts.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      {departments.length === 0 ? (
                        <>
                          <p className="text-sm">No departments yet</p>
                          <p className="text-xs mt-1">Click above to create one</p>
                        </>
                      ) : (
                        <p className="text-sm">No matching departments</p>
                      )}
                    </div>
                  );
                }

                return filteredDepts.map((dept) => {
                  const assignedAdmins = admins.filter(
                    (a) => a.department?._id === dept._id || a.department === dept._id
                  ).length;

                  const permCount = Object.values(dept.permissions || {}).reduce(
                    (acc, perms) => acc + Object.values(perms).filter(Boolean).length,
                    0
                  );

                  return (
                    <div
                      key={dept._id}
                      onClick={() => handleDeptEdit(dept)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        editingDeptId === dept._id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{dept.name}</h4>
                          {dept.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {dept.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              {assignedAdmins} admin{assignedAdmins !== 1 ? "s" : ""}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {permCount} permission{permCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        {editingDeptId === dept._id && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* RIGHT PANEL - Create/Edit Form */}
          <div className="flex-1 overflow-y-auto p-6">
            {!deptEditMode && !editingDeptId && !isCreatingNew ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a department to edit</p>
                  <p className="text-sm mt-2">or create a new one from the left panel</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Department Name & Description */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Sales, Marketing"
                      value={deptForm.name}
                      onChange={(e) =>
                        setDeptForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of this department's responsibilities"
                      value={deptForm.description}
                      onChange={(e) =>
                        setDeptForm((p) => ({ ...p, description: e.target.value }))
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Default Permissions
                  </label>
                  <div className="border border-gray-300 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-5 bg-gray-100 text-xs font-bold text-gray-700 p-3 uppercase">
                      <span>Module</span>
                      <span className="text-center">View</span>
                      <span className="text-center">Create</span>
                      <span className="text-center">Edit</span>
                      <span className="text-center">Delete</span>
                    </div>

                    {modules.map((module, idx) => {
                      const moduleName = module.name;
                      const perms =
                        deptForm.permissions[moduleName] || {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false,
                        };
                      return (
                        <div
                          key={module._id}
                          className={`grid grid-cols-5 items-center p-3 text-sm ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <div className="font-medium text-gray-700">{module.label}</div>
                          {["view", "create", "edit", "delete"].map((action) => (
                            <div key={action} className="flex justify-center">
                              {moduleName === "users" && action === "create" ? (
                                <span className="text-gray-400 text-xs italic">N/A</span>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={perms[action] || false}
                                  disabled={action !== "view" && !perms.view}
                                  onChange={() => toggleDeptPermission(moduleName, action)}
                                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: These permissions will be applied by default to all admins in this
                    department
                  </p>
                </div>

                {/* Module Management / Refresh
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">Module Management</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    When you add a new module, click refresh to give existing users/departments default permissions.
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {modules.map((module) => (
                      <div
                        key={module._id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm font-medium">{module.label}</span>
                        <button
                          onClick={() => refreshModulePermissions(module._id)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Refresh
                        </button>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  {deptEditMode && (
                    <button
                      onClick={() => handleDeptDelete(editingDeptId)}
                      className="px-5 py-2.5 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      Delete Department
                    </button>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeptSubmit}
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm"
                    >
                      {deptEditMode ? "Update Department" : "Create Department"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;
