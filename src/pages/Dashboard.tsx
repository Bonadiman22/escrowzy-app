import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Globe, Mail, Plus, Bell, User, LogOut } from "lucide-react";
import { MyTournamentsTab } from "@/components/MyTournamentsTab";
import { PublicTournamentsTab } from "@/components/PublicTournamentsTab";
import { InvitesTab } from "@/components/InvitesTab";
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
import { Link } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const [invitesCount] = useState(3); // Mock count
  const mockUser = {
    name: "João Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JoaoSilva",
  };

  const handleLogout = () => {
    console.log("Logout");
    // TODO: Implement logout logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header with Profile, Notifications and New Tournament Button */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold mb-2">Campeonatos</h1>
            <p className="text-muted-foreground">Gerencie seus torneios e participe de novos campeonatos</p>
          </div>

          <div className="flex items-center gap-3">
            {/* New Tournament Button */}
            <Button size="lg" className="gradient-primary" asChild>
              <Link to="/create-tournament">
                <Plus className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Novo Campeonato</span>
              </Link>
            </Button>

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
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <p className="font-medium">Convite para Campeonato FIFA</p>
                    <p className="text-xs text-muted-foreground">Carlos Silva te convidou</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <p className="font-medium">Solicitação de Amizade</p>
                    <p className="text-xs text-muted-foreground">Maria Santos quer ser sua amiga</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <p className="font-medium">Convite CS2 Tournament</p>
                    <p className="text-xs text-muted-foreground">Pedro Costa te convidou</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium">{mockUser.name}</span>
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
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="my-tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
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
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
