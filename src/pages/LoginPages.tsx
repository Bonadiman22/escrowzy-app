import React, { useState, useContext } from "react";
import { AuthContext } from "../../backend/src/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/profile");
    } catch (error) {
      alert("Erro ao fazer login!");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Entrar</button>
      </form>
      <p onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
        Não tem conta? Cadastre-se
      </p>
    </div>
  );
}
