// // // // file: src/admin/components/ThreadViewerModal.jsx
// // // import { useEffect, useState, useCallback } from "react";
// // // import {
// // //   X,
// // //   Loader2,
// // //   User,
// // //   MessageSquare,
// // //   Lock,
// // //   EyeOff,
// // //   Trash2,
// // //   Unlock,
// // //   Eye,
// // //   Flag,
// // //   ChevronDown,
// // //   ChevronRight,
// // //   AlertTriangle,
// // // } from "lucide-react";
// // // import {
// // //   getThreadById,
// // //   getCommentById,
// // //   hideThread,
// // //   unhideThread,
// // //   lockThread,
// // //   unlockThread,
// // //   deleteThread,
// // //   hideComment,
// // //   deleteComment,
// // // } from "../../services/adminForumAPI";

// // // /* ─────────────────────────────────────────
// // //    Helpers
// // // ───────────────────────────────────────── */
// // // const formatDate = (value) => {
// // //   if (!value) return "-";
// // //   const date = new Date(value);
// // //   if (Number.isNaN(date.getTime())) return "-";
// // //   return date.toLocaleString();
// // // };

// // // const StatusBadge = ({ item, type = "thread" }) => {
// // //   if (item?.isDeleted)
// // //     return (
// // //       <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
// // //         Deleted
// // //       </span>
// // //     );
// // //   if (item?.isHidden)
// // //     return (
// // //       <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
// // //         Hidden
// // //       </span>
// // //     );
// // //   if (type === "thread" && item?.isLocked)
// // //     return (
// // //       <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
// // //         Locked
// // //       </span>
// // //     );
// // //   return (
// // //     <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
// // //       Active
// // //     </span>
// // //   );
// // // };

// // // /* ─────────────────────────────────────────
// // //    Single Comment Card (recursive for replies)
// // // ───────────────────────────────────────── */
// // // const CommentCard = ({
// // //   comment,
// // //   depth = 0,
// // //   highlightId,
// // //   onAction,
// // //   actionLoading,
// // // }) => {
// // //   const [expanded, setExpanded] = useState(depth < 2);
// // //   const isHighlighted = highlightId && comment._id === highlightId;
// // //   const hasReplies = comment.replies?.length > 0;

// // //   return (
// // //     <div
// // //       className={`relative ${depth > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""}`}
// // //     >
// // //       <div
// // //         id={`comment-${comment._id}`}
// // //         className={`rounded-xl border p-4 mb-3 transition-all ${
// // //           isHighlighted
// // //             ? "border-amber-400 bg-amber-50 shadow-md"
// // //             : comment.isDeleted
// // //             ? "border-red-100 bg-red-50 opacity-60"
// // //             : comment.isHidden
// // //             ? "border-amber-100 bg-amber-50 opacity-70"
// // //             : "border-gray-100 bg-white"
// // //         }`}
// // //       >
// // //         {/* Header */}
// // //         <div className="flex items-start justify-between gap-2 mb-2">
// // //           <div className="flex items-center gap-2 flex-wrap">
// // //             <div className="flex items-center gap-1.5">
// // //               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
// // //                 <User size={12} className="text-gray-500" />
// // //               </div>
// // //               <span className="text-sm font-medium text-gray-800">
// // //                 {comment.author?.name || comment.author?.email || "Unknown"}
// // //               </span>
// // //             </div>
// // //             <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
// // //             <StatusBadge item={comment} type="comment" />
// // //             {isHighlighted && (
// // //               <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
// // //                 ⚑ Reported Comment
// // //               </span>
// // //             )}
// // //             {comment.reportsCount > 0 && !isHighlighted && (
// // //               <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
// // //                 <Flag size={10} /> {comment.reportsCount} report{comment.reportsCount > 1 ? "s" : ""}
// // //               </span>
// // //             )}
// // //           </div>

// // //           {/* Quick actions */}
// // //           <div className="flex shrink-0 gap-1.5">
// // //             {!comment.isDeleted && (
// // //               <>
// // //                 {comment.isHidden ? (
// // //                   <button
// // //                     disabled={actionLoading}
// // //                     onClick={() => onAction(() => unhideThread(comment._id), "comment-unhide")}
// // //                     title="Unhide comment"
// // //                     className="rounded-lg border p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
// // //                   >
// // //                     <Eye size={13} />
// // //                   </button>
// // //                 ) : (
// // //                   <button
// // //                     disabled={actionLoading}
// // //                     onClick={() => onAction(() => hideComment(comment._id), "comment-hide")}
// // //                     title="Hide comment"
// // //                     className="rounded-lg border p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
// // //                   >
// // //                     <EyeOff size={13} />
// // //                   </button>
// // //                 )}
// // //                 <button
// // //                   disabled={actionLoading}
// // //                   onClick={() => onAction(() => deleteComment(comment._id), "comment-delete")}
// // //                   title="Soft delete comment"
// // //                   className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
// // //                 >
// // //                   <Trash2 size={13} />
// // //                 </button>
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Content */}
// // //         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
// // //           {comment.isDeleted ? (
// // //             <em className="text-gray-400">[This comment has been deleted]</em>
// // //           ) : (
// // //             comment.content
// // //           )}
// // //         </p>

// // //         {/* Reports detail */}
// // //         {comment.reports?.length > 0 && (
// // //           <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-2 space-y-1">
// // //             <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
// // //               <AlertTriangle size={11} /> Reports on this comment
// // //             </p>
// // //             {comment.reports.map((r) => (
// // //               <p key={r._id} className="text-xs text-red-600">
// // //                 <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
// // //                 {" — "}
// // //                 {r.reason}
// // //               </p>
// // //             ))}
// // //           </div>
// // //         )}

// // //         {/* Toggle replies */}
// // //         {hasReplies && (
// // //           <button
// // //             onClick={() => setExpanded((v) => !v)}
// // //             className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
// // //           >
// // //             {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
// // //             {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
// // //           </button>
// // //         )}
// // //       </div>

// // //       {/* Replies */}
// // //       {expanded && hasReplies && (
// // //         <div>
// // //           {comment.replies.map((reply) => (
// // //             <CommentCard
// // //               key={reply._id}
// // //               comment={reply}
// // //               depth={depth + 1}
// // //               highlightId={highlightId}
// // //               onAction={onAction}
// // //               actionLoading={actionLoading}
// // //             />
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // /* ─────────────────────────────────────────
// // //    Main Modal
// // // ───────────────────────────────────────── */

// // // /**
// // //  * Props:
// // //  *   mode        — "thread" | "comment"
// // //  *   targetId    — thread._id  OR  comment._id
// // //  *   highlightCommentId — optional, scrolls to & highlights a specific comment
// // //  *   onClose     — () => void
// // //  *   onActionDone — () => void  (called after any moderation action so parent can refresh)
// // //  */
// // // export default function ThreadViewerModal({
// // //   mode = "thread",
// // //   targetId,
// // //   highlightCommentId,
// // //   onClose,
// // //   onActionDone,
// // // }) {
// // //   const [loading, setLoading] = useState(true);
// // //   const [actionLoading, setActionLoading] = useState(false);
// // //   const [error, setError] = useState("");

// // //   // thread-mode data
// // //   const [thread, setThread] = useState(null);
// // //   const [comments, setComments] = useState([]);

// // //   // comment-mode data
// // //   const [comment, setComment] = useState(null);
// // //   const [commentThread, setCommentThread] = useState(null);
// // //   const [replies, setReplies] = useState([]);

// // //   const load = useCallback(async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       if (mode === "thread") {
// // //         const data = await getThreadById(targetId);
// // //         setThread(data.thread);
// // //         setComments(data.comments || []);
// // //       } else {
// // //         const data = await getCommentById(targetId);
// // //         setComment(data.comment);
// // //         setCommentThread(data.thread);
// // //         setReplies(data.replies || []);
// // //       }
// // //     } catch (err) {
// // //       setError(err.message || "Failed to load content");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [mode, targetId]);

// // //   useEffect(() => {
// // //     load();
// // //   }, [load]);

// // //   // Scroll to highlighted comment after render
// // //   useEffect(() => {
// // //     if (!loading && highlightCommentId) {
// // //       setTimeout(() => {
// // //         const el = document.getElementById(`comment-${highlightCommentId}`);
// // //         if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
// // //       }, 150);
// // //     }
// // //   }, [loading, highlightCommentId]);

// // //   const handleAction = async (actionFn) => {
// // //     setActionLoading(true);
// // //     setError("");
// // //     try {
// // //       await actionFn();
// // //       await load();           // refresh modal content
// // //       onActionDone?.();       // refresh parent table
// // //     } catch (err) {
// // //       setError(err.message || "Action failed");
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   /* ── Backdrop click ── */
// // //   const handleBackdrop = (e) => {
// // //     if (e.target === e.currentTarget) onClose();
// // //   };

// // //   /* ── Render ── */
// // //   return (
// // //     <div
// // //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
// // //       onClick={handleBackdrop}
// // //     >
// // //       <div className="relative flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-gray-50 shadow-2xl overflow-hidden">

// // //         {/* ── Header ── */}
// // //         <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shrink-0">
// // //           <div>
// // //             <h2 className="text-lg font-bold text-gray-900">
// // //               {mode === "thread" ? "Thread Review" : "Comment Review"}
// // //             </h2>
// // //             <p className="text-xs text-gray-500">
// // //               Read the full conversation before taking action
// // //             </p>
// // //           </div>
// // //           <button
// // //             onClick={onClose}
// // //             className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
// // //           >
// // //             <X size={18} />
// // //           </button>
// // //         </div>

// // //         {/* ── Error ── */}
// // //         {error && (
// // //           <div className="shrink-0 mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         )}

// // //         {/* ── Body ── */}
// // //         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
// // //           {loading ? (
// // //             <div className="flex h-40 items-center justify-center">
// // //               <Loader2 className="animate-spin text-gray-400" size={28} />
// // //             </div>
// // //           ) : mode === "thread" ? (
// // //             <ThreadView
// // //               thread={thread}
// // //               comments={comments}
// // //               highlightId={highlightCommentId}
// // //               onAction={handleAction}
// // //               actionLoading={actionLoading}
// // //             />
// // //           ) : (
// // //             <CommentView
// // //               comment={comment}
// // //               thread={commentThread}
// // //               replies={replies}
// // //               onAction={handleAction}
// // //               actionLoading={actionLoading}
// // //             />
// // //           )}
// // //         </div>

// // //         {/* ── Footer loading indicator ── */}
// // //         {actionLoading && (
// // //           <div className="shrink-0 flex items-center justify-center gap-2 border-t border-gray-200 bg-white py-3 text-sm text-gray-500">
// // //             <Loader2 size={14} className="animate-spin" />
// // //             Applying action…
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ─────────────────────────────────────────
// // //    Thread View (inside modal)
// // // ───────────────────────────────────────── */
// // // function ThreadView({ thread, comments, highlightId, onAction, actionLoading }) {
// // //   if (!thread) return null;

// // //   return (
// // //     <div className="space-y-4">
// // //       {/* Thread post */}
// // //       <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
// // //         <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
// // //           <div className="flex-1 min-w-0">
// // //             <div className="flex flex-wrap items-center gap-2 mb-1">
// // //               <StatusBadge item={thread} type="thread" />
// // //               {thread.isLocked && !thread.isDeleted && (
// // //                 <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
// // //                   <Lock size={10} /> Locked
// // //                 </span>
// // //               )}
// // //               {thread.reportsCount > 0 && (
// // //                 <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
// // //                   <Flag size={10} /> {thread.reportsCount} report{thread.reportsCount > 1 ? "s" : ""}
// // //                 </span>
// // //               )}
// // //             </div>
// // //             <h3 className="text-xl font-bold text-gray-900 leading-tight">{thread.title}</h3>
// // //             {thread.tags?.length > 0 && (
// // //               <div className="flex flex-wrap gap-1 mt-1">
// // //                 {thread.tags.map((tag) => (
// // //                   <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
// // //                     #{tag}
// // //                   </span>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
// // //           <span className="flex items-center gap-1">
// // //             <User size={11} />
// // //             {thread.author?.name || thread.author?.email || "Unknown"}
// // //           </span>
// // //           <span>{formatDate(thread.createdAt)}</span>
// // //           <span className="flex items-center gap-1">
// // //             <MessageSquare size={11} />
// // //             {comments.length} comment{comments.length !== 1 ? "s" : ""}
// // //           </span>
// // //         </div>

// // //         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
// // //           {thread.content}
// // //         </p>

// // //         {/* Reports detail */}
// // //         {thread.reports?.length > 0 && (
// // //           <div className="mb-4 rounded-lg bg-red-50 border border-red-100 p-3 space-y-1">
// // //             <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
// // //               <AlertTriangle size={11} /> Reports on this thread
// // //             </p>
// // //             {thread.reports.map((r) => (
// // //               <p key={r._id} className="text-xs text-red-600">
// // //                 <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
// // //                 {" — "}
// // //                 {r.reason}
// // //               </p>
// // //             ))}
// // //           </div>
// // //         )}

// // //         {/* Thread-level actions */}
// // //         {!thread.isDeleted && (
// // //           <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
// // //             {thread.isHidden ? (
// // //               <button
// // //                 disabled={actionLoading}
// // //                 onClick={() => onAction(() => unhideThread(thread._id))}
// // //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// // //               >
// // //                 <Eye size={14} /> Unhide Thread
// // //               </button>
// // //             ) : (
// // //               <button
// // //                 disabled={actionLoading}
// // //                 onClick={() => onAction(() => hideThread(thread._id))}
// // //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// // //               >
// // //                 <EyeOff size={14} /> Hide Thread
// // //               </button>
// // //             )}

// // //             {thread.isLocked ? (
// // //               <button
// // //                 disabled={actionLoading}
// // //                 onClick={() => onAction(() => unlockThread(thread._id))}
// // //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// // //               >
// // //                 <Unlock size={14} /> Unlock Thread
// // //               </button>
// // //             ) : (
// // //               <button
// // //                 disabled={actionLoading}
// // //                 onClick={() => onAction(() => lockThread(thread._id))}
// // //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// // //               >
// // //                 <Lock size={14} /> Lock Thread
// // //               </button>
// // //             )}

// // //             <button
// // //               disabled={actionLoading}
// // //               onClick={() => onAction(() => deleteThread(thread._id))}
// // //               className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
// // //             >
// // //               <Trash2 size={14} /> Delete Thread
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Comments */}
// // //       {comments.length === 0 ? (
// // //         <p className="text-center text-sm text-gray-400 py-6">No comments yet.</p>
// // //       ) : (
// // //         <div>
// // //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
// // //             {comments.length} Comment{comments.length !== 1 ? "s" : ""}
// // //           </p>
// // //           {comments.map((c) => (
// // //             <CommentCard
// // //               key={c._id}
// // //               comment={c}
// // //               depth={0}
// // //               highlightId={highlightId}
// // //               onAction={onAction}
// // //               actionLoading={actionLoading}
// // //             />
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // /* ─────────────────────────────────────────
// // //    Comment View (inside modal — for report review)
// // // ───────────────────────────────────────── */
// // // function CommentView({ comment, thread, replies, onAction, actionLoading }) {
// // //   if (!comment) return null;

// // //   return (
// // //     <div className="space-y-4">
// // //       {/* Parent thread context */}
// // //       {thread && (
// // //         <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
// // //           <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">
// // //             From thread
// // //           </p>
// // //           <p className="font-semibold text-gray-900">{thread.title}</p>
// // //           <p className="text-xs text-gray-500 mt-0.5">
// // //             by {thread.author?.name || thread.author?.email || "Unknown"} ·{" "}
// // //             {formatDate(thread.createdAt)}
// // //           </p>
// // //           <p className="text-sm text-gray-600 mt-2 line-clamp-3">{thread.content}</p>
// // //         </div>
// // //       )}

// // //       {/* The reported comment */}
// // //       <div>
// // //         <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1">
// // //           <Flag size={11} /> Reported Comment
// // //         </p>
// // //         <CommentCard
// // //           comment={{ ...comment, replies }}
// // //           depth={0}
// // //           highlightId={comment._id}
// // //           onAction={onAction}
// // //           actionLoading={actionLoading}
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // // file: src/admin/components/ThreadViewerModal.jsx
// // import { useEffect, useState, useCallback } from "react";
// // import {
// //   X,
// //   Loader2,
// //   User,
// //   Lock,
// //   EyeOff,
// //   Trash2,
// //   Unlock,
// //   Eye,
// //   Flag,
// //   AlertTriangle,
// //   MessageSquare,
// // } from "lucide-react";
// // import {
// //   getThreadById,
// //   getCommentById,
// //   hideThread,
// //   unhideThread,
// //   lockThread,
// //   unlockThread,
// //   deleteThread,
// //   hideComment,
// //   deleteComment,
// // } from "../../services/adminForumAPI";

// // /* ─────────────────────────────────────────
// //    Helpers
// // ───────────────────────────────────────── */
// // const formatDate = (value) => {
// //   if (!value) return "-";
// //   const date = new Date(value);
// //   if (Number.isNaN(date.getTime())) return "-";
// //   return date.toLocaleString();
// // };

// // const StatusBadge = ({ item, type = "thread" }) => {
// //   if (item?.isDeleted)
// //     return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Deleted</span>;
// //   if (item?.isHidden)
// //     return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Hidden</span>;
// //   if (type === "thread" && item?.isLocked)
// //     return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Locked</span>;
// //   return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>;
// // };

// // /* ─────────────────────────────────────────
// //    Single Comment Card — always shows all
// //    replies inline, no expand/collapse toggle
// // ───────────────────────────────────────── */
// // const CommentCard = ({ comment, depth = 0, highlightId, onAction, actionLoading }) => {
// //   const isHighlighted = highlightId && comment._id === highlightId;
// //   const hasReplies    = comment.replies?.length > 0;

// //   // Left-border colour shifts per depth level so nesting is easy to scan
// //   const depthBorderColor = [
// //     "border-gray-200",
// //     "border-blue-200",
// //     "border-violet-200",
// //     "border-emerald-200",
// //     "border-amber-200",
// //   ][Math.min(depth, 4)];

// //   return (
// //     <div className={depth > 0 ? `ml-5 border-l-2 ${depthBorderColor} pl-4` : ""}>
// //       {/* Comment bubble */}
// //       <div
// //         id={`comment-${comment._id}`}
// //         className={`rounded-xl border p-4 mb-2 transition-all ${
// //           isHighlighted
// //             ? "border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300"
// //             : comment.isDeleted
// //             ? "border-red-100 bg-red-50 opacity-60"
// //             : comment.isHidden
// //             ? "border-amber-100 bg-amber-50 opacity-75"
// //             : "border-gray-100 bg-white"
// //         }`}
// //       >
// //         {/* ── Header ── */}
// //         <div className="flex items-start justify-between gap-2 mb-2">
// //           <div className="flex flex-wrap items-center gap-2">
// //             <div className="flex items-center gap-1.5">
// //               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 shrink-0">
// //                 <User size={12} className="text-gray-500" />
// //               </div>
// //               <span className="text-sm font-medium text-gray-800">
// //                 {comment.author?.name || comment.author?.email || "Unknown"}
// //               </span>
// //             </div>
// //             <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
// //             <StatusBadge item={comment} type="comment" />

// //             {isHighlighted && (
// //               <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
// //                 ⚑ Reported
// //               </span>
// //             )}
// //             {comment.reportsCount > 0 && !isHighlighted && (
// //               <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
// //                 <Flag size={10} />
// //                 {comment.reportsCount} report{comment.reportsCount > 1 ? "s" : ""}
// //               </span>
// //             )}
// //             {hasReplies && (
// //               <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
// //                 <MessageSquare size={10} />
// //                 {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
// //               </span>
// //             )}
// //           </div>

// //           {/* ── Quick moderation ── */}
// //           {!comment.isDeleted && (
// //             <div className="flex shrink-0 gap-1.5">
// //               {comment.isHidden ? (
// //                 <button
// //                   disabled={actionLoading}
// //                   onClick={() => onAction(() => hideComment(comment._id))}
// //                   title="Unhide comment"
// //                   className="rounded-lg border p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
// //                 >
// //                   <Eye size={13} />
// //                 </button>
// //               ) : (
// //                 <button
// //                   disabled={actionLoading}
// //                   onClick={() => onAction(() => hideComment(comment._id))}
// //                   title="Hide comment"
// //                   className="rounded-lg border p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
// //                 >
// //                   <EyeOff size={13} />
// //                 </button>
// //               )}
// //               <button
// //                 disabled={actionLoading}
// //                 onClick={() => onAction(() => deleteComment(comment._id))}
// //                 title="Delete comment"
// //                 className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
// //               >
// //                 <Trash2 size={13} />
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Content ── */}
// //         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
// //           {comment.isDeleted
// //             ? <em className="text-gray-400">[This comment has been deleted]</em>
// //             : comment.content}
// //         </p>

// //         {/* ── Embedded report reasons ── */}
// //         {comment.reports?.length > 0 && (
// //           <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2 space-y-1">
// //             <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
// //               <AlertTriangle size={11} /> Reports on this comment
// //             </p>
// //             {comment.reports.map((r) => (
// //               <p key={r._id} className="text-xs text-red-600">
// //                 <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
// //                 {" — "}
// //                 {r.reason}
// //               </p>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* ── All replies rendered immediately, no button ── */}
// //       {hasReplies && (
// //         <div className="mb-2">
// //           {comment.replies.map((reply) => (
// //             <CommentCard
// //               key={reply._id}
// //               comment={reply}
// //               depth={depth + 1}
// //               highlightId={highlightId}
// //               onAction={onAction}
// //               actionLoading={actionLoading}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // /* ─────────────────────────────────────────
// //    Main Modal
// // ───────────────────────────────────────── */
// // export default function ThreadViewerModal({
// //   mode = "thread",
// //   targetId,
// //   highlightCommentId,
// //   onClose,
// //   onActionDone,
// // }) {
// //   const [loading, setLoading]               = useState(true);
// //   const [actionLoading, setActionLoading]   = useState(false);
// //   const [error, setError]                   = useState("");

// //   const [thread, setThread]                 = useState(null);
// //   const [comments, setComments]             = useState([]);
// //   const [comment, setComment]               = useState(null);
// //   const [commentThread, setCommentThread]   = useState(null);
// //   const [replies, setReplies]               = useState([]);

// //   const load = useCallback(async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       if (mode === "thread") {
// //         const data = await getThreadById(targetId);
// //         setThread(data.thread);
// //         setComments(data.comments || []);
// //       } else {
// //         const data = await getCommentById(targetId);
// //         setComment(data.comment);
// //         setCommentThread(data.thread);
// //         setReplies(data.replies || []);
// //       }
// //     } catch (err) {
// //       setError(err.message || "Failed to load content");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [mode, targetId]);

// //   useEffect(() => { load(); }, [load]);

// //   // Auto-scroll to highlighted comment once everything is rendered
// //   useEffect(() => {
// //     if (!loading && highlightCommentId) {
// //       setTimeout(() => {
// //         const el = document.getElementById(`comment-${highlightCommentId}`);
// //         if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
// //       }, 150);
// //     }
// //   }, [loading, highlightCommentId]);

// //   const handleAction = async (actionFn) => {
// //     setActionLoading(true);
// //     setError("");
// //     try {
// //       await actionFn();
// //       await load();
// //       onActionDone?.();
// //     } catch (err) {
// //       setError(err.message || "Action failed");
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleBackdrop = (e) => {
// //     if (e.target === e.currentTarget) onClose();
// //   };

// //   return (
// //     <div
// //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
// //       onClick={handleBackdrop}
// //     >
// //       <div className="relative flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-gray-50 shadow-2xl overflow-hidden">

// //         {/* ── Header ── */}
// //         <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shrink-0">
// //           <div>
// //             <h2 className="text-lg font-bold text-gray-900">
// //               {mode === "thread" ? "Thread Review" : "Comment Review"}
// //             </h2>
// //             <p className="text-xs text-gray-500">
// //               Full conversation — all replies visible
// //             </p>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
// //           >
// //             <X size={18} />
// //           </button>
// //         </div>

// //         {/* ── Error banner ── */}
// //         {error && (
// //           <div className="shrink-0 mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
// //             {error}
// //           </div>
// //         )}

// //         {/* ── Scrollable body ── */}
// //         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
// //           {loading ? (
// //             <div className="flex h-40 items-center justify-center">
// //               <Loader2 className="animate-spin text-gray-400" size={28} />
// //             </div>
// //           ) : mode === "thread" ? (
// //             <ThreadView
// //               thread={thread}
// //               comments={comments}
// //               highlightId={highlightCommentId}
// //               onAction={handleAction}
// //               actionLoading={actionLoading}
// //             />
// //           ) : (
// //             <CommentView
// //               comment={comment}
// //               thread={commentThread}
// //               replies={replies}
// //               onAction={handleAction}
// //               actionLoading={actionLoading}
// //             />
// //           )}
// //         </div>

// //         {/* ── Loading footer ── */}
// //         {actionLoading && (
// //           <div className="shrink-0 flex items-center justify-center gap-2 border-t border-gray-200 bg-white py-3 text-sm text-gray-500">
// //             <Loader2 size={14} className="animate-spin" />
// //             Applying action…
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // /* ─────────────────────────────────────────
// //    Thread View (inside modal)
// // ───────────────────────────────────────── */
// // function ThreadView({ thread, comments, highlightId, onAction, actionLoading }) {
// //   if (!thread) return null;

// //   return (
// //     <div className="space-y-4">
// //       {/* Thread post */}
// //       <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
// //         <div className="flex flex-wrap items-center gap-2 mb-2">
// //           <StatusBadge item={thread} type="thread" />
// //           {thread.isLocked && !thread.isDeleted && (
// //             <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
// //               <Lock size={10} /> Locked
// //             </span>
// //           )}
// //           {thread.reportsCount > 0 && (
// //             <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
// //               <Flag size={10} /> {thread.reportsCount} report{thread.reportsCount > 1 ? "s" : ""}
// //             </span>
// //           )}
// //         </div>

// //         <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{thread.title}</h3>
// //         {thread.tags?.length > 0 && (
// //           <div className="flex flex-wrap gap-1 mb-3">
// //             {thread.tags.map((tag) => (
// //               <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
// //                 #{tag}
// //               </span>
// //             ))}
// //           </div>
// //         )}

// //         <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
// //           <span className="flex items-center gap-1">
// //             <User size={11} />
// //             {thread.author?.name || thread.author?.email || "Unknown"}
// //           </span>
// //           <span>{formatDate(thread.createdAt)}</span>
// //           <span className="flex items-center gap-1">
// //             <MessageSquare size={11} />
// //             {comments.length} comment{comments.length !== 1 ? "s" : ""}
// //           </span>
// //         </div>

// //         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
// //           {thread.content}
// //         </p>

// //         {thread.reports?.length > 0 && (
// //           <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 space-y-1">
// //             <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
// //               <AlertTriangle size={11} /> Reports on this thread
// //             </p>
// //             {thread.reports.map((r) => (
// //               <p key={r._id} className="text-xs text-red-600">
// //                 <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
// //                 {" — "}
// //                 {r.reason}
// //               </p>
// //             ))}
// //           </div>
// //         )}

// //         {!thread.isDeleted && (
// //           <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
// //             {thread.isHidden ? (
// //               <button
// //                 disabled={actionLoading}
// //                 onClick={() => onAction(() => unhideThread(thread._id))}
// //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 <Eye size={14} /> Unhide Thread
// //               </button>
// //             ) : (
// //               <button
// //                 disabled={actionLoading}
// //                 onClick={() => onAction(() => hideThread(thread._id))}
// //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 <EyeOff size={14} /> Hide Thread
// //               </button>
// //             )}
// //             {thread.isLocked ? (
// //               <button
// //                 disabled={actionLoading}
// //                 onClick={() => onAction(() => unlockThread(thread._id))}
// //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 <Unlock size={14} /> Unlock Thread
// //               </button>
// //             ) : (
// //               <button
// //                 disabled={actionLoading}
// //                 onClick={() => onAction(() => lockThread(thread._id))}
// //                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 <Lock size={14} /> Lock Thread
// //               </button>
// //             )}
// //             <button
// //               disabled={actionLoading}
// //               onClick={() => onAction(() => deleteThread(thread._id))}
// //               className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
// //             >
// //               <Trash2 size={14} /> Delete Thread
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Comments — all expanded */}
// //       {comments.length === 0 ? (
// //         <p className="py-8 text-center text-sm text-gray-400">No comments yet.</p>
// //       ) : (
// //         <div>
// //           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
// //             {comments.length} Comment{comments.length !== 1 ? "s" : ""}
// //           </p>
// //           {comments.map((c) => (
// //             <CommentCard
// //               key={c._id}
// //               comment={c}
// //               depth={0}
// //               highlightId={highlightId}
// //               onAction={onAction}
// //               actionLoading={actionLoading}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* ─────────────────────────────────────────
// //    Comment View (inside modal)
// // ───────────────────────────────────────── */
// // function CommentView({ comment, thread, replies, onAction, actionLoading }) {
// //   if (!comment) return null;

// //   return (
// //     <div className="space-y-4">
// //       {thread && (
// //         <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
// //           <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-500">
// //             From thread
// //           </p>
// //           <p className="font-semibold text-gray-900">{thread.title}</p>
// //           <p className="mt-0.5 text-xs text-gray-500">
// //             by {thread.author?.name || thread.author?.email || "Unknown"} · {formatDate(thread.createdAt)}
// //           </p>
// //           <p className="mt-2 text-sm text-gray-600 line-clamp-3">{thread.content}</p>
// //         </div>
// //       )}

// //       <div>
// //         <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
// //           <Flag size={11} /> Reported Comment &amp; Replies
// //         </p>
// //         {/* Pass replies directly into the card so they render without a toggle */}
// //         <CommentCard
// //           comment={{ ...comment, replies }}
// //           depth={0}
// //           highlightId={comment._id}
// //           onAction={onAction}
// //           actionLoading={actionLoading}
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // file: src/admin/components/ThreadViewerModal.jsx
// import { useEffect, useState, useCallback } from "react";
// import {
//   X,
//   Loader2,
//   User,
//   Lock,
//   EyeOff,
//   Trash2,
//   Unlock,
//   Eye,
//   Flag,
//   AlertTriangle,
//   MessageSquare,
// } from "lucide-react";
// import {
//   getThreadById,
//   getCommentById,
//   hideThread,
//   unhideThread,
//   lockThread,
//   unlockThread,
//   deleteThread,
//   hideComment,
//   deleteComment,
// } from "../../services/adminForumAPI";

// /* ─────────────────────────────────────────
//    Helpers
// ───────────────────────────────────────── */
// const formatDate = (value) => {
//   if (!value) return "-";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "-";
//   return date.toLocaleString();
// };

// const StatusBadge = ({ item, type = "thread" }) => {
//   if (item?.isDeleted)
//     return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Deleted</span>;
//   if (item?.isHidden)
//     return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Hidden</span>;
//   if (type === "thread" && item?.isLocked)
//     return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Locked</span>;
//   return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>;
// };

// /* ─────────────────────────────────────────
//    Single Comment Card
// ───────────────────────────────────────── */
// const CommentCard = ({ comment, depth = 0, highlightId, onAction, actionLoading }) => {
//   const isHighlighted = highlightId && comment._id === highlightId;
//   const hasReplies    = comment.replies?.length > 0;

//   const depthBorderColor = [
//     "border-gray-200",
//     "border-blue-200",
//     "border-violet-200",
//     "border-emerald-200",
//     "border-amber-200",
//   ][Math.min(depth, 4)];

//   return (
//     <div className={depth > 0 ? `ml-5 border-l-2 ${depthBorderColor} pl-4` : ""}>
//       <div
//         id={`comment-${comment._id}`}
//         className={`rounded-xl border p-4 mb-2 transition-all ${
//           isHighlighted
//             ? "border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300"
//             : comment.isDeleted
//             ? "border-red-100 bg-red-50 opacity-60"
//             : comment.isHidden
//             ? "border-amber-100 bg-amber-50 opacity-75"
//             : "border-gray-100 bg-white"
//         }`}
//       >
//         {/* ── Header ── */}
//         <div className="flex items-start justify-between gap-2 mb-2">
//           <div className="flex flex-wrap items-center gap-2">
//             <div className="flex items-center gap-1.5">
//               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 shrink-0">
//                 <User size={12} className="text-gray-500" />
//               </div>
//               <span className="text-sm font-medium text-gray-800">
//                 {comment.author?.name || comment.author?.email || "Unknown"}
//               </span>
//             </div>
//             <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
//             <StatusBadge item={comment} type="comment" />

//             {isHighlighted && (
//               <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
//                 ⚑ Reported
//               </span>
//             )}
//             {comment.reportsCount > 0 && !isHighlighted && (
//               <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
//                 <Flag size={10} />
//                 {comment.reportsCount} report{comment.reportsCount > 1 ? "s" : ""}
//               </span>
//             )}
//             {hasReplies && (
//               <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
//                 <MessageSquare size={10} />
//                 {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
//               </span>
//             )}
//           </div>

//           {/* ── Quick moderation ── */}
//           {!comment.isDeleted && (
//             <div className="flex shrink-0 gap-1.5">
//               {comment.isHidden ? (
//                 <button
//                   disabled={actionLoading}
//                   onClick={() => onAction(() => hideComment(comment._id))}
//                   title="Unhide comment"
//                   className="rounded-lg border p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   <Eye size={13} />
//                 </button>
//               ) : (
//                 <button
//                   disabled={actionLoading}
//                   onClick={() => onAction(() => hideComment(comment._id))}
//                   title="Hide comment"
//                   className="rounded-lg border p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   <EyeOff size={13} />
//                 </button>
//               )}
//               <button
//                 disabled={actionLoading}
//                 onClick={() => onAction(() => deleteComment(comment._id))}
//                 title="Delete comment"
//                 className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
//               >
//                 <Trash2 size={13} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Content ── */}
//         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//           {comment.isDeleted
//             ? <em className="text-gray-400">[This comment has been deleted]</em>
//             : comment.content}
//         </p>

//         {/* ── Embedded report reasons ── */}
//         {comment.reports?.length > 0 && (
//           <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2 space-y-1">
//             <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
//               <AlertTriangle size={11} /> Reports on this comment
//             </p>
//             {comment.reports.map((r) => (
//               <p key={r._id} className="text-xs text-red-600">
//                 <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
//                 {" — "}
//                 {r.reason}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Replies ── */}
//       {hasReplies && (
//         <div className="mb-2">
//           {comment.replies.map((reply) => (
//             <CommentCard
//               key={reply._id}
//               comment={reply}
//               depth={depth + 1}
//               highlightId={highlightId}
//               onAction={onAction}
//               actionLoading={actionLoading}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────
//    Main Modal
// ───────────────────────────────────────── */
// export default function ThreadViewerModal({
//   mode = "thread",
//   targetId,
//   highlightCommentId,
//   onClose,
//   onActionDone,
// }) {
//   const [loading, setLoading]             = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError]                 = useState("");

//   // Always stored as a full thread + comments for rendering
//   const [thread, setThread]   = useState(null);
//   const [comments, setComments] = useState([]);

//   // The effective highlight ID: explicit prop, or the comment targetId itself
//   const effectiveHighlight = highlightCommentId ?? (mode === "comment" ? targetId : null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       if (mode === "thread") {
//         // ── Thread report: load thread directly ──
//         const data = await getThreadById(targetId);
//         setThread(data.thread);
//         setComments(data.comments || []);
//       } else {
//         // ── Comment report: first fetch the comment to get its parent
//         //    thread ID, then load that full thread so the admin sees
//         //    the whole conversation with the flagged comment highlighted.
//         const commentData = await getCommentById(targetId);
//         const parentThreadId = commentData.thread?._id;

//         if (!parentThreadId) {
//           throw new Error("Could not resolve the parent thread for this comment.");
//         }

//         const threadData = await getThreadById(parentThreadId);
//         setThread(threadData.thread);
//         setComments(threadData.comments || []);
//       }
//     } catch (err) {
//       setError(err.message || "Failed to load content");
//     } finally {
//       setLoading(false);
//     }
//   }, [mode, targetId]);

//   useEffect(() => { load(); }, [load]);

//   // Auto-scroll to highlighted comment
//   useEffect(() => {
//     if (!loading && effectiveHighlight) {
//       setTimeout(() => {
//         const el = document.getElementById(`comment-${effectiveHighlight}`);
//         if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//       }, 150);
//     }
//   }, [loading, effectiveHighlight]);

//   const handleAction = async (actionFn) => {
//     setActionLoading(true);
//     setError("");
//     try {
//       await actionFn();
//       await load();
//       onActionDone?.();
//     } catch (err) {
//       setError(err.message || "Action failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleBackdrop = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//       onClick={handleBackdrop}
//     >
//       <div className="relative flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-gray-50 shadow-2xl overflow-hidden">

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shrink-0">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">
//               {mode === "thread" ? "Thread Review" : "Comment Review"}
//             </h2>
//             <p className="text-xs text-gray-500">
//               {mode === "comment"
//                 ? "Full thread — reported comment is highlighted"
//                 : "Full conversation — all replies visible"}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* ── Error banner ── */}
//         {error && (
//           <div className="shrink-0 mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {/* ── Scrollable body ── */}
//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//           {loading ? (
//             <div className="flex h-40 items-center justify-center">
//               <Loader2 className="animate-spin text-gray-400" size={28} />
//             </div>
//           ) : (
//             // Both modes now render the full ThreadView.
//             // For comment reports, effectiveHighlight points to the flagged comment.
//             <ThreadView
//               thread={thread}
//               comments={comments}
//               highlightId={effectiveHighlight}
//               onAction={handleAction}
//               actionLoading={actionLoading}
//             />
//           )}
//         </div>

//         {/* ── Loading footer ── */}
//         {actionLoading && (
//           <div className="shrink-0 flex items-center justify-center gap-2 border-t border-gray-200 bg-white py-3 text-sm text-gray-500">
//             <Loader2 size={14} className="animate-spin" />
//             Applying action…
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Thread View (inside modal)
// ───────────────────────────────────────── */
// function ThreadView({ thread, comments, highlightId, onAction, actionLoading }) {
//   if (!thread) return null;

//   return (
//     <div className="space-y-4">
//       {/* Thread post */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="flex flex-wrap items-center gap-2 mb-2">
//           <StatusBadge item={thread} type="thread" />
//           {thread.isLocked && !thread.isDeleted && (
//             <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
//               <Lock size={10} /> Locked
//             </span>
//           )}
//           {thread.reportsCount > 0 && (
//             <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
//               <Flag size={10} /> {thread.reportsCount} report{thread.reportsCount > 1 ? "s" : ""}
//             </span>
//           )}
//         </div>

//         <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{thread.title}</h3>
//         {thread.tags?.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {thread.tags.map((tag) => (
//               <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
//           <span className="flex items-center gap-1">
//             <User size={11} />
//             {thread.author?.name || thread.author?.email || "Unknown"}
//           </span>
//           <span>{formatDate(thread.createdAt)}</span>
//           <span className="flex items-center gap-1">
//             <MessageSquare size={11} />
//             {comments.length} comment{comments.length !== 1 ? "s" : ""}
//           </span>
//         </div>

//         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
//           {thread.content}
//         </p>

//         {thread.reports?.length > 0 && (
//           <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 space-y-1">
//             <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
//               <AlertTriangle size={11} /> Reports on this thread
//             </p>
//             {thread.reports.map((r) => (
//               <p key={r._id} className="text-xs text-red-600">
//                 <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
//                 {" — "}
//                 {r.reason}
//               </p>
//             ))}
//           </div>
//         )}

//         {!thread.isDeleted && (
//           <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
//             {thread.isHidden ? (
//               <button
//                 disabled={actionLoading}
//                 onClick={() => onAction(() => unhideThread(thread._id))}
//                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <Eye size={14} /> Unhide Thread
//               </button>
//             ) : (
//               <button
//                 disabled={actionLoading}
//                 onClick={() => onAction(() => hideThread(thread._id))}
//                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <EyeOff size={14} /> Hide Thread
//               </button>
//             )}
//             {thread.isLocked ? (
//               <button
//                 disabled={actionLoading}
//                 onClick={() => onAction(() => unlockThread(thread._id))}
//                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <Unlock size={14} /> Unlock Thread
//               </button>
//             ) : (
//               <button
//                 disabled={actionLoading}
//                 onClick={() => onAction(() => lockThread(thread._id))}
//                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <Lock size={14} /> Lock Thread
//               </button>
//             )}
//             <button
//               disabled={actionLoading}
//               onClick={() => onAction(() => deleteThread(thread._id))}
//               className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
//             >
//               <Trash2 size={14} /> Delete Thread
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Comments */}
//       {comments.length === 0 ? (
//         <p className="py-8 text-center text-sm text-gray-400">No comments yet.</p>
//       ) : (
//         <div>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
//             {comments.length} Comment{comments.length !== 1 ? "s" : ""}
//           </p>
//           {comments.map((c) => (
//             <CommentCard
//               key={c._id}
//               comment={c}
//               depth={0}
//               highlightId={highlightId}
//               onAction={onAction}
//               actionLoading={actionLoading}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// file: src/admin/components/ThreadViewerModal.jsx
import { useEffect, useState, useCallback } from "react";
import {
  X,
  Loader2,
  User,
  Lock,
  Trash2,
  Unlock,
  Flag,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import {
  getThreadById,
  getCommentById,
  lockThread,
  unlockThread,
  deleteThread,
  deleteComment,
} from "../../services/adminForumAPI";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const StatusBadge = ({ item, type = "thread" }) => {
  if (item?.isDeleted)
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Deleted</span>;
  if (item?.isHidden)
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Hidden</span>;
  if (type === "thread" && item?.isLocked)
    return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Locked</span>;
  return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>;
};

/* ─────────────────────────────────────────
   Single Comment Card
───────────────────────────────────────── */
const CommentCard = ({ comment, depth = 0, highlightId, onAction, actionLoading }) => {
  const isHighlighted = highlightId && comment._id === highlightId;
  const hasReplies    = comment.replies?.length > 0;

  const depthBorderColor = [
    "border-gray-200",
    "border-blue-200",
    "border-violet-200",
    "border-emerald-200",
    "border-amber-200",
  ][Math.min(depth, 4)];

  return (
    <div className={depth > 0 ? `ml-5 border-l-2 ${depthBorderColor} pl-4` : ""}>
      <div
        id={`comment-${comment._id}`}
        className={`rounded-xl border p-4 mb-2 transition-all ${
          isHighlighted
            ? "border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300"
            : comment.isDeleted
            ? "border-red-100 bg-red-50 opacity-60"
            : comment.isHidden
            ? "border-amber-100 bg-amber-50 opacity-75"
            : "border-gray-100 bg-white"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 shrink-0">
                <User size={12} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {comment.author?.name || comment.author?.email || "Unknown"}
              </span>
            </div>
            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
            <StatusBadge item={comment} type="comment" />

            {isHighlighted && (
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
                ⚑ Reported
              </span>
            )}
            {comment.reportsCount > 0 && !isHighlighted && (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                <Flag size={10} />
                {comment.reportsCount} report{comment.reportsCount > 1 ? "s" : ""}
              </span>
            )}
            {hasReplies && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                <MessageSquare size={10} />
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>

          {/* ── Quick moderation ── */}
          {!comment.isDeleted && (
            <div className="flex shrink-0 gap-1.5">
              <button
                disabled={actionLoading}
                onClick={() => onAction(() => deleteComment(comment._id))}
                title="Delete comment"
                className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {comment.isDeleted
            ? <em className="text-gray-400">[This comment has been deleted]</em>
            : comment.content}
        </p>

        {/* ── Embedded report reasons ── */}
        {comment.reports?.length > 0 && (
          <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2 space-y-1">
            <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
              <AlertTriangle size={11} /> Reports on this comment
            </p>
            {comment.reports.map((r) => (
              <p key={r._id} className="text-xs text-red-600">
                <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
                {" — "}
                {r.reason}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Replies ── */}
      {hasReplies && (
        <div className="mb-2">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              highlightId={highlightId}
              onAction={onAction}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Modal
───────────────────────────────────────── */
export default function ThreadViewerModal({
  mode = "thread",
  targetId,
  highlightCommentId,
  onClose,
  onActionDone,
}) {
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]                 = useState("");

  // Always stored as a full thread + comments for rendering
  const [thread, setThread]   = useState(null);
  const [comments, setComments] = useState([]);

  // The effective highlight ID: explicit prop, or the comment targetId itself
  const effectiveHighlight = highlightCommentId ?? (mode === "comment" ? targetId : null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "thread") {
        // ── Thread report: load thread directly ──
        const data = await getThreadById(targetId);
        setThread(data.thread);
        setComments(data.comments || []);
      } else {
        // ── Comment report: first fetch the comment to get its parent
        //    thread ID, then load that full thread so the admin sees
        //    the whole conversation with the flagged comment highlighted.
        const commentData = await getCommentById(targetId);
        const parentThreadId = commentData.thread?._id;

        if (!parentThreadId) {
          throw new Error("Could not resolve the parent thread for this comment.");
        }

        const threadData = await getThreadById(parentThreadId);
        setThread(threadData.thread);
        setComments(threadData.comments || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [mode, targetId]);

  useEffect(() => { load(); }, [load]);

  // Auto-scroll to highlighted comment
  useEffect(() => {
    if (!loading && effectiveHighlight) {
      setTimeout(() => {
        const el = document.getElementById(`comment-${effectiveHighlight}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [loading, effectiveHighlight]);

  const handleAction = async (actionFn) => {
    setActionLoading(true);
    setError("");
    try {
      await actionFn();
      await load();
      onActionDone?.();
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="relative flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-gray-50 shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "thread" ? "Thread Review" : "Comment Review"}
            </h2>
            <p className="text-xs text-gray-500">
              {mode === "comment"
                ? "Full thread — reported comment is highlighted"
                : "Full conversation — all replies visible"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="shrink-0 mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" size={28} />
            </div>
          ) : (
            // Both modes now render the full ThreadView.
            // For comment reports, effectiveHighlight points to the flagged comment.
            <ThreadView
              thread={thread}
              comments={comments}
              highlightId={effectiveHighlight}
              onAction={handleAction}
              actionLoading={actionLoading}
            />
          )}
        </div>

        {/* ── Loading footer ── */}
        {actionLoading && (
          <div className="shrink-0 flex items-center justify-center gap-2 border-t border-gray-200 bg-white py-3 text-sm text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            Applying action…
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Thread View (inside modal)
───────────────────────────────────────── */
function ThreadView({ thread, comments, highlightId, onAction, actionLoading }) {
  if (!thread) return null;

  return (
    <div className="space-y-4">
      {/* Thread post */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <StatusBadge item={thread} type="thread" />
          {thread.isLocked && !thread.isDeleted && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              <Lock size={10} /> Locked
            </span>
          )}
          {thread.reportsCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
              <Flag size={10} /> {thread.reportsCount} report{thread.reportsCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{thread.title}</h3>
        {thread.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {thread.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User size={11} />
            {thread.author?.name || thread.author?.email || "Unknown"}
          </span>
          <span>{formatDate(thread.createdAt)}</span>
          <span className="flex items-center gap-1">
            <MessageSquare size={11} />
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
          {thread.content}
        </p>

        {thread.reports?.length > 0 && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 space-y-1">
            <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
              <AlertTriangle size={11} /> Reports on this thread
            </p>
            {thread.reports.map((r) => (
              <p key={r._id} className="text-xs text-red-600">
                <span className="font-medium">{r.user?.name || r.user?.email || "User"}</span>
                {" — "}
                {r.reason}
              </p>
            ))}
          </div>
        )}

        {!thread.isDeleted && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            {thread.isLocked ? (
              <button
                disabled={actionLoading}
                onClick={() => onAction(() => unlockThread(thread._id))}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                <Unlock size={14} /> Unlock Thread
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={() => onAction(() => lockThread(thread._id))}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                <Lock size={14} /> Lock Thread
              </button>
            )}
            <button
              disabled={actionLoading}
              onClick={() => onAction(() => deleteThread(thread._id))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete Thread
            </button>
          </div>
        )}
      </div>

      {/* Comments */}
      {comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No comments yet.</p>
      ) : (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </p>
          {comments.map((c) => (
            <CommentCard
              key={c._id}
              comment={c}
              depth={0}
              highlightId={highlightId}
              onAction={onAction}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}