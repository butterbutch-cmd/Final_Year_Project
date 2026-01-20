//file: Final_Year_Project/src/services/publicAPI.js
const BASE_URL = "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ================= GET PRODUCTS (PUBLIC) =================
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/products`);
  return handleResponse(res);
};

// ================= GET PRODUCT BY ID (PUBLIC) =================
export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  return handleResponse(res);
};
