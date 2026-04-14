// import { useEffect, useRef, useState } from "react";   ///importing the necessary hooks from the react 
// import {
//   addComment,
//   deleteComment,
//   vote as apiVote,
//   report as apiReport,
//   updateComment,
// } from "../../services/forumAPI";

// const MAX_DEPTH = 3; ///setting the maximum depth for nested comments to 3

// const avatarColors = [ ///defin
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
//     comment.author?.username || (isOwner ? currentUser?.username : null) || "?"; ///

//   const avatarInitial = (displayUsername?.[0] || "?").toUpperCase(); ///takes the first character of the display username, converts it to uppercase, and uses it as the avatar initial. If displayUsername is empty or undefined, it defaults to "?".
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
//       // window.location.reload();
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Failed to post reply");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const saveEdit = async () => {
//     const trimmed = editText.trim();
//     if (!trimmed || busy) return;

//     try {
//       setBusy(true);

//       if (typeof onEdit === "function") {
//         const result = await onEdit(comment._id, trimmed);
//         setDisplayContent(
//           result?.comment?.content ?? result?.content ?? trimmed
//         );
//       } else {
//         const updated = await updateComment(comment._id, trimmed);
//         setDisplayContent(
//           updated?.comment?.content ?? updated?.content ?? trimmed
//         );
//       }

//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       alert(err?.message || "Failed to update comment");
//     } finally {
//       setBusy(false);
//     }
//   };

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
import { Heart, CornerDownLeft, ChevronDown, ChevronRight, Pencil, Trash2, Flag } from "lucide-react";

const sans = { fontFamily: "'DM Sans', sans-serif" };
const serif = { fontFamily: "'Cormorant Garamond', serif" };

const MAX_DEPTH = 3;

/* ── Avatar palette — earthy tones matching Mendho ── */
const AVATAR_PALETTE = [
  "bg-[#2d4a2d]",   // forest
  "bg-[#7a9e7e]",   // sage
  "bg-[#c4704a]",   // terracotta
  "bg-[#4a6741]",   // mid-green
  "bg-[#8c6a4a]",   // warm brown
  "bg-[#5a7a5a]",   // muted green
  "bg-[#b56a40]",   // deep terracotta
  "bg-[#3a5a3a]",   // deep forest
];

/* ── Small action button ── */
function ActionBtn({ onClick, icon, label, active, danger, muted }) {
  const base = "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] tracking-[0.05em] font-medium transition-all duration-150 border border-transparent";
  const variant = danger
    ? "text-[#c4704a] hover:text-[#b5603a] hover:bg-[#c4704a]/8 hover:border-[#c4704a]/20"
    : active
    ? "text-[#c4704a] cursor-default"
    : "text-[#8c8880] hover:text-[#2d4a2d] hover:bg-[#2d4a2d]/6 hover:border-[#2d4a2d]/10";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
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
const textareaClass = "w-full bg-[#fdfcf8] border border-[#2d4a2d]/20 rounded-sm px-3.5 py-2.5 text-[13px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] resize-none transition-colors duration-200 leading-relaxed";

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
  const ownerId       = getOwnerId(comment.author);
  const isOwner       = Boolean(currentUserId && ownerId && ownerId === currentUserId);

  const displayUsername =
    comment.author?.username || (isOwner ? currentUser?.username : null) || "?";

  const avatarInitial = (displayUsername?.[0] || "?").toUpperCase();
  const avatarColor   = AVATAR_PALETTE[avatarInitial.charCodeAt(0) % AVATAR_PALETTE.length];

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText]       = useState("");
  const [isEditing, setIsEditing]       = useState(false);
  const [editText, setEditText]         = useState(comment.content || "");
  const [displayContent, setDisplayContent] = useState(comment.content || "");
  const [voted, setVoted]               = useState(false);
  const [collapsed, setCollapsed]       = useState(false);
  const [busy, setBusy]                 = useState(false);
  const [isDeleted, setIsDeleted]       = useState(false);

  const replyRef   = useRef(null);
  const editRef    = useRef(null);
  const editBoxRef = useRef(null);

  const canReply = depth < MAX_DEPTH;
  const replies  = typeof getReplies === "function"
    ? getReplies(comment._id)
    : comment.replies || [];

  useEffect(() => { if (showReplyBox) replyRef.current?.focus(); }, [showReplyBox]);
  useEffect(() => { if (isEditing)    editRef.current?.focus();  }, [isEditing]);

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
  const cancelEdit  = () => { setEditText(comment.content || ""); setIsEditing(false); };

  const submitReply = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || busy) return;
    try {
      setBusy(true);
      if (typeof onReply === "function") {
        await onReply(comment._id, trimmed, () => { setReplyText(""); setShowReplyBox(false); });
        return;
      }
      if (!threadId) { alert("Missing thread id"); return; }
      await addComment(threadId, trimmed, comment._id);
      cancelReply();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to post reply");
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
      alert(err?.message || "Failed to update comment");
    } finally { setBusy(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?") || busy) return;
    try {
      setBusy(true);
      if (typeof onDelete === "function") { await onDelete(comment._id); setIsDeleted(true); return; }
      await deleteComment(comment._id);
      setIsDeleted(true);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally { setBusy(false); }
  };

  const handleVote = async () => {
    if (voted || busy) return;
    setVoted(true);
    try {
      setBusy(true);
      if (typeof onVote === "function") { await onVote("comment", comment._id, 1); return; }
      await apiVote("comment", comment._id, 1);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setVoted(false);
      alert(err?.message || "Voting failed");
    } finally { setBusy(false); }
  };

  const handleReport = async () => {
    if (busy) return;
    try {
      if (typeof onReport === "function") { await onReport(comment._id); return; }
      const reason = window.prompt("Why are you reporting this comment?");
      if (reason === null) return;
      const trimmed = reason.trim();
      if (!trimmed) { alert("Please provide a reason."); return; }
      setBusy(true);
      await apiReport({ targetType: "comment", targetId: comment._id, reason: trimmed });
      alert("Reported. Moderators will review.");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Report failed");
    } finally { setBusy(false); }
  };

  if (isDeleted) return null;

  const timeAgo = (() => {
    const diff = Date.now() - new Date(comment.createdAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  return (
    <div className="relative" style={sans}>
      {/* Thread line */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2d4a2d]/10" />
      )}

      <div className={`flex gap-3 py-5 ${depth > 0 ? "pl-5" : ""}`}>

        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center flex-shrink-0`}
            style={serif}
          >
            {avatarInitial}
          </div>
          {/* vertical connector line when there are replies */}
          {!collapsed && replies.length > 0 && (
            <div className="w-px flex-1 bg-[#2d4a2d]/10 min-h-[12px]" />
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">

          {/* Header row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[13px] font-medium text-[#1a3320]">
              {displayUsername}
            </span>
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

            {/* Upvote */}
            <ActionBtn
              onClick={handleVote}
              icon={<Heart size={11} className={voted ? "fill-[#c4704a]" : ""} />}
              label={String(comment.score ?? 0)}
              active={voted}
            />

            {/* Reply */}
            {canReply && (
              <ActionBtn
                onClick={() => setShowReplyBox((s) => !s)}
                icon={<CornerDownLeft size={11} />}
                label="Reply"
              />
            )}

            {/* Collapse */}
            {replies.length > 0 && (
              <ActionBtn
                onClick={() => setCollapsed((c) => !c)}
                icon={collapsed
                  ? <ChevronRight size={11} />
                  : <ChevronDown size={11} />
                }
                label={collapsed ? `Show ${replies.length}` : "Collapse"}
              />
            )}

            {/* Owner actions */}
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
    </div>
  );
}