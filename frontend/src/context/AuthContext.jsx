import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest, getCurrentUser } from '../services/authService';
import { getStoredUser, getToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    const loadUser = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (form) => {
    const data = await loginRequest(form);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (form) => {
    const data = await registerRequest(form);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
