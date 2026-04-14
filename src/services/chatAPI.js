// file: src/services/chatAPI.js
const BASE_URL = "http://localhost:5000";

// -----------------------
// Get token from localStorage (if user is logged in)
// -----------------------
const getToken = () => localStorage.getItem("token");

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// -----------------------
// Chat endpoints
// -----------------------
export const sendChatMessage = async (message, userId) => {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ message, userId }),
  });
  return handleResponse(res);
};