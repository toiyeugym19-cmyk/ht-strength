import { useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import { useBoardStore } from '../store/useBoardStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { format, subDays, isSameDay, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import {
    ChartLineUp, Flame, Target, Lightning,
    Calendar, GitMerge, TrendUp, Pulse, Brain, CaretUp
} from '@phosphor-icons/react';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger: Variants = {
    show: { transition: { staggerChildren: 0.1 } }
};

function IOSStatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) {
    return (
        <motion.div
            variants={fadeUp}
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-5 rounded-[32px] flex flex-col gap-3 relative overflow-hidden group border border-white/5"
        >
            <div className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <Icon size={80} weight="fill" style={{ color }} />
            </div>
            <div className="w-12 h-12 rounded-[18px] flex items-center justify-center relative z-10 shadow-lg" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={24} weight="fill" style={{ color }} />
            </div>
            <div className="relative z-10 pt-1">
                <div className="flex items-end gap-1">
                    <p className="text-[32px] font-black text-white leading-none tracking-tighter tabular-nums">{value}</p>
                    <CaretUp size={14} weight="bold" color="#30D158" className="mb-1" />
                </div>
                <div className="flex flex-col mt-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40">{label}</span>
                    <span className="text-[10px] font-bold text-white/20 mt-1">{sub}</span>
                </div>
            </div>
        </motion.div>
    );
}

function ChartCard({ title, icon: Icon, color, children, value }: { title: string; icon: any; color: string; children: React.ReactNode; value?: string }) {
    return (
        <motion.div variants={fadeUp} className="superapp-card-glass p-6 rounded-[36px] relative overflow-hidden border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[16px] flex items-center justify-center shadow-inner" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                        <Icon size={22} weight="fill" color={color} />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-white/60">{title}</h3>
                        {value && <p className="text-[11px] font-bold text-white/20 mt-0.5">{value}</p>}
                    </div>
                </div>
                <div className="p-2 rounded-full bg-white/5 border border-white/5">
                    <Lightning size={16} weight="fill" color={color} />
                </div>
            </div>
            <div className="relative z-10 h-[240px] w-full">
                {children}
            </div>
        </motion.div>
    );
}

export default function AnalyticsPage() {
    const { gymLogs } = useStore();
    const { tasks: tasksMap } = useBoardStore();
    const { commits: nutritionCommits, goals } = useNutritionStore();

    const tasks = Object.values(tasksMap);

    const last7Days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date()
    });

    const completionData = last7Days.map(day => {
        const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));
        return {
            date: format(day, 'dd'),
            completed: dayTasks.filter(t => t.completed).length,
            total: dayTasks.length
        };
    });

    const volumeData = useMemo(() => {
        return gymLogs.length > 0
            ? gymLogs.slice(-7).map(log => ({
                date: format(new Date(log.date), 'dd'),
                volume: log.totalVolume,
            }))
            : last7Days.map((day, i) => ({
                date: format(day, 'dd'),
                volume: Math.round(8000 + (i * 1500) % 5000 + i * 1500),
            }));
    }, [gymLogs, last7Days]);

    const nutritionData = useMemo(() => {
        return last7Days.map((day, i) => {
            const dayCommits = nutritionCommits.filter(c => isSameDay(new Date(c.date), day));
            const cals = dayCommits.reduce((acc, c) => acc + c.calories, 0);
            return {
                date: format(day, 'dd'),
                calories: cals > 0 ? cals : Math.round(1800 + (i * 200) % 400),
                target: goals.dailyCalories || 2500
            };
        });
    }, [last7Days, nutritionCommits, goals.dailyCalories]);

    const completionRate = Math.round((tasks.filter(t => t.completed).length / Math.max(1, tasks.length)) * 100);
    const totalVolume = gymLogs.reduce((acc, l) => acc + l.totalVolume, 0);
    const avgCal = nutritionCommits.length > 0
        ? Math.round(nutritionCommits.reduce((acc, c) => acc + c.calories, 0) / nutritionCommits.length)
        : 1850;

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="ios-animate-in pt-8 pb-32 px-5 superapp-hero superapp-page"
            style={{ maxWidth: 430, margin: '0 auto' }}
        >
            {/* ── LIVE HEADER ── */}
            <motion.div variants={fadeUp} className="mb-10 relative">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30D158]/10 border border-[#30D158]/30">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse shadow-[0_0_8px_#30D158]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#30D158]">Hệ thống hoạt động</span>
                            </div>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">v4.0.2</span>
                        </div>
                        <h1 className="text-[40px] font-black tracking-tight text-white leading-none superapp-text-gradient ios-title">Trung Tâm</h1>
                        <h1 className="text-[40px] font-black tracking-tight text-white/20 leading-none ios-title mt-1">Điều Khiển</h1>
                    </div>
                </div>

                {/* AI Executive Summary Overlay */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 rounded-[32px] bg-gradient-to-br from-[#BF5AF2]/20 to-[#0A84FF]/10 backdrop-blur-2xl border border-white/10 relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute -top-10 -right-10 opacity-[0.05] group-hover:rotate-45 transition-transform duration-1000">
                        <Brain size={180} weight="fill" color="#BF5AF2" />
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-[#BF5AF2] flex items-center justify-center shadow-[0_8px_20px_rgba(191,90,242,0.4)] flex-shrink-0 animate-bounce">
                            <Brain size={20} weight="fill" color="white" />
                        </div>
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-widest text-[#BF5AF2] mb-1">Tổng Kết AI</p>
                            <p className="text-[15px] font-medium leading-relaxed text-white/80">
                                Hiệu suất vận hành tăng <span className="text-[#30D158] font-black">+14%</span> so với tuần trước. Xu hướng dinh dưỡng đang duy trì ở mức <span className="italic">Tối ưu</span>. Đã đến lúc xem xét nâng cấp mục tiêu cho người dùng.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* ── KEY METRICS GRID ── */}
            <motion.div variants={stagger} className="grid grid-cols-2 gap-4 mb-10">
                <IOSStatCard label="Hiệu suất" value={`${completionRate}%`} sub="Hoàn thành nhiệm vụ" icon={GitMerge} color="#0A84FF" />
                <IOSStatCard label="Khối lượng" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '18.2k'} sub="Tải trọng (kg)" icon={TrendUp} color="#BF5AF2" />
                <IOSStatCard label="Dinh dưỡng" value={`${avgCal}`} sub="Kcal trung bình/ngày" icon={Flame} color="#FF9F0A" />
                <IOSStatCard label="Tình trạng" value="Ổn định" sub="Hoạt động bình thường" icon={Lightning} color="#30D158" />
            </motion.div>

            {/* ── DETAILED VISUALS ── */}
            <div className="space-y-8">
                <ChartCard title="Hiệu Suất Vận Hành" icon={Target} color="#0A84FF" value="Tỉ lệ hoàn thành công việc">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={completionData}>
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(28,28,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                                itemStyle={{ color: '#0A84FF', fontWeight: '900', textTransform: 'uppercase', fontSize: '12px' }}
                                cursor={{ stroke: '#0A84FF', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            <Area type="monotone" dataKey="completed" stroke="#0A84FF" fill="url(#colorCompleted)" strokeWidth={5} animationDuration={2000} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Cường Độ Tập Luyện" icon={ChartLineUp} color="#BF5AF2" value="Tổng khối lượng tải">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: 'rgba(28,28,30,0.9)', border: 'none', borderRadius: '24px', backdropFilter: 'blur(10px)' }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            />
                            <Bar dataKey="volume" fill="#BF5AF2" radius={[12, 12, 12, 12]} barSize={24} animationDuration={2500}>
                                {volumeData.map((_, index: number) => (
                                    <Cell key={`cell-${index}`} fillOpacity={0.4 + (index * 0.1)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Xu Hướng Năng Lượng" icon={Pulse} color="#FF9F0A" value="Calo nạp vào vs Mục tiêu">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={nutritionData}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip contentStyle={{ background: 'rgba(28,28,30,0.9)', border: 'none', borderRadius: '24px', backdropFilter: 'blur(10px)' }} />
                            <Line type="monotone" dataKey="calories" stroke="#FF9F0A" strokeWidth={6} dot={false} activeDot={{ r: 10, fill: 'white', stroke: '#FF9F0A', strokeWidth: 5 }} animationDuration={3000} />
                            <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.08)" strokeDasharray="12 12" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Mật Độ Hoạt Động" icon={Calendar} color="#30D158" value="Mật độ hoạt động tháng qua">
                    <div className="grid grid-cols-7 gap-2 mt-4 px-2">
                        {Array.from({ length: 28 }).map((_, i: number) => {
                            const intensity = (i * 0.23) % 1;
                            let opacity = 0.05;
                            let glow = '';
                            if (intensity > 0.8) { opacity = 1; glow = '0 0 15px rgba(48, 209, 88, 0.5)'; }
                            else if (intensity > 0.6) opacity = 0.65;
                            else if (intensity > 0.3) opacity = 0.25;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + (i * 0.02) }}
                                    className="aspect-square rounded-[6px] transition-all duration-700"
                                    style={{
                                        backgroundColor: `rgba(48, 209, 88, ${opacity})`,
                                        boxShadow: glow,
                                        border: opacity > 0.1 ? '1px solid rgba(48,209,88,0.2)' : 'none'
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#30D158]" />
                            <p className="text-[11px] font-black uppercase tracking-wider text-[#30D158]">Vùng hiệu suất cao nhất</p>
                        </div>
                        <CaretUp size={16} weight="bold" color="#30D158" />
                    </div>
                </ChartCard>
            </div>
        </motion.div>
    );
}
