// ================= BASE URL =================
const BASE_URL = "http://localhost:5000";

// ================= GET USERS =================
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`);
  return res.json();
};

// ================= UPDATE USER =================
export const updateUser = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// ================= DELETE USER =================
export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "DELETE",
  });

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    throw new Error("Server did not return JSON, check backend route.");
  }
};

// ================= BLOCK USER =================
export const blockUser = async (id, reason) => {
  if (!reason || reason.trim() === "") {
    throw new Error("Block reason is required");
  }

  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isBlocked: true, blockReason: reason }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to block user");
  }

  return res.json(); // returns { message, user }
};

// ================= UNBLOCK USER =================
export const unblockUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isBlocked: false }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to unblock user");
  }

  return res.json();
};
