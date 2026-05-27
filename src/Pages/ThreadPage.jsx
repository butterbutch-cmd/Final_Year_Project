// ///file: src/Pages/ThreadPage.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState, useCallback } from "react";
// import { jwtDecode } from "jwt-decode";
// import { getThreadById, addComment } from "../services/forumAPI";
// import { fetchNotifications } from "../services/notificationAPI";
// import CommentCard from "../Components/Forum/CommentCard";
// import Header from "../Components/Header/Header";
// import { ArrowLeft, MessageSquare, Heart, Send } from "lucide-react";
// import {
//   connectSocket,
//   disconnectSocket,
//   joinThreadRoom,
//   leaveThreadRoom,
//   onCommentCreated,
//   offCommentCreated,
// } from "../services/websocketfileapi";
// import toast from "react-hot-toast";

// const serif = { fontFamily: "'Cormorant Garamond', serif" };
// const sans  = { fontFamily: "'DM Sans', sans-serif" };

// const AVATAR_PALETTE = [
//   "bg-[#2d4a2d]", "bg-[#7a9e7e]", "bg-[#c4704a]",
//   "bg-[#4a6741]", "bg-[#8c6a4a]", "bg-[#5a7a5a]",
//   "bg-[#b56a40]", "bg-[#3a5a3a]",
// ];

// const getAvatarColor = (name) =>
//   AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

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
//   return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
// };

// export default function ThreadPage() {
//   const params   = useParams();
//   const threadId = params.threadId || params.threadid || params.id;
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   let currentUser = null;
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       currentUser = { _id: decoded._id, username: decoded.username };
//     } catch (err) { console.error("Invalid token", err); }
//   }

//   const [thread, setThread]       = useState(null);
//   const [comments, setComments]   = useState([]);
//   const [loading, setLoading]     = useState(false);
//   const [error, setError]         = useState("");
//   const [newComment, setNewComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const getReplies = useCallback(
//     (commentId) => comments.filter((c) => {
//       const parent = c.parentComment;
//       if (!parent) return false;
//       const parentId = typeof parent === "object" ? parent._id ?? parent.id : parent;
//       return String(parentId) === String(commentId);
//     }),
//     [comments]
//   );

//   const reloadThread = async () => {
//     try {
//       const data = await getThreadById(threadId);
//       setThread(data.thread);
//       setComments(data.comments || []);
//     } catch (err) { console.error("Failed to reload thread:", err); }
//   };

//   useEffect(() => {
//     if (!threadId) { setError("Missing thread id in URL."); return; }
//     let mounted = true;

//     const loadAndConnect = async () => {
//       try {
//         setLoading(true);
//         await reloadThread();
//         connectSocket();
//         joinThreadRoom(threadId);

//         onCommentCreated((payload) => {
//           try {
//             if (!payload) return;
//             if (String(payload.threadId) !== String(threadId)) return;
//             const incoming = payload.comment;
//             if (!incoming?._id) return;
//             setComments((prev) => {
//               if (prev.some((c) => String(c._id) === String(incoming._id))) return prev;
//               return [...prev, incoming];
//             });
//           } catch (e) { console.error("Error handling incoming comment:", e); }
//         });
//       } catch (err) {
//         console.error("Failed to load thread:", err);
//         if (mounted) setError(err.message || "Failed to load thread");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadAndConnect();

//     return () => {
//       mounted = false;
//       offCommentCreated();
//       try { leaveThreadRoom(threadId); } catch (e) {}
//       disconnectSocket();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [threadId]);

//   const handleSubmitComment = async () => {
//     if (!newComment.trim()) return;
//     try {
//       setSubmitting(true);
//       await addComment(threadId, newComment);
//       toast.success("Comment posted successfully.");
//       setNewComment("");
//       await reloadThread();
//     } catch (err) { toast.error(err.message || "Failed to post comment"); }
//     finally { setSubmitting(false); }
//   };

//   const handleReply = async (parentId, content, clearCallback) => {
//     try {
//       await addComment(threadId, content, parentId);
//       if (typeof clearCallback === "function") clearCallback();
//       await reloadThread();
//     } catch (err) { toast.error(err.message || "Failed to post reply"); }
//   };

//   const handleDelete = async (commentId) => {
//     try {
//       const { deleteComment } = await import("../services/forumAPI");
//       await deleteComment(commentId);
//       await reloadThread();
//     } catch (err) { toast.error(err.message || "Failed to delete comment"); }
//   };

//   /* ── Loading ── */
//   if (loading) return (
//     <div className="min-h-screen bg-[#fdfcf8]">
//       <Header />
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <span className="text-2xl text-[#7a9e7e] animate-spin" style={{ animationDuration: "3s" }}>✦</span>
//         <p className="text-[12px] tracking-[0.15em] uppercase text-[#8c8880]" style={sans}>Loading thread…</p>
//       </div>
//     </div>
//   );

//   /* ── Error ── */
//   if (error) return (
//     <div className="min-h-screen bg-[#fdfcf8]">
//       <Header />
//       <div className="max-w-[760px] mx-auto px-6 lg:px-14 py-16">
//         <div className="flex items-center gap-2.5 bg-[#c4704a]/8 border border-[#c4704a]/20 rounded-sm px-5 py-4 mb-6">
//           <span className="text-[#c4704a]">⚠</span>
//           <p className="text-[13px] text-[#c4704a] m-0" style={sans}>{error}</p>
//         </div>
//         <button
//           onClick={() => navigate("/forum")}
//           className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#2d4a2d] bg-transparent border-none cursor-pointer p-0 hover:text-[#1a3320] transition-colors"
//           style={sans}
//         >
//           <ArrowLeft size={13} /> Back to Forum
//         </button>
//       </div>
//     </div>
//   );

//   /* ── Not found ── */
//   if (!thread) return (
//     <div className="min-h-screen bg-[#fdfcf8]">
//       <Header />
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <p className="text-[13px] font-light text-[#8c8880]" style={sans}>Thread not found.</p>
//       </div>
//     </div>
//   );

//   const authorName  = thread.author?.username || "Anonymous";
//   const topComments = comments.filter((c) => !c.parentComment);

//   return (
//     <div className="min-h-screen bg-[#fdfcf8]">
//       <Header />

//       {/* ── Page header ── */}
//       <div className="border-b border-[#2d4a2d]/10 px-6 lg:px-14 py-8 bg-[#fdfcf8]">
//         <div className="max-w-[860px] mx-auto">

//           {/* Back */}
//           <button
//             onClick={() => navigate("/forum")}
//             className="inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.08em] uppercase text-[#8c8880] bg-transparent border-none cursor-pointer p-0 mb-6 hover:text-[#2d4a2d] transition-colors"
//             style={sans}
//           >
//             <ArrowLeft size={12} /> Forum
//           </button>

//           {/* Thread meta */}
//           <div className="flex items-center gap-3 mb-4 flex-wrap">
//             {thread.category && (
//               <span
//                 className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2d4a2d] bg-[#2d4a2d]/8 border border-[#2d4a2d]/12 px-2.5 py-1 rounded-sm tracking-[0.05em]"
//                 style={sans}
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-[#7a9e7e]" />
//                 {thread.category}
//               </span>
//             )}
//             {thread.tags?.map((tag) => (
//               <span
//                 key={tag}
//                 className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-[#2d4a2d]/6 text-[#2d4a2d] border border-[#2d4a2d]/10 tracking-[0.05em]"
//                 style={sans}
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Title */}
//           <h1
//             className="font-light text-[#1a3320] m-0 mb-5 leading-tight"
//             style={{ ...serif, fontSize: "clamp(28px, 4vw, 44px)" }}
//           >
//             {thread.title}
//           </h1>

//           {/* Author row */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <div
//               className={`w-8 h-8 rounded-full ${getAvatarColor(authorName)} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center flex-shrink-0`}
//               style={serif}
//             >
//               {authorName[0].toUpperCase()}
//             </div>
//             <span className="text-[13px] font-medium text-[#1a3320]" style={sans}>{authorName}</span>
//             <span className="text-[#2d4a2d]/20 text-xs">·</span>
//             <span className="text-[12px] font-light text-[#8c8880]" style={sans}>{timeAgo(thread.createdAt)}</span>
//             <span className="text-[#2d4a2d]/20 text-xs">·</span>
//             <span className="inline-flex items-center gap-1 text-[12px] font-light text-[#8c8880]" style={sans}>
//               <Heart size={11} className="text-[#c4704a]" /> {thread.score ?? 0}
//             </span>
//             <span className="inline-flex items-center gap-1 text-[12px] font-light text-[#8c8880]" style={sans}>
//               <MessageSquare size={11} /> {topComments.length}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ── Main content ── */}
//       <div className="max-w-[860px] mx-auto px-6 lg:px-14 py-10">

//         {/* Thread body */}
//         <div className="bg-[#f7f4ee] border border-[#2d4a2d]/10 rounded-sm px-7 py-6 mb-10">
//           <p
//             className="text-[14.5px] font-light text-[#4a4a4a] leading-relaxed m-0 whitespace-pre-wrap"
//             style={sans}
//           >
//             {thread.content}
//           </p>
//         </div>

//         {/* ── Comment composer ── */}
//         <div className="mb-10">
//           <p className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e7e] mb-3" style={sans}>
//             ✦ Join the conversation
//           </p>

//           <div className="border border-[#2d4a2d]/15 rounded-sm bg-[#fdfcf8] overflow-hidden focus-within:border-[#2d4a2d] transition-colors duration-200">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && e.metaKey) handleSubmitComment();
//               }}
//               placeholder="Share your thoughts…"
//               rows={4}
//               className="w-full bg-transparent border-none outline-none px-5 py-4 text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] resize-none leading-relaxed"
//               style={sans}
//             />
//             <div className="flex items-center justify-between px-5 py-3 border-t border-[#2d4a2d]/10 bg-[#f7f4ee]">
//               <span className="text-[11px] font-light text-[#8c8880]" style={sans}>
//                 ⌘ + Enter to post
//               </span>
//               <button
//                 onClick={handleSubmitComment}
//                 disabled={submitting || !newComment.trim()}
//                 className="inline-flex items-center gap-2 px-5 py-2 bg-[#1a3320] text-[#f7f4ee] text-[11px] font-medium tracking-[0.12em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
//                 style={sans}
//               >
//                 <Send size={12} />
//                 {submitting ? "Posting…" : "Post"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── Comments ── */}
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <p
//               className="text-[11px] tracking-[0.15em] uppercase text-[#8c8880] m-0"
//               style={sans}
//             >
//               {topComments.length} {topComments.length === 1 ? "Comment" : "Comments"}
//             </p>
//             <div className="h-px flex-1 bg-[#2d4a2d]/10 ml-4" />
//           </div>

//           {topComments.length === 0 ? (
//             <div className="py-12 text-center border border-dashed border-[#2d4a2d]/15 rounded-sm">
//               <p className="text-[13px] font-light text-[#8c8880] m-0" style={sans}>
//                 No comments yet — be the first to share your thoughts.
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-[#2d4a2d]/8">
//               {topComments.map((comment) => (
//                 <CommentCard
//                   key={comment._id}
//                   comment={comment}
//                   threadId={threadId}
//                   currentUser={currentUser}
//                   getReplies={getReplies}
//                   onReply={handleReply}
//                   onDelete={handleDelete}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { getThreadById, addComment } from "../services/forumAPI";
import { fetchNotifications } from "../services/notificationAPI";
import CommentCard from "../Components/Forum/CommentCard";
import Header from "../Components/Header/Header";
import { ArrowLeft, MessageSquare, Heart, Send } from "lucide-react";
import {
  connectSocket,
  disconnectSocket,
  joinThreadRoom,
  leaveThreadRoom,
  onCommentCreated,
  offCommentCreated,
  onCommentVoted,       // ← added
  offCommentVoted,      // ← added
} from "../services/websocketfileapi";
import toast from "react-hot-toast";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const AVATAR_PALETTE = [
  "bg-[#2d4a2d]", "bg-[#7a9e7e]", "bg-[#c4704a]",
  "bg-[#4a6741]", "bg-[#8c6a4a]", "bg-[#5a7a5a]",
  "bg-[#b56a40]", "bg-[#3a5a3a]",
];

const getAvatarColor = (name) =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

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
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ThreadPage() {
  const params   = useParams();
  const threadId = params.threadId || params.threadid || params.id;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUser = { _id: decoded._id, username: decoded.username };
    } catch (err) { console.error("Invalid token", err); }
  }

  const [thread, setThread]       = useState(null);
  const [comments, setComments]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getReplies = useCallback(
    (commentId) => comments.filter((c) => {
      const parent = c.parentComment;
      if (!parent) return false;
      const parentId = typeof parent === "object" ? parent._id ?? parent.id : parent;
      return String(parentId) === String(commentId);
    }),
    [comments]
  );

  const reloadThread = async () => {
    try {
      const data = await getThreadById(threadId);
      setThread(data.thread);
      setComments(data.comments || []);
    } catch (err) { console.error("Failed to reload thread:", err); }
  };

  useEffect(() => {
    if (!threadId) { setError("Missing thread id in URL."); return; }
    let mounted = true;

    const loadAndConnect = async () => {
      try {
        setLoading(true);
        await reloadThread();
        connectSocket();
        joinThreadRoom(threadId);

        onCommentCreated((payload) => {
          try {
            if (!payload) return;
            if (String(payload.threadId) !== String(threadId)) return;
            const incoming = payload.comment;
            if (!incoming?._id) return;
            setComments((prev) => {
              if (prev.some((c) => String(c._id) === String(incoming._id))) return prev;
              return [...prev, incoming];
            });
          } catch (e) { console.error("Error handling incoming comment:", e); }
        });

        // ── NEW: listen for vote updates ──
        onCommentVoted((payload) => {
          // payload: { commentId, newScore }
          if (!payload?.commentId) return;
          setComments((prev) =>
            prev.map((c) =>
              String(c._id) === String(payload.commentId)
                ? { ...c, score: payload.newScore }
                : c
            )
          );
        });
      } catch (err) {
        console.error("Failed to load thread:", err);
        if (mounted) setError(err.message || "Failed to load thread");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAndConnect();

    return () => {
      mounted = false;
      offCommentCreated();
      offCommentVoted();      // ← add
      try { leaveThreadRoom(threadId); } catch (e) {}
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmitting(true);
      await addComment(threadId, newComment);
      toast.success("Comment posted successfully.");
      setNewComment("");
      await reloadThread();
    } catch (err) { toast.error(err.message || "Failed to post comment"); }
    finally { setSubmitting(false); }
  };

  const handleReply = async (parentId, content, clearCallback) => {
    try {
      await addComment(threadId, content, parentId);
      if (typeof clearCallback === "function") clearCallback();
      await reloadThread();
    } catch (err) { toast.error(err.message || "Failed to post reply"); }
  };

  const handleDelete = async (commentId) => {
    try {
      const { deleteComment } = await import("../services/forumAPI");
      await deleteComment(commentId);
      await reloadThread();
    } catch (err) { toast.error(err.message || "Failed to delete comment"); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-2xl text-[#7a9e7e] animate-spin" style={{ animationDuration: "3s" }}>✦</span>
        <p className="text-[12px] tracking-[0.15em] uppercase text-[#8c8880]" style={sans}>Loading thread…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <Header />
      <div className="max-w-[760px] mx-auto px-6 lg:px-14 py-16">
        <div className="flex items-center gap-2.5 bg-[#c4704a]/8 border border-[#c4704a]/20 rounded-sm px-5 py-4 mb-6">
          <span className="text-[#c4704a]">⚠</span>
          <p className="text-[13px] text-[#c4704a] m-0" style={sans}>{error}</p>
        </div>
        <button
          onClick={() => navigate("/forum")}
          className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#2d4a2d] bg-transparent border-none cursor-pointer p-0 hover:text-[#1a3320] transition-colors"
          style={sans}
        >
          <ArrowLeft size={13} /> Back to Forum
        </button>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (!thread) return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[13px] font-light text-[#8c8880]" style={sans}>Thread not found.</p>
      </div>
    </div>
  );

  const authorName  = thread.author?.username || "Anonymous";
  const topComments = comments.filter((c) => !c.parentComment);

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <Header />

      {/* ── Page header ── */}
      <div className="border-b border-[#2d4a2d]/10 px-6 lg:px-14 py-8 bg-[#fdfcf8]">
        <div className="max-w-[860px] mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate("/forum")}
            className="inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.08em] uppercase text-[#8c8880] bg-transparent border-none cursor-pointer p-0 mb-6 hover:text-[#2d4a2d] transition-colors"
            style={sans}
          >
            <ArrowLeft size={12} /> Forum
          </button>

          {/* Thread meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {thread.category && (
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2d4a2d] bg-[#2d4a2d]/8 border border-[#2d4a2d]/12 px-2.5 py-1 rounded-sm tracking-[0.05em]"
                style={sans}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7a9e7e]" />
                {thread.category}
              </span>
            )}
            {thread.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-[#2d4a2d]/6 text-[#2d4a2d] border border-[#2d4a2d]/10 tracking-[0.05em]"
                style={sans}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            className="font-light text-[#1a3320] m-0 mb-5 leading-tight"
            style={{ ...serif, fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            {thread.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`w-8 h-8 rounded-full ${getAvatarColor(authorName)} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center flex-shrink-0`}
              style={serif}
            >
              {authorName[0].toUpperCase()}
            </div>
            <span className="text-[13px] font-medium text-[#1a3320]" style={sans}>{authorName}</span>
            <span className="text-[#2d4a2d]/20 text-xs">·</span>
            <span className="text-[12px] font-light text-[#8c8880]" style={sans}>{timeAgo(thread.createdAt)}</span>
            <span className="text-[#2d4a2d]/20 text-xs">·</span>
            <span className="inline-flex items-center gap-1 text-[12px] font-light text-[#8c8880]" style={sans}>
              <Heart size={11} className="text-[#c4704a]" /> {thread.score ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-light text-[#8c8880]" style={sans}>
              <MessageSquare size={11} /> {topComments.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[860px] mx-auto px-6 lg:px-14 py-10">

        {/* Thread body */}
        <div className="bg-[#f7f4ee] border border-[#2d4a2d]/10 rounded-sm px-7 py-6 mb-10">
          <p
            className="text-[14.5px] font-light text-[#4a4a4a] leading-relaxed m-0 whitespace-pre-wrap"
            style={sans}
          >
            {thread.content}
          </p>
        </div>

        {/* ── Comment composer ── */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e7e] mb-3" style={sans}>
            ✦ Join the conversation
          </p>

          <div className="border border-[#2d4a2d]/15 rounded-sm bg-[#fdfcf8] overflow-hidden focus-within:border-[#2d4a2d] transition-colors duration-200">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleSubmitComment();
              }}
              placeholder="Share your thoughts…"
              rows={4}
              className="w-full bg-transparent border-none outline-none px-5 py-4 text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] resize-none leading-relaxed"
              style={sans}
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#2d4a2d]/10 bg-[#f7f4ee]">
              <span className="text-[11px] font-light text-[#8c8880]" style={sans}>
                ⌘ + Enter to post
              </span>
              <button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#1a3320] text-[#f7f4ee] text-[11px] font-medium tracking-[0.12em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                style={sans}
              >
                <Send size={12} />
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Comments ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p
              className="text-[11px] tracking-[0.15em] uppercase text-[#8c8880] m-0"
              style={sans}
            >
              {topComments.length} {topComments.length === 1 ? "Comment" : "Comments"}
            </p>
            <div className="h-px flex-1 bg-[#2d4a2d]/10 ml-4" />
          </div>

          {topComments.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#2d4a2d]/15 rounded-sm">
              <p className="text-[13px] font-light text-[#8c8880] m-0" style={sans}>
                No comments yet — be the first to share your thoughts.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#2d4a2d]/8">
              {topComments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  threadId={threadId}
                  currentUser={currentUser}
                  getReplies={getReplies}
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}