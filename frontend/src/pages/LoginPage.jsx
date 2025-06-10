import React, { useState } from 'react';
import './LoginPage.css';   // we’ll create this

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: call your /api/auth/login endpoint
  };

  return (
    <div className="login‐wrapper">
      <form className="login‐card" onSubmit={handleSubmit}>
        <div className="login‐logo">🔬</div>
        <h1 className="login‐title">DrugFinder</h1>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>

        <div className="login‐links">
          <a href="/forgot">Forgot password?</a>
          <a href="/signup">Create account</a>
        </div>
      </form>
    </div>
  );
}