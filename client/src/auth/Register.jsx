import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SuccessNotification from '../components/Notifications/SuccessNotification';
import FailureNotification from '../components/Notifications/FailureNotification';
import './auth.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (form.password !== form.confirm_password) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Registration successful!");
        setForm({ username: '', email: '', password: '', confirm_password: '' });
      } else {
        setErrorMsg(data.message || "Something went wrong");
      }
    } catch (err) {
      setErrorMsg("⚠ Failed to connect to server");
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container register-container">
      {/* Success notification */}
      {successMsg && (
        <SuccessNotification 
          message={successMsg} 
          onClose={() => setSuccessMsg('')} 
        />
      )}

      {/* Failure notification */}
      {errorMsg && (
        <FailureNotification 
          message={errorMsg} 
          onClose={() => setErrorMsg('')} 
        />
      )}

      <h2 className="auth-heading">Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Inputs */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Enter your full name"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirm_password"
            placeholder="Re-enter your password"
            value={form.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-options">
        <span>Already have an account?</span>
        <Link to={'/'}>Sign In</Link>
      </div>
    </div>
  );
}
