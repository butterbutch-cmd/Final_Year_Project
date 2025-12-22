import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Authentication/LoginPage";
import SignUp from "./Authentication/SignUp";
import TestMail from "./Authentication/ForgotPassword";
import AdminPanel from "./Pages/AdminPanel";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

export default function App() {
  return (
    <div className="page-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/testmail" element={<TestMail />} />

            {/* 🔥 Admin direct access */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
