import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  currentUser: { email: string; username: string } | undefined;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  currentUser: undefined,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState<{ email: string; username: string } | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthEffect running - Token:", localStorage.getItem("token"));
      if (localStorage.getItem("token")) {
        const email = localStorage.getItem("userEmail") || "user@example.com";
        const username = localStorage.getItem("username") || email.split("@")[0];
        setCurrentUser({ email, username });
      } else {
        setCurrentUser(undefined);
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    console.log("Attempting login with:", { email, password });
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      const { token } = response.data;
      console.log("Login response token:", token);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      const username = response.data.username || email.split("@")[0];
      localStorage.setItem("username", username);
      setCurrentUser({ email, username });
      console.log("Login completed, currentUser:", { email, username });
    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setLoading(true);
    console.log("Attempting signup with:", { email, password, username });
    try {
      const response = await axios.post(`${apiUrl}/api/auth/signup`, { email, password, username });
      const { token } = response.data;
      console.log("Signup response token:", token);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", username);
      setCurrentUser({ email, username });
      console.log("Signup completed, currentUser:", { email, username });
    } catch (err: any) {
      console.error("Signup error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out");
    setToken(null);
    setCurrentUser(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};