import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trophy, Check, X } from "lucide-react";

interface Notification {
  id: string;
  type: "friend_request" | "tournament_invite";
  from: string;
  message: string;
  timestamp: string;
  tournamentName?: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "friend_request",
    from: "ProPlayer123",
    message: "enviou uma solicitação de amizade",
    timestamp: "2024-01-15T10:30:00",
    read: false,
  },
  {
    id: "notif-2",
    type: "tournament_invite",
    from: "GamingMaster",
    message: "convidou você para participar",
    tournamentName: "Copa Pro League",
    timestamp: "2024-01-15T09:15:00",
    read: false,
  },
  {
    id: "notif-3",
    type: "friend_request",
    from: "SkillzPlayer",
    message: "enviou uma solicitação de amizade",
    timestamp: "2024-01-14T18:45:00",
    read: true,
  },
];

export const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Notificações</h2>
        <p className="text-muted-foreground">Acompanhe convites e solicitações</p>
      </div>

      <div className="grid gap-3">
        {mockNotifications.map((notification) => (
          <Card key={notification.id} className={`glass-card ${!notification.read ? 'border-primary/50' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === "friend_request" ? "bg-primary/10" : "bg-secondary/10"
                }`}>
                  {notification.type === "friend_request" ? (
                    <UserPlus className="w-5 h-5 text-primary" />
                  ) : (
                    <Trophy className="w-5 h-5 text-secondary" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{notification.from}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                        {notification.tournamentName && (
                          <span className="text-primary"> {notification.tournamentName}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">Nova</Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="gradient-primary">
                      <Check className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button size="sm" variant="outline">
                      <X className="w-4 h-4 mr-1" />
                      Recusar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockNotifications.length === 0 && (
          <Card className="glass-card">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">Nenhuma notificação no momento</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
