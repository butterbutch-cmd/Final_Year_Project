import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevent flicker before auth check

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Auth fetch failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
