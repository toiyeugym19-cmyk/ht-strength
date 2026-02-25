import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Capacitor } from '@capacitor/core';
import { CapacitorHealthkit } from '@perfood/capacitor-healthkit';

// ============================================================
//  Types
// ============================================================
export interface DailyHealth {
    steps: number;
    sleepHours: number;
    waterMl: number;
    heartRateAvg: number; // bpm
    weight: number; // kg
    bodyFat: number; // %
    caloriesBurned: number;
    bloodPressureSystolic: number; // mmHg
    bloodPressureDiastolic: number; // mmHg
    oxygenSaturation: number; // %
    restingHeartRate: number; // bpm
    activeMinutes: number; // phút
}

interface HealthState {
    dailyStats: Record<string, DailyHealth>;
    isSyncing: boolean;
    lastSyncTime: string | null;
    connectedSource: 'apple' | 'google' | 'manual' | null;
    googleAccessToken: string | null;

    // Actions
    updateStat: (date: string, data: Partial<DailyHealth>) => void;
    syncWithDevice: () => Promise<void>;
    setConnectedSource: (source: 'apple' | 'google' | 'manual' | null) => void;
    setGoogleAccessToken: (token: string | null) => void;
}

const EMPTY_DAY: DailyHealth = {
    steps: 0, sleepHours: 0, waterMl: 0,
    heartRateAvg: 0, weight: 0, bodyFat: 0, caloriesBurned: 0,
    bloodPressureSystolic: 0, bloodPressureDiastolic: 0,
    oxygenSaturation: 0, restingHeartRate: 0, activeMinutes: 0
};

// ============================================================
//  HealthKit helpers (only imported on iOS)
// ============================================================
async function syncFromHealthKit(): Promise<Partial<DailyHealth>> {
    // Plugin matches iOS native definitions

    // Request ALL available valid health data types according to plugin definitions
    const healthTypes = [
        'stepCount',
        'sleepAnalysis',
        'heartRate',
        'restingHeartRate',
        'activeEnergyBurned',
        'basalEnergyBurned',
        'weight',
        'bodyFat',
        'bloodPressureSystolic',
        'bloodPressureDiastolic',
        'oxygenSaturation',
        'respiratoryRate',
        'distanceWalkingRunning',
        'distanceCycling',
        'appleExerciseTime',
        'workoutType'
    ];
    await CapacitorHealthkit.requestAuthorization({
        all: healthTypes,
        read: healthTypes,
        write: ['workoutType', 'activeEnergyBurned', 'distanceWalkingRunning', 'weight', 'bodyFat']
    });

    const now = new Date();
    const startTime = startOfDay(now).toISOString();
    const endTime = endOfDay(now).toISOString();
    const result: Partial<DailyHealth> = {};

    // ------ Steps ------
    try {
        const stepsData = await CapacitorHealthkit.queryHKitSampleType({
            sampleName: 'stepCount',
            startDate: startTime,
            endDate: endTime,
            limit: 0
        });
        result.steps = Math.round(
            (stepsData.resultData as any[]).reduce((acc, s) => acc + (s.value || 0), 0)
        );
    } catch { result.steps = 0; }

    // ------ Heart Rate ------
    try {
        const heartData = await CapacitorHealthkit.queryHKitSampleType({
            sampleName: 'heartRate',
            startDate: startTime,
            endDate: endTime,
            limit: 0
        });
        const rates = (heartData.resultData as any[]).map(h => h.value || 0).filter(v => v > 0);
        result.heartRateAvg = rates.length > 0
            ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
            : 0;
    } catch { result.heartRateAvg = 0; }

    // ------ Active Energy (Calories) ------
    try {
        const calData = await CapacitorHealthkit.queryHKitSampleType({
            sampleName: 'activeEnergyBurned',
            startDate: startTime,
            endDate: endTime,
            limit: 0
        });
        result.caloriesBurned = Math.round(
            (calData.resultData as any[]).reduce((acc, s) => acc + (s.value || 0), 0)
        );
    } catch { result.caloriesBurned = 0; }

    // ------ Sleep ------
    try {
        const sleepData = await CapacitorHealthkit.queryHKitSampleType({
            sampleName: 'sleepAnalysis',
            startDate: new Date(now.getTime() - 86400000).toISOString(), // last 24h
            endDate: endTime,
            limit: 0
        });
        const totalMinutes = (sleepData.resultData as any[]).reduce((acc, s) => {
            const start = new Date(s.startDate).getTime();
            const end = new Date(s.endDate).getTime();
            return acc + (end - start) / 60000;
        }, 0);
        result.sleepHours = Number((totalMinutes / 60).toFixed(1));
    } catch { result.sleepHours = 0; }

    // ------ Body Mass (Weight) ------
    try {
        const weightData = await CapacitorHealthkit.queryHKitSampleType({
            sampleName: 'weight',
            startDate: new Date(now.getTime() - 7 * 86400000).toISOString(), // last 7 days
            endDate: endTime,
            limit: 1
        });
        const latest = (weightData.resultData as any[])?.[0];
        result.weight = latest ? Number((latest.value || 0).toFixed(1)) : 0;
    } catch { result.weight = 0; }

    // ------ Body Fat % ------
    try {
        const fatData = await CapacitorHealthkit.queryHKitSampleType({
            sampleName: 'bodyFat',
            startDate: new Date(now.getTime() - 30 * 86400000).toISOString(), // last 30 days
            endDate: endTime,
            limit: 1
        });
        const latest = (fatData.resultData as any[])?.[0];
        result.bodyFat = latest ? Number(((latest.value || 0) * 100).toFixed(1)) : 0;
    } catch { result.bodyFat = 0; }

    // ------ Water ------
    // Not directly supported by this HK plugin version, leaving random for now or 0
    result.waterMl = 0;

    return result;
}

// ============================================================
//  Google Fit helpers (web REST API)
// ============================================================
async function syncFromGoogleFit(accessToken: string): Promise<Partial<DailyHealth>> {
    const result: Partial<DailyHealth> = {};
    const now = new Date();
    const startTimeMillis = startOfDay(now).getTime();
    const endTimeMillis = endOfDay(now).getTime();

    // Steps
    try {
        const res = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aggregateBy: [{
                    dataTypeName: 'com.google.step_count.delta',
                    dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
                }],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis,
                endTimeMillis
            })
        });
        const data = await res.json();
        result.steps = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
    } catch { result.steps = 0; }

    // Heart rate
    try {
        const res = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis,
                endTimeMillis
            })
        });
        const data = await res.json();
        const point = data.bucket?.[0]?.dataset?.[0]?.point?.[0];
        result.heartRateAvg = point ? Math.round(point.value?.[0]?.fpVal || 0) : 0;
    } catch { result.heartRateAvg = 0; }

    // Calories burned
    try {
        const res = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aggregateBy: [{ dataTypeName: 'com.google.calories.expended' }],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis,
                endTimeMillis
            })
        });
        const data = await res.json();
        result.caloriesBurned = Math.round(
            data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0
        );
    } catch { result.caloriesBurned = 0; }

    // Weight
    try {
        const res = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aggregateBy: [{ dataTypeName: 'com.google.weight' }],
                bucketByTime: { durationMillis: 86400000 * 7 },
                startTimeMillis: startTimeMillis - 86400000 * 7,
                endTimeMillis
            })
        });
        const data = await res.json();
        const buckets = data.bucket || [];
        for (let i = buckets.length - 1; i >= 0; i--) {
            const pt = buckets[i]?.dataset?.[0]?.point;
            if (pt?.length) {
                result.weight = Number((pt[pt.length - 1].value?.[0]?.fpVal || 0).toFixed(1));
                break;
            }
        }
    } catch { result.weight = 0; }

    return result;
}

// ============================================================
//  Simulation fallback (for web dev / demo)
// ============================================================
function generateSimulatedData(): DailyHealth {
    return {
        steps: Math.floor(Math.random() * (12000 - 4000) + 4000),
        sleepHours: Number((Math.random() * (9 - 5) + 5).toFixed(1)),
        waterMl: Math.floor(Math.random() * (3000 - 1500) + 1500),
        heartRateAvg: Math.floor(Math.random() * (85 - 60) + 60),
        weight: Number((Math.random() * (85 - 65) + 65).toFixed(1)),
        bodyFat: Number((Math.random() * (25 - 10) + 10).toFixed(1)),
        caloriesBurned: Math.floor(Math.random() * (800 - 200) + 200),
        bloodPressureSystolic: Math.floor(Math.random() * (130 - 110) + 110),
        bloodPressureDiastolic: Math.floor(Math.random() * (85 - 70) + 70),
        oxygenSaturation: Number((Math.random() * (100 - 95) + 95).toFixed(1)),
        restingHeartRate: Math.floor(Math.random() * (75 - 55) + 55),
        activeMinutes: Math.floor(Math.random() * (90 - 15) + 15)
    };
}

// ============================================================
//  Store
// ============================================================
export const useHealthStore = create<HealthState>()(
    persist(
        (set, get) => ({
            dailyStats: {},
            isSyncing: false,
            lastSyncTime: null,
            connectedSource: null,
            googleAccessToken: null,

            updateStat: (date, data) => set((state) => {
                const current = state.dailyStats[date] || { ...EMPTY_DAY };
                return {
                    dailyStats: {
                        ...state.dailyStats,
                        [date]: { ...current, ...data }
                    }
                };
            }),

            setConnectedSource: (source) => set({ connectedSource: source }),
            setGoogleAccessToken: (token) => set({ googleAccessToken: token }),

            syncWithDevice: async () => {
                const { connectedSource, googleAccessToken } = get();
                set({ isSyncing: true });

                const today = format(new Date(), 'yyyy-MM-dd');
                let healthData: Partial<DailyHealth> = {};

                try {
                    const isNative = Capacitor.isNativePlatform();
                    const platform = Capacitor.getPlatform();

                    // ---- iOS: Use HealthKit ----
                    if (isNative && platform === 'ios') {
                        healthData = await syncFromHealthKit();
                        set({ connectedSource: 'apple' });
                    }
                    // ---- Android native: Use Google Fit plugin ----
                    else if (isNative && platform === 'android') {
                        try {
                            const { GoogleFit } = await import('@perfood/capacitor-google-fit');
                            await GoogleFit.connectToGoogleFit();
                            const allowed = await GoogleFit.isAllowed();
                            if (allowed.allowed) {
                                // Google Fit plugin has limited API, use what's available
                                const history = await GoogleFit.getHistory({
                                    startTime: startOfDay(new Date()),
                                    endTime: endOfDay(new Date())
                                });
                                // Extract steps from history if available
                                console.log('Google Fit history:', history);
                            }
                            set({ connectedSource: 'google' });
                        } catch (e) {
                            console.warn('Google Fit native error:', e);
                        }
                    }
                    // ---- Web: Google Fit REST API ----
                    else if (connectedSource === 'google' && googleAccessToken) {
                        healthData = await syncFromGoogleFit(googleAccessToken);
                    }
                    // ---- Fallback: Simulation ----
                    else {
                        healthData = generateSimulatedData();
                    }
                } catch (err: any) {
                    console.error('Health sync error:', err);

                    const isNative = Capacitor.isNativePlatform();
                    if (isNative) {
                        alert("HealthKit Lỗi: " + (err?.message || JSON.stringify(err)));
                        // Stop syncing without dummy data if it's native and there's a real error
                        set({ isSyncing: false });
                        return;
                    } else {
                        // Web fallback
                        healthData = generateSimulatedData();
                    }
                }

                const current = get().dailyStats[today] || { ...EMPTY_DAY };
                set({
                    isSyncing: false,
                    lastSyncTime: new Date().toISOString(),
                    dailyStats: {
                        ...get().dailyStats,
                        [today]: { ...current, ...healthData }
                    }
                });
            }
        }),
        {
            name: 'health-storage-v1',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
