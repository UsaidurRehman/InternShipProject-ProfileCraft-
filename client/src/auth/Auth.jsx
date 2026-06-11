import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SuccessNotification from "../components/Notifications/SuccessNotification";
import FailureNotification from "../components/Notifications/FailureNotification";
import "./auth.css";

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // ================= Sign In State & Logic =================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInLoading(true);
    setSignInError("");
    setSignInSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSignInError(data.message || "Invalid email or password");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("email", email);
        localStorage.setItem("userId", data.user.id);

        setSignInSuccess(true);

        setTimeout(() => navigate("/options"), 1500);
      }
    } catch (err) {
      setSignInError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSignInLoading(false);
    }
  };

  // ================= Register State & Logic =================
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showConfirmPasswordRegister, setShowConfirmPasswordRegister] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (form.password !== form.confirm_password) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Registration successful!");
        setForm({
          username: "",
          email: "",
          password: "",
          confirm_password: "",
        });
      } else {
        if (data.message && data.message.toLowerCase().includes("email already")) {
          setErrorMsg("This email is already registered. Please sign in.");
        } else {
          setErrorMsg(data.message || "Something went wrong");
        }
      }
    } catch (err) {
      setErrorMsg("⚠ Failed to connect to server");
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      {/* Notifications */}
      {signInSuccess && (
        <SuccessNotification
          message="LOGIN SUCCESSFULLY"
          onClose={() => setSignInSuccess(false)}
        />
      )}
      {signInError && (
        <FailureNotification
          message={signInError}
          onClose={() => setSignInError("")}
        />
      )}
      {successMsg && (
        <SuccessNotification
          message={successMsg}
          onClose={() => setSuccessMsg("")}
        />
      )}
      {errorMsg && (
        <FailureNotification
          message={errorMsg}
          onClose={() => setErrorMsg("")}
        />
      )}

      <div className="auth-container">
        <div className={`form-area ${isRegistering ? "active" : ""}`}>
          {/* ================= Sign In Form ================= */}
          <div className="auth-form-container sign-in-container">
            <h2 className="auth-heading">Sign In</h2>
            <form className="auth-form" onSubmit={handleSignInSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-wrapper">
                <input
                  type={showPasswordSignIn ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPasswordSignIn(prev => !prev)}
                >
                  {showPasswordSignIn ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button
                type="submit"
                className="send-btn"
                disabled={signInLoading}
              >
                {signInLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* ================= Register Form ================= */}
          <div className="auth-form-container register-container">
            <h2 className="auth-heading">Register</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Enter your full name"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="password-wrapper">
                <input
                  type={showPasswordRegister ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPasswordRegister(prev => !prev)}
                >
                  {showPasswordRegister ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <div className="password-wrapper">
                <input
                  type={showConfirmPasswordRegister ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Re-enter your password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPasswordRegister(prev => !prev)}
                >
                  {showConfirmPasswordRegister ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button type="submit" className="send-btn" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>

        {/* ================= Blue Panel ================= */}
        <div className="right-panel">
          <div className="panel-content">
            {!isRegistering ? (
              <>
                <h2>Create Account!</h2>
                <p>Sign up if you don’t have an account</p>
                <div
                  className="toggle-btn"
                  onClick={() => setIsRegistering(true)}
                >
                  Sign Up
                </div>
              </>
            ) : (
              <>
                <h2>Already have an Account?</h2>
                <p>Sign in to continue</p>
                <div
                  className="toggle-btn"
                  onClick={() => setIsRegistering(false)}
                >
                  Sign In
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
