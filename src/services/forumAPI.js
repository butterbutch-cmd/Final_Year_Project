const BASE_URL = "http://localhost:5000/api/forum";

/* =========================
   HELPER FUNCTIONS
========================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (path, options = {}) => {
  const { body, headers = {}, ...rest } = options;

  const finalHeaders = {
    ...getAuthHeaders(),
    ...headers,
  };

  let finalBody = body;

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data || `Request failed with status ${res.status}`
    );
  }

  return data;
};

/* =========================
   THREAD APIs
========================= */

export const createThread = async (data) => {
  return request("/threads", {
    method: "POST",
    body: data,
  });
};

export const getThreads = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/threads${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

export const getThreadById = async (threadId, params = {}) => {
  if (!threadId) throw new Error("getThreadById called without a threadId");

  const query = new URLSearchParams(params).toString();
  return request(`/threads/${threadId}${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

export const deleteThread = async (threadId) => {
  if (!threadId) throw new Error("deleteThread called without a threadId");

  return request(`/threads/${threadId}`, {
    method: "DELETE",
  });
};

export const editThread = async (threadId, updatedData) => {
  if (!threadId) throw new Error("editThread called without a threadId");

  return request(`/threads/${threadId}`, {
    method: "PUT",
    body: updatedData,
  });
};

/* =========================
   COMMENT APIs
========================= */

export const addComment = async (threadId, content, parentComment = null) => {
  if (!threadId) throw new Error("addComment called without a threadId");
  if (!content?.trim()) throw new Error("Comment content is required");

  return request(`/threads/${threadId}/comments`, {
    method: "POST",
    body: {
      content,
      parentComment,
    },
  });
};

export const deleteComment = async (commentId) => {
  if (!commentId) throw new Error("deleteComment called without a commentId");

  return request(`/comments/${commentId}`, {
    method: "DELETE",
  });
};

export const updateComment = async (commentId, content) => {
  if (!commentId) throw new Error("updateComment called without a commentId");
  if (!content?.trim()) throw new Error("Comment content is required");

  return request(`/comments/${commentId}`, {
    method: "PUT",
    body: { content },
  });
};

/* =========================
   REPORT API
========================= */

export const report = async ({ targetType, targetId, reason }) => {
  if (!targetType) throw new Error("report called without targetType");
  if (!targetId) throw new Error("report called without targetId");
  if (!reason?.trim()) throw new Error("Report reason is required");

  return request("/reports", {
    method: "POST",
    body: {
      targetType,
      targetId,
      reason,
    },
  });
};

/* =========================
   VOTING API
========================= */

export const vote = async (targetType, targetId, value) => {
  if (!targetType) throw new Error("vote called without targetType");
  if (!targetId) throw new Error("vote called without targetId");
  if (![1, -1].includes(value)) {
    throw new Error("vote value must be 1 or -1");
  }

  return request("/vote", {
    method: "POST",
    body: {
      targetType,
      targetId,
      value,
    },
  });
};