// file: src/services/productAPI.js
const BASE_URL = "http://localhost:5000";

// 🔑 Get JWT token from localStorage
const getToken = () => localStorage.getItem("adminToken");

// 🔑 Auth header
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// 🔹 Handle response
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ================= ADMIN PRODUCTS BASE URL =================
const ADMIN_PRODUCTS_URL = `${BASE_URL}/api/admin/products`;

// ================= GET PRODUCTS =================
export const getProducts = async () => {
  const res = await fetch(ADMIN_PRODUCTS_URL, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// ================= CREATE PRODUCT =================
export const createProduct = async (product) => {
  const res = await fetch(ADMIN_PRODUCTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (id, product) => {
  const res = await fetch(`${ADMIN_PRODUCTS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (id) => {
  const res = await fetch(`${ADMIN_PRODUCTS_URL}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// ================= GET USERS =================
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// ================= UPDATE USER =================
export const updateUser = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

// ================= DELETE USER =================
export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return handleResponse(res);
};
