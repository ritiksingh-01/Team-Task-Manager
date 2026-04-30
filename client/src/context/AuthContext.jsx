import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);
const storageKey = 'team-task-session';

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  });

  const authenticate = async (mode, payload) => {
    const data = mode === 'signup' ? await api.signup(payload) : await api.login(payload);
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSession(data);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      isAdmin: session?.user?.role === 'Admin',
      authenticate,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
