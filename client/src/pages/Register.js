import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setMessage("Please enter both username and password.");
      setIsError(true);
      return;
    }
    try {
      await api.post("/users/register", { username, password });
      setMessage("Registration successful! Redirecting to login...");
      setIsError(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error registering:", error);
      if (error.response && error.response.status === 400) {
        setMessage("Username already exists. Please choose another one.");
      } else {
        setMessage("Registration failed. Please try again.");
      }
      setIsError(true);
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      {message && (
        <p className={`message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
