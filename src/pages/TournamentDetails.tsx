import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
    // Adicionar outros campos do perfil se necessário
  };
}

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

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

      } catch (err: any) {
        console.error("Erro ao buscar detalhes do torneio:", err.message);
        setError("Não foi possível carregar os detalhes do torneio.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const isOwner = user && tournament && user.id === tournament.owner_id;

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/tournament/${id}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copiado!",
      description: "Link de convite copiado para a área de transferência.",
    });
  };

  const shareWhatsApp = () => {
    const inviteLink = `${window.location.origin}/tournament/${id}`;
    const message = `Participe do ${tournament?.title}! Acesse: ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const removeParticipant = async (participantId: string) => {
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("id", participantId);

    if (error) {
      toast({
        title: "Erro ao remover participante",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setParticipants(participants.filter(p => p.id !== participantId));
      toast({
        title: "Participante removido",
        description: "O jogador foi removido do campeonato.",
      });
    }
  };

  const handleEditSave = async (data: { title: string; public: boolean }) => {
    if (!tournament) return;

    const { data: updatedTournament, error } = await supabase
      .from("tournaments")
      .update({ title: data.title, public: data.public })
      .eq("id", tournament.id)
      .select()
      .single();

    if (error) {
      toast({ title: "Erro ao editar", description: error.message, variant: "destructive" });
    } else {
      setTournament(updatedTournament);
      toast({ title: "Campeonato atualizado!" });
    }
  };

  const handleCancelTournament = async () => {
    if (!tournament) return;

    const { error } = await supabase
      .from("tournaments")
      .update({ status: "cancelled" })
      .eq("id", tournament.id);

    if (error) {
      toast({ title: "Erro ao cancelar", description: error.message, variant: "destructive" });
    } else {
      setTournament({ ...tournament, status: "cancelled" });
      toast({
        title: "Campeonato cancelado",
        description: "O status do campeonato foi alterado para cancelado.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
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
            {isOwner && (
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
                <code className="text-sm flex-1 truncate">{`${window.location.origin}/tournament/${id}`}</code>
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
                  <span className="font-semibold">{participants.length}/{tournament.max_participants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Confirmados
                  </span>
                  <span className="font-semibold text-success">{paidCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4 text-warning" />
                    Pendentes
                  </span>
                  <span className="font-semibold text-warning">{pendingCount}</span>
                </div>
              </div>
              {tournament.public && (
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
                  <span className="font-semibold">R$ {tournament.entry_free}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arrecadado</span>
                  <span className="font-semibold text-success">R$ {paidCount * tournament.entry_free}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premiação total</span>
                  <span className="font-semibold text-primary">R$ {tournament.entry_free * tournament.max_participants * 0.95}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Pagamentos confirmados</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all"
                    style={{ width: `${(paidCount / tournament.max_participants) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Participants and Stats */}
        <Card className="glass-card mb-8 animate-slide-up">
          <Tabs defaultValue="participants" className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gerenciar Campeonato</CardTitle>
                  <CardDescription>Participantes, estatísticas e controle</CardDescription>
                </div>
                {isOwner && (
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
            <CardContent>
              <TabsContent value="participants" className="space-y-3 mt-0">
                {participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={participant.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.profiles.full_name}`}
                        alt={participant.profiles.full_name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{participant.profiles.full_name}</p>
                        <p className="text-sm text-muted-foreground">@{participant.profiles.full_name.replace(/\s/g, '').toLowerCase()}</p>
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
                      {isOwner && (
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
                      )}
                    </div>
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
              </TabsContent>
              <TabsContent value="stats" className="mt-0">
                <ParticipantStatsTab />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Tournament Visualization */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle>Visualização do Campeonato</CardTitle>
            <CardDescription>
              Chaveamento e grupos do torneio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* A lógica de visualização precisa ser adaptada para os dados reais */}
            {/* <TournamentBracket participants={participants} maxPlayers={tournament.max_participants} /> */}
            <p className="text-muted-foreground">Visualização do chaveamento em breve.</p>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <EditTournamentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tournament={tournaments}
        onSave={handleEditSave}
      />
      <CancelTournamentDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        tournamentName={tournaments.title}
        onConfirm={handleCancelTournament}
      />
    </div>
  );
};

export default TournamentDetails;