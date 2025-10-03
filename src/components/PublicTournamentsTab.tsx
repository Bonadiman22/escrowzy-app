import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Clock } from "lucide-react";

interface PublicTournament {
  id: string;
  name: string;
  game: string;
  players: number;
  maxPlayers: number;
  entryFee: number;
  prizePool: number;
  startDate: string;
  organizer: string;
}

const mockPublicTournaments: PublicTournament[] = [
  {
    id: "pub-1",
    name: "Copa Aberta FIFA 25",
    game: "EA FC 25",
    players: 6,
    maxPlayers: 16,
    entryFee: 30,
    prizePool: 480,
    startDate: "2024-01-20",
    organizer: "ProGaming",
  },
  {
    id: "pub-2",
    name: "Valorant Open League",
    game: "Valorant",
    players: 12,
    maxPlayers: 32,
    entryFee: 25,
    prizePool: 800,
    startDate: "2024-01-22",
    organizer: "ESports Brasil",
  },
  {
    id: "pub-3",
    name: "Rocket League Championship",
    game: "Rocket League",
    players: 4,
    maxPlayers: 8,
    entryFee: 40,
    prizePool: 320,
    startDate: "2024-01-18",
    organizer: "Gaming Arena",
  },
];

export const PublicTournamentsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campeonatos Públicos</h2>
          <p className="text-muted-foreground">Participe de torneios abertos à comunidade</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockPublicTournaments.map((tournament) => (
          <Card key={tournament.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{tournament.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {tournament.game} • Organizado por {tournament.organizer}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Vagas Abertas
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Premiação</p>
                    <p className="font-semibold text-primary">R$ {tournament.prizePool}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Taxa de Entrada</p>
                  <p className="font-semibold text-primary">R$ {tournament.entryFee}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Início</p>
                    <p className="font-semibold">{new Date(tournament.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <Button className="w-full gradient-primary">
                Participar do Torneio
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
