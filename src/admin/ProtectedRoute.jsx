///file: Final_Year_Project/src/admin/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Get token from localStorage
  const token = localStorage.getItem("adminToken");//this is admin token not user token

  // If no token, redirect to admin login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
