import { supabase } from "@/integrations/supabase/client";

interface TournamentFormData {
  name: string;
  game: string;
  gameMode: string;
  tournamentType: string;
  rounds: string;
  visibility: string;
  crossPlay: boolean;
  maxPlayers: string;
  entryFee: string;
  adjudicationMethod: string;
  description: string;
  startsAt: string;
}

interface Tournament {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  entry_fee: number;
  max_participants: number;
  public: boolean;
  created_at: string;
  starts_at: string;
  ends_at: string;
  status: string;
  // Adicione outros campos que você possa ter no Supabase, como game, game_mode, tournament_type, etc.
  // Estes campos não foram fornecidos no esquema da tabela 'tournaments', mas são usados no frontend.
  // Vou assumir que eles existem ou precisam ser mapeados.
  game: string;
  game_mode: string;
  tournament_type: string;
  rounds: number;
  prize_pool: number; // Assumindo que prize_pool é calculado ou armazenado
  invite_link: string; // Assumindo que invite_link é gerado ou armazenado
  adjudication_method: string; // Assumindo que adjudication_method é armazenado
  participants: Participant[]; // Para incluir participantes ao buscar detalhes do torneio
}

interface Participant {
  id: string;
  tournament_id: string;
  user_id: string;
  joined_at: string;
  status: "pending" | "paid" | "forfeit"; // Mapeando para o status fornecido
  profiles: {
    id: string;
    auth_uid: string;
    email: string;
    full_name: string;
    display_name: string;
    avatar_url?: string; // Adicionado para avatar, se existir na tabela profiles
  } | null;
}

export const createTournament = async (formData: TournamentFormData) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("tournaments" as any)
    .insert({
      owner_id: user.data.user.id,
      title: formData.name, // Mapeando name do form para title da tabela
      description: formData.description,
      entry_fee: parseFloat(formData.entryFee),
      max_participants: parseInt(formData.maxPlayers),
      public: formData.visibility === "public", // Mapeando visibility para public
      created_at: new Date().toISOString(),
      starts_at: formData.startsAt,
      status: "pending", // Status inicial
      // Campos adicionais do frontend que não estão no esquema fornecido, mas são importantes:
      game: formData.game,
      game_mode: formData.gameMode,
      tournament_type: formData.tournamentType,
      rounds: parseInt(formData.rounds),
      adjudication_method: formData.adjudicationMethod,
      prize_pool: parseFloat(formData.entryFee) * parseInt(formData.maxPlayers) * 0.95, // Exemplo de cálculo
      invite_link: `https://escrowzy.com/t/${Math.random().toString(36).substring(2, 15)}`, // Link de convite simples
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar torneio:", error);
    throw error;
  }
  return data;
};

export const getTournamentDetails = async (tournamentId: string): Promise<Tournament | null> => {
  const { data, error } = await supabase
    .from("tournaments" as any)
    .select(`
      *,
      participants(
        id,
        tournament_id,
        user_id,
        joined_at,
        status,
        profiles(
          id,
          auth_uid,
          email,
          full_name,
          display_name,
          avatar_url
        )
      )
    `)
    .eq("id", tournamentId)
    .single();

  if (error) {
    console.error("Erro ao buscar detalhes do torneio:", error);
    return null;
  }
  return data as Tournament;
};

export const getTournamentParticipants = async (tournamentId: string): Promise<Participant[]> => {
  const { data, error } = await supabase
    .from("participants" as any)
    .select(`
      id,
      tournament_id,
      user_id,
      joined_at,
      status,
      profiles(
        id,
        auth_uid,
        email,
        full_name,
        display_name,
        avatar_url
      )
    `)
    .eq("tournament_id", tournamentId);

  if (error) {
    console.error("Erro ao buscar participantes do torneio:", error);
    return [];
  }
  return data as Participant[];
};

export const updateTournament = async (tournamentId: string, updates: Partial<Tournament>) => {
  const { data, error } = await supabase
    .from("tournaments" as any)
    .update(updates as any)
    .eq("id", tournamentId)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar torneio:", error);
    throw error;
  }
  return data;
};

export const removeParticipantFromTournament = async (participantId: string) => {
  const { error } = await supabase
    .from("participants" as any)
    .delete()
    .eq("id", participantId);

  if (error) {
    console.error("Erro ao remover participante:", error);
    throw error;
  }
  return true;
};

export const joinTournament = async (tournamentId: string, userId: string, gamertag: string, entryFee: number) => {
  const { data, error } = await supabase
    .from("participants" as any)
    .insert({
      tournament_id: tournamentId,
      user_id: userId,
      gamertag: gamertag,
      status: entryFee > 0 ? "pending" : "paid",
      joined_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao entrar no torneio:", error);
    throw error;
  }
  return data;
};