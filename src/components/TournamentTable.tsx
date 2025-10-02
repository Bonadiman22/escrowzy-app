import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Participant {
  id: string;
  name: string;
  gamertag: string;
  avatar: string;
  paymentStatus: "pending" | "paid" | "forfeit";
}

interface TableProps {
  participants: Participant[];
}

interface Standing {
  position: number;
  participant: Participant;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export const TournamentTable = ({ participants }: TableProps) => {
  // Mock data para pontos corridos
  const standings: Standing[] = participants
    .filter(p => p.paymentStatus === "paid")
    .map((participant, index) => ({
      position: index + 1,
      participant,
      points: Math.floor(Math.random() * 15) + 5,
      wins: Math.floor(Math.random() * 5) + 1,
      draws: Math.floor(Math.random() * 3),
      losses: Math.floor(Math.random() * 3),
      goalsFor: Math.floor(Math.random() * 15) + 5,
      goalsAgainst: Math.floor(Math.random() * 10) + 2,
      goalDifference: 0,
    }))
    .map(s => ({ ...s, goalDifference: s.goalsFor - s.goalsAgainst }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    })
    .map((s, index) => ({ ...s, position: index + 1 }));

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-success/10 border-l-4 border-success";
    if (position <= 3) return "bg-primary/10 border-l-4 border-primary";
    return "";
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">V</TableHead>
            <TableHead className="text-center">E</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">GP</TableHead>
            <TableHead className="text-center">GC</TableHead>
            <TableHead className="text-center">SG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing) => (
            <TableRow key={standing.participant.id} className={getPositionColor(standing.position)}>
              <TableCell className="text-center font-bold">{standing.position}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={standing.participant.avatar} 
                    alt={standing.participant.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{standing.participant.name}</p>
                    <p className="text-xs text-muted-foreground">@{standing.participant.gamertag}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center font-bold">{standing.points}</TableCell>
              <TableCell className="text-center">{standing.wins}</TableCell>
              <TableCell className="text-center">{standing.draws}</TableCell>
              <TableCell className="text-center">{standing.losses}</TableCell>
              <TableCell className="text-center">{standing.goalsFor}</TableCell>
              <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
              <TableCell className={`text-center font-semibold ${standing.goalDifference > 0 ? 'text-success' : standing.goalDifference < 0 ? 'text-destructive' : ''}`}>
                {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success/20 border-l-2 border-success" />
          <span className="text-muted-foreground">1º Lugar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/20 border-l-2 border-primary" />
          <span className="text-muted-foreground">Top 3</span>
        </div>
      </div>

      {/* Table legend */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2 font-semibold">Legendas:</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          <div><span className="font-semibold">P:</span> Pontos</div>
          <div><span className="font-semibold">V:</span> Vitórias</div>
          <div><span className="font-semibold">E:</span> Empates</div>
          <div><span className="font-semibold">D:</span> Derrotas</div>
          <div><span className="font-semibold">GP:</span> Gols Pró</div>
          <div><span className="font-semibold">GC:</span> Gols Contra</div>
          <div><span className="font-semibold">SG:</span> Saldo de Gols</div>
        </div>
      </div>

      {participants.filter(p => p.paymentStatus === "paid").length < 2 && (
        <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning">
            ⚠️ Tabela de pontos será preenchida quando o campeonato iniciar
          </p>
        </div>
      )}
    </div>
  );
};
