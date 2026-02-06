// Final_Year_Project/Frontend/services/userAPI.js

const BASE_URL = "http://localhost:5000";

/* ===============================
   AUTH TOKEN
================================ */
const getToken = () => {
  return localStorage.getItem("adminToken");
};

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

/* ===============================
   GET ALL USERS (ADMIN)
================================ */
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    headers: authHeader(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch users");
  }

  return res.json();
};

/* ===============================
   BLOCK USER (ADMIN)
   Route: PUT /api/users/:id/block
================================ */
export const blockUser = async (id, reason) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}/block`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({
      isBlocked: true,
      blockReason: reason,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to block user");
  }

  return res.json();
};

/* ===============================
   UNBLOCK USER (ADMIN)
   Route: PUT /api/users/:id/block
================================ */
export const unblockUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}/block`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({
      isBlocked: false,
      blockReason: "",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to unblock user");
  }

  return res.json();
};

/* ===============================
   DELETE USER (ADMIN)
   Route: DELETE /api/users/:id
================================ */
export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete user");
  }

  return res.json();
};
