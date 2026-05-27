import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

export default function VerifyEmail() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // email passed via navigate state: navigate("/verify-email", { state: { email } })
  const email = location.state?.email || "";

  const [digits, setDigits]   = useState(Array(6).fill(""));
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDigitChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // digits only

    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");

    // Auto-advance
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Allow pasting a full 6-digit code
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/Users/verify-email", {
        email,
        otp,
      });
      setSuccess(data.message);
      setTimeout(() => navigate("/LoginPage"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/Users/resend-otp", { email });
      setSuccess(data.message);
      setCountdown(60); // lock resend for 60 s
      setDigits(Array(6).fill(""));
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-[#8c8880] hover:text-[#1a3320] transition-colors"
          style={sans}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-[#1a3320] rounded-full flex items-center justify-center mb-6">
          <MailCheck size={22} color="#7a9e7e" />
        </div>

        {/* Heading */}
        <h1
          className="font-light text-[#1a3320] mb-2"
          style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}
        >
          Check your inbox
        </h1>
        <p className="text-[13px] text-[#8c8880] mb-8" style={sans}>
          We sent a 6-digit code to{" "}
          <span className="text-[#2d4a2d] font-medium">{email || "your email"}</span>.
          It expires in 10 minutes.
        </p>

        {/* Feedback */}
        {error   && <p className="text-[#c4704a] text-sm mb-4">{error}</p>}
        {success && <p className="text-[#2d4a2d] text-sm mb-4">{success}</p>}

        {/* OTP boxes */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-8" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="
                  w-full aspect-square text-center text-xl font-medium
                  border border-[#d4cfc7] bg-white text-[#1a3320]
                  focus:outline-none focus:border-[#1a3320]
                  transition-colors rounded-sm
                "
                style={sans}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3320] text-white py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-60"
            style={sans}
          >
            {loading ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <p className="text-center text-[13px] text-[#8c8880] mt-6" style={sans}>
          Didn't receive it?{" "}
          {countdown > 0 ? (
            <span className="text-[#8c8880]">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="underline text-[#2d4a2d] disabled:opacity-50"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>

      </div>
    </div>
  );
}