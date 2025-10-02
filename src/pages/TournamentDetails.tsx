import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { 
  Copy, 
  Share2, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  UserPlus,
  Mail
} from "lucide-react";
import { TournamentBracket } from "@/components/TournamentBracket";
import { TournamentTable } from "@/components/TournamentTable";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  gamertag: string;
  avatar: string;
  paymentStatus: "pending" | "paid" | "forfeit";
  joinedAt: string;
}

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "João Silva",
    gamertag: "joao_pro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    paymentStatus: "paid",
    joinedAt: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    name: "Maria Santos",
    gamertag: "maria_gamer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    paymentStatus: "paid",
    joinedAt: "2024-01-15T11:45:00",
  },
  {
    id: "3",
    name: "Pedro Costa",
    gamertag: "pedro_master",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    paymentStatus: "pending",
    joinedAt: "2024-01-15T14:20:00",
  },
];

const mockTournament = {
  id: "1",
  name: "Campeonato EA FC 25",
  game: "EA FC 25",
  mode: "Mata-mata",
  visibility: "Público",
  maxPlayers: 8,
  entryFee: 50,
  prizePool: 400,
  status: "pending" as const,
  createdAt: "2024-01-15",
  inviteLink: "https://escrowzy.com/t/abc123xyz",
};

const TournamentDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [tournament] = useState(mockTournament);
  const [participants] = useState<Participant[]>(mockParticipants);

  const paidCount = participants.filter(p => p.paymentStatus === "paid").length;
  const pendingCount = participants.filter(p => p.paymentStatus === "pending").length;
  const availableSlots = tournament.maxPlayers - participants.length;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(tournament.inviteLink);
    toast({
      title: "Link copiado!",
      description: "Link de convite copiado para a área de transferência.",
    });
  };

  const shareWhatsApp = () => {
    const message = `Participe do ${tournament.name}! Acesse: ${tournament.inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const getPaymentStatusBadge = (status: Participant["paymentStatus"]) => {
    const variants = {
      paid: { label: "Pago", className: "bg-success/10 text-success border-success/20" },
      pending: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
      forfeit: { label: "Desistiu", className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-muted-foreground">
                {tournament.game} • {tournament.mode} • {tournament.visibility}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Editar
              </Button>
              <Button variant="outline" size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          {/* Invite Link Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Link de Convite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <code className="text-sm flex-1 truncate">{tournament.inviteLink}</code>
                <Button size="sm" variant="ghost" onClick={copyInviteLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={shareWhatsApp}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Convidar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Participants Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total inscritos</span>
                  <span className="font-semibold">{participants.length}/{tournament.maxPlayers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Confirmados (Pagos)
                  </span>
                  <span className="font-semibold text-success">{paidCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4 text-warning" />
                    Aguardando pagamento
                  </span>
                  <span className="font-semibold text-warning">{pendingCount}</span>
                </div>
              </div>
              {tournament.visibility === "Público" && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Vagas disponíveis</p>
                  <p className="text-2xl font-bold text-primary">{availableSlots}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrada</span>
                  <span className="font-semibold">R$ {tournament.entryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arrecadado</span>
                  <span className="font-semibold text-success">R$ {paidCount * tournament.entryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premiação total</span>
                  <span className="font-semibold text-primary">R$ {tournament.prizePool}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Pagamentos confirmados</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all"
                    style={{ width: `${(paidCount / tournament.maxPlayers) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants List */}
        <Card className="glass-card mb-8 animate-slide-up">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lista de Participantes</CardTitle>
                <CardDescription>Gerencie os jogadores inscritos no campeonato</CardDescription>
              </div>
              {tournament.visibility === "Privado" && (
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Convites
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div 
                  key={participant.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">@{participant.gamertag}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-muted-foreground">Inscrito em</p>
                      <p className="text-sm font-medium">
                        {new Date(participant.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getPaymentStatusBadge(participant.paymentStatus)}
                    <Button size="sm" variant="ghost">
                      •••
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: availableSlots }).map((_, index) => (
                <div 
                  key={`empty-${index}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-dashed bg-muted/30"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Vaga disponível</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tournament Visualization */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle>Visualização do Campeonato</CardTitle>
            <CardDescription>
              {tournament.mode === "Mata-mata" 
                ? "Chaveamento e grupos do torneio" 
                : "Tabela de classificação e pontuação"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tournament.mode === "Mata-mata" ? (
              <TournamentBracket participants={participants} maxPlayers={tournament.maxPlayers} />
            ) : (
              <TournamentTable participants={participants} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TournamentDetails;
