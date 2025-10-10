import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Conexão com o banco de dados MySQL
export const sequelize = new Sequelize(
  process.env.DB_NAME || "escrowzy",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false, // não exibe logs no terminal
  }
);

// Testa a conexão
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
  }
};
