import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const [data, setData] = useState(
  { username: "testuser",
    email: "test@example.com",
    password: "123456", 
  });

  const handleChange = ({ target: input }) => {
    setData({ ...data, [input.name]: input.value });
    setError("");      // clear error when typing
    setSuccess("");    // clear success when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = "http://localhost:5000/api/Users";
      const { data: res } = await axios.post(url, data);

      console.log("Signup Success:", res.message);

      // Show success on UI
      setSuccess("Signup successful! Redirecting to Login...");
      
      // Redirect after 1 sec
      setTimeout(() => navigate("/LoginPage"), 1000);

    } catch (error) {
      console.log("Signup Error:", error);

      if (error.response) {
        // 409 email exists
        if (error.response.status === 409) {
          setError("Email already exists. Please login or use another email.");
          return;
        }

        // Validation or custom backend message
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="SignUp_Container">
      <h1>SignUp Page</h1>

      <form className="form_container2" onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />

        {/* Error Message */}
        {error && <p className="error_msg">{error}</p>}

        {/* Success Message */}
        {success && <p className="success_msg">{success}</p>}

        <button type="submit" className="submit_button">
          Signup
        </button>
      </form>
    </div>
  );
}
