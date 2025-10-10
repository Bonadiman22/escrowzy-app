// Importa os tipos de Request e Response do Express
import { Request, Response } from "express";

// Importa o bcrypt para fazer hash e comparar senhas
import bcrypt from "bcrypt";

// Importa o JWT para gerar tokens de autenticação
import jwt from "jsonwebtoken";

// Importa o pool de conexão com o banco de dados Postgre
import { pool } from "../db";

// Importa o UUID para gerar identificadores únicos
import { v4 as uuid } from "uuid";


// Função: Registrar usuário
export async function register(req: Request, res: Response) {
  try {
    // Extrai dados enviados no corpo da requisição
    const { email, cpf, password, name } = req.body;

    // Verifica se os campos obrigatórios foram enviados
    if (!email || !cpf || !password)
      return res
        .status(400)
        .json({ error: "Email e Cpf são obrigatórios" });

    // Faz o hash da senha (com 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 8);

    // Gera um UUID para o novo usuário
    const id = uuid();

// 1. Verifica se o cpf já existe no banco de dados 
const checkCpf = await pool.query("SELECT id FROM users WHERE cpf=$1", [cpf]);
if (checkCpf.rowCount > 0)
    return res.status(400).json({ error: "Cpf já cadastrado" });

// 2. Verifica se o email já existe no banco de dados
const checkEmail = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
if (checkEmail.rowCount > 0)
    return res.status(400).json({ error: "Email já cadastrado" });

// Se tudo estiver OK, o código continua para o cadastro
    // Insere o novo usuário no banco de dados
    await pool.query(
      "INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4 ,$5)",
      [id, email, hashedPassword, cpf , name || null]
    );

    // Retorna sucesso
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    // Captura qualquer erro e retorna mensagem genérica
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
}


// Função: Login do usuário
export async function login(req: Request, res: Response) {
  try {
    // Extrai email e senha do corpo da requisição
    const { email, password } = req.body;

    // Busca o usuário no banco de dados pelo email
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    // Se não encontrar o usuário, retorna erro
    if (userRes.rowCount === 0)
      return res.status(401).json({ error: "Email invalido" });

    // Armazena os dados do usuário encontrado
    const user = userRes.rows[0];

    // Compara a senha informada com a senha salva no banco
    const valid = await bcrypt.compare(password, user.password);

    // Se a senha for incorreta, retorna erro
    if (!valid)
      return res.status(401).json({ error: "Senha inválida" });

    // Gera o token JWT com ID do usuário
    // Expira em 7 dias 
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "chave-secreta",
      { expiresIn: "7d" }
    );

    // Retorna o token e informações básicas do usuário
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    // Captura qualquer erro e loga no terminal
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no login" });
  }
}
