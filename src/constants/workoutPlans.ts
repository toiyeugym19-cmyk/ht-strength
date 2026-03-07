export type WorkoutPlanId = 'fullbody_basic' | 'push' | 'pull' | 'legs';

export interface WorkoutPlan {
    id: WorkoutPlanId;
    name: string;
    description: string;
    focus: string;
    estimatedMinutes: number;
    exerciseIds: string[];
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
    {
        id: 'fullbody_basic',
        name: 'Full Body Cơ Bản',
        description: 'Toàn thân cho người bận rộn',
        focus: 'FullBody · 6 bài · 3×/tuần',
        estimatedMinutes: 50,
        exerciseIds: ['chest-001', 'back-003', 'leg-001', 'sh-001', 'arm-001', 'core-001'],
    },
    {
        id: 'push',
        name: 'Push — Ngực & Vai',
        description: 'Tập trung đẩy: ngực, vai, tay sau',
        focus: 'Upper · 6 bài',
        estimatedMinutes: 55,
        exerciseIds: ['chest-005', 'chest-004', 'sh-001', 'sh-004', 'arm-002', 'core-003'],
    },
    {
        id: 'pull',
        name: 'Pull — Lưng & Tay',
        description: 'Kéo lưng xô + tay trước',
        focus: 'Lưng · 6 bài',
        estimatedMinutes: 55,
        exerciseIds: ['back-003', 'back-005', 'back-006', 'arm-001', 'arm-003', 'core-002'],
    },
    {
        id: 'legs',
        name: 'Legs — Chân & Mông',
        description: 'Chân mông khoẻ, form chuẩn',
        focus: 'Lower · 6 bài',
        estimatedMinutes: 60,
        exerciseIds: ['leg-001', 'leg-004', 'leg-006', 'leg-009', 'leg-010', 'core-001'],
    },
];
