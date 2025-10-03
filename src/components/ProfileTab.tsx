import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target, Zap, TrendingUp, Edit2, Save } from "lucide-react";

export const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "ProGamer2024",
    email: "progamer@example.com",
    phone: "+55 11 99999-9999",
    bio: "Jogador competitivo de FIFA e CS2",
  });

  const stats = {
    totalTournaments: 15,
    wins: 8,
    winRate: 53,
    totalPrize: 2500,
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você salvaria as alterações no backend
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        ) : (
          <Button onClick={handleSave} className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        )}
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Alterar Foto
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4">Estatísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalTournaments}</p>
                  <p className="text-sm text-muted-foreground">Torneios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.wins}</p>
                  <p className="text-sm text-muted-foreground">Vitórias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.winRate}%</p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ {stats.totalPrize}</p>
                  <p className="text-sm text-muted-foreground">Prêmios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
