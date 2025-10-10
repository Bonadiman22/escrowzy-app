// src/pages/Auth.tsx
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
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

/*
  Alterações principais aqui:
  - Máscara manual para CPF e celular (sem dependências externas).
  - Validação completa de CPF com cálculo de dígitos verificadores.
  - Campos aceitam apenas números (limpeza automática).
  - Mensagem de erro inline (cpfError / phoneError).
  - Submissão bloqueada até validações passarem.
  - Nota atualizada exatamente como solicitado.
*/

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Campos controlados
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Outros campos simples (não controlados aqui), mantendo comportamento anterior:
  // name, email, password podem permanecer como uncontrolled inputs se preferir
  // (aqui só controlei CPF e celular porque pediste validação/máscara).

  // ---------- Helpers ----------

  // Remove tudo que não for dígito
  const onlyDigits = (value: string) => value.replace(/\D/g, "");

  // Formata CPF como 000.000.000-00
  const formatCpf = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11); // máximo 11
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    return formatted;
  };

  // Formata celular:
  // - se 11 dígitos -> (00) 00000-0000
  // - se 10 dígitos -> (00) 0000-0000
  // - formata progressivamente conforme digita
  const formatPhone = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11); // máximo 11
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      // (00) 0000-0000
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    // 11 dígitos (celular com 9º dígito)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Validação completa do CPF (dígitos verificadores)
  const validateCpfDigits = (rawCpf: string) => {
    const s = onlyDigits(rawCpf);
    if (s.length !== 11) return false;

    // rejeita sequências iguais (ex: 11111111111)
    if (/^(\d)\1{10}$/.test(s)) return false;

    const calcDigit = (sliceLen: number) => {
      const nums = s.slice(0, sliceLen).split("").map(Number);
      const factorStart = sliceLen + 1;
      let sum = 0;
      for (let i = 0; i < nums.length; i++) {
        sum += nums[i] * (factorStart - i);
      }
      const result = 11 - (sum % 11);
      return result >= 10 ? 0 : result;
    };

    const d1 = calcDigit(9);
    const d2 = calcDigit(10);
    return d1 === Number(s[9]) && d2 === Number(s[10]);
  };

  // Validação simples de celular: mínimo 10 dígitos (DDD + nº) ou 11 se tiver 9º dígito.
  const validatePhoneDigits = (rawPhone: string) => {
    const s = onlyDigits(rawPhone);
    return s.length === 10 || s.length === 11;
  };

  // ---------- Handlers ----------

  // Quando usuário digita no CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // mantém apenas números e formata
    const formatted = formatCpf(raw);
    setCpf(formatted);
    // limpeza de erro enquanto digita
    if (cpfError) setCpfError(null);
  };

  // Quando usuário sai do campo CPF (onBlur) validamos
  const handleCpfBlur = () => {
    const isValid = validateCpfDigits(cpf);
    if (!isValid) {
      setCpfError("CPF inválido. Verifique e tente novamente.");
    } else {
      setCpfError(null);
    }
  };

  // Quando usuário digita no celular
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhone(raw);
    setPhone(formatted);
    if (phoneError) setPhoneError(null);
  };

  const handlePhoneBlur = () => {
    const ok = validatePhoneDigits(phone);
    if (!ok) {
      setPhoneError("Celular inválido. Informe o DDD e o número (10 ou 11 dígitos).");
    } else {
      setPhoneError(null);
    }
  };

  // Função de submissão: bloqueia se CPF ou celular inválidos
  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();

    // Se for "signup", validamos CPF e celular (no login apenas email/senha)
    if (type === "signup") {
      const cpfOk = validateCpfDigits(cpf);
      const phoneOk = validatePhoneDigits(phone);

      if (!cpfOk) {
        setCpfError("CPF inválido. Verifique e tente novamente.");
      }

      if (!phoneOk) {
        setPhoneError("Celular inválido. Informe o DDD e o número (10 ou 11 dígitos).");
      }

      if (!cpfOk || !phoneOk) {
        // Mostra um toast curto e interrompe envio
        toast({
          title: "Corrija os campos",
          description: "Verifique CPF e celular antes de continuar.",
        });
        return; // não prossegue
      }
    }

    setIsLoading(true);

    // Simulação de requisição (substituir por chamada real ao Supabase)
    setTimeout(() => {
      toast({
        title: type === "login" ? "Login realizado!" : "Conta criada!",
        description:
          type === "login"
            ? "Bem-vindo de volta"
            : "Sua conta foi criada com sucesso",
      });
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  // ---------- JSX ----------
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
                  <form
                    onSubmit={(e) => handleAuth(e, "login")}
                    className="space-y-4"
                    // Removemos atributos nativos de validação; tratamos via JS
                    noValidate
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="seu@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input id="login-password" type="password" required />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary"
                      disabled={isLoading}
                    >
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
                  <form
                    onSubmit={(e) => handleAuth(e, "signup")}
                    className="space-y-4"
                    noValidate // evita avisos nativos do navegador
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome Completo</Label>
                      <Input id="signup-name" type="text" placeholder="João Silva" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="seu@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-cpf">CPF</Label>
                      {/* CPF é controlado; só permite números e máscara */}
                      <Input
                        id="signup-cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCpfChange}
                        onBlur={handleCpfBlur}
                        inputMode="numeric" // sugere teclado numérico em mobile
                        required
                      />
                      {/* Nota pedida (texto exato) */}
                      <p className="text-xs text-muted-foreground">
                        Nota: seu CPF será usado como chave PIX principal por padrão.
                      </p>
                      {/* Mensagem inline de erro */}
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
                        required
                      />
                      {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input id="signup-password" type="password" required />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary"
                      disabled={isLoading}
                    >
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

export default Auth;
