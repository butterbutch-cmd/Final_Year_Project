import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 🔥 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isSignup
        ? "http://localhost:5000/api/admin/signup"
        : "http://localhost:5000/api/admin/login";

      const payload = isSignup
        ? form
        : { email: form.email, password: form.password };

      const { data } = await axios.post(url, payload);

      localStorage.setItem("adminToken", data.token);
      alert(data.message || "Success");

      // redirect to admin dashboard
      navigate("/admin", { replace: true });

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[350px]">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? "Admin Signup (Dev Only)" : "Admin Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {isSignup ? "Create Super Admin" : "Login as Super Admin"}
          </button>
        </form>

        <p
          className="text-sm text-center mt-4 cursor-pointer text-blue-600"
          onClick={() => setIsSignup(!isSignup)}
        >
          {/* {isSignup ? "Already have admin? Login" : "No admin yet? Create one (Dev only)"} */}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
