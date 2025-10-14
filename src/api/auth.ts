import apiClient from "@/pages/apiClient";

// Função para registrar um usuário
export const registerUser = async (userData: {
  name: string;
  cpf: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

// Função para fazer login
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// Função para obter o perfil do usuário logado
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    throw error;
  }
};