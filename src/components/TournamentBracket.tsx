interface Participant {
  id: string;
  name: string;
  gamertag: string;
  avatar: string;
  paymentStatus: "pending" | "paid" | "forfeit";
}

interface BracketProps {
  participants: Participant[];
  maxPlayers: number;
}

interface Match {
  id: string;
  player1?: Participant;
  player2?: Participant;
  winner?: string;
  round: number;
}

export const TournamentBracket = ({ participants, maxPlayers }: BracketProps) => {
  // Gera os rounds baseado no número máximo de jogadores
  const rounds = Math.ceil(Math.log2(maxPlayers));
  
  // Gera as partidas para o primeiro round
  const generateFirstRound = (): Match[] => {
    const matches: Match[] = [];
    const paidParticipants = participants.filter(p => p.paymentStatus === "paid");
    
    for (let i = 0; i < maxPlayers / 2; i++) {
      matches.push({
        id: `r1-m${i}`,
        player1: paidParticipants[i * 2],
        player2: paidParticipants[i * 2 + 1],
        round: 1,
      });
    }
    
    return matches;
  };

  const firstRoundMatches = generateFirstRound();

  const MatchCard = ({ match }: { match: Match }) => (
    <div className="bg-card border rounded-lg p-3 min-w-[200px] hover:shadow-md transition-shadow">
      <div className="space-y-2">
        {/* Player 1 */}
        <div className={`flex items-center gap-2 p-2 rounded ${match.winner === match.player1?.id ? 'bg-success/10 border border-success/20' : 'bg-muted/50'}`}>
          {match.player1 ? (
            <>
              <img 
                src={match.player1.avatar} 
                alt={match.player1.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{match.player1.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{match.player1.gamertag}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <span className="text-sm">TBD</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-semibold">VS</span>
        </div>

        {/* Player 2 */}
        <div className={`flex items-center gap-2 p-2 rounded ${match.winner === match.player2?.id ? 'bg-success/10 border border-success/20' : 'bg-muted/50'}`}>
          {match.player2 ? (
            <>
              <img 
                src={match.player2.avatar} 
                alt={match.player2.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{match.player2.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{match.player2.gamertag}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <span className="text-sm">TBD</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max p-4">
        {/* Round labels and matches */}
        <div className="flex gap-8">
          {Array.from({ length: rounds }).map((_, roundIndex) => (
            <div key={roundIndex} className="flex flex-col gap-4 min-w-[220px]">
              {/* Round label */}
              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  {roundIndex === rounds - 1 
                    ? "Final" 
                    : roundIndex === rounds - 2 
                    ? "Semi-final" 
                    : `Round ${roundIndex + 1}`}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {Math.pow(2, rounds - roundIndex - 1)} {Math.pow(2, rounds - roundIndex - 1) === 1 ? 'partida' : 'partidas'}
                </p>
              </div>

              {/* Matches for this round */}
              <div className="flex flex-col gap-6">
                {roundIndex === 0 
                  ? firstRoundMatches.map(match => (
                      <MatchCard key={match.id} match={match} />
                    ))
                  : Array.from({ length: Math.pow(2, rounds - roundIndex - 1) }).map((_, i) => (
                      <MatchCard 
                        key={`r${roundIndex + 1}-m${i}`} 
                        match={{ 
                          id: `r${roundIndex + 1}-m${i}`, 
                          round: roundIndex + 1 
                        }} 
                      />
                    ))
                }
              </div>
            </div>
          ))}
        </div>

        {/* Info box */}
        {participants.filter(p => p.paymentStatus === "paid").length < maxPlayers && (
          <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">
              ⚠️ Chaveamento será gerado automaticamente quando todos os pagamentos forem confirmados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
