import axios from "axios";

// Define a URL base do backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL do backend
});

// Intercepta requisições para adicionar o token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
