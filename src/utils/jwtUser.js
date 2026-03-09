//file: Final_Year_Project/src/utils/jwtUser.js
export function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      _id: payload._id || payload.id || payload.sub,
      username: payload.username ?? payload.name ?? "",  // never fall back to email
    };
  } catch {
    return null;
  }
}