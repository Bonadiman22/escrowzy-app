import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { sequelize, testConnection } from "./config/db";
import { User } from "./models/User";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

// Inicializa o servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await testConnection();
  await sequelize.sync(); // cria tabelas automaticamente se não existirem
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
