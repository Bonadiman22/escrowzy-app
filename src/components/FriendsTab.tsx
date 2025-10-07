import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Search, UserPlus, MessageCircle, Flame } from "lucide-react";

interface Friend {
  id: string;
  username: string;
  avatar?: string;
  yourWins: number;
  theirWins: number;
  balance: number;
  online: boolean;
  winStreak: number;
}

const mockFriends: Friend[] = [
  {
    id: "friend-1",
    username: "ProPlayer123",
    yourWins: 8,
    theirWins: 5,
    balance: 120.50,
    online: true,
    winStreak: 3,
  },
  {
    id: "friend-2",
    username: "GamingMaster",
    yourWins: 4,
    theirWins: 7,
    balance: -85.00,
    online: false,
    winStreak: 0,
  },
  {
    id: "friend-3",
    username: "SkillzPlayer",
    yourWins: 10,
    theirWins: 10,
    balance: 0,
    online: true,
    winStreak: 2,
  },
];

export const FriendsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Amigos</h2>
        <p className="text-muted-foreground">Gerencie suas conexões e histórico de partidas</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome de usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gradient-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockFriends.map((friend) => {
          const totalGames = friend.yourWins + friend.theirWins;
          const winPercentage = totalGames > 0 ? (friend.yourWins / totalGames) * 100 : 50;
          
          return (
            <Card 
              key={friend.id} 
              className="glass-card hover:shadow-xl transition-all cursor-pointer animate-fade-in hover-scale"
              onClick={() => navigate(`/friend/${friend.id}`)}
            >
              <CardContent className="pt-6 pb-6 space-y-4">
                {/* Seção Superior: Placar do Confronto */}
                <div className="flex items-center justify-between gap-3">
                  {/* Avatar do Usuário */}
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      VC
                    </AvatarFallback>
                  </Avatar>

                  {/* Círculos de Vitórias e Derrotas */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">{friend.yourWins}</span>
                      </div>
                      {friend.winStreak >= 2 && (
                        <div className="absolute -top-1 -right-1 bg-warning rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-md">
                          <Flame className="w-3 h-3 text-warning-foreground" />
                          <span className="text-xs font-bold text-warning-foreground">{friend.winStreak}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl font-bold">{friend.theirWins}</span>
                    </div>
                  </div>

                  {/* Avatar do Amigo */}
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-border">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="bg-muted font-bold">
                        {friend.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {friend.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                </div>

                {/* Seção Central: Identificação e Status */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-bold text-lg">{friend.username}</h3>
                    {friend.online && (
                      <Badge className="bg-success/10 text-success border-success/20 text-xs" variant="outline">
                        Online
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Seção Intermediária: Medidor de Domínio */}
                <div className="space-y-2">
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-destructive/20">
                    <div 
                      className="h-full bg-success transition-all duration-500 ease-out"
                      style={{ width: `${winPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{winPercentage.toFixed(0)}% Você</span>
                    <span>{(100 - winPercentage).toFixed(0)}% Ele</span>
                  </div>
                </div>

                {/* Seção Inferior: Financeiro */}
                <div className="flex justify-center">
                  <div className={`px-4 py-2 rounded-full ${
                    friend.balance > 0 
                      ? 'bg-success/20 border border-success/30' 
                      : friend.balance < 0 
                      ? 'bg-destructive/20 border border-destructive/30'
                      : 'bg-muted border border-border'
                  }`}>
                    <span className={`font-bold text-sm ${getBalanceColor(friend.balance)}`}>
                      Saldo: {formatBalance(friend.balance)}
                    </span>
                  </div>
                </div>

                {/* Seção de Ações: Botões */}
                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 gradient-primary transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Desafiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
