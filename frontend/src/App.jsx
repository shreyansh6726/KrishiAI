import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoadingSpinner = () => (
  <div className="loading-overlay">
    <div className="spinner"></div>
  </div>
);

const Login = ({ setToken, setUsername }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://krishiai-sxtk.onrender.com/api/auth/login', { email, password });
      const { token, user } = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('username', user.username);
      storage.setItem('rememberMe', rememberMe ? 'true' : 'false');

      setUsername(user.username);
      setToken(token);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Check your credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {isLoading && <LoadingSpinner />}
      <div className="login-container">
        <h2 style={{ textAlign: 'center', color: '#2d3436' }}>KrishiAI</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <input
              type="checkbox" id="rememberMe" checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 'auto', marginRight: '10px' }}
            />
            <label htmlFor="rememberMe" style={{ color: '#636e72', fontSize: '14px' }}>Keep me logged in</label>
          </div>
          <button type="submit" disabled={isLoading}>Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#00b894', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://krishiai-sxtk.onrender.com/api/auth/register', { username, email, password });
      setMessage(response.data.message + ". You can now log in.");
    } catch (err) {
      console.error("Sign Up Error:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {isLoading && <LoadingSpinner />}
      <div className="login-container">
        <h2 style={{ textAlign: 'center', color: '#2d3436' }}>Create Account</h2>
        {message && <p style={{ color: '#00b894', textAlign: 'center' }}>{message}</p>}
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={isLoading}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/" style={{ color: '#00b894', fontWeight: 'bold' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const Navbar = ({ handleLogout }) => (
  <nav className="navbar">
    <Link to="/" className="nav-logo">🌿 KrishiAI</Link>
    <div className="nav-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/marketplace" className="nav-link">Marketplace</Link>
      <Link to="/expert" className="nav-link">Expert Advice</Link>
      <Link to="/about" className="nav-link">About Us</Link>
      <Link to="/profile" className="nav-link">Profile</Link>
    </div>
    <button onClick={handleLogout} className="logout-btn">Logout</button>
  </nav>
);

const Dashboard = ({ username }) => (
  <div className="main-content">
    <h1 className="dashboard-title">Welcome back, {username || 'Farmer'}! 👋</h1>
    <div className="grid-container">
      <div className="card">
        <div className="icon">🌾</div>
        <h3>Crop Advisory</h3>
        <p>Get personalized advice on your current crops and soil health.</p>
      </div>
      <div className="card">
        <div className="icon">🌦️</div>
        <h3>Weather Forecast</h3>
        <p>Stay updated with hyper-local weather alerts for your farm.</p>
      </div>
      <div className="card">
        <div className="icon">💰</div>
        <h3>Market Prices</h3>
        <p>Real-time updates on Mandi prices across the country.</p>
      </div>
      <div className="card">
        <div className="icon">🛰️</div>
        <h3>Satellite View</h3>
        <p>Analyze your farm's health from above with satellite imagery.</p>
      </div>
    </div>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div className="main-content">
    <h1 className="dashboard-title">{title}</h1>
    <p>This section is under development. Stay tuned for KrishiAI updates!</p>
  </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || sessionStorage.getItem('username'));

  useEffect(() => {
    // Security Fix: Detect if this is a restored session that should have been cleared.
    // If rememberMe was false, and the tab was closed/reopened, we can try to invalidate.
    const isRemembered = localStorage.getItem('token') !== null;
    const sessionToken = sessionStorage.getItem('token');

    // If it's a session-only token, we'll use a hidden flag to detect "fresh" session.
    // window.name is often reused, but it's one of the few things that can survive a refresh 
    // but can be initialized specially.
    if (!isRemembered && sessionToken) {
      // If we don't have our "session_active" flag, it might be a restored tab.
      if (!window.sessionStorage.getItem('is_active_session')) {
        // This is a restored tab from a previous session that wasn't "Remembered"
        // We clear it to satisfy the user's security requirement.
        handleLogout();
      }
    }

    // Set the flag for the current session
    if (sessionToken) {
      window.sessionStorage.setItem('is_active_session', 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('rememberMe');
    sessionStorage.removeItem('is_active_session');
    setToken(null);
    setUsername('');
  };

  return (
    <Router>
      {token && <Navbar handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={token ? <Dashboard username={username} /> : <Login setToken={setToken} setUsername={setUsername} />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/marketplace" element={token ? <PlaceholderPage title="Farmers Marketplace" /> : <Navigate to="/" />} />
        <Route path="/expert" element={token ? <PlaceholderPage title="Agricultural Experts" /> : <Navigate to="/" />} />
        <Route path="/about" element={token ? <PlaceholderPage title="About KrishiAI" /> : <Navigate to="/" />} />
        <Route path="/profile" element={token ? <PlaceholderPage title="Your Profile" /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
