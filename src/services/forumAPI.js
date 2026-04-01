// // const BASE_URL = "http://localhost:5000/api/forum";

// // /* =========================
// //    HELPER FUNCTION
// // ========================= */
// // const getAuthHeaders = () => {
// //   const token = localStorage.getItem("token");

// //   return {
// //     "Content-Type": "application/json",
// //     Authorization: token ? `Bearer ${token}` : "",
// //   };
// // };

// // /* =========================
// //    THREAD APIs
// // ========================= */

// // // Create a new thread
// // export const createThread = async (data) => {
// //   const res = await fetch(`${BASE_URL}/threads`, {
// //     method: "POST",
// //     headers: getAuthHeaders(),
// //     body: JSON.stringify(data),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to create thread");
// //   }

// //   return res.json();
// // };

// // // Get all threads with optional pagination & sorting
// // // params: { page, limit, sort }
// // export const getThreads = async (params = {}) => {
// //   const query = new URLSearchParams(params).toString();
// //   const url = `${BASE_URL}/threads${query ? `?${query}` : ""}`;
// //   const res = await fetch(url);

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to fetch threads");
// //   }

// //   return res.json();
// // };

// // // Get a single thread with paginated comments
// // // params: { page, limit }
// // export const getThreadById = async (threadId, params = {}) => {
// //   if (!threadId) {
// //     throw new Error("getThreadById called without a threadId");
// //   }

// //   const query = new URLSearchParams(params).toString();
// //   const url = `${BASE_URL}/threads/${threadId}${query ? `?${query}` : ""}`;

// //   const res = await fetch(url);

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText || `HTTP ${res.status}` };
// //     }
// //     throw new Error(err.message || `Failed to fetch thread (status ${res.status})`);
// //   }

// //   return res.json();
// // };

// // // Delete a thread
// // export const deleteThread = async (threadId) => {
// //   const res = await fetch(`${BASE_URL}/threads/${threadId}`, {
// //     method: "DELETE",
// //     headers: getAuthHeaders(),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to delete thread");
// //   }

// //   return res.json();
// // };

// // // Edit thread
// // export const editThread = async (threadId, updatedData) => {
// //   const res = await fetch(`${BASE_URL}/threads/${threadId}`, {
// //     method: "PUT",
// //     headers: getAuthHeaders(),
// //     body: JSON.stringify(updatedData),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to update thread");
// //   }

// //   return res.json();
// // };

// // /* =========================
// //    COMMENT APIs
// // ========================= */

// // // Add comment or reply
// // // parentComment is optional for nested replies
// // export const addComment = async (threadId, content, parentComment = null) => {
// //   const res = await fetch(`${BASE_URL}/threads/${threadId}/comments`, {
// //     method: "POST",
// //     headers: getAuthHeaders(),
// //     body: JSON.stringify({ content, parentComment }),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to add comment");
// //   }

// //   return res.json();
// // };

// // // Delete comment
// // export const deleteComment = async (commentId) => {
// //   const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
// //     method: "DELETE",
// //     headers: getAuthHeaders(),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to delete comment");
// //   }

// //   return res.json();
// // };

// // // Update comment
// // export const updateComment = async (commentId, content) => {
// //   const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
// //     method: "PUT",
// //     headers: getAuthHeaders(),
// //     body: JSON.stringify({ content }),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to update comment");
// //   }

// //   return res.json();
// // };

// // /* =========================
// //    REPORT API
// // ========================= */

// // export const report = async ({ targetType, targetId, reason }) => {
// //   const res = await fetch(`${BASE_URL}/reports`, {
// //     method: "POST",
// //     headers: getAuthHeaders(),
// //     body: JSON.stringify({ targetType, targetId, reason }),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Failed to submit report");
// //   }

// //   return res.json();
// // };

// // /* =========================
// //    VOTING API
// // ========================= */

// // // Vote on thread or comment
// // // value = 1 or -1
// // export const vote = async (targetType, targetId, value) => {
// //   const res = await fetch(`${BASE_URL}/vote`, {
// //     method: "POST",
// //     headers: getAuthHeaders(),
// //     body: JSON.stringify({ targetType, targetId, value }),
// //   });

// //   if (!res.ok) {
// //     let err;
// //     try {
// //       err = await res.json();
// //     } catch (e) {
// //       err = { message: res.statusText };
// //     }
// //     throw new Error(err.message || "Voting failed");
// //   }

// //   return res.json();
// // };


// const BASE_URL = "http://localhost:5000/api/forum";

// /* =========================
//    HELPER FUNCTIONS
// ========================= */

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");

//   return {
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// const request = async (path, options = {}) => {
//   const { body, headers = {}, ...rest } = options;

//   const finalHeaders = {
//     ...getAuthHeaders(),
//     ...headers,
//   };

//   let finalBody = body;

//   if (body && typeof body === "object" && !(body instanceof FormData)) {
//     finalHeaders["Content-Type"] = "application/json";
//     finalBody = JSON.stringify(body);
//   }

//   const res = await fetch(`${BASE_URL}${path}`, {
//     ...rest,
//     headers: finalHeaders,
//     body: finalBody,
//   });

//   const text = await res.text();
//   let data = null;

//   if (text) {
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = text;
//     }
//   }

//   if (!res.ok) {
//     throw new Error(
//       data?.message || data || `Request failed with status ${res.status}`
//     );
//   }

//   return data;
// };

// /* =========================
//    THREAD APIs
// ========================= */

// // Create a new thread
// export const createThread = async (data) => {
//   return request("/threads", {
//     method: "POST",
//     body: data,
//   });
// };

// // Get all threads with optional pagination & sorting
// // params: { page, limit, sort }
// export const getThreads = async (params = {}) => {
//   const query = new URLSearchParams(params).toString();
//   return request(`/threads${query ? `?${query}` : ""}`, {
//     method: "GET",
//   });
// };

// // Get a single thread with paginated comments
// // params: { page, limit }
// export const getThreadById = async (threadId, params = {}) => {
//   if (!threadId) {
//     throw new Error("getThreadById called without a threadId");
//   }

//   const query = new URLSearchParams(params).toString();
//   return request(`/threads/${threadId}${query ? `?${query}` : ""}`, {
//     method: "GET",
//   });
// };

// // Delete a thread
// export const deleteThread = async (threadId) => {
//   if (!threadId) throw new Error("deleteThread called without a threadId");

//   return request(`/threads/${threadId}`, {
//     method: "DELETE",
//   });
// };

// // Edit thread
// export const editThread = async (threadId, updatedData) => {
//   if (!threadId) throw new Error("editThread called without a threadId");

//   return request(`/threads/${threadId}`, {
//     method: "PUT",
//     body: updatedData,
//   });
// };

// /* =========================
//    COMMENT APIs
// ========================= */

// // Add comment or reply
// // parentComment is optional for nested replies
// export const addComment = async (threadId, content, parentComment = null) => {
//   if (!threadId) throw new Error("addComment called without a threadId");
//   if (!content?.trim()) throw new Error("Comment content is required");

//   return request(`/threads/${threadId}/comments`, {
//     method: "POST",
//     body: {
//       content,
//       parentComment,
//     },
//   });
// };

// // Delete comment
// export const deleteComment = async (commentId) => {
//   if (!commentId) throw new Error("deleteComment called without a commentId");

//   return request(`/comments/${commentId}`, {
//     method: "DELETE",
//   });
// };

// // Update comment
// export const updateComment = async (commentId, content) => {
//   if (!commentId) throw new Error("updateComment called without a commentId");
//   if (!content?.trim()) throw new Error("Comment content is required");

//   return request(`/comments/${commentId}`, {
//     method: "PUT",
//     body: { content },
//   });
// };

// /* =========================
//    REPORT API
// ========================= */

// export const report = async ({ targetType, targetId, reason }) => {
//   if (!targetType) throw new Error("report called without targetType");
//   if (!targetId) throw new Error("report called without targetId");
//   if (!reason?.trim()) throw new Error("Report reason is required");

//   return request("/reports", {
//     method: "POST",
//     body: {
//       targetType,
//       targetId,
//       reason,
//     },
//   });
// };

// /* =========================
//    VOTING API
// ========================= */

// // Vote on thread or comment
// // value = 1 or -1
// export const vote = async (targetType, targetId, value) => {
//   if (!targetType) throw new Error("vote called without targetType");
//   if (!targetId) throw new Error("vote called without targetId");
//   if (![1, -1].includes(value)) {
//     throw new Error("vote value must be 1 or -1");
//   }

//   return request("/vote", {
//     method: "POST",
//     body: {
//       targetType,
//       targetId,
//       value,
//     },
//   });
// };


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