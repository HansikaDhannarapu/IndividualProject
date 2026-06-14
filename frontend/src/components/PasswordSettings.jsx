import React, { useState } from 'react';
import { changePassword } from '../services/authService';
import StatusMessage from './StatusMessage';

const PasswordSettings = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await changePassword(form);
      setForm({ currentPassword: '', newPassword: '' });
      setTone('');
      setStatus('Password updated successfully');
    } catch (err) {
      setTone('error');
      setStatus(err.message);
    }
  };

  return (
    <section className="passwordPanel">
      <h2>Password</h2>
      <p className="meta">Your current password cannot be shown. Confirm it here to set a new one.</p>
      <form className="form" onSubmit={handleSubmit}>
        <input
          name="currentPassword"
          onChange={handleChange}
          placeholder="Current password"
          type="password"
          value={form.currentPassword}
        />
        <input
          minLength="5"
          name="newPassword"
          onChange={handleChange}
          placeholder="New password"
          type="password"
          value={form.newPassword}
        />
        <button className="button primary" type="submit">Update password</button>
      </form>
      <StatusMessage tone={tone}>{status}</StatusMessage>
    </section>
  );
};

export default PasswordSettings;
