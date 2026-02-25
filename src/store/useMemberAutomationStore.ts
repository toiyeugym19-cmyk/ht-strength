import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- KIỂU DỮ LIỆU CHO MEMBER AUTOMATION ---

export type MemberTriggerType =
    | 'expiry_date'       // Dựa trên ngày hết hạn
    | 'check_in_pattern'  // Dựa trên lịch sử check-in
    | 'health_milestone'  // Dựa trên tiến trình sức khỏe
    | 'birthday'          // Sinh nhật
    | 'streak'            // Chuỗi tập
    | 'registration'      // Đăng ký mới
    | 'time_based'        // Theo thời gian
    | 'system_event'      // Sự kiện hệ thống
    | 'manual';           // Thủ công

export type MemberActionType =
    | 'sms_notification'
    | 'push_notification'
    | 'zalo_message'
    | 'email_campaign'
    | 'call_reminder'
    | 'create_task'
    | 'internal_alert'
    | 'discount_offer'
    | 'vip_upgrade'
    | 'recommend_class'
    | 'report_generate'
    | 'webhook';

export interface MemberAutomationPlan {
    id: string;
    name: string;
    nameVi: string;
    description: string;
    triggerType: MemberTriggerType;
    triggerCondition: string;
    actionType: MemberActionType;
    actionPayload: any;
    enabled: boolean;
    lastTriggered?: string;
    triggerCount: number;
    category: 'retention' | 'acquisition' | 'engagement' | 'payment' | 'analytics' | 'operations' | 'marketing' | 'loyalty' | 'compliance' | 'ai' | 'health_plus';
    priority: 'low' | 'medium' | 'high' | 'critical';
    n8nWorkflowId?: string;
}

export interface MemberAutomationLog {
    id: string;
    planId: string;
    planName: string;
    memberId?: string;
    memberName?: string;
    timestamp: string;
    message: string;
    type: 'success' | 'warning' | 'info' | 'critical' | 'n8n_trigger';
    n8nExecutionId?: string;
}

export interface MemberAutomationTask {
    id: string;
    memberId: string;
    memberName: string;
    type: 'call' | 'follow_up' | 'renewal' | 'feedback' | 'other';
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    createdBy: string;
    automationPlanId?: string;
}

export interface TodayStats {
    expiringToday: number;
    expiringThisWeek: number;
    expiringThisMonth: number;
    newSignups: number;
    atRiskMembers: number;
    callsToMake: number;
    birthdaysToday: number;
    inactiveMembers: number;
    vipMembers: number;
    n8nExecutions?: number;
    pendingPayments?: number;
    tasksCompleted?: number;
    renewalsProcessed?: number;
}

interface MemberAutomationState {
    plans: MemberAutomationPlan[];
    logs: MemberAutomationLog[];
    tasks: MemberAutomationTask[];
    todayStats: TodayStats;
    isEngineRunning: boolean;
    lastEngineRun: string | null;
    n8nStatus: 'connected' | 'disconnected' | 'error';

    // Actions
    togglePlan: (planId: string) => void;
    addLog: (log: Omit<MemberAutomationLog, 'id'>) => void;
    addTask: (task: Omit<MemberAutomationTask, 'id'>) => void;
    updateTaskStatus: (taskId: string, status: MemberAutomationTask['status']) => void;
    completeTask: (taskId: string) => void;
    setEngineStatus: (running: boolean) => void;
    updateLastRun: () => void;
    updateTodayStats: (stats: Partial<TodayStats>) => void;
    setN8nStatus: (status: 'connected' | 'disconnected' | 'error') => void;
    clearLogs: () => void;
}

// --- CÁC KẾ HOẠCH MẶC ĐỊNH ---
const DEFAULT_PLANS: MemberAutomationPlan[] = [
    // RETENTION
    {
        id: 'retention_001',
        name: '7 Days Before Expiry',
        nameVi: '7 Ngày Trước Hết Hạn',
        description: 'Nhắc hội viên gia hạn trước 7 ngày',
        triggerType: 'expiry_date',
        triggerCondition: 'daysUntilExpiry === 7',
        actionType: 'sms_notification',
        actionPayload: { template: 'renewal_reminder_7d' },
        enabled: true,
        triggerCount: 0,
        category: 'retention',
        priority: 'medium',
        n8nWorkflowId: 'renewal-7d'
    },
    {
        id: 'retention_002',
        name: '3 Days Before Expiry',
        nameVi: '3 Ngày Trước Hết Hạn',
        description: 'Nhắc hội viên gia hạn trước 3 ngày',
        triggerType: 'expiry_date',
        triggerCondition: 'daysUntilExpiry === 3',
        actionType: 'push_notification',
        actionPayload: { template: 'renewal_reminder_3d' },
        enabled: true,
        triggerCount: 0,
        category: 'retention',
        priority: 'high',
        n8nWorkflowId: 'renewal-3d'
    },
    {
        id: 'retention_003',
        name: 'Expiry Day',
        nameVi: 'Ngày Hết Hạn',
        description: 'Nhắc hội viên gia hạn vào ngày hết hạn',
        triggerType: 'expiry_date',
        triggerCondition: 'daysUntilExpiry === 0',
        actionType: 'call_reminder',
        actionPayload: { template: 'renewal_expiry_day' },
        enabled: true,
        triggerCount: 0,
        category: 'retention',
        priority: 'critical',
        n8nWorkflowId: 'renewal-expiry'
    },
    // More plans would go here...
];

// --- STORE CHÍNH ---
export const useMemberAutomationStore = create<MemberAutomationState>()(
    persist(
        (set) => ({
            plans: DEFAULT_PLANS,
            logs: [],
            tasks: [],
            todayStats: {
                expiringToday: 0,
                expiringThisWeek: 0,
                expiringThisMonth: 0,
                newSignups: 0,
                atRiskMembers: 0,
                callsToMake: 0,
                birthdaysToday: 0,
                inactiveMembers: 0,
                vipMembers: 0,
                n8nExecutions: 0,
                pendingPayments: 0,
                tasksCompleted: 0,
                renewalsProcessed: 0
            },
            isEngineRunning: false,
            lastEngineRun: null,
            n8nStatus: 'disconnected',

            togglePlan: (planId) => set((state) => ({
                plans: state.plans.map(p =>
                    p.id === planId ? { ...p, enabled: !p.enabled } : p
                )
            })),

            addLog: (log) => set((state) => ({
                logs: [
                    { ...log, id: crypto.randomUUID() },
                    ...state.logs.slice(0, 199) // Keep last 200 logs
                ]
            })),

            addTask: (task) => set((state) => ({
                tasks: [
                    { ...task, id: crypto.randomUUID() },
                    ...state.tasks
                ]
            })),

            updateTaskStatus: (taskId, status) => set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? { ...t, status } : t
                )
            })),

            completeTask: (taskId) => set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? { ...t, status: 'completed' as const } : t
                ),
                todayStats: {
                    ...state.todayStats,
                    tasksCompleted: (state.todayStats.tasksCompleted || 0) + 1
                }
            })),

            setEngineStatus: (running) => set({ isEngineRunning: running }),

            updateLastRun: () => set({ lastEngineRun: new Date().toISOString() }),

            updateTodayStats: (stats) => set((state) => ({
                todayStats: { ...state.todayStats, ...stats }
            })),

            setN8nStatus: (status) => set({ n8nStatus: status }),

            clearLogs: () => set({ logs: [] })
        }),
        {
            name: 'member-automation-store-v1',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
