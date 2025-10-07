import { Trophy, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavProps {
  onCreateTournament: () => void;
  onOpenX1Challenge: () => void;
}

export const BottomNav = ({ onCreateTournament, onOpenX1Challenge }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-12 h-20">
          <button
            className="group relative flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110"
            onClick={onCreateTournament}
          >
            <div className="gradient-primary h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-6 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Campeonato
            </span>
          </button>
          
          <button
            className="group relative flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110"
            onClick={onOpenX1Challenge}
          >
            <div className="gradient-primary h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300">
              <Swords className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-6 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              X1
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
