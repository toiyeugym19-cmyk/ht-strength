import { Link } from 'react-router-dom';
import { useGymStore } from '../store/useGymStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Barbell, Calendar, CaretRight,
    Lightning, Clock, Plus,
    Flame, Target, BookOpenText,
    TrendUp
} from '@phosphor-icons/react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

const PLAN_TYPES = [
    { id: 'Rest', label: 'Nghỉ', color: '#8E8E93' },
    { id: 'Push', label: 'Đẩy', color: '#0A84FF' },
    { id: 'Pull', label: 'Kéo', color: '#FF9F0A' },
    { id: 'Legs', label: 'Chân', color: '#30D158' },
    { id: 'Upper', label: 'Trên', color: '#BF5AF2' },
    { id: 'Lower', label: 'Dưới', color: '#FF375F' },
    { id: 'Cardio', label: 'Cardio', color: '#FF453A' },
    { id: 'FullBody', label: 'Full', color: '#FFD60A' },
];

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } } as any;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } } as any;

function IOSStatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-4 rounded-[24px] flex flex-col justify-between min-h-[120px]"
        >
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={20} weight="fill" style={{ color }} />
            </div>
            <div>
                <p className="text-[28px] font-black text-white leading-none tracking-tighter tabular-nums">{value}</p>
                <div className="flex flex-col mt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white opacity-40">{label}</span>
                    <span className="text-[9px] font-bold text-white/20 mt-0.5">{sub}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function GymPage() {
    const { weeklyPlan, updateWeeklyPlan, logs, userProfile } = useGymStore();

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array(7).fill(null).map((_, i) => addDays(weekStart, i));

    const getPlanForDay = (dayIndex: number) => {
        const planId = weeklyPlan[dayIndex] || 'Rest';
        return PLAN_TYPES.find(p => p.id === planId) || PLAN_TYPES[0];
    };

    const handlePlanChange = (dayIndex: number) => {
        const currentPlanId = weeklyPlan[dayIndex] || 'Rest';
        const currentIndex = PLAN_TYPES.findIndex(p => p.id === currentPlanId);
        const nextIndex = (currentIndex + 1) % PLAN_TYPES.length;
        updateWeeklyPlan(dayIndex, PLAN_TYPES[nextIndex].id);
    };

    const autoFillPlan = () => {
        const pattern = ['Push', 'Pull', 'Rest', 'Legs', 'Upper', 'Lower', 'Rest'];
        pattern.forEach((p, i) => updateWeeklyPlan(i, p));
        toast.success("Build thành công: Lịch PPL Split!");
    };

    const totalVolume = logs.reduce((acc, l) => acc + (l.weight * l.reps), 0);
    const totalSessions = logs.length;
    const bestE1RM = logs.length > 0 ? Math.max(...logs.map(l => l.e1RM)) : 0;

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="ios-animate-in superapp-page pt-4 pb-20"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[32px] font-black tracking-tighter text-white">HT TRAINING</h1>
                        <p className="text-[13px] font-medium opacity-40">Cơ sở vật chất & Hiệu suất tập luyện</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E8613A]/10 border border-[#E8613A]/20">
                        <Barbell size={28} weight="fill" className="text-[#E8613A]" />
                    </div>
                </div>
            </motion.div>

            {/* ── PERFORMANCE HUB ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-6">
                <IOSStatCard
                    label="Volume"
                    value={totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : `${totalVolume}`}
                    sub="KG tải trọng" icon={TrendUp} color="#30D158"
                />
                <IOSStatCard
                    label="Sức mạnh"
                    value={bestE1RM > 0 ? `${Math.round(bestE1RM)}` : '—'}
                    sub="Kỷ lục 1RM" icon={Target} color="#0A84FF"
                />
            </motion.div>

            {/* ── USER LEVEL ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <div className="superapp-card-glass p-5 rounded-[28px] flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#BF5AF2] opacity-5 blur-[40px]" />
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#BF5AF2]/10 border border-[#BF5AF2]/20">
                        <Barbell size={28} weight="fill" className="text-[#BF5AF2]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#BF5AF2]">Elite Athlete Level</p>
                        <h3 className="text-[18px] font-black text-white tracking-tight mt-0.5">{userProfile.trainingClass}</h3>
                    </div>
                    <CaretRight size={20} className="text-white/20" />
                </div>
            </motion.div>

            {/* ── WEEKLY PLANNER ── */}
            <motion.div variants={fadeUp} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[15px] font-black uppercase tracking-widest opacity-40">Lịch tập tuần này</h2>
                    <button onClick={autoFillPlan} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 active:scale-95 transition-transform">
                        <Lightning size={14} weight="fill" className="text-[#FFD60A]" />
                        <span className="text-[11px] font-black text-white/60">TỰ ĐỘNG</span>
                    </button>
                </div>

                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                    {weekDays.map((date, i) => {
                        const isToday = isSameDay(date, new Date());
                        const plan = getPlanForDay(i);
                        const dayName = format(date, 'EEE', { locale: vi });

                        return (
                            <motion.div
                                key={i}
                                whileTap={{ scale: 0.94 }}
                                onClick={() => handlePlanChange(i)}
                                className={`flex-shrink-0 w-[72px] p-3 rounded-[24px] flex flex-col items-center gap-3 transition-all ${isToday ? 'bg-[#E8613A]' : 'superapp-card-glass border-transparent'
                                    }`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-white/70' : 'text-white/30'}`}>
                                    {dayName}
                                </span>
                                <span className={`text-[20px] font-black ${isToday ? 'text-white' : 'text-white/80'}`}>
                                    {format(date, 'd')}
                                </span>
                                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${isToday ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/40'
                                    }`} style={{ color: isToday ? 'white' : plan.color }}>
                                    {plan.label}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── ACTION ── */}
            <motion.div variants={fadeUp} className="mb-8">
                <button className="w-full py-4 rounded-[22px] bg-[#0A84FF] text-white shadow-[0_12px_24px_rgba(10,132,255,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform group">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={20} weight="bold" />
                    </div>
                    <span className="text-[17px] font-black tracking-tight">Ghi nhật ký bài tập mới</span>
                </button>
            </motion.div>

            {/* ── RECENT LOGS ── */}
            <motion.div variants={fadeUp}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[15px] font-black uppercase tracking-widest opacity-40">Nhật ký cường độ</h2>
                    <Link to="/exercises" className="text-[11px] font-black text-[#E8613A]">XEM THƯ VIỆN</Link>
                </div>

                <div className="space-y-3">
                    {logs.length === 0 ? (
                        <div className="superapp-card-glass p-8 rounded-[32px] text-center">
                            <Barbell size={48} className="mx-auto text-white/10 mb-4" />
                            <p className="text-[15px] font-bold text-white/40">Chưa có dữ liệu bài tập</p>
                            <p className="text-[12px] text-white/20 mt-1">Bắt đầu tập luyện để ghi lại tiến độ!</p>
                        </div>
                    ) : (
                        logs.slice().reverse().slice(0, 5).map((log) => (
                            <motion.div
                                key={log.id}
                                className="superapp-card-glass p-4 rounded-[24px] flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-[18px] bg-white/5 border border-white/5 flex items-center justify-center text-[20px] font-black text-white/20">
                                    {log.exerciseName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[16px] font-black text-white tracking-tight truncate">{log.exerciseName}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-white/30">
                                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {log.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {log.reps} reps</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[18px] font-black text-white">{log.weight}<span className="text-[11px] opacity-30 ml-0.5">KG</span></p>
                                    <p className="text-[10px] font-black text-[#30D158] mt-0.5">1RM: {Math.round(log.e1RM)}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
