import React, { useState, useContext } from "react";
import { AuthContext } from "../../backend/src/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState(""); // CPF ADD
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, cpf , email, password);
      alert("Usuário registrado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao registrar usuário!");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
<input
  type="text"
  placeholder="Cpf"
  value={cpf} // 
  onChange={(e) => setCpf(e.target.value)}
/><br />
          <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
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
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
