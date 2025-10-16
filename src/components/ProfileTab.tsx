// ProfileTab.tsx

import React, { useEffect, useState, useMemo } from "react";
// 💡 MANTENHA O PROFILE SERVICE
import { profileService, ProfileWithAchievements } from "@/services/profileService";
// 💡 AGORA IMPORTAMOS O NOVO SERVIÇO DE CONQUISTAS
import { achievementService, AchievementType } from "@/services/achievementService"; 
import { Loader2 } from "lucide-react"; // Importe um ícone de loading se estiver usando lucide-react

// ------------------------------------------------------------------
// 1. TIPOS AUXILIARES (Para a conquista combinada)
// ------------------------------------------------------------------

// Definimos como é o dado de uma conquista desbloqueada que vem do Profile
// 🚨 ATENÇÃO: Se o seu objeto 'user_achievements' for diferente, ajuste este tipo!
interface UnlockedAchievementData {
    unlocked_at: string | null;
    achievement: { // Deve ser a AchievementType real, mas aninhada.
        id: string;
        name: string;
        description: string;
        icon: string;
    }
}

// O tipo final que teremos para renderizar
interface CombinedAchievement extends AchievementType {
    isUnlocked: boolean;
    unlocked_at: string | null;
}

// ------------------------------------------------------------------
// 2. COMPONENTE PROFILETAB
// ------------------------------------------------------------------

interface ProfileTabProps {
    profile: ProfileWithAchievements;
    setProfile: React.Dispatch<React.SetStateAction<ProfileWithAchievements | null>>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, setProfile }) => {
    
    // 💡 ESTADO: Para armazenar TODAS as conquistas (do banco)
    const [allAchievements, setAllAchievements] = useState<AchievementType[]>([]);
    const [isLoadingAll, setIsLoadingAll] = useState(true);

    // 💡 useEffect: Buscar todas as conquistas (só roda uma vez)
    useEffect(() => {
        const fetchAllAchievements = async () => {
            try {
                const data = await achievementService.fetchAll();
                setAllAchievements(data);
            } catch (error) {
                console.error("Erro ao buscar todas as conquistas:", error);
                // Opcional: Mostrar uma mensagem de erro na UI
            } finally {
                setIsLoadingAll(false);
            }
        };

        fetchAllAchievements();
    }, []);


    // 💡 useMemo: Lógica para combinar as conquistas
    const combinedAchievements: CombinedAchievement[] = useMemo(() => {
        if (!profile || !allAchievements.length) return [];

        // 1. Crie um Map (ou Set) de IDs para uma busca rápida nas desbloqueadas
        const unlockedMap = new Map<string, UnlockedAchievementData>();
        profile.user_achievements.forEach((ua: UnlockedAchievementData) => {
            // Usamos o ID da conquista (achievement.id) como chave
            unlockedMap.set(ua.achievement.id, ua);
        });

        // 2. Combine as listas: itere sobre todas e verifique se está no Map de desbloqueadas
        return allAchievements.map(achievement => {
            const unlockedData = unlockedMap.get(achievement.id);
            const isUnlocked = !!unlockedData;

            return {
                ...achievement,
                isUnlocked,
                unlocked_at: unlockedData?.unlocked_at || null,
            };
        });
    }, [profile, allAchievements]); 
    // Recalcula se o 'profile' ou a lista de 'allAchievements' mudar


    // ------------------------------------------------------------------
    // 3. RENDERIZAÇÃO
    // ------------------------------------------------------------------

    if (isLoadingAll) {
        // Exibe um loading enquanto as conquistas são buscadas
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                <p className="ml-2 text-gray-600">Carregando conquistas...</p>
            </div>
        );
    }
    
    // Se não houver conquistas cadastradas no banco
    if (combinedAchievements.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Nenhuma conquista cadastrada no sistema ainda.</p>;
    }


    return (
        // ...
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Conquistas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                
                {combinedAchievements.map((item) => (
                    <div
                        key={item.id}
                        // 💡 CLASSE PRINCIPAL: Estilo dinâmico
                        className={`p-4 rounded-lg shadow-md transition-all duration-300 transform 
                                    ${item.isUnlocked 
                                        ? "bg-white hover:shadow-lg hover:scale-[1.02]" 
                                        : "bg-gray-100 border border-dashed border-gray-300 opacity-60 grayscale"
                                    }`}
                    >
                        <div className="text-3xl mb-2 text-center">
                            <span role="img" aria-label={item.name}>
                                {/* Usa o ícone da conquista se desbloqueada, cadeado se bloqueada */}
                                {item.isUnlocked ? item.icon : "🔒"} 
                            </span>
                        </div>
                        <p className="text-sm font-medium text-center truncate">
                            {item.name}
                        </p>
                        
                        {/* 💡 INFORMAÇÃO SECUNDÁRIA: Detalhes */}
                        {item.isUnlocked ? (
                            <p className="text-xs text-gray-500 text-center mt-1">
                                Desbloqueado em: {item.unlocked_at ? new Date(item.unlocked_at).toLocaleDateString() : "Data Indisponível"}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400 text-center mt-1 italic" title={item.description}>
                                {/* Mostra a descrição como dica para o que falta */}
                                **{item.description}**
                            </p>
                        )}
                        
                    </div>
                ))}
            </div>
        </div>

        // ...
    );
};