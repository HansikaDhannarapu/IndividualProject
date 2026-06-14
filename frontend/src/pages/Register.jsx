import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
    profilePic: '',
    role: 'buyer',
  });
  const [msg, setMsg] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <main className="authBox">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Full name" onChange={handleChange} value={form.name} />
        <input name="email" placeholder="University email" onChange={handleChange} value={form.email} />
        <input name="password" type="password" placeholder="Password" minLength="5" onChange={handleChange} value={form.password} />
        <div className="twoCol">
          <input name="department" placeholder="Department" onChange={handleChange} value={form.department} />
          <input name="year" placeholder="Year" onChange={handleChange} value={form.year} />
        </div>
        <input name="profilePic" placeholder="Profile picture URL" onChange={handleChange} value={form.profilePic} />
        <select name="role" onChange={handleChange} value={form.role}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="button primary" type="submit">Register</button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
      {msg && <p className="status error">{msg}</p>}
    </main>
  );
};

export default Register;
