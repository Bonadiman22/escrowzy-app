import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Globe, Bell, Users, User } from "lucide-react";
import { MyTournamentsTab } from "@/components/MyTournamentsTab";
import { PublicTournamentsTab } from "@/components/PublicTournamentsTab";
import { NotificationsTab } from "@/components/NotificationsTab";
import { FriendsTab } from "@/components/FriendsTab";
import { ProfileTab } from "@/components/ProfileTab";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Gerencie seus torneios e conecte-se com outros jogadores</p>
        </div>

        <Tabs defaultValue="my-tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="my-tournaments" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Meus Campeonatos</span>
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Públicos</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Amigos</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-tournaments">
            <MyTournamentsTab />
          </TabsContent>

          <TabsContent value="public">
            <PublicTournamentsTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="friends">
            <FriendsTab />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
