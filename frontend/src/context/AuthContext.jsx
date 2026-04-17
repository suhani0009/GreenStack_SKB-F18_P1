import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: "greenstack_token",
  user: "greenstack_user",
  company: "greenstack_company",
};

const readJson = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState(() => readJson(STORAGE_KEYS.user));
  const [company, setCompany] = useState(() => readJson(STORAGE_KEYS.company));

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("greenstack:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("greenstack:unauthorized", handleUnauthorized);
  }, []);

  const persistSession = (session) => {
    localStorage.setItem(STORAGE_KEYS.token, session.token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
    localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(session.company));
    setToken(session.token);
    setUser(session.user);
    setCompany(session.company);
  };

  const login = async (payload) => {
    const session = await api.auth.login(payload);
    persistSession(session);
    return session;
  };

  const signup = async (payload) => {
    const session = await api.auth.signup(payload);
    persistSession(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.company);
    setToken(null);
    setUser(null);
    setCompany(null);
  };

  const value = {
    token,
    user,
    company,
    isAuthenticated: Boolean(token),
    login,
    signup,
    logout,
    setCompany,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
