import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- KIỂU DỮ LIỆU ---
export type TriggerType =
    | 'time_based'      // Dựa trên giờ
    | 'health_metric'   // Dựa trên chỉ số sức khỏe
    | 'workout_event'   // Dựa trên sự kiện tập luyện
    | 'weather'         // Dựa trên thời tiết
    | 'streak'          // Dựa trên chuỗi tập
    | 'manual';         // Kích hoạt thủ công

export type ActionType =
    | 'notification'    // Hiển thị thông báo
    | 'suggestion'      // Đề xuất hành động
    | 'auto_schedule'   // Tự động lên lịch
    | 'reward'          // Tặng thưởng/huy hiệu
    | 'warning'         // Cảnh báo
    | 'mode_switch';    // Chuyển chế độ (VD: Dark mode)

export interface AutomationPlan {
    id: string;
    name: string;
    nameVi: string;
    description: string;
    triggerType: TriggerType;
    triggerCondition: string; // Điều kiện kích hoạt dạng text
    actionType: ActionType;
    actionPayload: any;
    enabled: boolean;
    lastTriggered?: string;
    triggerCount: number;
    category: 'energy' | 'training' | 'nutrition' | 'mindset' | 'system';
}

export interface AutomationLog {
    id: string;
    planId: string;
    planName: string;
    timestamp: string;
    message: string;
    type: 'success' | 'warning' | 'info';
}

export interface PendingSuggestion {
    id: string;
    planId: string;
    title: string;
    message: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
    actionLabel?: string;
    actionCallback?: string; // Store action name as string
    dismissable: boolean;
    expiresAt?: string;
}

interface AutomationState {
    plans: AutomationPlan[];
    logs: AutomationLog[];
    pendingSuggestions: PendingSuggestion[];
    isEngineRunning: boolean;
    lastEngineRun: string | null;

    // Actions
    togglePlan: (planId: string) => void;
    addLog: (log: Omit<AutomationLog, 'id'>) => void;
    addSuggestion: (suggestion: Omit<PendingSuggestion, 'id'>) => void;
    dismissSuggestion: (suggestionId: string) => void;
    clearExpiredSuggestions: () => void;
    setEngineStatus: (running: boolean) => void;
    updateLastRun: () => void;
}

// --- CÁC KẾ HOẠCH MẶC ĐỊNH (DEFAULT PLANS) ---
const DEFAULT_PLANS: AutomationPlan[] = [
    // NHÓM A: KÍCH HOẠT NĂNG LƯỢNG
    {
        id: 'energy_001',
        name: 'Morning Coffee',
        nameVi: 'Cà Phê Sáng',
        description: 'Gợi ý uống cà phê khi cơ thể đang lờ đờ vào buổi sáng',
        triggerType: 'time_based',
        triggerCondition: 'hour >= 6 && hour <= 8 && heartRate < 60',
        actionType: 'suggestion',
        actionPayload: {
            title: '☕ Thời Điểm Hoàn Hảo',
            message: 'Một ly cafe đen không đường lúc này sẽ giúp bạn tỉnh táo + đốt mỡ nhanh hơn 15%.',
            icon: 'coffee'
        },
        enabled: true,
        triggerCount: 0,
        category: 'energy'
    },
    {
        id: 'energy_002',
        name: 'Bad Weather Alert',
        nameVi: 'Thời Tiết Xấu',
        description: 'Tự động gợi ý bài tập tại nhà khi trời mưa',
        triggerType: 'weather',
        triggerCondition: 'rainProbability > 80',
        actionType: 'auto_schedule',
        actionPayload: {
            title: '🌧️ Trời Mưa Rồi',
            message: 'Chuyển sang HIIT tại nhà thay vì chạy bộ ngoài trời nhé!',
            suggestedPlan: 'HIIT tại nhà'
        },
        enabled: true,
        triggerCount: 0,
        category: 'energy'
    },
    {
        id: 'energy_003',
        name: 'Oversleep Warning',
        nameVi: 'Báo Thức Sinh Học',
        description: 'Cảnh báo khi ngủ quá nhiều gây mệt mỏi ngược',
        triggerType: 'health_metric',
        triggerCondition: 'sleepHours > 9',
        actionType: 'warning',
        actionPayload: {
            title: '😴 Ngủ Quá Nhiều!',
            message: 'Ngủ >9h sẽ gây Sleep Inertia (mệt mỏi ngược). Dậy và uống 500ml nước ngay!',
            severity: 'medium'
        },
        enabled: true,
        triggerCount: 0,
        category: 'energy'
    },

    // NHÓM B: CHIẾN THUẬT TẬP LUYỆN
    {
        id: 'training_001',
        name: 'Plateau Breaker',
        nameVi: 'Phá Vỡ Cao Nguyên',
        description: 'Đề xuất kỹ thuật mới khi không tăng được tạ',
        triggerType: 'workout_event',
        triggerCondition: 'consecutiveNoProgress >= 3',
        actionType: 'suggestion',
        actionPayload: {
            title: '📈 Phá Vỡ Giới Hạn',
            message: 'Bạn đang bị "mắc kẹt". Thử Drop Set hoặc Negative Reps cho buổi tiếp theo!',
            techniques: ['Drop Set', 'Negative Reps', 'Pause Reps']
        },
        enabled: true,
        triggerCount: 0,
        category: 'training'
    },
    {
        id: 'training_002',
        name: 'Overtraining Alert',
        nameVi: 'Cảnh Báo Tập Quá Sức',
        description: 'Cảnh báo khi tăng volume tập quá nhanh',
        triggerType: 'workout_event',
        triggerCondition: 'weeklyVolumeIncrease > 20',
        actionType: 'warning',
        actionPayload: {
            title: '⚠️ Cảnh Báo Chấn Thương',
            message: 'Volume tập tăng quá 20% so với tuần trước. Giảm 10% hoặc nghỉ thêm 1 ngày.',
            severity: 'high'
        },
        enabled: true,
        triggerCount: 0,
        category: 'training'
    },
    {
        id: 'training_003',
        name: 'Form Reminder',
        nameVi: 'Nhắc Nhở Form Tập',
        description: 'Nhắc giữ form đúng khi tập bài nặng',
        triggerType: 'workout_event',
        triggerCondition: 'exerciseName in ["Deadlift", "Squat", "Bench Press"]',
        actionType: 'notification',
        actionPayload: {
            title: '🎯 Giữ Form!',
            messages: {
                'Deadlift': 'Giữ lưng THẲNG! Đừng cong lưng nếu không muốn thoát vị đĩa đệm.',
                'Squat': 'Đầu gối song song với mũi chân. Đừng để gối vặn vào trong!',
                'Bench Press': 'Vai rút lại, ngực ưỡn. Đừng nảy tạ lên ngực!'
            }
        },
        enabled: true,
        triggerCount: 0,
        category: 'training'
    },
    {
        id: 'training_004',
        name: 'PR Celebration',
        nameVi: 'Khen Thưởng Kỷ Lục',
        description: 'Ăn mừng khi phá kỷ lục cá nhân',
        triggerType: 'workout_event',
        triggerCondition: 'newPersonalRecord === true',
        actionType: 'reward',
        actionPayload: {
            title: '🏆 KỶ LỤC MỚI!',
            message: 'Bạn vừa phá vỡ giới hạn bản thân. Một ngày lịch sử!',
            badge: 'gym_monster',
            confetti: true
        },
        enabled: true,
        triggerCount: 0,
        category: 'training'
    },
    {
        id: 'training_005',
        name: 'Rest Timer',
        nameVi: 'Đếm Ngược Nghỉ Hiệp',
        description: 'Nhắc khi đã nghỉ đủ giữa các hiệp',
        triggerType: 'health_metric',
        triggerCondition: 'heartRateZone === "recovery" && restTime > 90',
        actionType: 'notification',
        actionPayload: {
            title: '⏰ Hết Giờ Nghỉ!',
            message: 'Tim đã ổn định. Vào set tiếp theo ngay!',
            vibrate: true
        },
        enabled: true,
        triggerCount: 0,
        category: 'training'
    },

    // NHÓM C: DINH DƯỠNG & HỒI PHỤC
    {
        id: 'nutrition_001',
        name: 'Anabolic Window',
        nameVi: 'Cửa Sổ Đồng Hóa',
        description: 'Nhắc nạp protein sau khi tập xong 15 phút',
        triggerType: 'workout_event',
        triggerCondition: 'workoutEndedMinutesAgo === 15',
        actionType: 'notification',
        actionPayload: {
            title: '🍌 Nạp Năng Lượng Ngay!',
            message: 'Cửa sổ đồng hóa đang mở. 1 muỗng Whey + 1 quả chuối là hoàn hảo!',
            priority: 'high'
        },
        enabled: true,
        triggerCount: 0,
        category: 'nutrition'
    },
    {
        id: 'nutrition_002',
        name: 'Smart Hydration',
        nameVi: 'Nhắc Uống Nước Thông Minh',
        description: 'Tăng tần suất nhắc uống nước khi trời nóng',
        triggerType: 'weather',
        triggerCondition: 'temperature > 30 || humidity < 40',
        actionType: 'notification',
        actionPayload: {
            title: '💧 Uống Nước Ngay!',
            message: 'Thời tiết nóng/khô. Uống 250ml nước để duy trì hiệu suất.',
            intervalMinutes: 30
        },
        enabled: true,
        triggerCount: 0,
        category: 'nutrition'
    },
    {
        id: 'nutrition_003',
        name: 'Pre-Workout Meal',
        nameVi: 'Bữa Ăn Trước Tập',
        description: 'Gợi ý ăn nhẹ 2 tiếng trước giờ tập',
        triggerType: 'time_based',
        triggerCondition: 'hoursUntilScheduledWorkout === 2',
        actionType: 'suggestion',
        actionPayload: {
            title: '🍽️ Chuẩn Bị Năng Lượng',
            message: 'Còn 2 tiếng nữa là tập. Ăn nhẹ: Yến mạch + Sữa chua. Tránh đồ dầu mỡ!',
            foods: ['Yến mạch', 'Sữa chua Hy Lạp', 'Chuối', 'Bánh mì nguyên cám']
        },
        enabled: true,
        triggerCount: 0,
        category: 'nutrition'
    },
    {
        id: 'nutrition_004',
        name: 'Sleep Optimization',
        nameVi: 'Giấc Ngủ Vàng',
        description: 'Nhắc đi ngủ và giảm ánh sáng xanh',
        triggerType: 'time_based',
        triggerCondition: 'hour >= 22',
        actionType: 'mode_switch',
        actionPayload: {
            title: '🌙 Đến Giờ Nghỉ Ngơi',
            message: 'Cất điện thoại đi. Blue light đang giết chết Testosterone của bạn!',
            enableDarkMode: true,
            dimScreen: true
        },
        enabled: true,
        triggerCount: 0,
        category: 'nutrition'
    },

    // NHÓM D: TÂM LÝ CHIẾN & KỶ LUẬT
    {
        id: 'mindset_001',
        name: 'Discipline Check',
        nameVi: 'Kỷ Luật Thép',
        description: 'Khiêu khích khi có dấu hiệu bỏ tập',
        triggerType: 'streak',
        triggerCondition: 'daysWithoutWorkout >= 3',
        actionType: 'notification',
        actionPayload: {
            title: '🔥 Đừng Bỏ Cuộc!',
            message: 'Đối thủ của bạn đang tập luyện đấy. Còn bạn thì sao?',
            tone: 'provocative'
        },
        enabled: true,
        triggerCount: 0,
        category: 'mindset'
    },
    {
        id: 'mindset_002',
        name: 'Rest Day Meditation',
        nameVi: 'Thiền Định Ngày Nghỉ',
        description: 'Gợi ý thiền khi là ngày nghỉ',
        triggerType: 'time_based',
        triggerCondition: 'isRestDay === true && hour >= 7 && hour <= 9',
        actionType: 'suggestion',
        actionPayload: {
            title: '🧘 Ngày Hồi Phục',
            message: 'Hôm nay là ngày nghỉ. Thiền 10 phút để giảm Cortisol và tăng tốc hồi phục.',
            duration: 10
        },
        enabled: true,
        triggerCount: 0,
        category: 'mindset'
    },
    {
        id: 'mindset_003',
        name: 'Weekly Summary',
        nameVi: 'Tổng Kết Tuần',
        description: 'Báo cáo thành tích cuối tuần',
        triggerType: 'time_based',
        triggerCondition: 'dayOfWeek === 0 && hour === 20', // Sunday 8PM
        actionType: 'notification',
        actionPayload: {
            title: '📊 Tổng Kết Tuần',
            generateSummary: true
        },
        enabled: true,
        triggerCount: 0,
        category: 'mindset'
    },
    {
        id: 'mindset_004',
        name: 'Milestone Celebration',
        nameVi: 'Chia Sẻ Vinh Quang',
        description: 'Tạo ảnh chia sẻ khi đạt cột mốc lớn',
        triggerType: 'streak',
        triggerCondition: 'streak in [7, 30, 100, 365]',
        actionType: 'reward',
        actionPayload: {
            title: '🎉 Cột Mốc Lịch Sử!',
            generateShareableImage: true,
            milestoneMessages: {
                7: '1 tuần kiên trì! Khởi đầu tuyệt vời.',
                30: '1 tháng chiến binh! Thói quen đang hình thành.',
                100: '100 ngày huyền thoại! Bạn là 1% những người không bỏ cuộc.',
                365: '1 NĂM! Bạn không còn là người bình thường nữa.'
            }
        },
        enabled: true,
        triggerCount: 0,
        category: 'mindset'
    }
];

// --- STORE CHÍNH ---
export const useAutomationStore = create<AutomationState>()(
    persist(
        (set) => ({
            plans: DEFAULT_PLANS,
            logs: [],
            pendingSuggestions: [],
            isEngineRunning: false,
            lastEngineRun: null,

            togglePlan: (planId) => set((state) => ({
                plans: state.plans.map(p =>
                    p.id === planId ? { ...p, enabled: !p.enabled } : p
                )
            })),

            addLog: (log) => set((state) => ({
                logs: [
                    { ...log, id: crypto.randomUUID() },
                    ...state.logs.slice(0, 99) // Keep last 100 logs
                ]
            })),

            addSuggestion: (suggestion) => set((state) => ({
                pendingSuggestions: [
                    { ...suggestion, id: crypto.randomUUID() },
                    ...state.pendingSuggestions
                ]
            })),

            dismissSuggestion: (suggestionId) => set((state) => ({
                pendingSuggestions: state.pendingSuggestions.filter(s => s.id !== suggestionId)
            })),

            clearExpiredSuggestions: () => set((state) => ({
                pendingSuggestions: state.pendingSuggestions.filter(s => {
                    if (!s.expiresAt) return true;
                    return new Date(s.expiresAt) > new Date();
                })
            })),

            setEngineStatus: (running) => set({ isEngineRunning: running }),

            updateLastRun: () => set({ lastEngineRun: new Date().toISOString() })
        }),
        {
            name: 'automation-engine-v1',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
