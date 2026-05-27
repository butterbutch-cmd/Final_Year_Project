// // import { useEffect, useState } from "react";
// // import { deleteThread as apiDeleteThread, editThread as apiEditThread } from "../../services/forumAPI";
// // import { Pencil, Trash2, Flag, Heart, MessageSquare, Pin } from "lucide-react";
// // import toast from "react-hot-toast";

// // const sans  = { fontFamily: "'DM Sans', sans-serif" };
// // const serif = { fontFamily: "'Cormorant Garamond', serif" };

// // const AVATAR_PALETTE = [
// //   "bg-[#2d4a2d]",
// //   "bg-[#7a9e7e]",
// //   "bg-[#c4704a]",
// //   "bg-[#4a6741]",
// //   "bg-[#8c6a4a]",
// //   "bg-[#5a7a5a]",
// //   "bg-[#b56a40]",
// //   "bg-[#3a5a3a]",
// // ];

// // const avatarColor = (name) =>
// //   AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

// // const Avatar = ({ name, size = "w-6 h-6", ring = false }) => (
// //   <span
// //     className={`${size} rounded-full ${avatarColor(name)} text-[#f7f4ee] text-[10px] font-semibold flex items-center justify-center flex-shrink-0 ${ring ? "ring-2 ring-[#fdfcf8]" : ""}`}
// //     style={serif}
// //     title={name}
// //   >
// //     {(name?.[0] || "?").toUpperCase()}
// //   </span>
// // );

// // const ActionBtn = ({ onClick, icon, label, danger }) => (
// //   <button
// //     onClick={(e) => { e.stopPropagation(); onClick(e); }}
// //     className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium tracking-[0.04em] border border-transparent transition-all duration-150 ${
// //       danger
// //         ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
// //         : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10"
// //     }`}
// //     style={sans}
// //     type="button"
// //   >
// //     {icon}
// //     {label}
// //   </button>
// // );

// // const timeAgo = (date) => {
// //   if (!date) return "—";
// //   const diff = Date.now() - new Date(date).getTime();
// //   const m = Math.floor(diff / 60000);
// //   if (m < 1)  return "just now";
// //   if (m < 60) return `${m}m ago`;
// //   const h = Math.floor(m / 60);
// //   if (h < 24) return `${h}h ago`;
// //   const d = Math.floor(h / 24);
// //   if (d < 30) return `${d}d ago`;
// //   return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
// // };

// // export default function ThreadRow({
// //   thread,
// //   onClick,
// //   pinned = false,
// //   currentUser,
// //   onDelete,
// //   onEdit,
// //   onReport,
// // }) {
// //   const getOwnerId = (author) =>
// //     typeof author === "string" ? author : author?._id ?? author?.id ?? null;

// //   const isCurrentUserThread =
// //     currentUser && getOwnerId(thread.author) === currentUser._id;

// //   const displayUsername =
// //     thread.author?.username ||
// //     (isCurrentUserThread ? currentUser?.username : null) ||
// //     "?";

// //   useEffect(() => {
// //     console.debug("ThreadRow rendered for thread ID:", thread._id);
// //   }, [thread, currentUser, displayUsername]);

// //   const participants = thread.participants || [thread.author];
// //   const isOwner      = currentUser && getOwnerId(thread.author) === currentUser._id;

// //   // ---- Modal states ----
// //   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
// //   const [deleteLoading, setDeleteLoading] = useState(false);

// //   const [editModalOpen, setEditModalOpen] = useState(false);
// //   const [editTitle, setEditTitle] = useState(thread.title);
// //   const [editContent, setEditContent] = useState(thread.content);
// //   const [editLoading, setEditLoading] = useState(false);

// //   const [reportModalOpen, setReportModalOpen] = useState(false);
// //   const [reportReason, setReportReason] = useState("");
// //   const [reportLoading, setReportLoading] = useState(false);

// //   // ---- Action handlers ----

// //   const handleDeleteClick = (e) => {
// //     e.stopPropagation();
// //     if (typeof onDelete === "function") {
// //       onDelete(thread._id);
// //       return;
// //     }
// //     setDeleteModalOpen(true);
// //   };

// //   const confirmDelete = async () => {
// //     setDeleteLoading(true);
// //     try {
// //       await apiDeleteThread(thread._id);
// //       toast.success("Thread deleted");
// //       window.location.reload();
// //     } catch (err) {
// //       console.error("Failed to delete thread:", err);
// //       toast.error(err?.message || "Delete failed");
// //     } finally {
// //       setDeleteLoading(false);
// //       setDeleteModalOpen(false);
// //     }
// //   };

// //   const handleEditClick = (e) => {
// //     e.stopPropagation();
// //     if (typeof onEdit === "function") {
// //       onEdit(thread._id);
// //       return;
// //     }
// //     setEditTitle(thread.title);
// //     setEditContent(thread.content);
// //     setEditModalOpen(true);
// //   };

// //   const confirmEdit = async () => {
// //     if (!editTitle.trim() || !editContent.trim()) {
// //       toast.error("Title and content cannot be empty");
// //       return;
// //     }
// //     setEditLoading(true);
// //     try {
// //       await apiEditThread(thread._id, { title: editTitle, content: editContent });
// //       toast.success("Thread updated successfully");
// //       window.location.reload();
// //     } catch (err) {
// //       console.error("Edit failed:", err);
// //       toast.error(err?.message || "Failed to edit thread");
// //     } finally {
// //       setEditLoading(false);
// //       setEditModalOpen(false);
// //     }
// //   };

// //   const handleReportClick = (e) => {
// //     e.stopPropagation();
// //     if (typeof onReport === "function") {
// //       onReport(thread._id);
// //       return;
// //     }
// //     setReportReason("");
// //     setReportModalOpen(true);
// //   };

// //   const confirmReport = async () => {
// //     setReportLoading(true);
// //     try {
// //       const { report } = await import("../../services/forumAPI");
// //       await report({
// //         targetType: "thread",
// //         targetId: thread._id,
// //         reason: reportReason.trim() || "Reported via UI",
// //       });
// //       toast.success("Reported — moderators will review this thread.");
// //       setReportModalOpen(false);
// //     } catch (err) {
// //       console.error("Report failed:", err);
// //       toast.error(err?.message || "Failed to report");
// //     } finally {
// //       setReportLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <tr
// //         onClick={() => onClick?.(thread._id)}
// //         className={`group border-b cursor-pointer transition-all duration-150 ${
// //           pinned
// //             ? "bg-[#f7f4ee] border-[#2d4a2d]/10 hover:bg-[#f0ece3]"
// //             : "bg-[#fdfcf8] border-[#2d4a2d]/8 hover:bg-[#f7f4ee]"
// //         }`}
// //       >
// //         {/* ── Title + meta ── */}
// //         <td className="py-4 px-5 w-full">
// //           <div className="flex items-start gap-3">
// //             {pinned && (
// //               <Pin size={13} className="text-[#c4704a] mt-0.5 flex-shrink-0 rotate-45" />
// //             )}

// //             <div className="min-w-0 flex-1">
// //               <p
// //                 className="text-[14px] font-medium leading-snug mb-1.5 text-[#1a3320] group-hover:text-[#2d4a2d] transition-colors truncate"
// //                 style={sans}
// //               >
// //                 {thread.title}
// //               </p>

// //               {pinned && thread.content && (
// //                 <p
// //                   className="text-[12px] font-light text-[#8c8880] leading-relaxed line-clamp-1 mb-2"
// //                   style={sans}
// //                 >
// //                   {thread.content}
// //                 </p>
// //               )}

// //               <div className="flex items-center gap-2 flex-wrap">
// //                 <div className="flex items-center gap-1.5">
// //                   <Avatar name={displayUsername} size="w-4 h-4" />
// //                   <span className="text-[11.5px] font-light text-[#8c8880]" style={sans}>
// //                     {displayUsername}
// //                   </span>
// //                 </div>

// //                 {thread.tags?.length > 0 && (
// //                   <>
// //                     <span className="text-[#2d4a2d]/20 text-xs">·</span>
// //                     <div className="flex gap-1.5 flex-wrap">
// //                       {thread.tags.map((tag) => (
// //                         <span
// //                           key={tag}
// //                           onClick={(e) => e.stopPropagation()}
// //                           className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-[#2d4a2d]/8 text-[#2d4a2d] border border-[#2d4a2d]/12 hover:bg-[#2d4a2d]/14 transition-colors cursor-pointer tracking-[0.05em]"
// //                           style={sans}
// //                         >
// //                           {tag}
// //                         </span>
// //                       ))}
// //                     </div>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </td>

// //         {/* ── Category ── */}
// //         <td className="py-4 px-4 whitespace-nowrap">
// //           {thread.category && (
// //             <span
// //               className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2d4a2d] bg-[#2d4a2d]/8 border border-[#2d4a2d]/12 px-2.5 py-1 rounded-sm tracking-[0.05em]"
// //               style={sans}
// //             >
// //               <span className="w-1.5 h-1.5 rounded-full bg-[#7a9e7e] flex-shrink-0" />
// //               {thread.category}
// //             </span>
// //           )}
// //         </td>

// //         {/* ── Participants ── */}
// //         <td className="py-4 px-4 whitespace-nowrap">
// //           <div className="flex -space-x-1.5">
// //             {participants.slice(0, 3).map((user, i) => {
// //               const isMe = currentUser && getOwnerId(user) === currentUser._id;
// //               const name = user?.username || (isMe ? currentUser?.username : "?");
// //               return <Avatar key={i} name={name} size="w-6 h-6" ring />;
// //             })}
// //             {participants.length > 3 && (
// //               <span
// //                 className="w-6 h-6 rounded-full bg-[#2d4a2d]/10 text-[#2d4a2d] text-[10px] font-medium flex items-center justify-center ring-2 ring-[#fdfcf8] flex-shrink-0"
// //                 style={sans}
// //               >
// //                 +{participants.length - 3}
// //               </span>
// //             )}
// //           </div>
// //         </td>

// //         {/* ── Score ── */}
// //         <td className="py-4 px-4 whitespace-nowrap text-center">
// //           <div
// //             className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#4a4a4a]"
// //             style={sans}
// //           >
// //             <Heart size={11} className="text-[#c4704a]" />
// //             {thread.score ?? 0}
// //           </div>
// //         </td>

// //         {/* ── Comments ── */}
// //         <td className="py-4 px-4 whitespace-nowrap text-center">
// //           <div
// //             className="inline-flex items-center gap-1 text-[12.5px] font-light text-[#8c8880]"
// //             style={sans}
// //           >
// //             <MessageSquare size={11} className="text-[#8c8880]" />
// //             {thread.commentCount ?? "—"}
// //           </div>
// //         </td>

// //         {/* ── Actions + time ── */}
// //         <td className="py-4 px-4 whitespace-nowrap text-right">
// //           <div className="flex items-center justify-end gap-0.5">
// //             <span className="text-[11px] font-light text-[#8c8880] mr-2" style={sans}>
// //               {timeAgo(thread.createdAt)}
// //             </span>

// //             {isOwner ? (
// //               <>
// //                 <ActionBtn onClick={handleEditClick} icon={<Pencil size={11} />} label="Edit" />
// //                 <ActionBtn onClick={handleDeleteClick} icon={<Trash2 size={11} />} label="Delete" danger />
// //               </>
// //             ) : (
// //               <ActionBtn onClick={handleReportClick} icon={<Flag size={11} />} label="Report" />
// //             )}
// //           </div>
// //         </td>
// //       </tr>

// //       {/* ─── Delete Confirmation Modal ─── */}
// //       {deleteModalOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
// //           <div className="absolute inset-0" onClick={() => !deleteLoading && setDeleteModalOpen(false)} />
// //           <div className="relative w-full max-w-sm bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
// //             <button
// //               onClick={() => setDeleteModalOpen(false)}
// //               className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
// //               disabled={deleteLoading}
// //             >
// //               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Delete Thread</h2>
// //             <p className="text-[13px] text-[#8c8880] mb-5" style={sans}>
// //               Are you sure you want to delete this thread? This action cannot be undone.
// //             </p>
// //             <div className="flex justify-end gap-3">
// //               <button
// //                 onClick={() => setDeleteModalOpen(false)}
// //                 className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
// //                 style={sans}
// //                 disabled={deleteLoading}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmDelete}
// //                 className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
// //                   deleteLoading ? "cursor-wait" : ""
// //                 }`}
// //                 style={sans}
// //                 disabled={deleteLoading}
// //               >
// //                 {deleteLoading ? (
// //                   <>
// //                     <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
// //                     Deleting…
// //                   </>
// //                 ) : (
// //                   "Delete"
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ─── Edit Modal ─── */}
// //       {editModalOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
// //           <div className="absolute inset-0" onClick={() => !editLoading && setEditModalOpen(false)} />
// //           <div className="relative w-full max-w-md bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
// //             <button
// //               onClick={() => setEditModalOpen(false)}
// //               className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
// //               disabled={editLoading}
// //             >
// //               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //             <h2 className="text-lg font-light text-[#1a3320] mb-4" style={serif}>Edit Thread</h2>
// //             <div className="flex flex-col gap-4">
// //               <div>
// //                 <label className="block text-[11px] uppercase tracking-[0.1em] text-[#8c8880] mb-1" style={sans}>
// //                   Title
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={editTitle}
// //                   onChange={(e) => setEditTitle(e.target.value)}
// //                   className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50"
// //                   style={sans}
// //                   placeholder="Thread title"
// //                   disabled={editLoading}
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-[11px] uppercase tracking-[0.1em] text-[#8c8880] mb-1" style={sans}>
// //                   Content
// //                 </label>
// //                 <textarea
// //                   value={editContent}
// //                   onChange={(e) => setEditContent(e.target.value)}
// //                   rows={4}
// //                   className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
// //                   style={sans}
// //                   placeholder="Thread content"
// //                   disabled={editLoading}
// //                 />
// //               </div>
// //             </div>
// //             <div className="flex justify-end gap-3 mt-6">
// //               <button
// //                 onClick={() => setEditModalOpen(false)}
// //                 className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
// //                 style={sans}
// //                 disabled={editLoading}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmEdit}
// //                 className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#2d4a2d] text-white rounded-sm hover:bg-[#1a3320] transition-colors flex items-center gap-2 disabled:opacity-50 ${
// //                   editLoading ? "cursor-wait" : ""
// //                 }`}
// //                 style={sans}
// //                 disabled={editLoading}
// //               >
// //                 {editLoading ? (
// //                   <>
// //                     <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
// //                     Saving…
// //                   </>
// //                 ) : (
// //                   "Save Changes"
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ─── Report Modal ─── */}
// //       {reportModalOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
// //           <div className="absolute inset-0" onClick={() => !reportLoading && setReportModalOpen(false)} />
// //           <div className="relative w-full max-w-sm bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
// //             <button
// //               onClick={() => setReportModalOpen(false)}
// //               className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
// //               disabled={reportLoading}
// //             >
// //               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Report Thread</h2>
// //             <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
// //               Why are you reporting this thread? (optional)
// //             </p>
// //             <textarea
// //               value={reportReason}
// //               onChange={(e) => setReportReason(e.target.value)}
// //               rows={3}
// //               className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
// //               style={sans}
// //               placeholder="Describe the issue..."
// //               disabled={reportLoading}
// //             />
// //             <div className="flex justify-end gap-3 mt-5">
// //               <button
// //                 onClick={() => setReportModalOpen(false)}
// //                 className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
// //                 style={sans}
// //                 disabled={reportLoading}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmReport}
// //                 className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
// //                   reportLoading ? "cursor-wait" : ""
// //                 }`}
// //                 style={sans}
// //                 disabled={reportLoading}
// //               >
// //                 {reportLoading ? (
// //                   <>
// //                     <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
// //                     Sending…
// //                   </>
// //                 ) : (
// //                   "Submit Report"
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { deleteThread as apiDeleteThread, editThread as apiEditThread } from "../../services/forumAPI";
// import { Pencil, Trash2, Flag, Heart, Pin } from "lucide-react";  // ← MessageSquare removed
// import toast from "react-hot-toast";

// const sans = { fontFamily: "'DM Sans', sans-serif" };
// const serif = { fontFamily: "'Cormorant Garamond', serif" };

// const AVATAR_PALETTE = [
//   "bg-[#2d4a2d]",
//   "bg-[#7a9e7e]",
//   "bg-[#c4704a]",
//   "bg-[#4a6741]",
//   "bg-[#8c6a4a]",
//   "bg-[#5a7a5a]",
//   "bg-[#b56a40]",
//   "bg-[#3a5a3a]",
// ];

// const avatarColor = (name) =>
//   AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

// const Avatar = ({ name, size = "w-6 h-6", ring = false }) => (
//   <span
//     className={`${size} rounded-full ${avatarColor(name)} text-[#f7f4ee] text-[10px] font-semibold flex items-center justify-center flex-shrink-0 ${ring ? "ring-2 ring-[#fdfcf8]" : ""}`}
//     style={serif}
//     title={name}
//   >
//     {(name?.[0] || "?").toUpperCase()}
//   </span>
// );

// const ActionBtn = ({ onClick, icon, label, danger }) => (
//   <button
//     onClick={(e) => { e.stopPropagation(); onClick(e); }}
//     className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium tracking-[0.04em] border border-transparent transition-all duration-150 ${
//       danger
//         ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
//         : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10"
//     }`}
//     style={sans}
//     type="button"
//   >
//     {icon}
//     {label}
//   </button>
// );

// const timeAgo = (date) => {
//   if (!date) return "—";
//   const diff = Date.now() - new Date(date).getTime();
//   const m = Math.floor(diff / 60000);
//   if (m < 1)  return "just now";
//   if (m < 60) return `${m}m ago`;
//   const h = Math.floor(m / 60);
//   if (h < 24) return `${h}h ago`;
//   const d = Math.floor(h / 24);
//   if (d < 30) return `${d}d ago`;
//   return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
// };

// export default function ThreadRow({
//   thread,
//   onClick,
//   pinned = false,
//   currentUser,
//   onDelete,
//   onEdit,
//   onReport,
// }) {
//   const getOwnerId = (author) =>
//     typeof author === "string" ? author : author?._id ?? author?.id ?? null;

//   const isCurrentUserThread =
//     currentUser && getOwnerId(thread.author) === currentUser._id;

//   const displayUsername =
//     thread.author?.username ||
//     (isCurrentUserThread ? currentUser?.username : null) ||
//     "?";

//   useEffect(() => {
//     console.debug("ThreadRow rendered for thread ID:", thread._id);
//   }, [thread, currentUser, displayUsername]);

//   const participants = thread.participants || [thread.author];
//   const isOwner      = currentUser && getOwnerId(thread.author) === currentUser._id;

//   // ---- Modal states ----
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editTitle, setEditTitle] = useState(thread.title);
//   const [editContent, setEditContent] = useState(thread.content);
//   const [editLoading, setEditLoading] = useState(false);

//   const [reportModalOpen, setReportModalOpen] = useState(false);
//   const [reportReason, setReportReason] = useState("");
//   const [reportLoading, setReportLoading] = useState(false);

//   // ---- Action handlers ----

//   const handleDeleteClick = (e) => {
//     e.stopPropagation();
//     if (typeof onDelete === "function") {
//       onDelete(thread._id);
//       return;
//     }
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await apiDeleteThread(thread._id);
//       toast.success("Thread deleted");
//       window.location.reload();
//     } catch (err) {
//       console.error("Failed to delete thread:", err);
//       toast.error(err?.message || "Delete failed");
//     } finally {
//       setDeleteLoading(false);
//       setDeleteModalOpen(false);
//     }
//   };

//   const handleEditClick = (e) => {
//     e.stopPropagation();
//     if (typeof onEdit === "function") {
//       onEdit(thread._id);
//       return;
//     }
//     setEditTitle(thread.title);
//     setEditContent(thread.content);
//     setEditModalOpen(true);
//   };

//   const confirmEdit = async () => {
//     if (!editTitle.trim() || !editContent.trim()) {
//       toast.error("Title and content cannot be empty");
//       return;
//     }
//     setEditLoading(true);
//     try {
//       await apiEditThread(thread._id, { title: editTitle, content: editContent });
//       toast.success("Thread updated successfully");
//       window.location.reload();
//     } catch (err) {
//       console.error("Edit failed:", err);
//       toast.error(err?.message || "Failed to edit thread");
//     } finally {
//       setEditLoading(false);
//       setEditModalOpen(false);
//     }
//   };

//   const handleReportClick = (e) => {
//     e.stopPropagation();
//     if (typeof onReport === "function") {
//       onReport(thread._id);
//       return;
//     }
//     setReportReason("");
//     setReportModalOpen(true);
//   };

//   const confirmReport = async () => {
//     setReportLoading(true);
//     try {
//       const { report } = await import("../../services/forumAPI");
//       await report({
//         targetType: "thread",
//         targetId: thread._id,
//         reason: reportReason.trim() || "Reported via UI",
//       });
//       toast.success("Reported — moderators will review this thread.");
//       setReportModalOpen(false);
//     } catch (err) {
//       console.error("Report failed:", err);
//       toast.error(err?.message || "Failed to report");
//     } finally {
//       setReportLoading(false);
//     }
//   };

//   return (
//     <>
//       <tr
//         onClick={() => onClick?.(thread._id)}
//         className={`group border-b cursor-pointer transition-all duration-150 ${
//           pinned
//             ? "bg-[#f7f4ee] border-[#2d4a2d]/10 hover:bg-[#f0ece3]"
//             : "bg-[#fdfcf8] border-[#2d4a2d]/8 hover:bg-[#f7f4ee]"
//         }`}
//       >
//         {/* ── Title + meta ── */}
//         <td className="py-4 px-5 w-full">
//           <div className="flex items-start gap-3">
//             {pinned && (
//               <Pin size={13} className="text-[#c4704a] mt-0.5 flex-shrink-0 rotate-45" />
//             )}

//             <div className="min-w-0 flex-1">
//               <p
//                 className="text-[14px] font-medium leading-snug mb-1.5 text-[#1a3320] group-hover:text-[#2d4a2d] transition-colors truncate"
//                 style={sans}
//               >
//                 {thread.title}
//               </p>

//               {pinned && thread.content && (
//                 <p
//                   className="text-[12px] font-light text-[#8c8880] leading-relaxed line-clamp-1 mb-2"
//                   style={sans}
//                 >
//                   {thread.content}
//                 </p>
//               )}

//               <div className="flex items-center gap-2 flex-wrap">
//                 <div className="flex items-center gap-1.5">
//                   <Avatar name={displayUsername} size="w-4 h-4" />
//                   <span className="text-[11.5px] font-light text-[#8c8880]" style={sans}>
//                     {displayUsername}
//                   </span>
//                 </div>

//                 {thread.tags?.length > 0 && (
//                   <>
//                     <span className="text-[#2d4a2d]/20 text-xs">·</span>
//                     <div className="flex gap-1.5 flex-wrap">
//                       {thread.tags.map((tag) => (
//                         <span
//                           key={tag}
//                           onClick={(e) => e.stopPropagation()}
//                           className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-[#2d4a2d]/8 text-[#2d4a2d] border border-[#2d4a2d]/12 hover:bg-[#2d4a2d]/14 transition-colors cursor-pointer tracking-[0.05em]"
//                           style={sans}
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </td>

//         {/* ── Participants ── */}
//         <td className="py-4 px-4 whitespace-nowrap">
//           <div className="flex -space-x-1.5">
//             {participants.slice(0, 3).map((user, i) => {
//               const isMe = currentUser && getOwnerId(user) === currentUser._id;
//               const name = user?.username || (isMe ? currentUser?.username : "?");
//               return <Avatar key={i} name={name} size="w-6 h-6" ring />;
//             })}
//             {participants.length > 3 && (
//               <span
//                 className="w-6 h-6 rounded-full bg-[#2d4a2d]/10 text-[#2d4a2d] text-[10px] font-medium flex items-center justify-center ring-2 ring-[#fdfcf8] flex-shrink-0"
//                 style={sans}
//               >
//                 +{participants.length - 3}
//               </span>
//             )}
//           </div>
//         </td>

//         {/* ── Score (Likes) ── */}
//         <td className="py-4 px-4 whitespace-nowrap text-center">
//           <div
//             className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#4a4a4a]"
//             style={sans}
//           >
//             <Heart size={11} className="text-[#c4704a]" />
//             {thread.score ?? 0}
//           </div>
//         </td>

//         {/* ── Actions + time (Activity) ── */}
//         <td className="py-4 px-4 whitespace-nowrap text-right">
//           <div className="flex items-center justify-end gap-0.5">
//             <span className="text-[11px] font-light text-[#8c8880] mr-2" style={sans}>
//               {timeAgo(thread.createdAt)}
//             </span>

//             {isOwner ? (
//               <>
//                 <ActionBtn onClick={handleEditClick} icon={<Pencil size={11} />} label="Edit" />
//                 <ActionBtn onClick={handleDeleteClick} icon={<Trash2 size={11} />} label="Delete" danger />
//               </>
//             ) : (
//               <ActionBtn onClick={handleReportClick} icon={<Flag size={11} />} label="Report" />
//             )}
//           </div>
//         </td>
//       </tr>

//       {/* ─── Delete Confirmation Modal ─── */}
//       {deleteModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
//           <div className="absolute inset-0" onClick={() => !deleteLoading && setDeleteModalOpen(false)} />
//           <div className="relative w-full max-w-sm bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
//             <button
//               onClick={() => setDeleteModalOpen(false)}
//               className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
//               disabled={deleteLoading}
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Delete Thread</h2>
//             <p className="text-[13px] text-[#8c8880] mb-5" style={sans}>
//               Are you sure you want to delete this thread? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setDeleteModalOpen(false)}
//                 className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
//                 style={sans}
//                 disabled={deleteLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
//                   deleteLoading ? "cursor-wait" : ""
//                 }`}
//                 style={sans}
//                 disabled={deleteLoading}
//               >
//                 {deleteLoading ? (
//                   <>
//                     <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//                     Deleting…
//                   </>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ─── Edit Modal ─── */}
//       {editModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
//           <div className="absolute inset-0" onClick={() => !editLoading && setEditModalOpen(false)} />
//           <div className="relative w-full max-w-md bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
//             <button
//               onClick={() => setEditModalOpen(false)}
//               className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
//               disabled={editLoading}
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <h2 className="text-lg font-light text-[#1a3320] mb-4" style={serif}>Edit Thread</h2>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <label className="block text-[11px] uppercase tracking-[0.1em] text-[#8c8880] mb-1" style={sans}>
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50"
//                   style={sans}
//                   placeholder="Thread title"
//                   disabled={editLoading}
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] uppercase tracking-[0.1em] text-[#8c8880] mb-1" style={sans}>
//                   Content
//                 </label>
//                 <textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   rows={4}
//                   className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
//                   style={sans}
//                   placeholder="Thread content"
//                   disabled={editLoading}
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setEditModalOpen(false)}
//                 className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
//                 style={sans}
//                 disabled={editLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmEdit}
//                 className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#2d4a2d] text-white rounded-sm hover:bg-[#1a3320] transition-colors flex items-center gap-2 disabled:opacity-50 ${
//                   editLoading ? "cursor-wait" : ""
//                 }`}
//                 style={sans}
//                 disabled={editLoading}
//               >
//                 {editLoading ? (
//                   <>
//                     <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//                     Saving…
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ─── Report Modal ─── */}
//       {reportModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
//           <div className="absolute inset-0" onClick={() => !reportLoading && setReportModalOpen(false)} />
//           <div className="relative w-full max-w-sm bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
//             <button
//               onClick={() => setReportModalOpen(false)}
//               className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
//               disabled={reportLoading}
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Report Thread</h2>
//             <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
//               Why are you reporting this thread? (optional)
//             </p>
//             <textarea
//               value={reportReason}
//               onChange={(e) => setReportReason(e.target.value)}
//               rows={3}
//               className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
//               style={sans}
//               placeholder="Describe the issue..."
//               disabled={reportLoading}
//             />
//             <div className="flex justify-end gap-3 mt-5">
//               <button
//                 onClick={() => setReportModalOpen(false)}
//                 className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
//                 style={sans}
//                 disabled={reportLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmReport}
//                 className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
//                   reportLoading ? "cursor-wait" : ""
//                 }`}
//                 style={sans}
//                 disabled={reportLoading}
//               >
//                 {reportLoading ? (
//                   <>
//                     <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//                     Sending…
//                   </>
//                 ) : (
//                   "Submit Report"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useEffect, useState } from "react";
import { deleteThread as apiDeleteThread, editThread as apiEditThread } from "../../services/forumAPI";
import { Pencil, Trash2, Flag, Heart, Pin } from "lucide-react";
import toast from "react-hot-toast";

const sans = { fontFamily: "'DM Sans', sans-serif" };
const serif = { fontFamily: "'Cormorant Garamond', serif" };

const AVATAR_PALETTE = [
  "bg-[#2d4a2d]",
  "bg-[#7a9e7e]",
  "bg-[#c4704a]",
  "bg-[#4a6741]",
  "bg-[#8c6a4a]",
  "bg-[#5a7a5a]",
  "bg-[#b56a40]",
  "bg-[#3a5a3a]",
];

const avatarColor = (name) =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

const Avatar = ({ name, size = "w-6 h-6", ring = false }) => (
  <span
    className={`${size} rounded-full ${avatarColor(name)} text-[#f7f4ee] text-[10px] font-semibold flex items-center justify-center flex-shrink-0 ${ring ? "ring-2 ring-[#fdfcf8]" : ""}`}
    style={serif}
    title={name}
  >
    {(name?.[0] || "?").toUpperCase()}
  </span>
);

const ActionBtn = ({ onClick, icon, label, danger }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(e); }}
    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium tracking-[0.04em] border border-transparent transition-all duration-150 ${
      danger
        ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
        : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10"
    }`}
    style={sans}
    type="button"
  >
    {icon}
    {label}
  </button>
);

const timeAgo = (date) => {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function ThreadRow({
  thread,
  onClick,
  pinned = false,
  currentUser,
  onDelete,
  onEdit,
  onReport,
}) {
  const getOwnerId = (author) =>
    typeof author === "string" ? author : author?._id ?? author?.id ?? null;

  const isCurrentUserThread =
    currentUser && getOwnerId(thread.author) === currentUser._id;

  const displayUsername =
    thread.author?.username ||
    (isCurrentUserThread ? currentUser?.username : null) ||
    "?";

  useEffect(() => {
    console.debug("ThreadRow rendered for thread ID:", thread._id);
  }, [thread, currentUser, displayUsername]);

  const participants = thread.participants || [thread.author];
  const isOwner      = currentUser && getOwnerId(thread.author) === currentUser._id;

  // ---- Modal states ----
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [editContent, setEditContent] = useState(thread.content);
  const [editLoading, setEditLoading] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // ---- Action handlers ----

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (typeof onDelete === "function") {
      onDelete(thread._id);
      return;
    }
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiDeleteThread(thread._id);
      toast.success("Thread deleted");
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete thread:", err);
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (typeof onEdit === "function") {
      onEdit(thread._id);
      return;
    }
    setEditTitle(thread.title);
    setEditContent(thread.content);
    setEditModalOpen(true);
  };

  const confirmEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }
    setEditLoading(true);
    try {
      await apiEditThread(thread._id, { title: editTitle, content: editContent });
      toast.success("Thread updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error(err?.message || "Failed to edit thread");
    } finally {
      setEditLoading(false);
      setEditModalOpen(false);
    }
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    if (typeof onReport === "function") {
      onReport(thread._id);
      return;
    }
    setReportReason("");
    setReportModalOpen(true);
  };

  const confirmReport = async () => {
    setReportLoading(true);
    try {
      const { report } = await import("../../services/forumAPI");
      await report({
        targetType: "thread",
        targetId: thread._id,
        reason: reportReason.trim() || "Reported via UI",
      });
      toast.success("Reported — moderators will review this thread.");
      setReportModalOpen(false);
    } catch (err) {
      console.error("Report failed:", err);
      toast.error(err?.message || "Failed to report");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <tr
        onClick={() => onClick?.(thread._id)}
        className={`group border-b cursor-pointer transition-all duration-150 ${
          pinned
            ? "bg-[#f7f4ee] border-[#2d4a2d]/10 hover:bg-[#f0ece3]"
            : "bg-[#fdfcf8] border-[#2d4a2d]/8 hover:bg-[#f7f4ee]"
        }`}
      >
        {/* ── Title + meta ── */}
        <td className="py-4 px-5 w-full">
          <div className="flex items-start gap-3">
            {pinned && (
              <Pin size={13} className="text-[#c4704a] mt-0.5 flex-shrink-0 rotate-45" />
            )}

            <div className="min-w-0 flex-1">
              <p
                className="text-[14px] font-medium leading-snug mb-1.5 text-[#1a3320] group-hover:text-[#2d4a2d] transition-colors truncate"
                style={sans}
              >
                {thread.title}
              </p>

              {pinned && thread.content && (
                <p
                  className="text-[12px] font-light text-[#8c8880] leading-relaxed line-clamp-1 mb-2"
                  style={sans}
                >
                  {thread.content}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Avatar name={displayUsername} size="w-4 h-4" />
                  <span className="text-[11.5px] font-light text-[#8c8880]" style={sans}>
                    {displayUsername}
                  </span>
                </div>

                {thread.tags?.length > 0 && (
                  <>
                    <span className="text-[#2d4a2d]/20 text-xs">·</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-[#2d4a2d]/8 text-[#2d4a2d] border border-[#2d4a2d]/12 hover:bg-[#2d4a2d]/14 transition-colors cursor-pointer tracking-[0.05em]"
                          style={sans}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* ── Participants ── */}
        <td className="py-4 px-4 whitespace-nowrap">
          <div className="flex -space-x-1.5">
            {participants.slice(0, 3).map((user, i) => {
              const isMe = currentUser && getOwnerId(user) === currentUser._id;
              const name = user?.username || (isMe ? currentUser?.username : "?");
              return <Avatar key={i} name={name} size="w-6 h-6" ring />;
            })}
            {participants.length > 3 && (
              <span
                className="w-6 h-6 rounded-full bg-[#2d4a2d]/10 text-[#2d4a2d] text-[10px] font-medium flex items-center justify-center ring-2 ring-[#fdfcf8] flex-shrink-0"
                style={sans}
              >
                +{participants.length - 3}
              </span>
            )}
          </div>
        </td>

        {/* ── Score (Likes) ── */}
        <td className="py-4 px-4 whitespace-nowrap text-center">
          <div
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#4a4a4a]"
            style={sans}
          >
            <Heart size={11} className="text-[#c4704a]" />
            {thread.totalCommentLikes ?? 0}   {/* swapped from thread.score */}
          </div>
        </td>

        {/* ── Actions + time (Activity) ── */}
        <td className="py-4 px-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-0.5">
            <span className="text-[11px] font-light text-[#8c8880] mr-2" style={sans}>
              {timeAgo(thread.createdAt)}
            </span>

            {isOwner ? (
              <>
                <ActionBtn onClick={handleEditClick} icon={<Pencil size={11} />} label="Edit" />
                <ActionBtn onClick={handleDeleteClick} icon={<Trash2 size={11} />} label="Delete" danger />
              </>
            ) : (
              <ActionBtn onClick={handleReportClick} icon={<Flag size={11} />} label="Report" />
            )}
          </div>
        </td>
      </tr>

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !deleteLoading && setDeleteModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
              disabled={deleteLoading}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Delete Thread</h2>
            <p className="text-[13px] text-[#8c8880] mb-5" style={sans}>
              Are you sure you want to delete this thread? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
                style={sans}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
                  deleteLoading ? "cursor-wait" : ""
                }`}
                style={sans}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !editLoading && setEditModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
              disabled={editLoading}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-light text-[#1a3320] mb-4" style={serif}>Edit Thread</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[#8c8880] mb-1" style={sans}>
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50"
                  style={sans}
                  placeholder="Thread title"
                  disabled={editLoading}
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[#8c8880] mb-1" style={sans}>
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
                  style={sans}
                  placeholder="Thread content"
                  disabled={editLoading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
                style={sans}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#2d4a2d] text-white rounded-sm hover:bg-[#1a3320] transition-colors flex items-center gap-2 disabled:opacity-50 ${
                  editLoading ? "cursor-wait" : ""
                }`}
                style={sans}
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Report Modal ─── */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !reportLoading && setReportModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-sm shadow-xl border border-[#2d4a2d]/10 p-6 z-10">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-3 right-3 text-[#8c8880] hover:text-[#1a3320] transition-colors"
              disabled={reportLoading}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Report Thread</h2>
            <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
              Why are you reporting this thread? (optional)
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={3}
              className="w-full border border-[#2d4a2d]/15 rounded-sm p-2.5 text-[13px] text-[#1a3320] placeholder:text-[#8c8880] focus:outline-none focus:border-[#2d4a2d]/50 resize-none"
              style={sans}
              placeholder="Describe the issue..."
              disabled={reportLoading}
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-[#8c8880] border border-[#2d4a2d]/15 rounded-sm hover:bg-[#f7f4ee] transition-colors"
                style={sans}
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmReport}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] bg-[#c4704a] text-white rounded-sm hover:bg-[#b05a3a] transition-colors flex items-center gap-2 disabled:opacity-50 ${
                  reportLoading ? "cursor-wait" : ""
                }`}
                style={sans}
                disabled={reportLoading}
              >
                {reportLoading ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}