// src/routes/UserProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Prevent flicker while checking authentication
  if (loading) return null; // or a spinner component

  // If user is not authenticated
  if (!user) {
    return <Navigate to="/LoginPage" replace />;
  }

  return children;
};

export default UserProtectedRoute;
