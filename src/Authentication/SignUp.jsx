import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Leaf, Droplets, Truck, Sprout, ArrowLeft } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

// Lucide icons instead of emoji
const PERKS = [
  { icon: <Leaf size={18} />, text: "Exclusive member-only drops" },
  { icon: <Droplets size={18} />, text: "Personalised care reminders" },
  { icon: <Truck size={18} />, text: "Free delivery on first order" },
  { icon: <Sprout size={18} />, text: "Access to the grower forum" },
];

export default function SignUp() {
  const navigate = useNavigate();

  const [data, setData]       = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = ({ target: input }) => {
    setData((prev) => ({ ...prev, [input.name]: input.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data: res } = await axios.post("http://localhost:5000/api/Users/signup", data);
      setSuccess(res.message || "Account created! Redirecting…");
      setData({ username: "", email: "", password: "" });
      setTimeout(() => navigate("/LoginPage"), 1200);
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

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex">

      {/* Left panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[400px]">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
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

          {/* Heading */}
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

          {/* Error */}
          {error && <p className="text-[#c4704a] mb-4 text-sm">{error}</p>}

          {/* Success */}
          {success && <p className="text-[#2d4a2d] mb-4 text-sm">{success}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={data.username}
              onChange={handleChange}
              required
              className="border p-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
              className="border p-3"
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                required
                className="border p-3 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-3 text-sm"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" disabled={loading} className="bg-[#1a3320] text-white py-3">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      {/* Right panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3320] flex-col items-center justify-center p-16">
        <div className="text-center">

          <h2 className="text-[#f7f4ee] text-3xl mb-6" style={serif}>
            Everything a plant parent needs
          </h2>

          {/* Perks with Lucide icons */}
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