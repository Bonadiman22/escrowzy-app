import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tournament {
  id: string;
  title: string;
  game: string;
  participants_count: number;
  max_participants: number;
  prize_pool: number;
  entry_fee: number;
  status: string;
  created_at: string;
}

type FilterType = "all" | "active" | "pending" | "completed";

export const MyTournamentsTab = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setTournaments([]);
        return;
      }

      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          participants(count)
        `)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const tournamentsWithCount = (data || []).map((tournament: any) => ({
        ...tournament,
        participants_count: tournament.participants?.[0]?.count || 0,
      }));

      setTournaments(tournamentsWithCount);
    } catch (error) {
      console.error("Erro ao buscar torneios:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus torneios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Aguardando", className: "bg-warning/10 text-warning border-warning/20" },
      active: { label: "Em Andamento", className: "bg-success/10 text-success border-success/20" },
      completed: { label: "Finalizado", className: "bg-muted/10 text-muted-foreground border-muted/20" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    if (filter === "all") return true;
    return tournament.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
            <SelectItem value="pending">Aguardando</SelectItem>
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
                    <CardTitle className="text-xl mb-1">{tournament.title}</CardTitle>
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
                        {tournament.participants_count}/{tournament.max_participants}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Entrada</p>
                      <p className="font-semibold text-primary">R$ {tournament.entry_fee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Premiação Total</p>
                      <p className="font-semibold text-primary">R$ {tournament.prize_pool || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Criado em</p>
                      <p className="font-semibold">{new Date(tournament.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredTournaments.length === 0 && (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Nenhum campeonato encontrado com os filtros selecionados.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
