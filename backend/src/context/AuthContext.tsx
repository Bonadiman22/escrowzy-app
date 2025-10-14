import React, { createContext, useContext, useState } from "react";

// Minimal, framework-agnostic auth context used only by legacy pages.
// This removes Firebase dependencies and fixes type errors.

export type AppUser = { id: string; name: string; email: string };

export interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, cpf: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const login = async (email: string, _password: string) => {
    // Mock simple login for legacy pages
    setUser({ id: "mock-user", name: email.split("@")[0] || "User", email });
  };

  const register = async (name: string, _cpf: string, email: string, _password: string) => {
    // Mock simple register
    setUser({ id: "mock-user", name: name || email.split("@")[0] || "User", email });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
