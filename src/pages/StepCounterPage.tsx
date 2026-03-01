import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Footprints, Flame, Clock, MapPin, TrendingUp, Trophy, Plus, Target } from 'lucide-react';
import { useStepStore } from '../store/useStepStore';
import { useHealthStore } from '../store/useHealthStore';
import { toast } from 'sonner';

// ============================================================
//  STEP COUNTER PAGE — Mibro Fit Dark Theme
// ============================================================
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

    // Manual input
    const [showInput, setShowInput] = useState(false);
    const [inputSteps, setInputSteps] = useState('');

    const handleAddSteps = () => {
        const val = parseInt(inputSteps);
        if (!val || val <= 0) return;
        const newTotal = steps + val;
        stepStore.updateSteps(today, newTotal);
        healthStore.updateStat(today, { steps: newTotal });
        toast.success(`+${val.toLocaleString()} bước chân! 🚶`);
        setInputSteps('');
        setShowInput(false);
    };

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

    // Achievements
    const unlockedCount = stepStore.achievements.filter(a => a.unlockedAt).length;

    const ringSize = 200;
    const strokeW = 14;
    const radius = (ringSize - strokeW) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ background: 'var(--bg-app)' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 pt-6 space-y-5">

                {/* Header */}
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Bước chân</h1>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowInput(!showInput)}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.2)' }}>
                        <Plus size={18} className="text-[#30D158]" />
                    </motion.button>
                </motion.div>

                {/* Manual Input */}
                {showInput && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <p className="text-sm font-semibold">Nhập bước chân thủ công</p>
                        <div className="flex gap-2">
                            <input type="number" value={inputSteps} onChange={e => setInputSteps(e.target.value)}
                                placeholder="VD: 5000" className="input-clean flex-1 !py-2.5" />
                            <button onClick={handleAddSteps} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                                style={{ background: '#30D158' }}>Thêm</button>
                        </div>
                    </motion.div>
                )}

                {/* Activity Ring */}
                <motion.div variants={fadeUp} className="rounded-3xl p-6 flex flex-col items-center"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="relative" style={{ width: ringSize, height: ringSize }}>
                        <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                fill="none" stroke="rgba(48,209,88,0.12)" strokeWidth={strokeW} />
                            <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                fill="none" stroke="#30D158" strokeWidth={strokeW} strokeLinecap="round"
                                strokeDasharray={circumference} strokeDashoffset={offset}
                                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Footprints size={20} className="text-[#30D158] mb-1" />
                            <span className="text-3xl font-bold">{steps.toLocaleString()}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {goal.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-5">
                        <StatPill icon={<MapPin size={14} />} value={`${distance.toFixed(1)} km`} color="#0A84FF" />
                        <StatPill icon={<Flame size={14} />} value={`${calories} kcal`} color="#FF9F0A" />
                        <StatPill icon={<Clock size={14} />} value={`${todayEntry.activeMinutes} phút`} color="#BF5AF2" />
                    </div>
                </motion.div>

                {/* Goal Edit */}
                <motion.div variants={fadeUp} className="rounded-2xl p-4 flex items-center justify-between"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,159,10,0.15)' }}>
                            <Target size={18} className="text-[#FF9F0A]" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Mục tiêu hàng ngày</p>
                            {!editGoal ? (
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{goal.toLocaleString()} bước</p>
                            ) : (
                                <input type="number" value={newGoal} onChange={e => setNewGoal(e.target.value)}
                                    className="input-clean !py-1 !px-2 !text-xs w-24 mt-1" />
                            )}
                        </div>
                    </div>
                    <button onClick={() => {
                        if (editGoal) {
                            stepStore.setStepGoal({ dailySteps: parseInt(newGoal) || goal });
                            toast.success('Đã cập nhật mục tiêu!');
                        }
                        setEditGoal(!editGoal);
                    }} className="px-4 py-2 rounded-xl text-xs font-semibold"
                        style={{ background: editGoal ? '#30D158' : 'var(--bg-card-alt)', color: editGoal ? 'white' : 'var(--text-secondary)' }}>
                        {editGoal ? 'Lưu' : 'Sửa'}
                    </button>
                </motion.div>

                {/* Weekly Chart */}
                <motion.div variants={fadeUp}>
                    <h2 className="text-base font-bold mb-3">Tuần này</h2>
                    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-end justify-between gap-2 h-32">
                            {weekData.map((d, i) => {
                                const h = maxWeek > 0 ? (d.steps / maxWeek) * 100 : 0;
                                const isToday = i === 6;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[9px] font-medium" style={{ color: 'var(--text-hint)' }}>
                                            {d.steps > 0 ? (d.steps / 1000).toFixed(1) + 'k' : ''}
                                        </span>
                                        <div className="w-full rounded-t-lg transition-all duration-500"
                                            style={{
                                                height: `${Math.max(h, 4)}%`,
                                                background: isToday ? '#30D158' : d.steps >= goal ? 'rgba(48,209,88,0.5)' : 'var(--bg-card-alt)',
                                                minHeight: 4
                                            }} />
                                        <span className="text-[10px] font-medium" style={{ color: isToday ? '#30D158' : 'var(--text-muted)' }}>
                                            {d.day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Goal line indicator */}
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <div className="w-2 h-2 rounded-full" style={{ background: '#30D158' }} />
                            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Đạt mục tiêu ({goal.toLocaleString()})</span>
                            <span className="ml-auto text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Streak: {stepStore.currentStreak} 🔥
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold">Thành tựu</h2>
                        <span className="text-xs font-medium" style={{ color: '#FF9F0A' }}>{unlockedCount}/{stepStore.achievements.length}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {stepStore.achievements.map(a => (
                            <div key={a.id} className="flex flex-col items-center p-2 rounded-xl"
                                style={{
                                    background: a.unlockedAt ? 'rgba(255,159,10,0.1)' : 'var(--bg-card)',
                                    border: `1px solid ${a.unlockedAt ? 'rgba(255,159,10,0.3)' : 'var(--border-color)'}`,
                                    opacity: a.unlockedAt ? 1 : 0.4
                                }}>
                                <span className="text-lg">{a.icon}</span>
                                <span className="text-[8px] mt-1 text-center font-medium" style={{ color: 'var(--text-muted)' }}>
                                    {a.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <TrendingUp size={16} className="text-[#30D158] mb-2" />
                        <p className="text-xl font-bold">{stepStore.getTotalSteps().toLocaleString()}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Tổng bước chân</p>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <Trophy size={16} className="text-[#FF9F0A] mb-2" />
                        <p className="text-xl font-bold">{stepStore.bestStreak}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Chuỗi kỷ lục</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

function StatPill({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${color}15` }}>
            <span style={{ color }}>{icon}</span>
            <span className="text-xs font-medium" style={{ color }}>{value}</span>
        </div>
    );
}
