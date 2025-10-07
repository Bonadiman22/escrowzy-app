import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, MessageCircle, Swords } from "lucide-react";

interface Friend {
  id: string;
  username: string;
  avatar?: string;
  yourWins: number;
  theirWins: number;
  balance: number;
  online: boolean;
}

const mockFriends: Friend[] = [
  {
    id: "friend-1",
    username: "ProPlayer123",
    yourWins: 8,
    theirWins: 5,
    balance: 120.50,
    online: true,
  },
  {
    id: "friend-2",
    username: "GamingMaster",
    yourWins: 4,
    theirWins: 7,
    balance: -85.00,
    online: false,
  },
  {
    id: "friend-3",
    username: "SkillzPlayer",
    yourWins: 10,
    theirWins: 10,
    balance: 0,
    online: true,
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

      <div className="grid gap-3">
        {mockFriends.map((friend) => (
          <Card 
            key={friend.id} 
            className="glass-card hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(`/friend/${friend.id}`)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {friend.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">{friend.username}</p>
                      {friend.online && (
                        <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                          Online
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Swords className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          Você {friend.yourWins}V vs {friend.theirWins}V Ele
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Saldo vs Ele: </span>
                        <span className={`font-semibold ${getBalanceColor(friend.balance)}`}>
                          {formatBalance(friend.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Desafiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
