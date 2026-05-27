import {
  Search,
  Bell,
  ChevronDown,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Menu,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import {
  getAdminNotifications,
  markAdminRead,
} from "../../services/notificationAPI";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

const TYPE_ICON = {
  order: "📦",
  payment: "💳",
  user: "👤",
  warning: "⚠️",
  report: "📊",
  default: "🔔",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;

  return `${days}d ago`;
}

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const [openNotif, setOpenNotif] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);

  const [adminInfo, setAdminInfo] = useState({
    name: "Admin User",
    role: "Admin",
    avatar:
      "https://i.pinimg.com/736x/a9/f4/f0/a9f4f0c03220e7dd5d0c60a9add61c42.jpg",
  });

  /* =========================================
      LOAD ADMIN INFO
  ========================================= */

  const decodeToken = (token) => {
    try {
      if (!token) return null;

      const parts = token.split(".");
      if (parts.length !== 3) return null;

      return JSON.parse(atob(parts[1]));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      const decoded = decodeToken(token);

      if (decoded) {
        setAdminInfo((prev) => ({
          ...prev,
          name: decoded.username || "Admin User",
          role:
            decoded.role === "super_admin"
              ? "Super Admin"
              : "Administrator",
        }));
      }
    }
  }, []);

  /* =========================================
      LOAD NOTIFICATIONS
  ========================================= */

  const loadNotifications = async () => {
    try {
      const data = await getAdminNotifications();

      setNotifications(data || []);

      const unread = data.filter((n) => !n.isRead).length;

      setUnreadCount(unread);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================
      MARK READ
  ========================================= */

  const handleRead = async (id) => {
    try {
      await markAdminRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================================
      OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handler = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setOpenNotif(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  /* =========================================
      SEARCH
  ========================================= */

  const handleSearch = () => {
    console.log("Searching:", searchQuery);
  };

  return (
    <>
      {/* Top mini bar */}
      <div className="bg-[#1a3320] px-6 py-2 border-b border-[#ffffff10]">
        <div className="flex items-center justify-between">
          <p
            className="text-[#f7f4ee]/70 text-[11px] tracking-[0.22em] uppercase"
            style={sans}
          >
            Mendho Admin Panel
          </p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7a9e7e]" />

            <p
              className="text-[#f7f4ee]/70 text-[11px]"
              style={sans}
            >
              System Operational
            </p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fdfcf8] border-b border-[#2d4a2d]/10 backdrop-blur-xl">
        <div className="h-[78px] px-6 flex items-center justify-between gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2d4a2d]/10 transition-all"
            >
              <Menu size={20} className="text-[#1a3320]" />
            </button>

            {/* Logo */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#7a9e7e] text-xs animate-spin">
                  ✦
                </span>

                <h1
                  className="text-[28px] tracking-[0.16em] text-[#1a3320] leading-none"
                  style={serif}
                >
                  MENDHO
                </h1>
              </div>

              <p
                className="text-[11px] text-[#8c8880] tracking-[0.2em] uppercase mt-1"
                style={sans}
              >
                Administration
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl">
            <div className="w-full max-w-[620px] h-[48px] bg-[#f7f4ee] border border-[#2d4a2d]/10 rounded-full flex items-center px-4 transition-all focus-within:border-[#2d4a2d]/30 focus-within:shadow-[0_4px_20px_rgba(26,51,32,0.08)]">

              <Search
                size={18}
                className="text-[#8c8880]"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search products, users, orders..."
                className="flex-1 bg-transparent outline-none border-none px-3 text-[14px] text-[#2c2c2c] placeholder:text-[#8c8880]"
                style={sans}
              />

              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-full bg-[#1a3320] text-[#f7f4ee] text-[11px] tracking-[0.14em] uppercase hover:bg-[#2d4a2d] transition-all"
                style={sans}
              >
                Search
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Notification */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setOpenNotif((p) => !p)}
                className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center border border-[#2d4a2d]/10 text-[#2c2c2c] hover:bg-[#2d4a2d]/10 hover:text-[#2d4a2d] transition-all"
              >
                <Bell size={18} />

                {unreadCount > 0 && (
                  <span
                    className="absolute top-[4px] right-[3px] min-w-[16px] h-[16px] px-[3px] rounded-full bg-[#c4704a] text-white text-[9px] flex items-center justify-center"
                    style={sans}
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* PANEL */}
              {openNotif && (
                <div className="absolute right-0 top-[calc(100%+14px)] w-[370px] max-h-[480px] overflow-hidden rounded-2xl bg-[#fdfcf8] border border-[#2d4a2d]/10 shadow-[0_14px_50px_rgba(26,51,32,0.15)] z-[100]">

                  {/* HEADER */}
                  <div className="px-5 py-4 border-b border-[#2d4a2d]/10 bg-[#f7f4ee] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell
                        size={15}
                        className="text-[#2d4a2d]"
                      />

                      <h3
                        className="text-[15px] text-[#1a3320]"
                        style={serif}
                      >
                        Notifications
                      </h3>
                    </div>

                    <button className="flex items-center gap-1 text-[11px] text-[#2d4a2d] hover:text-[#1a3320] transition-colors">
                      <CheckCheck size={13} />
                      Mark all
                    </button>
                  </div>

                  {/* BODY */}
                  <div className="max-h-[390px] overflow-y-auto">

                    {notifications.length === 0 ? (
                      <div className="py-14 flex flex-col items-center justify-center">
                        <Bell
                          size={28}
                          className="text-[#8c8880]/40"
                        />

                        <p
                          className="text-[13px] text-[#8c8880] mt-3"
                          style={sans}
                        >
                          No notifications
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleRead(n._id)}
                          className={`group px-5 py-4 border-b border-[#2d4a2d]/6 cursor-pointer transition-all duration-200 ${
                            !n.isRead
                              ? "bg-[#eef6ef] hover:bg-[#e7f0e8]"
                              : "hover:bg-[#f7f4ee]"
                          }`}
                        >
                          <div className="flex gap-3">

                            {/* ICON */}
                            <div className="w-10 h-10 rounded-full bg-[#2d4a2d]/8 flex items-center justify-center text-[17px] flex-shrink-0">
                              {TYPE_ICON[n.type] ||
                                TYPE_ICON.default}
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1 min-w-0">

                              <div className="flex items-start justify-between gap-2">

                                <p
                                  className={`text-[13px] leading-snug ${
                                    !n.isRead
                                      ? "text-[#1a3320] font-medium"
                                      : "text-[#2c2c2c]"
                                  }`}
                                  style={sans}
                                >
                                  {n.title}
                                </p>

                                {!n.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-[#c4704a] mt-1 flex-shrink-0" />
                                )}
                              </div>

                              <p
                                className="text-[12px] text-[#6b6b6b] mt-1 leading-relaxed"
                                style={sans}
                              >
                                {n.message}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <span
                                  className="text-[10px] text-[#8c8880]"
                                  style={sans}
                                >
                                  {timeAgo(n.createdAt)}
                                </span>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  <ExternalLink
                                    size={12}
                                    className="text-[#2d4a2d]"
                                  />

                                  <Trash2
                                    size={12}
                                    className="text-[#c4704a]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ADMIN CARD */}
            <div className="flex items-center gap-3 pl-3 border-l border-[#2d4a2d]/10 cursor-pointer group">

              <img
                src={adminInfo.avatar}
                alt="Admin"
                className="w-[46px] h-[46px] rounded-full object-cover ring-2 ring-[#2d4a2d]/10"
              />

              <div className="hidden sm:block">
                <div className="flex items-center gap-2">

                  <p
                    className="text-[14px] font-medium text-[#1a3320]"
                    style={sans}
                  >
                    {adminInfo.name}
                  </p>

                  <ShieldCheck
                    size={14}
                    className="text-[#7a9e7e]"
                  />
                </div>

                <p
                  className="text-[11px] text-[#8c8880] tracking-[0.12em] uppercase"
                  style={sans}
                >
                  {adminInfo.role}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="text-[#8c8880] group-hover:text-[#2d4a2d] transition-colors"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}