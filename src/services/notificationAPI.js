// src/services/notificationAPI.js
const BASE = "http://localhost:5000/api/notifications";

/* ===============================
   USER TOKEN
================================ */
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ===============================
   ADMIN TOKEN
================================ */
const adminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});


/* ===============================
   USER NOTIFICATIONS
================================ */

export const fetchNotifications = async (type) => {
  const url = type ? `${BASE}?type=${type}` : BASE;

  const res = await fetch(url, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markOneRead = async (id) => {
  const res = await fetch(`${BASE}/${id}/read`, {
    method: "PUT",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
};

export const markAllRead = async () => {
  const res = await fetch(`${BASE}/read-all`, {
    method: "PUT",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
};

export const deleteNotification = async (id) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
};



/* ===============================
   ADMIN NOTIFICATIONS
================================ */

export const getAdminNotifications = async () => {
  const res = await fetch(`${BASE}/admin`, {
    headers: adminHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch admin notifications");
  return res.json();
};

export const markAdminRead = async (id) => {
  const res = await fetch(`${BASE}/admin/${id}/read`, {
    method: "PUT",
    headers: adminHeaders(),
  });

  if (!res.ok) throw new Error("Failed to mark admin notification");
  return res.json();
};

export const markAllAdminRead = async () => {
  const res = await fetch(`${BASE}/admin/read-all`, {
    method: "PUT",
    headers: adminHeaders(),
  });

  if (!res.ok) throw new Error("Failed to mark all admin notifications");
  return res.json();
};