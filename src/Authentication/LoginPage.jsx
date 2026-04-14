// // import axios from "axios";
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { signInWithPopup } from "firebase/auth";
// // import { auth, googleProvider } from "../Config/firebase";
// // import "./LoginPage.css";

// // export default function LoginPage() {
// //   const navigate = useNavigate();

// //   const [user, setUser] = useState(null);
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const [loginData, setLoginData] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   // -----------------------
// //   // Handle input change
// //   // -----------------------
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setLoginData({ ...loginData, [name]: value });
// //   };

// //   // -----------------------
// //   // LOCAL LOGIN
// //   // -----------------------
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     try {
// //       const res = await axios.post(
// //         "http://localhost:5000/api/auth/login",
// //         loginData
// //       );

// //       localStorage.setItem("token", res.data.jwt);
// //       setUser(res.data.user);
// //       navigate("/");
// //     } catch (err) {
// //       if (err.response?.data?.message) {
// //         setError(err.response.data.message);
// //       } else {
// //         setError("Login failed. Please try again.");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // -----------------------
// //   // GOOGLE LOGIN
// //   // -----------------------
// //   const googleSignin = async () => {
// //     setError("");
// //     setLoading(true);

// //     try {
// //       const result = await signInWithPopup(auth, googleProvider);
// //       const firebaseUser = result.user;

// //       const idToken = await firebaseUser.getIdToken();

// //       const res = await axios.post(
// //         "http://localhost:5000/api/auth/google",
// //         { token: idToken }
// //       );

// //       localStorage.setItem("token", res.data.jwt);
// //       setUser(res.data.user);
// //       navigate("/");
// //     } catch (err) {
// //       if (err.response?.data?.message) {
// //         setError(err.response.data.message);
// //       } else {
// //         setError("Google Sign-in failed");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // -----------------------
// //   // UI
// //   // -----------------------
// //   return (
// //     <div className="signup_container1">
// //       <h1>Welcome Back</h1>

// //       <div className="signup_form">
// //         {/* 🔴 Error Message */}
// //         {error && (
// //           <p style={{ color: "red", marginBottom: "10px" }}>
// //             {error}
// //           </p>
// //         )}

// //         <form onSubmit={handleSubmit}>
// //           <input
// //             name="email"
// //             placeholder="Email"
// //             value={loginData.email}
// //             onChange={handleChange}
// //             required
// //           />

// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             value={loginData.password}
// //             onChange={handleChange}
// //             required
// //           />

// //           <button type="submit" disabled={loading}>
// //             {loading ? "Logging in..." : "Login"}
// //           </button>

// //           <p
// //             onClick={() => navigate("/TestMail")}
// //             style={{
// //               cursor: "pointer",
// //               color: "blue",
// //               marginTop: "8px",
// //             }}
// //           >
// //             Forgot Password?
// //           </p>
// //         </form>

// //         <hr style={{ margin: "20px 0" }} />

// //         <button onClick={googleSignin} disabled={loading}>
// //           Continue with Google
// //         </button>

// //         <p style={{ marginTop: "10px" }}>
// //           Don&apos;t have an account?
// //         </p>

// //         <button onClick={() => navigate("/signup")}>
// //           Go to Signup
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../Config/firebase";

// const serif = { fontFamily: "'Cormorant Garamond', serif" };
// const sans  = { fontFamily: "'DM Sans', sans-serif" };

// // Google icon SVG
// const GoogleIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//     <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
//     <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
//     <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
//     <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
//   </svg>
// );

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [error, setError]     = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
//       localStorage.setItem("token", res.data.jwt);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const googleSignin = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const result  = await signInWithPopup(auth, googleProvider);
//       const idToken = await result.user.getIdToken();
//       const res     = await axios.post("http://localhost:5000/api/auth/google", { token: idToken });
//       localStorage.setItem("token", res.data.jwt);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Google Sign-in failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#fdfcf8] flex">

//       {/* Left panel */}
//       <div className="hidden lg:flex lg:w-1/2 bg-[#1a3320] relative overflow-hidden flex-col items-center justify-center p-16">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(122,158,126,0.25)_0%,_transparent_70%)]" />
//         <div className="absolute w-[420px] h-[420px] rounded-full border border-[#f7f4ee]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//         <div className="absolute w-[600px] h-[600px] rounded-full border border-[#f7f4ee]/[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

//         <div className="relative z-10 text-center">
//           <div className="flex items-center justify-center gap-2 mb-16">
//             <span className="text-[#7a9e7e] text-sm animate-spin" style={{ animationDuration: "9s" }}>✦</span>
//             <span className="text-[28px] font-semibold tracking-[0.2em] text-[#f7f4ee]" style={serif}>
//               MENDHO
//             </span>
//           </div>

//           <p className="text-[11px] tracking-[0.22em] uppercase text-[#7a9e7e] mb-5" style={sans}>
//             ✦ Plant Boutique
//           </p>

//           <h2 className="font-light text-[#f7f4ee] leading-none mb-6" style={{ ...serif, fontSize: "clamp(36px, 4vw, 52px)" }}>
//             Grow something<br />beautiful today
//           </h2>

//           <p className="text-[14px] font-light text-[#f7f4ee]/45 max-w-xs mx-auto" style={sans}>
//             Curated plants, expert care guides, and a community that loves green as much as you do.
//           </p>
//         </div>
//       </div>

//       {/* Right panel */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
//         <div className="w-full max-w-[400px]">

//           {/* Back Button */}
//           <button
//             onClick={() => navigate(-1)}
//             className="mb-8 flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-[#8c8880] hover:text-[#1a3320] transition-colors"
//             style={sans}
//           >
//             <span className="text-sm">←</span> Back
//           </button>

//           {/* Mobile logo */}
//           <div className="flex items-center gap-2 mb-12 lg:hidden">
//             <span className="text-[#7a9e7e] text-xs animate-spin">✦</span>
//             <span className="text-2xl font-semibold tracking-[0.18em] text-[#1a3320]" style={serif}>
//               MENDHO
//             </span>
//           </div>

//           {/* Heading */}
//           <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-3" style={sans}>
//             Welcome back
//           </p>

//           <h1 className="font-light text-[#1a3320] mb-2" style={{ ...serif, fontSize: "clamp(32px, 4vw, 44px)" }}>
//             Sign in
//           </h1>

//           <p className="text-[13px] text-[#8c8880] mb-10" style={sans}>
//             Don't have an account?{" "}
//             <button onClick={() => navigate("/signup")} className="underline text-[#2d4a2d]">
//               Sign up
//             </button>
//           </p>

//           {/* Error */}
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">

//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               value={loginData.email}
//               onChange={handleChange}
//               required
//               className="border p-3"
//             />

//             <div className="relative">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={loginData.password}
//                 onChange={handleChange}
//                 required
//                 className="border p-3 w-full"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(p => !p)}
//                 className="absolute right-2 top-2 text-sm"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>

//             <button type="submit" disabled={loading} className="bg-[#1a3320] text-white py-3">
//               {loading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>

//           <div className="my-6 text-center">or</div>

//           <button onClick={googleSignin} className="border p-3 w-full flex items-center justify-center gap-2">
//             <GoogleIcon /> Continue with Google
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Config/firebase";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

// Google icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
      localStorage.setItem("token", res.data.jwt);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleSignin = async () => {
    setError("");
    setLoading(true);
    try {
      const result      = await signInWithPopup(auth, googleProvider);
      const idToken     = await result.user.getIdToken();
      const res         = await axios.post("http://localhost:5000/api/auth/google", { token: idToken });
      localStorage.setItem("token", res.data.jwt);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex">

      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3320] relative overflow-hidden flex-col items-center justify-center p-16">
        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(122,158,126,0.25)_0%,_transparent_70%)]" />

        {/* Decorative rings */}
        <div className="absolute w-[420px] h-[420px] rounded-full border border-[#f7f4ee]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#f7f4ee]/[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-16">
            <span className="text-[#7a9e7e] text-sm animate-spin" style={{ animationDuration: "9s" }}>✦</span>
            <span className="text-[28px] font-semibold tracking-[0.2em] text-[#f7f4ee]" style={serif}>
              MENDHO
            </span>
          </div>

          <p className="text-[11px] tracking-[0.22em] uppercase text-[#7a9e7e] mb-5" style={sans}>
            ✦ Plant Boutique
          </p>
          <h2
            className="font-light text-[#f7f4ee] leading-none mb-6"
            style={{ ...serif, fontSize: "clamp(36px, 4vw, 52px)" }}
          >
            Grow something<br />beautiful today
          </h2>
          <p className="text-[14px] font-light text-[#f7f4ee]/45 max-w-xs mx-auto leading-relaxed" style={sans}>
            Curated plants, expert care guides, and a community that loves green as much as you do.
          </p>

          {/* Small feature list */}
          <div className="mt-12 flex flex-col gap-3 text-left">
            {["100% ethically sourced plants", "Free delivery over Rs. 2,500", "Expert care included"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[#7a9e7e] flex-shrink-0" />
                <span className="text-[12.5px] text-[#f7f4ee]/55 font-light" style={sans}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <span className="text-[#7a9e7e] text-xs animate-spin" style={{ animationDuration: "9s" }}>✦</span>
            <span className="text-2xl font-semibold tracking-[0.18em] text-[#1a3320]" style={serif}>MENDHO</span>
          </div>

          {/* Heading */}
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-3" style={sans}>
            Welcome back
          </p>
          <h1
            className="font-light text-[#1a3320] m-0 mb-2 leading-tight"
            style={{ ...serif, fontSize: "clamp(32px, 4vw, 44px)" }}
          >
            Sign in
          </h1>
          <p className="text-[13px] font-light text-[#8c8880] mb-10" style={sans}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#2d4a2d] underline underline-offset-2 bg-transparent border-none cursor-pointer p-0 font-normal hover:text-[#1a3320] transition-colors"
              style={sans}
            >
              Sign up
            </button>
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-[#c4704a]/8 border border-[#c4704a]/20 rounded px-4 py-3 mb-6">
              <span className="text-[#c4704a] text-sm">⚠</span>
              <p className="text-[12.5px] text-[#c4704a] m-0" style={sans}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] focus:ring-0 transition-colors duration-200"
                style={sans}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/TestMail")}
                  className="text-[11px] text-[#2d4a2d] underline underline-offset-2 bg-transparent border-none cursor-pointer p-0 hover:text-[#1a3320] transition-colors"
                  style={sans}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-11 bg-transparent border border-[#2d4a2d]/20 rounded-sm text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] transition-colors duration-200"
                  style={sans}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c8880] bg-transparent border-none cursor-pointer p-0 text-[11px] hover:text-[#2d4a2d] transition-colors"
                  style={sans}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              style={sans}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <span className="flex-1 h-px bg-[#2d4a2d]/12" />
            <span className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>or</span>
            <span className="flex-1 h-px bg-[#2d4a2d]/12" />
          </div>

          {/* Google */}
          <button
            onClick={googleSignin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-transparent border border-[#2d4a2d]/20 text-[13px] text-[#2c2c2c] font-light cursor-pointer rounded-sm hover:bg-[#f7f4ee] hover:border-[#2d4a2d]/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={sans}
          >
            <GoogleIcon />
            Continue with Google
          </button>

        </div>
      </div>
    </div>
  );
}