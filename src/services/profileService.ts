
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type ProfileType = Tables<'profiles'>;

export const profileService = {
  async fetchUserProfile(): Promise<ProfileType | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error("Erro ao obter usuário autenticado: " + userError.message);
    }
    if (!user) {
      return null; // Nenhum usuário autenticado
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error("Erro ao buscar perfil: " + error.message);
    }
    return data;
  },

  async updateProfile(profileData: Partial<ProfileType>): Promise<ProfileType> {
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

