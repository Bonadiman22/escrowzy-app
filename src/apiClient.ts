import axios from "axios";

// Configura uma instância base do Axios
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // URL base do backend
  withCredentials: true, // Permitir envio de cookies, se necessário
});

export default apiClient;