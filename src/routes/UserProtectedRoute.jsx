import { Navigate } from "react-router-dom";

/**
 * UserProtectedRoute
 * Protects user pages: checks if a user JWT exists in localStorage
 * If not, redirects to /LoginPage
 */
const UserProtectedRoute = ({ children }) => {
  // Get user token from localStorage
  const token = localStorage.getItem("token"); // user JWT stored here

  // If token missing, redirect to login
  if (!token) {
    return <Navigate to="/LoginPage" replace />;
  }

  // Otherwise, render the child component
  return children;
};

export default UserProtectedRoute;
