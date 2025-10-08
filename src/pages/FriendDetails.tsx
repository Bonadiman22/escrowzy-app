import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, TrendingUp, Gamepad2, Flame, Calendar, ChevronDown, DollarSign, Award, Snowflake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock data - em produção viria do backend
const mockFriendData = {
  id: "friend-1",
  username: "ProPlayer123",
  avatar: undefined,
  currentUser: {
    username: "Você",
    avatar: undefined,
  },
  headToHead: {
    yourWins: 8,
    theirWins: 5,
    totalBalance: 120.50,
    biggestPrize: 200.00,
    dominantGame: "EA FC 25",
    currentStreak: { type: "wins", count: 2 },
  },
  gameStats: [
    { 
      game: "EA FC 25", 
      yourWins: 5, 
      theirWins: 2,
      balance: 80.00,
      streak: { type: "wins", count: 3 },
      biggestPrize: 100.00,
      lastFiveMatches: ["win", "win", "win", "loss", "win"]
    },
    { 
      game: "CS2", 
      yourWins: 2, 
      theirWins: 2,
      balance: 0,
      streak: { type: "draws", count: 0 },
      biggestPrize: 50.00,
      lastFiveMatches: ["win", "loss", "win", "loss", "draw"]
    },
    { 
      game: "Valorant", 
      yourWins: 1, 
      theirWins: 1,
      balance: -20.00,
      streak: { type: "losses", count: 2 },
      biggestPrize: 30.00,
      lastFiveMatches: ["loss", "loss", "win", "draw", "draw"]
    },
  ],
  matchHistory: [
    { id: 1, date: "2025-01-15", game: "EA FC 25", prize: 50.00, result: "win" },
    { id: 2, date: "2025-01-10", game: "EA FC 25", prize: 30.00, result: "win" },
    { id: 3, date: "2025-01-08", game: "CS2", prize: 25.00, result: "loss" },
    { id: 4, date: "2025-01-05", game: "EA FC 25", prize: 40.00, result: "win" },
    { id: 5, date: "2024-12-28", game: "Valorant", prize: 20.00, result: "loss" },
  ],
};

export default function FriendDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = mockFriendData;

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-success";
    if (balance < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const formatBalance = (balance: number) => {
    if (balance > 0) return `+ R$ ${balance.toFixed(2)}`;
    if (balance < 0) return `- R$ ${Math.abs(balance).toFixed(2)}`;
    return `R$ ${balance.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Amigos
        </Button>

        {/* Header de Confronto */}
        <Card className="glass-card mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={data.currentUser.avatar} />
                  <AvatarFallback className="text-2xl">VC</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{data.currentUser.username}</p>
              </div>

              <div className="text-center px-8">
                <div className="text-4xl font-bold mb-2">
                  <span className="text-primary">{data.headToHead.yourWins}</span>
                  <span className="text-muted-foreground mx-4">×</span>
                  <span className="text-muted-foreground">{data.headToHead.theirWins}</span>
                </div>
                <p className="text-sm text-muted-foreground">Vitórias</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={data.avatar} />
                  <AvatarFallback className="text-2xl">
                    {data.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{data.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Saldo Total */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Saldo Total</p>
                  <p className={`text-2xl font-bold ${getBalanceColor(data.headToHead.totalBalance)}`}>
                    {formatBalance(data.headToHead.totalBalance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maior Prêmio */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Trophy className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maior Prêmio</p>
                  <p className="text-2xl font-bold">R$ {data.headToHead.biggestPrize.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jogo Dominante */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-info/10">
                  <Gamepad2 className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Jogo Dominante</p>
                  <p className="text-lg font-bold">{data.headToHead.dominantGame}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sequência Atual */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-success/10">
                  <Flame className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sequência Atual</p>
                  <p className="text-lg font-bold">
                    {data.headToHead.currentStreak.count}{" "}
                    {data.headToHead.currentStreak.type === "wins" ? "Vitórias" : "Derrotas"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desempenho por Jogo */}
        <Card className="glass-card mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Desempenho por Jogo</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {data.gameStats.map((stat) => {
                const totalGames = stat.yourWins + stat.theirWins;
                const yourPercentage = (stat.yourWins / totalGames) * 100;
                
                return (
                  <AccordionItem key={stat.game} value={stat.game} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4 flex-1">
                          <h3 className="font-semibold text-lg">{stat.game}</h3>
                          <span className="text-sm text-muted-foreground">
                            {stat.yourWins}V - {stat.theirWins}D
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 relative w-32">
                            <Progress value={yourPercentage} className="h-3" />
                          </div>
                          <span className="text-sm font-medium min-w-[50px] text-right">
                            {yourPercentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      {/* Grade de 4 Cards de Estatística */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Card 1: Saldo no Jogo */}
                        <Card className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${stat.balance > 0 ? 'bg-success/10' : stat.balance < 0 ? 'bg-destructive/10' : 'bg-muted'}`}>
                                <DollarSign className={`w-5 h-5 ${stat.balance > 0 ? 'text-success' : stat.balance < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Saldo em {stat.game}</p>
                                <p className={`text-xl font-bold ${getBalanceColor(stat.balance)}`}>
                                  {formatBalance(stat.balance)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Card 2: Sequência no Jogo */}
                        <Card className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${stat.streak.type === 'wins' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                                {stat.streak.type === 'wins' ? (
                                  <Flame className="w-5 h-5 text-success" />
                                ) : (
                                  <Snowflake className="w-5 h-5 text-destructive" />
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Sequência Atual em {stat.game}</p>
                                <p className="text-xl font-bold">
                                  {stat.streak.count > 0 ? (
                                    <>
                                      {stat.streak.count}{" "}
                                      {stat.streak.type === 'wins' ? 'Vitórias' : 'Derrotas'}
                                    </>
                                  ) : (
                                    'Empate'
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Card 3: Maior Prêmio no Jogo */}
                        <Card className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-warning/10">
                                <Award className="w-5 h-5 text-warning" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Maior Prêmio em {stat.game}</p>
                                <p className="text-xl font-bold">
                                  R$ {stat.biggestPrize.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Card 4: Últimas 5 Partidas */}
                        <Card className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-info/10">
                                <Trophy className="w-5 h-5 text-info" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Desempenho Recente</p>
                                <div className="flex gap-2 mt-2">
                                  {stat.lastFiveMatches.map((result, index) => (
                                    <div
                                      key={index}
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        result === 'win' 
                                          ? 'bg-success' 
                                          : result === 'loss'
                                          ? 'bg-destructive'
                                          : 'bg-muted-foreground'
                                      }`}
                                      title={result === 'win' ? 'Vitória' : result === 'loss' ? 'Derrota' : 'Empate'}
                                    >
                                      <span className="text-white text-xs font-bold">
                                        {result === 'win' ? 'V' : result === 'loss' ? 'D' : 'E'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Estatísticas Avançadas (Placeholders) */}
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-sm mb-3 text-muted-foreground">Estatísticas Avançadas</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>• Média de K/D: <span className="italic">Em breve</span></p>
                          <p>• Maior Goleada: <span className="italic">Em breve</span></p>
                          <p>• Taxa de Comeback: <span className="italic">Em breve</span></p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Histórico de Partidas */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Histórico de Confrontos</h2>
            <div className="space-y-3">
              {data.matchHistory.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(match.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{match.game}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">
                      R$ {match.prize.toFixed(2)}
                    </span>
                    <Badge
                      variant={match.result === "win" ? "default" : "secondary"}
                      className={
                        match.result === "win"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }
                    >
                      {match.result === "win" ? "Vitória" : "Derrota"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
