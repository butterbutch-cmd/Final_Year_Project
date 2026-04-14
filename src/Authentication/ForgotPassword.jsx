// import { useState } from "react";
// import axios from "axios";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");

//   const [step, setStep] = useState(1);
//   const [msg, setMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 1️⃣ SEND OTP
//   const sendOtp = async () => {
//     if (!email) return setMsg("Email is required");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/mail/forgot-password",
//         { email }
//       );
//       setMsg(res.data.message);
//       setStep(2);
//     } catch (err) {
//       const status = err.response?.status;
//       if (status === 403) {
//         setMsg("This account uses Google Sign-In. Password reset is not allowed.");
//       } else {
//         setMsg(err.response?.data?.message || "Failed to send OTP");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2️⃣ VERIFY OTP
//   const verifyOtp = async () => {
//     if (otp.length !== 6) return setMsg("OTP must be 6 digits");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/mail/verify-otp",
//         { email, otp }
//       );
//       setMsg(res.data.message);
//       setStep(3);
//     } catch (err) {
//       setMsg(err.response?.data?.message || "Invalid or expired OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3️⃣ RESET PASSWORD
//   const resetPassword = async () => {
//     if (newPass.length < 8) return setMsg("Password must be at least 8 characters");
//     if (newPass !== confirmPass) return setMsg("Passwords do not match");

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/mail/reset-password",
//         { email, otp, newPassword: newPass }
//       );
//       setMsg(res.data.message);
//       setStep(4);
//     } catch (err) {
//       const status = err.response?.status;
//       if (status === 403) setMsg("Google account detected. Please login using Google.");
//       else setMsg(err.response?.data?.message || "Password reset failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//         Forgot Password
//       </h2>

//       {msg && (
//         <p
//           className={`mb-4 text-center font-medium ${
//             step === 4 ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {msg}
//         </p>
//       )}

//       {step === 1 && (
//         <>
//           <input
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//             onClick={sendOtp}
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <p className="mb-2 text-gray-700 text-sm">Enter 6-digit OTP</p>
//           <input
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             maxLength="6"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//           />
//           <button
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//             onClick={verifyOtp}
//             disabled={loading}
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </>
//       )}

//       {step === 3 && (
//         <>
//           <input
//             type="password"
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="New Password"
//             value={newPass}
//             onChange={(e) => setNewPass(e.target.value)}
//           />
//           <input
//             type="password"
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Confirm Password"
//             value={confirmPass}
//             onChange={(e) => setConfirmPass(e.target.value)}
//           />
//           <button
//             className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//             onClick={resetPassword}
//             disabled={loading}
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </>
//       )}

//       {step === 4 && (
//         <p className="text-center text-green-600 font-semibold">
//           Password reset successful 🎉<br />
//           Please login again.
//         </p>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2C6 2 3 7 3 12c0 3.5 2 6.5 5 8l1-3c-1.5-1-2.5-2.8-2.5-5 0-3.5 2.5-6.5 5.5-6.5S17.5 8.5 17.5 12c0 2.2-1 4-2.5 5l1 3c3-1.5 5-4.5 5-8 0-5-3-10-9-10z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22V12M12 12c0-3 2-5 4-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SproutIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="29" fill="#f0f7ee" stroke="#3d6b35" strokeWidth="1.5"/>
    <path d="M30 48V28" stroke="#3d6b35" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 36C30 36 22 30 20 22C26 20 34 24 30 36Z" fill="#6aaa5e" stroke="#3d6b35" strokeWidth="1.2"/>
    <path d="M30 32C30 32 38 26 36 18C30 20 24 26 30 32Z" fill="#8ecf7f" stroke="#3d6b35" strokeWidth="1.2"/>
    <path d="M22 48h16" stroke="#3d6b35" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CheckCircle = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-20 h-20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="29" fill="#f0f7ee" stroke="#3d6b35" strokeWidth="1.5"/>
    <path d="M18 30l8 8 16-16" stroke="#3d6b35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const steps = [
  { label: "Email", num: 1 },
  { label: "Verify", num: 2 },
  { label: "Reset", num: 3 },
];

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const notify = (text, error = true) => { setMsg(text); setIsError(error); };

  const sendOtp = async () => {
    if (!email) return notify("Please enter your email address.");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/mail/forgot-password", { email });
      notify(res.data.message, false);
      setStep(2);
    } catch (err) {
      const status = err.response?.status;
      notify(status === 403
        ? "This account uses Google Sign-In. Password reset is not available."
        : err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return notify("OTP must be exactly 6 digits.");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/mail/verify-otp", { email, otp });
      notify(res.data.message, false);
      setStep(3);
    } catch (err) {
      notify(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (newPass.length < 8) return notify("Password must be at least 8 characters.");
    if (newPass !== confirmPass) return notify("Passwords do not match.");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/mail/reset-password", { email, otp, newPassword: newPass });
      notify(res.data.message, false);
      setStep(4);
    } catch (err) {
      notify(err.response?.status === 403
        ? "Google account detected. Please sign in with Google."
        : err.response?.data?.message || "Password reset failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f8f2] px-4 py-12 font-serif">

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#c8e6c2] opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#d4edda] opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#e8f5e3] opacity-30 blur-3xl" />
        <svg className="absolute top-8 right-12 opacity-10 w-40 h-40" viewBox="0 0 120 120" fill="#2d5a27">
          <path d="M60 10C30 10 10 35 10 60c0 18 12 33 28 40l5-14c-8-5-13-14-13-26 0-18 14-34 30-34s30 16 30 34c0 12-5 21-13 26l5 14c16-7 28-22 28-40C110 35 90 10 60 10z"/>
          <path d="M60 110V58M60 58c0-15 10-25 20-30"/>
        </svg>
        <svg className="absolute bottom-12 left-8 opacity-10 w-32 h-32 rotate-45" viewBox="0 0 120 120" fill="#2d5a27">
          <path d="M60 10C30 10 10 35 10 60c0 18 12 33 28 40l5-14c-8-5-13-14-13-26 0-18 14-34 30-34s30 16 30 34c0 12-5 21-13 26l5 14c16-7 28-22 28-40C110 35 90 10 60 10z"/>
        </svg>
      </div>

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-900/10 border border-[#d6ecd0] overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6aaa5e] via-[#a8d5a2] to-[#6aaa5e]" />

          <div className="px-8 pt-8 pb-10">

            {/* Title */}
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold text-[#1e3d18] tracking-tight">
                {step === 4 ? "All Done!" : "Reset Password"}
              </h1>
              <p className="text-sm text-[#7aab6e] font-sans mt-1">
                {step === 1 && "We'll send a one-time code to your email."}
                {step === 2 && `Code sent to ${email}`}
                {step === 3 && "Choose a strong new password."}
                {step === 4 && "Your password has been updated."}
              </p>
            </div>

            {/* Step indicator (steps 1-3) */}
            {step < 4 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-sans font-semibold transition-all duration-300 ${
                      step > s.num
                        ? "bg-[#6aaa5e] text-white"
                        : step === s.num
                        ? "bg-[#1e3d18] text-white ring-4 ring-[#c8e6c2]"
                        : "bg-[#eaf5e7] text-[#aacca4]"
                    }`}>
                      {step > s.num ? (
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                          <path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : s.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-px w-8 transition-all duration-500 ${step > s.num ? "bg-[#6aaa5e]" : "bg-[#d6ecd0]"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message banner */}
            {msg && (
              <div className={`flex items-start gap-2.5 text-sm font-sans rounded-2xl px-4 py-3 mb-6 border ${
                isError
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-[#eef7ec] border-[#c2e0bb] text-[#2d6b25]"
              }`}>
                <span className="mt-0.5 shrink-0">{isError ? "⚠" : "✓"}</span>
                <span>{msg}</span>
              </div>
            )}

            {/* Step 1 – Email */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#5a8a50] tracking-widest uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0c99a]">
                      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="5" width="16" height="12" rx="2" strokeLinecap="round"/>
                        <path d="M2 7l8 5 8-5" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c8e6c2] bg-[#f8fdf6] text-[#1e3d18] font-sans text-sm placeholder-[#b0ccab] focus:outline-none focus:ring-2 focus:ring-[#6aaa5e] focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    />
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-xl bg-[#2d5a27] hover:bg-[#1e3d18] text-white font-sans font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-green-900/20"
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                  ) : (
                    <><LeafIcon />Send One-Time Code</>
                  )}
                </button>
              </div>
            )}

            {/* Step 2 – OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#5a8a50] tracking-widest uppercase mb-2">6-Digit Code</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-[#c8e6c2] bg-[#f8fdf6] text-[#1e3d18] font-sans text-sm placeholder-[#b0ccab] tracking-[0.5em] text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#6aaa5e] focus:border-transparent transition-all"
                    maxLength="6"
                    placeholder="· · · · · ·"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  />
                </div>
                <button
                  className="w-full py-3 rounded-xl bg-[#2d5a27] hover:bg-[#1e3d18] text-white font-sans font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-green-900/20"
                  onClick={verifyOtp}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</>
                    : "Verify Code →"
                  }
                </button>
                <button
                  className="w-full text-xs font-sans text-[#7aab6e] hover:text-[#2d5a27] transition-colors py-1"
                  onClick={() => { setStep(1); setMsg(""); setOtp(""); }}
                >
                  ← Use a different email
                </button>
              </div>
            )}

            {/* Step 3 – New Password */}
            {step === 3 && (
              <div className="space-y-4">
                {[
                  { label: "New Password", val: newPass, set: setNewPass, show: showPass, toggle: () => setShowPass(p => !p), ph: "At least 8 characters" },
                  { label: "Confirm Password", val: confirmPass, set: setConfirmPass, show: showConfirm, toggle: () => setShowConfirm(p => !p), ph: "Re-enter password" },
                ].map(({ label, val, set, show, toggle, ph }) => (
                  <div key={label}>
                    <label className="block text-xs font-sans font-semibold text-[#5a8a50] tracking-widest uppercase mb-2">{label}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0c99a]">
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="9" width="12" height="9" rx="2"/>
                          <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round"/>
                        </svg>
                      </span>
                      <input
                        type={show ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#c8e6c2] bg-[#f8fdf6] text-[#1e3d18] font-sans text-sm placeholder-[#b0ccab] focus:outline-none focus:ring-2 focus:ring-[#6aaa5e] focus:border-transparent transition-all"
                        placeholder={ph}
                        value={val}
                        onChange={(e) => set(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0c99a] hover:text-[#2d5a27] transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                          {show
                            ? <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></>
                            : <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/><path d="M3 3l14 14" strokeLinecap="round"/></>
                          }
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Password strength bar */}
                {newPass.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          newPass.length >= i * 3
                            ? i <= 1 ? "bg-red-400" : i === 2 ? "bg-amber-400" : i === 3 ? "bg-lime-500" : "bg-[#6aaa5e]"
                            : "bg-[#e0edd9]"
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs font-sans text-[#9abf92]">
                      {newPass.length < 4 ? "Too short" : newPass.length < 7 ? "Fair" : newPass.length < 10 ? "Good" : "Strong ✓"}
                    </p>
                  </div>
                )}

                <button
                  className="w-full py-3 rounded-xl bg-[#2d5a27] hover:bg-[#1e3d18] text-white font-sans font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-green-900/20"
                  onClick={resetPassword}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting…</>
                    : "Reset My Password"
                  }
                </button>
              </div>
            )}

            {/* Step 4 – Success */}
            {step === 4 && (
              <div className="text-center space-y-5 py-4">
                <div className="flex justify-center">
                  <CheckCircle />
                </div>
                <div>
                  <p className="text-[#1e3d18] font-semibold text-base">Password updated!</p>
                  <p className="text-sm font-sans text-[#7aab6e] mt-1">You can now log in with your new password.</p>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#2d5a27] hover:bg-[#1e3d18] text-white font-sans font-semibold text-sm tracking-wide transition-all duration-200 shadow-md shadow-green-900/20"
                  onClick={() => window.location.href = "/login"}
                >
                  Back to Login
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs font-sans text-[#a0c99a] mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-[#2d5a27] font-semibold hover:underline underline-offset-2">Sign in</a>
        </p>
      </div>
    </div>
  );
}