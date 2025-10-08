import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ProfileTab } from "@/components/ProfileTab";
import { X1ChallengeDialog } from "@/components/X1ChallengeDialog";

const Profile = () => {
  const navigate = useNavigate();
  const [x1ChallengeOpen, setX1ChallengeOpen] = useState(false);

  const handleCreateTournament = () => {
    navigate("/create-tournament");
  };

  const handleOpenX1Challenge = () => {
    setX1ChallengeOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <ProfileTab />
      </main>
      <BottomNav 
        onCreateTournament={handleCreateTournament}
        onOpenX1Challenge={handleOpenX1Challenge}
      />
      <X1ChallengeDialog 
        open={x1ChallengeOpen} 
        onOpenChange={setX1ChallengeOpen}
      />
    </div>
  );
};

export default Profile;
