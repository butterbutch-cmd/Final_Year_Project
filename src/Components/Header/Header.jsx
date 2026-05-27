// src/Components/Header/Header.jsx
import { Search, ShoppingBag, User2, Heart, X, Menu, Bell, Package, CheckCheck, Trash2, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from "../../services/notificationAPI";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const NAV_LINKS = [
  { label: "New Arrival", to: "/NewArrival" },
  { label: "Indoor",       to: "/Indoor" },
  { label: "Outdoor",      to: "/Outdoor" },
  { label: "Sale",         to: "/Sales", sale: true },
  { label: "Blog",         to: "/blog" },
  { label: "Contact",      to: "/contacts" },
];

// Icon per notification type
const TYPE_ICON = {
  payment_success:  "💳",
  payment_failed:   "❌",
  order_confirmed:  "📦",
  order_shipped:    "🚚",
  order_delivered:  "✅",
  forum_reply:      "💬",
  forum_like:       "❤️",
  password_changed: "🔒",
  default:          "🔔",
};

const ActionBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border-none cursor-pointer text-[#2c2c2c] hover:bg-[#2d4a2d]/10 hover:text-[#2d4a2d] transition-all duration-200 hover:scale-105"
  >
    {children}
  </button>
);

// ── Formats "2 hours ago" style timestamps ──
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]         = useState("");
  const [user, setUser]                       = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [scrolled, setScrolled]               = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [cartCount, setCartCount]             = useState(0);

  // ── Notification state ──
  const [showNotifPanel, setShowNotifPanel]   = useState(false);
  const [notifications, setNotifications]     = useState([]);
  const [unreadCount, setUnreadCount]         = useState(0);
  const [notifLoading, setNotifLoading]       = useState(false);
  const notifPanelRef                         = useRef(null);

  const fetchedRef = useRef(false);
  const searchRef  = useRef(null);

  

  // ── Load notifications ──
  const loadNotifications = useCallback(async () => {///call back means
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setNotifLoading(true); /// show loading state while fetching notifications
      const data = await fetchNotifications(); ///fetch notifications from backend
      setNotifications(data.notifications || []); /// set notifications in state
      setUnreadCount(data.unreadCount || 0); /// set unread count in state
    } catch (err) {// log any errors during fetch
      console.error("Notification fetch error:", err);
    } finally {
      setNotifLoading(false);/// hide loading state after fetch attempt
    }
  }, []);

  // ── Open panel → load + mark all read after short delay ──
  const handleBellClick = async () => {
    if (!localStorage.getItem("token")) { navigate("/LoginPage"); return; }
    const opening = !showNotifPanel;
    setShowNotifPanel(opening);
    if (opening) {
      await loadNotifications();
    }
  };

  // ── Mark one as read then navigate ──
const handleNotifClick = async (notif) => {
  try {
    // MARK AS READ
    if (!notif.isRead) {
      await markOneRead(notif._id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id
            ? { ...n, isRead: true }
            : n
        )
      );

      setUnreadCount((c) => Math.max(0, c - 1));
    }

    // CLOSE PANEL
    setShowNotifPanel(false);

    // ALWAYS GO TO NOTIFICATION PAGE
    navigate("/notification");

  } catch (err) {
    console.error("Mark read error:", err);
  }
};

  // ── Mark all read ──
  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  // ── Delete one ──
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const deleted = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (deleted && !deleted.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ── Close panel on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    if (showNotifPanel) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifPanel]);

  // ── Poll unread count every 60s ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [loadNotifications]);
  
  /// Add shadow to header after scrolling down 20px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20); /// add shadow after scrolling 20px
    window.addEventListener("scroll", onScroll);/// listen for scroll events
    return () => window.removeEventListener("scroll", onScroll);/// cleanup on unmount
  }, []);

  /// Focus search input when searchOpen becomes true
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);


  /// Fetch cart count on mount and when "cartUpdate" event is dispatched (e.g., after adding to cart)
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/user/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCartCount(data.cart.length);
      } catch (err) {
        console.error("Cart fetch error", err);
      }
    };
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, []);

  /// Fetch user on mount (if token exists) and set in state
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { localStorage.removeItem("token"); return; }///
        setUser(await res.json());
      } catch { setUser(null); }
    })();
  }, []);


  ///handle search: if closed, open it. If open, navigate to search results page with query
  const handleSearch = () => {
    if (!searchOpen) { setSearchOpen(true); return; }
    navigate(`/search?q=${searchQuery}`);
  };

  /// Navigation functions for profile menu
  const goToProfile      = () => { navigate("/profile");  setShowProfileMenu(false); };
  const goToOrderHistory = () => { navigate("/orders");   setShowProfileMenu(false); };
  const logoutUser       = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/LoginPage");
  };

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-[#1a3320] text-center  py-2 px-4">
        <p className="text-[#f7f4ee]/75 text-[11px] tracking-widest m-0" style={sans}> 
          Free shipping on orders over Rs. 2,500 &nbsp;·&nbsp; New arrivals every week
        </p>
      </div>

      {/* ── Main header ── */}
      <header
        className={`sticky top-0 z-50 bg-[#fdfcf8] border-b border-[#2d4a2d]/10 transition-shadow duration-300 ${/// add shadow when scrolled
          scrolled ? "shadow-[0_4px_24px_rgba(26,51,32,0.08)]" : ""/// no shadow when at top
        }`}
      > 
        <div className="flex items-center justify-between px-12 h-[68px] gap-6 max-lg:px-6 max-md:px-4">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
            <span className="text-[#7a9e7e] text-xs animate-spin" style={{ animationDuration: "9s" }}>✦</span>
            <h1 className="text-2xl font-semibold tracking-[0.18em] text-[#1a3320] m-0 leading-none" style={serif}>
              FLORAVERSE
            </h1>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-7 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, to, sale }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className={`relative text-[12px] tracking-[0.1em] uppercase no-underline pb-0.5
                      after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300
                      hover:after:w-full
                      ${sale
                        ? "text-[#c4704a] after:bg-[#c4704a] hover:text-[#c4704a]"
                        : "text-[#2c2c2c] after:bg-[#2d4a2d] hover:text-[#2d4a2d]"
                      }`}
                    style={{ ...sans, fontWeight: 400 }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Search */}
            <div className={`flex items-center overflow-hidden border-b transition-all duration-300 ${
              searchOpen ? "w-[180px] border-[#2d4a2d]" : "w-[38px] border-transparent"
            }`}>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                className={`bg-transparent border-none outline-none text-[13px] text-[#2c2c2c] placeholder-[#8c8880] transition-all duration-300 ${
                  searchOpen ? "flex-1 px-2" : "w-0 p-0"
                }`}
                style={sans}
              />
              <ActionBtn onClick={handleSearch}><Search size={17} /></ActionBtn>
            </div>

            <ActionBtn onClick={() => user && setShowProfileMenu((p) => !p)}>
              <User2 size={17} />
            </ActionBtn>

            <ActionBtn
              onClick={() => navigate(user ? "/wishlist" : "/LoginPage")}
            >
              <Heart size={17} />
            </ActionBtn>

            {/* ── Bell button with badge ── */}
            <div className="relative" ref={notifPanelRef}>
              <button
                onClick={handleBellClick}
                className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border-none cursor-pointer text-[#2c2c2c] hover:bg-[#2d4a2d]/10 hover:text-[#2d4a2d] transition-all duration-200 hover:scale-105"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-[5px] right-[4px] bg-[#c4704a] text-white text-[9px] min-w-[14px] h-[14px] px-[2px] rounded-full flex items-center justify-center"
                    style={sans}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* ── Notification dropdown panel ── */}
              {showNotifPanel && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] w-[360px] max-h-[480px] bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-xl shadow-[0_12px_48px_rgba(26,51,32,0.15)] flex flex-col overflow-hidden z-[999]"
                  style={sans}
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2d4a2d]/10 bg-[#f7f4ee] flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-[#2d4a2d]" />
                      <span className="text-[13px] font-medium text-[#1a3320] tracking-wide" style={serif}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-[#c4704a] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 text-[11px] text-[#2d4a2d] hover:text-[#1a3320] transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <CheckCheck size={13} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Panel body */}
                  <div className="overflow-y-auto flex-1 divide-y divide-[#2d4a2d]/6">
                    {notifLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] rounded-full animate-spin" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Bell size={28} className="text-[#8c8880]/40" />
                        <p className="text-[13px] text-[#8c8880] m-0">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotifClick(notif)}
                          className={`group flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150
                            ${notif.isRead
                              ? "bg-transparent hover:bg-[#f7f4ee]/70"
                              : "bg-[#f0f6f0] hover:bg-[#e8f0e8]"
                            }`}
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2d4a2d]/8 flex items-center justify-center text-[16px] mt-0.5">
                            {TYPE_ICON[notif.type] || TYPE_ICON.default}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-[13px] m-0 leading-snug ${
                                notif.isRead ? "text-[#2c2c2c] font-normal" : "text-[#1a3320] font-medium"
                              }`}>
                                {notif.title}
                              </p>
                              {/* Unread dot */}
                              {!notif.isRead && (
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#c4704a] mt-1" />
                              )}
                            </div>
                            <p className="text-[12px] text-[#6b6b6b] m-0 mt-0.5 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] text-[#8c8880]">
                                {timeAgo(notif.createdAt)}
                              </span>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                {notif.link && (
                                  <ExternalLink size={11} className="text-[#2d4a2d]" />
                                )}
                                <button
                                  onClick={(e) => handleDelete(e, notif._id)}
                                  className="border-none bg-transparent p-0 cursor-pointer text-[#c4704a] hover:text-[#a3522f]"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Panel footer */}
                  {notifications.length > 0 && (
                    <div className="border-t border-[#2d4a2d]/10 px-5 py-3 flex-shrink-0 bg-[#f7f4ee]">
                      <button
                        onClick={() => { setShowNotifPanel(false); navigate("/notification"); }}
                        className="w-full text-[12px] text-[#2d4a2d] font-medium tracking-wide hover:text-[#1a3320] transition-colors border-none bg-transparent cursor-pointer"
                      >
                        View all notifications →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* ── End bell ── */}

            {/* Cart */}
            <button
              onClick={() => navigate("/checkout")}
              className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border-none cursor-pointer text-[#2c2c2c] hover:bg-[#2d4a2d]/10 hover:text-[#2d4a2d] transition-all duration-200"
            >
              <ShoppingBag size={17} />
              <span className="absolute top-[5px] right-[5px] bg-[#c4704a] text-white text-[9px] w-[14px] h-[14px] rounded-full flex items-center justify-center" style={sans}>
                {cartCount}
              </span>
            </button>

            {/* CTA */}
            <button
              onClick={() => navigate(user ? "/forum" : "/LoginPage")}
              className="hidden sm:block ml-2 px-5 py-[9px] bg-[#1a3320] text-[#f7f4ee] border-none text-[11px] font-medium tracking-[0.12em] uppercase cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
              style={sans}
            >
              {user ? "Forum" : "Get Started"}
            </button>

            {/* Mobile hamburger */}
            <ActionBtn onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} className="lg:hidden" />
            </ActionBtn>
          </div>
        </div>
      </header>

      {/* ── Profile dropdown ── */}
      {showProfileMenu && user && (
        <div
          className="fixed inset-0 z-[200] bg-[#1a3320]/15 backdrop-blur-sm flex justify-end items-start"
          style={{ paddingTop: "78px", paddingRight: "48px" }}
          onClick={() => setShowProfileMenu(false)}
        >
          <div
            className="bg-[#fdfcf8] border border-[#2d4a2d]/10 rounded-lg shadow-[0_8px_40px_rgba(26,51,32,0.14)] min-w-[220px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 bg-[#f7f4ee] border-b border-[#2d4a2d]/10">
              <div
                className="w-10 h-10 rounded-full bg-[#2d4a2d] text-[#f7f4ee] flex items-center justify-center text-xl font-semibold flex-shrink-0"
                style={serif}
              >
                {(user.username || "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a3320] m-0" style={sans}>{user.username || "User"}</p>
                <p className="text-[11px] text-[#8c8880] mt-0.5 mb-0" style={sans}>{user.email || ""}</p>
              </div>
            </div>
            <ul className="list-none p-2 m-0">
              {[
                { label: "Edit Profile",   fn: goToProfile },
                { label: "Order History",  fn: goToOrderHistory },
              ].map(({ label, fn }) => (
                <li
                  key={label}
                  onClick={fn}
                  className="px-5 py-3 text-[13px] text-[#2c2c2c] cursor-pointer tracking-[0.03em] hover:bg-[#f7f4ee] hover:text-[#2d4a2d] transition-colors duration-150 rounded"
                  style={sans}
                >
                  {label}
                </li>
              ))}
              <li
                onClick={logoutUser}
                className="px-5 py-3 text-[13px] text-[#c4704a] cursor-pointer tracking-[0.03em] border-t border-[#2d4a2d]/10 mt-1 hover:bg-[#f7f4ee] transition-colors duration-150 rounded"
                style={sans}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[300] bg-[#1a3320]/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[280px] h-full bg-[#fdfcf8] px-7 py-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end bg-transparent border-none cursor-pointer text-[#2c2c2c] mb-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={22} />
            </button>
            <h2 className="text-[28px] font-semibold tracking-[0.18em] text-[#1a3320] mb-8" style={serif}>
              FLORAVERSE
            </h2>
            <ul className="list-none p-0 m-0">
              {NAV_LINKS.map(({ label, to, sale }) => (
                <li key={label} className="py-3.5 border-b border-[#2d4a2d]/10" onClick={() => setMobileMenuOpen(false)}>
                  <Link
                    to={to}
                    className={`text-[14px] tracking-[0.1em] uppercase no-underline font-light ${
                      sale ? "text-[#c4704a]" : "text-[#2c2c2c]"
                    }`}
                    style={sans}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}