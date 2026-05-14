// src/Pages/ForumPage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import ThreadRow from "../Components/Forum/ThreadRow";
import { jwtDecode } from "jwt-decode";
import { createThread, getThreads, deleteThread } from "../services/forumAPI";
import { fetchNotifications, markOneRead, markAllRead, deleteNotification } from "../services/notificationAPI";
import { Search, Plus, ChevronDown, X, Bell, Trash2, CheckCheck, ExternalLink } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const TABS = ["Latest", "Unread", "Rising", "Most Liked", "Follow Feed"];
const CATEGORIES = [
  "All Categories",
  "General",
  "Plant Care",
  "Pests & Disease",
  "Propagation",
  "Shopping",
];

const AVATAR_PALETTE = [
  "bg-[#2d4a2d]", "bg-[#7a9e7e]", "bg-[#c4704a]",
  "bg-[#4a6741]", "bg-[#8c6a4a]", "bg-[#5a7a5a]",
  "bg-[#b56a40]", "bg-[#3a5a3a]",
];

const getAvatarColor = (name) =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

const inputCls = "w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200 resize-none";

export default function ForumPage() {
  const navigate = useNavigate();

  const [threads, setThreads]                 = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [newThread, setNewThread]             = useState({ title: "", content: "", tags: "", category: "General" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab]             = useState("Latest");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");

  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifPanelRef = useRef(null);

  const token = localStorage.getItem("token");
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUser = { _id: decoded._id, username: decoded.username };
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // NOTIFICATION loader
  const loadNotification = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setNotifLoading(true);
      const data = await fetchNotifications("forum");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };

    if (showNotifPanel) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifPanel]);

  // Load notifications when page opens so badge shows immediately
  useEffect(() => {
    loadThreads();
    loadNotification();
  }, []);

  // notification bell click
  const handleBellClick = async () => {
    setShowNotifPanel((p) => !p);
    await loadNotification();
  };

  // notification click handler
  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await markOneRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (notif.link) navigate(notif.link);
  };

  /* ── Load ── */
  const loadThreads = async (params = {}) => {
    try {
      setLoading(true);
      const data = await getThreads(params);
      setThreads(Array.isArray(data) ? data : data.threads || []);
    } catch (err) {
      console.error("Failed to load threads", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Create ── */
  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const tags = newThread.tags
        ? newThread.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      await createThread({ ...newThread, tags });
      setNewThread({ title: "", content: "", tags: "", category: "General" });
      setShowCreateModal(false);
      loadThreads();
    } catch (err) {
      alert(err?.message || "Failed to create thread");
      console.error(err);
    }
  };

  /* ── Delete ── */
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

  const openThread = (id) => {
    if (id) navigate(`/forum/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8]" style={sans}>
      {/* ── Page hero ── */}
      <div className="border-b border-[#2d4a2d]/10 px-6 lg:px-14 py-10 bg-[#fdfcf8]">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-2" style={sans}>
          ✦ Community
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1
            className="font-light text-[#1a3320] m-0 leading-tight"
            style={{ ...serif, fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Plant Forum
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.12em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
            style={sans}
          >
            <Plus size={14} /> New Topic
          </button>
        </div>
      </div>

      {/* ── Filter bar — sticky ── */}
      <div className="sticky top-0 z-30 bg-[#fdfcf8] border-b border-[#2d4a2d]/10 shadow-[0_2px_16px_rgba(26,51,32,0.05)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14 flex items-center gap-3 h-14">

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-[260px] bg-[#f7f4ee] border border-[#2d4a2d]/12 rounded-sm px-3 py-2">
            <Search size={13} className="text-[#8c8880] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search topics…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[12.5px] outline-none text-[#2c2c2c] placeholder-[#8c8880] w-full"
              style={sans}
            />
          </div>

          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDrop((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] text-[#2c2c2c] bg-[#f7f4ee] border border-[#2d4a2d]/12 hover:border-[#2d4a2d]/30 px-3 py-2 rounded-sm transition-colors whitespace-nowrap"
              style={sans}
            >
              {selectedCategory}
              <ChevronDown size={12} className={`transition-transform ${showCategoryDrop ? "rotate-180" : ""}`} />
            </button>
            {showCategoryDrop && (
              <div className="absolute top-full left-0 mt-1.5 bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm shadow-[0_8px_32px_rgba(26,51,32,0.1)] py-1.5 z-50 min-w-[170px]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowCategoryDrop(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[12.5px] transition-colors hover:bg-[#f7f4ee] ${
                      selectedCategory === cat
                        ? "text-[#2d4a2d] font-medium"
                        : "text-[#4a4a4a] font-light"
                    }`}
                    style={sans}
                  >
                    {selectedCategory === cat && (
                      <span className="inline-block w-1 h-1 rounded-full bg-[#7a9e7e] mr-2 mb-0.5" />
                    )}
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 ml-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-3.5 h-14 text-[12px] font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-[#1a3320]"
                    : "text-[#8c8880] hover:text-[#4a4a4a]"
                }`}
                style={sans}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2d4a2d] rounded-t" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Notifications */}
          <div className="relative" ref={notifPanelRef}>
            <button
              onClick={handleBellClick}
              className="relative w-8 h-8 flex items-center justify-center hover:bg-[#2d4a2d]/10 rounded-full"
            >
              <Bell size={16} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c4704a] text-white text-[9px] w-[14px] h-[14px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPanel && (
              <div className="absolute right-0 top-[120%] w-[340px] bg-[#fdfcf8] border border-[#2d4a2d]/10 rounded-sm shadow-lg z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d4a2d]/10 bg-[#f7f4ee]">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[#2d4a2d] font-medium" style={sans}>
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        await markAllRead();
                        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                        setUnreadCount(0);
                      }}
                      className="flex items-center gap-1 text-[10.5px] text-[#7a9e7e] hover:text-[#2d4a2d] transition-colors bg-transparent border-none cursor-pointer"
                      style={sans}
                    >
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="max-h-[360px] overflow-y-auto">
                  {notifLoading && (
                    <div className="flex items-center justify-center py-8">
                      <span className="text-lg text-[#7a9e7e] animate-spin" style={{ animationDuration: "3s" }}>✦</span>
                    </div>
                  )}

                  {!notifLoading && notifications.length === 0 && (
                    <div className="py-10 text-center">
                      <Bell size={20} className="text-[#c8c4bc] mx-auto mb-2" />
                      <p className="text-[12px] font-light text-[#8c8880]" style={sans}>No notifications yet</p>
                    </div>
                  )}

                  {!notifLoading && notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-[#2d4a2d]/8 cursor-pointer hover:bg-[#f7f4ee] transition-colors ${
                        !n.isRead ? "bg-[#2d4a2d]/4" : ""
                      }`}
                    >
                      {/* unread dot */}
                      <div className="mt-1.5 flex-shrink-0">
                        {!n.isRead
                          ? <span className="w-1.5 h-1.5 rounded-full bg-[#c4704a] block" />
                          : <span className="w-1.5 h-1.5 block" />
                        }
                      </div>

                      {/* text */}
                      <div className="flex-1 min-w-0" onClick={() => handleNotifClick(n)}>
                        <p className="text-[12.5px] font-medium text-[#1a3320] m-0 leading-snug" style={sans}>{n.title}</p>
                        <p className="text-[11.5px] font-light text-[#8c8880] m-0 mt-0.5 leading-snug" style={sans}>{n.message}</p>
                      </div>

                      {/* actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {n.link && (
                          <button
                            onClick={() => handleNotifClick(n)}
                            className="w-6 h-6 flex items-center justify-center rounded text-[#8c8880] hover:text-[#2d4a2d] bg-transparent border-none cursor-pointer"
                          >
                            <ExternalLink size={11} />
                          </button>
                        )}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await deleteNotification(n._id);
                            setNotifications((prev) => prev.filter((x) => x._id !== n._id));
                            if (!n.isRead) setUnreadCount((c) => Math.max(0, c - 1));
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#8c8880] hover:text-[#c4704a] bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current user avatar */}
          {currentUser && (
            <div
              className={`w-8 h-8 rounded-full ${getAvatarColor(currentUser.username)} text-[#f7f4ee] text-[13px] font-semibold flex items-center justify-center cursor-pointer flex-shrink-0`}
              style={serif}
              title={currentUser.username}
            >
              {currentUser.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* ── Thread table ── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-8">
        <div className="border border-[#2d4a2d]/10 rounded-sm overflow-x-auto bg-[#fdfcf8]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d4a2d]/10 bg-[#f7f4ee]">
                {[
                  { label: "Topic",    align: "text-left"   },
                  { label: "Category", align: "text-left"   },
                  { label: "Users",    align: "text-left"   },
                  { label: "Likes",    align: "text-center" },
                  { label: "Replies",  align: "text-center" },
                  { label: "Activity", align: "text-right"  },
                ].map(({ label, align }) => (
                  <th
                    key={label}
                    className={`${align} text-[10.5px] font-medium tracking-[0.14em] uppercase text-[#8c8880] py-3 px-5 whitespace-nowrap`}
                    style={sans}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span
                        className="text-2xl text-[#7a9e7e] animate-spin"
                        style={{ animationDuration: "3s" }}
                      >
                        ✦
                      </span>
                      <p className="text-[12px] tracking-[0.15em] uppercase text-[#8c8880]" style={sans}>
                        Loading…
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && threads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <p className="text-[13px] font-light text-[#8c8880]" style={sans}>
                      No threads yet —{" "}
                      <span
                        className="underline underline-offset-2 cursor-pointer text-[#2d4a2d] hover:text-[#1a3320] transition-colors"
                        onClick={() => setShowCreateModal(true)}
                      >
                        start the first conversation
                      </span>
                    </p>
                  </td>
                </tr>
              )}

              {!loading && threads.map((thread, i) => (
                <ThreadRow
                  key={thread._id}
                  thread={thread}
                  pinned={i === 0}
                  currentUser={currentUser}
                  onClick={(id) => openThread(id)}
                  onEdit={(t) => {
                    const id = typeof t === "string" ? t : (t?._id || t?.id || thread._id);
                    openThread(id);
                  }}
                  onDelete={(id) => handleDeleteFromList(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create modal ── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a3320]/30 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm shadow-[0_16px_64px_rgba(26,51,32,0.18)] w-full max-w-[540px] overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#2d4a2d]/10">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-1" style={sans}>
                  ✦ Community
                </p>
                <h2
                  className="font-light text-[#1a3320] m-0 leading-tight"
                  style={{ ...serif, fontSize: "24px" }}
                >
                  New Topic
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#8c8880] hover:bg-[#2d4a2d]/8 hover:text-[#2d4a2d] transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleCreateThread} className="px-7 py-6 flex flex-col gap-5">

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="What's your topic about?"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  required
                  className={inputCls}
                  style={sans}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Category
                </label>
                <select
                  value={newThread.category}
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                  className={inputCls}
                  style={sans}
                >
                  {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Content
                </label>
                <textarea
                  placeholder="Share your question, tip or experience…"
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  required
                  rows={5}
                  className={inputCls}
                  style={sans}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Tags{" "}
                  <span className="normal-case font-light text-[#8c8880] tracking-normal">
                    — comma separated
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. watering, monstera, tips"
                  value={newThread.tags}
                  onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })}
                  className={inputCls}
                  style={sans}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] uppercase text-[#8c8880] bg-transparent border border-[#2d4a2d]/15 rounded-sm hover:border-[#2d4a2d]/35 hover:text-[#2c2c2c] transition-all cursor-pointer"
                  style={sans}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.12em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200"
                  style={sans}
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}