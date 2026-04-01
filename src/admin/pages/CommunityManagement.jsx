// // // file: src/admin/pages/CommunityManagement.jsx
// // import { useEffect, useMemo, useState } from "react";
// // import {
// //   BarChart3,
// //   Bell,
// //   CheckCircle2,
// //   Eye,
// //   EyeOff,
// //   Flag,
// //   FileText,
// //   Loader2,
// //   Lock,
// //   ShieldAlert,
// //   Trash2,
// //   Unlock,
// //   RefreshCw,
// //   Search,
// // } from "lucide-react";

// // import StatCard from "../components/StatCard";
// // import DataTable from "../components/DataTable";
// // import ThreadViewerModal from "../components/ThreadViewerModal";
// // import {
// //   getAllThreads,
// //   getReportedThreads,
// //   hideThread,
// //   unhideThread,
// //   lockThread,
// //   unlockThread,
// //   deleteThread,
// //   permanentDeleteThread,
// //   getPendingReports,
// //   reviewReport,
// //   rejectReport,
// //   getForumStats,
// // } from "../../services/adminForumAPI";

// // const TAB_OPTIONS = [
// //   { key: "overview", label: "Overview", icon: BarChart3 },
// //   { key: "threads", label: "Threads", icon: FileText },
// //   { key: "reports", label: "Reports", icon: Flag },
// // ];

// // const formatDate = (value) => {
// //   if (!value) return "-";
// //   const date = new Date(value);
// //   if (Number.isNaN(date.getTime())) return "-";
// //   return date.toLocaleString();
// // };

// // const getStatusBadge = (item) => {
// //   if (item?.isDeleted) return "bg-red-100 text-red-700";
// //   if (item?.isHidden) return "bg-amber-100 text-amber-700";
// //   if (item?.isLocked) return "bg-slate-100 text-slate-700";
// //   return "bg-emerald-100 text-emerald-700";
// // };

// // const readErrorMessage = (error) => {
// //   if (!error) return "Something went wrong.";
// //   if (typeof error === "string") return error;
// //   return error.message || "Something went wrong.";
// // };

// // export default function CommunityManagement() {
// //   const [activeTab, setActiveTab] = useState("overview");
// //   const [loading, setLoading] = useState(false);
// //   const [actionLoading, setActionLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const [threads, setThreads] = useState([]);
// //   const [reportedThreads, setReportedThreads] = useState([]);
// //   const [reports, setReports] = useState([]);
// //   const [stats, setStats] = useState({
// //     totalThreads: 0,
// //     totalReports: 0,
// //     pendingReports: 0,
// //   });

// //   const [viewer, setViewer] = useState(null);

// //   const openThreadViewer = (threadId) =>
// //     setViewer({ mode: "thread", targetId: threadId });

// //   const openReportViewer = (report) => {
// //     setViewer({
// //       mode: "thread",
// //       targetId: report.targetId,
// //       highlightCommentId: null,
// //     });
// //   };

// //   const loadAllData = async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const [threadsRes, reportedThreadsRes, reportsRes, statsRes] =
// //         await Promise.all([
// //           getAllThreads(),
// //           getReportedThreads(),
// //           getPendingReports(),
// //           getForumStats(),
// //         ]);

// //       setThreads(
// //         (threadsRes?.threads || []).map((t) => ({
// //           ...t,
// //           status: t.isDeleted
// //             ? "deleted"
// //             : t.isHidden
// //             ? "hidden"
// //             : t.isLocked
// //             ? "locked"
// //             : "active",
// //         }))
// //       );

// //       setReportedThreads(reportedThreadsRes?.threads || []);
// //       setReports(reportsRes?.reports || []);
// //       setStats(
// //         statsRes?.stats || {
// //           totalThreads: 0,
// //           totalReports: 0,
// //           pendingReports: 0,
// //         }
// //       );
// //     } catch (err) {
// //       setError(readErrorMessage(err));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadAllData();
// //   }, []);

// //   const handleAction = async (actionFn) => {
// //     setActionLoading(true);
// //     setError("");
// //     try {
// //       await actionFn();
// //       await loadAllData();
// //     } catch (err) {
// //       setError(readErrorMessage(err));
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const statCards = useMemo(
// //     () => [
// //       {
// //         title: "Total Threads",
// //         value: stats.totalThreads,
// //         subtitle: "All forum threads",
// //         Icon: FileText,
// //         iconBg: "bg-blue-50",
// //         iconColor: "text-blue-600",
// //       },
// //       {
// //         title: "Pending Reports",
// //         value: stats.pendingReports,
// //         subtitle: "Needs admin review",
// //         Icon: ShieldAlert,
// //         iconBg: "bg-amber-50",
// //         iconColor: "text-amber-600",
// //       },
// //     ],
// //     [stats]
// //   );

// //   const threadColumns = [
// //     { label: "Title", key: "title", sortable: true },
// //     { label: "Author", key: "author.name", sortable: true },
// //     { label: "Score", key: "score", sortable: true },
// //     { label: "Comments", key: "commentsCount", sortable: true },
// //     { label: "Status", key: "isHidden", sortable: true },
// //     { label: "Created", key: "createdAt", sortable: true },
// //   ];

// //   const reportColumns = [
// //     { label: "Target Type", key: "targetType", sortable: true },
// //     { label: "Target", key: "targetId", sortable: true },
// //     { label: "Reason", key: "reason", sortable: true },
// //     { label: "Status", key: "status", sortable: true },
// //     { label: "Reported By", key: "reportedBy.name", sortable: true },
// //     { label: "Created", key: "createdAt", sortable: true },
// //   ];

// //   const threadActions = (thread) => (
// //     <div className="flex flex-wrap justify-center gap-2">
// //       <button
// //         onClick={() => openThreadViewer(thread._id)}
// //         className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
// //       >
// //         <Search size={14} /> View
// //       </button>

// //       {thread.isHidden ? (
// //         <button
// //           disabled={actionLoading}
// //           onClick={() => handleAction(() => unhideThread(thread._id))}
// //           className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //         >
// //           <Eye size={14} /> Unhide
// //         </button>
// //       ) : (
// //         <button
// //           disabled={actionLoading}
// //           onClick={() => handleAction(() => hideThread(thread._id))}
// //           className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //         >
// //           <EyeOff size={14} /> Hide
// //         </button>
// //       )}

// //       {thread.isLocked ? (
// //         <button
// //           disabled={actionLoading}
// //           onClick={() => handleAction(() => unlockThread(thread._id))}
// //           className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //         >
// //           <Unlock size={14} /> Unlock
// //         </button>
// //       ) : (
// //         <button
// //           disabled={actionLoading}
// //           onClick={() => handleAction(() => lockThread(thread._id))}
// //           className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //         >
// //           <Lock size={14} /> Lock
// //         </button>
// //       )}

// //       <button
// //         disabled={actionLoading}
// //         onClick={() => handleAction(() => deleteThread(thread._id))}
// //         className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50"
// //       >
// //         <Trash2 size={14} /> Delete
// //       </button>

// //       <button
// //         disabled={actionLoading}
// //         onClick={() => handleAction(() => permanentDeleteThread(thread._id))}
// //         className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
// //       >
// //         <Trash2 size={14} /> Permanent
// //       </button>
// //     </div>
// //   );

// //   const reportActions = (report) => (
// //     <div className="flex flex-wrap justify-center gap-2">
// //       <button
// //         onClick={() => openReportViewer(report)}
// //         className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
// //       >
// //         <Search size={14} /> Read
// //       </button>

// //       <button
// //         disabled={actionLoading}
// //         onClick={() =>
// //           handleAction(() => reviewReport(report._id, "Reviewed by admin"))
// //         }
// //         className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
// //       >
// //         <CheckCircle2 size={14} /> Approve
// //       </button>

// //       <button
// //         disabled={actionLoading}
// //         onClick={() =>
// //           handleAction(() => rejectReport(report._id, "Rejected by admin"))
// //         }
// //         className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50"
// //       >
// //         <Trash2 size={14} /> Reject
// //       </button>
// //     </div>
// //   );

// //   const renderThreadRow = (thread) => (
// //     <>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <div className="max-w-[280px]">
// //           <p className="font-medium text-gray-900 truncate">{thread.title}</p>
// //           <p className="text-xs text-gray-500 truncate">
// //             {thread.tags?.length ? thread.tags.join(", ") : "No tags"}
// //           </p>
// //         </div>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
// //         {thread.author?.name || thread.author?.email || "Unknown"}
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
// //         {thread.score ?? 0}
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
// //         {thread.commentsCount ?? 0}
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <span
// //           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
// //             thread
// //           )}`}
// //         >
// //           {thread.isDeleted
// //             ? "Deleted"
// //             : thread.isHidden
// //             ? "Hidden"
// //             : thread.isLocked
// //             ? "Locked"
// //             : "Active"}
// //         </span>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //         {formatDate(thread.createdAt)}
// //       </td>
// //     </>
// //   );

// //   const renderReportRow = (report) => (
// //     <>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
// //         {report.targetType}
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[180px] truncate">
// //         {report.targetTitle ||
// //           report.targetContent ||
// //           String(report.targetId)}
// //       </td>
// //       <td className="px-6 py-4 text-sm text-gray-700 max-w-[320px]">
// //         <p className="truncate">{report.reason}</p>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap">
// //         <span
// //           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
// //             report.status === "pending"
// //               ? "bg-amber-100 text-amber-700"
// //               : report.status === "reviewed"
// //               ? "bg-emerald-100 text-emerald-700"
// //               : "bg-red-100 text-red-700"
// //           }`}
// //         >
// //           {report.status}
// //         </span>
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
// //         {report.reportedBy?.name ||
// //           report.reportedBy?.email ||
// //           "Unknown"}
// //       </td>
// //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //         {formatDate(report.createdAt)}
// //       </td>
// //     </>
// //   );

// //   const tabs = (
// //     <div className="flex flex-wrap gap-2">
// //       {TAB_OPTIONS.map((tab) => {
// //         const Icon = tab.icon;
// //         const isActive = activeTab === tab.key;
// //         return (
// //           <button
// //             key={tab.key}
// //             onClick={() => setActiveTab(tab.key)}
// //             className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
// //               isActive
// //                 ? "bg-gray-900 text-white shadow-sm"
// //                 : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
// //             }`}
// //           >
// //             <Icon size={16} />
// //             {tab.label}
// //           </button>
// //         );
// //       })}
// //     </div>
// //   );

// //   return (
// //     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
// //       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Community Management
// //           </h1>
// //           <p className="text-sm text-gray-500 mt-1">
// //             Moderate threads and user reports from the admin panel.
// //           </p>
// //         </div>
// //         <button
// //           onClick={loadAllData}
// //           className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
// //         >
// //           {loading ? (
// //             <Loader2 size={16} className="animate-spin" />
// //           ) : (
// //             <RefreshCw size={16} />
// //           )}
// //           Refresh
// //         </button>
// //       </div>

// //       {error && (
// //         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
// //           <Bell size={16} />
// //           {error}
// //         </div>
// //       )}

// //       <StatCard stats={statCards} />

// //       <div className="flex flex-col gap-4">
// //         {tabs}

// //         {activeTab === "overview" && (
// //           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
// //             <DataTable
// //               title="Reported Threads"
// //               subtitle="Threads that need moderator attention"
// //               columns={threadColumns}
// //               data={reportedThreads}
// //               renderRow={renderThreadRow}
// //               actions={threadActions}
// //               searchableKeys={[
// //                 "title",
// //                 "author.name",
// //                 "author.email",
// //                 "tags",
// //                 "content",
// //               ]}
// //               itemsPerPage={5}
// //               emptyState="No reported threads found"
// //             />
// //             <DataTable
// //               title="Pending Reports"
// //               subtitle="Reports waiting for review"
// //               columns={reportColumns}
// //               data={reports}
// //               renderRow={renderReportRow}
// //               actions={reportActions}
// //               searchableKeys={[
// //                 "reason",
// //                 "targetType",
// //                 "targetId",
// //                 "reportedBy.name",
// //                 "reportedBy.email",
// //               ]}
// //               filterOptions={[
// //                 { label: "Thread", value: "thread" },
// //                 { label: "Comment", value: "comment" },
// //               ]}
// //               filterKey="targetType"
// //               itemsPerPage={5}
// //               emptyState="No pending reports"
// //             />
// //           </div>
// //         )}

// //         {activeTab === "threads" && (
// //           <DataTable
// //             title="All Threads"
// //             subtitle="Manage every thread in the forum"
// //             columns={threadColumns}
// //             data={threads}
// //             renderRow={renderThreadRow}
// //             actions={threadActions}
// //             searchableKeys={[
// //               "title",
// //               "author.name",
// //               "author.email",
// //               "tags",
// //               "content",
// //             ]}
// //             filterOptions={[
// //               { label: "Active", value: "active" },
// //               { label: "Hidden", value: "hidden" },
// //               { label: "Locked", value: "locked" },
// //               { label: "Deleted", value: "deleted" },
// //             ]}
// //             filterKey="status"
// //             itemsPerPage={8}
// //             emptyState="No threads found"
// //           />
// //         )}

// //         {activeTab === "reports" && (
// //           <DataTable
// //             title="Pending Reports"
// //             subtitle="Review and resolve reported forum content"
// //             columns={reportColumns}
// //             data={reports}
// //             renderRow={renderReportRow}
// //             actions={reportActions}
// //             searchableKeys={[
// //               "reason",
// //               "targetType",
// //               "targetId",
// //               "reportedBy.name",
// //               "reportedBy.email",
// //             ]}
// //             filterOptions={[
// //               { label: "Thread", value: "thread" },
// //               { label: "Comment", value: "comment" },
// //             ]}
// //             filterKey="targetType"
// //             itemsPerPage={8}
// //             emptyState="No reports pending review"
// //           />
// //         )}
// //       </div>

// //       {loading && (
// //         <div className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
// //           <Loader2 size={16} className="animate-spin" />
// //           Loading forum data…
// //         </div>
// //       )}

// //       {viewer && (
// //         <ThreadViewerModal
// //           mode={viewer.mode}
// //           targetId={viewer.targetId}
// //           highlightCommentId={viewer.highlightCommentId}
// //           onClose={() => setViewer(null)}
// //           onActionDone={loadAllData}
// //         />
// //       )}
// //     </div>
// //   );
// // }


// // file: src/admin/pages/CommunityManagement.jsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   BarChart3,
//   Bell,
//   CheckCircle2,
//   Flag,
//   FileText,
//   Loader2,
//   ShieldAlert,
//   Trash2,
//   RefreshCw,
//   Search,
// } from "lucide-react";

// import StatCard from "../components/StatCard";
// import DataTable from "../components/DataTable";
// import ThreadViewerModal from "../components/ThreadViewerModal";
// import {
//   getAllThreads,
//   getReportedThreads,
//   permanentDeleteThread,
//   getPendingReports,
//   reviewReport,
//   rejectReport,
//   getForumStats,
// } from "../../services/adminForumAPI";

// const TAB_OPTIONS = [
//   { key: "overview", label: "Overview", icon: BarChart3 },
//   { key: "threads", label: "Threads", icon: FileText },
//   { key: "reports", label: "Reports", icon: Flag },
// ];

// const formatDate = (value) => {
//   if (!value) return "-";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "-";
//   return date.toLocaleString();
// };

// const getStatusBadge = (item) => {
//   if (item?.isDeleted) return "bg-red-100 text-red-700";
//   if (item?.isHidden) return "bg-amber-100 text-amber-700";
//   if (item?.isLocked) return "bg-slate-100 text-slate-700";
//   return "bg-emerald-100 text-emerald-700";
// };

// const readErrorMessage = (error) => {
//   if (!error) return "Something went wrong.";
//   if (typeof error === "string") return error;
//   return error.message || "Something went wrong.";
// };

// export default function CommunityManagement() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [threads, setThreads] = useState([]);
//   const [reportedThreads, setReportedThreads] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [stats, setStats] = useState({
//     totalThreads: 0,
//     totalReports: 0,
//     pendingReports: 0,
//   });

//   const [viewer, setViewer] = useState(null);

//   const openThreadViewer = (threadId) =>
//     setViewer({ mode: "thread", targetId: threadId });

//   const openReportViewer = (report) => {
//     setViewer({
//       mode: "thread",
//       targetId: report.targetId,
//       highlightCommentId: null,
//     });
//   };

//   const loadAllData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const [threadsRes, reportedThreadsRes, reportsRes, statsRes] =
//         await Promise.all([
//           getAllThreads(),
//           getReportedThreads(),
//           getPendingReports(),
//           getForumStats(),
//         ]);

//       setThreads(
//         (threadsRes?.threads || []).map((t) => ({
//           ...t,
//           status: t.isDeleted
//             ? "deleted"
//             : t.isHidden
//             ? "hidden"
//             : t.isLocked
//             ? "locked"
//             : "active",
//         }))
//       );

//       setReportedThreads(reportedThreadsRes?.threads || []);
//       setReports(reportsRes?.reports || []);
//       setStats(
//         statsRes?.stats || {
//           totalThreads: 0,
//           totalReports: 0,
//           pendingReports: 0,
//         }
//       );
//     } catch (err) {
//       setError(readErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAllData();
//   }, []);

//   const handleAction = async (actionFn) => {
//     setActionLoading(true);
//     setError("");
//     try {
//       await actionFn();
//       await loadAllData();
//     } catch (err) {
//       setError(readErrorMessage(err));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const statCards = useMemo(
//     () => [
//       {
//         title: "Total Threads",
//         value: stats.totalThreads,
//         subtitle: "All forum threads",
//         Icon: FileText,
//         iconBg: "bg-blue-50",
//         iconColor: "text-blue-600",
//       },
//       {
//         title: "Pending Reports",
//         value: stats.pendingReports,
//         subtitle: "Needs admin review",
//         Icon: ShieldAlert,
//         iconBg: "bg-amber-50",
//         iconColor: "text-amber-600",
//       },
//     ],
//     [stats]
//   );

//   const threadColumns = [
//     { label: "Title", key: "title", sortable: true },
//     { label: "Author", key: "author.name", sortable: true },
//     { label: "Score", key: "score", sortable: true },
//     { label: "Comments", key: "commentsCount", sortable: true },
//     { label: "Status", key: "isHidden", sortable: true },
//     { label: "Created", key: "createdAt", sortable: true },
//   ];

//   const reportColumns = [
//     { label: "Target Type", key: "targetType", sortable: true },
//     { label: "Target", key: "targetId", sortable: true },
//     { label: "Reason", key: "reason", sortable: true },
//     { label: "Status", key: "status", sortable: true },
//     { label: "Reported By", key: "reportedBy.name", sortable: true },
//     { label: "Created", key: "createdAt", sortable: true },
//   ];

//   const threadActions = (thread) => (
//     <div className="flex flex-wrap justify-center gap-2">
//       <button
//         onClick={() => openThreadViewer(thread._id)}
//         className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
//       >
//         <Search size={14} /> View
//       </button>

//       <button
//         disabled={actionLoading}
//         onClick={() => handleAction(() => permanentDeleteThread(thread._id))}
//         className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
//       >
//         <Trash2 size={14} /> Delete
//       </button>
//     </div>
//   );

//   const reportActions = (report) => (
//     <div className="flex flex-wrap justify-center gap-2">
//       <button
//         onClick={() => openReportViewer(report)}
//         className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
//       >
//         <Search size={14} /> Read
//       </button>

//       <button
//         disabled={actionLoading}
//         onClick={() =>
//           handleAction(() => reviewReport(report._id, "Reviewed by admin"))
//         }
//         className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
//       >
//         <CheckCircle2 size={14} /> Approve
//       </button>

//       <button
//         disabled={actionLoading}
//         onClick={() =>
//           handleAction(() => rejectReport(report._id, "Rejected by admin"))
//         }
//         className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50"
//       >
//         <Trash2 size={14} /> Reject
//       </button>
//     </div>
//   );

//   const renderThreadRow = (thread) => (
//     <>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="max-w-[280px]">
//           <p className="font-medium text-gray-900 truncate">{thread.title}</p>
//           <p className="text-xs text-gray-500 truncate">
//             {thread.tags?.length ? thread.tags.join(", ") : "No tags"}
//           </p>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//         {thread.author?.name || thread.author?.email || "Unknown"}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//         {thread.score ?? 0}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//         {thread.commentsCount ?? 0}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span
//           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
//             thread
//           )}`}
//         >
//           {thread.isDeleted
//             ? "Deleted"
//             : thread.isHidden
//             ? "Hidden"
//             : thread.isLocked
//             ? "Locked"
//             : "Active"}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {formatDate(thread.createdAt)}
//       </td>
//     </>
//   );

//   const renderReportRow = (report) => (
//     <>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
//         {report.targetType}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[180px] truncate">
//         {report.targetTitle ||
//           report.targetContent ||
//           String(report.targetId)}
//       </td>
//       <td className="px-6 py-4 text-sm text-gray-700 max-w-[320px]">
//         <p className="truncate">{report.reason}</p>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span
//           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//             report.status === "pending"
//               ? "bg-amber-100 text-amber-700"
//               : report.status === "reviewed"
//               ? "bg-emerald-100 text-emerald-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {report.status}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//         {report.reportedBy?.name ||
//           report.reportedBy?.email ||
//           "Unknown"}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {formatDate(report.createdAt)}
//       </td>
//     </>
//   );

//   const tabs = (
//     <div className="flex flex-wrap gap-2">
//       {TAB_OPTIONS.map((tab) => {
//         const Icon = tab.icon;
//         const isActive = activeTab === tab.key;
//         return (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
//               isActive
//                 ? "bg-gray-900 text-white shadow-sm"
//                 : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
//             }`}
//           >
//             <Icon size={16} />
//             {tab.label}
//           </button>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Community Management
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Moderate threads and user reports from the admin panel.
//           </p>
//         </div>
//         <button
//           onClick={loadAllData}
//           className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           {loading ? (
//             <Loader2 size={16} className="animate-spin" />
//           ) : (
//             <RefreshCw size={16} />
//           )}
//           Refresh
//         </button>
//       </div>

//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
//           <Bell size={16} />
//           {error}
//         </div>
//       )}

//       <StatCard stats={statCards} />

//       <div className="flex flex-col gap-4">
//         {tabs}

//         {activeTab === "overview" && (
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             <DataTable
//               title="Reported Threads"
//               subtitle="Threads that need moderator attention"
//               columns={threadColumns}
//               data={reportedThreads}
//               renderRow={renderThreadRow}
//               actions={threadActions}
//               searchableKeys={[
//                 "title",
//                 "author.name",
//                 "author.email",
//                 "tags",
//                 "content",
//               ]}
//               itemsPerPage={5}
//               emptyState="No reported threads found"
//             />
//             <DataTable
//               title="Pending Reports"
//               subtitle="Reports waiting for review"
//               columns={reportColumns}
//               data={reports}
//               renderRow={renderReportRow}
//               actions={reportActions}
//               searchableKeys={[
//                 "reason",
//                 "targetType",
//                 "targetId",
//                 "reportedBy.name",
//                 "reportedBy.email",
//               ]}
//               filterOptions={[
//                 { label: "Thread", value: "thread" },
//                 { label: "Comment", value: "comment" },
//               ]}
//               filterKey="targetType"
//               itemsPerPage={5}
//               emptyState="No pending reports"
//             />
//           </div>
//         )}

//         {activeTab === "threads" && (
//           <DataTable
//             title="All Threads"
//             subtitle="Manage every thread in the forum"
//             columns={threadColumns}
//             data={threads}
//             renderRow={renderThreadRow}
//             actions={threadActions}
//             searchableKeys={[
//               "title",
//               "author.name",
//               "author.email",
//               "tags",
//               "content",
//             ]}
//             filterOptions={[
//               { label: "Active", value: "active" },
//               { label: "Hidden", value: "hidden" },
//               { label: "Locked", value: "locked" },
//               { label: "Deleted", value: "deleted" },
//             ]}
//             filterKey="status"
//             itemsPerPage={8}
//             emptyState="No threads found"
//           />
//         )}

//         {activeTab === "reports" && (
//           <DataTable
//             title="Pending Reports"
//             subtitle="Review and resolve reported forum content"
//             columns={reportColumns}
//             data={reports}
//             renderRow={renderReportRow}
//             actions={reportActions}
//             searchableKeys={[
//               "reason",
//               "targetType",
//               "targetId",
//               "reportedBy.name",
//               "reportedBy.email",
//             ]}
//             filterOptions={[
//               { label: "Thread", value: "thread" },
//               { label: "Comment", value: "comment" },
//             ]}
//             filterKey="targetType"
//             itemsPerPage={8}
//             emptyState="No reports pending review"
//           />
//         )}
//       </div>

//       {loading && (
//         <div className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
//           <Loader2 size={16} className="animate-spin" />
//           Loading forum data…
//         </div>
//       )}

//       {viewer && (
//         <ThreadViewerModal
//           mode={viewer.mode}
//           targetId={viewer.targetId}
//           highlightCommentId={viewer.highlightCommentId}
//           onClose={() => setViewer(null)}
//           onActionDone={loadAllData}
//         />
//       )}
//     </div>
//   );
// }

// file: src/admin/pages/CommunityManagement.jsx
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  Flag,
  FileText,
  Loader2,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Search,
} from "lucide-react";

import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import ThreadViewerModal from "../components/ThreadViewerModal";
import {
  getAllThreads,
  getReportedThreads,
  permanentDeleteThread,
  getPendingReports,
  reviewReport,
  rejectReport,
  getForumStats,
} from "../../services/adminForumAPI";

const TAB_OPTIONS = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "threads", label: "Threads", icon: FileText },
  { key: "reports", label: "Reports", icon: Flag },
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const getStatusBadge = (item) => {
  if (item?.isDeleted) return "bg-red-100 text-red-700";
  if (item?.isHidden) return "bg-amber-100 text-amber-700";
  if (item?.isLocked) return "bg-slate-100 text-slate-700";
  return "bg-emerald-100 text-emerald-700";
};

const readErrorMessage = (error) => {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  return error.message || "Something went wrong.";
};

export default function CommunityManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [threads, setThreads] = useState([]);
  const [reportedThreads, setReportedThreads] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalThreads: 0,
    totalReports: 0,
    pendingReports: 0,
  });

  const [viewer, setViewer] = useState(null);

  const openThreadViewer = (threadId) =>
    setViewer({ mode: "thread", targetId: threadId });

  // ── FIX: for comment reports, open in "comment" mode and pass the
  //         comment ID as highlightCommentId so the modal can load the
  //         full parent thread and scroll to the flagged comment.
  const openReportViewer = (report) => {
    if (report.targetType === "comment") {
      setViewer({
        mode: "comment",
        targetId: report.targetId,
        highlightCommentId: report.targetId,
      });
    } else {
      setViewer({
        mode: "thread",
        targetId: report.targetId,
        highlightCommentId: null,
      });
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [threadsRes, reportedThreadsRes, reportsRes, statsRes] =
        await Promise.all([
          getAllThreads(),
          getReportedThreads(),
          getPendingReports(),
          getForumStats(),
        ]);

      setThreads(
        (threadsRes?.threads || []).map((t) => ({
          ...t,
          status: t.isDeleted
            ? "deleted"
            : t.isHidden
            ? "hidden"
            : t.isLocked
            ? "locked"
            : "active",
        }))
      );

      setReportedThreads(reportedThreadsRes?.threads || []);
      setReports(reportsRes?.reports || []);
      setStats(
        statsRes?.stats || {
          totalThreads: 0,
          totalReports: 0,
          pendingReports: 0,
        }
      );
    } catch (err) {
      setError(readErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleAction = async (actionFn) => {
    setActionLoading(true);
    setError("");
    try {
      await actionFn();
      await loadAllData();
    } catch (err) {
      setError(readErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const statCards = useMemo(
    () => [
      {
        title: "Total Threads",
        value: stats.totalThreads,
        subtitle: "All forum threads",
        Icon: FileText,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        title: "Pending Reports",
        value: stats.pendingReports,
        subtitle: "Needs admin review",
        Icon: ShieldAlert,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
    ],
    [stats]
  );

  const threadColumns = [
    { label: "Title", key: "title", sortable: true },
    { label: "Author", key: "author.name", sortable: true },
    { label: "Score", key: "score", sortable: true },
    { label: "Comments", key: "commentsCount", sortable: true },
    { label: "Status", key: "isHidden", sortable: true },
    { label: "Created", key: "createdAt", sortable: true },
  ];

  const reportColumns = [
    { label: "Target Type", key: "targetType", sortable: true },
    { label: "Target", key: "targetId", sortable: true },
    { label: "Reason", key: "reason", sortable: true },
    { label: "Status", key: "status", sortable: true },
    { label: "Reported By", key: "reportedBy.name", sortable: true },
    { label: "Created", key: "createdAt", sortable: true },
  ];

  const threadActions = (thread) => (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => openThreadViewer(thread._id)}
        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
      >
        <Search size={14} /> View
      </button>

      <button
        disabled={actionLoading}
        onClick={() => handleAction(() => permanentDeleteThread(thread._id))}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );

  const reportActions = (report) => (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => openReportViewer(report)}
        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
      >
        <Search size={14} /> Read
      </button>

      <button
        disabled={actionLoading}
        onClick={() =>
          handleAction(() => reviewReport(report._id, "Reviewed by admin"))
        }
        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
      >
        <CheckCircle2 size={14} /> Approve
      </button>

      <button
        disabled={actionLoading}
        onClick={() =>
          handleAction(() => rejectReport(report._id, "Rejected by admin"))
        }
        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50"
      >
        <Trash2 size={14} /> Reject
      </button>
    </div>
  );

  const renderThreadRow = (thread) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="max-w-[280px]">
          <p className="font-medium text-gray-900 truncate">{thread.title}</p>
          <p className="text-xs text-gray-500 truncate">
            {thread.tags?.length ? thread.tags.join(", ") : "No tags"}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {thread.author?.name || thread.author?.email || "Unknown"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {thread.score ?? 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {thread.commentsCount ?? 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
            thread
          )}`}
        >
          {thread.isDeleted
            ? "Deleted"
            : thread.isHidden
            ? "Hidden"
            : thread.isLocked
            ? "Locked"
            : "Active"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(thread.createdAt)}
      </td>
    </>
  );

  const renderReportRow = (report) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
        {report.targetType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[180px] truncate">
        {report.targetTitle ||
          report.targetContent ||
          String(report.targetId)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-[320px]">
        <p className="truncate">{report.reason}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            report.status === "pending"
              ? "bg-amber-100 text-amber-700"
              : report.status === "reviewed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {report.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {report.reportedBy?.name ||
          report.reportedBy?.email ||
          "Unknown"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(report.createdAt)}
      </td>
    </>
  );

  const tabs = (
    <div className="flex flex-wrap gap-2">
      {TAB_OPTIONS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Community Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Moderate threads and user reports from the admin panel.
          </p>
        </div>
        <button
          onClick={loadAllData}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <Bell size={16} />
          {error}
        </div>
      )}

      <StatCard stats={statCards} />

      <div className="flex flex-col gap-4">
        {tabs}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DataTable
              title="Reported Threads"
              subtitle="Threads that need moderator attention"
              columns={threadColumns}
              data={reportedThreads}
              renderRow={renderThreadRow}
              actions={threadActions}
              searchableKeys={[
                "title",
                "author.name",
                "author.email",
                "tags",
                "content",
              ]}
              itemsPerPage={5}
              emptyState="No reported threads found"
            />
            <DataTable
              title="Pending Reports"
              subtitle="Reports waiting for review"
              columns={reportColumns}
              data={reports}
              renderRow={renderReportRow}
              actions={reportActions}
              searchableKeys={[
                "reason",
                "targetType",
                "targetId",
                "reportedBy.name",
                "reportedBy.email",
              ]}
              filterOptions={[
                { label: "Thread", value: "thread" },
                { label: "Comment", value: "comment" },
              ]}
              filterKey="targetType"
              itemsPerPage={5}
              emptyState="No pending reports"
            />
          </div>
        )}

        {activeTab === "threads" && (
          <DataTable
            title="All Threads"
            subtitle="Manage every thread in the forum"
            columns={threadColumns}
            data={threads}
            renderRow={renderThreadRow}
            actions={threadActions}
            searchableKeys={[
              "title",
              "author.name",
              "author.email",
              "tags",
              "content",
            ]}
            filterOptions={[
              { label: "Active", value: "active" },
              { label: "Hidden", value: "hidden" },
              { label: "Locked", value: "locked" },
              { label: "Deleted", value: "deleted" },
            ]}
            filterKey="status"
            itemsPerPage={8}
            emptyState="No threads found"
          />
        )}

        {activeTab === "reports" && (
          <DataTable
            title="Pending Reports"
            subtitle="Review and resolve reported forum content"
            columns={reportColumns}
            data={reports}
            renderRow={renderReportRow}
            actions={reportActions}
            searchableKeys={[
              "reason",
              "targetType",
              "targetId",
              "reportedBy.name",
              "reportedBy.email",
            ]}
            filterOptions={[
              { label: "Thread", value: "thread" },
              { label: "Comment", value: "comment" },
            ]}
            filterKey="targetType"
            itemsPerPage={8}
            emptyState="No reports pending review"
          />
        )}
      </div>

      {loading && (
        <div className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          <Loader2 size={16} className="animate-spin" />
          Loading forum data…
        </div>
      )}

      {viewer && (
        <ThreadViewerModal
          mode={viewer.mode}
          targetId={viewer.targetId}
          highlightCommentId={viewer.highlightCommentId}
          onClose={() => setViewer(null)}
          onActionDone={loadAllData}
        />
      )}
    </div>
  );
}