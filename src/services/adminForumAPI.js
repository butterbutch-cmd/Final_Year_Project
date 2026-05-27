// =========================================
// BASE URL
// =========================================
const BASE_URL = "http://localhost:5000/api/admin/forum";

// =========================================
// TOKEN HELPERS
// =========================================
const getToken = () => localStorage.getItem("adminToken");

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// =========================================
// RESPONSE HANDLER
// =========================================
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// =========================================
// THREAD APIs
// =========================================

// Get all threads
export const getAllThreads = async () => {
  const res = await fetch(`${BASE_URL}/threads`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Get reported threads
export const getReportedThreads = async () => {
  const res = await fetch(`${BASE_URL}/threads/reported`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// NEW: Get a single thread with its full nested comment tree
export const getThreadById = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Hide thread
export const hideThread = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}/hide`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Unhide thread
export const unhideThread = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}/unhide`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Lock thread
export const lockThread = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}/lock`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Unlock thread
export const unlockThread = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}/unlock`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Soft delete thread
export const deleteThread = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}/delete`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Permanent delete thread
export const permanentDeleteThread = async (id) => {
  const res = await fetch(`${BASE_URL}/thread/${id}/permanent`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// =========================================
// COMMENT APIs
// =========================================

// Get all comments
export const getAllComments = async () => {
  const res = await fetch(`${BASE_URL}/comments`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Get reported comments
export const getReportedComments = async () => {
  const res = await fetch(`${BASE_URL}/comments/reported`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// NEW: Get a single comment with its thread context + replies
export const getCommentById = async (id) => {
  const res = await fetch(`${BASE_URL}/comment/${id}`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Hide comment
export const hideComment = async (id) => {
  const res = await fetch(`${BASE_URL}/comment/${id}/hide`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Delete comment
export const deleteComment = async (id) => {
  const res = await fetch(`${BASE_URL}/comment/${id}/delete`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return handleResponse(res);
};

// =========================================
// REPORT APIs
// =========================================

// Get pending reports
export const getPendingReports = async () => {
  const res = await fetch(`${BASE_URL}/reports`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};

// Review report
export const reviewReport = async (id, adminNote = "") => {
  const res = await fetch(`${BASE_URL}/report/${id}/review`, {
    method: "PATCH",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ adminNote }),
  });
  return handleResponse(res);
};

// Reject report
export const rejectReport = async (id, adminNote = "") => {
  const res = await fetch(`${BASE_URL}/report/${id}/reject`, {
    method: "PATCH",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ adminNote }),
  });
  return handleResponse(res);
};

// =========================================
// DASHBOARD APIs
// =========================================

// Get forum stats
export const getForumStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: authHeader(),
  });
  return handleResponse(res);
};