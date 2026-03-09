const BASE_URL = "http://localhost:5000/api/forum";

/* =========================
   HELPER FUNCTION
========================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* =========================
   THREAD APIs
========================= */

// Create a new thread
export const createThread = async (data) => {
  const res = await fetch(`${BASE_URL}/threads`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create thread");
  }

  return res.json();
};

// Get all threads with optional pagination & sorting
// params: { page, limit, sort }
export const getThreads = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/threads?${query}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch threads");
  }

  return res.json();
};

// Get a single thread with paginated comments
// params: { page, limit }
export const getThreadById = async (threadId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/threads/${threadId}?${query}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch thread");
  }

  return res.json();
};

// Delete a thread
export const deleteThread = async (threadId) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete thread");
  }

  return res.json();
};

// Edit thread (frontend only for now, backend endpoint not yet implemented)
export const editThread = (threads, threadId, updatedData) => {
  const thread = threads.find((t) => t._id === threadId);

  if (!thread) {
    console.error("Thread not found");
    return null;
  }

  thread.title = updatedData.title ?? thread.title;
  thread.content = updatedData.content ?? thread.content;

  return thread;
};

/* =========================
   COMMENT APIs
========================= */

// Add comment or reply
// parentComment is optional for nested replies
export const addComment = async (threadId, content, parentComment = null) => {
  const res = await fetch(`${BASE_URL}/threads/${threadId}/comments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, parentComment }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to add comment");
  }

  return res.json();
};

// Delete comment
export const deleteComment = async (commentId) => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete comment");
  }

  return res.json();
};

// (Optional) Edit comment - frontend only for now
export const editComment = (comments, commentId, updatedContent) => {
  const comment = comments.find((c) => c._id === commentId);

  if (!comment) {
    console.error("Comment not found");
    return null;
  }

  comment.content = updatedContent ?? comment.content;
  return comment;
};

/* =========================
   VOTING API
========================= */

// Vote on thread or comment
// value = 1 or -1
export const vote = async (targetType, targetId, value) => {
  const res = await fetch(`${BASE_URL}/vote`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ targetType, targetId, value }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Voting failed");
  }

  return res.json();
};
