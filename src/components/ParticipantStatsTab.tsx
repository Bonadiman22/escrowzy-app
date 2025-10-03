import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Trophy, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface PlayerStats {
  id: string;
  name: string;
  gamertag: string;
  avatar: string;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceded: number;
  winRate: number;
}

const mockStats: PlayerStats[] = [
  {
    id: "1",
    name: "João Silva",
    gamertag: "joao_pro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    wins: 15,
    losses: 3,
    draws: 2,
    goalsScored: 45,
    goalsConceded: 18,
    winRate: 75,
  },
  {
    id: "2",
    name: "Maria Santos",
    gamertag: "maria_gamer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    wins: 12,
    losses: 5,
    draws: 3,
    goalsScored: 38,
    goalsConceded: 22,
    winRate: 60,
  },
];

export function ParticipantStatsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats] = useState<PlayerStats[]>(mockStats);

  const filteredStats = stats.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.gamertag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h3 className="text-xl font-semibold mb-1">Estatísticas dos Jogadores</h3>
          <p className="text-sm text-muted-foreground">
            Visualize o desempenho de cada participante
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Jogador
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jogador por nome ou gamertag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4">
        {filteredStats.map((player) => (
          <Card key={player.id} className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{player.name}</CardTitle>
                  <CardDescription>@{player.gamertag}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Taxa de vitória</p>
                  <p className="text-2xl font-bold text-primary">{player.winRate}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vitórias</p>
                    <p className="text-lg font-bold text-success">{player.wins}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Derrotas</p>
                    <p className="text-lg font-bold">{player.losses}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Empates</p>
                    <p className="text-lg font-bold">{player.draws}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gols Marcados</p>
                  <p className="text-lg font-bold text-primary">{player.goalsScored}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gols Sofridos</p>
                  <p className="text-lg font-bold">{player.goalsConceded}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
