import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { sequelize, testConnection } from "./config/db";
import { User } from "./models/User";

dotenv.config();

const app = express();

// 🧱 Middlewares globais
app.use(express.json());

// ✅ Configuração do CORS para permitir comunicação com o front
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

// 🛠️ Rotas principais (autenticação)
app.use("/api/auth", authRoutes);

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await testConnection(); // Testa conexão com o banco
    await sequelize.sync(); // Cria tabelas se não existirem
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
  }
});
