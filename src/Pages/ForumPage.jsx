import { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import ThreadRow from "../Components/Forum/ThreadRow";
import CommentCard from "../Components/Forum/CommentCard";
import { jwtDecode } from "jwt-decode";
import {
  createThread,
  getThreads,
  getThreadById,
  addComment,
  vote,
  deleteThread,
  deleteComment,
  editThread,      // frontend helper (or API) – used only for thread editing
  editComment,     // we will assume there is an API for editing comments
} from "../services/forumAPI";

const TABS = ["Latest", "Unread", "Rising", "Most Liked", "Follow Feed"];
const CATEGORIES = ["All Categories", "General", "Plant Care", "Pests & Disease", "Propagation", "Shopping"];
const avatarColors = [
  "bg-teal-600", "bg-purple-500", "bg-orange-400",
  "bg-pink-500", "bg-blue-500", "bg-green-600",
  "bg-red-500", "bg-indigo-500", "bg-yellow-500",
];

export default function ForumPage() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "", tags: "" });
  const [newComment, setNewComment] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Latest");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);

  // local editing state for thread
  const [isEditingThread, setIsEditingThread] = useState(false);
  const [editThreadDraft, setEditThreadDraft] = useState({ title: "", content: "", tags: [] });

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
      console.error("Invalid token");
    }
  }

  /* ========================= HELPERS ========================= */
  const refreshThread = async () => {
    if (!selectedThread) return;
    try {
      const data = await getThreadById(selectedThread._id);
      setSelectedThread(data.thread);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to refresh thread", err);
    }
  };

  /* ========================= LOAD ========================= */
  const loadThreads = async (params = {}) => {
    try {
      setLoading(true);
      const data = await getThreads(params);
      setThreads(Array.isArray(data) ? data : (data.threads || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadThreads(); }, []);

  /* ========================= CREATE ========================= */
  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const tags = newThread.tags
        ? newThread.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      await createThread({ ...newThread, tags });
      setNewThread({ title: "", content: "", tags: "" });
      setShowCreateModal(false);
      loadThreads();
    } catch (err) {
      alert(err.message || "Failed to create thread");
    }
  };

  /* ========================= VIEW ========================= */
  const handleViewThread = async (id) => {
    try {
      const data = await getThreadById(id);
      setSelectedThread(data.thread);
      setComments(data.comments || []);
      setIsEditingThread(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================= COMMENT (root) ========================= */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(selectedThread._id, newComment);
      await refreshThread();               // ← refresh after adding
      setNewComment("");
      loadThreads();                        // update thread list activity
    } catch (err) {
      alert(err.message || "Failed to comment");
    }
  };

  /* ========================= REPLY TO COMMENT ========================= */
  const handleReplyToComment = async (parentId, content, clearCallback) => {
    if (!content || !content.trim()) return;
    try {
      await addComment(selectedThread._id, content, parentId);
      await refreshThread();               // ← refresh after reply
      if (typeof clearCallback === "function") clearCallback();
      loadThreads();
    } catch (err) {
      alert(err.message || "Failed to post reply");
    }
  };

  /* ========================= EDIT COMMENT ========================= */
  // Assume editComment is an API function (adjust if your actual API is named differently)
  const handleEditComment = async (id, newContent, onSuccess) => {
    if (!newContent || !newContent.trim()) return;
    try {
      await editComment(id, newContent);   // API call to update the comment
      await refreshThread();                // ← refresh after edit
      if (typeof onSuccess === "function") onSuccess();
      loadThreads();
    } catch (err) {
      alert("Failed to edit comment");
    }
  };

  /* ========================= VOTE ========================= */
  const handleVote = async (type, id, value) => {
    try {
      await vote(type, id, value);

      // If we are inside a thread, refresh it to get updated scores
      if (selectedThread) {
        await refreshThread();
      }
      // Always refresh thread list scores
      loadThreads();
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================= DELETE ========================= */
  const handleDeleteThread = async () => {
    if (!window.confirm("Delete this thread?")) return;
    try {
      await deleteThread(selectedThread._id);
      setSelectedThread(null);
      loadThreads();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(id);
      await refreshThread();               // ← refresh after delete
      loadThreads();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  /* ========================= EDIT THREAD ========================= */
  const startEditThread = () => {
    setEditThreadDraft({
      title: selectedThread.title || "",
      content: selectedThread.content || "",
      tags: (selectedThread.tags || []).join(", "),
    });
    setIsEditingThread(true);
  };

  const handleSaveThreadEdit = async () => {
    try {
      const tags = editThreadDraft.tags
        ? editThreadDraft.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      // editThread is a frontend helper (or API) – we assume it returns updated thread
      const updated = editThread(threads, selectedThread._id, {
        title: editThreadDraft.title,
        content: editThreadDraft.content,
        tags,
      });
      // Update local state and refresh thread to get latest data
      setSelectedThread((prev) => ({ ...prev, ...updated }));
      setThreads((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setIsEditingThread(false);
      // Optionally refresh from API to ensure consistency
      await refreshThread();
      loadThreads();
    } catch (err) {
      alert(err.message || "Failed to save thread");
    }
  };

  const cancelEditThread = () => {
    setIsEditingThread(false);
  };

  /* ========================= HELPERS ========================= */
  const getAvatarColor = (username, offset = 0) =>
    avatarColors[((username?.charCodeAt(0) || 0) + offset) % avatarColors.length];

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-[14px] text-stone-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none";

  const getReplies = (commentId) =>
    comments.filter((c) => c.parentComment && String(c.parentComment) === String(commentId));

  /* ========================= RENDER ========================= */
  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">

      {/* Top nav & filters (unchanged) */}
      <div className="border-b border-stone-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-xs bg-stone-100 rounded-full px-4 py-2 text-stone-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search all forums"
              className="bg-transparent text-[13px] outline-none text-stone-600 placeholder-stone-400 w-full"
            />
          </div>

          <div className="flex-1" />

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold rounded-full transition-colors"
          >
            + New Topic
          </button>

          {currentUser && (
            <div className={`w-8 h-8 rounded-full ${getAvatarColor(currentUser.username)} text-white text-[12px] font-bold flex items-center justify-center cursor-pointer`}>
              {currentUser.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-stone-200 bg-white sticky top-14 z-20">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1">
          <div className="relative mr-2">
            <button
              onClick={() => setShowCategoryDrop((v) => !v)}
              className="flex items-center gap-1.5 text-[13px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-md my-2 transition-colors"
            >
              {selectedCategory}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategoryDrop && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-50 min-w-[160px]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowCategoryDrop(false); }}
                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-stone-50 transition-colors ${selectedCategory === cat ? "text-green-600 font-medium" : "text-stone-600"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-3 py-3 text-[13px] font-medium transition-colors ${activeTab === tab ? "text-green-600" : "text-stone-500 hover:text-stone-700"}`}
            >
              {tab}
              {activeTab === tab && (<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-t" />)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-0">
        {!selectedThread && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left text-[12px] font-semibold text-stone-400 uppercase tracking-wider py-3 px-5">Topic</th>
                  <th className="text-left text-[12px] font-semibold text-stone-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap">Category</th>
                  <th className="text-left text-[12px] font-semibold text-stone-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap">Users</th>
                  <th className="text-center text-[12px] font-semibold text-stone-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap">Replies</th>
                  <th className="text-center text-[12px] font-semibold text-stone-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap">Views</th>
                  <th className="text-right text-[12px] font-semibold text-stone-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap">Activity</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-400 text-sm">Loading…</td>
                  </tr>
                )}

                {!loading && threads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-400 text-sm">No threads yet. Create the first one!</td>
                  </tr>
                )}

                {threads.map((thread, i) => (
                  <ThreadRow
                    key={thread._id}
                    thread={thread}
                    onClick={handleViewThread}
                    pinned={i === 0}
                    currentUser={currentUser}
                    onDelete={() => {
                      if (!currentUser || currentUser._id !== thread.author?._id) return;
                      if (!window.confirm("Delete this thread?")) return;
                      deleteThread(thread._id).then(() => loadThreads()).catch(() => alert("Delete failed"));
                    }}
                    onEdit={() => handleViewThread(thread._id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedThread && (
          <div className="max-w-3xl mx-auto py-8">
            <button onClick={() => setSelectedThread(null)} className="flex items-center gap-1.5 text-[13px] text-stone-400 hover:text-green-600 mb-6 transition-colors">← Back to forum</button>

            <div className="mb-8">
              <div className="flex items-start gap-3 mb-1">
                {selectedThread.category && (
                  <span className="flex items-center gap-1 text-[12px] text-stone-400 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {selectedThread.category}
                  </span>
                )}
              </div>

              {!isEditingThread ? (
                <h1 className="text-2xl font-bold text-stone-800 mb-4 leading-tight">{selectedThread.title}</h1>
              ) : (
                <input className="w-full text-2xl font-bold mb-4 px-3 py-2 border rounded" value={editThreadDraft.title} onChange={(e) => setEditThreadDraft((s) => ({ ...s, title: e.target.value }))} />
              )}

              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(selectedThread.author?.username)} text-white text-[14px] font-bold flex items-center justify-center flex-shrink-0`}>
                  {selectedThread.author?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] font-semibold text-stone-700">{selectedThread.author?.username}</span>
                    <span className="text-[12px] text-stone-400">just now</span>

                    {currentUser?._id === selectedThread.author?._id && (
                      <>
                        {!isEditingThread ? (
                          <button onClick={(e) => { e.stopPropagation(); startEditThread(); }} className="ml-auto text-[12px] text-stone-400 hover:text-stone-600 transition-colors">Edit</button>
                        ) : (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleSaveThreadEdit(); }} className="ml-auto text-[12px] text-green-600 font-semibold mr-2">Save</button>
                            <button onClick={(e) => { e.stopPropagation(); cancelEditThread(); }} className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors">Cancel</button>
                          </>
                        )}

                        <button onClick={(e) => { e.stopPropagation(); handleDeleteThread(); }} className="ml-2 text-[12px] text-stone-300 hover:text-red-400 transition-colors">Delete</button>
                      </>
                    )}
                  </div>

                  {!isEditingThread ? (
                    <p className="text-[15px] text-stone-600 leading-relaxed mb-3">{selectedThread.content}</p>
                  ) : (
                    <textarea rows={6} className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-[14px] text-stone-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none mb-3" value={editThreadDraft.content} onChange={(e) => setEditThreadDraft((s) => ({ ...s, content: e.target.value }))} />
                  )}

                  <div className="flex items-center gap-3">
                    <button onClick={() => handleVote("thread", selectedThread._id, 1)} className="flex items-center gap-1 text-[12px] text-stone-400 hover:text-green-600 transition-colors">♥ {selectedThread.score ?? 0}</button>
                    <button className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors">Share</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 mb-2" />

            <div className="flex items-center justify-between py-3 mb-2">
              <span className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">
                {comments.filter(c => !c.parentComment).length} {comments.filter(c => !c.parentComment).length === 1 ? "Reply" : "Replies"}
              </span>
            </div>

            <div className="mb-6">
              {comments.filter(c => !c.parentComment).length === 0 && (
                <p className="text-center text-stone-400 text-sm py-8">No replies yet — be the first to reply!</p>
              )}

              {comments
                .filter((c) => !c.parentComment)
                .map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    currentUser={currentUser}
                    onVote={handleVote}
                    onDelete={handleDeleteComment}
                    onReply={handleReplyToComment}
                    onEdit={handleEditComment}
                    getReplies={getReplies}
                  />
                ))}
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center gap-2">
                <span className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Reply</span>
              </div>
              <form onSubmit={handleAddComment}>
                <textarea
                  className="w-full px-4 py-3 text-[14px] text-stone-700 outline-none resize-none bg-white placeholder-stone-300"
                  placeholder="Write your reply…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
                <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold rounded-lg transition-colors">Post Reply</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL (unchanged besides tags mapping) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-[16px] font-bold text-stone-800">Create New Topic</h2>
              <button onClick={() => setShowCreateModal(false)} className="w-7 h-7 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors text-lg">×</button>
            </div>

            <form onSubmit={handleCreateThread} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">Title</label>
                <input type="text" className={inputCls} placeholder="What's your topic about?" value={newThread.title} onChange={(e) => setNewThread({ ...newThread, title: e.target.value })} required />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">Content</label>
                <textarea className={inputCls} placeholder="Share your question, tip or experience…" value={newThread.content} onChange={(e) => setNewThread({ ...newThread, content: e.target.value })} required rows={5} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">Tags <span className="text-stone-300 normal-case font-normal">(comma separated)</span></label>
                <input type="text" className={inputCls} placeholder="e.g. watering, monstera, tips" value={newThread.tags} onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })} />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2 text-[13px] text-stone-500 hover:text-stone-700 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold rounded-lg transition-colors">Create Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}