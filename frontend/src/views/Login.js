// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", form);
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      console.log("Login success, token saved");
      navigate("/home"); // or wherever you want to go next
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  const goToCreateAccount = () => {
    navigate("/register");
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="text"
          name="identifier"
          placeholder="Email Address"
          value={form.identifier}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button onClick={goToCreateAccount} className="secondary-button">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
