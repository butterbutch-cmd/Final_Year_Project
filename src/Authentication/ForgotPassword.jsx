import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ SEND OTP
  const sendOtp = async () => {
    if (!email) return setMsg("Email is required");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/mail/forgot-password",
        { email }
      );
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setMsg("This account uses Google Sign-In. Password reset is not allowed.");
      } else {
        setMsg(err.response?.data?.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ VERIFY OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) return setMsg("OTP must be 6 digits");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/mail/verify-otp",
        { email, otp }
      );
      setMsg(res.data.message);
      setStep(3);
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ RESET PASSWORD
  const resetPassword = async () => {
    if (newPass.length < 8) return setMsg("Password must be at least 8 characters");
    if (newPass !== confirmPass) return setMsg("Passwords do not match");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/mail/reset-password",
        { email, otp, newPassword: newPass }
      );
      setMsg(res.data.message);
      setStep(4);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) setMsg("Google account detected. Please login using Google.");
      else setMsg(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Forgot Password
      </h2>

      {msg && (
        <p
          className={`mb-4 text-center font-medium ${
            step === 4 ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}

      {step === 1 && (
        <>
          <input
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-2 text-gray-700 text-sm">Enter 6-digit OTP</p>
          <input
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
            onClick={verifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
            onClick={resetPassword}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}

      {step === 4 && (
        <p className="text-center text-green-600 font-semibold">
          Password reset successful 🎉<br />
          Please login again.
        </p>
      )}
    </div>
  );
}
