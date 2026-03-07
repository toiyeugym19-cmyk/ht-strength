import { useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Scales, TrendUp, TrendDown, ChartLineUp, Flame, Barbell, Target, Trophy, Clock } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { calcStreak, calcAttendanceRate } from '../utils/gymUtils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ──────────────────────────────────────────────────────────────────────────────
//  MemberProgressPage — Tiến trình thể trạng cá nhân (member view)
//
//  Khác ProgressPage (admin analytics):
//  · ProgressPage     → phân tích công việc/gym/dinh dưỡng, dùng store cá nhân
//  · MemberProgressPage → check-in history thực, xu hướng chuyên cần của member
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Sinh chỉ số body composition giả lập theo member ID
 * (mỗi member có số khác nhau thay vì hardcode một bộ)
 */
function genBodyStats(memberId: string, weight?: number, height?: number) {
    // Dùng memberId hash đơn giản để tạo sự khác biệt
    const seed = memberId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const base = (seed % 20) / 10; // 0 – 2

    const w = weight || 65 + base * 5;
    const bmi = height ? +(w / ((height / 100) ** 2)).toFixed(1) : +(21 + base).toFixed(1);
    const fat = +(12 + base * 2).toFixed(1);
    const muscle = +(32 + base * 1.5).toFixed(1);

    return [
        { label: 'Cân nặng', value: w, prev: +(w + 0.9).toFixed(1), unit: 'kg', color: '#0A84FF', trend: 'down' as const },
        { label: 'Mỡ cơ thể', value: fat, prev: +(fat + 0.7).toFixed(1), unit: '%', color: '#FF375F', trend: 'down' as const },
        { label: 'Khối lượng cơ', value: muscle, prev: +(muscle - 0.6).toFixed(1), unit: 'kg', color: '#30D158', trend: 'up' as const },
        { label: 'BMI', value: bmi, prev: +(bmi + 0.3).toFixed(1), unit: '', color: '#FF9F0A', trend: 'down' as const },
    ];
}

// --- Chart Component ---
function StrengthTrendCard({ logs }: { logs: any[] }) {
    const chartData = useMemo(() => {
        // Extract max weight per session, simplified for demo
        // In real app, we would group by exerciseId
        return logs.slice().reverse().map(log => ({
            date: format(new Date(log.date), 'd/M'),
            weight: Math.max(...(log.exercises?.[0]?.sets?.map((s: any) => s.weight) || [0]), 0)
        })).filter(d => d.weight > 0);
    }, [logs]);

    if (chartData.length < 2) return null;

    return (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="gym-card p-5 mb-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold">Biểu đồ Sức Mạnh</h3>
                    <p className="text-[12px] opacity-60">Theo dõi mức tạ tập luyện</p>
                </div>
                <div className="p-2 rounded-xl bg-[#BF5AF2]/10">
                    <TrendUp size={20} color="#BF5AF2" weight="duotone" />
                </div>
            </div>

            <div className="h-[180px] w-full mt-4 -ml-4 pr-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#BF5AF2', fontWeight: 'bold' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#BF5AF2"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#BF5AF2', strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default function MemberProgressPage() {
    const { user } = useAuth();
    const { members } = useMemberStore();

    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const { logs: workoutLogs } = useWorkoutStore();

    const history = member?.checkInHistory || [];
    const streak = calcStreak(history);
    const rate7 = calcAttendanceRate(history, 7);
    const rate30 = calcAttendanceRate(history, 30);

    const joinDate = member ? format(new Date(member.joinDate), 'd MMM yyyy', { locale: vi }) : '--';

    // ── Check-in per day last 7 days
    const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
            label: format(d, 'EEE', { locale: vi }),
            dayNum: format(d, 'd'),
            checked: history.some(h => isSameDay(new Date(h.date), d)),
            isToday: i === 6,
        };
    }), [history]);

    // ── Sessions trend last 12 weeks (aggregated from checkInHistory)
    const weeklyBars = useMemo(() => {
        const weeks: number[] = Array(12).fill(0);
        history.forEach(h => {
            const daysAgo = Math.floor((Date.now() - new Date(h.date).getTime()) / 86_400_000);
            const weekIdx = 11 - Math.floor(daysAgo / 7);
            if (weekIdx >= 0 && weekIdx < 12) weeks[weekIdx]++;
        });
        return weeks;
    }, [history]);

    const maxBar = Math.max(...weeklyBars, 1);

    // ── Body stats (unique per member) — ưu tiên từ bodyMetrics nếu có
    const bodyStats = useMemo(() =>
        member ? genBodyStats(member.id, member.weight, member.height) : [],
        [member]);

    const metrics = member?.bodyMetrics || [];
    const goals = member?.goalTargets;
    const latestMetric = metrics[0];
    const firstMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;

    const achievedSummary = useMemo(() => {
        if (!goals || !latestMetric && !firstMetric) return null;
        const lines: string[] = [];
        if (goals.weightFrom != null && goals.weightTo != null && latestMetric?.weight != null) {
            const diff = (latestMetric.weight ?? 0) - goals.weightTo;
            if (Math.abs(diff) <= 2) lines.push(`Cân nặng: ${goals.weightFrom} → ${latestMetric.weight} kg (mục tiêu ${goals.weightTo} kg)`);
            else lines.push(`Cân nặng: ${firstMetric?.weight ?? goals.weightFrom} → ${latestMetric.weight} kg (mục tiêu ${goals.weightTo} kg)`);
        }
        if (goals.hipFrom != null && goals.hipTo != null && latestMetric?.hip != null) {
            const change = (latestMetric.hip ?? 0) - (firstMetric?.hip ?? goals.hipFrom);
            lines.push(`Vòng 3: ${change >= 0 ? '+' : ''}${change.toFixed(1)} cm`);
        }
        if (goals.waistFrom != null && goals.waistTo != null && latestMetric?.waist != null) {
            const change = (firstMetric?.waist ?? goals.waistFrom) - (latestMetric.waist ?? 0);
            lines.push(`Vòng eo: ${change >= 0 ? '-' : ''}${Math.abs(change).toFixed(1)} cm`);
        }
        return lines.length ? lines : null;
    }, [goals, latestMetric, firstMetric]);

    const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="ios-animate-in min-h-full superapp-page">

            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-3 pb-4">
                <p className="text-[13px]" style={{ color: 'var(--ios-tertiary)' }}>Thành viên từ {joinDate}</p>
                <p className="text-[13px] mt-1" style={{ color: 'var(--ios-secondary)' }}>
                    Buổi thứ {member?.sessionsUsed ?? 0} trong gói {member?.sessionsTotal ?? 0} buổi · Còn {Math.max(0, (member?.sessionsTotal ?? 0) - (member?.sessionsUsed ?? 0))} buổi
                </p>
            </motion.div>

            {/* Onboarding khi chưa có check-in */}
            {history.length === 0 && (
                <motion.div variants={fadeUp} className="mb-4 gym-alert gym-alert--success">
                    <ChartLineUp size={20} weight="duotone" className="flex-shrink-0 mt-0.5" style={{ color: '#30D158' }} />
                    <div className="flex-1">
                        <p className="text-[14px] font-semibold" style={{ color: 'var(--ios-label)' }}>Bắt đầu theo dõi tiến độ</p>
                        <p className="text-[13px] mt-0.5" style={{ color: 'var(--ios-secondary)' }}>
                            Check-in mỗi lần đến phòng gym để streak, tỉ lệ đi tập và biểu đồ 12 tuần được cập nhật.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* ── QUICK STATS ── */}
            <motion.div variants={fadeUp} className="mb-5">
                <div className="grid grid-cols-3 gap-2.5">
                    {[
                        { icon: Flame, value: streak, label: 'Streak', unit: 'ngày', color: '#FF453A' },
                        { icon: ChartLineUp, value: rate7, label: '7 Ngày', unit: '%', color: '#30D158' },
                        { icon: Barbell, value: rate30, label: '30 Ngày', unit: '%', color: '#0A84FF' },
                    ].map(s => (
                        <div key={s.label} className="gym-card p-3.5 flex flex-col items-center gap-1.5">
                            <s.icon size={20} weight="duotone" color={s.color} />
                            <p className="text-[24px] font-bold leading-none">{s.value}</p>
                            <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--ios-tertiary)', letterSpacing: 0.3 }}>{s.label}</p>
                            <p className="text-[10px] font-medium" style={{ color: s.color }}>{s.unit}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── CHECK-IN 7 NGÀY ── */}
            <motion.div variants={fadeUp} className="mb-5 gym-section">
                <p className="gym-section__title">Check-in 7 Ngày Qua</p>
                <div className="gym-card p-4">
                    <div className="flex items-end justify-between gap-2">
                        {last7.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                                <div
                                    className="w-full rounded-full flex items-center justify-center"
                                    style={{
                                        height: 32, minWidth: 32,
                                        background: d.isToday ? '#0A84FF' : d.checked ? 'rgba(48,209,88,0.2)' : 'rgba(255,255,255,0.05)',
                                        border: d.checked && !d.isToday ? '1.5px solid rgba(48,209,88,0.4)' : d.isToday ? 'none' : '1.5px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <span className="text-[11px] font-semibold" style={{ color: d.isToday ? '#fff' : d.checked ? '#30D158' : 'var(--ios-tertiary)' }}>
                                        {d.dayNum}
                                    </span>
                                </div>
                                <span className="text-[9px] font-medium uppercase" style={{ color: 'var(--ios-tertiary)' }}>{d.label}</span>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.checked ? '#30D158' : 'transparent' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── SESSIONS PER WEEK — 12 tuần ── */}
            <motion.div variants={fadeUp} className="mb-5 gym-section">
                <p className="gym-section__title">Tần Suất Tập · 12 Tuần Gần Nhất</p>
                <div className="gym-card p-4">
                    <div className="flex items-end gap-1.5 h-20">
                        {weeklyBars.map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(4, (v / maxBar) * 64)}px` }}
                                    transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
                                    className="w-full rounded"
                                    style={{ background: i === 11 ? '#0A84FF' : 'rgba(10,132,255,0.35)' }}
                                />
                                {i === 11 && <span className="text-[9px]" style={{ color: 'var(--ios-tint)' }}>TN</span>}
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] mt-2" style={{ color: 'var(--ios-tertiary)' }}>
                        Tổng {history.length} lần check-in · Trung bình {(history.length / 12).toFixed(1)} buổi/tuần
                    </p>
                </div>
            </motion.div>

            {/* ── BODY STATS ── */}
            <motion.div variants={fadeUp} className="mb-5 gym-section">
                <p className="gym-section__title">Chỉ Số Cơ Thể</p>
                <div className="grid grid-cols-2 gap-2.5">
                    {bodyStats.map(s => (
                        <div key={s.label} className="gym-card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[12px] font-semibold" style={{ color: 'var(--ios-label)' }}>{s.label}</p>
                                <div className="flex items-center gap-1">
                                    {s.trend === 'down'
                                        ? <TrendDown size={12} color={s.color} weight="duotone" />
                                        : <TrendUp size={12} color={s.color} weight="duotone" />}
                                    <span className="text-[10px] font-medium" style={{ color: s.color }}>
                                        {Math.abs(s.value - s.prev).toFixed(1)}{s.unit}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[26px] font-bold leading-none">
                                {s.value}
                                <span className="text-[13px] font-normal ml-1" style={{ color: 'var(--ios-tertiary)' }}>{s.unit}</span>
                            </p>
                            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <motion.div className="h-full rounded-full" style={{ background: s.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(90, (s.value / (s.value * 1.25)) * 100)}%` }}
                                    transition={{ duration: 0.7 }} />
                            </div>
                            <p className="text-[10px] mt-1" style={{ color: 'var(--ios-tertiary)' }}>
                                Trước: {s.prev}{s.unit}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Chỉ số đã ghi (bodyMetrics) ── */}
            {metrics.length > 0 && (
                <motion.div variants={fadeUp} className="mb-5 gym-section">
                    <p className="gym-section__title">Chỉ số đã ghi</p>
                    <div className="gym-card p-4 space-y-2 max-h-48 overflow-y-auto">
                        {metrics.slice(0, 10).map((m, i) => (
                            <div key={i} className="flex justify-between items-center text-[13px] py-1.5" style={{ borderBottom: i < Math.min(10, metrics.length) - 1 ? '0.5px solid var(--ios-separator)' : 'none' }}>
                                <span style={{ color: 'var(--ios-secondary)' }}>{format(new Date(m.date), 'd/M/yyyy', { locale: vi })}</span>
                                <span className="font-medium" style={{ color: 'var(--ios-label)' }}>
                                    {[m.weight != null && `${m.weight} kg`, m.waist != null && `eo ${m.waist}`, m.hip != null && `mông ${m.hip}`].filter(Boolean).join(' · ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── Chỉ tiêu & mốc đạt được ── */}
            {goals && (goals.weightFrom != null || goals.weightTo != null || goals.waistFrom != null || goals.hipFrom != null) && (
                <motion.div variants={fadeUp} className="mb-5 gym-section">
                    <p className="gym-section__title">Chỉ tiêu gói tập</p>
                    <div className="gym-card p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Target size={18} color="#FF9F0A" weight="duotone" />
                            <span className="text-[14px] font-semibold" style={{ color: 'var(--ios-label)' }}>Mục tiêu</span>
                        </div>
                        <ul className="text-[13px] font-medium space-y-1" style={{ color: 'var(--ios-secondary)' }}>
                            {goals.weightFrom != null && goals.weightTo != null && <li>Cân nặng: {goals.weightFrom} → {goals.weightTo} kg</li>}
                            {goals.waistFrom != null && goals.waistTo != null && <li>Vòng eo: {goals.waistFrom} → {goals.waistTo} cm</li>}
                            {goals.hipFrom != null && goals.hipTo != null && <li>Vòng 3: {goals.hipFrom} → {goals.hipTo} cm</li>}
                            {goals.note && <li className="mt-1 italic">{goals.note}</li>}
                        </ul>
                        {achievedSummary && achievedSummary.length > 0 && (
                            <div className="mt-4 pt-3 flex items-start gap-2" style={{ borderTop: '0.5px solid var(--ios-separator)' }}>
                                <Trophy size={18} color="#30D158" weight="duotone" className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--ios-tertiary)' }}>Mốc đã đạt</p>
                                    {achievedSummary.map((line, i) => (
                                        <p key={i} className="text-[13px] font-semibold" style={{ color: 'var(--ios-label)' }}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
            {/* ── STRENGTH PROGRESSION ── */}
            <StrengthTrendCard logs={workoutLogs} />

            {/* ── LỊCH SỬ TẬP CHI TIẾT (Block 4: Gym Log) ── */}
            <motion.div variants={fadeUp} className="mb-5 gym-section">
                <p className="gym-section__title">Lịch Sử Tập Chi Tiết</p>
                <div className="space-y-3">
                    {workoutLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="gym-card p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-[15px] font-bold">{log.planName}</p>
                                    <p className="text-[11px] text-zinc-500">{format(new Date(log.date), 'EEEE, d/M', { locale: vi })}</p>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                                    <Clock size={12} weight="bold" className="text-blue-400" />
                                    <span className="text-[11px] font-bold text-blue-400">{log.durationMinutes}m</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {log.exercises.map((_, idx) => (
                                    <span key={idx} className="text-[10px] font-medium px-2 py-1 rounded bg-zinc-800 text-zinc-400">
                                        {log.exercises.length > 3 && idx >= 2 ? `+${log.exercises.length - 2} bài khác` : `Bài ${idx + 1}`}
                                    </span>
                                )).slice(0, 3)}
                            </div>
                        </div>
                    ))}
                    {workoutLogs.length === 0 && (
                        <div className="text-center py-6 text-zinc-500 text-[13px]">Chưa có lịch sử tập chi tiết</div>
                    )}
                </div>
            </motion.div>
            {/* ── DISCLAIMER ── */}
            <motion.div variants={fadeUp} className="mb-4 gym-alert bg-[rgba(10,132,255,0.08)]" style={{ border: '0.5px solid rgba(10,132,255,0.18)' }}>
                <Scales size={18} color="#0A84FF" weight="duotone" className="flex-shrink-0 mt-0.5" />
                <p className="text-[12px] flex-1 leading-relaxed" style={{ color: 'var(--ios-secondary)' }}>
                    Chỉ số cơ thể được ước tính dựa trên thông tin đăng ký. Để cập nhật, hãy đo thực tế với PT tại phòng gym.
                </p>
            </motion.div>
        </motion.div>
    );
}
