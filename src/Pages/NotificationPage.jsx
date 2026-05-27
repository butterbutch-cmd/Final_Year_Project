import { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import { Bell, CheckCheck, Trash2, MessageSquare, ShoppingBag, User, LayoutGrid } from "lucide-react";

import {
  fetchNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from "../services/notificationAPI";

/* ── Design tokens (mirrors UserProfilePage) ── */
const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

/* ── Tab meta ── */
const TABS = [
  { key: "ALL",     label: "All",     Icon: LayoutGrid  },
  { key: "FORUM",   label: "Forum",   Icon: MessageSquare },
  { key: "ORDER",   label: "Orders",  Icon: ShoppingBag },
  { key: "ACCOUNT", label: "Account", Icon: User        },
];

const categoryMap = {
  ALL:     [],
  FORUM:   ["forum_reply", "forum_like"],
  ORDER:   ["order_confirmed", "payment_success", "payment_failed", "order_shipped", "order_delivered"],
  ACCOUNT: ["password_changed"],
};

/* ── Type → badge colour ── */
const typeColour = {
  forum_reply:      { dot: "bg-[#7a9e7e]",   badge: "bg-[#7a9e7e]/10  text-[#2d4a2d]"   },
  forum_like:       { dot: "bg-[#7a9e7e]",   badge: "bg-[#7a9e7e]/10  text-[#2d4a2d]"   },
  order_confirmed:  { dot: "bg-[#c4a24a]",   badge: "bg-[#c4a24a]/10  text-[#7a6020]"   },
  payment_success:  { dot: "bg-[#4a8c6a]",   badge: "bg-[#4a8c6a]/10  text-[#1a5c3a]"   },
  payment_failed:   { dot: "bg-[#c4704a]",   badge: "bg-[#c4704a]/10  text-[#8c3a18]"   },
  order_shipped:    { dot: "bg-[#4a7ac4]",   badge: "bg-[#4a7ac4]/10  text-[#1a3c7a]"   },
  order_delivered:  { dot: "bg-[#2d4a2d]",   badge: "bg-[#2d4a2d]/10  text-[#1a3320]"   },
  password_changed: { dot: "bg-[#8c6a4a]",   badge: "bg-[#8c6a4a]/10  text-[#5a3a20]"   },
};
const defaultColour = { dot: "bg-[#c8c4bc]", badge: "bg-[#c8c4bc]/20 text-[#8c8880]" };

/* ── Helpers ── */
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5">
    {Icon
      ? <Icon size={14} className="text-[#7a9e7e]" />
      : <span className="text-[#7a9e7e] text-sm">✦</span>
    }
    <h2
      className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#1a3320] m-0"
      style={sans}
    >
      {title}
    </h2>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState("ALL");

  /* ── Fetch ── */
  const loadNotifications = async (tab = "ALL") => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      let filtered = data.notifications;

      if (tab !== "ALL") {
        filtered = data.notifications.filter((n) =>
          categoryMap[tab].includes(n.type)
        );
      }
      setNotifications(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(activeTab);
  }, [activeTab]);

  /* ── Actions ── */
  const handleRead = async (id) => {
    try {
      await markOneRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) { console.error(err); }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-[#eee9e0]">

        {/* ── Top banner ── */}
        <div className="bg-[#1a3320] px-6 lg:px-14 pt-10 pb-16">
          <p
            className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2"
            style={sans}
          >
            ✦ Your account
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1
              className="font-light text-[#f7f4ee] m-0 leading-tight"
              style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              Notifications
            </h1>

            {/* Mark all read — lives in banner */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#7a9e7e]/40 text-[#7a9e7e] text-[12px] font-medium tracking-[0.1em] uppercase rounded-sm hover:bg-[#7a9e7e]/10 hover:border-[#7a9e7e] transition-all duration-200"
                style={sans}
              >
                <CheckCheck size={13} />
                Mark all read
                <span className="ml-1 bg-[#7a9e7e]/20 text-[#7a9e7e] text-[10px] px-1.5 py-0.5 rounded-sm">
                  {unreadCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ── Content pulled up over banner ── */}
        <div className="max-w-[860px] mx-auto px-6 lg:px-14 -mt-8 pb-16">

          {/* ── Tab bar ── */}
          <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm p-1.5 flex gap-1 mb-5 flex-wrap">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-[12px] font-medium tracking-[0.08em] uppercase transition-all duration-200 flex-1 justify-center ${
                  activeTab === key
                    ? "bg-[#1a3320] text-[#f7f4ee]"
                    : "bg-transparent text-[#8c8880] hover:text-[#1a3320] hover:bg-[#2d4a2d]/[0.05]"
                }`}
                style={sans}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Notification card ── */}
          <div className="bg-[#fdfcf8] border border-[#2d4a2d]/12 rounded-sm p-6">

            <div className="flex items-center justify-between mb-5">
              <SectionTitle icon={Bell} title={`${TABS.find((t) => t.key === activeTab)?.label ?? ""} notifications`} />
              <span className="text-[11px] text-[#8c8880] font-light" style={sans}>
                {notifications.length} total
              </span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-3 py-12">
                <div className="w-4 h-4 rounded-full border-2 border-[#2d4a2d]/20 border-t-[#2d4a2d] animate-spin" />
                <p className="text-[13px] text-[#8c8880] font-light" style={sans}>Loading…</p>
              </div>
            )}

            {/* Empty */}
            {!loading && notifications.length === 0 && (
              <div className="border border-dashed border-[#2d4a2d]/20 rounded-sm px-6 py-12 text-center flex flex-col items-center gap-2">
                <Bell size={22} className="text-[#c8c4bc]" />
                <p className="text-[13px] font-light text-[#8c8880]" style={sans}>
                  No notifications here
                </p>
                <p className="text-[11.5px] font-light text-[#c8c4bc]" style={sans}>
                  You're all caught up
                </p>
              </div>
            )}

            {/* List */}
            {!loading && notifications.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {notifications.map((n) => {
                  const colour = typeColour[n.type] ?? defaultColour;
                  const isOrder = categoryMap.ORDER.includes(n.type);

                  return (
                    <div
                      key={n._id}
                      className={`flex items-start gap-4 px-5 py-4 border rounded-sm transition-all duration-200 ${
                        !n.isRead
                          ? "border-[#2d4a2d] bg-[#2d4a2d]/[0.03]"
                          : "border-[#2d4a2d]/15 hover:border-[#2d4a2d]/35"
                      }`}
                    >
                      {/* Unread dot indicator */}
                      <div className="mt-1 flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            !n.isRead
                              ? `${colour.dot} w-2.5 h-2.5`
                              : "w-2 h-2 bg-[#c8c4bc]/40"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3
                            className={`text-[13.5px] font-medium leading-snug ${
                              !n.isRead ? "text-[#1a3320]" : "text-[#2c2c2c]"
                            }`}
                            style={sans}
                          >
                            {n.title}
                          </h3>
                          {/* Type badge */}
                          {n.type && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-sm tracking-[0.08em] uppercase ${colour.badge}`}
                              style={sans}
                            >
                              {n.type.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>

                        <p
                          className="text-[12.5px] font-light text-[#8c8880] leading-relaxed"
                          style={sans}
                        >
                          {n.message}
                        </p>

                        <p
                          className="text-[11px] text-[#c8c4bc] mt-1.5 tracking-[0.04em]"
                          style={sans}
                        >
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {!n.isRead && (
                          <button
                            onClick={() => handleRead(n._id)}
                            className="text-[11px] text-[#2d4a2d] underline underline-offset-2 hover:text-[#1a3320] transition-colors px-1 whitespace-nowrap"
                            style={sans}
                          >
                            Mark read
                          </button>
                        )}

                        {/* Hide delete for ORDER notifications */}
                        {!isOrder && (
                          <button
                            onClick={() => handleDelete(n._id)}
                            className="p-1.5 text-[#c8c4bc] hover:text-[#c4704a] hover:bg-[#c4704a]/5 rounded-sm transition-all duration-200"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}