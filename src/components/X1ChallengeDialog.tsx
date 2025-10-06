import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface X1ChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockFriends = [
  { id: "1", name: "Carlos Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
  { id: "2", name: "Maria Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
  { id: "3", name: "Pedro Costa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" },
];

const games = ["FIFA 24", "CS2", "League of Legends", "Valorant", "Fortnite"];

export const X1ChallengeDialog = ({ open, onOpenChange }: X1ChallengeDialogProps) => {
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [searchId, setSearchId] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [betAmount, setBetAmount] = useState("");

  const handleChallenge = () => {
    console.log("Desafio criado:", { selectedFriend, searchId, selectedGame, betAmount });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Desafio X1</DialogTitle>
          <DialogDescription>
            Desafie um amigo para uma partida individual
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">
              <Users className="w-4 h-4 mr-2" />
              Amigos
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Buscar ID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            <div className="space-y-2">
              <Label>Selecione um Amigo</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mockFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFriend === friend.id
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedFriend(friend.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{friend.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-id">ID do Jogador</Label>
              <Input
                id="search-id"
                placeholder="Digite o ID do jogador"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game">Jogo</Label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger id="game">
                <SelectValue placeholder="Selecione o jogo" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bet-amount">Valor da Aposta (R$)</Label>
            <Input
              id="bet-amount"
              type="number"
              placeholder="0.00"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleChallenge}
            disabled={(!selectedFriend && !searchId) || !selectedGame || !betAmount}
            className="flex-1 gradient-primary"
          >
            Enviar Desafio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
