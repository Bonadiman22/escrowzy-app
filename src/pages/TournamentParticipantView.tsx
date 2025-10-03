import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { 
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  MapPin,
  AlertCircle
} from "lucide-react";
import { TournamentBracket } from "@/components/TournamentBracket";
import { TournamentTable } from "@/components/TournamentTable";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  startDate: "2024-01-20T14:00:00",
  location: "Online - Discord",
};

const TournamentParticipantView = () => {
  const { id } = useParams();
  const [tournament] = useState(mockTournament);
  const [participants] = useState<Participant[]>(mockParticipants);
  
  // Simular usuário atual
  const currentUser = participants[0];
  const isUserPaid = currentUser.paymentStatus === "paid";

  const availableSlots = tournament.maxPlayers - participants.length;

  const getStatusBadge = () => {
    if (tournament.status === "pending") {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Aguardando Início</Badge>;
    }
    if (tournament.status === "active") {
      return <Badge className="bg-success/10 text-success border-success/20">Em Andamento</Badge>;
    }
    return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Finalizado</Badge>;
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
            {getStatusBadge()}
          </div>
        </div>

        {/* Payment Status Alert */}
        {!isUserPaid && (
          <Alert className="mb-6 border-warning bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              Seu pagamento está pendente. Complete o pagamento para confirmar sua participação.
              <Button variant="outline" size="sm" className="ml-4">
                Realizar Pagamento
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Premiação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">R$ {tournament.prizePool}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Taxa: R$ {tournament.entryFee}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{participants.length}/{tournament.maxPlayers}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {availableSlots} vagas disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-success" />
                Início
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(tournament.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-warning" />
                Local
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{tournament.location}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Informações enviadas por email
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Participants List */}
        <Card className="glass-card mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle>Participantes Inscritos</CardTitle>
            <CardDescription>Jogadores confirmados neste campeonato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div 
                  key={participant.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    participant.id === currentUser.id 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">
                        {participant.name}
                        {participant.id === currentUser.id && (
                          <span className="ml-2 text-sm text-primary">(Você)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">@{participant.gamertag}</p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      participant.paymentStatus === "paid"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {participant.paymentStatus === "paid" ? "Confirmado" : "Pendente"}
                  </Badge>
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
            <CardTitle>Chaveamento do Campeonato</CardTitle>
            <CardDescription>
              {tournament.mode === "Mata-mata" 
                ? "Visualize as partidas e acompanhe os confrontos" 
                : "Tabela de classificação do torneio"}
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

export default TournamentParticipantView;
