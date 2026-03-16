import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [technicianProfile, setTechnicianProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("sm_token");
    if (token) {
      API.get("/auth/me")
        .then((res) => {
          setUser(res.data.data.user);
          setTechnicianProfile(res.data.data.technicianProfile || null);
        })
        .catch(() => {
          localStorage.removeItem("sm_token");
          localStorage.removeItem("sm_user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("sm_token", token);
    localStorage.setItem("sm_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sm_token");
    localStorage.removeItem("sm_user");
    setUser(null);
    setTechnicianProfile(null);
  };

  const refreshUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.data.user);
      setTechnicianProfile(res.data.data.technicianProfile || null);
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, technicianProfile, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
