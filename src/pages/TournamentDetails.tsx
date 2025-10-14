import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Share2,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowLeft,
  UserPlus,
  Mail,
  MoreVertical,
  UserMinus
} from "lucide-react";
import { TournamentBracket } from "@/components/TournamentBracket";
import { TournamentTable } from "@/components/TournamentTable";
import { EditTournamentDialog } from "@/components/EditTournamentDialog";
import { CancelTournamentDialog } from "@/components/CancelTournamentDialog";
import { ParticipantStatsTab } from "@/components/ParticipantStatsTab";
import { useToast } from "@/hooks/use-toast";
import { getTournamentDetails, updateTournament, removeParticipantFromTournament } from "@/services/tournamentService";

interface Participant {
  id: string;
  tournament_id: string;
  user_id: string;
  joined_at: string;
  status: "pending" | "paid" | "forfeit";
  profiles: {
    id: string;
    auth_uid: string;
    email: string;
    full_name: string;
    display_name: string;
    avatar_url?: string;
  } | null;
}

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<any | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

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

  const paidCount = participants.filter(p => p.status === "paid").length;
  const pendingCount = participants.filter(p => p.status === "pending").length;
  const availableSlots = (tournament?.max_participants || 0) - participants.length;

  const copyInviteLink = () => {
    if (tournament?.invite_link) {
      navigator.clipboard.writeText(tournament.invite_link);
      toast({
        title: "Link copiado!",
        description: "Link de convite copiado para a área de transferência.",
      });
    }
  };

  const shareWhatsApp = () => {
    if (tournament?.title && tournament?.invite_link) {
      const message = `Participe do ${tournament.title}! Acesse: ${tournament.invite_link}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const removeParticipant = async (participantId: string) => {
    try {
      await removeParticipantFromTournament(participantId);
      setParticipants(participants.filter(p => p.id !== participantId));
      toast({
        title: "Participante removido",
        description: "O jogador foi removido do campeonato.",
      });
    } catch (err) {
      console.error("Erro ao remover participante:", err);
      toast({
        title: "Erro",
        description: "Não foi possível remover o participante.",
        variant: "destructive",
      });
    }
  };

  const handleEditSave = async (data: { name: string; visibility: string }) => {
    if (!id) return;
    try {
      const updatedTournament = await updateTournament(id, { title: data.name, public: data.visibility === "public" });
      if (updatedTournament) {
        setTournament(updatedTournament);
        toast({
          title: "Torneio atualizado",
          description: "As informações do torneio foram salvas.",
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar torneio:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o torneio.",
        variant: "destructive",
      });
    }
  };

  const handleCancelTournament = () => {
    // Lógica de cancelamento
    toast({
      title: "Campeonato cancelado",
      description: "Todos os participantes serão reembolsados.",
      variant: "destructive",
    });
  };

  const getPaymentStatusBadge = (status: Participant["status"]) => {
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
              <h1 className="text-4xl font-bold mb-2">{tournament?.title}</h1>
              <p className="text-muted-foreground">
                {tournament?.game} • {tournament?.game_mode} • {tournament?.public ? "Público" : "Privado"}
              </p>
            </div>
            {!loading && !error && tournament && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancelar
                </Button>
              </div>
            )}
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
                <code className="text-sm flex-1 truncate">{tournament?.invite_link}</code>
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
                  <span className="font-semibold">{participants.length}/{tournament?.max_participants}</span>
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
              {tournament?.public && (
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
                  <span className="font-semibold">R$ {tournament?.entry_fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arrecadado</span>
                  <span className="font-semibold text-success">R$ {paidCount * (tournament?.entry_fee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premiação total</span>
                  <span className="font-semibold text-primary">R$ {tournament?.prize_pool}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Pagamentos confirmados</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all"
                    style={{ width: `${(paidCount / (tournament?.max_participants || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Participants and Stats */}
        <Card className="glass-card mb-8 animate-slide-up">
          <Tabs defaultValue="participants" className="w-full">
            {loading && <p>Carregando torneio...</p>}
            {error && <p className="text-destructive">Erro: {error}</p>}
            {!loading && !error && tournament && (
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerenciar Campeonato</CardTitle>
                    <CardDescription>Gerencie os participantes e o andamento do torneio.</CardDescription>
                  </div>
                  {!tournament.public && (
                    <Button size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Convites
                    </Button>
                  )}
                </div>
                <TabsList className="grid w-full max-w-md grid-cols-2 mt-4">
                  <TabsTrigger value="participants">Participantes</TabsTrigger>
                  <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                </TabsList>
              </CardHeader>
            )}
            {!loading && !error && tournament && (
              <CardContent>
                <TabsContent value="participants" className="space-y-3 mt-0">
                  {participants.length > 0 ? (
                    participants.map((participant) => (
                      <div 
                        key={participant.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={participant.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.profiles?.display_name || participant.user_id}`}
                            alt={participant.profiles?.full_name || participant.profiles?.display_name || "Participante"}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{participant.profiles?.full_name || participant.profiles?.display_name || "Nome Indisponível"}</p>
                            <p className="text-sm text-muted-foreground">@{participant.profiles?.display_name || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden md:block">
                            <p className="text-sm text-muted-foreground">Inscrito em</p>
                            <p className="text-sm font-medium">
                              {new Date(participant.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                          {getPaymentStatusBadge(participant.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => removeParticipant(participant.id)}
                              >
                                <UserMinus className="w-4 h-4 mr-2" />
                                Remover participante
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhum participante inscrito ainda.</p>
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
                </TabsContent>
                <TabsContent value="stats" className="mt-0">
                  <ParticipantStatsTab />
                </TabsContent>
              </CardContent>
            )}
          </Tabs>
        </Card>

        {/* Tournament Visualization */}
        {!loading && !error && tournament && (
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle>Visualização do Campeonato</CardTitle>
              <CardDescription>
                {tournament.game_mode === "Mata-mata" 
                  ? "Chaveamento e grupos do torneio" 
                  : "Tabela de classificação e pontuação"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tournament.game_mode === "Mata-mata" ? (
                <TournamentBracket participants={participants} maxPlayers={tournament.max_participants} />
              ) : (
                <TournamentTable participants={participants} />
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Dialogs */}
      {!loading && !error && tournament && (
        <>
          <EditTournamentDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            tournament={tournament}
            onSave={handleEditSave}
          />
          <CancelTournamentDialog
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
            tournamentName={tournament.title}
            onConfirm={handleCancelTournament}
          />
        </>
      )}
    </div>
  );
}; 

export default TournamentDetails;
