import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DietPhase = 'cutting' | 'bulking' | 'maintenance' | 'recomp';

export interface DietExtension {
    id: string;
    name: string;
    description: string;
    macroSplit: {
        protein: number; // percentage
        carbs: number;
        fat: number;
    };
    icon: string;
}

export type MealCommit = {
    id: string;
    message: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    date: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout';
};

export type NutriGoal = {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
};

interface NutritionState {
    commits: MealCommit[];
    goals: NutriGoal;
    currentPhase: DietPhase;
    activeExtensionId: string | null;
    userWeight: number; // in kg

    // Actions
    addCommit: (commit: Omit<MealCommit, 'id'>) => void;
    deleteCommit: (id: string) => void;
    updateGoals: (goals: NutriGoal) => void;
    setPhase: (phase: DietPhase) => void;
    setWeight: (weight: number) => void;
    applyExtension: (extensionId: string) => void;
    calculateAutoPlan: () => void;
}

export const DIET_EXTENSIONS: DietExtension[] = [
    {
        id: 'keto-core',
        name: 'Keto (Low Carb)',
        description: 'Chế độ ăn ít tinh bột, giàu chất béo để đốt mỡ tối đa.',
        macroSplit: { protein: 25, carbs: 5, fat: 70 },
        icon: '🥑'
    },
    {
        id: 'bulk-pro',
        name: 'Tăng Cơ (High Carb)',
        description: 'Ưu tiên tinh bột và đạm để tối ưu hóa hiệu suất tập luyện.',
        macroSplit: { protein: 30, carbs: 50, fat: 20 },
        icon: '💪'
    },
    {
        id: 'balanced-git',
        name: 'Cân Bằng (Balance)',
        description: 'Dinh dưỡng cân đối để duy trì sức khỏe và vóc dáng.',
        macroSplit: { protein: 30, carbs: 40, fat: 30 },
        icon: '⚖️'
    }
];

export const useNutritionStore = create<NutritionState>()(
    persist(
        (set, get) => ({
            commits: [],
            goals: {
                dailyCalories: 2500,
                protein: 180,
                carbs: 250,
                fat: 70
            },
            currentPhase: 'maintenance',
            activeExtensionId: 'balanced-git',
            userWeight: 75,

            addCommit: (commitData) => set((state) => ({
                commits: [{ ...commitData, id: crypto.randomUUID() }, ...state.commits]
            })),

            deleteCommit: (id) => set((state) => ({
                commits: state.commits.filter(c => c.id !== id)
            })),

            updateGoals: (goals) => set({ goals }),

            setPhase: (phase) => {
                set({ currentPhase: phase });
                get().calculateAutoPlan();
            },

            setWeight: (weight) => set({ userWeight: weight }),

            applyExtension: (extensionId) => {
                set({ activeExtensionId: extensionId });
                get().calculateAutoPlan();
            },

            calculateAutoPlan: () => {
                const state = get();
                const weight = state.userWeight;
                const phase = state.currentPhase;
                const extension = DIET_EXTENSIONS.find(e => e.id === state.activeExtensionId) || DIET_EXTENSIONS[2];

                // Simple BMR estimation + Activity
                let baseCalories = weight * 22 * 1.5; // Roughly 33 kcal/kg for active male

                if (phase === 'cutting') baseCalories -= 500;
                if (phase === 'bulking') baseCalories += 500;
                if (phase === 'recomp') baseCalories -= 100;

                const protein = Math.round((baseCalories * (extension.macroSplit.protein / 100)) / 4);
                const carbs = Math.round((baseCalories * (extension.macroSplit.carbs / 100)) / 4);
                const fat = Math.round((baseCalories * (extension.macroSplit.fat / 100)) / 9);

                set({
                    goals: {
                        dailyCalories: Math.round(baseCalories),
                        protein,
                        carbs,
                        fat
                    }
                });
            }
        }),
        {
            name: 'nutri-git-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
