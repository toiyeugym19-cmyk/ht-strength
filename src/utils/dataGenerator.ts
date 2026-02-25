/**
 * DATA GENERATOR - Tạo dữ liệu mẫu quy mô lớn cho hệ thống Gym
 * 
 * Bao gồm:
 * - 50+ Hội viên với đầy đủ thông tin
 * - 500+ Check-in records
 * - Health metrics cho từng member
 * - Contracts và invoices
 */

import { format, subDays, addDays, addHours } from 'date-fns';

// ===== HỌ TÊN VIỆT NAM =====
const FIRST_NAMES = [
    'Anh', 'Bảo', 'Cường', 'Dũng', 'Đức', 'Hải', 'Hoàng', 'Hùng', 'Khang', 'Khôi',
    'Long', 'Minh', 'Nam', 'Phúc', 'Quang', 'Sơn', 'Thành', 'Toàn', 'Trung', 'Tuấn',
    'An', 'Bình', 'Chi', 'Diệu', 'Giang', 'Hà', 'Hương', 'Lan', 'Linh', 'Mai',
    'Ngọc', 'Nhung', 'Phương', 'Quỳnh', 'Thảo', 'Thúy', 'Trang', 'Trinh', 'Vân', 'Yến'
];

const LAST_NAMES = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đào', 'Đinh', 'Mai', 'Trịnh'
];

const MIDDLE_NAMES = [
    'Văn', 'Thị', 'Hoàng', 'Minh', 'Thanh', 'Đức', 'Ngọc', 'Kim', 'Phương', 'Thành',
    'Hữu', 'Quốc', 'Xuân', 'Thu', 'Hồng', 'Bảo', 'Như', 'Anh', 'Tuấn', 'Huy'
];

// ===== GÓI TẬP =====
const MEMBERSHIP_TYPES = [
    { name: 'Gói 12 Buổi', sessions: 12, price: 2400000 },
    { name: 'Gói 30 Buổi', sessions: 30, price: 5500000 },
    { name: 'Gói 100 Buổi', sessions: 100, price: 15000000 },
];

// ===== HUẤN LUYỆN VIÊN =====
const TRAINERS = [
    'Coach Thor', 'Coach Sarah', 'Coach Mike', 'Coach Lyra', 'Coach Alex',
    'Coach Hùng', 'Coach Linh', 'Coach Nam', 'Zumba Master', 'Yoga Master'
];

// ===== MỤC TIÊU TẬP =====
const FITNESS_GOALS = [
    'Giảm cân', 'Tăng cơ', 'Giữ form', 'Tăng sức mạnh', 'Cải thiện sức bền',
    'Giảm mỡ bụng', 'Săn chắc cơ thể', 'Tăng chiều cao', 'Phục hồi chấn thương',
    'Chuẩn bị thi đấu', 'Yoga & Thiền', 'Cardio', 'CrossFit', 'Boxing'
];

// ===== LOẠI CHECK-IN =====
const CHECK_IN_TYPES: Array<'Class' | 'PT' | 'Gym Access'> = ['Class', 'PT', 'Gym Access'];

const CHECK_IN_NOTES = [
    'Tự tập', 'Leg Day', 'Chest Day', 'Back Day', 'Arm Day', 'Shoulder Day',
    'Full Body', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'Zumba', 'Boxing',
    'Swimming', 'Core Training', 'Stretch & Recovery', 'Heavy Lifts', 'Light workout'
];

// ===== HELPER FUNCTIONS =====
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomElements<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function generatePhone(): string {
    const prefixes = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099', '070', '076', '077', '078', '079', '081', '082', '083', '084', '085'];
    return randomElement(prefixes) + randomInt(1000000, 9999999).toString();
}

function generateVietnameseName(): { fullName: string; firstName: string } {
    const lastName = randomElement(LAST_NAMES);
    const middleName = randomElement(MIDDLE_NAMES);
    const firstName = randomElement(FIRST_NAMES);
    return {
        fullName: `${lastName} ${middleName} ${firstName}`,
        firstName
    };
}

// ===== GENERATE MEMBERS =====
export function generateMembers(count: number = 50) {
    const members = [];

    for (let i = 1; i <= count; i++) {
        const { fullName, firstName } = generateVietnameseName();
        const membershipType = randomElement(MEMBERSHIP_TYPES);
        const joinDate = subDays(new Date(), randomInt(1, 365));
        const isActive = Math.random() > 0.25; // 75% active
        const sessionsUsed = isActive
            ? randomInt(1, Math.floor(membershipType.sessions * 0.8))
            : membershipType.sessions;

        const expiryDays = isActive ? randomInt(-10, 180) : randomInt(-60, -1);
        const expiryDate = addDays(new Date(), expiryDays);

        const birthYear = randomInt(1980, 2005);
        const birthMonth = randomInt(0, 11);
        const birthDay = randomInt(1, 28);

        // Generate check-in history for this member
        const checkInCount = randomInt(5, 30);
        const checkInHistory = [];
        for (let j = 0; j < checkInCount; j++) {
            const checkInDate = subDays(new Date(), randomInt(0, 60));
            const hour = randomInt(6, 21);
            checkInHistory.push({
                id: `ci-${i}-${j}`,
                date: addHours(checkInDate, hour).toISOString(),
                type: randomElement(CHECK_IN_TYPES),
                trainerName: Math.random() > 0.5 ? randomElement(TRAINERS) : undefined,
                note: randomElement(CHECK_IN_NOTES),
                duration: randomInt(30, 120)
            });
        }

        // Generate health metrics
        const healthMetricsCount = randomInt(1, 5);
        const healthMetrics = [];
        const baseWeight = randomInt(45, 95);
        const height = randomInt(155, 185);

        for (let k = 0; k < healthMetricsCount; k++) {
            const recordDate = subDays(new Date(), k * 15);
            const weight = baseWeight - k * randomInt(0, 2);
            const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
            const bodyFat = randomInt(10, 35);

            healthMetrics.push({
                id: `hm-${i}-${k}`,
                recordDate: format(recordDate, 'yyyy-MM-dd'),
                recordedBy: randomElement(TRAINERS),
                weight,
                height,
                bmi,
                bodyFat,
                muscleMass: randomInt(25, 50),
                chest: randomInt(85, 120),
                waist: randomInt(65, 100),
                hips: randomInt(85, 110),
                notes: k === 0 ? 'Đo gần đây nhất' : 'Theo dõi tiến trình'
            });
        }

        members.push({
            id: `MEM-${String(i).padStart(3, '0')}`,
            name: fullName,
            phone: generatePhone(),
            email: `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${i}@gmail.com`,
            avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstName}${i}`,
            joinDate: format(joinDate, 'yyyy-MM-dd'),
            membershipType: membershipType.name,
            status: isActive ? (Math.random() > 0.9 ? 'Pending' : 'Active') : 'Expired',
            sessionsTotal: membershipType.sessions,
            sessionsUsed,
            lastCheckIn: checkInHistory.length > 0 ? checkInHistory[0].date : 'N/A',
            assignedPT: Math.random() > 0.4 ? randomElement(TRAINERS) : undefined,
            faceIdRegistered: Math.random() > 0.3,
            totalSpending: membershipType.price + randomInt(0, 5000000),
            dateOfBirth: format(new Date(birthYear, birthMonth, birthDay), 'yyyy-MM-dd'),
            expiryDate: format(expiryDate, 'yyyy-MM-dd'),
            registrationDate: format(joinDate, 'yyyy-MM-dd'),
            fitnessGoals: randomElements(FITNESS_GOALS, randomInt(1, 3)),
            progressScore: randomInt(-30, 100),
            riskLevel: isActive ? (Math.random() > 0.7 ? 'medium' : 'low') : 'high',
            checkInHistory,
            contracts: [],
            healthMetrics
        });
    }

    return members;
}

// ===== GENERATE SCHEDULE =====
export function generateSchedule(days: number = 7) {
    const schedule = [];
    const classTypes = [
        { name: 'Yoga Morning', trainer: 'Yoga Master', type: 'Group Class', max: 15 },
        { name: 'HIIT Blast', trainer: 'Coach Mike', type: 'Group Class', max: 20 },
        { name: 'Zumba Dance', trainer: 'Zumba Master', type: 'Group Class', max: 25 },
        { name: 'Body Pump', trainer: 'Coach Thor', type: 'Group Class', max: 20 },
        { name: 'Pilates Core', trainer: 'Coach Sarah', type: 'Group Class', max: 12 },
        { name: 'Boxing Fit', trainer: 'Coach Alex', type: 'Group Class', max: 15 },
        { name: 'Spin Class', trainer: 'Coach Hùng', type: 'Group Class', max: 20 },
        { name: 'CrossFit WOD', trainer: 'Coach Nam', type: 'Group Class', max: 16 },
    ];

    const timeSlots = [6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20];

    let id = 1;
    for (let d = 0; d < days; d++) {
        const date = addDays(new Date(), d - 1);
        const numClasses = randomInt(4, 8);
        const selectedSlots = randomElements(timeSlots, numClasses);

        for (const slot of selectedSlots) {
            const classType = randomElement(classTypes);
            const startTime = new Date(date);
            startTime.setHours(slot, 0, 0, 0);
            const endTime = new Date(startTime);
            endTime.setHours(slot + 1);

            schedule.push({
                id: `sch-${id++}`,
                title: classType.name,
                start: startTime.toISOString(),
                end: endTime.toISOString(),
                trainer: classType.trainer,
                type: classType.type,
                attendees: [],
                maxAttendees: classType.max
            });
        }

        // Add some PT sessions
        const ptSessions = randomInt(3, 6);
        for (let p = 0; p < ptSessions; p++) {
            const slot = randomElement(timeSlots);
            const trainer = randomElement(TRAINERS);
            const startTime = new Date(date);
            startTime.setHours(slot, 0, 0, 0);
            const endTime = new Date(startTime);
            endTime.setHours(slot + 1);

            schedule.push({
                id: `sch-${id++}`,
                title: `PT Session - ${trainer}`,
                start: startTime.toISOString(),
                end: endTime.toISOString(),
                trainer,
                type: 'PT Session',
                attendees: [`MEM-${String(randomInt(1, 50)).padStart(3, '0')}`],
                maxAttendees: 1
            });
        }
    }

    return schedule;
}

// ===== GENERATE TASKS =====
export function generateTasks(count: number = 100) {
    const tasks = [];
    const taskTypes: Array<'call' | 'follow_up' | 'renewal' | 'feedback' | 'other'> = [
        'call', 'follow_up', 'renewal', 'feedback', 'other'
    ];
    const taskTitles = {
        call: ['Gọi nhắc lịch tập', 'Tư vấn gói mới', 'Hỏi thăm sức khỏe', 'Confirm lịch PT'],
        follow_up: ['Follow up sau 1 tuần', 'Kiểm tra tiến độ', 'Đánh giá mục tiêu', 'Check-in hàng tháng'],
        renewal: ['Nhắc gia hạn thẻ', 'Đề xuất upgrade', 'Gửi ưu đãi đặc biệt', 'Thông báo hết hạn'],
        feedback: ['Thu thập feedback', 'Khảo sát hài lòng', 'Đánh giá PT', 'Review dịch vụ'],
        other: ['Sự kiện đặc biệt', 'Chúc mừng sinh nhật', 'Tặng quà VIP', 'Workshop mời tham gia']
    };

    const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const statuses: Array<'pending' | 'in_progress' | 'completed' | 'cancelled'> = ['pending', 'in_progress', 'completed', 'cancelled'];

    for (let i = 1; i <= count; i++) {
        const type = randomElement(taskTypes);
        const dueDate = addDays(new Date(), randomInt(-5, 14));
        const { fullName } = generateVietnameseName();

        tasks.push({
            id: `task-${i}`,
            memberId: `MEM-${String(randomInt(1, 50)).padStart(3, '0')}`,
            memberName: fullName,
            type,
            title: randomElement(taskTitles[type]),
            description: `Nhiệm vụ tự động được tạo cho hội viên ${fullName}`,
            dueDate: format(dueDate, 'yyyy-MM-dd'),
            priority: randomElement(priorities),
            status: randomElement(statuses),
            createdBy: randomElement(TRAINERS),
            automationPlanId: Math.random() > 0.5 ? `plan-${randomInt(1, 10)}` : undefined
        });
    }

    return tasks;
}

// ===== GENERATE AUTOMATION LOGS =====
export function generateAutomationLogs(count: number = 200) {
    const logs = [];
    const logTypes: Array<'success' | 'warning' | 'info' | 'critical' | 'n8n_trigger'> = [
        'success', 'success', 'success', 'warning', 'info', 'critical', 'n8n_trigger'
    ];
    const planNames = [
        '7 Ngày Trước Hết Hạn', '3 Ngày Trước Hết Hạn', 'Ngày Hết Hạn',
        'Chào Mừng Hội Viên Mới', 'Sinh Nhật Hội Viên', 'Không Tập 7 Ngày',
        'Chuỗi 10 Ngày Tập', 'Reminder Buổi PT', 'Đánh Giá Tiến Trình',
        'VIP Upgrade Suggestion'
    ];
    const messages = [
        'Đã gửi SMS nhắc nhở thành công',
        'Tạo task follow-up cho staff',
        'Gửi notification qua app',
        'Trigger n8n workflow thành công',
        'Đã xử lý automation rule',
        'Cập nhật trạng thái hội viên',
        'Gửi email chúc mừng sinh nhật',
        'Tạo báo cáo tự động',
        'Đồng bộ dữ liệu với CRM',
        'Cảnh báo hội viên at-risk'
    ];

    for (let i = 1; i <= count; i++) {
        const { fullName } = generateVietnameseName();
        const timestamp = subDays(new Date(), randomInt(0, 30));
        timestamp.setHours(randomInt(6, 22), randomInt(0, 59));

        logs.push({
            id: `log-${i}`,
            planId: `plan-${randomInt(1, 10)}`,
            planName: randomElement(planNames),
            memberId: `MEM-${String(randomInt(1, 50)).padStart(3, '0')}`,
            memberName: fullName,
            timestamp: timestamp.toISOString(),
            message: randomElement(messages),
            type: randomElement(logTypes),
            n8nExecutionId: Math.random() > 0.7 ? `exec-${randomInt(1000, 9999)}` : undefined
        });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ===== GENERATE TODAY STATS =====
export function generateTodayStats() {
    return {
        expiringToday: randomInt(2, 8),
        expiringThisWeek: randomInt(10, 25),
        expiringThisMonth: randomInt(30, 60),
        newSignups: randomInt(3, 12),
        atRiskMembers: randomInt(5, 15),
        callsToMake: randomInt(8, 20),
        birthdaysToday: randomInt(0, 3),
        inactiveMembers: randomInt(10, 30),
        vipMembers: randomInt(15, 40),
        n8nExecutions: randomInt(50, 150),
        pendingPayments: randomInt(5, 15),
        tasksCompleted: randomInt(20, 50),
        renewalsProcessed: randomInt(3, 10)
    };
}

// ===== EXPORT ALL GENERATED DATA =====
export function generateAllData() {
    console.log('🚀 Generating comprehensive gym data...');

    const members = generateMembers(50);
    const schedule = generateSchedule(14);
    const tasks = generateTasks(100);
    const logs = generateAutomationLogs(200);
    const todayStats = generateTodayStats();

    console.log(`✅ Generated:
    - ${members.length} members
    - ${members.reduce((sum, m) => sum + m.checkInHistory.length, 0)} check-ins
    - ${schedule.length} schedule items
    - ${tasks.length} tasks
    - ${logs.length} automation logs
    `);

    return {
        members,
        schedule,
        tasks,
        logs,
        todayStats
    };
}

export default generateAllData;
