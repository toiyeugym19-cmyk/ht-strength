import { useState, useEffect, useMemo } from 'react';
import { useGymStore } from '../store/useGymStore';
import { useHealthStore } from '../store/useHealthStore';
import { useMemberStore } from '../store/useMemberStore';
import { format, subDays, isSameDay, startOfWeek, addDays, getMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Flame, Timer, Target, Droplets, Moon,
    Dumbbell, Heart, TrendingUp, Clock, ChevronRight,
    SquareCheckBig, CalendarDays, Apple, BookOpenText, BookMarked,
    Star, Sparkles, Footprints, Brain, Trophy, UserCircle,
    BarChart3, Users
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { analyzePerformance } from '../utils/intelligence';
import { oneRepMax } from 'fitness-calculator';
import HealthBenchmarkWidget from '../components/HealthBenchmarkWidget';

// ============================================================
//  iOS 18 DASHBOARD - Native Design
// ============================================================

// Lời chào theo giờ
const getGreeting = (hour: number) => {
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 17) return 'Chào buổi chiều';
    if (hour < 21) return 'Chào buổi tối';
    return 'Chúc ngủ ngon';
};

export default function Dashboard() {
    const { logs, weeklyPlan } = useGymStore();
    const { dailyStats, syncWithDevice } = useHealthStore();
    const { members } = useMemberStore();


    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayStats = dailyStats[todayStr];
    const hour = currentTime.getHours();
    const greeting = getGreeting(hour);
    const performanceInsights = useMemo(() => analyzePerformance(todayStats, logs), [todayStats, logs]);

    // Streak calculation
    const streak = useMemo(() => {
        let count = 0;
        let d = new Date();
        while (logs.some(l => isSameDay(new Date(l.date), d))) {
            count++;
            d = subDays(d, 1);
        }
        return count;
    }, [logs]);

    // Weekly schedule
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => {
        const d = addDays(weekStart, i);
        return {
            date: d,
            label: format(d, 'EEE', { locale: vi }),
            dayNum: format(d, 'd'),
            isToday: isSameDay(d, new Date()),
            hasWorkout: logs.some(l => isSameDay(new Date(l.date), d)),
            plan: weeklyPlan[i] || 'Rest'
        };
    });

    // Member stats
    const memberStats = useMemo(() => {
        const currentMonth = getMonth(new Date());
        return {
            active: members.filter(m => m.status === 'Active').length,
            expiring: members.filter(m => m.expiryDate && new Date(m.expiryDate) < addDays(new Date(), 7)).length,
            newThisMonth: members.filter(m => getMonth(new Date(m.joinDate)) === currentMonth).length,
            total: members.length
        };
    }, [members]);

    const handleQuickSync = async () => {
        toast.promise(syncWithDevice(), {
            loading: 'Đang đồng bộ...',
            success: 'Đồng bộ thành công!',
            error: 'Lỗi kết nối'
        });
    };

    return (
        <div className="ios-animate-in space-y-5 pb-4">

            {/* ===== GREETING CARD ===== */}
            <div className="mx-4 mt-2">
                <div className="bg-gradient-to-br from-[var(--ios-tint)] to-[#FF8B5C] rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-white/80 text-sm font-medium">{greeting} 👋</p>
                        <h2 className="text-white text-2xl font-bold mt-1">{'Chiến binh'}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Clock size={14} className="text-white/70" />
                            <span className="text-white/70 text-xs">{format(currentTime, 'HH:mm • EEEE, dd/MM', { locale: vi })}</span>
                        </div>
                        {performanceInsights.advice && (
                            <p className="text-white/90 text-sm mt-3 bg-white/15 rounded-xl px-3 py-2">
                                💡 {performanceInsights.advice}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== QUICK STATS ===== */}
            <div className="mx-4">
                <div className="grid grid-cols-4 gap-3">
                    <QuickStat icon={Flame} value={streak} label="Chuỗi" color="#FF9500" />
                    <QuickStat icon={Target} value={`${((todayStats?.caloriesBurned || 0) / 100).toFixed(0)}`} label="Calo (x100)" color="#0A84FF" />
                    <QuickStat icon={Moon} value={todayStats?.sleepHours || '--'} label="Giấc ngủ" color="#BF5AF2" />
                    <QuickStat icon={Droplets} value={todayStats?.waterMl ? `${(todayStats.waterMl / 1000).toFixed(1)}` : '0'} label="Nước (L)" color="#64D2FF" />
                </div>
            </div>

            {/* ===== WEEKLY SCHEDULE ===== */}
            <div className="mx-4">
                <IOSSectionHeader title="Lịch tuần này" link="/calendar" />
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                        {weekDays.map((day, i) => {
                            const planLabels: Record<string, string> = {
                                'Rest': '', 'Push': 'Đẩy', 'Pull': 'Kéo', 'Legs': 'Chân',
                                'Upper': 'Trên', 'Lower': 'Dưới', 'Cardio': 'Tim', 'FullBody': 'All'
                            };
                            const planColors: Record<string, string> = {
                                'Push': '#0A84FF', 'Pull': '#FF9F0A', 'Legs': '#BF5AF2',
                                'Upper': '#30D158', 'Lower': '#FF375F', 'Cardio': '#FF453A', 'FullBody': '#64D2FF'
                            };
                            return (
                                <div key={i} className="flex flex-col items-center gap-1.5">
                                    <span className="text-[11px] font-medium text-[var(--ios-text-secondary)] capitalize">{day.label}</span>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${day.isToday
                                        ? 'bg-[var(--ios-tint)] text-white'
                                        : day.hasWorkout
                                            ? 'bg-[var(--ios-fill-tertiary)] text-white'
                                            : 'text-[var(--ios-text-secondary)]'
                                        }`}>
                                        {day.dayNum}
                                    </div>
                                    {day.plan !== 'Rest' && (
                                        <span className="text-[9px] font-semibold" style={{ color: planColors[day.plan] || '#8E8E93' }}>
                                            {planLabels[day.plan]}
                                        </span>
                                    )}
                                    {day.plan === 'Rest' && <span className="text-[9px] h-[13px]">&nbsp;</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ===== QUICK ACTIONS ===== */}
            <div className="mx-4">
                <IOSSectionHeader title="Hành động nhanh" />
                <div className={`grid gap-3 grid-cols-2`}>
                    <Link to="/gym" className="bg-[var(--ios-card-bg)] rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform">
                        <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/20 flex items-center justify-center">
                            <Dumbbell size={20} className="text-[var(--ios-tint)]" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-[15px]">Bắt đầu tập</p>
                            <p className="text-[var(--ios-text-secondary)] text-xs">Phòng Gym</p>
                        </div>
                    </Link>

                    <button onClick={() => setActiveTool('1rm')} className="bg-[var(--ios-card-bg)] rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/20 flex items-center justify-center">
                            <Target size={20} className="text-[#0A84FF]" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-[15px]">Tính 1RM</p>
                            <p className="text-[var(--ios-text-secondary)] text-xs">Công cụ</p>
                        </div>
                    </button>

                    <button onClick={() => setActiveTool('timer')} className="bg-[var(--ios-card-bg)] rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#30D158]/20 flex items-center justify-center">
                            <Timer size={20} className="text-[#30D158]" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-[15px]">Bấm giờ nghỉ</p>
                            <p className="text-[var(--ios-text-secondary)] text-xs">Công cụ</p>
                        </div>
                    </button>

                    <button onClick={handleQuickSync} className="bg-[var(--ios-card-bg)] rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#BF5AF2]/20 flex items-center justify-center">
                            <Heart size={20} className="text-[#BF5AF2]" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-[15px]">Đồng bộ</p>
                            <p className="text-[var(--ios-text-secondary)] text-xs">Sức khoẻ</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* ===== APP GRID — iOS Homescreen Style ===== */}
            <div className="mx-4">
                <IOSSectionHeader title="Ứng dụng" />

                {/* Row 1: Quản lý */}
                <div className="mb-3">
                    <p className="text-[11px] text-[var(--ios-text-tertiary)] font-medium mb-2 uppercase tracking-wide">Quản lý</p>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        <AppIcon to="/members" icon={Users} label="Hội Viên" color="#0A84FF" />
                        <AppIcon to="/work" icon={SquareCheckBig} label="Nhiệm Vụ" color="#FF3B30" />
                        <AppIcon to="/calendar" icon={CalendarDays} label="Lịch" color="#FF9500" />
                        <AppIcon to="/analytics" icon={BarChart3} label="Phân Tích" color="#BF5AF2" />
                    </div>
                </div>

                {/* Row 2: Sức khoẻ & Fitness */}
                <div className="mb-3">
                    <p className="text-[11px] text-[var(--ios-text-tertiary)] font-medium mb-2 uppercase tracking-wide">Sức khoẻ & Fitness</p>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        <AppIcon to="/nutrition" icon={Apple} label="Dinh Dưỡng" color="#30D158" />
                        <AppIcon to="/calories" icon={Flame} label="Calories" color="#FF6B00" />
                        <AppIcon to="/steps" icon={Footprints} label="Bước Chân" color="#EC4899" />
                        <AppIcon to="/meditation" icon={Brain} label="Thiền" color="#8B5CF6" />
                        <AppIcon to="/progress" icon={TrendingUp} label="Tiến Trình" color="#22C55E" />
                        <AppIcon to="/profile" icon={UserCircle} label="Hồ Sơ" color="#6366F1" />
                    </div>
                </div>

                {/* Row 3: Tiện ích */}
                <div className="mb-1">
                    <p className="text-[11px] text-[var(--ios-text-tertiary)] font-medium mb-2 uppercase tracking-wide">Tiện ích</p>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        <AppIcon to="/knowledge" icon={BookOpenText} label="Kiến Thức" color="#FF9F0A" />
                        <AppIcon to="/journal" icon={BookMarked} label="Nhật Ký" color="#BF5AF2" />
                        <AppIcon to="/review-hub" icon={Star} label="Review" color="#FFD60A" />
                        <AppIcon to="/social" icon={Trophy} label="Thưởng" color="#F59E0B" />
                        <AppIcon to="/ecosystem" icon={Sparkles} label="Hệ Sinh Thái" color="#64D2FF" />
                    </div>
                </div>
            </div>

            {/* ===== MEMBER + ANALYTICS ===== */}
            <div className={`mx-4 space-y-4`}>
                {/* MEMBER CARD */}
                <div>
                    <IOSSectionHeader title="Hội viên" link="/members" />
                    <Link to="/members" className="block">
                        <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4 active:scale-[0.98] transition-transform">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{memberStats.active}</p>
                                    <p className="text-[11px] text-[var(--ios-text-secondary)] mt-1">Hoạt động</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#30D158]">+{memberStats.newThisMonth}</p>
                                    <p className="text-[11px] text-[var(--ios-text-secondary)] mt-1">Mới tháng này</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#FF453A]">{memberStats.expiring}</p>
                                    <p className="text-[11px] text-[var(--ios-text-secondary)] mt-1">Sắp hết hạn</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ANALYTICS PREVIEW */}
                <div>
                    <IOSSectionHeader title="Phân tích" link="/analytics" />
                    <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#0A84FF]" />
                                <span className="text-sm font-medium text-white">Volume 7 buổi gần nhất</span>
                            </div>
                        </div>
                        <div className="h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { name: '1', vol: 12000 }, { name: '2', vol: 15000 },
                                    { name: '3', vol: 11000 }, { name: '4', vol: 18000 },
                                    { name: '5', vol: 21000 }, { name: '6', vol: 19000 },
                                    { name: '7', vol: 22000 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="vol" stroke="#0A84FF" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== HEALTH BENCHMARK ===== */}
            <div className="mx-0">
                <div className="mx-4">
                    <IOSSectionHeader title="Sức khỏe hôm nay" />
                </div>
                <HealthBenchmarkWidget />
            </div>

            {/* ===== NUTRITION + TASKS (side-by-side on iPad) ===== */}
            <div className={`mx-4 space-y-4`}>
                <div>
                    <IOSSectionHeader title="Dinh dưỡng" link="/nutrition" />
                    <NutritionCard />
                </div>
                <div>
                    <IOSSectionHeader title="Nhiệm vụ" link="/work" />
                    <TasksCard />
                </div>
            </div>

            {/* ===== TOOL MODALS ===== */}
            <IOSToolSheet title="Tính 1RM" isOpen={activeTool === '1rm'} onClose={() => setActiveTool(null)}>
                <OneRMTool />
            </IOSToolSheet>

            <IOSToolSheet title="Bấm giờ nghỉ" isOpen={activeTool === 'timer'} onClose={() => setActiveTool(null)}>
                <RestTimerTool />
            </IOSToolSheet>
        </div>
    );
}

// ============================================================
//  SUB-COMPONENTS
// ============================================================

function IOSSectionHeader({ title, link }: { title: string; link?: string }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase">{title}</h3>
            {link && (
                <Link to={link} className="text-[13px] font-medium text-[var(--ios-tint)] flex items-center gap-0.5">
                    Xem tất cả <ChevronRight size={14} />
                </Link>
            )}
        </div>
    );
}

function AppIcon({ to, icon: Icon, label, color }: { to: string; icon: any; label: string; color: string }) {
    return (
        <Link to={to} className="flex flex-col items-center gap-1.5 min-w-[64px] active:scale-90 transition-transform">
            <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shadow-lg"
                style={{ background: color }}>
                <Icon size={24} color="white" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-medium text-[var(--ios-text-secondary)] text-center leading-tight max-w-[64px] truncate">
                {label}
            </span>
        </Link>
    );
}

function QuickStat({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) {
    return (
        <div className="bg-[var(--ios-card-bg)] rounded-2xl p-3 text-center">
            <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-1.5" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
            </div>
            <p className="text-lg font-bold text-white tabular-nums">{value}</p>
            <p className="text-[10px] text-[var(--ios-text-secondary)] mt-0.5">{label}</p>
        </div>
    );
}

function NutritionCard() {
    const macros = [
        { name: 'Protein', value: 140, color: '#0A84FF', unit: 'g' },
        { name: 'Carbs', value: 200, color: '#FFD60A', unit: 'g' },
        { name: 'Fat', value: 60, color: '#FF453A', unit: 'g' },
    ];
    const totalCals = 1850;
    const goalCals = 2500;
    const pct = Math.round((totalCals / goalCals) * 100);

    return (
        <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4">
            <div className="flex items-center gap-4">
                {/* Ring */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--ios-fill-tertiary)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--ios-tint)" strokeWidth="3"
                            strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-white">{totalCals}</span>
                        <span className="text-[9px] text-[var(--ios-text-secondary)]">kcal</span>
                    </div>
                </div>

                {/* Macros */}
                <div className="flex-1 space-y-2.5">
                    {macros.map(m => (
                        <div key={m.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                                <span className="text-[13px] text-[var(--ios-text-secondary)]">{m.name}</span>
                            </div>
                            <span className="text-[13px] font-semibold text-white tabular-nums">{m.value}{m.unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TasksCard() {
    const tasks = [
        { id: 1, title: 'Hoàn thiện slide Q3', due: 'Hôm nay', urgent: true },
        { id: 2, title: 'Code Review layout mới', due: 'Ngày mai', urgent: false },
        { id: 3, title: 'Gửi email báo cáo', due: 'Thứ 6', urgent: false },
    ];
    return (
        <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
            {tasks.map((t, i) => (
                <div key={t.id} className={`flex items-center gap-3 p-4 ${i < tasks.length - 1 ? 'border-b border-[var(--ios-separator)]' : ''}`}>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${t.urgent ? 'bg-[#FF453A]' : 'bg-[var(--ios-fill-tertiary)]'}`} />
                    <span className="flex-1 text-[15px] text-white">{t.title}</span>
                    <span className="text-[13px] text-[var(--ios-text-secondary)]">{t.due}</span>
                    <ChevronRight size={16} className="text-[var(--ios-text-tertiary)]" />
                </div>
            ))}
        </div>
    );
}

// ============================================================
//  iOS TOOL SHEET (Bottom Sheet Modal)
// ============================================================
function IOSToolSheet({ title, isOpen, onClose, children }: { title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[300]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[301] bg-[var(--ios-sheet-bg)] rounded-t-[14px] overflow-hidden"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-2 pb-1">
                            <div className="w-9 h-[5px] rounded-full bg-[var(--ios-separator-opaque)]" />
                        </div>
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--ios-separator)] flex justify-between items-center">
                            <div className="w-[60px]" />
                            <h3 className="text-[17px] font-semibold text-white">{title}</h3>
                            <button onClick={onClose} className="text-[var(--ios-tint)] text-[17px] font-medium w-[60px] text-right">Xong</button>
                        </div>
                        {/* Content */}
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============================================================
//  1RM TOOL
// ============================================================
function OneRMTool() {
    const [w, setW] = useState('');
    const [r, setR] = useState('');
    let calculated1RM = 0;
    if (Number(w) > 0 && Number(r) > 0) {
        try { calculated1RM = oneRepMax(Number(w), Number(r)); } catch { calculated1RM = 0; }
    }
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[13px] text-[var(--ios-text-secondary)] mb-1.5 block">Trọng lượng (kg)</label>
                    <input type="number" value={w} onChange={e => setW(e.target.value)}
                        className="w-full bg-[var(--ios-fill-tertiary)] rounded-xl p-3.5 text-white text-[17px] outline-none border-none" placeholder="0" />
                </div>
                <div>
                    <label className="text-[13px] text-[var(--ios-text-secondary)] mb-1.5 block">Số reps</label>
                    <input type="number" value={r} onChange={e => setR(e.target.value)}
                        className="w-full bg-[var(--ios-fill-tertiary)] rounded-xl p-3.5 text-white text-[17px] outline-none border-none" placeholder="0" />
                </div>
            </div>
            <div className="bg-[var(--ios-tint)]/15 rounded-2xl p-5 text-center border border-[var(--ios-tint)]/20">
                <p className="text-[13px] text-[var(--ios-tint)] font-semibold mb-1">1RM ước tính</p>
                <p className="text-4xl font-bold text-white">{Math.round(calculated1RM)} <span className="text-lg text-[var(--ios-text-secondary)]">kg</span></p>
            </div>
        </div>
    );
}

// ============================================================
//  REST TIMER TOOL
// ============================================================
function RestTimerTool() {
    const [ms, setMs] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval: any;
        if (running) interval = setInterval(() => setMs(m => m + 1000), 1000);
        return () => clearInterval(interval);
    }, [running]);

    const formatTime = (timeMs: number) => {
        const secs = Math.floor(timeMs / 1000);
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const pct = Math.min(100, (ms / 180000) * 100); // 3 minutes = 100%

    return (
        <div className="text-center space-y-6">
            {/* Timer Ring */}
            <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ios-fill-tertiary)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ios-tint)" strokeWidth="6"
                        strokeDasharray={`${pct * 2.64} ${264 - pct * 2.64}`} strokeLinecap="round"
                        className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white tabular-nums">{formatTime(ms)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setRunning(!running)}
                    className={`py-4 rounded-2xl font-semibold text-[17px] transition-all ${running ? 'bg-[var(--ios-fill-tertiary)] text-white' : 'bg-[var(--ios-tint)] text-white'}`}
                >
                    {running ? 'Tạm dừng' : 'Bắt đầu'}
                </button>
                <button
                    onClick={() => { setRunning(false); setMs(0); }}
                    className="py-4 rounded-2xl bg-[var(--ios-fill-tertiary)] text-white font-semibold text-[17px]"
                >
                    Đặt lại
                </button>
            </div>

            {/* Presets */}
            <div className="flex justify-center gap-3">
                {[60, 90, 120, 180].map(s => (
                    <button key={s} onClick={() => { setMs(s * 1000); setRunning(true); }}
                        className="px-4 py-2 rounded-xl bg-[var(--ios-fill-tertiary)] text-[13px] text-[var(--ios-text-secondary)] font-medium active:scale-95 transition-transform">
                        {s < 60 ? `${s}s` : `${s / 60}p`}
                    </button>
                ))}
            </div>
        </div>
    );
}
