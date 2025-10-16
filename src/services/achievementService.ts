

import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// ==========================================================
// 1. DEFINIÇÃO DOS TIPOS (Baseados na sua tabela 'achievements')
// ==========================================================
export type AchievementType = Tables<'achievements'> & {
    id: string; 
    name: string;
    description: string;
    icon: string;
    criteria: string; // Para documentação/lógica de backend
    points: number;
};

// ==========================================================
// 2. O SERVIÇO DE CONQUISTAS
// ==========================================================
export const achievementService = {

    /**
     * Busca TODAS as conquistas disponíveis no sistema.
     * @returns Uma Promise que resolve para um array de AchievementType.
     */
    async fetchAll(): Promise<AchievementType[]> {
        const { data, error } = await supabase
            .from('achievements') 
            .select('*')          
            .order('name', { ascending: true }); 

        if (error) {
            console.error("Erro ao buscar todas as conquistas:", error);
            throw new Error(`Falha ao carregar conquistas: ${error.message}`);
        }

        return (data || []) as AchievementType[];
    }
};