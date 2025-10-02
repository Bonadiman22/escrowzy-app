import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    gameMode: "",
    platform: "",
    tournamentType: "",
    rounds: "1",
    visibility: "private",
    maxPlayers: "4",
    entryFee: "",
    adjudicationMethod: "host",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Campeonato criado!",
      description: "Convite gerado. Compartilhe com os participantes.",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
                  <Label htmlFor="name">Nome do Campeonato</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Campeonato EA FC 25"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game">Jogo</Label>
                  <Select
                    value={formData.game}
                    onValueChange={(value) => setFormData({ ...formData, game: value, gameMode: "" })}
                  >
                    <SelectTrigger id="game">
                      <SelectValue placeholder="Selecione o jogo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ea-fc">EA FC</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.game === "ea-fc" && (
                  <div className="space-y-2">
                    <Label htmlFor="gameMode">Modo</Label>
                    <Select
                      value={formData.gameMode}
                      onValueChange={(value) => setFormData({ ...formData, gameMode: value })}
                    >
                      <SelectTrigger id="gameMode">
                        <SelectValue placeholder="Selecione o modo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ultimate-team">Ultimate Team</SelectItem>
                        <SelectItem value="pro-clubs">Pro Clubs</SelectItem>
                        <SelectItem value="torneio-equipes">Torneio entre Equipes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ps">PlayStation</SelectItem>
                      <SelectItem value="xbox">Xbox</SelectItem>
                      <SelectItem value="pc">PC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournamentType">Tipo de Campeonato</Label>
                  <Select
                    value={formData.tournamentType}
                    onValueChange={(value) => setFormData({ ...formData, tournamentType: value })}
                  >
                    <SelectTrigger id="tournamentType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="knockout">Mata-mata</SelectItem>
                      <SelectItem value="league">Pontos corridos</SelectItem>
                      <SelectItem value="groups-knockout">Grupos + Mata-mata</SelectItem>
                      <SelectItem value="round-robin">Round-robin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rounds">Número de Voltas</Label>
                    <Select
                      value={formData.rounds}
                      onValueChange={(value) => setFormData({ ...formData, rounds: value })}
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
                    <Label htmlFor="visibility">Visibilidade</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                    >
                      <SelectTrigger id="visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="private">Privado (link por convite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Número de Jogadores</Label>
                    <Select
                      value={formData.maxPlayers}
                      onValueChange={(value) => setFormData({ ...formData, maxPlayers: value })}
                    >
                      <SelectTrigger id="maxPlayers">
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
                    <Label htmlFor="entryFee">Valor por Jogador (R$)</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      placeholder="50.00"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjudicationMethod">Método de Decisão</Label>
                  <Select
                    value={formData.adjudicationMethod}
                    onValueChange={(value) => setFormData({ ...formData, adjudicationMethod: value })}
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
                        R$ {(Number(formData.entryFee) * Number(formData.maxPlayers) * 0.95).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taxa da plataforma: 5% (R$ {(Number(formData.entryFee) * Number(formData.maxPlayers) * 0.05).toFixed(2)})
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full gradient-primary">
                    Criar e Gerar Convite
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
