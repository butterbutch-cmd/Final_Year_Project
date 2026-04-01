// // import { useState, useEffect, useRef } from "react";
// // import {
// //   addComment,
// //   deleteComment,
// //   vote as apiVote,
// //   report as apiReport,
// //   updateComment,
// // } from "../../services/forumAPI";

// // const MAX_DEPTH = 3;

// // const avatarColors = [
// //   "bg-teal-600",
// //   "bg-purple-500",
// //   "bg-orange-400",
// //   "bg-pink-500",
// //   "bg-blue-500",
// //   "bg-green-600",
// //   "bg-red-500",
// //   "bg-indigo-500",
// //   "bg-yellow-500",
// // ];

// // function ActionButton({ onClick, icon, label, className = "" }) {
// //   return (
// //     <button
// //       onClick={(e) => {
// //         e.stopPropagation();
// //         onClick?.(e);
// //       }}
// //       className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium transition-all duration-150 ${className}`}
// //     >
// //       {icon && <span className="leading-none">{icon}</span>}
// //       {label}
// //     </button>
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

// //   const isOwner = currentUser && getOwnerId(comment.author) === currentUser._id;

// //   const displayUsername =
// //     comment.author?.username || (isOwner ? currentUser?.username : null) || "?";

// //   const colorIndex = (displayUsername.charCodeAt(0) || 0) % avatarColors.length;
// //   const avatarColor = avatarColors[colorIndex];

// //   const [showReplyBox, setShowReplyBox] = useState(false);
// //   const [replyText, setReplyText] = useState("");

// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editText, setEditText] = useState(comment.content || "");
// //   const [displayContent, setDisplayContent] = useState(comment.content || "");

// //   const [voted, setVoted] = useState(false);
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [busy, setBusy] = useState(false);
// //   const [isDeleted, setIsDeleted] = useState(false);

// //   const replyRef = useRef(null);
// //   const editRef = useRef(null);
// //   const editBoxRef = useRef(null);

// //   const canReply = depth < MAX_DEPTH;

// //   useEffect(() => {
// //     if (showReplyBox && replyRef.current) replyRef.current.focus();
// //   }, [showReplyBox]);

// //   useEffect(() => {
// //     if (isEditing && editRef.current) editRef.current.focus();
// //   }, [isEditing]);

// //   useEffect(() => {
// //     setDisplayContent(comment.content || "");
// //     setEditText(comment.content || "");
// //   }, [comment.content]);

// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (
// //         isEditing &&
// //         editBoxRef.current &&
// //         !editBoxRef.current.contains(e.target)
// //       ) {
// //         cancelEdit();
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isEditing, editText]);

// //   const replies =
// //     typeof getReplies === "function" ? getReplies(comment._id) : comment.replies || [];

// //   /* ---------- Reply ---------- */
// //   const submitReply = async () => {
// //     if (!replyText.trim() || busy) return;

// //     if (typeof onReply === "function") {
// //       await onReply(comment._id, replyText, () => {
// //         setReplyText("");
// //         setShowReplyBox(false);
// //       });
// //       return;
// //     }

// //     if (!threadId) return alert("Missing thread id");

// //     try {
// //       setBusy(true);
// //       await addComment(threadId, replyText, comment._id);
// //       setReplyText("");
// //       setShowReplyBox(false);
// //       window.location.reload();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to post reply");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   /* ---------- Edit ---------- */
// //   const saveEdit = async () => {
// //     const trimmed = editText.trim();
// //     if (!trimmed || busy) return;

// //     try {
// //       setBusy(true);

// //       if (typeof onEdit === "function") {
// //         const result = await onEdit(comment._id, trimmed);
// //         setDisplayContent(result?.content ?? trimmed);
// //       } else {
// //         const updated = await updateComment(comment._id, trimmed);
// //         setDisplayContent(updated?.content ?? trimmed);
// //       }

// //       setIsEditing(false);
// //     } catch (err) {
// //       console.error(err);
// //       alert(err?.message || "Failed to update comment");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   const cancelEdit = () => {
// //     setEditText(comment.content || "");
// //     setIsEditing(false);
// //   };

// //   /* ---------- Delete ---------- */
// //   const handleDelete = async () => {
// //     if (!window.confirm("Delete this comment?") || busy) return;

// //     if (typeof onDelete === "function") {
// //       await onDelete(comment._id);
// //       setIsDeleted(true);
// //       return;
// //     }

// //     try {
// //       setBusy(true);
// //       await deleteComment(comment._id);
// //       setIsDeleted(true);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Delete failed");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   /* ---------- Vote ---------- */
// //   const handleVote = async () => {
// //     if (voted || busy) return;

// //     setVoted(true);

// //     if (typeof onVote === "function") {
// //       onVote("comment", comment._id, 1);
// //       return;
// //     }

// //     try {
// //       setBusy(true);
// //       await apiVote("comment", comment._id, 1);
// //       window.location.reload();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Voting failed");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   /* ---------- Report ---------- */
// //   const handleReport = async () => {
// //     if (busy) return;

// //     if (typeof onReport === "function") {
// //       await onReport(comment._id);
// //       return;
// //     }

// //     const reason = window.prompt("Why are you reporting this comment?");
// //     if (reason === null) return;

// //     try {
// //       setBusy(true);
// //       await apiReport({
// //         targetType: "comment",
// //         targetId: comment._id,
// //         reason,
// //       });
// //       alert("Reported. Moderators will review.");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Report failed");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   if (isDeleted) return null;

// //   return (
// //     <div className="group relative">
// //       {depth > 0 && (
// //         <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-200" />
// //       )}

// //       <div className={`flex gap-3 py-4 ${depth > 0 ? "pl-4" : ""}`}>
// //         {/* Avatar */}
// //         <div className="flex-shrink-0">
// //           <div
// //             className={`w-8 h-8 rounded-full ${avatarColor} text-white text-[12px] font-bold flex items-center justify-center`}
// //           >
// //             {displayUsername[0]?.toUpperCase()}
// //           </div>
// //         </div>

// //         <div className="flex-1">
// //           {/* Header */}
// //           <div className="flex items-center gap-2 mb-2">
// //             <span className="text-[13px] font-semibold">{displayUsername}</span>

// //             {isOwner && (
// //               <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
// //                 you
// //               </span>
// //             )}
// //           </div>

// //           {/* Content / Edit textarea */}
// //           {!isEditing ? (
// //             <p className="text-[14px] text-stone-600 mb-3">{displayContent}</p>
// //           ) : (
// //             <div className="mb-3" ref={editBoxRef}>
// //               <textarea
// //                 ref={editRef}
// //                 value={editText}
// //                 onChange={(e) => setEditText(e.target.value)}
// //                 onKeyDown={(e) => {
// //                   if (e.key === "Enter" && !e.shiftKey) {
// //                     e.preventDefault();
// //                     saveEdit();
// //                   }
// //                   if (e.key === "Escape") {
// //                     e.preventDefault();
// //                     cancelEdit();
// //                   }
// //                 }}
// //                 className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
// //                 rows={3}
// //               />
// //               <div className="flex gap-2 mt-2">
// //                 <button
// //                   onClick={saveEdit}
// //                   disabled={busy}
// //                   className={`px-3 py-1 rounded text-sm transition-colors ${
// //                     busy
// //                       ? "bg-green-400 cursor-not-allowed text-white"
// //                       : "bg-green-600 hover:bg-green-700 text-white"
// //                   }`}
// //                 >
// //                   {busy ? "Saving..." : "Save"}
// //                 </button>
// //                 <button
// //                   onClick={cancelEdit}
// //                   className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Actions */}
// //           <div className="flex items-center gap-1 flex-wrap">
// //             {/* Vote */}
// //             <ActionButton
// //               onClick={handleVote}
// //               icon="♥"
// //               label={String(comment.score ?? 0)}
// //               className={`transition-colors ${
// //                 voted
// //                   ? "text-rose-500 cursor-default"
// //                   : "text-stone-400 hover:text-rose-500"
// //               }`}
// //             />

// //             {/* Reply */}
// //             {canReply && (
// //               <ActionButton
// //                 onClick={() => setShowReplyBox((s) => !s)}
// //                 icon="↩"
// //                 label="Reply"
// //                 className="text-stone-400 hover:text-stone-600"
// //               />
// //             )}

// //             {/* Collapse / Expand */}
// //             {replies.length > 0 && (
// //               <ActionButton
// //                 onClick={() => setCollapsed((c) => !c)}
// //                 icon={collapsed ? "▶" : "▼"}
// //                 label={collapsed ? "Expand" : "Collapse"}
// //                 className="text-stone-400 hover:text-stone-700"
// //               />
// //             )}

// //             {/* Owner: Edit + Delete | Non-owner: Report */}
// //             {isOwner ? (
// //               <>
// //                 <ActionButton
// //                   onClick={() => {
// //                     setEditText(comment.content || "");
// //                     setIsEditing(true);
// //                   }}
// //                   icon="✏"
// //                   label="Edit"
// //                   className="text-stone-400 hover:text-stone-600 hover:bg-stone-100"
// //                 />
// //                 <ActionButton
// //                   onClick={handleDelete}
// //                   icon="✕"
// //                   label="Delete"
// //                   className="text-red-400 hover:text-red-600 hover:bg-red-50"
// //                 />
// //               </>
// //             ) : (
// //               <ActionButton
// //                 onClick={handleReport}
// //                 icon="⚑"
// //                 label="Report"
// //                 className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
// //               />
// //             )}
// //           </div>

// //           {/* Reply box */}
// //           {showReplyBox && (
// //             <div className="mt-3">
// //               <textarea
// //                 ref={replyRef}
// //                 value={replyText}
// //                 onChange={(e) => setReplyText(e.target.value)}
// //                 placeholder={`Replying to ${displayUsername}…`}
// //                 className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
// //                 rows={3}
// //               />
// //               <div className="flex gap-2 mt-2">
// //                 <button
// //                   onClick={submitReply}
// //                   disabled={busy}
// //                   className={`px-3 py-1 rounded text-sm transition-colors ${
// //                     busy
// //                       ? "bg-green-400 cursor-not-allowed text-white"
// //                       : "bg-green-600 hover:bg-green-700 text-white"
// //                   }`}
// //                 >
// //                   {busy ? "Posting..." : "Post Reply"}
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     setShowReplyBox(false);
// //                     setReplyText("");
// //                   }}
// //                   className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Replies */}
// //           {!collapsed && replies.length > 0 && depth < MAX_DEPTH && (
// //             <div className="mt-3 ml-2 border-l pl-4 space-y-2">
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
// //     </div>
// //   );
// // }


// import { useEffect, useRef, useState } from "react";
// import {
//   addComment,
//   deleteComment,
//   vote as apiVote,
//   report as apiReport,
//   updateComment,
// } from "../../services/forumAPI";

// const MAX_DEPTH = 3;

// const avatarColors = [
//   "bg-teal-600",
//   "bg-purple-500",
//   "bg-orange-400",
//   "bg-pink-500",
//   "bg-blue-500",
//   "bg-green-600",
//   "bg-red-500",
//   "bg-indigo-500",
//   "bg-yellow-500",
// ];

// function ActionButton({ onClick, icon, label, className = "" }) {
//   return (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick?.(e);
//       }}
//       className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium transition-all duration-150 ${className}`}
//       type="button"
//     >
//       {icon && <span className="leading-none">{icon}</span>}
//       {label}
//     </button>
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
//   const colorIndex = avatarInitial.charCodeAt(0) % avatarColors.length;
//   const avatarColor = avatarColors[colorIndex];

//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(comment.content || "");
//   const [displayContent, setDisplayContent] = useState(comment.content || "");

//   const [voted, setVoted] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [isDeleted, setIsDeleted] = useState(false);

//   const replyRef = useRef(null);
//   const editRef = useRef(null);
//   const editBoxRef = useRef(null);

//   const canReply = depth < MAX_DEPTH;

//   useEffect(() => {
//     if (showReplyBox && replyRef.current) replyRef.current.focus();
//   }, [showReplyBox]);

//   useEffect(() => {
//     if (isEditing && editRef.current) editRef.current.focus();
//   }, [isEditing]);

//   useEffect(() => {
//     setDisplayContent(comment.content || "");
//     setEditText(comment.content || "");
//   }, [comment.content]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         isEditing &&
//         editBoxRef.current &&
//         !editBoxRef.current.contains(e.target)
//       ) {
//         cancelEdit();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isEditing]);

//   const replies =
//     typeof getReplies === "function"
//       ? getReplies(comment._id)
//       : comment.replies || [];

//   const cancelReply = () => {
//     setShowReplyBox(false);
//     setReplyText("");
//   };

//   const cancelEdit = () => {
//     setEditText(comment.content || "");
//     setIsEditing(false);
//   };

//   /* ---------- Reply ---------- */
//   const submitReply = async () => {
//     const trimmed = replyText.trim();
//     if (!trimmed || busy) return;

//     try {
//       setBusy(true);

//       if (typeof onReply === "function") {
//         await onReply(comment._id, trimmed, () => {
//           setReplyText("");
//           setShowReplyBox(false);
//         });
//         return;
//       }

//       if (!threadId) {
//         alert("Missing thread id");
//         return;
//       }

//       await addComment(threadId, trimmed, comment._id);
//       cancelReply();
//       window.location.reload();
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Failed to post reply");
//     } finally {
//       setBusy(false);
//     }
//   };

//   /* ---------- Edit ---------- */
//   const saveEdit = async () => {
//     const trimmed = editText.trim();
//     if (!trimmed || busy) return;

//     try {
//       setBusy(true);

//       if (typeof onEdit === "function") {
//         const result = await onEdit(comment._id, trimmed);
//         setDisplayContent(result?.content ?? trimmed);
//       } else {
//         const updated = await updateComment(comment._id, trimmed);
//         setDisplayContent(updated?.content ?? trimmed);
//       }

//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Failed to update comment");
//     } finally {
//       setBusy(false);
//     }
//   };

//   /* ---------- Delete ---------- */
//   const handleDelete = async () => {
//     if (!window.confirm("Delete this comment?") || busy) return;

//     try {
//       setBusy(true);

//       if (typeof onDelete === "function") {
//         await onDelete(comment._id);
//         setIsDeleted(true);
//         return;
//       }

//       await deleteComment(comment._id);
//       setIsDeleted(true);
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Delete failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   /* ---------- Vote ---------- */
//   const handleVote = async () => {
//     if (voted || busy) return;

//     setVoted(true);

//     try {
//       setBusy(true);

//       if (typeof onVote === "function") {
//         await onVote("comment", comment._id, 1);
//         return;
//       }

//       await apiVote("comment", comment._id, 1);
//       window.location.reload();
//     } catch (err) {
//       console.error(err);
//       setVoted(false);
//       alert(err?.message || "Voting failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   /* ---------- Report ---------- */
//   const handleReport = async () => {
//     if (busy) return;

//     try {
//       if (typeof onReport === "function") {
//         await onReport(comment._id);
//         return;
//       }

//       const reason = window.prompt("Why are you reporting this comment?");
//       if (reason === null) return;

//       const trimmed = reason.trim();
//       if (!trimmed) {
//         alert("Please provide a reason.");
//         return;
//       }

//       setBusy(true);
//       await apiReport({
//         targetType: "comment",
//         targetId: comment._id,
//         reason: trimmed,
//       });

//       alert("Reported. Moderators will review.");
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Report failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   if (isDeleted) return null;

//   return (
//     <div className="group relative">
//       {depth > 0 && (
//         <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-200" />
//       )}

//       <div className={`flex gap-3 py-4 ${depth > 0 ? "pl-4" : ""}`}>
//         <div className="flex-shrink-0">
//           <div
//             className={`w-8 h-8 rounded-full ${avatarColor} text-white text-[12px] font-bold flex items-center justify-center`}
//           >
//             {avatarInitial}
//           </div>
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-[13px] font-semibold">{displayUsername}</span>

//             {isOwner && (
//               <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
//                 you
//               </span>
//             )}
//           </div>

//           {!isEditing ? (
//             <p className="text-[14px] text-stone-600 mb-3 whitespace-pre-wrap break-words">
//               {displayContent}
//             </p>
//           ) : (
//             <div className="mb-3" ref={editBoxRef}>
//               <textarea
//                 ref={editRef}
//                 value={editText}
//                 onChange={(e) => setEditText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     saveEdit();
//                   }
//                   if (e.key === "Escape") {
//                     e.preventDefault();
//                     cancelEdit();
//                   }
//                 }}
//                 className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
//                 rows={3}
//               />
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={saveEdit}
//                   disabled={busy}
//                   className={`px-3 py-1 rounded text-sm transition-colors ${
//                     busy
//                       ? "bg-green-400 cursor-not-allowed text-white"
//                       : "bg-green-600 hover:bg-green-700 text-white"
//                   }`}
//                   type="button"
//                 >
//                   {busy ? "Saving..." : "Save"}
//                 </button>
//                 <button
//                   onClick={cancelEdit}
//                   className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
//                   type="button"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="flex items-center gap-1 flex-wrap">
//             <ActionButton
//               onClick={handleVote}
//               icon="♥"
//               label={String(comment.score ?? 0)}
//               className={`transition-colors ${
//                 voted
//                   ? "text-rose-500 cursor-default"
//                   : "text-stone-400 hover:text-rose-500"
//               }`}
//             />

//             {canReply && (
//               <ActionButton
//                 onClick={() => setShowReplyBox((s) => !s)}
//                 icon="↩"
//                 label="Reply"
//                 className="text-stone-400 hover:text-stone-600"
//               />
//             )}

//             {replies.length > 0 && (
//               <ActionButton
//                 onClick={() => setCollapsed((c) => !c)}
//                 icon={collapsed ? "▶" : "▼"}
//                 label={collapsed ? "Expand" : "Collapse"}
//                 className="text-stone-400 hover:text-stone-700"
//               />
//             )}

//             {isOwner ? (
//               <>
//                 <ActionButton
//                   onClick={() => {
//                     setEditText(comment.content || "");
//                     setIsEditing(true);
//                   }}
//                   icon="✏"
//                   label="Edit"
//                   className="text-stone-400 hover:text-stone-600 hover:bg-stone-100"
//                 />
//                 <ActionButton
//                   onClick={handleDelete}
//                   icon="✕"
//                   label="Delete"
//                   className="text-red-400 hover:text-red-600 hover:bg-red-50"
//                 />
//               </>
//             ) : (
//               <ActionButton
//                 onClick={handleReport}
//                 icon="⚑"
//                 label="Report"
//                 className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
//               />
//             )}
//           </div>

//           {showReplyBox && (
//             <div className="mt-3">
//               <textarea
//                 ref={replyRef}
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 placeholder={`Replying to ${displayUsername}…`}
//                 className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
//                 rows={3}
//               />
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={submitReply}
//                   disabled={busy}
//                   className={`px-3 py-1 rounded text-sm transition-colors ${
//                     busy
//                       ? "bg-green-400 cursor-not-allowed text-white"
//                       : "bg-green-600 hover:bg-green-700 text-white"
//                   }`}
//                   type="button"
//                 >
//                   {busy ? "Posting..." : "Post Reply"}
//                 </button>
//                 <button
//                   onClick={cancelReply}
//                   className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
//                   type="button"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//           {!collapsed && replies.length > 0 && depth < MAX_DEPTH && (
//             <div className="mt-3 ml-2 border-l pl-4 space-y-2">
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
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import {
  addComment,
  deleteComment,
  vote as apiVote,
  report as apiReport,
  updateComment,
} from "../../services/forumAPI";

const MAX_DEPTH = 3;

const avatarColors = [
  "bg-teal-600",
  "bg-purple-500",
  "bg-orange-400",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-600",
  "bg-red-500",
  "bg-indigo-500",
  "bg-yellow-500",
];

function ActionButton({ onClick, icon, label, className = "" }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium transition-all duration-150 ${className}`}
      type="button"
    >
      {icon && <span className="leading-none">{icon}</span>}
      {label}
    </button>
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
  const colorIndex = avatarInitial.charCodeAt(0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content || "");
  const [displayContent, setDisplayContent] = useState(comment.content || "");

  const [voted, setVoted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const replyRef = useRef(null);
  const editRef = useRef(null);
  const editBoxRef = useRef(null);

  const canReply = depth < MAX_DEPTH;

  useEffect(() => {
    if (showReplyBox && replyRef.current) replyRef.current.focus();
  }, [showReplyBox]);

  useEffect(() => {
    if (isEditing && editRef.current) editRef.current.focus();
  }, [isEditing]);

  useEffect(() => {
    setDisplayContent(comment.content || "");
    setEditText(comment.content || "");
  }, [comment.content]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isEditing &&
        editBoxRef.current &&
        !editBoxRef.current.contains(e.target)
      ) {
        cancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const replies =
    typeof getReplies === "function"
      ? getReplies(comment._id)
      : comment.replies || [];

  const cancelReply = () => {
    setShowReplyBox(false);
    setReplyText("");
  };

  const cancelEdit = () => {
    setEditText(comment.content || "");
    setIsEditing(false);
  };

  const submitReply = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || busy) return;

    try {
      setBusy(true);

      if (typeof onReply === "function") {
        await onReply(comment._id, trimmed, () => {
          setReplyText("");
          setShowReplyBox(false);
        });
        return;
      }

      if (!threadId) {
        alert("Missing thread id");
        return;
      }

      await addComment(threadId, trimmed, comment._id);
      cancelReply();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to post reply");
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed || busy) return;

    try {
      setBusy(true);

      if (typeof onEdit === "function") {
        const result = await onEdit(comment._id, trimmed);
        setDisplayContent(
          result?.comment?.content ?? result?.content ?? trimmed
        );
      } else {
        const updated = await updateComment(comment._id, trimmed);
        setDisplayContent(
          updated?.comment?.content ?? updated?.content ?? trimmed
        );
      }

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to update comment");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?") || busy) return;

    try {
      setBusy(true);

      if (typeof onDelete === "function") {
        await onDelete(comment._id);
        setIsDeleted(true);
        return;
      }

      await deleteComment(comment._id);
      setIsDeleted(true);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const handleVote = async () => {
    if (voted || busy) return;

    setVoted(true);

    try {
      setBusy(true);

      if (typeof onVote === "function") {
        await onVote("comment", comment._id, 1);
        return;
      }

      await apiVote("comment", comment._id, 1);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setVoted(false);
      alert(err?.message || "Voting failed");
    } finally {
      setBusy(false);
    }
  };

  const handleReport = async () => {
    if (busy) return;

    try {
      if (typeof onReport === "function") {
        await onReport(comment._id);
        return;
      }

      const reason = window.prompt("Why are you reporting this comment?");
      if (reason === null) return;

      const trimmed = reason.trim();
      if (!trimmed) {
        alert("Please provide a reason.");
        return;
      }

      setBusy(true);
      await apiReport({
        targetType: "comment",
        targetId: comment._id,
        reason: trimmed,
      });

      alert("Reported. Moderators will review.");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Report failed");
    } finally {
      setBusy(false);
    }
  };

  if (isDeleted) return null;

  return (
    <div className="group relative">
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-200" />
      )}

      <div className={`flex gap-3 py-4 ${depth > 0 ? "pl-4" : ""}`}>
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-white text-[12px] font-bold flex items-center justify-center`}
          >
            {avatarInitial}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-semibold">{displayUsername}</span>

            {isOwner && (
              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
                you
              </span>
            )}
          </div>

          {!isEditing ? (
            <p className="text-[14px] text-stone-600 mb-3 whitespace-pre-wrap break-words">
              {displayContent}
            </p>
          ) : (
            <div className="mb-3" ref={editBoxRef}>
              <textarea
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    saveEdit();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    cancelEdit();
                  }
                }}
                className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={saveEdit}
                  disabled={busy}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    busy
                      ? "bg-green-400 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  type="button"
                >
                  {busy ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 flex-wrap">
            <ActionButton
              onClick={handleVote}
              icon="♥"
              label={String(comment.score ?? 0)}
              className={`transition-colors ${
                voted
                  ? "text-rose-500 cursor-default"
                  : "text-stone-400 hover:text-rose-500"
              }`}
            />

            {canReply && (
              <ActionButton
                onClick={() => setShowReplyBox((s) => !s)}
                icon="↩"
                label="Reply"
                className="text-stone-400 hover:text-stone-600"
              />
            )}

            {replies.length > 0 && (
              <ActionButton
                onClick={() => setCollapsed((c) => !c)}
                icon={collapsed ? "▶" : "▼"}
                label={collapsed ? "Expand" : "Collapse"}
                className="text-stone-400 hover:text-stone-700"
              />
            )}

            {isOwner ? (
              <>
                <ActionButton
                  onClick={() => {
                    setEditText(comment.content || "");
                    setIsEditing(true);
                  }}
                  icon="✏"
                  label="Edit"
                  className="text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                />
                <ActionButton
                  onClick={handleDelete}
                  icon="✕"
                  label="Delete"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                />
              </>
            ) : (
              <ActionButton
                onClick={handleReport}
                icon="⚑"
                label="Report"
                className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
              />
            )}
          </div>

          {showReplyBox && (
            <div className="mt-3">
              <textarea
                ref={replyRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${displayUsername}…`}
                className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitReply}
                  disabled={busy}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    busy
                      ? "bg-green-400 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  type="button"
                >
                  {busy ? "Posting..." : "Post Reply"}
                </button>
                <button
                  onClick={cancelReply}
                  className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!collapsed && replies.length > 0 && depth < MAX_DEPTH && (
            <div className="mt-3 ml-2 border-l pl-4 space-y-2">
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
    </div>
  );
}