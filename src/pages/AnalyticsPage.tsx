import { useStore } from '../hooks/useStore';
import { useBoardStore } from '../store/useBoardStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { format, subDays, isSameDay, eachDayOfInterval } from 'date-fns';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Activity, Flame, Target, TrendingUp, Zap, Calendar, GitPullRequest, ChevronRight } from 'lucide-react';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

export default function AnalyticsPage() {
    const { gymLogs } = useStore();
    const { tasks: tasksMap } = useBoardStore();
    const { commits: nutritionCommits, goals } = useNutritionStore();
    const device = useDeviceDetect();

    const tasks = Object.values(tasksMap);

    // Productivity Analytics
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

    const volumeData = gymLogs.slice(-7).map(log => ({
        date: format(new Date(log.date), 'dd'),
        volume: log.totalVolume,
        records: log.records
    }));

    const nutritionData = last7Days.map(day => {
        const dayCommits = nutritionCommits.filter(c => isSameDay(new Date(c.date), day));
        return {
            date: format(day, 'dd'),
            calories: dayCommits.reduce((acc, c) => acc + c.calories, 0),
            target: goals.dailyCalories
        };
    });

    // Stats computation
    const completionRate = Math.round((tasks.filter(t => t.completed).length / Math.max(1, tasks.length)) * 100);
    const totalVolume = gymLogs.reduce((acc, l) => acc + l.totalVolume, 0);
    const avgCal = Math.round(nutritionCommits.reduce((acc, c) => acc + c.calories, 0) / Math.max(1, nutritionCommits.length));

    return (
        <div style={{ padding: '0 0 40px' }}>

            {/* ===== QUICK STATS ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: device.isTablet ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: 10, margin: '12px 16px 14px' }}>
                <StatCard icon={<GitPullRequest size={16} />} value={`${completionRate}%`} label="Hoàn thành" color="#0A84FF" />
                <StatCard icon={<Activity size={16} />} value={`${totalVolume.toLocaleString()}kg`} label="Tổng volume" color="#BF5AF2" />
                <StatCard icon={<Flame size={16} />} value={`${avgCal}kcal`} label="Calo TB" color="#FF9F0A" />
                <StatCard icon={<Zap size={16} />} value="99.9%" label="Uptime" color="#30D158" />
            </div>

            {/* ===== WORK EFFICIENCY CHART ===== */}
            <IOSCard title="Hiệu suất công việc" icon={<Target size={16} color="#0A84FF" />}>
                <div style={{ height: 200, width: '100%', marginTop: 8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={completionData}>
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#636366" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#636366" fontSize={11} tickLine={false} axisLine={false} width={24} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2C2C2E', border: 'none', borderRadius: 10, fontSize: 13, color: '#fff' }}
                                itemStyle={{ color: '#0A84FF' }}
                            />
                            <Area type="monotone" dataKey="completed" stroke="#0A84FF" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </IOSCard>

            {/* ===== CHARTS 2-column on iPad ===== */}
            <div style={device.isTablet ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '0 16px' } : {}}>

                {/* ===== VOLUME CHART ===== */}
                <IOSCard title="Cường độ tập luyện" icon={<Activity size={16} color="#BF5AF2" />}>
                    <div style={{ height: 200, width: '100%', marginTop: 8 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={volumeData}>
                                <XAxis dataKey="date" stroke="#636366" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#636366" fontSize={11} tickLine={false} axisLine={false} width={30} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#2C2C2E', border: 'none', borderRadius: 10, fontSize: 13, color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="volume" fill="#BF5AF2" radius={[6, 6, 0, 0]}>
                                    {volumeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fillOpacity={0.5 + (index * 0.07)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </IOSCard>
            </div>

            {/* ===== BOTTOM CHARTS (side-by-side on iPad) ===== */}
            <div style={device.isTablet ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '0 16px' } : {}}>
                {/* ===== NUTRITION TREND ===== */}
                <IOSCard title="Xu hướng dinh dưỡng" icon={<Flame size={16} color="#FF9F0A" />}>
                    <div style={{ height: 200, width: '100%', marginTop: 8 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={nutritionData}>
                                <XAxis dataKey="date" stroke="#636366" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#636366" fontSize={11} tickLine={false} axisLine={false} width={30} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#2C2C2E', border: 'none', borderRadius: 10, fontSize: 13, color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="calories" stroke="#FF9F0A" strokeWidth={2.5} dot={{ fill: '#FF9F0A', r: 3 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="target" stroke="#636366" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </IOSCard>

                {/* ===== CONSISTENCY HEATMAP ===== */}
                <IOSCard title="Mật độ kiên trì" icon={<Calendar size={16} color="#30D158" />}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 6, marginTop: 8
                    }}>
                        {Array.from({ length: 28 }).map((_, i) => {
                            const intensity = Math.random();
                            let bg: string;
                            if (intensity > 0.7) bg = 'rgba(48, 209, 88, 0.7)';
                            else if (intensity > 0.5) bg = 'rgba(48, 209, 88, 0.45)';
                            else if (intensity > 0.3) bg = 'rgba(48, 209, 88, 0.25)';
                            else bg = 'rgba(58, 58, 62, 0.6)';
                            return (
                                <div key={i} style={{
                                    aspectRatio: '1', borderRadius: 6,
                                    background: bg, transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }} />
                            );
                        })}
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginTop: 10, padding: '0 2px'
                    }}>
                        <span style={{ fontSize: 11, color: '#636366' }}>Ít hoạt động</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(58,58,62,0.6)' }} />
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(48,209,88,0.25)' }} />
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(48,209,88,0.45)' }} />
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(48,209,88,0.7)' }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#636366' }}>Beast mode</span>
                    </div>
                </IOSCard>
            </div>
        </div>
    );
}

// ============================================================
//  iOS Stat Card
// ============================================================
function StatCard({ icon, value, label, color }: {
    icon: React.ReactNode; value: string; label: string; color: string;
}) {
    return (
        <div style={{
            background: '#1C1C1F', borderRadius: 12,
            padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12
        }}>
            <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#F5F5F7', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#98989D', marginTop: 3 }}>{label}</div>
            </div>
        </div>
    );
}

// ============================================================
//  iOS Chart Card
// ============================================================
function IOSCard({ title, icon, children }: {
    title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div style={{
            margin: '0 16px 14px', padding: '16px',
            background: '#1C1C1F', borderRadius: 12
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4
            }}>
                {icon}
                <span style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F7' }}>{title}</span>
            </div>
            {children}
        </div>
    );
}
