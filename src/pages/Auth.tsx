// Bonadiman22/escrowzy-app/src/pages/Auth.tsx
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
  ALTERAÇÕES PRINCIPAIS:
  - Removi todos os imports e UI relacionados ao Select (Tipo de Chave PIX).
  - Removi o campo "Chave PIX" do formulário.
  - Adicionei uma nota logo abaixo do campo CPF informando que o CPF
    será utilizado como chave PIX principal por padrão.
  - Mantive o resto do layout e do funcionamento do "mock" de autenticação.
*/

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // handleAuth: função simulada que mostra um toast e redireciona ao dashboard.
  // Em produção você substituirá por chamadas reais de API (Supabase Auth, por exemplo).
  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setIsLoading(true);

    // Simulamos requisição assíncrona com setTimeout
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

            {/* ---------- LOGIN ---------- */}
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
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                      />
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

            {/* ---------- SIGNUP / CRIAR CONTA ---------- */}
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
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome Completo</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="João Silva"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      {/* IMPORTANTE: campo CPF agora contém a nota explicativa sobre PIX */}
                      <Label htmlFor="signup-cpf">CPF</Label>
                      <Input
                        id="signup-cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        required
                      />
                      {/* Nota clara para o usuário */}
                      <p className="text-xs text-muted-foreground">
                        Nota: seu CPF será usado como chave PIX principal por
                        padrão. Você poderá alterá-lo posteriormente nas
                        configurações da conta, se necessário.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Celular</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="(11) 98765-4321"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input id="signup-password" type="password" required />
                    </div>

                    {/* 
                      REMOVIDOS:
                      - Campo "Tipo de Chave PIX"
                      - Campo "Chave PIX"
                      Conforme solicitado, agora o CPF será usado como chave PIX.
                    */}

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
