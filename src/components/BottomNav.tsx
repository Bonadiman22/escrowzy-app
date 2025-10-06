import { Trophy, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavProps {
  onCreateTournament: () => void;
  onOpenX1Challenge: () => void;
}

export const BottomNav = ({ onCreateTournament, onOpenX1Challenge }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 h-20">
          <Button
            size="icon"
            className="gradient-primary h-14 w-14 rounded-full"
            onClick={onCreateTournament}
          >
            <Trophy className="w-6 h-6" />
          </Button>
          
          <Button
            size="icon"
            className="gradient-primary h-14 w-14 rounded-full"
            onClick={onOpenX1Challenge}
          >
            <Swords className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
