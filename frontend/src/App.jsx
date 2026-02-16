import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://krishiai-sxtk.onrender.com/api/auth/login', { email, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Check your credentials"));
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ textAlign: 'center', color: '#2d3436' }}>KrishiAI</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#00b894', fontWeight: 'bold' }}>Sign Up</Link>
      </p>
    </div>
  );
};

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://krishiai-sxtk.onrender.com/api/auth/register', { username, email, password });
      setMessage(response.data.message + ". You can now log in.");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ textAlign: 'center', color: '#2d3436' }}>Create Account</h2>
      {message && <p style={{ color: '#00b894', textAlign: 'center' }}>{message}</p>}
      <form onSubmit={handleSignUp}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/" style={{ color: '#00b894', fontWeight: 'bold' }}>Sign In</Link>
      </p>
    </div>
  );
};

const Homepage = ({ handleLogout }) => (
  <div style={{ textAlign: 'center' }}>
    <h1>🌿 KrishiAI Dashboard</h1>
    <p>Logged in successfully. Your session is saved!</p>
    <button onClick={handleLogout} style={{ width: 'auto', padding: '10px 20px' }}>Logout</button>
  </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Homepage handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
