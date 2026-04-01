// pages/ThreadPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { getThreadById, addComment } from "../services/forumAPI";
import CommentCard from "../Components/Forum/CommentCard";

import {
  connectSocket,
  disconnectSocket,
  joinThreadRoom,
  leaveThreadRoom,
  onCommentCreated,
  offCommentCreated,
} from "../services/websocketfileapi";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId || params.threadid || params.id;
  const navigate = useNavigate();

  // ✅ Decode currentUser from JWT once — same pattern as ForumPage.jsx
  const token = localStorage.getItem("token");
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUser = {
        _id: decoded._id,
        username: decoded.username,
      };
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     GET REPLIES FOR COMMENT
  ========================= */
  const getReplies = useCallback(
    (commentId) => {
      return comments.filter((c) => {
        const parent = c.parentComment;
        if (!parent) return false;
        const parentId =
          typeof parent === "object" ? parent._id ?? parent.id : parent;
        return String(parentId) === String(commentId);
      });
    },
    [comments]
  );

  /* =========================
     RELOAD THREAD
  ========================= */
  const reloadThread = async () => {
    try {
      const data = await getThreadById(threadId);
      setThread(data.thread);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to reload thread:", err);
    }
  };

  /* =========================
     INITIAL LOAD + SOCKET
  ========================= */
  useEffect(() => {
    if (!threadId) {
      setError("Missing thread id in URL.");
      return;
    }

    let mounted = true;

    const loadAndConnect = async () => {
      try {
        setLoading(true);
        await reloadThread();

        connectSocket();
        joinThreadRoom(threadId);

        const handleIncoming = (payload) => {
          try {
            if (!payload) return;
            if (String(payload.threadId) !== String(threadId)) return;
            const incoming = payload.comment;
            if (!incoming?._id) return;
            setComments((prev) => {
              if (prev.some((c) => String(c._id) === String(incoming._id)))
                return prev;
              return [...prev, incoming];
            });
          } catch (e) {
            console.error("Error handling incoming comment:", e);
          }
        };

        onCommentCreated(handleIncoming);
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
      try {
        leaveThreadRoom(threadId);
      } catch (e) {}
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  /* =========================
     SUBMIT TOP LEVEL COMMENT
  ========================= */
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmitting(true);
      await addComment(threadId, newComment);
      setNewComment("");
      await reloadThread();
    } catch (err) {
      alert(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     SUBMIT REPLY
  ========================= */
  const handleReply = async (parentId, content, clearCallback) => {
    try {
      await addComment(threadId, content, parentId);
      if (typeof clearCallback === "function") clearCallback();
      await reloadThread();
    } catch (err) {
      alert(err.message || "Failed to post reply");
    }
  };

  /* =========================
     DELETE COMMENT
  ========================= */
  const handleDelete = async (commentId) => {
    try {
      const { deleteComment } = await import("../services/forumAPI");
      await deleteComment(commentId);
      await reloadThread();
    } catch (err) {
      alert(err.message || "Failed to delete comment");
    }
  };

  if (loading) return <p className="p-6">Loading thread…</p>;

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/forum")}
          className="px-4 py-2 bg-stone-100 rounded"
        >
          Back to forum
        </button>
      </div>
    );
  }

  if (!thread) return <p className="p-6">Thread not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/forum")}
        className="text-sm text-stone-500 mb-6"
      >
        ← Back to forum
      </button>

      {/* Thread */}
      <div className="border rounded p-6 mb-6 bg-white">
        <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
        <p className="text-stone-700">{thread.content}</p>
      </div>

      {/* Add Comment */}
      <div className="border rounded p-4 mb-6 bg-stone-50">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full border rounded p-2 mb-3"
        />
        <button
          onClick={handleSubmitComment}
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* COMMENTS */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-stone-500">
            No comments yet. Be the first to comment.
          </p>
        )}

        {comments
          .filter((c) => !c.parentComment)
          .map((comment) => (
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
    </div>
  );
}