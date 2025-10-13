import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Obter o usuário logado

  const [formData, setFormData] = useState({
    title: "", // Corresponde a 'title' na tabela tournaments
    description: "", // Usado para 'game' ou descrição do torneio
    gameMode: "",
    tournamentType: "",
    rounds: "1",
    public: false, // Corresponde a 'public' na tabela tournaments
    crossPlay: false,
    max_participants: "4", // Corresponde a 'max_participants' na tabela tournaments
    entry_free: "", // Corresponde a 'entry_free' na tabela tournaments
    adjudicationMethod: "host",
    starts_at: "", // Nova data de início
    ends_at: "", // Nova data de término
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um campeonato.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const newTournament = {
        owner_id: user.id,
        title: formData.title,
        description: formData.description, // Usando description para o campo de jogo/descrição
        entry_free: parseFloat(formData.entry_free),
        max_participants: parseInt(formData.max_participants),
        public: formData.public,
        created_at: new Date().toISOString(),
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: new Date(formData.ends_at).toISOString(),
        status: "pending", // Status inicial
        // Outros campos do formulário que não mapeiam diretamente para a tabela 'tournaments' podem ser armazenados em uma coluna JSONB se necessário, ou em tabelas relacionadas.
      };

      const { data, error } = await supabase
        .from("tournaments")
        .insert([newTournament])
        .select();

      if (error) throw error;

      toast({
        title: "Campeonato criado com sucesso!",
        description: "Convite gerado. Compartilhe com os participantes.",
      });

      // Redirecionar para a página de detalhes do torneio recém-criado
      if (data && data.length > 0) {
        navigate(`/tournament/${data[0].id}`);
      } else {
        navigate("/dashboard");
      }

    } catch (err: any) {
      console.error("Erro ao criar campeonato:", err.message);
      toast({
        title: "Erro ao criar campeonato",
        description: err.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePrizePool = () => {
    const entryFee = parseFloat(formData.entry_free);
    const maxPlayers = parseInt(formData.max_participants);
    if (isNaN(entryFee) || isNaN(maxPlayers) || entryFee <= 0 || maxPlayers <= 0) {
      return "0.00";
    }
    // Assumindo 5% de taxa da plataforma
    return (entryFee * maxPlayers * 0.95).toFixed(2);
  };

  const calculatePlatformFee = () => {
    const entryFee = parseFloat(formData.entry_free);
    const maxPlayers = parseInt(formData.max_participants);
    if (isNaN(entryFee) || isNaN(maxPlayers) || entryFee <= 0 || maxPlayers <= 0) {
      return "0.00";
    }
    return (entryFee * maxPlayers * 0.05).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} /> {/* Passa isAuthenticated baseado no user */}
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="max-w-2xl mx-auto animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Criar Campeonato</h1>
          <p className="text-muted-foreground mb-8">
            Configure seu torneio e convide os participantes
          </p>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Informações do Campeonato</CardTitle>
              <CardDescription>
                Preencha os detalhes para criar seu torneio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Nome do Campeonato</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Campeonato EA FC 25"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Jogo / Descrição Breve</Label>
                  <Input
                    id="description"
                    placeholder="Ex: EA FC 25 - Ultimate Team"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Campos para data de início e término */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="starts_at">Data de Início</Label>
                    <Input
                      id="starts_at"
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ends_at">Data de Término</Label>
                    <Input
                      id="ends_at"
                      type="datetime-local"
                      value={formData.ends_at}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournamentType">Tipo de Campeonato</Label>
                  <Select
                    value={formData.tournamentType}
                    onValueChange={(value) => handleSelectChange("tournamentType", value)}
                  >
                    <SelectTrigger id="tournamentType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="knockout">Mata-mata</SelectItem>
                      <SelectItem value="league">Pontos corridos</SelectItem>
                      <SelectItem value="groups-knockout">Grupos + Mata-mata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rounds">Número de Voltas</Label>
                    <Select
                      value={formData.rounds}
                      onValueChange={(value) => handleSelectChange("rounds", value)}
                    >
                      <SelectTrigger id="rounds">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 volta</SelectItem>
                        <SelectItem value="2">2 voltas (Ida e volta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="public">Visibilidade</Label>
                    <Select
                      value={formData.public ? "public" : "private"}
                      onValueChange={(value) => handleSwitchChange("public", value === "public")}
                    >
                      <SelectTrigger id="public">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="private">Privado (link por convite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="crossPlay"
                    checked={formData.crossPlay}
                    onCheckedChange={(checked) => handleSwitchChange("crossPlay", checked)}
                  />
                  <Label htmlFor="crossPlay" className="cursor-pointer">
                    Cross-play habilitado
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">Número de Jogadores</Label>
                    <Select
                      value={formData.max_participants}
                      onValueChange={(value) => handleSelectChange("max_participants", value)}
                    >
                      <SelectTrigger id="max_participants">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 jogadores</SelectItem>
                        <SelectItem value="4">4 jogadores</SelectItem>
                        <SelectItem value="8">8 jogadores</SelectItem>
                        <SelectItem value="16">16 jogadores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry_free">Valor por Jogador (R$)</Label>
                    <Input
                      id="entry_free"
                      type="number"
                      placeholder="50.00"
                      value={formData.entry_free}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjudicationMethod">Método de Decisão</Label>
                  <Select
                    value={formData.adjudicationMethod}
                    onValueChange={(value) => handleSelectChange("adjudicationMethod", value)}
                  >
                    <SelectTrigger id="adjudicationMethod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="host">Host/Árbitro Manual</SelectItem>
                      <SelectItem value="ai">Análise por IA (automática)</SelectItem>
                      <SelectItem value="hybrid">Híbrido (IA + confirmação do host)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {formData.adjudicationMethod === "host"
                      ? "Você decidirá o vencedor manualmente"
                      : formData.adjudicationMethod === "ai"
                      ? "IA analisará evidências automaticamente"
                      : "IA sugere o vencedor e você confirma"}
                  </p>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Premiação Total</span>
                      <span className="text-2xl font-bold text-primary">
                        R$ {calculatePrizePool()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taxa da plataforma: 5% (R$ {calculatePlatformFee()})
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full gradient-primary" disabled={loading}>
                    {loading ? "Criando..." : "Criar e Gerar Convite"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateTournament;