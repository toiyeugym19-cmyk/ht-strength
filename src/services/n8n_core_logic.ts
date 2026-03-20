/**
 * 🧠 GYM OS CORE LOGIC (Ported from n8n Workflows)
 * This file contains the pure training algorithms defined in the N8N Blueprints.
 */

// --- CORE_01: LOG SET LOGIC ---
export const calculateE1RM = (weight: number, reps: number) => {
    // Epley Formula
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
};

export const analyzeSetPerformance = (
    currentWeight: number,
    currentReps: number,
    currentRPE: number,
    lastSessionE1RM: number
) => {
    const e1rm = calculateE1RM(currentWeight, currentReps);
    const delta = e1rm - lastSessionE1RM;

    // RPE Auto-Regulation
    let advice = "";
    let nextWeight = currentWeight;
    const TARGET_RPE = 8;

    if (currentRPE < TARGET_RPE - 1) { // RPE < 7
        nextWeight += 2.5;
        advice = "Too Easy? +2.5kg for next set.";
    } else if (currentRPE > TARGET_RPE + 1) { // RPE > 9
        nextWeight -= 2.5;
        advice = "Grinding? -2.5kg to maintain quality.";
    } else {
        advice = "Perfect intensity. Keep it up.";
    }

    return {
        e1rm,
        delta,
        isPR: delta > 0 && lastSessionE1RM > 0,
        advice,
        nextWeight
    };
};

// --- CORE_02: WARMUP GENERATOR ---
export const generateWarmupSets = (targetWeight: number) => {
    if (targetWeight < 20) return [{ weight: 0, reps: 10, type: 'Dynamic' }];

    const sets = [
        { weight: 20, reps: 10, type: 'Empty Bar' } // Always start with bar
    ];

    if (targetWeight > 40) {
        // 40%
        sets.push({ weight: Math.round(targetWeight * 0.4 / 2.5) * 2.5, reps: 5, type: 'Tempo' });
    }
    if (targetWeight > 60) {
        // 60%
        sets.push({ weight: Math.round(targetWeight * 0.6 / 2.5) * 2.5, reps: 3, type: 'Power' });
    }
    if (targetWeight > 80) {
        // 80% (Primer)
        sets.push({ weight: Math.round(targetWeight * 0.8 / 2.5) * 2.5, reps: 1, type: 'Primer' });
    }

    return sets;
};

// --- CORE_03: PLATE MATH SOLVER ---
export const solvePlateMath = (targetWeight: number) => {
    const bar = 20;
    if (targetWeight <= bar) return [];

    let remainingPerSide = (targetWeight - bar) / 2;
    const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const result: number[] = [];

    for (const p of plates) {
        while (remainingPerSide >= p) {
            result.push(p);
            remainingPerSide -= p;
        }
    }
    return result;
};

// --- CORE_04: REST TIMER OPTIMIZER ---
export const getOptimalRestTime = (exerciseType: 'COMPOUND' | 'ISOLATION', rpe: number) => {
    if (exerciseType === 'COMPOUND') {
        return rpe > 9 ? 240 : 180;
    }
    return 60; // Isolation
};
