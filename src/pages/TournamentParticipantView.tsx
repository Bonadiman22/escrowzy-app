import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { TournamentBracket } from "@/components/TournamentBracket";
import { TournamentTable } from "@/components/TournamentTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Tipagem para o Torneio (baseado na tabela 'tournaments')
interface Tournament {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  entry_free: number;
  max_participants: number;
  public: boolean;
  created_at: string;
  starts_at: string;
  ends_at: string;
  status: "pending" | "active" | "completed" | "cancelled";
}

// Tipagem para o Participante (join de 'participants' e 'profiles')
interface Participant {
  id: string; // ID da tabela 'participants'
  user_id: string;
  joined_at: string;
  status: "pending" | "accepted" | "declined"; // Status da participação
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

const TournamentParticipantView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserParticipating, setIsUserParticipating] = useState(false);
  const [userParticipationStatus, setUserParticipationStatus] = useState<"pending" | "accepted" | "declined" | null>(null);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      if (!id) {
        setError("ID do torneio não encontrado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Buscar detalhes do torneio
        const { data: tournamentData, error: tournamentError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single();

        if (tournamentError) throw tournamentError;
        setTournament(tournamentData);

        // 2. Buscar participantes do torneio
        const { data: participantsData, error: participantsError } = await supabase
          .from("participants")
          .select(`
            id,
            user_id,
            joined_at,
            status,
            profiles (full_name, avatar_url)
          `)
          .eq("tournament_id", id);

        if (participantsError) throw participantsError;
        setParticipants(participantsData as Participant[]);

        // Verificar se o usuário atual está participando
        if (user) {
          const currentUserParticipant = (participantsData as Participant[]).find(p => p.user_id === user.id);
          if (currentUserParticipant) {
            setIsUserParticipating(true);
            setUserParticipationStatus(currentUserParticipant.status);
          }
        }

      } catch (err: any) {
        console.error("Erro ao buscar detalhes do torneio:", err.message);
        setError("Não foi possível carregar os detalhes do torneio.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id, user]);

  const handleJoinTournament = async () => {
    if (!user || !tournament) return;

    try {
      const { error } = await supabase.from("participants").insert({
        tournament_id: tournament.id,
        user_id: user.id,
        joined_at: new Date().toISOString(),
        status: "pending", // Ou 'accepted' se não houver pagamento
      });

      if (error) throw error;

      // Atualizar estado local e notificar
      setIsUserParticipating(true);
      setUserParticipationStatus("pending");
      // Re-fetch participants para atualizar a lista
      const { data: updatedParticipants, error: fetchError } = await supabase
        .from("participants")
        .select(`
          id,
          user_id,
          joined_at,
          status,
          profiles (full_name, avatar_url)
        `)
        .eq("tournament_id", tournament.id);
      if (updatedParticipants) setParticipants(updatedParticipants as Participant[]);

      toast({
        title: "Inscrição realizada!",
        description: "Sua participação está pendente de confirmação.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao se inscrever",
        description: err.message || "Ocorreu um erro ao tentar se inscrever no torneio.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (!tournament) return null;
    if (tournament.status === "pending") {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Aguardando Início</Badge>;
    }
    if (tournament.status === "active") {
      return <Badge className="bg-success/10 text-success border-success/20">Em Andamento</Badge>;
    }
    if (tournament.status === "completed") {
      return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Finalizado</Badge>;
    }
    if (tournament.status === "cancelled") {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelado</Badge>;
    }
    return null;
  };

  const getPaymentStatusBadge = (status: Participant["status"]) => {
    const variants = {
      accepted: { label: "Confirmado", className: "bg-success/10 text-success border-success/20" },
      pending: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
      declined: { label: "Recusado", className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando detalhes do campeonato...</div>;
  }

  if (error || !tournament) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">{error || "Campeonato não encontrado."}</div>;
  }

  const paidCount = participants.filter(p => p.status === "accepted").length;
  const pendingCount = participants.filter(p => p.status === "pending").length;
  const availableSlots = tournament.max_participants - participants.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} />
      
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
              <h1 className="text-4xl font-bold mb-2">{tournament.title}</h1>
              <p className="text-muted-foreground">
                {tournament.description} • {tournament.public ? "Público" : "Privado"}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Payment Status Alert / Join Button */}
        {!isUserParticipating && availableSlots > 0 && tournament.status === "pending" && (
          <Alert className="mb-6 border-primary bg-primary/10">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Este campeonato está aberto para inscrições.
              <Button variant="default" size="sm" className="ml-4" onClick={handleJoinTournament}>
                Participar
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {isUserParticipating && userParticipationStatus === "pending" && (
          <Alert className="mb-6 border-warning bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              Sua participação está pendente de confirmação.
              {/* Adicionar botão para pagamento se houver */}
            </AlertDescription>
          </Alert>
        )}
        {isUserParticipating && userParticipationStatus === "accepted" && (
          <Alert className="mb-6 border-success bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Sua participação está confirmada!
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
              <p className="text-3xl font-bold text-primary">R$ {tournament.entry_free * tournament.max_participants * 0.95}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Taxa de entrada: R$ {tournament.entry_free}
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
              <p className="text-3xl font-bold">{participants.length}/{tournament.max_participants}</p>
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
                {new Date(tournament.starts_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(tournament.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-warning" />
                Término
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">
                {new Date(tournament.ends_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(tournament.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    user && participant.user_id === user.id 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={participant.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.profiles.full_name}`}
                      alt={participant.profiles.full_name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">
                        {participant.profiles.full_name}
                        {user && participant.user_id === user.id && (
                          <span className="ml-2 text-sm text-primary">(Você)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">@{participant.profiles.full_name.replace(/\s/g, '').toLowerCase()}</p>
                    </div>
                  </div>
                  {getPaymentStatusBadge(participant.status)}
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: availableSlots > 0 ? availableSlots : 0 }).map((_, index) => (
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
              {/* A lógica de visualização precisa ser adaptada para os dados reais */}
              Visualize as partidas e acompanhe os confrontos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <TournamentBracket participants={participants} maxPlayers={tournament.max_participants} /> */}
            <p className="text-muted-foreground">Visualização do chaveamento em breve.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TournamentParticipantView;