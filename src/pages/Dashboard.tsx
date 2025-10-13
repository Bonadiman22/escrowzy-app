import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Globe, Mail, Bell, User, LogOut, UserPlus } from "lucide-react";
import { MyTournamentsTab } from "@/components/MyTournamentsTab";
import { PublicTournamentsTab } from "@/components/PublicTournamentsTab";
import { InvitesTab } from "@/components/InvitesTab";
import { FriendsTab } from "@/components/FriendsTab";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { X1ChallengeDialog } from "@/components/X1ChallengeDialog";
import { useAuth } from "@/context/AuthContext"; // Importa o hook de autenticação

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, loading, logout } = useAuth(); // Usa o hook de autenticação

  const [invitesCount] = useState(3); // Mock count - idealmente viria de uma API ou do perfil do usuário
  const [x1ChallengeOpen, setX1ChallengeOpen] = useState(false);

  // Redireciona para a página de autenticação se não estiver autenticado e o carregamento tiver terminado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    await logout(); // Chama a função de logout do AuthContext
    navigate("/auth"); // Redireciona para a página de autenticação após o logout
  };

  const handleCreateTournament = () => {
    navigate("/create-tournament");
  };

  const handleOpenX1Challenge = () => {
    setX1ChallengeOpen(true);
  };

  // Se ainda estiver carregando, pode-se renderizar um spinner ou tela de carregamento
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // Se não estiver autenticado (e não estiver mais carregando), o useEffect já redirecionou.
  // Este return é um fallback, mas o usuário não deve chegar aqui.
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header with Profile and Notifications - Only when authenticated */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold mb-2">Campeonatos</h1>
            <p className="text-muted-foreground">Gerencie seus torneios e participe de novos campeonatos</p>
          </div>

          {isAuthenticated && profile && (
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {invitesCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {invitesCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2">
                    <h4 className="font-semibold">Convites & Solicitações</h4>
                    <Badge variant="secondary">{invitesCount}</Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    {/* Exemplo de item de notificação interativo. Conteúdo deve vir de uma API. */}
                    <DropdownMenuItem onClick={() => navigate("/invites")} className="flex flex-col items-start p-3 cursor-pointer">
                      <p className="font-medium">Você tem {invitesCount} novos convites!</p>
                      <p className="text-xs text-muted-foreground">Clique para ver</p>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.display_name || profile.full_name}`} alt={profile.display_name || profile.full_name || "Usuário"} />
                      <AvatarFallback>{(profile.display_name || profile.full_name || "U").split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-medium">{profile.display_name || profile.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Exibir Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Tabs Navigation - Only show when authenticated */}
        {isAuthenticated ? (
          <Tabs defaultValue="my-tournaments" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="my-tournaments" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Meus Campeonatos</span>
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Públicos</span>
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Convites</span>
                {invitesCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {invitesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Amigos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-tournaments">
              <MyTournamentsTab />
            </TabsContent>

            <TabsContent value="public">
              <PublicTournamentsTab />
            </TabsContent>

            <TabsContent value="invites">
              <InvitesTab />
            </TabsContent>

            <TabsContent value="friends">
              <FriendsTab />
            </TabsContent>
          </Tabs>
        ) : (
          // Se não estiver autenticado, o useEffect já redirecionou. Este bloco não deve ser alcançado.
          <PublicTournamentsTab />
        )}
      </main>

      {isAuthenticated && (
        <>
          <BottomNav 
            onCreateTournament={handleCreateTournament}
            onOpenX1Challenge={handleOpenX1Challenge}
          />
          <X1ChallengeDialog 
            open={x1ChallengeOpen}
            onOpenChange={setX1ChallengeOpen}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
