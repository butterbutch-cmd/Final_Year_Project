import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import HomePage from "./Pages/HomePage";
import NewArrival from "./Pages/NewArrival";
import Indoor from "./Pages/Indoor";
import Outdoor from "./Pages/Outdoor";
import Sale from "./Pages/Sales";
import Blog from "./Pages/Blog";
import Contacts from "./Pages/Contacts";
import LoginPage from "./Authentication/LoginPage";
import SignUp from "./Authentication/SignUp";
import TestMail from "./Authentication/ForgotPassword";
import AdminPanel from "./admin/AdminPanel";
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute"; 
import UserProtectedRoute from "./routes/UserProtectedRoute"; 
import { AuthProvider } from "./context/AuthContext";
import ProductPage from "./Pages/ProductPage";
import UserProfilePage from "./Pages/UserProfilePage";
import OrdersPage from "./Pages/OrderPage";       
import WishlistPage from "./Pages/WishlistPage"; 
import PaymentForm from "./Payment/Components/PaymentForm"; 
import Success from "./Payment/Components/Success";       
import Failure from "./Payment/Components/Failure";       
import ForumPage from "./Pages/ForumPage";
import ThreadPage from "./Pages/ThreadPage";
import Chatbot from "./components/Chatbot"; 
import NotificationPage from "./Pages/NotificationPage";
import "./App.css";

export default function App() {
  return (
    <div className="page-container">
      <AuthProvider>
        <BrowserRouter>

          {/* ✅ Chatbot floating on every page */}
          <Chatbot />

          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/NewArrival" element={<NewArrival/>}/>
            <Route path="/Indoor" element={<Indoor />} />
            <Route path="/Outdoor" element={<Outdoor />} />
            <Route path="/Sales" element={<Sale />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/testmail" element={<TestMail />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contacts" element={<Contacts />} />
            {/* ✅ Forum Routes */}
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/:threadId" element={<ThreadPage />} />

            {/* ================= USER PROTECTED ROUTES ================= */}
            <Route
              path="/profile"
              element={
                <UserProtectedRoute>
                  <UserProfilePage />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <UserProtectedRoute>
                  <OrdersPage />
                </UserProtectedRoute>
              }
            />

            <Route
              path="/notification"
              element={
                <UserProtectedRoute>
                    <NotificationPage/>
                </UserProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <UserProtectedRoute>
                  <WishlistPage />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <UserProtectedRoute>
                  <PaymentForm />
                </UserProtectedRoute>
              }
            />

            {/* ================= PAYMENT RESULT ROUTES ================= */}
            <Route path="/payment-success" element={<Success />} />
            <Route path="/payment-failure" element={<Failure />} />

            {/* ================= ADMIN ROUTES ================= */}
            <Route path="/admin/login" element={<AdminLogin />} />
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