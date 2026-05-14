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

export const getRecommendations = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/api/recommendations/${userId}`
  );
  return handleResponse(res);
};


// ================= GET PRODUCT BY ID (PUBLIC) =================
export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  return handleResponse(res);
};

/* =======================================================
                    REVIEW APIs
======================================================= */

// ================= GET REVIEWS BY PRODUCT =================
export const getReviewsByProduct = async (productId, page = 1) => {
  const res = await fetch(
    `${BASE_URL}/api/reviews/${productId}?page=${page}`
  );
  return handleResponse(res);
};

// ================= CREATE REVIEW (AUTH REQUIRED) =================
export const createReview = async (reviewData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  return handleResponse(res);
};

// ================= REPORT REVIEW (AUTH REQUIRED) =================
export const reportReview = async (reviewId, reportData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(
    `${BASE_URL}/api/reviews/${reviewId}/report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    }
  );

  return handleResponse(res);
};
