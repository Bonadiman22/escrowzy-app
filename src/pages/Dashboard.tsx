import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Plus, Trophy, Users, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface Tournament {
  id: string;
  name: string;
  game: string;
  players: number;
  maxPlayers: number;
  prizePool: number;
  status: "pending" | "active" | "completed";
  createdAt: string;
}

const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "Campeonato EA FC 25",
    game: "EA FC 25",
    players: 3,
    maxPlayers: 4,
    prizePool: 200,
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Torneio CS2 Finals",
    game: "Counter-Strike 2",
    players: 8,
    maxPlayers: 8,
    prizePool: 400,
    status: "active",
    createdAt: "2024-01-14",
  },
];

const Dashboard = () => {
  const [tournaments] = useState<Tournament[]>(mockTournaments);

  const getStatusBadge = (status: Tournament["status"]) => {
    const variants = {
      pending: { label: "Aguardando", className: "bg-warning/10 text-warning border-warning/20" },
      active: { label: "Em Andamento", className: "bg-success/10 text-success border-success/20" },
      completed: { label: "Finalizado", className: "bg-muted/10 text-muted-foreground border-muted/20" },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold mb-2">Meus Campeonatos</h1>
            <p className="text-muted-foreground">Gerencie seus torneios e acompanhe os resultados</p>
          </div>
          <Button size="lg" className="gradient-primary" asChild>
            <Link to="/create-tournament">
              <Plus className="w-5 h-5 mr-2" />
              Novo Campeonato
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Torneios Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">11</p>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 600</p>
                  <p className="text-sm text-muted-foreground">Em Custódia</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournaments List */}
        <div className="grid gap-4 animate-slide-up">
          {tournaments.map((tournament) => (
            <Link key={tournament.id} to={`/tournament/${tournament.id}`}>
              <Card className="glass-card hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{tournament.name}</CardTitle>
                      <CardDescription>{tournament.game}</CardDescription>
                    </div>
                    {getStatusBadge(tournament.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Participantes</p>
                      <p className="font-semibold">
                        {tournament.players}/{tournament.maxPlayers}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Premiação</p>
                      <p className="font-semibold text-primary">R$ {tournament.prizePool}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Criado em</p>
                      <p className="font-semibold">{new Date(tournament.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
