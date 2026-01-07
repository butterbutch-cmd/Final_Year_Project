import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Authentication/LoginPage";
import SignUp from "./Authentication/SignUp";
import TestMail from "./Authentication/ForgotPassword";
import AdminPanel from "./admin/AdminPanel";
import AdminLogin from "./admin/pages/AdminLogin"; // 🔥 Admin Login Page
import ProtectedRoute from "./admin/ProtectedRoute"; // 🔥 ProtectedRoute wrapper
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

export default function App() {
  return (
    <div className="page-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/testmail" element={<TestMail />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
