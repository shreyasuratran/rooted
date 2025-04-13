import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "./Login.css";
import { useUser } from "../components/UserContext";
import rootedLogo from "./rootedTextLogo.png";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

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
      const res = await api.get("/users/me");
      setUser(res.data);
      navigate("/rooted");
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  const goToCreateAccount = () => {
    navigate("/rooted/register");
  };

  return (
    <div className="auth-container">
      <img src={rootedLogo} alt="Rooted Logo" className="auth-logo" />
      <h1 className="auth-title">Welcome back!</h1>
      <p className="auth-subtext">Login to continue caring for your plants 🌿</p>
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
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div className="auth-bottom">
        <p>Don’t have an account?</p>
        <button onClick={goToCreateAccount} className="secondary-button">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
