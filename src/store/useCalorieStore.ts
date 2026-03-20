import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';

// ============================================================
//  Types
// ============================================================

export interface FoodEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    quantity: number;
    unit: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    timestamp: string;
    emoji?: string;
}

export interface DailyCalorieData {
    entries: FoodEntry[];
    waterGlasses: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
}

export interface CalorieGoal {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    autoDetect: boolean;
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal: 'lose' | 'maintain' | 'gain';
}

interface CalorieState {
    dailyData: Record<string, DailyCalorieData>;
    calorieGoal: CalorieGoal;
    // Actions
    addFoodEntry: (date: string, entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
    removeFoodEntry: (date: string, entryId: string) => void;
    addWater: (date: string) => void;
    removeWater: (date: string) => void;
    updateGoal: (goal: Partial<CalorieGoal>) => void;
    autoDetectCalories: () => void;
    getDayData: (date: string) => DailyCalorieData;
    getDayTotals: (date: string) => { calories: number; protein: number; carbs: number; fat: number; fiber: number };
}

const DEFAULT_GOAL: CalorieGoal = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    autoDetect: false,
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
};

const EMPTY_DAY: DailyCalorieData = {
    entries: [],
    waterGlasses: 0,
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 65,
};

// Harris-Benedict BMR Calculator
function calculateTDEE(goal: CalorieGoal): number {
    let bmr: number;
    if (goal.gender === 'male') {
        bmr = 88.362 + (13.397 * goal.weight) + (4.799 * goal.height) - (5.677 * goal.age);
    } else {
        bmr = 447.593 + (9.247 * goal.weight) + (3.098 * goal.height) - (4.330 * goal.age);
    }

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    let tdee = bmr * multipliers[goal.activityLevel];

    if (goal.goal === 'lose') tdee -= 500;
    if (goal.goal === 'gain') tdee += 300;

    return Math.round(tdee);
}

export const useCalorieStore = create<CalorieState>()(
    persist(
        (set, get) => ({
            dailyData: {},
            calorieGoal: DEFAULT_GOAL,

            addFoodEntry: (date, entry) => {
                const newEntry: FoodEntry = {
                    ...entry,
                    id: `food-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    timestamp: new Date().toISOString(),
                };
                set(state => ({
                    dailyData: {
                        ...state.dailyData,
                        [date]: {
                            ...(state.dailyData[date] || EMPTY_DAY),
                            entries: [...(state.dailyData[date]?.entries || []), newEntry],
                        }
                    }
                }));
            },

            removeFoodEntry: (date, entryId) => {
                set(state => ({
                    dailyData: {
                        ...state.dailyData,
                        [date]: {
                            ...(state.dailyData[date] || EMPTY_DAY),
                            entries: (state.dailyData[date]?.entries || []).filter(e => e.id !== entryId),
                        }
                    }
                }));
            },

            addWater: (date) => {
                set(state => ({
                    dailyData: {
                        ...state.dailyData,
                        [date]: {
                            ...(state.dailyData[date] || EMPTY_DAY),
                            waterGlasses: (state.dailyData[date]?.waterGlasses || 0) + 1,
                        }
                    }
                }));
            },

            removeWater: (date) => {
                set(state => ({
                    dailyData: {
                        ...state.dailyData,
                        [date]: {
                            ...(state.dailyData[date] || EMPTY_DAY),
                            waterGlasses: Math.max(0, (state.dailyData[date]?.waterGlasses || 0) - 1),
                        }
                    }
                }));
            },

            updateGoal: (partial) => {
                set(state => ({
                    calorieGoal: { ...state.calorieGoal, ...partial }
                }));
            },

            autoDetectCalories: () => {
                const goal = get().calorieGoal;
                const tdee = calculateTDEE(goal);
                const protein = Math.round(goal.weight * 2); // 2g/kg
                const fat = Math.round(tdee * 0.25 / 9); // 25% from fat
                const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);
                set({
                    calorieGoal: {
                        ...goal,
                        calories: tdee,
                        protein, carbs, fat,
                        autoDetect: true,
                    }
                });
            },

            getDayData: (date) => get().dailyData[date] || EMPTY_DAY,

            getDayTotals: (date) => {
                const entries = get().dailyData[date]?.entries || [];
                return entries.reduce((acc, e) => ({
                    calories: acc.calories + e.calories,
                    protein: acc.protein + e.protein,
                    carbs: acc.carbs + e.carbs,
                    fat: acc.fat + e.fat,
                    fiber: acc.fiber + (e.fiber || 0),
                }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
            },
        }),
        {
            name: 'calorie-storage-v1',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
