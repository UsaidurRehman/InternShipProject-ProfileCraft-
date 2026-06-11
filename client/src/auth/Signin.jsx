import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import SuccessNotification from '../components/Notifications/SuccessNotification';
import FailureNotification from '../components/Notifications/FailureNotification';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid email or password');
      } else {
        // Save user data
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('email', email);
        localStorage.setItem('userId', data.user.id);

        // Show success notification
        setSuccess(true);

        // Redirect after short delay
        setTimeout(() => navigate('/options'), 1500);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {success && (
        <SuccessNotification 
          message="LOGIN SUCCESSFULLY" 
          onClose={() => setSuccess(false)} 
        />
      )}
      {error && (
        <FailureNotification
          message={error} 
          onClose={() => setError('')} 
        />
      )}

      <h2 className="auth-heading">Sign In</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="auth-options">
        <span>Don't have an account?</span>
        <Link to={'/register'}>Register</Link>
      </div>
    </div>
  );
}