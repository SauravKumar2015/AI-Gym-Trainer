import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";
import apiClient from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("fitai_token") || null,
  );
  const [loading, setLoading] = useState(true);
  const [healthOk, setHealthOk] = useState(null);

  // Check API health
  useEffect(() => {
    authService
      .checkHealth()
      .then(() => setHealthOk(true))
      .catch(() => setHealthOk(false));
  }, []);

  // Rehydrate user from stored token on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile(token);
          setUser(profile);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []); // eslint-disable-line

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("fitai_token", t);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  const login = useCallback(async (email, password) => {
    const { token: t } = await authService.login(email, password);
    const profile = await authService.getProfile(t);
    saveToken(t);
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (payload) => {
    const { token: t } = await authService.register(payload);
    const profile = await authService.getProfile(t);
    saveToken(t);
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fitai_token");
    delete apiClient.defaults.headers.common["Authorization"];
  }, []);

  const updateUser = useCallback((updated, newToken) => {
    setUser(updated);
    if (newToken) saveToken(newToken);
  }, []);

  const value = {
    user,
    token,
    loading,
    healthOk,
    login,
    register,
    logout,
    updateUser,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
