import { useMemo } from 'react';
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Flame, TrendUp, ChartBar } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';

// ============================================================
//  MEMBER STATS — Thống kê chuyên cần, phân tích đi tập
// ============================================================

export default function MemberStatsPage() {
    const { user } = useAuth();
    const { members } = useMemberStore();

    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const { streak, monthData, weeklyAvg, monthlyTotal } = useMemo(() => {
        if (!member) return { streak: 0, monthData: [], weeklyAvg: 0, monthlyTotal: 0 };

        const history = member.checkInHistory || [];
        let streakCount = 0;
        let d = new Date();
        while (history.some(h => isSameDay(new Date(h.date), d))) {
            streakCount++;
            d = subDays(d, 1);
        }

        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const startWeekday = monthStart.getDay();
        const padStart = startWeekday === 0 ? 6 : startWeekday - 1;

        const monthData: Array<{ date?: Date; label: string; hasCheckIn: boolean; isToday: boolean; empty?: boolean }> = [];
        for (let i = 0; i < padStart; i++) monthData.push({ label: '', hasCheckIn: false, isToday: false, empty: true });
        days.forEach(day => monthData.push({
            date: day,
            label: format(day, 'd'),
            hasCheckIn: history.some(h => isSameDay(new Date(h.date), day)),
            isToday: isSameDay(day, now),
        }));

        const last7Days = history.filter(h => {
            const d = new Date(h.date);
            return d >= subDays(now, 7);
        });
        const last30Days = history.filter(h => {
            const d = new Date(h.date);
            return d >= subDays(now, 30);
        });

        return {
            streak: streakCount,
            monthData,
            weeklyAvg: last7Days.length,
            monthlyTotal: last30Days.length,
        };
    }, [member]);

    const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

    return (
        <div className="ios-animate-in min-h-full superapp-page" style={{ maxWidth: 430, margin: '0 auto' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

                {/* Summary cards */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 pt-4">
                    <div className="gym-card gym-card--accent p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame size={18} weight="duotone" className="text-[#FF9F0A]" />
                            <span className="text-xs font-medium" style={{ color: 'var(--ios-label)' }}>Chuỗi ngày</span>
                        </div>
                        <p className="text-2xl font-bold">{streak} <span className="text-sm font-normal" style={{ color: 'var(--ios-secondary)' }}>ngày</span></p>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--ios-tertiary)' }}>
                            {streak > 0 ? 'Tiếp tục! 🔥' : 'Đi tập để bắt đầu'}
                        </p>
                    </div>
                    <div className="gym-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ChartBar size={18} weight="duotone" className="text-[#0A84FF]" />
                            <span className="text-xs font-medium" style={{ color: 'var(--ios-label)' }}>7 ngày qua</span>
                        </div>
                        <p className="text-2xl font-bold">{weeklyAvg} <span className="text-sm font-normal" style={{ color: 'var(--ios-secondary)' }}>buổi</span></p>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--ios-tertiary)' }}>
                            Trung bình mỗi tuần
                        </p>
                    </div>
                    <div className="gym-card p-4 col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendUp size={18} weight="duotone" className="text-[#30D158]" />
                            <span className="text-xs font-medium" style={{ color: 'var(--ios-label)' }}>30 ngày qua</span>
                        </div>
                        <p className="text-2xl font-bold">{monthlyTotal} <span className="text-sm font-normal" style={{ color: 'var(--ios-secondary)' }}>buổi</span></p>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--ios-tertiary)' }}>
                            Tổng số buổi đã đi tập trong tháng
                        </p>
                    </div>
                </motion.div>

                {/* Calendar heatmap */}
                <motion.div variants={fadeUp} className="gym-section">
                    <p className="gym-section__title capitalize">{format(new Date(), 'MMMM yyyy', { locale: vi })}</p>
                    <div className="gym-card p-4">
                        <div className="grid grid-cols-7 gap-1">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                <div key={d} className="text-center text-[10px] font-medium py-1" style={{ color: 'var(--ios-tertiary)' }}>{d}</div>
                            ))}
                            {monthData.map((day, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-semibold transition-all"
                                    style={{
                                        background: day.empty ? 'transparent' : day.isToday ? '#0A84FF' : day.hasCheckIn ? 'rgba(48,209,88,0.4)' : 'rgba(255,255,255,0.04)',
                                        color: day.empty ? 'transparent' : day.isToday || day.hasCheckIn ? '#fff' : 'var(--ios-tertiary)',
                                    }}
                                >
                                    {day.label}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ background: 'rgba(48,209,88,0.4)' }} />
                                <span className="text-[11px]" style={{ color: 'var(--ios-secondary)' }}>Đã đi tập</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#0A84FF]" />
                                <span className="text-[11px]" style={{ color: 'var(--ios-secondary)' }}>Hôm nay</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
