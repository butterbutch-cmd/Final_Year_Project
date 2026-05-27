// // /////file: Final_Year_Project/src/Components/Forum/CommentCard.jsx
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   addComment,
// //   deleteComment,
// //   vote as apiVote,
// //   report as apiReport,
// //   updateComment,
// // } from "../../services/forumAPI";
// // import { Heart, CornerDownLeft, ChevronDown, ChevronRight, Pencil, Trash2, Flag } from "lucide-react";
// // import toast from "react-hot-toast";

// // const sans = { fontFamily: "'DM Sans', sans-serif" };
// // const serif = { fontFamily: "'Cormorant Garamond', serif" };

// // const MAX_DEPTH = 3;

// // /* ── Avatar palette ── */
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

// // /* ── Small action button ── */
// // function ActionBtn({ onClick, icon, label, active, danger }) {
// //   const base =
// //     "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] tracking-[0.05em] font-medium transition-all duration-150 border border-transparent";
// //   const variant = danger
// //     ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
// //     : active
// //     ? "text-[#c4704a] cursor-default"
// //     : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10";

// //   return (
// //     <button
// //       onClick={(e) => {
// //         e.stopPropagation();
// //         onClick?.(e);
// //       }}
// //       className={`${base} ${variant}`}
// //       style={sans}
// //       type="button"
// //     >
// //       {icon}
// //       {label}
// //     </button>
// //   );
// // }

// // /* ── Textarea shared style ── */
// // const textareaClass =
// //   "w-full bg-[#fdfcf8] border border-[#2d4a2d]/20 rounded-sm px-3.5 py-2.5 text-[13px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] resize-none transition-colors duration-200 leading-relaxed";

// // /* ── Confirm/Cancel row ── */
// // function FormActions({ onSave, onCancel, busy, saveLabel = "Post", savingLabel = "Posting…" }) {
// //   return (
// //     <div className="flex gap-2 mt-2.5">
// //       <button
// //         onClick={onSave}
// //         disabled={busy}
// //         className="px-4 py-2 bg-[#1a3320] text-[#f7f4ee] text-[11px] font-medium tracking-[0.1em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //         style={sans}
// //         type="button"
// //       >
// //         {busy ? savingLabel : saveLabel}
// //       </button>
// //       <button
// //         onClick={onCancel}
// //         className="px-4 py-2 bg-transparent border border-[#2d4a2d]/20 text-[11px] font-medium tracking-[0.1em] uppercase text-[#2c2c2c] cursor-pointer rounded-sm hover:border-[#2d4a2d]/40 transition-colors"
// //         style={sans}
// //         type="button"
// //       >
// //         Cancel
// //       </button>
// //     </div>
// //   );
// // }

// // export default function CommentCard({
// //   comment,
// //   currentUser,
// //   onVote,
// //   onDelete,
// //   onReply,
// //   onEdit,
// //   onReport,
// //   getReplies,
// //   depth = 0,
// //   threadId = null,
// // }) {
// //   const getOwnerId = (author) =>
// //     typeof author === "string" ? author : author?._id ?? author?.id ?? null;

// //   const currentUserId = currentUser?._id ?? currentUser?.id ?? null;
// //   const ownerId = getOwnerId(comment.author);
// //   const isOwner = Boolean(currentUserId && ownerId && ownerId === currentUserId);

// //   const displayUsername =
// //     comment.author?.username || (isOwner ? currentUser?.username : null) || "?";

// //   const avatarInitial = (displayUsername?.[0] || "?").toUpperCase();
// //   const avatarColor = AVATAR_PALETTE[avatarInitial.charCodeAt(0) % AVATAR_PALETTE.length];

// //   const [showReplyBox, setShowReplyBox] = useState(false);
// //   const [replyText, setReplyText] = useState("");
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editText, setEditText] = useState(comment.content || "");
// //   const [displayContent, setDisplayContent] = useState(comment.content || "");
// //   const [voted, setVoted] = useState(false);
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [busy, setBusy] = useState(false);
// //   const [isDeleted, setIsDeleted] = useState(false);

// //   // ---- Modal states ----
// //   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
// //   const [deleteLoading, setDeleteLoading] = useState(false);
// //   const [reportModalOpen, setReportModalOpen] = useState(false);
// //   const [reportReason, setReportReason] = useState("");
// //   const [reportLoading, setReportLoading] = useState(false);

// //   const replyRef = useRef(null);
// //   const editRef = useRef(null);
// //   const editBoxRef = useRef(null);

// //   const canReply = depth < MAX_DEPTH;
// //   const replies =
// //     typeof getReplies === "function"
// //       ? getReplies(comment._id)
// //       : comment.replies || [];

// //   useEffect(() => { if (showReplyBox) replyRef.current?.focus(); }, [showReplyBox]);
// //   useEffect(() => { if (isEditing) editRef.current?.focus(); }, [isEditing]);

// //   useEffect(() => {
// //     setDisplayContent(comment.content || "");
// //     setEditText(comment.content || "");
// //   }, [comment.content]);

// //   useEffect(() => {
// //     const handle = (e) => {
// //       if (isEditing && editBoxRef.current && !editBoxRef.current.contains(e.target)) cancelEdit();
// //     };
// //     document.addEventListener("mousedown", handle);
// //     return () => document.removeEventListener("mousedown", handle);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isEditing]);

// //   const cancelReply = () => { setShowReplyBox(false); setReplyText(""); };
// //   const cancelEdit = () => { setEditText(comment.content || ""); setIsEditing(false); };

// //   const submitReply = async () => {
// //     const trimmed = replyText.trim();
// //     if (!trimmed || busy) return;
// //     try {
// //       setBusy(true);
// //       if (typeof onReply === "function") {
// //         await onReply(comment._id, trimmed, () => { setReplyText(""); setShowReplyBox(false); });
// //         return;
// //       }
// //       if (!threadId) { toast.error("Missing thread id"); return; }
// //       await addComment(threadId, trimmed, comment._id);
// //       cancelReply();
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err?.message || "Failed to post reply");
// //     } finally { setBusy(false); }
// //   };

// //   const saveEdit = async () => {
// //     const trimmed = editText.trim();
// //     if (!trimmed || busy) return;
// //     try {
// //       setBusy(true);
// //       if (typeof onEdit === "function") {
// //         const result = await onEdit(comment._id, trimmed);
// //         setDisplayContent(result?.comment?.content ?? result?.content ?? trimmed);
// //       } else {
// //         const updated = await updateComment(comment._id, trimmed);
// //         setDisplayContent(updated?.comment?.content ?? updated?.content ?? trimmed);
// //       }
// //       setIsEditing(false);
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err?.message || "Failed to update comment");
// //     } finally { setBusy(false); }
// //   };

// //   // ---- Delete handler (opens modal instead of confirm) ----
// //   const handleDelete = () => {
// //     if (busy) return;
// //     setDeleteModalOpen(true);
// //   };

// //   const confirmDelete = async () => {
// //     setDeleteLoading(true);
// //     try {
// //       if (typeof onDelete === "function") {
// //         await onDelete(comment._id);
// //         setIsDeleted(true);
// //       } else {
// //         await deleteComment(comment._id);
// //         setIsDeleted(true);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err?.message || "Delete failed");
// //     } finally {
// //       setDeleteLoading(false);
// //       setDeleteModalOpen(false);
// //     }
// //   };

// //   const handleVote = async () => {
// //     if (voted || busy) return;
// //     setVoted(true);
// //     try {
// //       setBusy(true);
// //       if (typeof onVote === "function") { await onVote("comment", comment._id, 1); return; }
// //       await apiVote("comment", comment._id, 1);
// //       window.location.reload();
// //     } catch (err) {
// //       console.error(err);
// //       setVoted(false);
// //       toast.error(err?.message || "Voting failed");
// //     } finally { setBusy(false); }
// //   };

// //   // ---- Report handler (opens modal instead of prompt) ----
// //   const handleReport = () => {
// //     if (busy) return;
// //     setReportReason("");
// //     setReportModalOpen(true);
// //   };

// //   const confirmReport = async () => {
// //     const trimmed = reportReason.trim();
// //     if (!trimmed) {
// //       toast.error("Please provide a reason.");
// //       return;
// //     }
// //     setReportLoading(true);
// //     try {
// //       if (typeof onReport === "function") {
// //         await onReport(comment._id);
// //       } else {
// //         await apiReport({ targetType: "comment", targetId: comment._id, reason: trimmed });
// //       }
// //       toast.success("Reported. Moderators will review.");
// //       setReportModalOpen(false);
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err?.message || "Report failed");
// //     } finally {
// //       setReportLoading(false);
// //     }
// //   };

// //   if (isDeleted) return null;

// //   const timeAgo = (() => {
// //     const diff = Date.now() - new Date(comment.createdAt).getTime();
// //     const m = Math.floor(diff / 60000);
// //     if (m < 1) return "just now";
// //     if (m < 60) return `${m}m ago`;
// //     const h = Math.floor(m / 60);
// //     if (h < 24) return `${h}h ago`;
// //     return `${Math.floor(h / 24)}d ago`;
// //   })();

// //   return (
// //     <div className="relative" style={sans}>
// //       {/* Thread line */}
// //       {depth > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2d4a2d]/10" />}

// //       <div className={`flex gap-3 py-5 ${depth > 0 ? "pl-5" : ""}`}>
// //         {/* Avatar */}
// //         <div className="flex-shrink-0 flex flex-col items-center gap-2">
// //           <div
// //             className={`w-8 h-8 rounded-full ${avatarColor} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center flex-shrink-0`}
// //             style={serif}
// //           >
// //             {avatarInitial}
// //           </div>
// //           {!collapsed && replies.length > 0 && (
// //             <div className="w-px flex-1 bg-[#2d4a2d]/10 min-h-[12px]" />
// //           )}
// //         </div>

// //         {/* Body */}
// //         <div className="flex-1 min-w-0">
// //           {/* Header row */}
// //           <div className="flex items-center gap-2 mb-2 flex-wrap">
// //             <span className="text-[13px] font-medium text-[#1a3320]">{displayUsername}</span>
// //             {isOwner && (
// //               <span className="text-[9px] px-1.5 py-0.5 bg-[#2d4a2d]/10 text-[#2d4a2d] rounded-sm tracking-[0.1em] uppercase font-medium">
// //                 you
// //               </span>
// //             )}
// //             <span className="text-[11px] text-[#8c8880] font-light">·</span>
// //             <span className="text-[11px] text-[#8c8880] font-light">{timeAgo}</span>
// //           </div>

// //           {/* Content / Edit */}
// //           {!isEditing ? (
// //             <p className="text-[13.5px] font-light text-[#4a4a4a] leading-relaxed mb-3 whitespace-pre-wrap break-words">
// //               {displayContent}
// //             </p>
// //           ) : (
// //             <div className="mb-3" ref={editBoxRef}>
// //               <textarea
// //                 ref={editRef}
// //                 value={editText}
// //                 onChange={(e) => setEditText(e.target.value)}
// //                 onKeyDown={(e) => {
// //                   if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
// //                   if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
// //                 }}
// //                 className={textareaClass}
// //                 rows={3}
// //               />
// //               <FormActions
// //                 onSave={saveEdit}
// //                 onCancel={cancelEdit}
// //                 busy={busy}
// //                 saveLabel="Save"
// //                 savingLabel="Saving…"
// //               />
// //             </div>
// //           )}

// //           {/* Action row */}
// //           <div className="flex items-center gap-0.5 flex-wrap -ml-1">
// //             <ActionBtn
// //               onClick={handleVote}
// //               icon={<Heart size={11} className={voted ? "fill-[#c4704a]" : ""} />}
// //               label={String(comment.score ?? 0)}
// //               active={voted}
// //             />

// //             {canReply && (
// //               <ActionBtn
// //                 onClick={() => setShowReplyBox((s) => !s)}
// //                 icon={<CornerDownLeft size={11} />}
// //                 label="Reply"
// //               />
// //             )}

// //             {replies.length > 0 && (
// //               <ActionBtn
// //                 onClick={() => setCollapsed((c) => !c)}
// //                 icon={collapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
// //                 label={collapsed ? `Show ${replies.length}` : "Collapse"}
// //               />
// //             )}

// //             {isOwner ? (
// //               <>
// //                 <ActionBtn
// //                   onClick={() => { setEditText(comment.content || ""); setIsEditing(true); }}
// //                   icon={<Pencil size={11} />}
// //                   label="Edit"
// //                 />
// //                 <ActionBtn
// //                   onClick={handleDelete}
// //                   icon={<Trash2 size={11} />}
// //                   label="Delete"
// //                   danger
// //                 />
// //               </>
// //             ) : (
// //               <ActionBtn
// //                 onClick={handleReport}
// //                 icon={<Flag size={11} />}
// //                 label="Report"
// //               />
// //             )}
// //           </div>

// //           {/* Reply box */}
// //           {showReplyBox && (
// //             <div className="mt-4 bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm p-3.5">
// //               <p className="text-[11px] tracking-[0.1em] uppercase text-[#7a9e7e] mb-2.5">
// //                 Replying to {displayUsername}
// //               </p>
// //               <textarea
// //                 ref={replyRef}
// //                 value={replyText}
// //                 onChange={(e) => setReplyText(e.target.value)}
// //                 placeholder="Write your reply…"
// //                 className={textareaClass}
// //                 rows={3}
// //               />
// //               <FormActions
// //                 onSave={submitReply}
// //                 onCancel={cancelReply}
// //                 busy={busy}
// //                 saveLabel="Post Reply"
// //                 savingLabel="Posting…"
// //               />
// //             </div>
// //           )}

// //           {/* Nested replies */}
// //           {!collapsed && replies.length > 0 && depth < MAX_DEPTH && (
// //             <div className="mt-3 space-y-0 border-l border-[#2d4a2d]/10 pl-0">
// //               {replies.map((r) => (
// //                 <CommentCard
// //                   key={r._id}
// //                   comment={r}
// //                   currentUser={currentUser}
// //                   onVote={onVote}
// //                   onDelete={onDelete}
// //                   onReply={onReply}
// //                   onEdit={onEdit}
// //                   onReport={onReport}
// //                   getReplies={getReplies}
// //                   depth={depth + 1}
// //                   threadId={threadId}
// //                 />
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>

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
// //             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Delete Comment</h2>
// //             <p className="text-[13px] text-[#8c8880] mb-5" style={sans}>
// //               Are you sure you want to delete this comment? This action cannot be undone.
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
// //             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Report Comment</h2>
// //             <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
// //               Why are you reporting this comment?
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
// //     </div>
// //   );
// // }

// import { useEffect, useRef, useState } from "react";
// import {
//   addComment,
//   deleteComment,
//   report as apiReport,
//   updateComment,
// } from "../../services/forumAPI";
// import {
//   connectSocket,
//   emitVote,
// } from "../../services/websocketfileapi";
// import { Heart, CornerDownLeft, ChevronDown, ChevronRight, Pencil, Trash2, Flag } from "lucide-react";
// import toast from "react-hot-toast";

// const sans = { fontFamily: "'DM Sans', sans-serif" };
// const serif = { fontFamily: "'Cormorant Garamond', serif" };

// const MAX_DEPTH = 3;

// /* ── Avatar palette ── */
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

// /* ── Small action button ── */
// function ActionBtn({ onClick, icon, label, active, danger }) {
//   const base =
//     "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] tracking-[0.05em] font-medium transition-all duration-150 border border-transparent";
//   const variant = danger
//     ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
//     : active
//     ? "text-[#c4704a] cursor-default"
//     : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10";

//   return (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick?.(e);
//       }}
//       className={`${base} ${variant}`}
//       style={sans}
//       type="button"
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// /* ── Textarea shared style ── */
// const textareaClass =
//   "w-full bg-[#fdfcf8] border border-[#2d4a2d]/20 rounded-sm px-3.5 py-2.5 text-[13px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] resize-none transition-colors duration-200 leading-relaxed";

// /* ── Confirm/Cancel row ── */
// function FormActions({ onSave, onCancel, busy, saveLabel = "Post", savingLabel = "Posting…" }) {
//   return (
//     <div className="flex gap-2 mt-2.5">
//       <button
//         onClick={onSave}
//         disabled={busy}
//         className="px-4 py-2 bg-[#1a3320] text-[#f7f4ee] text-[11px] font-medium tracking-[0.1em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         style={sans}
//         type="button"
//       >
//         {busy ? savingLabel : saveLabel}
//       </button>
//       <button
//         onClick={onCancel}
//         className="px-4 py-2 bg-transparent border border-[#2d4a2d]/20 text-[11px] font-medium tracking-[0.1em] uppercase text-[#2c2c2c] cursor-pointer rounded-sm hover:border-[#2d4a2d]/40 transition-colors"
//         style={sans}
//         type="button"
//       >
//         Cancel
//       </button>
//     </div>
//   );
// }

// export default function CommentCard({
//   comment,
//   currentUser,
//   onVote,
//   onDelete,
//   onReply,
//   onEdit,
//   onReport,
//   getReplies,
//   depth = 0,
//   threadId = null,
// }) {
//   const getOwnerId = (author) =>
//     typeof author === "string" ? author : author?._id ?? author?.id ?? null;

//   const currentUserId = currentUser?._id ?? currentUser?.id ?? null;
//   const ownerId = getOwnerId(comment.author);
//   const isOwner = Boolean(currentUserId && ownerId && ownerId === currentUserId);

//   const displayUsername =
//     comment.author?.username || (isOwner ? currentUser?.username : null) || "?";

//   const avatarInitial = (displayUsername?.[0] || "?").toUpperCase();
//   const avatarColor = AVATAR_PALETTE[avatarInitial.charCodeAt(0) % AVATAR_PALETTE.length];

//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(comment.content || "");
//   const [displayContent, setDisplayContent] = useState(comment.content || "");
//   const [voted, setVoted] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [isDeleted, setIsDeleted] = useState(false);

//   // ---- Modal states ----
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [reportModalOpen, setReportModalOpen] = useState(false);
//   const [reportReason, setReportReason] = useState("");
//   const [reportLoading, setReportLoading] = useState(false);

//   const replyRef = useRef(null);
//   const editRef = useRef(null);
//   const editBoxRef = useRef(null);

//   const canReply = depth < MAX_DEPTH;
//   const replies =
//     typeof getReplies === "function"
//       ? getReplies(comment._id)
//       : comment.replies || [];

//   useEffect(() => { if (showReplyBox) replyRef.current?.focus(); }, [showReplyBox]);
//   useEffect(() => { if (isEditing) editRef.current?.focus(); }, [isEditing]);

//   useEffect(() => {
//     setDisplayContent(comment.content || "");
//     setEditText(comment.content || "");
//   }, [comment.content]);

//   useEffect(() => {
//     const handle = (e) => {
//       if (isEditing && editBoxRef.current && !editBoxRef.current.contains(e.target)) cancelEdit();
//     };
//     document.addEventListener("mousedown", handle);
//     return () => document.removeEventListener("mousedown", handle);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isEditing]);

//   const cancelReply = () => { setShowReplyBox(false); setReplyText(""); };
//   const cancelEdit = () => { setEditText(comment.content || ""); setIsEditing(false); };

//   const submitReply = async () => {
//     const trimmed = replyText.trim();
//     if (!trimmed || busy) return;
//     try {
//       setBusy(true);
//       if (typeof onReply === "function") {
//         await onReply(comment._id, trimmed, () => { setReplyText(""); setShowReplyBox(false); });
//         return;
//       }
//       if (!threadId) { toast.error("Missing thread id"); return; }
//       await addComment(threadId, trimmed, comment._id);
//       cancelReply();
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.message || "Failed to post reply");
//     } finally { setBusy(false); }
//   };

//   const saveEdit = async () => {
//     const trimmed = editText.trim();
//     if (!trimmed || busy) return;
//     try {
//       setBusy(true);
//       if (typeof onEdit === "function") {
//         const result = await onEdit(comment._id, trimmed);
//         setDisplayContent(result?.comment?.content ?? result?.content ?? trimmed);
//       } else {
//         const updated = await updateComment(comment._id, trimmed);
//         setDisplayContent(updated?.comment?.content ?? updated?.content ?? trimmed);
//       }
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.message || "Failed to update comment");
//     } finally { setBusy(false); }
//   };

//   // ---- Delete handler (opens modal instead of confirm) ----
//   const handleDelete = () => {
//     if (busy) return;
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       if (typeof onDelete === "function") {
//         await onDelete(comment._id);
//         setIsDeleted(true);
//       } else {
//         await deleteComment(comment._id);
//         setIsDeleted(true);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.message || "Delete failed");
//     } finally {
//       setDeleteLoading(false);
//       setDeleteModalOpen(false);
//     }
//   };

//   // ── UPDATED handleVote using WebSocket helpers ──
//   const handleVote = () => {
//     if (voted || busy) return;
//     if (!threadId) { toast.error("Missing thread id"); return; }
//     setVoted(true);             // optimistic UI
//     emitVote(threadId, "comment", comment._id, 1);
//   };

//   // ---- Report handler (opens modal instead of prompt) ----
//   const handleReport = () => {
//     if (busy) return;
//     setReportReason("");
//     setReportModalOpen(true);
//   };

//   const confirmReport = async () => {
//     const trimmed = reportReason.trim();
//     if (!trimmed) {
//       toast.error("Please provide a reason.");
//       return;
//     }
//     setReportLoading(true);
//     try {
//       if (typeof onReport === "function") {
//         await onReport(comment._id);
//       } else {
//         await apiReport({ targetType: "comment", targetId: comment._id, reason: trimmed });
//       }
//       toast.success("Reported. Moderators will review.");
//       setReportModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.message || "Report failed");
//     } finally {
//       setReportLoading(false);
//     }
//   };

//   if (isDeleted) return null;

//   const timeAgo = (() => {
//     const diff = Date.now() - new Date(comment.createdAt).getTime();
//     const m = Math.floor(diff / 60000);
//     if (m < 1) return "just now";
//     if (m < 60) return `${m}m ago`;
//     const h = Math.floor(m / 60);
//     if (h < 24) return `${h}h ago`;
//     return `${Math.floor(h / 24)}d ago`;
//   })();

//   return (
//     <div className="relative" style={sans}>
//       {/* Thread line */}
//       {depth > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2d4a2d]/10" />}

//       <div className={`flex gap-3 py-5 ${depth > 0 ? "pl-5" : ""}`}>
//         {/* Avatar */}
//         <div className="flex-shrink-0 flex flex-col items-center gap-2">
//           <div
//             className={`w-8 h-8 rounded-full ${avatarColor} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center flex-shrink-0`}
//             style={serif}
//           >
//             {avatarInitial}
//           </div>
//           {!collapsed && replies.length > 0 && (
//             <div className="w-px flex-1 bg-[#2d4a2d]/10 min-h-[12px]" />
//           )}
//         </div>

//         {/* Body */}
//         <div className="flex-1 min-w-0">
//           {/* Header row */}
//           <div className="flex items-center gap-2 mb-2 flex-wrap">
//             <span className="text-[13px] font-medium text-[#1a3320]">{displayUsername}</span>
//             {isOwner && (
//               <span className="text-[9px] px-1.5 py-0.5 bg-[#2d4a2d]/10 text-[#2d4a2d] rounded-sm tracking-[0.1em] uppercase font-medium">
//                 you
//               </span>
//             )}
//             <span className="text-[11px] text-[#8c8880] font-light">·</span>
//             <span className="text-[11px] text-[#8c8880] font-light">{timeAgo}</span>
//           </div>

//           {/* Content / Edit */}
//           {!isEditing ? (
//             <p className="text-[13.5px] font-light text-[#4a4a4a] leading-relaxed mb-3 whitespace-pre-wrap break-words">
//               {displayContent}
//             </p>
//           ) : (
//             <div className="mb-3" ref={editBoxRef}>
//               <textarea
//                 ref={editRef}
//                 value={editText}
//                 onChange={(e) => setEditText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
//                   if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
//                 }}
//                 className={textareaClass}
//                 rows={3}
//               />
//               <FormActions
//                 onSave={saveEdit}
//                 onCancel={cancelEdit}
//                 busy={busy}
//                 saveLabel="Save"
//                 savingLabel="Saving…"
//               />
//             </div>
//           )}

//           {/* Action row */}
//           <div className="flex items-center gap-0.5 flex-wrap -ml-1">
//             <ActionBtn
//               onClick={handleVote}
//               icon={<Heart size={11} className={voted ? "fill-[#c4704a]" : ""} />}
//               label={String(comment.score ?? 0)}
//               active={voted}
//             />

//             {canReply && (
//               <ActionBtn
//                 onClick={() => setShowReplyBox((s) => !s)}
//                 icon={<CornerDownLeft size={11} />}
//                 label="Reply"
//               />
//             )}

//             {replies.length > 0 && (
//               <ActionBtn
//                 onClick={() => setCollapsed((c) => !c)}
//                 icon={collapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
//                 label={collapsed ? `Show ${replies.length}` : "Collapse"}
//               />
//             )}

//             {isOwner ? (
//               <>
//                 <ActionBtn
//                   onClick={() => { setEditText(comment.content || ""); setIsEditing(true); }}
//                   icon={<Pencil size={11} />}
//                   label="Edit"
//                 />
//                 <ActionBtn
//                   onClick={handleDelete}
//                   icon={<Trash2 size={11} />}
//                   label="Delete"
//                   danger
//                 />
//               </>
//             ) : (
//               <ActionBtn
//                 onClick={handleReport}
//                 icon={<Flag size={11} />}
//                 label="Report"
//               />
//             )}
//           </div>

//           {/* Reply box */}
//           {showReplyBox && (
//             <div className="mt-4 bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm p-3.5">
//               <p className="text-[11px] tracking-[0.1em] uppercase text-[#7a9e7e] mb-2.5">
//                 Replying to {displayUsername}
//               </p>
//               <textarea
//                 ref={replyRef}
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 placeholder="Write your reply…"
//                 className={textareaClass}
//                 rows={3}
//               />
//               <FormActions
//                 onSave={submitReply}
//                 onCancel={cancelReply}
//                 busy={busy}
//                 saveLabel="Post Reply"
//                 savingLabel="Posting…"
//               />
//             </div>
//           )}

//           {/* Nested replies */}
//           {!collapsed && replies.length > 0 && depth < MAX_DEPTH && (
//             <div className="mt-3 space-y-0 border-l border-[#2d4a2d]/10 pl-0">
//               {replies.map((r) => (
//                 <CommentCard
//                   key={r._id}
//                   comment={r}
//                   currentUser={currentUser}
//                   onVote={onVote}
//                   onDelete={onDelete}
//                   onReply={onReply}
//                   onEdit={onEdit}
//                   onReport={onReport}
//                   getReplies={getReplies}
//                   depth={depth + 1}
//                   threadId={threadId}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

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
//             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Delete Comment</h2>
//             <p className="text-[13px] text-[#8c8880] mb-5" style={sans}>
//               Are you sure you want to delete this comment? This action cannot be undone.
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
//             <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Report Comment</h2>
//             <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
//               Why are you reporting this comment?
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
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import {
  addComment,
  deleteComment,
  report as apiReport,
  updateComment,
} from "../../services/forumAPI";
import {
  connectSocket,
  emitVote,
} from "../../services/websocketfileapi";
import { Heart, CornerDownLeft, ChevronDown, ChevronRight, Pencil, Trash2, Flag } from "lucide-react";
import toast from "react-hot-toast";

const sans = { fontFamily: "'DM Sans', sans-serif" };
const serif = { fontFamily: "'Cormorant Garamond', serif" };

const MAX_DEPTH = 3;

/* ── Avatar palette ── */
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

/* ── Small action button ── */
function ActionBtn({ onClick, icon, label, active, danger }) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] tracking-[0.05em] font-medium transition-all duration-150 border border-transparent";
  const variant = danger
    ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
    : active
    ? "text-[#c4704a] cursor-default"
    : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`${base} ${variant}`}
      style={sans}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

/* ── Textarea shared style ── */
const textareaClass =
  "w-full bg-[#fdfcf8] border border-[#2d4a2d]/20 rounded-sm px-3.5 py-2.5 text-[13px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] resize-none transition-colors duration-200 leading-relaxed";

/* ── Confirm/Cancel row ── */
function FormActions({ onSave, onCancel, busy, saveLabel = "Post", savingLabel = "Posting…" }) {
  return (
    <div className="flex gap-2 mt-2.5">
      <button
        onClick={onSave}
        disabled={busy}
        className="px-4 py-2 bg-[#1a3320] text-[#f7f4ee] text-[11px] font-medium tracking-[0.1em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={sans}
        type="button"
      >
        {busy ? savingLabel : saveLabel}
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-transparent border border-[#2d4a2d]/20 text-[11px] font-medium tracking-[0.1em] uppercase text-[#2c2c2c] cursor-pointer rounded-sm hover:border-[#2d4a2d]/40 transition-colors"
        style={sans}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
}

export default function CommentCard({
  comment,
  currentUser,
  onVote,
  onDelete,
  onReply,
  onEdit,
  onReport,
  getReplies,
  depth = 0,
  threadId = null,
}) {
  const getOwnerId = (author) =>
    typeof author === "string" ? author : author?._id ?? author?.id ?? null;

  const currentUserId = currentUser?._id ?? currentUser?.id ?? null;
  const ownerId = getOwnerId(comment.author);
  const isOwner = Boolean(currentUserId && ownerId && ownerId === currentUserId);

  const displayUsername =
    comment.author?.username || (isOwner ? currentUser?.username : null) || "?";

  const avatarInitial = (displayUsername?.[0] || "?").toUpperCase();
  const avatarColor = AVATAR_PALETTE[avatarInitial.charCodeAt(0) % AVATAR_PALETTE.length];

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content || "");
  const [displayContent, setDisplayContent] = useState(comment.content || "");
  
  // ── FIXED: Vote state with localStorage persistence & toggling ──
  const voteKey = currentUserId ? `vote_c_${currentUserId}_${comment._id}` : null;
  const [voted, setVoted] = useState(() => {
    if (!voteKey) return false;
    return localStorage.getItem(voteKey) === "1";
  });

  const [collapsed, setCollapsed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // ---- Modal states ----
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const replyRef = useRef(null);
  const editRef = useRef(null);
  const editBoxRef = useRef(null);

  const canReply = depth < MAX_DEPTH;
  const replies =
    typeof getReplies === "function"
      ? getReplies(comment._id)
      : comment.replies || [];

  useEffect(() => { if (showReplyBox) replyRef.current?.focus(); }, [showReplyBox]);
  useEffect(() => { if (isEditing) editRef.current?.focus(); }, [isEditing]);

  useEffect(() => {
    setDisplayContent(comment.content || "");
    setEditText(comment.content || "");
  }, [comment.content]);

  useEffect(() => {
    const handle = (e) => {
      if (isEditing && editBoxRef.current && !editBoxRef.current.contains(e.target)) cancelEdit();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const cancelReply = () => { setShowReplyBox(false); setReplyText(""); };
  const cancelEdit = () => { setEditText(comment.content || ""); setIsEditing(false); };

  const submitReply = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || busy) return;
    try {
      setBusy(true);
      if (typeof onReply === "function") {
        await onReply(comment._id, trimmed, () => { setReplyText(""); setShowReplyBox(false); });
        return;
      }
      if (!threadId) { toast.error("Missing thread id"); return; }
      await addComment(threadId, trimmed, comment._id);
      cancelReply();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to post reply");
    } finally { setBusy(false); }
  };

  const saveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed || busy) return;
    try {
      setBusy(true);
      if (typeof onEdit === "function") {
        const result = await onEdit(comment._id, trimmed);
        setDisplayContent(result?.comment?.content ?? result?.content ?? trimmed);
      } else {
        const updated = await updateComment(comment._id, trimmed);
        setDisplayContent(updated?.comment?.content ?? updated?.content ?? trimmed);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update comment");
    } finally { setBusy(false); }
  };

  // ---- Delete handler (opens modal instead of confirm) ----
  const handleDelete = () => {
    if (busy) return;
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      if (typeof onDelete === "function") {
        await onDelete(comment._id);
        setIsDeleted(true);
      } else {
        await deleteComment(comment._id);
        setIsDeleted(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  // ── FIXED: handleVote now toggles, persists, and always emits 1 ──
  const handleVote = () => {
    if (busy) return;
    if (!threadId) { toast.error("Missing thread id"); return; }
    if (!currentUserId) { toast.error("Please log in to vote"); return; }

    const nowVoted = !voted;
    setVoted(nowVoted);

    if (voteKey) {
      if (nowVoted) localStorage.setItem(voteKey, "1");
      else localStorage.removeItem(voteKey);
    }

    emitVote(threadId, "comment", comment._id, 1);
  };

  // ---- Report handler (opens modal instead of prompt) ----
  const handleReport = () => {
    if (busy) return;
    setReportReason("");
    setReportModalOpen(true);
  };

  const confirmReport = async () => {
    const trimmed = reportReason.trim();
    if (!trimmed) {
      toast.error("Please provide a reason.");
      return;
    }
    setReportLoading(true);
    try {
      if (typeof onReport === "function") {
        await onReport(comment._id);
      } else {
        await apiReport({ targetType: "comment", targetId: comment._id, reason: trimmed });
      }
      toast.success("Reported. Moderators will review.");
      setReportModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Report failed");
    } finally {
      setReportLoading(false);
    }
  };

  if (isDeleted) return null;

  const timeAgo = (() => {
    const diff = Date.now() - new Date(comment.createdAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  return (
    <div className="relative" style={sans}>
      {/* Thread line */}
      {depth > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2d4a2d]/10" />}

      <div className={`flex gap-3 py-5 ${depth > 0 ? "pl-5" : ""}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center flex-shrink-0`}
            style={serif}
          >
            {avatarInitial}
          </div>
          {!collapsed && replies.length > 0 && (
            <div className="w-px flex-1 bg-[#2d4a2d]/10 min-h-[12px]" />
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[13px] font-medium text-[#1a3320]">{displayUsername}</span>
            {isOwner && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#2d4a2d]/10 text-[#2d4a2d] rounded-sm tracking-[0.1em] uppercase font-medium">
                you
              </span>
            )}
            <span className="text-[11px] text-[#8c8880] font-light">·</span>
            <span className="text-[11px] text-[#8c8880] font-light">{timeAgo}</span>
          </div>

          {/* Content / Edit */}
          {!isEditing ? (
            <p className="text-[13.5px] font-light text-[#4a4a4a] leading-relaxed mb-3 whitespace-pre-wrap break-words">
              {displayContent}
            </p>
          ) : (
            <div className="mb-3" ref={editBoxRef}>
              <textarea
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                  if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                }}
                className={textareaClass}
                rows={3}
              />
              <FormActions
                onSave={saveEdit}
                onCancel={cancelEdit}
                busy={busy}
                saveLabel="Save"
                savingLabel="Saving…"
              />
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center gap-0.5 flex-wrap -ml-1">
            <ActionBtn
              onClick={handleVote}
              icon={<Heart size={11} className={voted ? "fill-[#c4704a]" : ""} />}
              label={String(comment.score ?? 0)}
              active={voted}
            />

            {canReply && (
              <ActionBtn
                onClick={() => setShowReplyBox((s) => !s)}
                icon={<CornerDownLeft size={11} />}
                label="Reply"
              />
            )}

            {replies.length > 0 && (
              <ActionBtn
                onClick={() => setCollapsed((c) => !c)}
                icon={collapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
                label={collapsed ? `Show ${replies.length}` : "Collapse"}
              />
            )}

            {isOwner ? (
              <>
                <ActionBtn
                  onClick={() => { setEditText(comment.content || ""); setIsEditing(true); }}
                  icon={<Pencil size={11} />}
                  label="Edit"
                />
                <ActionBtn
                  onClick={handleDelete}
                  icon={<Trash2 size={11} />}
                  label="Delete"
                  danger
                />
              </>
            ) : (
              <ActionBtn
                onClick={handleReport}
                icon={<Flag size={11} />}
                label="Report"
              />
            )}
          </div>

          {/* Reply box */}
          {showReplyBox && (
            <div className="mt-4 bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm p-3.5">
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#7a9e7e] mb-2.5">
                Replying to {displayUsername}
              </p>
              <textarea
                ref={replyRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply…"
                className={textareaClass}
                rows={3}
              />
              <FormActions
                onSave={submitReply}
                onCancel={cancelReply}
                busy={busy}
                saveLabel="Post Reply"
                savingLabel="Posting…"
              />
            </div>
          )}

          {/* Nested replies */}
          {!collapsed && replies.length > 0 && depth < MAX_DEPTH && (
            <div className="mt-3 space-y-0 border-l border-[#2d4a2d]/10 pl-0">
              {replies.map((r) => (
                <CommentCard
                  key={r._id}
                  comment={r}
                  currentUser={currentUser}
                  onVote={onVote}
                  onDelete={onDelete}
                  onReply={onReply}
                  onEdit={onEdit}
                  onReport={onReport}
                  getReplies={getReplies}
                  depth={depth + 1}
                  threadId={threadId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
            <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Delete Comment</h2>
            <p className="text-[13px] text-[#8c8880] mb-5" style={sans}>
              Are you sure you want to delete this comment? This action cannot be undone.
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
            <h2 className="text-lg font-light text-[#1a3320] mb-3" style={serif}>Report Comment</h2>
            <p className="text-[13px] text-[#8c8880] mb-4" style={sans}>
              Why are you reporting this comment?
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
    </div>
  );
}