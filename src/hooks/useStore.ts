import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES ---
export type ExerciseSet = {
    id: string;
    weight: number;
    reps: number;
    rpe?: number; // Rate of Perceived Exertion (1-10)
    completed: boolean;
};

export type GymExercise = {
    id: string;
    name: string;
    target: string; // e.g., Chest
    sets: ExerciseSet[];
    notes?: string;
    restTimer?: number; // seconds
};

export type WorkoutPlan = {
    id: string;
    name: string;
    exercises: GymExercise[];
    lastPerformed?: string;
};

export type GymLog = {
    id: string;
    date: string;
    planName: string;
    duration: number; // minutes
    totalVolume: number; // kg
    records: number; // PRs broken
    exercises: GymExercise[];
};

// --- INITIAL DATA ---
const initialWorkouts: WorkoutPlan[] = [
    {
        id: '1',
        name: 'Push Day (Power)',
        exercises: [
            {
                id: 'e1',
                name: 'Bench Press',
                target: 'Chest',
                sets: [
                    { id: 's1', weight: 60, reps: 5, completed: false },
                    { id: 's2', weight: 60, reps: 5, completed: false },
                    { id: 's3', weight: 60, reps: 5, completed: false },
                ]
            },
            {
                id: 'e2',
                name: 'Overhead Press',
                target: 'Shoulders',
                sets: [
                    { id: 's4', weight: 40, reps: 8, completed: false },
                    { id: 's5', weight: 40, reps: 8, completed: false },
                ]
            }
        ]
    }
];

// --- ZUSTAND STORE ---

interface LifeOSState {
    workouts: WorkoutPlan[];
    gymLogs: GymLog[];

    // Gym Actions
    addWorkout: (name: string) => void;
    addExerciseToPlan: (planId: string, exerciseName: string, target?: string, initialSets?: number, initialReps?: number) => void;
    deleteExerciseFromPlan: (planId: string, exerciseId: string) => void;
    swapExercise: (planId: string, exerciseId: string, newName: string, newTarget: string) => void;
    updateExerciseNotes: (planId: string, exerciseId: string, notes: string) => void;
    updateExerciseSet: (planId: string, exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => void;
    addSetToExercise: (planId: string, exerciseId: string) => void;
    deleteSetFromExercise: (planId: string, exerciseId: string, setId: string) => void;
    deleteWorkout: (planId: string) => void;
    importWorkout: (plan: WorkoutPlan) => void;
    finishWorkout: (log: GymLog) => void;
}

export const useStore = create<LifeOSState>()(
    persist(
        (set) => ({
            workouts: initialWorkouts,
            gymLogs: [],

            addWorkout: (name) => set((state) => ({
                workouts: [...state.workouts, { id: crypto.randomUUID(), name, exercises: [] }]
            })),

            addExerciseToPlan: (planId, name, target = 'General', initialSets = 3, initialReps = 10) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.id !== planId) return w;
                    return {
                        ...w,
                        exercises: [...w.exercises, {
                            id: crypto.randomUUID(),
                            name,
                            target,
                            sets: Array.from({ length: initialSets }).map(() => ({
                                id: crypto.randomUUID(),
                                weight: 0,
                                reps: initialReps,
                                completed: false
                            }))
                        }]
                    };
                })
            })),

            updateExerciseSet: (planId, exId, setId, updates) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.id !== planId) return w;
                    return {
                        ...w,
                        exercises: w.exercises.map(e => {
                            if (e.id !== exId) return e;
                            return {
                                ...e,
                                sets: e.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
                            };
                        })
                    };
                })
            })),

            addSetToExercise: (planId, exId) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.id !== planId) return w;
                    return {
                        ...w,
                        exercises: w.exercises.map(e => {
                            if (e.id !== exId) return e;
                            const lastSet = e.sets[e.sets.length - 1];
                            return {
                                ...e,
                                sets: [...e.sets, {
                                    id: crypto.randomUUID(),
                                    weight: lastSet ? lastSet.weight : 0,
                                    reps: lastSet ? lastSet.reps : 0,
                                    completed: false
                                }]
                            };
                        })
                    };
                })
            })),

            deleteSetFromExercise: (planId, exId, setId) => set((state) => ({
                workouts: state.workouts.map(w => {
                    if (w.id !== planId) return w;
                    return {
                        ...w,
                        exercises: w.exercises.map(e => {
                            if (e.id !== exId) return e;
                            return {
                                ...e,
                                sets: e.sets.filter(s => s.id !== setId)
                            };
                        })
                    };
                })
            })),

            deleteExerciseFromPlan: (planId, exerciseId) => set((state) => ({
                workouts: state.workouts.map(w => w.id === planId ? {
                    ...w,
                    exercises: w.exercises.filter(ex => ex.id !== exerciseId)
                } : w)
            })),

            swapExercise: (planId, exerciseId, newName, newTarget) => set((state) => ({
                workouts: state.workouts.map(w => w.id === planId ? {
                    ...w,
                    exercises: w.exercises.map(ex => ex.id === exerciseId ? {
                        ...ex,
                        name: newName,
                        target: newTarget
                    } : ex)
                } : w)
            })),

            updateExerciseNotes: (planId, exerciseId, notes) => set((state) => ({
                workouts: state.workouts.map(w => w.id === planId ? {
                    ...w,
                    exercises: w.exercises.map(ex => ex.id === exerciseId ? {
                        ...ex,
                        notes
                    } : ex)
                } : w)
            })),

            deleteWorkout: (planId) => set((state) => ({
                workouts: state.workouts.filter(w => w.id !== planId)
            })),

            importWorkout: (plan) => set((state) => ({
                workouts: [...state.workouts, { ...plan, id: crypto.randomUUID() }]
            })),

            finishWorkout: (log) => set((state) => ({
                gymLogs: [log, ...state.gymLogs]
            }))
        }),
        {
            name: 'lifeos-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
