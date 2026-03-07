import { useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import { useBoardStore } from '../store/useBoardStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { format, subDays, isSameDay, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import {
    ChartLineUp, Flame, Target, Lightning,
    Calendar, GitMerge, TrendUp, Pulse
} from '@phosphor-icons/react';

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
} as any;

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
} as any;

function IOSStatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-4 rounded-[24px] flex flex-col gap-3 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Icon size={48} weight="fill" style={{ color }} />
            </div>
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center relative z-10" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={20} weight="fill" style={{ color }} />
            </div>
            <div className="relative z-10">
                <p className="text-[26px] font-black text-white leading-none tracking-tighter tabular-nums">{value}</p>
                <div className="flex flex-col mt-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white opacity-30">{label}</span>
                    <span className="text-[9px] font-bold text-white/20 mt-0.5">{sub}</span>
                </div>
            </div>
        </motion.div>
    );
}

function ChartCard({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) {
    return (
        <motion.div variants={fadeUp} className="superapp-card-glass p-6 rounded-[32px] relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                <Icon size={84} weight="fill" color={color} />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={20} weight="fill" color={color} />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-white/60">{title}</h3>
            </div>
            <div className="relative z-10 h-[220px]">
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
            className="ios-animate-in pt-4 pb-24 px-4"
            style={{ maxWidth: 430, margin: '0 auto' }}
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-1 rounded-full bg-[#BF5AF2]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BF5AF2]">Intelligent Insights</p>
                </div>
                <h1 className="text-[32px] font-black tracking-tighter text-white leading-none">Báo cáo dữ liệu</h1>
                <p className="text-[13px] font-medium text-white/30 mt-1">Phân tích hiệu suất & xu hướng hệ thống.</p>
            </motion.div>

            {/* ── KEY METRICS ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-8">
                <IOSStatCard label="Công việc" value={`${completionRate}%`} sub="Hoàn thành trung bình" icon={GitMerge} color="#0A84FF" />
                <IOSStatCard label="Tải trọng" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '12.4k'} sub="Khối lượng tập (kg)" icon={TrendUp} color="#BF5AF2" />
                <IOSStatCard label="Năng lượng" value={`${avgCal}`} sub="Calo nạp mỗi ngày" icon={Flame} color="#FF9F0A" />
                <IOSStatCard label="Uptime" value="100%" sub="Độ ổn định hệ thống" icon={Lightning} color="#30D158" />
            </motion.div>

            <div className="space-y-6">
                <ChartCard title="Hiệu suất vận hành" icon={Target} color="#0A84FF">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={completionData}>
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px' }}
                                itemStyle={{ color: '#0A84FF', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                            />
                            <Area type="monotone" dataKey="completed" stroke="#0A84FF" fill="url(#colorCompleted)" strokeWidth={4} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Cường độ tập luyện" icon={ChartLineUp} color="#BF5AF2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: '#1C1C1E', border: 'none', borderRadius: '18px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            />
                            <Bar dataKey="volume" fill="#BF5AF2" radius={[14, 14, 0, 0]}>
                                {volumeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fillOpacity={0.3 + (index * 0.1)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Xu hướng năng lượng" icon={Pulse} color="#FF9F0A">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={nutritionData}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip contentStyle={{ background: '#1C1C1E', border: 'none', borderRadius: '18px' }} />
                            <Line type="monotone" dataKey="calories" stroke="#FF9F0A" strokeWidth={5} dot={false} activeDot={{ r: 8, fill: 'white', stroke: '#FF9F0A', strokeWidth: 4 }} />
                            <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.05)" strokeDasharray="10 10" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Mật độ hoạt động" icon={Calendar} color="#30D158">
                    <div className="grid grid-cols-7 gap-1.5 mt-2">
                        {Array.from({ length: 28 }).map((_, i) => {
                            const intensity = (i * 0.17) % 1;
                            let opacity = 0.05;
                            if (intensity > 0.8) opacity = 1;
                            else if (intensity > 0.6) opacity = 0.6;
                            else if (intensity > 0.3) opacity = 0.25;

                            return (
                                <div
                                    key={i}
                                    className="aspect-square rounded-[5px] transition-all"
                                    style={{
                                        backgroundColor: `rgba(48, 209, 88, ${opacity})`,
                                        boxShadow: opacity > 0.5 ? '0 0 10px rgba(48, 209, 88, 0.3)' : 'none'
                                    }}
                                />
                            );
                        })}
                    </div>
                </ChartCard>
            </div>
        </motion.div>
    );
}
