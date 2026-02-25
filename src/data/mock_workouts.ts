// ========================================
// N8N GYM AUTOMATION BLUEPRINT - DATA LAYER
// Derived from: N8N_FULL_BLUEPRINT.md
// ========================================

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    type: 'COMPOUND' | 'ISOLATION';
    muscleGroup?: string;
    fatigueCost?: 'HIGH' | 'MEDIUM' | 'LOW';
    cnsDemand?: 'HIGH' | 'MEDIUM' | 'LOW';
    restSeconds?: number;
}

export interface WorkoutProgram {
    id: string;
    name: string;
    level: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    duration: string;
    focus: string;
    description: string;
    cover: string;
    exercises: Exercise[];
}

// --- WARM-UP PROTOCOLS (Blueprint Step 100,100-102) ---
export const WARMUP_PROTOCOLS: Record<string, { steps: string[], duration: number }> = {
    'Bench Press': {
        steps: [
            'Step A: Thoracic Spine Mobility (Cat-Cow, Extensions) - 2 min',
            'Step B: Rotator Cuff Stability (External Rotation Band Work) - 2 min',
            'Step C: Light DB Flyes to Activate Pecs - 10 reps',
            'Ramp-up: Bar x 10 → 40kg x 5 → 60% x 3 → 80% x 1 → 90% x 1'
        ],
        duration: 8
    },
    'Squat': {
        steps: [
            'Step A: Hip Flexor Stretch (90/90) - 2 min',
            'Step B: Ankle Mobility (Knee-to-Wall) - 2 min',
            'Step C: Goblet Squat Hold - 30s',
            'Ramp-up: Bar x 10 → 40kg x 5 → 60% x 3 → 80% x 1 → 90% x 1'
        ],
        duration: 8
    },
    'Deadlift': {
        steps: [
            'Step A: Hamstring Activation (RDL with Band) - 2 min',
            'Step B: Cat-Cow for Spine Neutrality - 1 min',
            'Step C: Glute Bridge Hold - 30s',
            'Ramp-up: Bar x 5 → 60kg x 3 → 80% x 2 → 90% x 1'
        ],
        duration: 7
    },
    'Overhead Press': {
        steps: [
            'Step A: Shoulder Dislocates with Band - 10 reps',
            'Step B: Face Pulls - 15 reps',
            'Step C: Light DB Press - 10 reps',
            'Ramp-up: Bar x 8 → 50% x 5 → 70% x 3 → 85% x 1'
        ],
        duration: 6
    }
};

// --- REST TIME BY EXERCISE TYPE (Blueprint Step 200,100-102) ---
export const REST_TIME_SECONDS: Record<string, number> = {
    'Deadlift': 180,      // High CNS Demand
    'Squat': 180,
    'Bench Press': 150,
    'Overhead Press': 120,
    'Barbell Row': 120,
    'default_compound': 120,
    'default_isolation': 60
};

// --- FATIGUE COST BY EXERCISE (Blueprint Step 000,202) ---
export const FATIGUE_COST: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
    'Deadlift': 'HIGH',
    'Squat': 'HIGH',
    'Romanian Deadlift': 'HIGH',
    'Bench Press': 'MEDIUM',
    'Overhead Press': 'MEDIUM',
    'Barbell Row': 'MEDIUM',
    'Leg Press': 'MEDIUM',
    'Incline DB Press': 'MEDIUM',
    'Lateral Raise': 'LOW',
    'Leg Extension': 'LOW',
    'Leg Curl': 'LOW',
    'Tricep Pushdown': 'LOW',
    'Barbell Curl': 'LOW',
    'Calf Raise': 'LOW',
    'default': 'MEDIUM'
};

// --- VOLUME LANDMARKS by MUSCLE (Blueprint Step 000,102) ---
export const VOLUME_LANDMARKS = {
    Quads: { MEV: 10, MRV: 18 },
    Hamstrings: { MEV: 6, MRV: 12 },
    Chest: { MEV: 12, MRV: 20 },
    Back: { MEV: 10, MRV: 18 },
    Shoulders: { MEV: 8, MRV: 16 },
    Biceps: { MEV: 6, MRV: 14 },
    Triceps: { MEV: 6, MRV: 14 },
    Glutes: { MEV: 4, MRV: 12 },
    Calves: { MEV: 6, MRV: 16 }
};

// --- WORKOUT PROGRAMS ---
export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
    {
        id: 'leg_hyper',
        name: 'Leg Hypertrophy',
        level: 'Hard',
        duration: '75m',
        focus: 'Quads & Glutes',
        description: 'High volume leg destruction. Focus on controlling the eccentric.',
        cover: 'https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?w=600&q=80',
        exercises: [
            { id: 'sq_bb', name: 'Barbell Squat', sets: 4, reps: '6-8', type: 'COMPOUND', muscleGroup: 'Quads', fatigueCost: 'HIGH', cnsDemand: 'HIGH', restSeconds: 180 },
            { id: 'lp_mach', name: 'Leg Press', sets: 3, reps: '10-12', type: 'COMPOUND', muscleGroup: 'Quads', fatigueCost: 'MEDIUM', cnsDemand: 'MEDIUM', restSeconds: 120 },
            { id: 'rdl_bb', name: 'Romanian Deadlift', sets: 3, reps: '8-10', type: 'COMPOUND', muscleGroup: 'Hamstrings', fatigueCost: 'HIGH', cnsDemand: 'MEDIUM', restSeconds: 150 },
            { id: 'le_mach', name: 'Leg Extension', sets: 3, reps: '15-20', type: 'ISOLATION', muscleGroup: 'Quads', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 },
            { id: 'lc_mach', name: 'Leg Curl', sets: 3, reps: '12-15', type: 'ISOLATION', muscleGroup: 'Hamstrings', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 },
            { id: 'cr_std', name: 'Calf Raise', sets: 4, reps: '15-20', type: 'ISOLATION', muscleGroup: 'Calves', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 }
        ]
    },
    {
        id: 'push_strength',
        name: 'Push Strength',
        level: 'Expert',
        duration: '60m',
        focus: 'Chest & Shoulders',
        description: 'Heavy loads to build raw pushing power.',
        cover: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
        exercises: [
            { id: 'bp_bb', name: 'Bench Press', sets: 5, reps: '3-5', type: 'COMPOUND', muscleGroup: 'Chest', fatigueCost: 'HIGH', cnsDemand: 'HIGH', restSeconds: 180 },
            { id: 'ohp_bb', name: 'Overhead Press', sets: 4, reps: '4-6', type: 'COMPOUND', muscleGroup: 'Shoulders', fatigueCost: 'MEDIUM', cnsDemand: 'HIGH', restSeconds: 150 },
            { id: 'inc_db', name: 'Incline DB Press', sets: 3, reps: '8-10', type: 'COMPOUND', muscleGroup: 'Chest', fatigueCost: 'MEDIUM', cnsDemand: 'MEDIUM', restSeconds: 120 },
            { id: 'lat_raise', name: 'Lateral Raise', sets: 4, reps: '12-15', type: 'ISOLATION', muscleGroup: 'Shoulders', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 },
            { id: 'tri_pd', name: 'Tricep Pushdown', sets: 3, reps: '12-15', type: 'ISOLATION', muscleGroup: 'Triceps', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 }
        ]
    },
    {
        id: 'pull_vol',
        name: 'Pull Volume',
        level: 'Medium',
        duration: '55m',
        focus: 'Back & Biceps',
        description: 'V-Taper building blocks.',
        cover: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=600&q=80',
        exercises: [
            { id: 'dl_bb', name: 'Deadlift', sets: 3, reps: '5', type: 'COMPOUND', muscleGroup: 'Back', fatigueCost: 'HIGH', cnsDemand: 'HIGH', restSeconds: 180 },
            { id: 'pull_up', name: 'Pull Ups', sets: 3, reps: 'AMRAP', type: 'COMPOUND', muscleGroup: 'Back', fatigueCost: 'MEDIUM', cnsDemand: 'MEDIUM', restSeconds: 120 },
            { id: 'row_bb', name: 'Barbell Row', sets: 4, reps: '8-10', type: 'COMPOUND', muscleGroup: 'Back', fatigueCost: 'MEDIUM', cnsDemand: 'MEDIUM', restSeconds: 120 },
            { id: 'lat_pd', name: 'Lat Pulldown', sets: 3, reps: '10-12', type: 'COMPOUND', muscleGroup: 'Back', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 90 },
            { id: 'bc_bb', name: 'Barbell Curl', sets: 3, reps: '10-12', type: 'ISOLATION', muscleGroup: 'Biceps', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 }
        ]
    },
    {
        id: 'upper_lower_a',
        name: 'Upper Body A',
        level: 'Medium',
        duration: '50m',
        focus: 'Push Focus',
        description: 'First upper day of Upper/Lower split.',
        cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
        exercises: [
            { id: 'bp_bb', name: 'Bench Press', sets: 4, reps: '5-7', type: 'COMPOUND', muscleGroup: 'Chest', fatigueCost: 'HIGH', cnsDemand: 'HIGH', restSeconds: 180 },
            { id: 'row_db', name: 'Dumbbell Row', sets: 4, reps: '8-10', type: 'COMPOUND', muscleGroup: 'Back', fatigueCost: 'MEDIUM', cnsDemand: 'MEDIUM', restSeconds: 90 },
            { id: 'ohp_db', name: 'Dumbbell OHP', sets: 3, reps: '8-10', type: 'COMPOUND', muscleGroup: 'Shoulders', fatigueCost: 'MEDIUM', cnsDemand: 'MEDIUM', restSeconds: 90 },
            { id: 'lat_pd', name: 'Lat Pulldown', sets: 3, reps: '10-12', type: 'COMPOUND', muscleGroup: 'Back', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 },
            { id: 'tri_oh', name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', type: 'ISOLATION', muscleGroup: 'Triceps', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 },
            { id: 'bc_db', name: 'Dumbbell Curl', sets: 3, reps: '12-15', type: 'ISOLATION', muscleGroup: 'Biceps', fatigueCost: 'LOW', cnsDemand: 'LOW', restSeconds: 60 }
        ]
    }
];

// --- RPE ADJUSTMENT LOGIC (Blueprint Step 200,003) ---
export function calculateRPEAdjustment(targetRPE: number, actualRPE: number, currentWeight: number): { newWeight: number, advice: string } {
    const diff = actualRPE - targetRPE;

    if (diff >= 1.5) {
        // Overshot significantly
        const reduction = Math.round(currentWeight * 0.10);
        return {
            newWeight: currentWeight - reduction,
            advice: `⚠️ RPE quá cao! Giảm ${reduction}kg để tránh kiệt sức.`
        };
    } else if (diff >= 0.5) {
        // Slightly overshot
        const reduction = Math.round(currentWeight * 0.05);
        return {
            newWeight: currentWeight - reduction,
            advice: `💡 RPE hơi cao. Giảm ${reduction}kg cho set tiếp theo.`
        };
    } else if (diff <= -1.5) {
        // Under-performed significantly
        const increase = Math.round(currentWeight * 0.05);
        return {
            newWeight: currentWeight + increase,
            advice: `💪 Bạn còn sức! Tăng ${increase}kg để đạt hiệu quả tối đa.`
        };
    }

    return { newWeight: currentWeight, advice: '✅ RPE đúng mục tiêu. Giữ nguyên tải.' };
}

// --- E1RM CALCULATOR (Blueprint Step 200,001) ---
export function calculateE1RM(weight: number, reps: number): number {
    if (reps === 1) return weight;
    // Epley Formula
    return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// --- WARM-UP SET GENERATOR (Blueprint Step 100,102) ---
export function generateWarmupSets(targetWeight: number): { weight: number, reps: number }[] {
    if (targetWeight <= 40) {
        return [
            { weight: 20, reps: 10 }, // Bar
            { weight: Math.round(targetWeight * 0.7), reps: 5 }
        ];
    }

    return [
        { weight: 20, reps: 10 },  // Bar
        { weight: Math.round(targetWeight * 0.4), reps: 5 },
        { weight: Math.round(targetWeight * 0.6), reps: 3 },
        { weight: Math.round(targetWeight * 0.8), reps: 1 },
        { weight: Math.round(targetWeight * 0.9), reps: 1 }  // Potentiation Rep
    ];
}

// --- PLATEAU BREAKER SUGGESTIONS (Blueprint Step 600,002) ---
export const PLATEAU_ALTERNATIVES: Record<string, string[]> = {
    'Bench Press': ['Weighted Dip', 'Close-Grip Bench', 'Floor Press', 'Paused Bench'],
    'Squat': ['Front Squat', 'Box Squat', 'Pause Squat', 'Bulgarian Split Squat'],
    'Deadlift': ['Deficit Deadlift', 'Block Pull', 'Sumo Deadlift', 'Romanian Deadlift'],
    'Overhead Press': ['Push Press', 'Z Press', 'Landmine Press', 'Behind Neck Press'],
    'Barbell Row': ['Meadows Row', 'Pendlay Row', 'Chest Supported Row', 'Seal Row']
};

// --- ERROR HANDLING RULES (Blueprint Step 900,001) ---
export const WEIGHT_LIMITS: Record<string, { min: number, max: number }> = {
    'Bench Press': { min: 20, max: 300 },
    'Squat': { min: 20, max: 400 },
    'Deadlift': { min: 40, max: 500 },
    'Overhead Press': { min: 15, max: 180 },
    'Barbell Curl': { min: 10, max: 80 },
    'default': { min: 5, max: 200 }
};

export function validateWeightInput(exercise: string, weight: number): { valid: boolean, message: string } {
    const limits = WEIGHT_LIMITS[exercise] || WEIGHT_LIMITS['default'];

    if (weight < limits.min) {
        return { valid: false, message: `Tải quá nhẹ. Tối thiểu ${limits.min}kg cho ${exercise}.` };
    }

    if (weight > limits.max) {
        return { valid: false, message: `🦸 Bạn là Hulk à? Xác nhận lại ${weight}kg cho ${exercise}.` };
    }

    return { valid: true, message: '' };
}
