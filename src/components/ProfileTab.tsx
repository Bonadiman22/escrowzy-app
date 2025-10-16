import React, { useState, useEffect, useMemo } from "react";
// Importações de componentes
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Edit2, Save, Camera, DollarSign, Gamepad2, PieChart, Lock, Calendar, RefreshCw, Loader2 } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";

// 💡 IMPORTAÇÕES DINÂMICAS
import { profileService, ProfileType, ProfileWithAchievements } from "@/services/profileService";
import { achievementService, AchievementType } from "@/services/achievementService"; 

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ----------------------------------------------------
// MOCKS DE ESTATÍSTICAS (MANTIDOS INTACTOS)
// ----------------------------------------------------
const mockStats = {
  totalWins: 142,
  winRate: 68,
  totalPrize: 1250,
  bestGame: "EA FC 25",
};

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

// DiceBear Avatar Styles
const avatarStyles = [
  "adventurer", "adventurer-neutral", "avataaars", "avataaars-neutral", "big-ears", "big-ears-neutral", "big-smile", "bottts", "bottts-neutral", "croodles", "croodles-neutral", "fun-emoji", "icons", "identicon", "lorelei", "lorelei-neutral", "micah", "miniavs", "notionists", "notionists-neutral", "open-peeps", "personas", "pixel-art", "pixel-art-neutral",
];

// ----------------------------------------------------
// TIPOS AUXILIARES (Para o front-end)
// ----------------------------------------------------

interface CombinedAchievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    date: string | null;
}

interface UserAchievementData {
    unlocked_at: string | null;
    achievement: { id: string; name: string; description: string; icon: string; }; 
}

// ----------------------------------------------------
// 1. INTERFACE DE PROPS
// ----------------------------------------------------
interface ProfileTabProps {
  profile: ProfileWithAchievements; 
  setProfile: React.Dispatch<React.SetStateAction<ProfileWithAchievements | null>>;
}

// ----------------------------------------------------
// 2. DECLARAÇÃO DO COMPONENTE
// ----------------------------------------------------
export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, setProfile }) => {
  const [editedProfile, setEditedProfile] = useState<ProfileType>(profile);
  const [saving, setSaving] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState("avataaars");
  const [avatarSeed, setAvatarSeed] = useState(profile.display_name || profile.full_name || "");
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

    // ESTADOS PARA CONQUISTAS DINÂMICAS
    const [allAchievements, setAllAchievements] = useState<AchievementType[]>([]);
    const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);

  useEffect(() => {
    setEditedProfile(profile);
    setAvatarSeed(profile.display_name || profile.full_name || "");
  }, [profile]);

    // EFEITO PARA BUSCAR TODAS AS CONQUISTAS DO BANCO
    useEffect(() => {
        const fetchAllAchievements = async () => {
            try {
                const data = await achievementService.fetchAll();
                setAllAchievements(data);
            } catch (error) {
                console.error("Erro ao buscar todas as conquistas:", error);
                setAllAchievements([]); 
            } finally {
                setIsLoadingAchievements(false);
            }
        };

        fetchAllAchievements();
    }, []);

    // LÓGICA DE COMBINAÇÃO DE CONQUISTAS
    const combinedAchievements: CombinedAchievement[] = useMemo(() => {
        if (!profile || !allAchievements.length) return [];

        const unlockedMap = new Map<string, UserAchievementData>();
        (profile.user_achievements || []).forEach((ua: any) => {
            unlockedMap.set(ua.achievement.id, ua);
        });

        return allAchievements.map(achievement => {
            const unlockedData = unlockedMap.get(achievement.id);
            const isUnlocked = !!unlockedData;

            return {
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                unlocked: isUnlocked,
                date: isUnlocked && unlockedData?.unlocked_at 
                    ? new Date(unlockedData.unlocked_at).toLocaleDateString('pt-BR') 
                    : null,
            };
        });
    }, [profile, allAchievements]);
    
  // ----------------------------------------------------
  // FUNÇÕES DE HANDLE
  // ----------------------------------------------------
  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToUpdate: Partial<ProfileType> = {
        display_name: editedProfile.display_name,
        avatar_url: editedProfile.avatar_url,
      };

      const updated = await profileService.updateProfile(dataToUpdate);
      setProfile(updated); 
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });

    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      toast({
        title: "Erro ao salvar",
        description: err.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEditedProfile(prev => ({ ...prev, display_name: e.target.value })); };
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEditedProfile(prev => ({ ...prev, full_name: e.target.value })); }; 
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEditedProfile(prev => ({ ...prev, email: e.target.value })); };
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEditedProfile(prev => ({ ...prev, cpf: e.target.value })); };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEditedProfile(prev => ({ ...prev, phone: e.target.value })); };
  const formatDate = (dateString: string) => { const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }; return new Date(dateString).toLocaleDateString('pt-BR', options); };
  const generateAvatarUrl = (style: string, seed: string) => { return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`; };
  const handleAvatarSelect = (style: string) => { setSelectedAvatarStyle(style); };
  const handleAvatarSave = () => {
    const newAvatarUrl = generateAvatarUrl(selectedAvatarStyle, avatarSeed);
    setEditedProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
    setAvatarDialogOpen(false);
    toast({ title: "Avatar selecionado!", description: "Não esqueça de clicar em 'Salvar Alterações' para confirmar.", });
  };
  const randomizeAvatar = () => { setAvatarSeed(Math.random().toString(36).substring(7)); };

  // ----------------------------------------------------
  // 3. JSX (O corpo do componente COMPLETO)
  // ----------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cabeçalho do Perfil */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={editedProfile.avatar_url || ''} />
                    <AvatarFallback className="text-4xl">
                      {editedProfile.display_name 
                        ? editedProfile.display_name.substring(0, 2).toUpperCase() 
                        : profile.full_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Escolher Avatar</DialogTitle>
                  <DialogDescription>
                    Selecione um estilo de avatar e personalize-o.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="avatar-seed">Personalizar Avatar</Label>
                      <Input
                        id="avatar-seed"
                        value={avatarSeed}
                        onChange={(e) => setAvatarSeed(e.target.value)}
                        placeholder="Digite um texto para personalizar"
                      />
                    </div>
                    <Button onClick={randomizeAvatar} variant="outline" className="mt-6">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Aleatório
                    </Button>
                  </div>
                  
                  <div className="flex justify-center p-4 bg-muted rounded-lg">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={generateAvatarUrl(selectedAvatarStyle, avatarSeed)} />
                      <AvatarFallback>Preview</AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <Label>Estilos de Avatar</Label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-2">
                      {avatarStyles.map((style) => (
                        <div
                          key={style}
                          className={`cursor-pointer border-2 rounded-lg p-2 hover:border-primary transition-colors ${
                            selectedAvatarStyle === style ? 'border-primary' : 'border-border'
                          }`}
                          onClick={() => handleAvatarSelect(style)}
                        >
                          <Avatar className="w-full aspect-square">
                            <AvatarImage src={generateAvatarUrl(style, avatarSeed)} />
                            <AvatarFallback>{style.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <p className="text-xs text-center mt-1 truncate">{style}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleAvatarSave} className="w-full">
                    Selecionar Avatar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold">{profile.display_name || profile.full_name}</h2>
                <p className="text-muted-foreground">@{profile.full_name.toLowerCase().replace(/\s/g, ".")}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {formatDate(profile.created_at)}</span>
              </div>

              <Button className="mt-4" onClick={() => setActiveTab("edit")}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sistema de Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          {/* Conquistas em Destaque (DINÂMICO) */}
          <div>
            <h3 className="text-xl font-bold mb-4">Últimas Conquistas</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {combinedAchievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
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

          {/* Atividade Recente (mockRecentMatches) */}
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

        {/* Aba 2: Conquistas (DINÂMICO) */}
        <TabsContent value="achievements" className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Sala de Troféus</h3>
            {/* EXIBIÇÃO DE LOADING */}
            {isLoadingAchievements ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                    <p className="ml-2 text-gray-600">Carregando Sala de Troféus...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* MAPEIA O DADO COMBINADO */}
                    {combinedAchievements.length === 0 ? (
                        <p className="col-span-4 text-center text-gray-500 mt-4">
                            {allAchievements.length === 0 ? "Nenhuma conquista cadastrada no sistema." : "Conquistas do usuário não encontradas."}
                        </p>
                    ) : (
                        combinedAchievements.map((achievement) => (
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
                        ))
                    )}
                </div>
            )}
          </div>
        </TabsContent>

        {/* Aba 3: Estatísticas (mockGameStats) */}
        <TabsContent value="statistics" className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Desempenho por Jogo</h3>
            <div className="space-y-4">
              {mockGameStats.map((stat, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                        <p className="font-medium">{stat.game}</p>
                      </div>
                      <Badge variant="secondary">{stat.winRate}% Win Rate</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vitórias</p>
                        <p className="font-bold">{stat.wins}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Derrotas</p>
                        <p className="font-bold">{stat.losses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ganhos</p>
                        <p className="font-bold">R$ {stat.balance}</p>
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
              <CardTitle>Editar Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input 
                id="full_name" 
                name="full_name"
                value={editedProfile.full_name || ''} 
                onChange={handleFullNameChange} disabled
                />
              </div>
              <div>
                <Label htmlFor="display_name">Nome de Exibição</Label>
                <Input 
                  id="display_name" 
                  name="display_name" 
                  value={editedProfile.display_name || ''} 
                  onChange={handleDisplayNameChange}
                  placeholder="Digite seu nome de exibição"
                />
              </div>
                <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                id="email" 
                name="email" 
                type="email" 
                value={editedProfile.email || ''} 
                onChange={handleEmailChange} disabled 
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                id="cpf" 
                name="cpf" 
                value={editedProfile.cpf || ''} 
                onChange={handleCpfChange}
                disabled />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                id="phone" 
                name="phone" 
                value={editedProfile.phone || ''} 
                onChange={handlePhoneChange} disabled 
                />
              </div>
              
              <Button onClick={handleSave} className="w-full" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};