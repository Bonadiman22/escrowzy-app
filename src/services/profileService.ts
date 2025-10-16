// Assumindo que você tem os tipos gerados pelo Supabase CLI

import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// 1. Defina o tipo de Conquista para a resposta aninhada
// O Supabase aninha o objeto da tabela 'achievements' na resposta.
interface AchievementDetails {
    name: string;
    description: string;
    icon: string;
    points: number;
    // Adicione outros campos de 'achievements' que você queira
}

// 2. Defina o tipo para o item da tabela 'user_achievements'
// O Supabase renomeia a FK 'achievement_id' para o que você especificar no select,
// e aninha os detalhes da conquista.
interface UserAchievement {
    unlocked_at: string;
    achievement: AchievementDetails; // O objeto aninhado que vem de 'achievements'
}

// 3. Defina o novo tipo de Perfil (com a lista de conquistas)
// Ele será o seu tipo base 'profiles' MAIS o array de 'user_achievements'.
export type ProfileWithAchievements = Tables<'profiles'> & {
    user_achievements: UserAchievement[];
};


export const profileService = {
 async fetchUserProfile(): Promise<ProfileWithAchievements | null> {
 const { data: { user }, error: userError } = await supabase.auth.getUser();
 if (userError) {
 throw new Error("Erro ao obter usuário autenticado: " + userError.message);
 }
 if (!user) {
return null;
 }

 // 🔑 A chave para o relacionamento está aqui:
 const { data, error } = await supabase
 .from('profiles')
 .select(`
*, // Seleciona todas as colunas da tabela 'profiles'
user_achievements (
 unlocked_at,
 achievement:achievement_id ( // Faz JOIN com 'achievements' e renomeia o objeto
 name,
 description,
 icon,
 points
)
)
 `)
 .eq('id', user.id)
.single();

 if (error) {
 throw new Error("Erro ao buscar perfil com conquistas: " + error.message);
}

    // É necessário fazer o casting para o novo tipo
 return data as ProfileWithAchievements;
 },

    // ... (Seu método updateProfile permanece inalterado)
    async updateProfile(profileData: Partial<Tables<'profiles'>>): Promise<Tables<'profiles'>> {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            throw new Error("Erro ao obter usuário autenticado: " + userError.message);
        }
        if (!user) {
            throw new Error("Nenhum usuário autenticado para atualizar o perfil.");
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            throw new Error("Erro ao atualizar perfil: " + error.message);
        }
        return data;
    },
};