import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Target, Zap, TrendingUp, Edit2, Save, Camera, DollarSign, Gamepad2, PieChart, Lock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockProfile = {
  username: "ProGamer2024",
  realName: "João Silva",
  email: "progamer@example.com",
  bio: "Jogador competitivo de FIFA e CS2. Sempre em busca de novos desafios!",
  memberSince: "08 de Outubro de 2025",
  riotId: "ProGamer#BR1",
  psnId: "ProGamer_PSN",
  steamId: "progamer2024",
};

const mockStats = {
  totalWins: 142,
  winRate: 68,
  totalPrize: 1250,
  bestGame: "EA FC 25",
};

const mockAchievements = [
  { id: 1, name: "Invencível", icon: "🏆", unlocked: true, date: "15/09/2025", description: "Vença 5 partidas seguidas" },
  { id: 2, name: "Milionário", icon: "💰", unlocked: true, date: "20/09/2025", description: "Ganhe R$ 1.000 em prêmios" },
  { id: 3, name: "Veterano", icon: "🎖️", unlocked: true, date: "01/10/2025", description: "Participe de 50 torneios" },
  { id: 4, name: "Dominador", icon: "👑", unlocked: false, date: null, description: "Vença 10 partidas seguidas" },
  { id: 5, name: "Lendário", icon: "⭐", unlocked: false, date: null, description: "Alcance 90% de taxa de vitória" },
  { id: 6, name: "Campeão", icon: "🥇", unlocked: false, date: null, description: "Vença 100 torneios" },
];

const mockRecentMatches = [
  { game: "EA FC 25", opponent: "PlayerX", result: "win", date: "Hoje" },
  { game: "CS2", opponent: "NoobMaster", result: "win", date: "Ontem" },
  { game: "EA FC 25", opponent: "ProPlayer", result: "loss", date: "2 dias atrás" },
  { game: "Valorant", opponent: "SharpShooter", result: "win", date: "3 dias atrás" },
];

const mockGameStats = [
  { game: "EA FC 25", wins: 45, losses: 15, winRate: 75, balance: 450 },
  { game: "CS2", wins: 38, losses: 22, winRate: 63, balance: 320 },
  { game: "Valorant", wins: 32, losses: 18, winRate: 64, balance: 280 },
  { game: "League of Legends", wins: 27, losses: 15, winRate: 64, balance: 200 },
];

export const ProfileTab = () => {
  const [profile, setProfile] = useState(mockProfile);

  const handleSave = () => {
    // Aqui você salvaria as alterações no backend
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Perfil */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group">
              <Avatar className="w-32 h-32">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h2 className="text-3xl font-bold">{profile.username}</h2>
              <p className="text-muted-foreground">@{profile.realName.toLowerCase().replace(" ", ".")}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {profile.memberSince}</span>
              </div>
              <Button className="mt-4">
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sistema de Abas */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          <TabsTrigger value="edit">Editar Perfil</TabsTrigger>
        </TabsList>

        {/* Aba 1: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Indicadores Principais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.totalWins}</p>
                      <p className="text-sm text-muted-foreground">Vitórias Totais</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.winRate}%</p>
                      <p className="text-sm text-muted-foreground">Taxa de Vitória</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">R$ {mockStats.totalPrize}</p>
                      <p className="text-sm text-muted-foreground">Total em Prêmios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{mockStats.bestGame}</p>
                      <p className="text-sm text-muted-foreground">Melhor Jogo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Conquistas em Destaque */}
          <div>
            <h3 className="text-xl font-bold mb-4">Últimas Conquistas</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {mockAchievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
                <Card key={achievement.id} className="glass-card min-w-[150px] cursor-pointer hover:scale-105 transition-transform">
                  <CardContent className="pt-6 text-center">
                    <div className="text-5xl mb-2">{achievement.icon}</div>
                    <p className="font-bold">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Atividade Recente */}
          <div>
            <h3 className="text-xl font-bold mb-4">Histórico Recente</h3>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {mockRecentMatches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{match.game}</p>
                          <p className="text-sm text-muted-foreground">vs {match.opponent}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={match.result === 'win' ? 'bg-success/20 text-success hover:bg-success/30' : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}>
                          {match.result === 'win' ? 'Vitória' : 'Derrota'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{match.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba 2: Conquistas */}
        <TabsContent value="achievements" className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Sala de Troféus</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`glass-card text-center ${!achievement.unlocked && 'opacity-50'}`}
                >
                  <CardContent className="pt-6">
                    <div className={`text-6xl mb-3 ${!achievement.unlocked && 'grayscale'}`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="w-16 h-16 mx-auto text-muted-foreground" />}
                    </div>
                    <p className="font-bold mb-1">{achievement.name}</p>
                    {achievement.unlocked ? (
                      <p className="text-sm text-muted-foreground">{achievement.date}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">{achievement.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Aba 3: Estatísticas */}
        <TabsContent value="statistics" className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Desempenho por Jogo</h3>
            <div className="space-y-4">
              {mockGameStats.map((stat, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{stat.game}</p>
                          <p className="text-sm text-muted-foreground">{stat.wins}V - {stat.losses}D</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{stat.winRate}%</p>
                          <p className="text-xs text-muted-foreground">Taxa de Vitória</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${stat.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {stat.balance >= 0 ? '+' : ''} R$ {stat.balance}
                          </p>
                          <p className="text-xs text-muted-foreground">Saldo</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Aba 4: Editar Perfil */}
        <TabsContent value="edit" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Alterar Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Escolher nova foto
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Nickname</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="realName">Nome Completo</Label>
                <Input
                  id="realName"
                  value={profile.realName}
                  onChange={(e) => setProfile({ ...profile, realName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-1">O e-mail não pode ser alterado por segurança</p>
              </div>
              <div>
                <Label htmlFor="bio">Bio Curta</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Contas de Jogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="riotId">Riot ID</Label>
                <Input
                  id="riotId"
                  value={profile.riotId}
                  onChange={(e) => setProfile({ ...profile, riotId: e.target.value })}
                  placeholder="Nome#TAG"
                />
              </div>
              <div>
                <Label htmlFor="psnId">PSN ID</Label>
                <Input
                  id="psnId"
                  value={profile.psnId}
                  onChange={(e) => setProfile({ ...profile, psnId: e.target.value })}
                  placeholder="Seu ID da PlayStation"
                />
              </div>
              <div>
                <Label htmlFor="steamId">Steam ID</Label>
                <Input
                  id="steamId"
                  value={profile.steamId}
                  onChange={(e) => setProfile({ ...profile, steamId: e.target.value })}
                  placeholder="Seu ID da Steam"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline">
              Alterar Senha
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
