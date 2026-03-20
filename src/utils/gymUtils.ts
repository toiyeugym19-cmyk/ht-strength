/**
 * Shared gym utilities — single source of truth
 * Dùng cho cả AdminDashboard, MembersPage, PTsPage, MemberDashboard, v.v.
 */

// ──────────────────────────────────────────────────────────────────────────────
//  GREETING
// ──────────────────────────────────────────────────────────────────────────────
export function getGreeting(hour = new Date().getHours()): string {
    if (hour < 11) return 'Chào buổi sáng';
    if (hour < 17) return 'Chào buổi chiều';
    return 'Chào buổi tối';
}

// ──────────────────────────────────────────────────────────────────────────────
//  STATUS TRANSLATION
// ──────────────────────────────────────────────────────────────────────────────
export function translateStatus(status: string): string {
    switch ((status || '').toLowerCase()) {
        case 'active':   return 'Hoạt động';
        case 'expired':  return 'Hết buổi';
        case 'pending':  return 'Chờ duyệt';
        case 'banned':   return 'Đã khoá';
        case 'inactive': return 'Tạm nghỉ';
        case 'onleave':  return 'Nghỉ phép';
        default:         return status || 'Không xác định';
    }
}

export function statusColor(status: string): string {
    switch ((status || '').toLowerCase()) {
        case 'active':   return '#30D158';
        case 'expired':  return '#FF453A';
        case 'pending':  return '#FF9F0A';
        case 'banned':   return '#8E8E93';
        case 'inactive': return '#8E8E93';
        case 'onleave':  return '#BF5AF2';
        default:         return '#8E8E93';
    }
}

// ──────────────────────────────────────────────────────────────────────────────
//  MEMBERSHIP TYPE TRANSLATION
// ──────────────────────────────────────────────────────────────────────────────
export function translateMembership(type: string): string {
    if (!type) return 'N/A';
    if (type.startsWith('Gói')) return type;
    const t = type.toLowerCase();
    if (t.includes('1 month'))  return 'Gói 1 Tháng';
    if (t.includes('3 months')) return 'Gói 3 Tháng';
    if (t.includes('6 months')) return 'Gói 6 Tháng';
    if (t.includes('1 year'))   return 'Gói 1 Năm';
    if (t.includes('session'))  return 'Gói Buổi Lẻ';
    return type;
}

// ──────────────────────────────────────────────────────────────────────────────
//  MEMBER RANK — based on sessions attended
// ──────────────────────────────────────────────────────────────────────────────
export interface MemberRank {
    label: string;
    color: string;
    emoji: string;
    min: number;
}

export const MEMBER_RANKS: MemberRank[] = [
    { label: 'Huyền Thoại', emoji: '🏆', color: 'text-yellow-400',  min: 200 },
    { label: 'Tinh Anh',    emoji: '💎', color: 'text-purple-400',  min: 50  },
    { label: 'Cao Thủ',     emoji: '🥇', color: 'text-blue-400',    min: 10  },
    { label: 'Mới',         emoji: '🌱', color: 'text-zinc-500',    min: 0   },
];

export function getMemberRank(sessionsUsed = 0): MemberRank {
    return MEMBER_RANKS.find(r => sessionsUsed >= r.min) ?? MEMBER_RANKS[MEMBER_RANKS.length - 1];
}

// ──────────────────────────────────────────────────────────────────────────────
//  SESSION-BASED PACKAGE — nguồn chân lý theo số buổi tập
// ──────────────────────────────────────────────────────────────────────────────
/** Số buổi còn lại trong gói */
export function getSessionsRemaining(sessionsTotal: number, sessionsUsed: number): number {
    return Math.max(0, (sessionsTotal ?? 0) - (sessionsUsed ?? 0));
}

/** Gói đã hết (hết buổi) khi sessionsUsed >= sessionsTotal */
export function isPackageExhausted(sessionsTotal: number, sessionsUsed: number): boolean {
    return (sessionsTotal ?? 0) > 0 && (sessionsUsed ?? 0) >= (sessionsTotal ?? 0);
}

/** Ngưỡng "sắp hết buổi" — cảnh báo khi còn <= N buổi */
export const LOW_SESSIONS_BUFFER = 3;

export function isLowSessions(sessionsTotal: number, sessionsUsed: number): boolean {
    const remaining = getSessionsRemaining(sessionsTotal, sessionsUsed);
    return remaining > 0 && remaining <= LOW_SESSIONS_BUFFER;
}

/** Copy hiển thị: "Còn X buổi" / "Hết buổi" */
export function formatSessionsRemaining(sessionsTotal: number, sessionsUsed: number): { text: string; urgent: boolean } {
    const remaining = getSessionsRemaining(sessionsTotal, sessionsUsed);
    if (remaining <= 0) return { text: 'Hết buổi', urgent: true };
    if (remaining <= LOW_SESSIONS_BUFFER) return { text: `Còn ${remaining} buổi`, urgent: true };
    return { text: `Còn ${remaining} buổi`, urgent: false };
}

// ──────────────────────────────────────────────────────────────────────────────
//  STREAK — consecutive days worked out
// ──────────────────────────────────────────────────────────────────────────────
export function calcStreak(history: Array<{ date: string }>): number {
    if (!history?.length) return 0;

    const days = new Set(
        history.map(h => new Date(h.date).toDateString())
    );

    let streak = 0;
    const now = new Date();

    for (let i = 0; i < 365; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        if (days.has(d.toDateString())) {
            streak++;
        } else if (i > 0) {
            break; // gap found
        }
    }
    return streak;
}

// ──────────────────────────────────────────────────────────────────────────────
//  ATTENDANCE RATE — last N days
// ──────────────────────────────────────────────────────────────────────────────
export function calcAttendanceRate(history: Array<{ date: string }>, days = 30): number {
    if (!history?.length) return 0;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const worked = new Set(
        history
            .filter(h => new Date(h.date) >= cutoff)
            .map(h => new Date(h.date).toDateString())
    ).size;

    return Math.round((worked / days) * 100);
}

// ──────────────────────────────────────────────────────────────────────────────
//  MEMBERSHIP PLAN — price lookup (VNĐ)
// ──────────────────────────────────────────────────────────────────────────────
export const MEMBERSHIP_PRICES: Record<string, number> = {
    'Gói 1 Tháng':  499_000,
    'Gói 3 Tháng': 1_299_000,
    'Gói 6 Tháng': 2_399_000,
    'Gói 1 Năm':   4_299_000,
};

export function getMembershipPrice(type: string): number {
    return MEMBERSHIP_PRICES[type] ?? 0;
}

// ──────────────────────────────────────────────────────────────────────────────
//  FORMAT HELPERS
// ──────────────────────────────────────────────────────────────────────────────
export function formatVND(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString('vi-VN');
}

export function formatDaysUntil(dateStr: string): { text: string; urgent: boolean } {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
    if (days < 0)  return { text: `Hết hạn ${Math.abs(days)} ngày trước`, urgent: true };
    if (days === 0) return { text: 'Hết hạn hôm nay', urgent: true };
    if (days <= 7)  return { text: `Còn ${days} ngày`, urgent: true };
    return { text: `Còn ${days} ngày`, urgent: false };
}

// ──────────────────────────────────────────────────────────────────────────────
//  APP INFO MAP — dùng cho InfoPage / Settings
//  Đây là "mindmap" của toàn bộ app — single source of truth cho nav/descriptions
// ──────────────────────────────────────────────────────────────────────────────
export const APP_SITEMAP = {
    admin: {
        label: 'Quản Trị Viên',
        description: 'Quản lý toàn bộ phòng gym',
        sections: [
            {
                id: 'dashboard',
                path: '/',
                label: 'Trang Chủ',
                icon: 'House',
                description: 'Tổng quan hoạt động hôm nay',
                features: ['Live check-in', 'Doanh thu ước tính', 'Gói tập phân loại', 'Cảnh báo hết hạn'],
            },
            {
                id: 'members',
                path: '/members',
                label: 'Hội Viên',
                icon: 'Users',
                description: 'Danh sách & quản lý hội viên',
                features: ['Check-in double-tap', 'Gói tập & thời hạn', 'Sinh trắc học', 'Phân tích & báo cáo'],
            },
            {
                id: 'pt',
                path: '/pt',
                label: 'Huấn Luyện Viên',
                icon: 'UserCheck',
                description: 'Danh sách PT & hiệu suất',
                features: ['Chuyên môn & rating', 'Số HV phụ trách', 'Lịch làm việc'],
            },
            {
                id: 'gym',
                path: '/gym',
                label: 'Phòng Gym',
                icon: 'Dumbbell',
                description: 'Lịch tập tuần & nhật ký cá nhân',
                features: ['Weekly planner', 'Nhật ký bài tập', 'Thể tích tập luyện'],
            },
            {
                id: 'analytics',
                path: '/analytics',
                label: 'Phân Tích',
                icon: 'BarChart3',
                description: 'Biểu đồ hiệu suất & xu hướng',
                features: ['Hoàn thành nhiệm vụ', 'Khối lượng gym', 'Xu hướng dinh dưỡng', 'Heatmap kiên trì'],
            },
        ],
    },
    member: {
        label: 'Hội Viên',
        description: 'Theo dõi tập luyện cá nhân',
        sections: [
            {
                id: 'member-dashboard',
                path: '/',
                label: 'Trang Chủ',
                icon: 'House',
                description: 'Tiến độ cá nhân & lịch check-in',
                features: ['Ring tiến độ buổi tập', 'Calendar tuần', 'Chuỗi ngày streak', 'Motivation card'],
            },
            {
                id: 'exercises',
                path: '/exercises',
                label: 'Bài Tập',
                icon: 'Dumbbell',
                description: 'Thư viện bài tập có GIF hướng dẫn',
                features: ['Filter theo nhóm cơ', '7 nhóm cơ chính', 'GIF minh hoạ', 'Hướng dẫn từng bước'],
            },
            {
                id: 'my-progress',
                path: '/my-progress',
                label: 'Tiến Trình',
                icon: 'TrendingUp',
                description: 'Xu hướng cân nặng & thể trạng',
                features: ['7 ngày cân nặng', 'Body composition', 'So sánh trước/sau'],
            },
            {
                id: 'my-stats',
                path: '/my-stats',
                label: 'Thống Kê',
                icon: 'Trophy',
                description: 'Chuyên cần & thành tích cá nhân',
                features: ['Streak ngày liên tiếp', 'Tần suất 7/30 ngày', 'Calendar heatmap'],
            },
        ],
    },
} as const;
