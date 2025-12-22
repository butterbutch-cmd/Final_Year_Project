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
    if (newPass.length < 8) {
      return setMsg("Password must be at least 8 characters");
    }

    if (newPass !== confirmPass) {
      return setMsg("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/mail/reset-password",
        {
          email,
          otp, // 🔑 REQUIRED by backend
          newPassword: newPass,
        }
      );

      setMsg(res.data.message);
      setStep(4);
    } catch (err) {
      const status = err.response?.status;

      if (status === 403) {
        setMsg("Google account detected. Please login using Google.");
      } else {
        setMsg(err.response?.data?.message || "Password reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p>Enter 6-digit OTP</p>
          <input
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button onClick={resetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}

      {step === 4 && (
        <p style={{ color: "green" }}>
          Password reset successful 🎉  
          <br />
          Please login again.
        </p>
      )}

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}
