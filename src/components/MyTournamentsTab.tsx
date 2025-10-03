import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

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
    paymentStatus: "pending",
    createdAt: "2024-01-14",
  },
];

export const MyTournamentsTab = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="lg" className="gradient-primary" asChild>
          <Link to="/create-tournament">
            <Plus className="w-5 h-5 mr-2" />
            Novo Campeonato
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {mockTournaments.map((tournament) => (
          <Link key={tournament.id} to={`/tournament/${tournament.id}`}>
            <Card className="glass-card hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{tournament.name}</CardTitle>
                    <CardDescription>{tournament.game}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(tournament.status)}
                    {getPaymentBadge(tournament.paymentStatus)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Participantes</p>
                    <p className="font-semibold">
                      {tournament.players}/{tournament.maxPlayers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Taxa de Entrada</p>
                    <p className="font-semibold text-primary">R$ {tournament.entryFee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Premiação Total</p>
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
    </div>
  );
};
