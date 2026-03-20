import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Footprints, Flame, Clock, MapPin, TrendUp, Trophy, Target, CaretRight, Sparkle, Wind, ChartLineUp, Timer } from '@phosphor-icons/react';
import { useStepStore } from '../store/useStepStore';
import { useHealthStore } from '../store/useHealthStore';
import { toast } from 'sonner';

// ============================================================
//  STEP COUNTER PAGE — Kinetic Node (Premium Redesign)
// ============================================================

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

export default function StepCounterPage() {
    const stepStore = useStepStore();
    const healthStore = useHealthStore();
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = stepStore.getStepsForDate(today);
    const todayHealth = healthStore.dailyStats[today];

    const steps = todayHealth?.steps || todayEntry.steps || 0;
    const goal = stepStore.stepGoal.dailySteps;
    const progress = Math.min(steps / goal, 1);
    const distance = todayEntry.distance || (steps * 0.0008);
    const calories = todayEntry.calories || Math.round(steps * 0.04);

    // Weekly data
    const weekData = Array.from({ length: 7 }, (_, i) => {
        const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
        const entry = stepStore.getStepsForDate(d);
        return { date: d, steps: entry.steps, day: format(subDays(new Date(), 6 - i), 'EEE', { locale: vi }) };
    });
    const maxWeek = Math.max(...weekData.map(d => d.steps), goal);

    // Goal editor
    const [editGoal, setEditGoal] = useState(false);
    const [newGoal, setNewGoal] = useState(goal.toString());

    const ringSize = 240;
    const strokeW = 12;
    const radius = (ringSize - strokeW) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="min-h-full pb-32 ios-animate-in">

            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#30D158]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Kinetic Energy Processor</span>
                </div>
                <h1 style={{ fontSize: 'clamp(24px, 8vw, 32px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }} className="superapp-text-gradient">
                    Bước Chân
                </h1>
                <p className="text-[13px] font-bold text-white/30 mt-2 italic uppercase tracking-widest">Giao thức chuyển động sinh học</p>
            </motion.div>

            {/* ── ACTIVITY RING ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="superapp-card-glass p-10 rounded-[45px] border border-white/5 relative overflow-hidden flex flex-col items-center glass-reflection floating-card-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full" />

                    <div className="relative flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
                        <svg width={ringSize} height={ringSize} className="-rotate-90 filter drop-shadow-[0_0_30px_rgba(48,209,88,0.2)]">
                            <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={4} />
                            <motion.circle
                                cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                fill="none" stroke="#30D158" strokeWidth={strokeW} strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Footprints size={28} weight="fill" className="text-green-500 mb-3 animate-float-gentle" />
                            <span className="text-5xl font-black italic tracking-tighter tabular-nums text-white leading-none">
                                {steps.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2 mt-3 p-1 px-3 rounded-full bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Mục tiêu {goal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-12 w-full">
                        <MetricPill icon={MapPin} value={distance.toFixed(1)} unit="KM" color="#0A84FF" />
                        <MetricPill icon={Flame} value={calories} unit="CAL" color="#FF9F0A" />
                        <MetricPill icon={Timer} value={todayEntry.activeMinutes} unit="MIN" color="#BF5AF2" />
                    </div>
                </div>
            </motion.div>

            {/* ── GOAL CONTROL ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="neural-island p-6 rounded-[35px] border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-inner">
                            <Target size={24} weight="fill" className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Mục tiêu ngày</p>
                            {!editGoal ? (
                                <p className="text-[20px] font-black italic tracking-tighter text-white">{goal.toLocaleString()} <span className="text-[10px] opacity-40 uppercase">Bước</span></p>
                            ) : (
                                <input
                                    type="number"
                                    autoFocus
                                    value={newGoal}
                                    onChange={e => setNewGoal(e.target.value)}
                                    className="bg-transparent border-b border-orange-500/50 text-[20px] font-black italic text-white outline-none w-24 tabular-nums"
                                />
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (editGoal) {
                                stepStore.setStepGoal({ dailySteps: parseInt(newGoal) || goal });
                                toast.success('Đã cấu hình lại mục tiêu Kinetic!');
                            }
                            setEditGoal(!editGoal);
                        }}
                        className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest italic transition-all ${editGoal ? 'bg-green-500 text-black shadow-[0_10px_20px_rgba(48,209,88,0.3)]' : 'bg-white/5 text-white/40'
                            }`}
                    >
                        {editGoal ? 'LƯU' : 'SỬA'}
                    </button>
                </div>
            </motion.div>

            {/* ── WEEKLY ANALYSIS ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between px-1 mb-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Phân tích tuần này</span>
                    <ChartLineUp size={18} className="text-white/20" />
                </div>
                <div className="superapp-card-glass p-8 rounded-[40px] border border-white/5 shadow-2xl">
                    <div className="flex items-end justify-between gap-3 h-40">
                        {weekData.map((d, i) => {
                            const h = maxWeek > 0 ? (d.steps / maxWeek) * 100 : 0;
                            const isToday = i === 6;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div className="relative w-full flex-1 flex flex-col justify-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(h, 6)}%` }}
                                            transition={{ duration: 1, delay: i * 0.05 }}
                                            className={`w-full rounded-2xl relative transition-all ${isToday ? 'bg-green-500 shadow-[0_0_20px_rgba(48,209,88,0.4)]' : d.steps >= goal ? 'bg-white/20' : 'bg-white/5'
                                                }`}
                                        >
                                            {isToday && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />}
                                        </motion.div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest italic ${isToday ? 'text-green-500' : 'text-white/20'}`}>
                                        {d.day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Chuỗi ngày: <span className="text-white/60">{stepStore.currentStreak} FIRE 🔥</span></span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Best: {stepStore.bestStreak}</span>
                    </div>
                </div>
            </motion.div>

            {/* ── ACHIEVEMENTS ── */}
            <motion.div variants={fadeUp} className="mb-10 px-1">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Huy hiệu thành tựu</span>
                    <span className="text-[11px] font-black italic color-orange-500">{stepStore.achievements.filter(a => a.unlockedAt).length}/{stepStore.achievements.length}</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    {stepStore.achievements.map(a => (
                        <div key={a.id} className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${a.unlockedAt ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/5 opacity-20'
                            }`}>
                            <span className="text-2xl mb-2">{a.icon}</span>
                            <span className="text-[7px] font-black uppercase tracking-[0.1em] text-center italic text-white/40">{a.title}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── TOTAL STATS ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                <div className="superapp-card-glass p-6 rounded-[35px] border border-white/5 relative overflow-hidden group active:scale-95 transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 blur-2xl" />
                    <TrendUp size={22} weight="fill" className="text-green-500 mb-4" />
                    <p className="text-[24px] font-black italic tracking-tighter tabular-nums">{stepStore.getTotalSteps().toLocaleString()}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-1 italic">Tổng bước chân</p>
                </div>
                <div className="superapp-card-glass p-6 rounded-[35px] border border-white/5 relative overflow-hidden group active:scale-95 transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 blur-2xl" />
                    <Trophy size={22} weight="fill" className="text-orange-500 mb-4" />
                    <p className="text-[24px] font-black italic tracking-tighter tabular-nums">{stepStore.bestStreak}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-1 italic">Chuỗi dài nhất</p>
                </div>
            </motion.div>

        </motion.div>
    );
}

function MetricPill({ icon: Icon, value, unit, color }: any) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 mb-1" style={{ background: `${color}10`, color }}>
                <Icon size={20} weight="fill" />
            </div>
            <div className="text-center">
                <p className="text-[15px] font-black italic tabular-nums text-white/80 leading-none">{value}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1 italic">{unit}</p>
            </div>
        </div>
    );
}
