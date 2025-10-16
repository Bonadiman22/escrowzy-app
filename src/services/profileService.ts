
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
// ==========================================================
// 1. DEFINIÇÃO DOS TIPOS
// ==========================================================

// Tipo base do seu perfil (da tabela 'profiles')
export type ProfileType = Tables<'profiles'>;

// Tipo de uma conquista aninhada (vem da sua tabela 'achievements')
interface AchievementType {
    id: string;
    name: string;
    description: string;
    icon: string;
    // Adicione outros campos da tabela 'achievements' se necessário
}

// Tipo da relação de desbloqueio (da tabela 'user_achievements', mas aninhada com a conquista)
interface UserAchievementData {
    unlocked_at: string | null;
    achievement: AchievementType;
}

// 💡 O TIPO QUE O FRONT-END ESPERA (Perfis + Lista de Conquistas)
export type ProfileWithAchievements = ProfileType & {
    user_achievements: UserAchievementData[];
};


// ==========================================================
// 2. O SERVIÇO DE PERFIS
// ==========================================================

export const profileService = {

    /**
     * Busca o perfil do usuário, realizando um JOIN nas conquistas desbloqueadas.
     * @param userId O ID do usuário logado.
     * @returns Um Promise que resolve para ProfileWithAchievements.
     */
    async fetchUserProfile(userId: string): Promise<ProfileWithAchievements | null> {
        
        // Faz a busca na tabela 'profiles' e faz um JOIN na tabela 'user_achievements'
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *, // Seleciona todos os campos da tabela 'profiles'
                user_achievements:user_achievements (
                    unlocked_at,
                    achievement:achievement_id ( id, name, description, icon ) // JOIN na tabela 'achievements'
                )
            `)
            .eq('id', userId) // Filtra pelo ID do usuário
            .maybeSingle();

        if (error) {
            console.error("Erro ao buscar o perfil com conquistas:", error);
            throw error;
        }

        // Se o perfil não for encontrado, retorna null
        if (!data) {
            return null;
        }

        // 🚨 ATENÇÃO: O Supabase retorna a relação como 'user_achievements', que corresponde
        // exatamente à estrutura do nosso tipo 'ProfileWithAchievements'.
        return data as ProfileWithAchievements;
    },

    /**
     * Função para atualizar o perfil (mantida simples, como no seu código).
     */
    async updateProfile(dataToUpdate: Partial<ProfileType>): Promise<ProfileWithAchievements> {
        // 🚨 Você precisará do userId aqui para saber qual linha atualizar
        const userId = 'SUA_LOGICA_PARA_OBTER_USER_ID'; 

        const { data, error } = await supabase
            .from('profiles')
            .update(dataToUpdate)
            .eq('id', userId)
            .select() // Pede o retorno dos dados atualizados
            .single();

        if (error) {
            console.error("Erro ao atualizar perfil:", error);
            throw error;
        }

pleto:
        return this.fetchUserProfile(userId) as Promise<ProfileWithAchievements>;
    }
};