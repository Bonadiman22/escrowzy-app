export interface ProfileType {
  id: string;
  full_name: string;
  display_name?: string;
  email: string;
  cpf?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface StatsType {
  totalWins: number;
  winRate: number;
  totalPrize: number;
  bestGame: string;
}

export interface RecentMatchType {
  game: string;
  opponent: string;
  result: 'win' | 'loss';
  date: string;
}

export interface GameStatsType {
  game: string;
  wins: number;
  losses: number;
  winRate: number;
  balance: number;
}

export interface AchievementType {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
  date: string | null;
  description: string;
}

// Mock de dados para simular o banco de dados
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (substitua pelas suas variáveis de ambiente)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
interface DbAchievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  created_at: string;
}

interface DbUserAchievement {
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
}



export const profileService = {
  updateProfile: async (data: Partial<ProfileType>): Promise<ProfileType> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aqui você integraria com sua API real
        const updatedProfile: ProfileType = {
          id: "mock-id",
          full_name: "Nome Completo Mock",
          email: "mock@example.com",
          created_at: new Date().toISOString(),
          ...data,
        };
        resolve(updatedProfile);
      }, 500);
    });
  },

  getStats: async (): Promise<StatsType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalWins: 142,
          winRate: 68,
          totalPrize: 1250,
          bestGame: "EA FC 25",
        });
      }, 300);
    });
  },

  getRecentMatches: async (): Promise<RecentMatchType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { game: "EA FC 25", opponent: "PlayerX", result: "win", date: "Hoje" },
          { game: "CS2", opponent: "NoobMaster", result: "win", date: "Ontem" },
          { game: "EA FC 25", opponent: "ProPlayer", result: "loss", date: "2 dias atrás" },
          { game: "Valorant", opponent: "SharpShooter", result: "win", date: "3 dias atrás" },
        ]);
      }, 400);
    });
  },

  getGameStats: async (): Promise<GameStatsType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { game: "EA FC 25", wins: 45, losses: 15, winRate: 75, balance: 450 },
          { game: "CS2", wins: 38, losses: 22, winRate: 63, balance: 320 },
          { game: "Valorant", wins: 32, losses: 18, winRate: 64, balance: 280 },
          { game: "League of Legends", wins: 27, losses: 15, winRate: 64, balance: 200 },
        ]);
      }, 500);
    });
  },

  getAchievements: async (userId: string): Promise<AchievementType[]> => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or Anon Key is not set.');
      return [];
    }

    const { data: achievementsData, error: achievementsError } = await supabase
      .from<DbAchievement>('achievements')
      .select('*');

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      throw achievementsError;
    }

    const { data: userAchievementsData, error: userAchievementsError } = await supabase
      .from<DbUserAchievement>('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError);
      throw userAchievementsError;
    }

    const userUnlockedAchievements = new Map<number, string>();
    userAchievementsData?.forEach(ua => {
      userUnlockedAchievements.set(ua.achievement_id, ua.unlocked_at);
    });

    const combinedAchievements: AchievementType[] = achievementsData?.map(dbAch => ({
      id: dbAch.id,
      name: dbAch.name,
      icon: dbAch.icon,
      description: dbAch.description,
      unlocked: userUnlockedAchievements.has(dbAch.id),
      date: userUnlockedAchievements.get(dbAch.id) || null,
    })) || [];

    return combinedAchievements;
  },
};
