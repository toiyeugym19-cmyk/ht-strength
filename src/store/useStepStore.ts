import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================
//  Types
// ============================================================

export interface StepEntry {
    date: string;
    steps: number;
    distance: number; // in km
    calories: number;
    activeMinutes: number;
    floors: number;
}

export interface StepGoal {
    dailySteps: number;
    weeklySteps: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string | null;
    requirement: number;
    type: 'daily_steps' | 'total_steps' | 'streak' | 'distance';
}

interface StepState {
    stepHistory: Record<string, StepEntry>;
    stepGoal: StepGoal;
    achievements: Achievement[];
    currentStreak: number;
    bestStreak: number;
    // Actions
    updateSteps: (date: string, steps: number) => void;
    setStepGoal: (goal: Partial<StepGoal>) => void;
    getStepsForDate: (date: string) => StepEntry;
    getWeeklySteps: (endDate: string) => StepEntry[];
    getMonthlySteps: (yearMonth: string) => StepEntry[];
    getTotalSteps: () => number;
    checkAchievements: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first-1k', title: 'First Steps', description: 'Walk 1,000 steps in a day', icon: '👶', unlockedAt: null, requirement: 1000, type: 'daily_steps' },
    { id: 'walk-5k', title: 'Daily Walker', description: 'Walk 5,000 steps in a day', icon: '🚶', unlockedAt: null, requirement: 5000, type: 'daily_steps' },
    { id: 'walk-10k', title: 'Step Master', description: 'Walk 10,000 steps in a day', icon: '🏃', unlockedAt: null, requirement: 10000, type: 'daily_steps' },
    { id: 'walk-15k', title: 'Marathon Spirit', description: 'Walk 15,000 steps in a day', icon: '🏅', unlockedAt: null, requirement: 15000, type: 'daily_steps' },
    { id: 'walk-20k', title: 'Legendary Walker', description: 'Walk 20,000 steps in a day', icon: '🏆', unlockedAt: null, requirement: 20000, type: 'daily_steps' },
    { id: 'total-50k', title: 'Journey Begins', description: 'Walk 50,000 total steps', icon: '🌟', unlockedAt: null, requirement: 50000, type: 'total_steps' },
    { id: 'total-100k', title: 'Century Steps', description: 'Walk 100,000 total steps', icon: '💫', unlockedAt: null, requirement: 100000, type: 'total_steps' },
    { id: 'streak-3', title: 'Consistent', description: '3-day goal streak', icon: '🔥', unlockedAt: null, requirement: 3, type: 'streak' },
    { id: 'streak-7', title: 'Week Warrior', description: '7-day goal streak', icon: '⚡', unlockedAt: null, requirement: 7, type: 'streak' },
    { id: 'streak-30', title: 'Iron Will', description: '30-day goal streak', icon: '💎', unlockedAt: null, requirement: 30, type: 'streak' },
];

const EMPTY_STEP: StepEntry = { date: '', steps: 0, distance: 0, calories: 0, activeMinutes: 0, floors: 0 };

export const useStepStore = create<StepState>()(
    persist(
        (set, get) => ({
            stepHistory: {},
            stepGoal: { dailySteps: 10000, weeklySteps: 70000 },
            achievements: DEFAULT_ACHIEVEMENTS,
            currentStreak: 0,
            bestStreak: 0,

            updateSteps: (date, steps) => {
                const distance = Math.round(steps * 0.0008 * 100) / 100; // avg stride ~0.8m
                const calories = Math.round(steps * 0.04);
                const activeMinutes = Math.round(steps / 100);
                set(state => ({
                    stepHistory: {
                        ...state.stepHistory,
                        [date]: { date, steps, distance, calories, activeMinutes, floors: 0 },
                    }
                }));
                get().checkAchievements();
            },

            setStepGoal: (goal) => {
                set(state => ({ stepGoal: { ...state.stepGoal, ...goal } }));
            },

            getStepsForDate: (date) => get().stepHistory[date] || { ...EMPTY_STEP, date },

            getWeeklySteps: (endDate) => {
                const result: StepEntry[] = [];
                const end = new Date(endDate);
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(end);
                    d.setDate(d.getDate() - i);
                    const key = d.toISOString().split('T')[0];
                    result.push(get().stepHistory[key] || { ...EMPTY_STEP, date: key });
                }
                return result;
            },

            getMonthlySteps: (yearMonth) => {
                const entries = Object.values(get().stepHistory)
                    .filter(e => e.date.startsWith(yearMonth))
                    .sort((a, b) => a.date.localeCompare(b.date));
                return entries;
            },

            getTotalSteps: () => {
                return Object.values(get().stepHistory).reduce((sum, e) => sum + e.steps, 0);
            },

            checkAchievements: () => {
                const { stepHistory, stepGoal, achievements } = get();
                const totalSteps = Object.values(stepHistory).reduce((s, e) => s + e.steps, 0);
                const maxDailySteps = Math.max(...Object.values(stepHistory).map(e => e.steps), 0);

                // Calculate streak
                const dates = Object.keys(stepHistory).sort().reverse();
                let streak = 0;
                const today = new Date().toISOString().split('T')[0];
                for (let i = 0; i < dates.length; i++) {
                    const expected = new Date();
                    expected.setDate(expected.getDate() - i);
                    const key = expected.toISOString().split('T')[0];
                    if (stepHistory[key] && stepHistory[key].steps >= stepGoal.dailySteps) {
                        streak++;
                    } else break;
                }

                const updated = achievements.map(a => {
                    if (a.unlockedAt) return a;
                    let unlocked = false;
                    if (a.type === 'daily_steps' && maxDailySteps >= a.requirement) unlocked = true;
                    if (a.type === 'total_steps' && totalSteps >= a.requirement) unlocked = true;
                    if (a.type === 'streak' && streak >= a.requirement) unlocked = true;
                    return unlocked ? { ...a, unlockedAt: new Date().toISOString() } : a;
                });

                set({
                    achievements: updated,
                    currentStreak: streak,
                    bestStreak: Math.max(get().bestStreak, streak),
                });
            },
        }),
        {
            name: 'step-storage-v1',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
