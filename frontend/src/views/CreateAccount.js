// CreateAccount.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "./Login.css";

const CreateAccount = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      };

      await api.post("/users/register", payload);
      console.log("Signup success");
      navigate("/login");
    } catch (err) {
      setError("Sign up failed");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <form className="auth-form" onSubmit={handleSignUp}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button onClick={goToLogin} className="secondary-button">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
