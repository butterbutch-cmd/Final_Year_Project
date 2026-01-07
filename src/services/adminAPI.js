// ================= BASE URL =================
const BASE_URL = "http://localhost:5000";

// ================= GET TOKEN =================
const getToken = () => {
  return localStorage.getItem("adminToken"); // 🔥 FIXED
};

// ================= AUTH HEADER =================
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// ================= GET ADMINS & MODERATORS =================
export const getAdmins = async () => {
  const res = await fetch(`${BASE_URL}/api/admins`, {
    headers: authHeader(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admins");
  }

  return res.json();
};

// ================= CREATE ADMIN =================
export const createAdmin = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create admin");

  return data;
};

// ================= UPDATE ADMIN =================
export const updateAdmin = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

// ================= DELETE ADMIN =================
export const deleteAdmin = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) throw new Error("Failed to delete admin");

  return res.json();
};
