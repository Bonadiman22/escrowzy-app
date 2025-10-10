// Importa os tipos necessários do Express
import { Request, Response, NextFunction } from "express";

// Importa o JWT para verificar tokens
import jwt from "jsonwebtoken";

// Importa o dotenv para carregar variáveis de ambiente do arquivo .env
import dotenv from "dotenv";

// Inicializa o dotenv (carrega variáveis do .env)
dotenv.config();

// Cria o middleware de autenticação
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Pega o cabeçalho de autorização (ex: "Bearer token_aqui")
  const authHeader = req.headers.authorization;

  // Se não tiver token no cabeçalho, retorna erro 401 (não autorizado)
  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido." });

  // Divide o cabeçalho em duas partes: "Bearer" e o token real
  // authHeader.split(" ")[1] pega apenas o token
  const token = authHeader.split(" ")[1];

  try {
    // Verifica e decodifica o token usando a chave secreta do .env
    // O "as" define o formato esperado do token decodificado
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "chave-secreta"
    ) as {
      id: string; 
      email: string;
    };

    // Adiciona o ID do usuário ao objeto de requisição
    // Dessa forma da para acessar req.userId em rotas protegidas
    (req as any).userId = decoded.id;

    // Continua para o próximo middleware ou rota
    next();
  } catch (error) {
    // Se o token for inválido ou expirado, retorna erro 401
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
