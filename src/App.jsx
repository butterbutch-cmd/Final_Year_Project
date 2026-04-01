// import { BrowserRouter, Routes, Route } from "react-router-dom"; 
// import HomePage from "./Pages/HomePage";
// import LoginPage from "./Authentication/LoginPage";
// import SignUp from "./Authentication/SignUp";
// import TestMail from "./Authentication/ForgotPassword";
// import AdminPanel from "./admin/AdminPanel";
// import AdminLogin from "./admin/pages/AdminLogin";
// import ProtectedRoute from "./admin/ProtectedRoute"; // Admin
// import UserProtectedRoute from "./routes/UserProtectedRoute"; // User
// import { AuthProvider } from "./context/AuthContext";
// import ProductPage from "./Pages/ProductPage";
// import UserProfilePage from "./Pages/UserProfilePage";
// import OrdersPage from "./Pages/OrderPage";       
// import WishlistPage from "./Pages/WishlistPage"; 
// import PaymentForm from "./Payment/Components/PaymentForm"; 
// import Success from "./Payment/Components/Success";       // ✅ import Success
// import Failure from "./Payment/Components/Failure";       // ✅ import Failure
// import "./App.css";

// export default function App() {
//   return (
//     <div className="page-container">
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* Public routes */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/LoginPage" element={<LoginPage />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/testmail" element={<TestMail />} />
//             <Route path="/product/:id" element={<ProductPage />} />

//             {/* User protected routes */}
//             <Route
//               path="/profile"
//               element={
//                 <UserProtectedRoute>
//                   <UserProfilePage />
//                 </UserProtectedRoute>
//               }
//             />
//             <Route
//               path="/orders"
//               element={
//                 <UserProtectedRoute>
//                   <OrdersPage />
//                 </UserProtectedRoute>
//               }
//             />
//             <Route
//               path="/wishlist"
//               element={
//                 <UserProtectedRoute>
//                   <WishlistPage />
//                 </UserProtectedRoute>
//               }
//             />
//             <Route
//               path="/checkout"
//               element={
//                 <UserProtectedRoute>
//                   <PaymentForm/>
//                 </UserProtectedRoute>
//               }
//             />

//             {/* Payment result routes */}
//             <Route path="/payment-success" element={<Success />} />
//             <Route path="/payment-failure" element={<Failure />} />

//             {/* Admin routes */}
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute>
//                   <AdminPanel />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </div>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import HomePage from "./Pages/HomePage";
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
import ForumPage from "./Pages/ForumPage";   // ✅ Added ForumPage
import ThreadPage from "./Pages/ThreadPage"; // ✅ Added ThreadPage
import "./App.css";

export default function App() {
  return (
    <div className="page-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/testmail" element={<TestMail />} />
            <Route path="/product/:id" element={<ProductPage />} />

            {/* ✅ Forum Route (Public viewing, login required only for actions) */}
            <Route path="/forum" element={<ForumPage />} />
              {/* ✅ Thread Route (Public viewing, login required only for actions) */}
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
