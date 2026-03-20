import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExerciseLog {
    id: string;
    date: string;
    exerciseName: string;
    weight: number;
    reps: number;
    rpe?: number;
    muscleGroup?: string;
    e1RM: number; // Estimated 1-Rep Max
}

export type TrainingClass = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';

type GymState = {
    logs: ExerciseLog[];
    userProfile: {
        weight: number; // kg
        height: number; // cm
        yearsTraining: number;
        trainingClass: TrainingClass;
    };
    weeklyPlan: string[];

    // Actions
    addLog: (log: Omit<ExerciseLog, 'id' | 'e1RM'>) => void;
    updateProfile: (profile: Partial<GymState['userProfile']>) => void;
    updateWeeklyPlan: (dayIndex: number, planType: string) => void;
    calculateTrainingStatus: () => void;
};

// Epley Formula for E1RM
const calculateE1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
};

export const useGymStore = create<GymState>()(
    persist(
        (set, get) => ({
            logs: [
                { id: '1', date: '2025-01-01', exerciseName: 'Bench Press', weight: 100, reps: 5, rpe: 8, e1RM: 116.6 },
                { id: '2', date: '2025-01-02', exerciseName: 'Bench Press', weight: 102.5, reps: 5, rpe: 8.5, e1RM: 119.5 },
                { id: '3', date: '2025-01-08', exerciseName: 'Bench Press', weight: 105, reps: 4, rpe: 9, e1RM: 119 },
                { id: '4', date: '2025-01-15', exerciseName: 'Deadlift', weight: 140, reps: 3, rpe: 7, e1RM: 154 },
            ],
            userProfile: {
                weight: 75,
                height: 175,
                yearsTraining: 2,
                trainingClass: 'INTERMEDIATE'
            },
            weeklyPlan: Array(7).fill('Rest'),

            addLog: (log) => {
                const e1RM = calculateE1RM(log.weight, log.reps);
                set((state) => ({
                    logs: [...state.logs, { ...log, id: crypto.randomUUID(), e1RM }]
                }));
                // Check for plateau breaker/status update after new log
                get().calculateTrainingStatus();
            },

            updateWeeklyPlan: (dayIndex, planType) => set((state) => {
                const newPlan = [...state.weeklyPlan];
                newPlan[dayIndex] = planType;
                return { weeklyPlan: newPlan };
            }),

            updateProfile: (profile) => set((state) => ({
                userProfile: { ...state.userProfile, ...profile }
            })),

            calculateTrainingStatus: () => {
                const { logs, userProfile } = get();
                if (logs.length === 0) return;

                // Simple Training Age Score logic from N8N Blueprint
                // Formula: (Years_Training * 1) + (Squat_1RM / Bodyweight * 2)
                // We'll use the highest e1RM of any compound as a proxy for Squat_1RM if not specific
                const compounds = logs.filter(l => ['Squat', 'Deadlift', 'Bench Press'].includes(l.exerciseName));
                const maxE1RM = Math.max(...compounds.map(l => l.e1RM), 0);

                const strengthRatio = maxE1RM / userProfile.weight;
                const score = (userProfile.yearsTraining * 1) + (strengthRatio * 2);

                let status: TrainingClass = 'BEGINNER';
                if (score > 8) status = 'ELITE';
                else if (score > 5) status = 'ADVANCED';
                else if (score > 2) status = 'INTERMEDIATE';

                set((state) => ({
                    userProfile: { ...state.userProfile, trainingClass: status }
                }));
            }
        }),
        {
            name: 'lifeos-gym-analytics-v2',
        }
    )
);
