import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExerciseLog {
    exerciseId: string;
    sets: { reps: number; weight: number; completed: boolean }[];
}

export interface WorkoutLog {
    id: string;
    date: string;
    planId: string;
    planName: string;
    durationMinutes: number;
    exercises: ExerciseLog[];
    feeling: 1 | 2 | 3 | 4 | 5; // 1-5 stars
    note?: string;
}

interface WorkoutState {
    logs: WorkoutLog[];
    logSession: (log: WorkoutLog) => void;
    deleteLog: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set) => ({
            logs: [
                {
                    id: 'log-1',
                    date: new Date(Date.now() - 86400000 * 2).toISOString(),
                    planId: 'p1',
                    planName: 'Full Body A',
                    durationMinutes: 45,
                    exercises: [
                        { exerciseId: 'ex1', sets: [{ reps: 12, weight: 60, completed: true }, { reps: 10, weight: 65, completed: true }] }
                    ],
                    feeling: 4
                }
            ],
            logSession: (log) => set((state) => ({ logs: [log, ...state.logs] })),
            deleteLog: (id) => set((state) => ({ logs: state.logs.filter(l => l.id !== id) })),
        }),
        { name: 'superapp-workout-storage' }
    )
);
