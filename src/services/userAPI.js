const BASE_URL = "http://localhost:5000";

const getToken = () => {
  return localStorage.getItem("adminToken");
};

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// ================= GET USERS =================
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

// ================= BLOCK USER =================
export const blockUser = async (id, reason) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
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

// ================= UNBLOCK USER =================
export const unblockUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({
      isBlocked: false,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to unblock user");
  }

  return res.json();
};

// ================= DELETE USER =================
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
