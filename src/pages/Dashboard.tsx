import { useState, useEffect } from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { useCalorieStore } from '../store/useCalorieStore';
import { useStepStore } from '../store/useStepStore';
import { useBoardStore } from '../store/useBoardStore';
import { useGymStore } from '../store/useGymStore';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Heart, Moon, Droplets, Footprints,
    ChevronRight, Plus, Dumbbell, Target,
    Wind, Timer, RefreshCw, Scale
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================
//  ACTIVITY RING SVG COMPONENT
// ============================================================
function ActivityRing({ progress, size = 160, strokeWidth = 10, color, bgColor, children }: {
    progress: number; size?: number; strokeWidth?: number;
    color: string; bgColor: string; children?: React.ReactNode;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(progress, 1) * circumference);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="activity-ring">
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth={strokeWidth}
                    strokeLinecap="round" strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
}

// ============================================================
//  TRIPLE RING (Steps + Calo + Active)
// ============================================================
function TripleRing({ steps, stepsGoal, calo, caloGoal, activeMin, activeGoal }: {
    steps: number; stepsGoal: number; calo: number; caloGoal: number;
    activeMin: number; activeGoal: number;
}) {
    return (
        <div className="relative" style={{ width: 180, height: 180 }}>
            {/* Outer: Steps (Green) */}
            <div className="absolute inset-0">
                <ActivityRing progress={steps / stepsGoal} size={180} strokeWidth={12}
                    color="#30D158" bgColor="rgba(48,209,88,0.12)" />
            </div>
            {/* Middle: Calories (Orange) */}
            <div className="absolute" style={{ top: 16, left: 16 }}>
                <ActivityRing progress={calo / caloGoal} size={148} strokeWidth={12}
                    color="#FF9F0A" bgColor="rgba(255,159,10,0.12)" />
            </div>
            {/* Inner: Active Minutes (Pink) */}
            <div className="absolute" style={{ top: 32, left: 32 }}>
                <ActivityRing progress={activeMin / activeGoal} size={116} strokeWidth={12}
                    color="#FF6482" bgColor="rgba(255,100,130,0.12)" />
            </div>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Footprints size={18} className="text-[#30D158] mb-1" />
                <span className="text-2xl font-bold text-white">{steps.toLocaleString()}</span>
                <span className="text-[10px] text-[#A0A0AB]">/ {stepsGoal.toLocaleString()}</span>
            </div>
        </div>
    );
}

// ============================================================
//  HEALTH METRIC CARD
// ============================================================
function MetricCard({ icon: Icon, label, value, unit, color, dimColor, onClick, subtext }: {
    icon: any; label: string; value: string | number; unit: string;
    color: string; dimColor: string; onClick?: () => void; subtext?: string;
}) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className="p-4 rounded-2xl cursor-pointer"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: dimColor }}>
                    <Icon size={16} style={{ color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color }}>{value}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{unit}</span>
            </div>
            {subtext && <span className="text-[10px] mt-1 block" style={{ color: 'var(--text-hint)' }}>{subtext}</span>}
        </motion.div>
    );
}

// ============================================================
//  MINI PROGRESS BAR
// ============================================================
function MiniProgress({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="w-full h-1.5 rounded-full mt-2" style={{ background: 'var(--bg-card-alt)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

// ============================================================
//  DASHBOARD (MIBRO FIT STYLE)
// ============================================================
export default function Dashboard() {
    const healthStore = useHealthStore();
    const calorieStore = useCalorieStore();
    const stepStore = useStepStore();
    const boardStore = useBoardStore();
    const gymStore = useGymStore();

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayHealth = healthStore.dailyStats[today] || {
        steps: 0, heartRateAvg: 0, sleepHours: 0, caloriesBurned: 0,
        weight: 0, bodyFat: 0, oxygenSaturation: 0, restingHeartRate: 0,
        activeMinutes: 0, waterMl: 0, bloodPressureSystolic: 0, bloodPressureDiastolic: 0
    };

    // Merge steps from stepStore if health store is empty
    const totalSteps = todayHealth.steps || stepStore.getStepsForDate(today).steps || 0;
    const totalCalories = todayHealth.caloriesBurned || calorieStore.getDayTotals(today)?.calories || 0;
    const activeMin = todayHealth.activeMinutes || 0;

    // Goals
    const stepsGoal = 8000;
    const caloGoal = 500;
    const activeGoal = 30;
    const waterGoal = 2000;
    const sleepGoal = 8;

    // Water tracking state (local, simple)
    const [waterMl, setWaterMl] = useState(todayHealth.waterMl || 0);
    const addWater = (ml: number) => {
        const newVal = waterMl + ml;
        setWaterMl(newVal);
        healthStore.updateStat(today, { waterMl: newVal });
        toast.success(`+${ml}ml nước 💧`);
    };

    // Manual input states
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualSteps, setManualSteps] = useState('');
    const [manualWeight, setManualWeight] = useState('');
    const [manualHR, setManualHR] = useState('');

    const saveManualData = () => {
        const updates: any = {};
        if (manualSteps) updates.steps = (todayHealth.steps || 0) + parseInt(manualSteps);
        if (manualWeight) updates.weight = parseFloat(manualWeight);
        if (manualHR) updates.heartRateAvg = parseInt(manualHR);
        if (Object.keys(updates).length > 0) {
            healthStore.updateStat(today, updates);
            toast.success('Đã cập nhật dữ liệu sức khoẻ!');
            setShowManualInput(false);
            setManualSteps(''); setManualWeight(''); setManualHR('');
        }
    };

    // Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
    const greetEmoji = hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙';

    // Pending tasks
    const pendingTasks = Object.values(boardStore.tasks || {}).filter((t: any) => !t.completed).length;

    // Today's workout
    const dayIndex = new Date().getDay();
    const todayPlan = gymStore.weeklyPlan?.[dayIndex === 0 ? 6 : dayIndex - 1];

    // Syncing
    const handleSync = async () => {
        try {
            await healthStore.syncWithDevice();
            toast.success('Đồng bộ thành công!');
        } catch {
            toast.error('Lỗi đồng bộ');
        }
    };

    // Timer state
    const [timerSec, setTimerSec] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerGoal, setTimerGoal] = useState(90);

    useEffect(() => {
        if (!timerRunning) return;
        const id = setInterval(() => setTimerSec(s => {
            if (s <= 0) { setTimerRunning(false); toast('⏰ Hết giờ nghỉ!'); return 0; }
            return s - 1;
        }), 1000);
        return () => clearInterval(id);
    }, [timerRunning]);

    const formatTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ background: 'var(--bg-app)' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 pt-6 space-y-5">

                {/* ── HEADER ── */}
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{greeting} {greetEmoji}</p>
                        <h1 className="text-2xl font-bold mt-0.5">HT Strength</h1>
                    </div>
                    <div className="flex gap-2">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={handleSync}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <RefreshCw size={16} className={healthStore.isSyncing ? 'animate-spin' : ''} style={{ color: 'var(--text-secondary)' }} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowManualInput(!showManualInput)}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--primary-dim)', border: '1px solid rgba(48,209,88,0.2)' }}>
                            <Plus size={16} style={{ color: '#30D158' }} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── MANUAL INPUT PANEL ── */}
                {showManualInput && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="rounded-2xl p-4 space-y-3"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <p className="text-sm font-semibold">📝 Nhập dữ liệu sức khoẻ</p>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>Bước chân</label>
                                <input type="number" value={manualSteps} onChange={e => setManualSteps(e.target.value)}
                                    placeholder="0" className="input-clean text-center !py-2 !text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>Cân nặng (kg)</label>
                                <input type="number" value={manualWeight} onChange={e => setManualWeight(e.target.value)}
                                    placeholder="0" className="input-clean text-center !py-2 !text-sm" step="0.1" />
                            </div>
                            <div>
                                <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>Nhịp tim</label>
                                <input type="number" value={manualHR} onChange={e => setManualHR(e.target.value)}
                                    placeholder="0" className="input-clean text-center !py-2 !text-sm" />
                            </div>
                        </div>
                        <button onClick={saveManualData} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                            style={{ background: 'var(--primary)' }}>
                            Lưu dữ liệu
                        </button>
                    </motion.div>
                )}

                {/* ── ACTIVITY RINGS ── */}
                <motion.div variants={fadeUp} className="rounded-3xl p-6 flex items-center gap-6"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <TripleRing steps={totalSteps} stepsGoal={stepsGoal}
                        calo={totalCalories} caloGoal={caloGoal}
                        activeMin={activeMin} activeGoal={activeGoal} />
                    <div className="flex-1 space-y-3">
                        <RingStat color="#30D158" label="Bước chân"
                            value={totalSteps.toLocaleString()} goal={`/${stepsGoal.toLocaleString()}`} />
                        <RingStat color="#FF9F0A" label="Calo đốt"
                            value={`${totalCalories}`} goal={`/${caloGoal} kcal`} />
                        <RingStat color="#FF6482" label="Hoạt động"
                            value={`${activeMin}`} goal={`/${activeGoal} phút`} />
                    </div>
                </motion.div>

                {/* ── HEALTH METRICS GRID ── */}
                <motion.div variants={fadeUp}>
                    <SectionTitle title="Chỉ số sức khoẻ" />
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <MetricCard icon={Heart} label="Nhịp tim" value={todayHealth.heartRateAvg || '--'}
                            unit="BPM" color="#FF375F" dimColor="rgba(255,55,95,0.15)"
                            subtext={todayHealth.restingHeartRate ? `Nghỉ: ${todayHealth.restingHeartRate} BPM` : undefined} />
                        <MetricCard icon={Moon} label="Giấc ngủ" value={todayHealth.sleepHours || '--'}
                            unit="giờ" color="#BF5AF2" dimColor="rgba(191,90,242,0.15)"
                            subtext={todayHealth.sleepHours ? `Mục tiêu: ${sleepGoal}h` : undefined} />
                        <MetricCard icon={Wind} label="SpO₂" value={todayHealth.oxygenSaturation || '--'}
                            unit="%" color="#64D2FF" dimColor="rgba(100,210,255,0.15)" />
                        <MetricCard icon={Scale} label="Cân nặng" value={todayHealth.weight || '--'}
                            unit="kg" color="#AC8E68" dimColor="rgba(172,142,104,0.15)"
                            subtext={todayHealth.bodyFat ? `Mỡ: ${todayHealth.bodyFat}%` : undefined} />
                    </div>
                </motion.div>

                {/* ── WATER TRACKER ── */}
                <motion.div variants={fadeUp} className="rounded-2xl p-4"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.15)' }}>
                                <Droplets size={16} className="text-[#0A84FF]" />
                            </div>
                            <span className="text-sm font-medium">Lượng nước</span>
                        </div>
                        <span className="text-lg font-bold text-[#0A84FF]">{waterMl} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/ {waterGoal}ml</span></span>
                    </div>
                    <MiniProgress value={waterMl} max={waterGoal} color="#0A84FF" />
                    <div className="flex gap-2 mt-3">
                        {[150, 200, 250, 500].map(ml => (
                            <motion.button key={ml} whileTap={{ scale: 0.9 }}
                                onClick={() => addWater(ml)}
                                className="flex-1 py-2 rounded-xl text-xs font-semibold"
                                style={{ background: 'rgba(10,132,255,0.1)', color: '#0A84FF' }}>
                                +{ml}ml
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* ── REST TIMER ── */}
                <motion.div variants={fadeUp} className="rounded-2xl p-4"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,159,10,0.15)' }}>
                            <Timer size={16} className="text-[#FF9F0A]" />
                        </div>
                        <span className="text-sm font-medium">Đồng hồ nghỉ</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {[60, 90, 120, 180].map(s => (
                                <button key={s} onClick={() => { setTimerGoal(s); setTimerSec(s); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${timerGoal === s ? 'text-white' : ''}`}
                                    style={{
                                        background: timerGoal === s ? '#FF9F0A' : 'var(--bg-card-alt)',
                                        color: timerGoal === s ? 'white' : 'var(--text-secondary)'
                                    }}>
                                    {s}s
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold font-mono" style={{ color: timerRunning ? '#FF9F0A' : 'var(--text-main)' }}>
                                {formatTimer(timerSec || timerGoal)}
                            </span>
                            <motion.button whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    if (!timerRunning && timerSec === 0) setTimerSec(timerGoal);
                                    setTimerRunning(!timerRunning);
                                }}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                style={{ background: timerRunning ? '#FF375F' : '#30D158' }}>
                                {timerRunning ? '⏸' : '▶'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* ── TODAY'S WORKOUT ── */}
                <motion.div variants={fadeUp}>
                    <SectionTitle title="Lịch tập hôm nay" link="/gym" />
                    <Link to="/gym" className="block mt-3 rounded-2xl p-4"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.15)' }}>
                                <Dumbbell size={22} className="text-[#30D158]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{todayPlan || 'Nghỉ ngơi'}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {todayPlan ? 'Bấm để xem chi tiết' : 'Hôm nay là ngày nghỉ'}
                                </p>
                            </div>
                            <ChevronRight size={18} style={{ color: 'var(--text-hint)' }} />
                        </div>
                    </Link>
                </motion.div>

                {/* ── PENDING TASKS ── */}
                <motion.div variants={fadeUp}>
                    <SectionTitle title="Việc cần làm" link="/work" />
                    <Link to="/work" className="block mt-3 rounded-2xl p-4"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.15)' }}>
                                <Target size={22} className="text-[#0A84FF]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{pendingTasks} việc chưa xong</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Bấm để quản lý</p>
                            </div>
                            <ChevronRight size={18} style={{ color: 'var(--text-hint)' }} />
                        </div>
                    </Link>
                </motion.div>

                {/* ── QUICK LINKS ── */}
                <motion.div variants={fadeUp}>
                    <SectionTitle title="Truy cập nhanh" />
                    <div className="grid grid-cols-4 gap-3 mt-3">
                        <QuickLink to="/calories" icon="🔥" label="Calories" color="rgba(255,159,10,0.15)" />
                        <QuickLink to="/nutrition" icon="🥗" label="Dinh dưỡng" color="rgba(48,209,88,0.15)" />
                        <QuickLink to="/journal" icon="📝" label="Nhật ký" color="rgba(191,90,242,0.15)" />
                        <QuickLink to="/steps" icon="👟" label="Bước chân" color="rgba(100,210,255,0.15)" />
                    </div>
                </motion.div>

                {/* ── LAST SYNC INFO ── */}
                {healthStore.lastSyncTime && (
                    <motion.div variants={fadeUp} className="text-center py-2">
                        <p className="text-[10px]" style={{ color: 'var(--text-hint)' }}>
                            Đồng bộ lần cuối: {format(new Date(healthStore.lastSyncTime), 'HH:mm dd/MM', { locale: vi })}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

// ============================================================
//  SUB-COMPONENTS
// ============================================================
function SectionTitle({ title, link }: { title: string; link?: string }) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">{title}</h2>
            {link && (
                <Link to={link} className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--primary)' }}>
                    Xem tất cả <ChevronRight size={14} />
                </Link>
            )}
        </div>
    );
}

function RingStat({ color, label, value, goal }: {
    color: string; label: string; value: string; goal: string;
}) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <div className="flex-1">
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-sm font-bold">
                    {value} <span className="text-[10px] font-normal" style={{ color: 'var(--text-hint)' }}>{goal}</span>
                </p>
            </div>
        </div>
    );
}

function QuickLink({ to, icon, label, color }: { to: string; icon: string; label: string; color: string }) {
    return (
        <Link to={to} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl active:scale-95 transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: color }}>
                {icon}
            </div>
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        </Link>
    );
}
