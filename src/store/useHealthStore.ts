import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Capacitor } from '@capacitor/core';
import { CapacitorHealthkit } from '@perfood/capacitor-healthkit';
import { GoogleFit } from '@perfood/capacitor-google-fit';

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
    syncLog: string[]; // diagnostic log

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
//  HealthKit sync (iOS only)
//  Uses dynamic import so Vite won't tree-shake on web
// ============================================================
async function syncFromHealthKit(log: (msg: string) => void): Promise<Partial<DailyHealth>> {
    log('🏥 Bắt đầu sync HealthKit...');

    // Static import to avoid plugin_not_implemented errors in Vite prod builds
    // (We import at the top of the file)

    // ---- Step 1: Request Authorization ----
    // The Swift plugin's getTypes() uses alias names (steps, calories, etc.)
    // while getSampleType() uses original HK names (stepCount, activeEnergyBurned)
    const authTypes = [
        'steps',          // → HKQuantityTypeIdentifier.stepCount
        'activity',       // → sleepAnalysis + workoutType
        'duration',       // → appleExerciseTime
        'calories',       // → activeEnergyBurned + basalEnergyBurned
        'distance',       // → distanceWalkingRunning + distanceCycling
        'weight',         // → bodyMass
        'heartRate',      // → heartRate
        'restingHeartRate', // → restingHeartRate
        'bodyFat',        // → bodyFatPercentage
        'oxygenSaturation', // → oxygenSaturation
        'bloodPressureSystolic',  // → bloodPressureSystolic
        'bloodPressureDiastolic', // → bloodPressureDiastolic
    ];

    try {
        await CapacitorHealthkit.requestAuthorization({
            all: [], // Không dùng 'all' vì nó sẽ xin quyền GHI (Write) cho tất cả mọi thứ gây lỗi
            read: authTypes,
            write: [] // Tạm thời không xin quyền ghi để tránh crash, chỉ tập trung đọc data
        });
        log('✅ Authorization granted (or previously granted)');
    } catch (authErr: any) {
        log('❌ Authorization FAILED: ' + (authErr?.message || JSON.stringify(authErr)));
        throw new Error('HealthKit Authorization thất bại: ' + (authErr?.message || 'Không rõ lỗi'));
    }

    // ---- Step 2: Query data ----
    const now = new Date();
    const startTime = startOfDay(now).toISOString();
    const endTime = endOfDay(now).toISOString();
    const result: Partial<DailyHealth> = {};

    // Helper to safely query a single sample type
    async function queryType(
        sampleName: string,
        opts?: { startDate?: string; limit?: number }
    ): Promise<any[]> {
        try {
            const res = await CapacitorHealthkit.queryHKitSampleType({
                sampleName,
                startDate: opts?.startDate || startTime,
                endDate: endTime,
                limit: opts?.limit ?? 0
            });
            const data = (res?.resultData as any[]) || [];
            log(`  📊 ${sampleName}: ${data.length} records`);
            return data;
        } catch (err: any) {
            log(`  ⚠️ ${sampleName}: FAILED - ${err?.message || JSON.stringify(err)}`);
            return [];
        }
    }

    // ------ Steps ------
    const stepsData = await queryType('stepCount');
    result.steps = Math.round(stepsData.reduce((acc, s) => acc + (s.value || 0), 0));

    // ------ Heart Rate (average of today's readings) ------
    const heartData = await queryType('heartRate');
    const heartRates = heartData.map(h => h.value || 0).filter(v => v > 0);
    result.heartRateAvg = heartRates.length > 0
        ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
        : 0;

    // ------ Resting Heart Rate ------
    const restingHR = await queryType('restingHeartRate');
    const latestRestingHR = restingHR.length > 0 ? restingHR[restingHR.length - 1] : null;
    result.restingHeartRate = latestRestingHR ? Math.round(latestRestingHR.value || 0) : 0;

    // ------ Active Energy (Calories) ------
    const calData = await queryType('activeEnergyBurned');
    result.caloriesBurned = Math.round(calData.reduce((acc, s) => acc + (s.value || 0), 0));

    // ------ Apple Exercise Time (Active Minutes) ------
    const exerciseData = await queryType('appleExerciseTime');
    result.activeMinutes = Math.round(exerciseData.reduce((acc, s) => acc + (s.value || 0), 0));

    // ------ Sleep (last 24h) ------
    const sleepData = await queryType('sleepAnalysis', {
        startDate: new Date(now.getTime() - 86400000).toISOString()
    });
    const totalSleepMinutes = sleepData.reduce((acc, s) => {
        const start = new Date(s.startDate).getTime();
        const end = new Date(s.endDate).getTime();
        return acc + (end - start) / 60000;
    }, 0);
    result.sleepHours = Number((totalSleepMinutes / 60).toFixed(1));

    // ------ Body Mass / Weight (last 7 days, latest) ------
    const weightData = await queryType('weight', {
        startDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
        limit: 1
    });
    const latestWeight = weightData.length > 0 ? weightData[0] : null;
    result.weight = latestWeight ? Number((latestWeight.value || 0).toFixed(1)) : 0;

    // ------ Body Fat % (last 30 days, latest) ------
    const fatData = await queryType('bodyFat', {
        startDate: new Date(now.getTime() - 30 * 86400000).toISOString(),
        limit: 1
    });
    const latestFat = fatData.length > 0 ? fatData[0] : null;
    // HealthKit stores body fat as decimal (0.20 = 20%), multiply by 100
    result.bodyFat = latestFat ? Number(((latestFat.value || 0) * 100).toFixed(1)) : 0;

    // ------ Blood Pressure ------
    const bpSys = await queryType('bloodPressureSystolic', {
        startDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
        limit: 1
    });
    result.bloodPressureSystolic = bpSys.length > 0 ? Math.round(bpSys[0].value || 0) : 0;

    const bpDia = await queryType('bloodPressureDiastolic', {
        startDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
        limit: 1
    });
    result.bloodPressureDiastolic = bpDia.length > 0 ? Math.round(bpDia[0].value || 0) : 0;

    // ------ Oxygen Saturation ------
    const o2Data = await queryType('oxygenSaturation', {
        startDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
        limit: 1
    });
    // HealthKit stores SpO2 as decimal (0.98 = 98%)
    const latestO2 = o2Data.length > 0 ? o2Data[0] : null;
    result.oxygenSaturation = latestO2 ? Number(((latestO2.value || 0) * 100).toFixed(0)) : 0;

    // ------ Water (not supported by this plugin version) ------
    result.waterMl = 0;

    log('🏁 Hoàn thành sync HealthKit!');
    log(`📈 Kết quả: Steps=${result.steps}, HR=${result.heartRateAvg}, Cal=${result.caloriesBurned}, Sleep=${result.sleepHours}h, Weight=${result.weight}kg`);

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
            syncLog: [],

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
                const logs: string[] = [];
                const log = (msg: string) => {
                    console.log('[HealthSync]', msg);
                    logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
                };

                set({ isSyncing: true, syncLog: [] });

                const today = format(new Date(), 'yyyy-MM-dd');
                let healthData: Partial<DailyHealth> = {};

                try {
                    const isNative = Capacitor.isNativePlatform();
                    const platform = Capacitor.getPlatform();
                    log(`Platform: ${platform}, Native: ${isNative}`);

                    // ---- iOS: Use HealthKit ----
                    if (isNative && platform === 'ios') {
                        healthData = await syncFromHealthKit(log);
                        set({ connectedSource: 'apple' });
                    }
                    // ---- Android native: Use Google Fit plugin ----
                    else if (isNative && platform === 'android') {
                        log('Android detected — trying Google Fit plugin...');
                        try {
                            await GoogleFit.connectToGoogleFit();
                            const allowed = await GoogleFit.isAllowed();
                            if (allowed.allowed) {
                                const history = await GoogleFit.getHistory({
                                    startTime: startOfDay(new Date()),
                                    endTime: endOfDay(new Date())
                                });
                                log('Google Fit history: ' + JSON.stringify(history));
                            }
                            set({ connectedSource: 'google' });
                        } catch (e: any) {
                            log('⚠️ Google Fit error: ' + (e?.message || JSON.stringify(e)));
                        }
                    }
                    // ---- Web: Google Fit REST API ----
                    else if (connectedSource === 'google' && googleAccessToken) {
                        log('Web → Google Fit REST API');
                        healthData = await syncFromGoogleFit(googleAccessToken);
                    }
                    // ---- Fallback: No connection ----
                    else {
                        log('❌ Không có nguồn kết nối health data nào.');
                        if (!isNative) {
                            alert('Tính năng đồng bộ sức khỏe chỉ hoạt động trên thiết bị iPhone/iPad thực tế. Trên trình duyệt hãy kết nối Google Fit.');
                        }
                        set({ isSyncing: false, syncLog: logs });
                        return;
                    }
                } catch (err: any) {
                    const errMsg = err?.message || JSON.stringify(err);
                    log('💥 LỖI SYNC: ' + errMsg);
                    console.error('Health sync error:', err);

                    const isNative = Capacitor.isNativePlatform();
                    if (isNative) {
                        alert('HealthKit Lỗi: ' + errMsg);
                    } else {
                        alert('Health Sync Error: ' + errMsg);
                    }
                    set({ isSyncing: false, syncLog: logs });
                    return;
                }

                const current = get().dailyStats[today] || { ...EMPTY_DAY };
                log('✅ Cập nhật store thành công!');
                set({
                    isSyncing: false,
                    lastSyncTime: new Date().toISOString(),
                    syncLog: logs,
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
