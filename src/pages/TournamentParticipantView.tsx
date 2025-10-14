import { useEffect, useState } from "react";
import { getTournamentDetails, joinTournament } from "@/services/tournamentService";
import { supabase } from "@/integrations/supabase/client";
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
import { useToast } from "@/hooks/use-toast";
import { TournamentBracket } from "@/components/TournamentBracket";
import { TournamentTable } from "@/components/TournamentTable";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Participant {
  id: string;
  tournament_id: string;
  user_id: string;
  joined_at: string;
  status: "pending" | "paid" | "forfeit";
  profiles: {
    id: string;
    email: string;
    full_name: string;
    display_name: string;
    avatar_url?: string;
  } | null;
}





const TournamentParticipantView = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<any | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isUserParticipant, setIsUserParticipant] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getTournamentDetails(id);
        if (data) {
          setTournament(data);
          setParticipants(data.participants || []);

          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setCurrentUser(user);
            const participantEntry = data.participants.find((p: Participant) => p.user_id === user.id);
            setIsUserParticipant(!!participantEntry);
          }
        } else {
          setError("Torneio não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do torneio:", err);
        setError("Erro ao carregar o torneio.");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const isUserPaid = isUserParticipant && participants.find(p => p.user_id === currentUser?.id)?.status === "paid";

  const handleJoinTournament = async () => {
    if (!id || !currentUser || !tournament) return;
    setLoading(true);
    try {
      // Assumindo que o gamertag pode vir do perfil do usuário ou ser solicitado
      const gamertag = currentUser.user_metadata?.gamertag || currentUser.email; // Exemplo
      await joinTournament(id, currentUser.id, gamertag, tournament.entry_fee);
      // Recarregar os detalhes do torneio para atualizar a lista de participantes
      const updatedTournament = await getTournamentDetails(id);
      if (updatedTournament) {
        setTournament(updatedTournament);
        setParticipants(updatedTournament.participants || []);
        setIsUserParticipant(true);
      }
      toast({
        title: "Inscrição realizada!",
        description: "Você se juntou ao torneio com sucesso.",
      });
    } catch (err: any) {
      console.error("Erro ao entrar no torneio:", err);
      toast({
        title: "Erro ao participar",
        description: err.message || "Não foi possível entrar no torneio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = (tournament?.max_participants || 0) - participants.length;

  const getStatusBadge = () => {
    if (tournament?.status === "pending") {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Aguardando Início</Badge>;
    }
    if (tournament?.status === "active") {
      return <Badge className="bg-success/10 text-success border-success/20">Em Andamento</Badge>;
    }
    if (tournament?.status === "completed") {
      return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Finalizado</Badge>;
    }
    return null;
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
              <h1 className="text-4xl font-bold mb-2">{tournament?.title}</h1>
              <p className="text-muted-foreground">
                {tournament?.game} • {tournament?.game_mode} • {tournament?.public ? "Público" : "Privado"}
              </p>
            </div>
            {getStatusBadge()}
            {!isUserParticipant && currentUser && tournament && (
              <Button onClick={handleJoinTournament} disabled={loading || availableSlots <= 0}>
                {availableSlots <= 0 ? "Vagas Esgotadas" : "Participar"}
              </Button>
            )}
          </div>
        </div>

        {/* Payment Status Alert */}
        {isUserParticipant && !isUserPaid && (
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
              <p className="text-3xl font-bold text-primary">R$ {tournament?.prize_pool}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Taxa: R$ {tournament?.entry_fee}
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
              <p className="text-3xl font-bold">{participants.length}/{tournament?.max_participants}</p>
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
                {tournament?.starts_at ? new Date(tournament.starts_at).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {tournament?.starts_at ? new Date(tournament.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
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
              <p className="text-lg font-bold">{tournament?.description || "N/A"}</p>
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
              {loading && <p>Carregando participantes...</p>}
              {error && <p className="text-destructive">Erro: {error}</p>}
              {!loading && !error && participants.length > 0 ? (
                participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      participant.user_id === currentUser?.id 
                        ? 'bg-primary/10 border-primary/20' 
                        : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={participant.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.profiles?.display_name || participant.user_id}`}
                        alt={participant.profiles?.full_name || participant.profiles?.display_name || "Participante"}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">
                          {participant.profiles?.full_name || participant.profiles?.display_name || "Nome Indisponível"}
                          {participant.user_id === currentUser?.id && (
                            <span className="ml-2 text-sm text-primary">(Você)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">@{participant.profiles?.display_name || "N/A"}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        participant.status === "paid"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {participant.status === "paid" ? "Confirmado" : "Pendente"}
                    </Badge>
                  </div>
                ))
              ) : (
                !loading && !error && <p className="text-muted-foreground">Nenhum participante inscrito ainda.</p>
              )}
              
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
              {tournament?.game_mode === "Mata-mata" 
                ? "Visualize as partidas e acompanhe os confrontos" 
                : "Tabela de classificação do torneio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
              {tournament?.game_mode === "Mata-mata" ? (
                <TournamentBracket participants={participants as any} maxPlayers={tournament.max_participants} />
              ) : (
                <TournamentTable participants={participants as any} />
              )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TournamentParticipantView;
