import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Leaf, Droplets, Truck, Sprout, ArrowLeft, MailCheck } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const PERKS = [
  { icon: <Leaf size={18} />, text: "Exclusive member-only drops" },
  { icon: <Droplets size={18} />, text: "Personalised care reminders" },
  { icon: <Truck size={18} />, text: "Free delivery on first order" },
  { icon: <Sprout size={18} />, text: "Access to the grower forum" },
];

export default function SignUp() {
  const navigate = useNavigate();

  // ── Signup form state ──────────────────────────────────────────
  const [data, setData]       = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ── OTP step state ─────────────────────────────────────────────
  const [step, setStep]         = useState("form");          // "form" | "otp"
  const [sentEmail, setSentEmail] = useState("");
  const [digits, setDigits]     = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputs = useRef([]);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Signup submit ──────────────────────────────────────────────
  const handleChange = ({ target: input }) => {
    setData((prev) => ({ ...prev, [input.name]: input.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: res } = await axios.post("http://localhost:5000/api/Users/signup", data);
      setSentEmail(res.email);
      setData({ username: "", email: "", password: "" });
      setStep("otp");                 // ← switch to OTP screen
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already in use. Please log in or try another.");
      } else {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── OTP helpers ────────────────────────────────────────────────
  const handleDigitChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setOtpError("");
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) { setOtpError("Please enter all 6 digits."); return; }

    setVerifying(true);
    setOtpError("");
    try {
      const { data: res } = await axios.post("http://localhost:5000/api/Users/verify-email", {
        email: sentEmail,
        otp,
      });
      setOtpSuccess(res.message);
      setTimeout(() => navigate("/LoginPage"), 1500);
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setOtpError("");
    setOtpSuccess("");
    try {
      const { data: res } = await axios.post("http://localhost:5000/api/Users/resend-otp", {
        email: sentEmail,
      });
      setOtpSuccess(res.message);
      setCountdown(60);
      setDigits(Array(6).fill(""));
      inputs.current[0]?.focus();
    } catch (err) {
      setOtpError(err.response?.data?.message || "Could not resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  // ── Shared layout wrapper ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fdfcf8] flex">

      {/* Left panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[400px]">

          {/* Back button */}
          <button
            onClick={() => step === "otp" ? setStep("form") : navigate(-1)}
            className="mb-8 flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-[#8c8880] hover:text-[#1a3320] transition-colors"
            style={sans}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Mobile logo */}
          <div
            className="flex items-center gap-2 mb-12 lg:hidden cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-[#7a9e7e] text-xs animate-spin">✦</span>
            <span className="text-2xl font-semibold tracking-[0.18em] text-[#1a3320]" style={serif}>
              MENDHO
            </span>
          </div>

          {/* ── STEP 1 : Signup form ── */}
          {step === "form" && (
            <>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-3" style={sans}>
                New here?
              </p>
              <h1 className="font-light text-[#1a3320] mb-2" style={{ ...serif, fontSize: "clamp(32px, 4vw, 44px)" }}>
                Create an account
              </h1>
              <p className="text-[13px] text-[#8c8880] mb-10" style={sans}>
                Already have one?{" "}
                <button onClick={() => navigate("/LoginPage")} className="underline text-[#2d4a2d]">
                  Sign in
                </button>
              </p>

              {error   && <p className="text-[#c4704a] mb-4 text-sm">{error}</p>}
              {success && <p className="text-[#2d4a2d] mb-4 text-sm">{success}</p>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text" name="username" placeholder="Username"
                  value={data.username} onChange={handleChange} required
                  className="border p-3"
                />
                <input
                  type="email" name="email" placeholder="Email"
                  value={data.email} onChange={handleChange} required
                  className="border p-3"
                />
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} name="password" placeholder="Password"
                    value={data.password} onChange={handleChange} required
                    className="border p-3 w-full"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-3 text-sm">
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                <button type="submit" disabled={loading} className="bg-[#1a3320] text-white py-3">
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2 : OTP verification ── */}
          {step === "otp" && (
            <>
              <div className="w-12 h-12 bg-[#1a3320] rounded-full flex items-center justify-center mb-6">
                <MailCheck size={22} color="#7a9e7e" />
              </div>

              <h1 className="font-light text-[#1a3320] mb-2" style={{ ...serif, fontSize: "clamp(28px, 4vw, 40px)" }}>
                Check your inbox
              </h1>
              <p className="text-[13px] text-[#8c8880] mb-8" style={sans}>
                We sent a 6-digit code to{" "}
                <span className="text-[#2d4a2d] font-medium">{sentEmail}</span>.
                It expires in 10 minutes.
              </p>

              {otpError   && <p className="text-[#c4704a] text-sm mb-4">{otpError}</p>}
              {otpSuccess && <p className="text-[#2d4a2d] text-sm mb-4">{otpSuccess}</p>}

              <form onSubmit={handleVerify}>
                <div className="flex gap-3 mb-8" onPaste={handlePaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputs.current[i] = el)}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={(e) => handleDigitChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-full aspect-square text-center text-xl font-medium border border-[#d4cfc7] bg-white text-[#1a3320] focus:outline-none focus:border-[#1a3320] transition-colors"
                      style={sans}
                    />
                  ))}
                </div>

                <button
                  type="submit" disabled={verifying}
                  className="w-full bg-[#1a3320] text-white py-3 text-sm tracking-widest uppercase disabled:opacity-60"
                  style={sans}
                >
                  {verifying ? "Verifying…" : "Verify Email"}
                </button>
              </form>

              <p className="text-center text-[13px] text-[#8c8880] mt-6" style={sans}>
                Didn't receive it?{" "}
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button onClick={handleResend} disabled={resending} className="underline text-[#2d4a2d] disabled:opacity-50">
                    {resending ? "Sending…" : "Resend code"}
                  </button>
                )}
              </p>
            </>
          )}

        </div>
      </div>

      {/* Right panel — unchanged */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3320] flex-col items-center justify-center p-16">
        <div className="text-center">
          <h2 className="text-[#f7f4ee] text-3xl mb-6" style={serif}>
            Everything a plant parent needs
          </h2>
          <div className="flex flex-col gap-4 text-left">
            {PERKS.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-4 bg-[#f7f4ee]/10 p-4 rounded">
                <span className="text-[#7a9e7e]">{icon}</span>
                <span className="text-[#f7f4ee] text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}