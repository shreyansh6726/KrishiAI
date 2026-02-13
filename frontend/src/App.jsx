import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connects to your live Render backend
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;