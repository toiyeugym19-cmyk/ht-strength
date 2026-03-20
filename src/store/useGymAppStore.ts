import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, format, isSameDay, subDays } from 'date-fns';

// --- TYPES ---
export interface UserProfile {
    name: string;
    level: number;
    xp: number;
    streak: number;
    badges: string[];
    weight: number;
    height: number;
    tdee: number;
    goal: 'cut' | 'bulk' | 'maintain';
}

export interface WorkoutSession {
    id: string;
    name: string;
    date: string;
    duration: number; // minutes
    caloriesBurned: number;
    volume: number; // kg
    prBreaks: number;
}

export interface NutritionLog {
    id: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    imageUrl?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface GymAppState {
    user: UserProfile;
    workouts: WorkoutSession[];
    nutritionLogs: NutritionLog[];

    // Actions
    addWorkout: (session: Omit<WorkoutSession, 'id'>) => void;
    addNutrition: (log: Omit<NutritionLog, 'id'>) => void;
    checkIn: () => void; // Daily check-in logic
    levelUp: () => void;
}

// --- STORE ---
export const useGymAppStore = create<GymAppState>()(
    persist(
        (set, get) => ({
            user: {
                name: 'Alex Nguyen',
                level: 12,
                xp: 2450,
                streak: 5,
                badges: ['first_step', 'week_warrior'],
                weight: 75,
                height: 175,
                tdee: 2400,
                goal: 'cut'
            },
            workouts: [
                { id: '1', name: 'Upper Body Power', date: format(subDays(new Date(), 0), 'yyyy-MM-dd'), duration: 45, caloriesBurned: 320, volume: 4500, prBreaks: 0 },
                { id: '2', name: 'Leg Day', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), duration: 60, caloriesBurned: 500, volume: 8000, prBreaks: 2 },
                { id: '3', name: 'HIIT Cardio', date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), duration: 30, caloriesBurned: 400, volume: 0, prBreaks: 0 },
            ],
            nutritionLogs: [
                { id: '1', date: format(new Date(), 'yyyy-MM-dd'), mealType: 'breakfast', calories: 450, protein: 30, carbs: 40, fat: 15 },
                { id: '2', date: format(new Date(), 'yyyy-MM-dd'), mealType: 'lunch', calories: 600, protein: 45, carbs: 50, fat: 20 },
            ],

            addWorkout: (session) => set((state) => {
                const newWorkout = { ...session, id: Math.random().toString(36).substr(2, 9) };
                const xpGain = session.duration * 5 + session.prBreaks * 50;

                // Stickiness logic: if workout is today, ensure streak is valid
                // (Simplified)

                return {
                    workouts: [newWorkout, ...state.workouts],
                    user: {
                        ...state.user,
                        xp: state.user.xp + xpGain
                    }
                };
            }),

            addNutrition: (log) => set((state) => ({
                nutritionLogs: [{ ...log, id: Math.random().toString(36).substr(2, 9) }, ...state.nutritionLogs]
            })),

            checkIn: () => { }, // Todo: Implement intricate streak logic
            levelUp: () => set(state => ({ user: { ...state.user, level: state.user.level + 1 } }))
        }),
        {
            name: 'gym-app-storage',
        }
    )
);
