import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// O import abaixo foi removido para resolver o erro de compilação
// import { Navbar } from "@/components/Navbar"; 
import { useToast } from "@/hooks/use-toast";
// import { api } from "@/lib/api"; // Removido: O objeto 'api' não é usado na função handleAuth (que usa setTimeout para simular a resposta) e estava a causar o erro de compilação persistente.

// Componente Navbar simples definido localmente para evitar o erro de resolução de alias de caminho.
const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">App Financeiro</h1>
      </div>
    </header>
  );
};

/*
  Melhorias realizadas:
  - Validação de todos os campos obrigatórios no signup (nome, email, cpf, celular, senha).
  - Máscara para CPF e celular (sem libs externas).
  - Validação completa do CPF (cálculo de dígitos).
  - Erros inline para cada campo; foco no primeiro inválido.
  - Submissão bloqueada até todos os campos estarem válidos.
  - Mantivemos noValidate para evitar balões nativos do navegador.
*/

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // --- Signup state (campos controlados para validação) ---
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- Helpers de formatação e validação ---

  const onlyDigits = (value: string) => value.replace(/\D/g, "");

  // Formata CPF progressivamente: 000.000.000-00
  const formatCpf = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length > 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length > 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    return digits;
  };

  // Formata celular progressivamente
  const formatPhone = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`; // 11 dígitos
  };

  // Validação CPF com cálculo de dígitos verificadores
  const validateCpfDigits = (rawCpf: string) => {
    const s = onlyDigits(rawCpf);
    if (s.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(s)) return false; // rejeita sequências iguais

    const calcDigit = (sliceLen: number) => {
      const nums = s.slice(0, sliceLen).split("").map(Number);
      const factorStart = sliceLen + 1;
      let sum = 0;
      for (let i = 0; i < nums.length; i++) sum += nums[i] * (factorStart - i);
      const result = 11 - (sum % 11);
      return result >= 10 ? 0 : result;
    };

    const d1 = calcDigit(9);
    const d2 = calcDigit(10);
    return d1 === Number(s[9]) && d2 === Number(s[10]);
  };

  // Validação celular: 10 ou 11 dígitos (DDD + número)
  const validatePhoneDigits = (rawPhone: string) => {
    const s = onlyDigits(rawPhone);
    return s.length === 10 || s.length === 11;
  };

  // Validação email simples
  const validateEmail = (value: string) => {
    // Regex simples e eficiente para maioria dos emails
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Validação senha (exemplo: mínimo 6 caracteres)
  const validatePassword = (value: string) => value.length >= 6;

  // --- Handlers de input (mantêm apenas dígitos em cpf e phone) ---
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    if (cpfError) setCpfError(null);
  };

  const handleCpfBlur = () => {
    if (cpf === "") {
      setCpfError("CPF é obrigatório.");
      return;
    }
    if (!validateCpfDigits(cpf)) setCpfError("CPF inválido. Verifique e tente novamente.");
    else setCpfError(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (phoneError) setPhoneError(null);
  };

  const handlePhoneBlur = () => {
    if (phone === "") {
      setPhoneError("Celular é obrigatório.");
      return;
    }
    if (!validatePhoneDigits(phone)) setPhoneError("Celular inválido. Informe DDD + número (10 ou 11 dígitos).");
    else setPhoneError(null);
  };

  // Outros campos - handlers
  const handleNameBlur = () => {
    if (!name.trim()) setNameError("Nome é obrigatório.");
    else setNameError(null);
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError("Email é obrigatório.");
      return;
    }
    if (!validateEmail(email)) setEmailError("Email inválido.");
    else setEmailError(null);
  };

  const handlePasswordBlur = () => {
    if (!password) setPasswordError("Senha é obrigatória.");
    else if (!validatePassword(password)) setPasswordError("A senha deve ter ao menos 6 caracteres.");
    else setPasswordError(null);
  };

  // --- Valida tudo e foca o primeiro inválido ---
  const validateAllSignup = () => {
    const errors: Array<{ fieldId: string; message: string }> = [];

    if (!name.trim()) errors.push({ fieldId: "signup-name", message: "Nome é obrigatório." });
    if (!email.trim()) errors.push({ fieldId: "signup-email", message: "Email é obrigatório." });
    else if (!validateEmail(email)) errors.push({ fieldId: "signup-email", message: "Email inválido." });

    if (!cpf.trim()) errors.push({ fieldId: "signup-cpf", message: "CPF é obrigatório." });
    else if (!validateCpfDigits(cpf)) errors.push({ fieldId: "signup-cpf", message: "CPF inválido." });

    if (!phone.trim()) errors.push({ fieldId: "signup-phone", message: "Celular é obrigatório." });
    else if (!validatePhoneDigits(phone)) errors.push({ fieldId: "signup-phone", message: "Celular inválido." });

    if (!password) errors.push({ fieldId: "signup-password", message: "Senha é obrigatória." });
    else if (!validatePassword(password)) errors.push({ fieldId: "signup-password", message: "A senha deve ter ao menos 6 caracteres." });

    // Atualiza estados de erro inline para mostrar mensagens perto de cada campo
    setNameError(errors.find((e) => e.fieldId === "signup-name")?.message ?? null);
    setEmailError(errors.find((e) => e.fieldId === "signup-email")?.message ?? null);
    setCpfError(errors.find((e) => e.fieldId === "signup-cpf")?.message ?? null);
    setPhoneError(errors.find((e) => e.fieldId === "signup-phone")?.message ?? null);
    setPasswordError(errors.find((e) => e.fieldId === "signup-password")?.message ?? null);

    // If any, focus the first invalid
    if (errors.length > 0) {
      const first = errors[0];
      const el = document.getElementById(first.fieldId) as HTMLInputElement | null;
      if (el) el.focus();
    }

    return errors.length === 0;
  };

  // --- Submissão (login/signup) ---
  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();

    let payload: Record<string, string> = {};
    const apiEndpoint = type === "signup" ? "/api/auth/signup" : "/api/auth/login";

    if (type === "signup") {
      const ok = validateAllSignup();
      if (!ok) {
        toast({
          title: "Corrija os campos",
          description: "Por favor verifique os campos destacados antes de continuar.",
        });
        return;
      }
      // Prepara payload de registo (signup)
      payload = {
        name,
        email: email.trim(),
        cpf: onlyDigits(cpf), // Envia apenas dígitos
        phone: onlyDigits(phone), // Envia apenas dígitos
        password,
      };
    } else {
      // Login: validações simples e recolha de dados do DOM
      const loginEmail = (document.getElementById("login-email") as HTMLInputElement | null)?.value ?? "";
      const loginPassword = (document.getElementById("login-password") as HTMLInputElement | null)?.value ?? "";

      if (!loginEmail || !loginPassword) {
        toast({
          title: "Preencha email e senha",
          description: "É necessário informar email e senha para entrar.",
        });
        // foca campo vazio
        if (!loginEmail) (document.getElementById("login-email") as HTMLInputElement | null)?.focus();
        else (document.getElementById("login-password") as HTMLInputElement | null)?.focus();
        return;
      }
      // Prepara payload de login
      payload = {
        email: loginEmail,
        password: loginPassword,
      };
    }

    setIsLoading(true);

    try {
      // Chamada real à API (endpoints fictícios)
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Trata erros de resposta do servidor (ex: 400 Bad Request, 401 Unauthorized)
      if (!response.ok) {
        let errorMessage = "Ocorreu um erro no servidor.";
        try {
          const errorData = await response.json();
          // Assume que a API retorna um objeto JSON com uma propriedade 'message'
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Fallback para o status text em caso de resposta não-JSON
          errorMessage = `${response.status}: ${response.statusText}`;
        }

        toast({
          title: type === "login" ? "Falha na Autenticação" : "Falha no Registo",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Sucesso (Resposta 2xx)
      const data = await response.json();
      console.log("Auth Success:", data); 
      
      // Ação: Salvar token e redirecionar
      // Em uma aplicação real, você salvaria o token/dados do utilizador aqui (e.g., em um Contexto ou Redux)

      toast({
        title: type === "login" ? "Login realizado!" : "Conta criada!",
        description:
          type === "login"
            ? "Bem-vindo de volta! Redirecionando..."
            : "Sua conta foi criada com sucesso! Redirecionando...",
      });
      navigate("/dashboard");

    } catch (error) {
      // Trata erros de rede (ex: servidor offline, falha de conexão)
      console.error("Authentication failed:", error);
      toast({
        title: "Erro de Comunicação",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX ---
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto animate-slide-up">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Bem-vindo de volta</CardTitle>
                  <CardDescription>Entre com suas credenciais</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="seu@email.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input id="login-password" type="password" />
                    </div>

                    <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Criar Conta</CardTitle>
                  <CardDescription>Cadastre-se para começar</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-4" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome Completo</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="João Silva"
                        value={name}
                        onChange={(ev) => { setName(ev.target.value); if (nameError) setNameError(null); }}
                        onBlur={handleNameBlur}
                        aria-invalid={!!nameError}
                      />
                      {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(ev) => { setEmail(ev.target.value); if (emailError) setEmailError(null); }}
                        onBlur={handleEmailBlur}
                        aria-invalid={!!emailError}
                      />
                      {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-cpf">CPF</Label>
                      <Input
                        id="signup-cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCpfChange}
                        onBlur={handleCpfBlur}
                        inputMode="numeric"
                        aria-invalid={!!cpfError}
                      />
                      <p className="text-xs text-muted-foreground">
                        Nota: seu CPF será usado como chave PIX principal por padrão.
                      </p>
                      {cpfError && <p className="text-sm text-red-500 mt-1">{cpfError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Celular</Label>
                      <Input
                        id="signup-phone"
                        type="text"
                        placeholder="(11) 98765-4321"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        inputMode="tel"
                        aria-invalid={!!phoneError}
                      />
                      {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="min 6 caracteres"
                        value={password}
                        onChange={(ev) => { setPassword(ev.target.value); if (passwordError) setPasswordError(null); }}
                        onBlur={handlePasswordBlur}
                        aria-invalid={!!passwordError}
                      />
                      {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                    </div>

                    <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                      {isLoading ? "Criando..." : "Criar Conta"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};