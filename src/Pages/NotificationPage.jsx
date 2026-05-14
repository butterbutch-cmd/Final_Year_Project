import { useEffect, useState } from "react";
import Header from "../Components/Header/Header";

import {
  fetchNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from "../services/notificationAPI";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  /* ===============================
     CATEGORY MAPPING
  ============================== */
  const categoryMap = {
    ALL: [],
    FORUM: ["forum_reply", "forum_like"],
    ORDER: [
      "order_confirmed",
      "payment_success",
      "payment_failed",
      "order_shipped",
      "order_delivered",
    ],
    ACCOUNT: ["password_changed"],
  };

  /* ===============================
     FETCH NOTIFICATIONS
  ============================== */
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

  /* ===============================
     LOAD ON TAB CHANGE
  ============================== */
  useEffect(() => {
    loadNotifications(activeTab);
  }, [activeTab]);

  /* ===============================
     MARK ONE READ
  ============================== */
  const handleRead = async (id) => {
    try {
      await markOneRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     MARK ALL READ
  ============================== */
  const handleMarkAll = async () => {
    try {
      await markAllRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     DELETE
  ============================== */
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header />

      <div className="max-w-3xl mx-auto mt-6 p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Notifications</h1>

          <button
            onClick={handleMarkAll}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded"
          >
            Mark all read
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {["ALL", "FORUM", "ORDER", "ACCOUNT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* EMPTY */}
        {!loading && notifications.length === 0 && <p>No notifications found</p>}

        {/* LIST */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 border rounded-lg flex justify-between items-start ${
                !n.isRead ? "bg-green-50 border-green-400" : "bg-white"
              }`}
            >
              <div>
                <h3 className="font-semibold">{n.title}</h3>

                <p className="text-sm text-gray-600">{n.message}</p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => handleRead(n._id)}
                    className="text-blue-600 text-sm"
                  >
                    Mark read
                  </button>
                )}
                {/* HIDE DELETE FOR ORDER NOTIFICATIONS */}
                {!categoryMap.ORDER.includes(n.type) && (
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}