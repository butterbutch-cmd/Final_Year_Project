import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Config/firebase";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // -----------------------
  // Handle input change
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // -----------------------
  // LOCAL LOGIN
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData
      );

      localStorage.setItem("token", res.data.jwt);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // GOOGLE LOGIN
  // -----------------------
  const googleSignin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const idToken = await firebaseUser.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: idToken }
      );

      localStorage.setItem("token", res.data.jwt);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Google Sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="signup_container1">
      <h1>Welcome Back</h1>

      <div className="signup_form">
        {/* 🔴 Error Message */}
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            onClick={() => navigate("/TestMail")}
            style={{
              cursor: "pointer",
              color: "blue",
              marginTop: "8px",
            }}
          >
            Forgot Password?
          </p>
        </form>

        <hr style={{ margin: "20px 0" }} />

        <button onClick={googleSignin} disabled={loading}>
          Continue with Google
        </button>

        <p style={{ marginTop: "10px" }}>
          Don&apos;t have an account?
        </p>

        <button onClick={() => navigate("/signup")}>
          Go to Signup
        </button>
      </div>
    </div>
  );
}
