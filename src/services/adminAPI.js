/// file: src/services/adminAPI.js
const BASE_URL = "http://localhost:5000";

// -----------------------
// Get token from localStorage
// -----------------------
const getToken = () => localStorage.getItem("adminToken");

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// -----------------------
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// -----------------------
// Admin endpoints
// -----------------------
export const getAdmins = async () => {
  const res = await fetch(`${BASE_URL}/api/admins`, { headers: authHeader() });
  return handleResponse(res);
};

export const createAdmin = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const updateAdmin = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const deleteAdmin = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// 🔑 Get current admin profile with permissions
export const getMyAdminProfile = async () => {
  const res = await fetch(`${BASE_URL}/api/admins/me`, { headers: authHeader() });
  return handleResponse(res);
};

// -----------------------
// Product endpoints
// -----------------------
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/products`, { headers: authHeader() });
  return handleResponse(res);
};
