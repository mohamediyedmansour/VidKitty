import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token?: string) => void;
  logout: () => void;
  setLoggedIn: (v: boolean) => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'access_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setIsLoggedIn(!!token);
  }, []);

  const login = (token?: string) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, setLoggedIn: setIsLoggedIn, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
