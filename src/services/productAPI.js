const BASE_URL = "http://localhost:5000";

// ================= GET PRODUCTS =================
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/products`);
  return res.json();
};

// ================= CREATE PRODUCT =================
export const createProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return res.json();
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
  });

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    throw new Error("Server did not return JSON, check backend route.");
  }
};
