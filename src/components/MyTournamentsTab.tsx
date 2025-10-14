import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tournament {
  id: string;
  name: string;
  game: string;
  players: number;
  maxPlayers: number;
  prizePool: number;
  entryFee: number;
  status: "pending" | "active" | "completed";
  createdAt: string;
  currentStage?: string;
  progress?: number;
}

type FilterType = "all" | "active" | "completed";

export const MyTournamentsTab = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  const fetchMyTournaments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setTournaments([]);
        return;
      }

      // Buscar campeonatos criados pelo usuário
      const { data: ownerTournaments, error: ownerError } = await supabase
        .from("tournaments" as any)
        .select(`
          id,
          title,
          game,
          max_participants,
          prize_pool,
          entry_fee,
          status,
          created_at,
          participants (id)
        `)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (ownerError) throw ownerError;

      // Transformar dados do Supabase para o formato do componente
      const formattedTournaments: Tournament[] = (ownerTournaments || []).map((tournament: any) => ({
        id: tournament.id,
        name: tournament.title,
        game: tournament.game,
        players: tournament.participants?.length || 0,
        maxPlayers: tournament.max_participants,
        prizePool: tournament.prize_pool || 0,
        entryFee: tournament.entry_fee || 0,
        status: tournament.status as "pending" | "active" | "completed",
        createdAt: tournament.created_at,
      }));

      setTournaments(formattedTournaments);
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus campeonatos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Tournament["status"]) => {
    const variants = {
      pending: { label: "Aguardando", className: "bg-warning/10 text-warning border-warning/20" },
      active: { label: "Em Andamento", className: "bg-success/10 text-success border-success/20" },
      completed: { label: "Finalizado", className: "bg-muted/10 text-muted-foreground border-muted/20" },
    };
    return <Badge className={variants[status].className}>{variants[status].label}</Badge>;
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    if (filter === "all") return true;
    if (filter === "active") return tournament.status === "active";
    if (filter === "completed") return tournament.status === "completed";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando campeonatos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Em Andamento</SelectItem>
            <SelectItem value="completed">Finalizados</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {filteredTournaments.length} {filteredTournaments.length === 1 ? "campeonato" : "campeonatos"}
        </p>
      </div>

      {/* Tournaments List */}
      <div className="grid gap-4">
        {filteredTournaments.map((tournament) => (
          <Link key={tournament.id} to={`/tournament/${tournament.id}`}>
            <Card className="glass-card hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{tournament.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      {tournament.game}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(tournament.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tournament Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Participantes</p>
                      <p className="font-semibold">
                        {tournament.players}/{tournament.maxPlayers}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Entrada</p>
                      <p className="font-semibold text-primary">R$ {tournament.entryFee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Premiação Total</p>
                      <p className="font-semibold text-primary">R$ {tournament.prizePool}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Criado em</p>
                      <p className="font-semibold">{new Date(tournament.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Active Tournaments */}
                {tournament.status === "active" && tournament.currentStage && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Campeonato</span>
                      <span className="font-semibold">{tournament.currentStage}</span>
                    </div>
                    <Progress value={tournament.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredTournaments.length === 0 && (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              {tournaments.length === 0 
                ? "Você ainda não criou nenhum campeonato. Clique em 'Criar Campeonato' para começar!" 
                : "Nenhum campeonato encontrado com os filtros selecionados."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};