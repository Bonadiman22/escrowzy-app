import React, { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "../api/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, cpf: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Recupera o usuário logado se existir token salvo
  useEffect(() => {
    const token = getToken();
    if (token) loadProfile();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const setToken = (token: string) => localStorage.setItem("token", token);

  const removeToken = () => localStorage.removeItem("token");

  const loadProfile = async () => {
    try {
      const { data } = await api.get<AuthResponse>("/auth/profile");
      setUser(data.user);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios.");
      }
      const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (name: string, cpf: string, email: string, password: string) => {
    try {
      if (!name || !cpf || !email || !password) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      await api.post("/auth/register", { name, cpf, email, password });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
