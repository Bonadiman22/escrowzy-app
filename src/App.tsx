import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import TournamentDetails from "./pages/TournamentDetails";
import TournamentParticipantView from "./pages/TournamentParticipantView";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FriendDetails from "./pages/FriendDetails";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider><BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-tournament" element={<CreateTournament />} />
          <Route path="/tournament/:id" element={<TournamentDetails />} />
          <Route path="/tournament/:id/participant" element={<TournamentParticipantView />} />
          <Route path="/friend/:id" element={<FriendDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter></AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;