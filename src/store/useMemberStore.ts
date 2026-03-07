import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MEMBERS_20 } from '../data/mockGymData';

export interface Member {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    status: 'Active' | 'Expired' | 'Pending' | 'Banned';
    membershipType: string; // '1 Month', '3 Months', '6 Months', '1 Year', 'PT Sessions'
    startDate: string;
    expiryDate: string;
    joinDate: string;
    dateOfBirth?: string;

    // Session tracking for PT/Class packs
    sessionsTotal: number;
    sessionsUsed: number;

    checkInHistory: Array<{
        date: string;
        type: string; // 'Gym Access', 'PT Session', 'Class'
    }>;

    lastCheckIn: string | null;
    notes?: string;

    assignedPT?: string; // Tên PT phụ trách

    // Physical Stats (Optional tracking)
    height?: number;
    weight?: number;
    goals?: string[];

    // Admin-assigned plans (member follows)
    assignedWorkoutPlanId?: string; // e.g. 'fullbody_basic', 'push', 'pull', 'legs'
    assignedMealPlan?: {
        name: string;
        dailyCalories: number;
        protein: number;
        carbs: number;
        fat: number;
        meals: string[];
    };

    // Body metrics over time (before/during/after package)
    bodyMetrics?: Array<{
        date: string;
        weight?: number;
        waist?: number;
        hip?: number;
        chest?: number;
        arm?: number;
    }>;

    // Goal targets for the package (e.g. weight 68→65, hip +2cm)
    goalTargets?: {
        weightFrom?: number;
        weightTo?: number;
        waistFrom?: number;
        waistTo?: number;
        hipFrom?: number;
        hipTo?: number;
        note?: string;
    };

    // Simple workout log for member-side training
    workoutHistory?: Array<{
        id: string;
        date: string;
        planName: string;
        totalSets: number;
        durationMinutes: number;
    }>;
}

interface MemberState {
    members: Member[];

    // Actions
    addMember: (member: Omit<Member, 'id' | 'joinDate' | 'checkInHistory' | 'sessionsUsed'>) => void;
    updateMember: (id: string, updates: Partial<Member>) => void;
    deleteMember: (id: string) => void;
    performCheckIn: (id: string, type?: string) => void;
    performCheckOut: (id: string) => void; // Uncheck (double-click)
    refreshMemberStatus: () => void; // Auto check expiry

    setMemberWorkoutPlan: (memberId: string, planId: string | null) => void;
    setMemberMealPlan: (memberId: string, plan: Member['assignedMealPlan'] | null) => void;
    setMemberGoalTargets: (memberId: string, targets: Member['goalTargets'] | null) => void;
    addMemberBodyMetric: (memberId: string, metric: NonNullable<Member['bodyMetrics']>[number]) => void;
}

export const useMemberStore = create<MemberState>()(
    persist(
        (set) => ({
            members: MEMBERS_20,

            addMember: (memberData) => set((state) => ({
                members: [
                    {
                        ...memberData,
                        id: crypto.randomUUID(),
                        joinDate: new Date().toISOString(),
                        checkInHistory: [],
                        sessionsUsed: 0,
                        lastCheckIn: null
                    },
                    ...state.members
                ]
            })),

            updateMember: (id, updates) => set((state) => ({
                members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
            })),

            deleteMember: (id) => set((state) => ({
                members: state.members.filter(m => m.id !== id)
            })),

            performCheckIn: (id, type = 'Check-in') => set((state) => ({
                members: state.members.map(m => {
                    if (m.id !== id) return m;

                    const now = new Date().toISOString();
                    return {
                        ...m,
                        sessionsUsed: m.sessionsUsed + 1,
                        lastCheckIn: now,
                        checkInHistory: [
                            { date: now, type },
                            ...m.checkInHistory
                        ]
                    };
                })
            })),

            performCheckOut: (id) => set((state) => {
                const today = new Date().toDateString();
                return {
                    members: state.members.map(m => {
                        if (m.id !== id) return m;
                        if (!m.lastCheckIn || m.lastCheckIn === 'N/A') return m;

                        const lastDate = new Date(m.lastCheckIn);
                        if (lastDate.toDateString() !== today) return m;
                        if (m.sessionsUsed <= 0) return m;

                        const newHistory = m.checkInHistory.filter((_, i) => i !== 0);
                        const prevCheckIn = newHistory[0]?.date || null;
                        return {
                            ...m,
                            sessionsUsed: m.sessionsUsed - 1,
                            lastCheckIn: prevCheckIn,
                            checkInHistory: newHistory
                        };
                    })
                };
            }),

            refreshMemberStatus: () => set((state) => ({
                members: state.members.map(m => {
                    if (m.status === 'Banned') return m;
                    const exhausted = (m.sessionsTotal ?? 0) > 0 && (m.sessionsUsed ?? 0) >= (m.sessionsTotal ?? 0);
                    if (exhausted) return { ...m, status: 'Expired' as const };
                    return m;
                })
            })),

            setMemberWorkoutPlan: (memberId, planId) => set((state) => ({
                members: state.members.map(m =>
                    m.id === memberId ? { ...m, assignedWorkoutPlanId: planId ?? undefined } : m
                )
            })),

            setMemberMealPlan: (memberId, plan) => set((state) => ({
                members: state.members.map(m =>
                    m.id === memberId ? { ...m, assignedMealPlan: plan ?? undefined } : m
                )
            })),

            setMemberGoalTargets: (memberId, targets) => set((state) => ({
                members: state.members.map(m =>
                    m.id === memberId ? { ...m, goalTargets: targets ?? undefined } : m
                )
            })),

            addMemberBodyMetric: (memberId, metric) => set((state) => ({
                members: state.members.map(m => {
                    if (m.id !== memberId) return m;
                    const list = [...(m.bodyMetrics || [])];
                    const existing = list.findIndex(x => x.date === metric.date);
                    if (existing >= 0) list[existing] = { ...list[existing], ...metric };
                    else list.push(metric);
                    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    return { ...m, bodyMetrics: list };
                })
            }))
        }),
        {
            name: 'lifeos-member-store-v2',
        }
    )
);
