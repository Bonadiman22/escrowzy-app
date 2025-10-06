import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, DollarSign, Calendar, Check, X } from "lucide-react";

interface Invite {
  id: string;
  type: "tournament" | "friend";
  from: {
    name: string;
    avatar: string;
  };
  tournament?: {
    name: string;
    game: string;
    entryFee: number;
    prizePool: number;
    players: number;
    maxPlayers: number;
    startDate: string;
  };
  createdAt: string;
}

const mockInvites: Invite[] = [
  {
    id: "inv-1",
    type: "tournament",
    from: {
      name: "Carlos Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    },
    tournament: {
      name: "Campeonato FIFA 25",
      game: "EA FC 25",
      entryFee: 50,
      prizePool: 400,
      players: 6,
      maxPlayers: 8,
      startDate: "2024-01-25",
    },
    createdAt: "2024-01-15",
  },
  {
    id: "inv-2",
    type: "friend",
    from: {
      name: "Maria Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    createdAt: "2024-01-14",
  },
  {
    id: "inv-3",
    type: "tournament",
    from: {
      name: "Pedro Costa",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    },
    tournament: {
      name: "CS2 Championship",
      game: "Counter-Strike 2",
      entryFee: 75,
      prizePool: 600,
      players: 10,
      maxPlayers: 16,
      startDate: "2024-01-28",
    },
    createdAt: "2024-01-13",
  },
];

export const InvitesTab = () => {
  const handleAccept = (id: string) => {
    console.log("Accepting invite:", id);
    // TODO: Implement accept logic
  };

  const handleDecline = (id: string) => {
    console.log("Declining invite:", id);
    // TODO: Implement decline logic
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Convites</h2>
        <p className="text-muted-foreground">
          Você tem {mockInvites.length} {mockInvites.length === 1 ? "convite" : "convites"} pendentes
        </p>
      </div>

      <div className="grid gap-4">
        {mockInvites.map((invite) => (
          <Card key={invite.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={invite.from.avatar} alt={invite.from.name} />
                    <AvatarFallback>
                      {invite.from.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {invite.type === "tournament" ? "Convite para Campeonato" : "Solicitação de Amizade"}
                    </CardTitle>
                    <CardDescription>
                      {invite.from.name}{" "}
                      {invite.type === "tournament"
                        ? `convidou você para participar de "${invite.tournament?.name}"`
                        : "quer ser seu amigo"}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {invite.type === "tournament" ? "Campeonato" : "Amizade"}
                </Badge>
              </div>
            </CardHeader>

            {invite.type === "tournament" && invite.tournament && (
              <CardContent className="space-y-4">
                {/* Tournament Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jogo</p>
                      <p className="text-sm font-semibold">{invite.tournament.game}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Participantes</p>
                      <p className="text-sm font-semibold">
                        {invite.tournament.players}/{invite.tournament.maxPlayers}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Taxa</p>
                      <p className="text-sm font-semibold text-primary">R$ {invite.tournament.entryFee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Início</p>
                      <p className="text-sm font-semibold">
                        {new Date(invite.tournament.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prize Pool Info */}
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Premiação Total</span>
                  </div>
                  <span className="text-lg font-bold text-primary">R$ {invite.tournament.prizePool}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleAccept(invite.id)}
                    className="flex-1 gradient-primary"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aceitar Convite
                  </Button>
                  <Button
                    onClick={() => handleDecline(invite.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Recusar
                  </Button>
                </div>
              </CardContent>
            )}

            {invite.type === "friend" && (
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAccept(invite.id)}
                    className="flex-1 gradient-primary"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aceitar
                  </Button>
                  <Button
                    onClick={() => handleDecline(invite.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Recusar
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {mockInvites.length === 0 && (
          <Card className="glass-card p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum convite pendente</h3>
            <p className="text-muted-foreground">Quando você receber convites, eles aparecerão aqui.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
