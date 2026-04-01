// pages/ForumPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import ThreadRow from "../Components/Forum/ThreadRow";
import { jwtDecode } from "jwt-decode";
import {
  createThread,
  getThreads,
  deleteThread,
} from "../services/forumAPI";

const TABS = ["Latest", "Unread", "Rising", "Most Liked", "Follow Feed"];
const CATEGORIES = [
  "All Categories",
  "General",
  "Plant Care",
  "Pests & Disease",
  "Propagation",
  "Shopping",
];

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

export default function ForumPage() {
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "", tags: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Latest");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);

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

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-[14px] text-stone-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none";

  const getAvatarColor = (username, offset = 0) =>
    avatarColors[((username?.charCodeAt(0) || 0) + offset) % avatarColors.length];

  /* ========================= LOAD ========================= */
  const loadThreads = async (params = {}) => {
    try {
      setLoading(true);
      // you can pass params like { tab: activeTab, category: selectedCategory } when supporting server filters
      const data = await getThreads(params);
      setThreads(Array.isArray(data) ? data : data.threads || []);
    } catch (err) {
      console.error("Failed to load threads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========================= CREATE ========================= */
  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const tags = newThread.tags
        ? newThread.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      const payload = { ...newThread, tags };
      await createThread(payload);
      setNewThread({ title: "", content: "", tags: "" });
      setShowCreateModal(false);
      loadThreads();
    } catch (err) {
      alert(err?.message || "Failed to create thread");
      console.error(err);
    }
  };

  /* ========================= DELETE FROM LIST ========================= */
  const handleDeleteFromList = async (threadId) => {
    if (!window.confirm("Delete this thread?")) return;
    try {
      await deleteThread(threadId);
      loadThreads();
    } catch (err) {
      alert(err?.message || "Delete failed");
      console.error(err);
    }
  };

  /* ========================= NAVIGATION HELPERS ========================= */
  const openThread = (id) => {
    if (!id) return;
    navigate(`/forum/${id}`);
  };

  /* ========================= RENDER ========================= */
  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      {/* Optional: global header (if you have one) */}
      {Header && <Header />}

      {/* Top nav & actions */}
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

      {/* Tabs / Category */}
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

      {/* Thread list */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-stone-100">
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
                <tr><td colSpan={6} className="py-20 text-center text-stone-400">Loading…</td></tr>
              )}

              {!loading && threads.length === 0 && (
                <tr><td colSpan={6} className="py-20 text-center text-stone-400">No threads yet. Create the first one!</td></tr>
              )}

              {!loading && threads.map((thread, i) => (
                <ThreadRow
                  key={thread._id}
                  thread={thread}
                  pinned={i === 0}
                  currentUser={currentUser}
                  // ThreadRow calls onClick(thread._id) — we navigate to thread page
                  onClick={(id) => openThread(id)}
                  // Edit should also navigate to thread detail for full editing UI
                  onEdit={(t) => {
                    // ThreadRow sometimes passes object or id — normalize
                    const id = typeof t === "string" ? t : (t?._id || t?.id || thread._id);
                    openThread(id);
                  }}
                  // Delete uses our handler with confirmation
                  onDelete={(id) => handleDeleteFromList(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
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