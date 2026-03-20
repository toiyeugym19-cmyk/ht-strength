import { useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Scales, TrendUp, TrendDown, ChartLineUp, Flame, Target, Trophy, Clock, Brain, CaretRight } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { calcStreak, calcAttendanceRate } from '../utils/gymUtils';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

function genBodyStats(memberId: string, weight?: number, height?: number) {
    const seed = memberId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const base = (seed % 20) / 10;
    const w = weight || 65 + base * 5;
    const bmi = height ? +(w / ((height / 100) ** 2)).toFixed(1) : +(21 + base).toFixed(1);
    const fat = +(12 + base * 2).toFixed(1);
    const muscle = +(32 + base * 1.5).toFixed(1);

    return [
        { label: 'Cân nặng', value: w, prev: +(w + 0.9).toFixed(1), unit: 'kg', color: '#0A84FF', trend: 'down' as const },
        { label: 'Mỡ cơ thể', value: fat, prev: +(fat + 0.7).toFixed(1), unit: '%', color: '#FF375F', trend: 'down' as const },
        { label: 'Khối cơ', value: muscle, prev: +(muscle - 0.6).toFixed(1), unit: 'kg', color: '#30D158', trend: 'up' as const },
        { label: 'BMI', value: bmi, prev: +(bmi + 0.3).toFixed(1), unit: '', color: '#FF9F0A', trend: 'down' as const },
    ];
}

function StrengthTrendCard({ logs }: { logs: any[] }) {
    const chartData = useMemo(() => {
        return logs.slice().reverse().map(log => ({
            date: format(new Date(log.date), 'd/M'),
            weight: Math.max(...(log.exercises?.[0]?.sets?.map((s: any) => s.weight) || [0]), 0)
        })).filter(d => d.weight > 0);
    }, [logs]);

    if (chartData.length < 2) return null;

    return (
        <motion.div variants={fadeUp} className="mb-10">
            <div className="flex items-center justify-between mb-6 px-1">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Biểu đồ sức mạnh</span>
                <TrendUp size={20} color="#BF5AF2" />
            </div>
            <div className="superapp-card-glass p-8 rounded-[45px] floating-card-shadow glass-reflection overflow-hidden">
                <div className="h-[220px] w-full mt-2 -ml-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                                dy={15}
                            />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1C1C1Ecc', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }}
                                itemStyle={{ color: '#BF5AF2', fontWeight: '900', fontSize: '14px', fontStyle: 'italic' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#BF5AF2"
                                strokeWidth={4}
                                fill="url(#purpleGradient)"
                                dot={{ r: 5, fill: '#BF5AF2', strokeWidth: 0 }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}

export default function MemberProgressPage() {
    const { user } = useAuth();
    const { members } = useMemberStore();
    const { logs: workoutLogs } = useWorkoutStore();

    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const history = member?.checkInHistory || [];
    const streak = calcStreak(history);
    const rate7 = calcAttendanceRate(history, 7);
    const rate30 = calcAttendanceRate(history, 30);

    const joinDate = member ? format(new Date(member.joinDate), 'd MMM yyyy', { locale: vi }) : '--';

    const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
            label: format(d, 'EEE', { locale: vi }),
            dayNum: format(d, 'd'),
            checked: history.some(h => isSameDay(new Date(h.date), d)),
            isToday: i === 6,
        };
    }), [history]);

    const weeklyBars = useMemo(() => {
        const weeks: number[] = Array(12).fill(0);
        history.forEach(h => {
            const daysAgo = Math.floor((Date.now() - new Date(h.date).getTime()) / 86_400_000);
            const weekIdx = 11 - Math.floor(daysAgo / 7);
            if (weekIdx >= 0 && weekIdx < 12) weeks[weekIdx]++;
        });
        return weeks;
    }, [history]);

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

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="ios-animate-in min-h-full pb-32">

            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#0A84FF]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Bio-Analysis Node</span>
                </div>
                <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                    Chỉ Số & Tiến Hóa
                </h1>
                <p className="text-[13px] font-bold text-white/30 mt-2 italic uppercase tracking-widest">Danh tính neural từ {joinDate}</p>
            </motion.div>

            {/* ── QUICK STATS ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Flame, value: streak, label: 'STREAK', unit: 'days', color: '#FF453A' },
                        { icon: ChartLineUp, value: rate7, label: 'ENERGY', unit: '% (7d)', color: '#30D158' },
                        { icon: Brain, value: rate30, label: 'MINDSET', unit: '% (30d)', color: '#0A84FF' },
                    ].map(s => (
                        <div key={s.label} className="neural-island p-5 flex flex-col items-center gap-3 border border-white/5 rounded-[32px] group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                            <s.icon size={24} weight="fill" color={s.color} className="animate-float-gentle" />
                            <div className="text-center">
                                <p className="text-[26px] font-black leading-none italic tracking-tighter">{s.value}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mt-1 italic">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── BODY STATS GRID ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Thành phần cơ thể</span>
                    <CaretRight size={16} className="text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {bodyStats.map(s => (
                        <div key={s.label} className="superapp-card-glass p-6 rounded-[35px] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <ChartLineUp size={80} weight="fill" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">{s.label}</p>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5">
                                    {s.trend === 'down' ? <TrendDown size={10} color={s.color} /> : <TrendUp size={10} color={s.color} />}
                                    <span className="text-[9px] font-black" style={{ color: s.color }}>
                                        {Math.abs(s.value - s.prev).toFixed(1)}{s.unit}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[28px] font-black tabular-nums tracking-tighter italic">{s.value}</span>
                                <span className="text-[12px] font-black text-white/20 uppercase italic">{s.unit}</span>
                            </div>
                            <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(95, (s.value / (s.value * 1.3)) * 100)}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full rounded-full"
                                    style={{ background: s.color, boxShadow: `0 0 10px ${s.color}40` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── CHECK-IN GRID ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Check-in 7 ngày</span>
                    <Clock size={16} className="text-white/20" />
                </div>
                <div className="superapp-card-glass p-8 rounded-[45px] floating-card-shadow glass-reflection">
                    <div className="flex items-end justify-between gap-2">
                        {last7.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                                <div
                                    className={`w-12 h-12 rounded-[22px] flex items-center justify-center transition-all ${d.isToday
                                        ? 'bg-[#0A84FF] shadow-[0_8px_20px_rgba(10,132,255,0.4)]'
                                        : d.checked
                                            ? 'bg-white/10 border border-[#30D158]/30'
                                            : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <span className={`text-[13px] font-black ${d.isToday ? 'text-white' : d.checked ? 'text-[#30D158]' : 'text-white/20'}`}>
                                        {d.dayNum}
                                    </span>
                                </div>
                                <span className="text-[9px] font-black uppercase text-white/20 italic tracking-widest">{d.label}</span>
                                {d.checked && <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] shadow-[0_0_8px_#30D158]" />}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── STRENGTH PROGRESSION ── */}
            <StrengthTrendCard logs={workoutLogs} />

            {/* ── GOALS & TARGETS ── */}
            {goals && (
                <motion.div variants={fadeUp} className="mb-10">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Mục tiêu chiến lược</span>
                        <Target size={18} color="#FF9F0A" />
                    </div>
                    <div className="neural-island p-8 rounded-[45px] border border-white/5 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full" />
                        <ul className="space-y-4 relative z-10">
                            {goals.weightFrom != null && goals.weightTo != null && (
                                <li className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                                        <Scales size={20} className="text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-0.5">Cân nặng mục tiêu</p>
                                        <p className="text-[16px] font-black text-white/90 italic">{goals.weightFrom} → {goals.weightTo} kg</p>
                                    </div>
                                </li>
                            )}
                            {goals.waistFrom != null && goals.waistTo != null && (
                                <li className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                                        <Target size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-0.5">Vòng eo tối ưu</p>
                                        <p className="text-[16px] font-black text-white/90 italic">{goals.waistFrom} → {goals.waistTo} cm</p>
                                    </div>
                                </li>
                            )}
                        </ul>
                        {achievedSummary && achievedSummary.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#30D158]/20 flex items-center justify-center shrink-0 border border-[#30D158]/20">
                                    <Trophy size={20} className="text-[#30D158]" weight="fill" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#30D158] uppercase tracking-[0.2em] mb-1.5 italic">Cột mốc đã chinh phục</p>
                                    <div className="space-y-1">
                                        {achievedSummary.map((line, i) => (
                                            <p key={i} className="text-[14px] font-bold text-white/80 italic">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ── GYM LOG HISTORY ── */}
            <motion.div variants={fadeUp} className="mb-14">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Lịch sử neural log</span>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{workoutLogs.length} LOGS</span>
                </div>
                <div className="space-y-4">
                    {workoutLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="superapp-card-glass p-6 rounded-[35px] border border-white/5 group active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-[18px] font-black italic uppercase tracking-tighter text-white/90">{log.planName}</h3>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">{format(new Date(log.date), 'EEEE, d/M', { locale: vi })}</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/20">
                                    <Clock size={14} weight="bold" className="text-[#0A84FF]" />
                                    <span className="text-[11px] font-black text-[#0A84FF] italic">{log.durationMinutes}m</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {log.exercises.slice(0, 3).map((_, idx) => (
                                    <span key={idx} className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-white/5 text-white/40 uppercase tracking-widest">
                                        PHASE 0{idx + 1}
                                    </span>
                                ))}
                                {log.exercises.length > 3 && (
                                    <span className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-white/5 text-white/20 uppercase tracking-widest">
                                        +{log.exercises.length - 3} MORE
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── DISCLAIMER ── */}
            <motion.div variants={fadeUp} className="mb-14 p-6 neural-island rounded-[35px] flex items-start gap-4 border border-white/5">
                <Scales size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[12px] font-medium leading-relaxed text-white/40 italic">
                    Các chỉ số sinh học được mô phỏng dựa trên dữ liệu đăng ký. Để có kết quả chuẩn xác 100%, vui lòng thực hiện đo InBody tại trạm điều khiển của PT.
                </p>
            </motion.div>
        </motion.div>
    );
}
