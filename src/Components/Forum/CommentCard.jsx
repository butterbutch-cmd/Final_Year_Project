// import React, { useState, useEffect } from "react";

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

// export default function CommentCard({
//   comment,
//   currentUser,
//   onVote,
//   onDelete,
//   onReply,
//   onEdit,
//   onReport,
//   getReplies,
// }) {
//   const getOwnerId = (author) =>
//     typeof author === "string" ? author : author?._id ?? author?.id ?? null;

//   const isOwner = currentUser && getOwnerId(comment.author) === currentUser._id;
//   const isCurrentUserComment =
//     currentUser && getOwnerId(comment.author) === currentUser._id;

//   const displayUsername =
//     comment.author?.username ||
//     (isCurrentUserComment ? currentUser?.username : null) ||
//     "?";

//   // Debug logs
//   useEffect(() => {
//     console.log("CommentCard rendered for comment ID:", comment._id);
//     console.log("  comment.author:", comment.author);
//     console.log("  currentUser:", currentUser);
//     console.log("  isCurrentUserComment:", isCurrentUserComment);
//     console.log("  displayUsername:", displayUsername);
//   }, [comment, currentUser, isCurrentUserComment, displayUsername]);

//   const colorIndex = (displayUsername.charCodeAt(0) || 0) % avatarColors.length;
//   const avatarColor = avatarColors[colorIndex];

//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(comment.content || "");

//   const replies =
//     typeof getReplies === "function" ? getReplies(comment._id) : comment.replies || [];

//   const submitReply = async () => {
//     if (!replyText.trim()) return;
//     try {
//       await onReply?.(comment._id, replyText, () => {
//         setReplyText("");
//         setShowReplyBox(false);
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const saveEdit = async () => {
//     if (!editText.trim()) return;
//     try {
//       await onEdit?.(comment._id, editText, () => setIsEditing(false));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="mb-4">
//       <div className="flex gap-4 py-5 border-b border-stone-100 last:border-0">
//         {/* Avatar */}
//         <div
//           className={`w-9 h-9 rounded-full ${avatarColor} text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}
//         >
//           {displayUsername[0]?.toUpperCase() || "?"}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-1.5">
//             <span className="text-[13px] font-semibold text-stone-700">
//               {displayUsername}
//             </span>
//             <span className="text-[12px] text-stone-400">just now</span>

//             <div className="ml-auto flex items-center gap-2">
//               {/* ... rest of the component (unchanged) ... */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onVote && onVote("comment", comment._id, 1);
//                 }}
//                 className="flex items-center gap-1 text-[12px] text-stone-400 hover:text-green-600 transition-colors"
//                 title="Upvote"
//               >
//                 ♥ {comment.score ?? 0}
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowReplyBox((s) => !s);
//                 }}
//                 className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors"
//                 title="Reply"
//               >
//                 Reply
//               </button>

//               {isOwner && (
//                 <>
//                   {!isEditing ? (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setIsEditing(true);
//                         setEditText(comment.content);
//                       }}
//                       className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors"
//                       title="Edit comment"
//                     >
//                       Edit
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           saveEdit();
//                         }}
//                         className="text-[12px] text-green-600 font-semibold mr-2"
//                         title="Save edit"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setIsEditing(false);
//                           setEditText(comment.content);
//                         }}
//                         className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors"
//                         title="Cancel edit"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   )}

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDelete && onDelete(comment._id);
//                     }}
//                     className="text-[12px] text-stone-300 hover:text-red-400 transition-colors"
//                     title="Delete comment"
//                   >
//                     Delete
//                   </button>
//                 </>
//               )}

//               {!isOwner && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onReport && onReport(comment._id);
//                   }}
//                   className="text-[12px] text-stone-400 hover:text-amber-600 transition-colors"
//                   title="Report comment"
//                 >
//                   Report
//                 </button>
//               )}
//             </div>
//           </div>

//           {!isEditing ? (
//             <p className="text-[14px] text-stone-600 leading-relaxed mb-3">
//               {comment.content}
//             </p>
//           ) : (
//             <textarea
//               rows={3}
//               className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-[14px] text-stone-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none mb-3"
//               value={editText}
//               onChange={(e) => setEditText(e.target.value)}
//             />
//           )}

//           {showReplyBox && (
//             <div className="mt-2">
//               <textarea
//                 rows={3}
//                 className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-[14px] text-stone-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none mb-2"
//                 placeholder="Write your reply…"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//               />
//               <div className="flex gap-2 justify-end">
//                 <button
//                   onClick={() => {
//                     setShowReplyBox(false);
//                     setReplyText("");
//                   }}
//                   className="px-3 py-1.5 text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={submitReply}
//                   className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold rounded transition-colors"
//                 >
//                   Post Reply
//                 </button>
//               </div>
//             </div>
//           )}

//           {replies && replies.length > 0 && (
//             <div className="mt-4 ml-11 border-l border-stone-100 pl-4">
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
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";

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
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium transition-all duration-150 ${className}`}
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
}) {
  const getOwnerId = (author) =>
    typeof author === "string" ? author : author?._id ?? author?.id ?? null;

  const isOwner = currentUser && getOwnerId(comment.author) === currentUser._id;
  const isCurrentUserComment =
    currentUser && getOwnerId(comment.author) === currentUser._id;

  const displayUsername =
    comment.author?.username ||
    (isCurrentUserComment ? currentUser?.username : null) ||
    "?";

  useEffect(() => {
    console.log("CommentCard rendered for comment ID:", comment._id);
    console.log("  comment.author:", comment.author);
    console.log("  currentUser:", currentUser);
    console.log("  isCurrentUserComment:", isCurrentUserComment);
    console.log("  displayUsername:", displayUsername);
  }, [comment, currentUser, isCurrentUserComment, displayUsername]);

  const colorIndex = (displayUsername.charCodeAt(0) || 0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content || "");
  const [voted, setVoted] = useState(false);
  const replyRef = useRef(null);
  const editRef = useRef(null);

  useEffect(() => {
    if (showReplyBox && replyRef.current) replyRef.current.focus();
  }, [showReplyBox]);

  useEffect(() => {
    if (isEditing && editRef.current) editRef.current.focus();
  }, [isEditing]);

  const replies =
    typeof getReplies === "function" ? getReplies(comment._id) : comment.replies || [];

  const submitReply = async () => {
    if (!replyText.trim()) return;
    try {
      await onReply?.(comment._id, replyText, () => {
        setReplyText("");
        setShowReplyBox(false);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await onEdit?.(comment._id, editText, () => setIsEditing(false));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = () => {
    if (voted) return;
    setVoted(true);
    onVote?.("comment", comment._id, 1);
  };

  return (
    <div className="group relative">
      {/* Thread line for depth > 0 */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-200 group-hover:bg-stone-300 transition-colors" />
      )}

      <div className={`flex gap-3 py-4 ${depth > 0 ? "pl-4" : ""}`}>
        {/* Avatar */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-white text-[12px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm`}
          >
            {displayUsername[0]?.toUpperCase() || "?"}
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[13px] font-semibold text-stone-800 tracking-tight">
              {displayUsername}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">just now</span>
            {isOwner && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                you
              </span>
            )}
          </div>

          {/* Content or Edit */}
          {!isEditing ? (
            <p className="text-[14px] text-stone-600 leading-relaxed mb-3 pr-2">
              {comment.content}
            </p>
          ) : (
            <div className="mb-3">
              <textarea
                ref={editRef}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-[14px] text-stone-800 outline-none transition-all duration-150 focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100 resize-none placeholder-stone-400"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEdit();
                  if (e.key === "Escape") { setIsEditing(false); setEditText(comment.content); }
                }}
              />
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                  className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Save changes
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditText(comment.content); }}
                  className="px-3 py-1.5 text-[12px] text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <span className="text-[11px] text-stone-400 ml-auto">⌘↵ to save · Esc to cancel</span>
              </div>
            </div>
          )}

          {/* Action Row */}
          {!isEditing && (
            <div className="flex items-center gap-0.5 -ml-1.5 mb-1">
              {/* Vote */}
              <ActionButton
                onClick={handleVote}
                icon={<span className={`transition-transform ${voted ? "scale-125" : ""}`}>♥</span>}
                label={String(comment.score ?? 0)}
                className={`${
                  voted
                    ? "text-rose-500 bg-rose-50"
                    : "text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                }`}
              />

              {/* Reply */}
              <ActionButton
                onClick={() => setShowReplyBox((s) => !s)}
                icon="↩"
                label="Reply"
                className={`${
                  showReplyBox
                    ? "text-green-600 bg-green-50"
                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                }`}
              />

              {isOwner && (
                <>
                  <ActionButton
                    onClick={() => { setIsEditing(true); setEditText(comment.content); }}
                    icon="✏"
                    label="Edit"
                    className="text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                  />
                  <ActionButton
                    onClick={() => onDelete?.(comment._id)}
                    icon="✕"
                    label="Delete"
                    className="text-stone-300 hover:text-red-500 hover:bg-red-50"
                  />
                </>
              )}

              {!isOwner && (
                <ActionButton
                  onClick={() => onReport?.(comment._id)}
                  icon="⚑"
                  label="Report"
                  className="text-stone-300 hover:text-amber-500 hover:bg-amber-50"
                />
              )}
            </div>
          )}

          {/* Reply Box */}
          {showReplyBox && (
            <div className="mt-3 mb-2">
              <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden transition-all">
                <textarea
                  ref={replyRef}
                  rows={3}
                  className="w-full px-4 py-3 text-[14px] text-stone-800 bg-transparent outline-none resize-none placeholder-stone-400 leading-relaxed"
                  placeholder={`Replying to ${displayUsername}…`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitReply();
                    if (e.key === "Escape") { setShowReplyBox(false); setReplyText(""); }
                  }}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400">⌘↵ to post · Esc to cancel</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowReplyBox(false); setReplyText(""); }}
                      className="px-3 py-1.5 text-[12px] text-stone-500 hover:text-stone-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitReply}
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {replies && replies.length > 0 && (
            <div className="mt-3 ml-2 space-y-0 border-l-2 border-stone-100 pl-4">
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}