import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Trophy, Users, Calendar, DollarSign } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  game: string;
  players: number;
  maxPlayers: number;
  prizePool: number;
  entryFee: number;
  status: "pending" | "active" | "completed";
  paymentStatus: "paid" | "pending";
  createdAt: string;
  currentStage?: string;
  progress?: number;
}

const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "Campeonato EA FC 25",
    game: "EA FC 25",
    players: 3,
    maxPlayers: 4,
    prizePool: 200,
    entryFee: 50,
    status: "pending",
    paymentStatus: "paid",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Torneio CS2 Finals",
    game: "Counter-Strike 2",
    players: 8,
    maxPlayers: 8,
    prizePool: 400,
    entryFee: 50,
    status: "active",
    paymentStatus: "paid",
    createdAt: "2024-01-14",
    currentStage: "Quartas de Final",
    progress: 50,
  },
  {
    id: "3",
    name: "Liga Rocket League",
    game: "Rocket League",
    players: 6,
    maxPlayers: 8,
    prizePool: 320,
    entryFee: 40,
    status: "active",
    paymentStatus: "pending",
    createdAt: "2024-01-10",
    currentStage: "Semifinal",
    progress: 75,
  },
  {
    id: "4",
    name: "Valorant Masters",
    game: "Valorant",
    players: 16,
    maxPlayers: 16,
    prizePool: 800,
    entryFee: 50,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2024-01-05",
    progress: 100,
  },
];

type FilterType = "all" | "active" | "completed" | "paid" | "pending";

export const MyTournamentsTab = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const getStatusBadge = (status: Tournament["status"]) => {
    const variants = {
      pending: { label: "Aguardando", className: "bg-warning/10 text-warning border-warning/20" },
      active: { label: "Em Andamento", className: "bg-success/10 text-success border-success/20" },
      completed: { label: "Finalizado", className: "bg-muted/10 text-muted-foreground border-muted/20" },
    };
    return <Badge className={variants[status].className}>{variants[status].label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: Tournament["paymentStatus"]) => {
    return paymentStatus === "paid" ? (
      <Badge className="bg-success/10 text-success border-success/20">Pago</Badge>
    ) : (
      <Badge className="bg-warning/10 text-warning border-warning/20">Pagamento Pendente</Badge>
    );
  };

  const filteredTournaments = mockTournaments.filter((tournament) => {
    if (filter === "all") return true;
    if (filter === "active") return tournament.status === "active";
    if (filter === "completed") return tournament.status === "completed";
    if (filter === "paid") return tournament.paymentStatus === "paid";
    if (filter === "pending") return tournament.paymentStatus === "pending";
    return true;
  });

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
            <SelectItem value="paid">Pagos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
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
                    {getPaymentBadge(tournament.paymentStatus)}
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
            <p className="text-muted-foreground">Nenhum campeonato encontrado com os filtros selecionados.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
