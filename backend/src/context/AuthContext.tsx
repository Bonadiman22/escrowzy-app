import React, { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "../api/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string,cpf:string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Recupera o usuário logado se existir token salvo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data.user);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
