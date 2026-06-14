import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate(location.state?.from || '/');
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <main className="authBox">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
        <input name="password" type="password" placeholder="Password" minLength="5" onChange={handleChange} value={form.password} />
        <button className="button primary" type="submit">Login</button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
      {msg && <p className="status error">{msg}</p>}
    </main>
  );
};

export default Login;
