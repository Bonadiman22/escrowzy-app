// services/achievementService.ts

import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
// ==========================================================
// 1. DEFINIÇÃO DOS TIPOS
// ==========================================================

// Define o tipo básico de uma Conquista, com base na sua tabela 'achievements'.
// 🚨 ATENÇÃO: Certifique-se de que sua tabela 'achievements' tem os campos 'id', 'name', 'description' e 'icon'.
export type AchievementType = Tables<'achievements'> & {
    id: string; // Garantindo que o ID está presente para usarmos na comparação
    name: string;
    description: string;
    icon: string;
    // ... outros campos que sua tabela 'achievements' possa ter
};


// ==========================================================
// 2. O SERVIÇO DE CONQUISTAS
// ==========================================================

export const achievementService = {

    /**
     * Busca TODAS as conquistas disponíveis no sistema.
     * @returns Uma Promise que resolve para um array de AchievementType ou null.
     */
    async fetchAll(): Promise<AchievementType[] | null> {
        console.log("Buscando todas as conquistas disponíveis...");

        // Faz a consulta na tabela 'achievements'
        const { data, error } = await supabase
            .from('achievements') // 🚨 ATENÇÃO: Confirme que o nome da sua tabela de conquistas é 'achievements'
            .select('*')          // Seleciona todos os campos
            .order('name', { ascending: true }); // Opcional: Ordenar por nome

        if (error) {
            console.error("Erro ao buscar todas as conquistas:", error);
            // É uma boa prática lançar o erro ou retornar null e deixar o componente lidar com ele.
            throw new Error(`Falha ao carregar conquistas: ${error.message}`);
        }

        // Retorna os dados, garantindo que são do tipo esperado.
        // O Supabase já retorna o array se a busca for bem-sucedida.
        return data as AchievementType[];
    }
};