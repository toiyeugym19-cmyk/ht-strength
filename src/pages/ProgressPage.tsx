import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Scale, Heart, Footprints, Moon, Droplets, Flame, Activity } from 'lucide-react';
import { useHealthStore } from '../store/useHealthStore';
import { useStepStore } from '../store/useStepStore';
import { useCalorieStore } from '../store/useCalorieStore';

// ============================================================
//  PROGRESS PAGE — Mibro Fit Dark Theme (Real Data)
// ============================================================
export default function ProgressPage() {
    const healthStore = useHealthStore();
    const stepStore = useStepStore();
    const calorieStore = useCalorieStore();
    const today = format(new Date(), 'yyyy-MM-dd');

    // Build 7-day trend data
    const weeklyData = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
            const h = healthStore.dailyStats[date] || {};
            const s = stepStore.getStepsForDate(date);
            const c = calorieStore.getDayTotals(date);
            return {
                date,
                label: format(subDays(new Date(), 6 - i), 'EEE', { locale: vi }),
                steps: (h as any).steps || s.steps || 0,
                calories: c.calories || 0,
                heartRate: (h as any).heartRateAvg || 0,
                sleep: (h as any).sleepHours || 0,
                weight: (h as any).weight || 0,
                water: (h as any).waterMl || 0,
            };
        });
    }, [healthStore.dailyStats, stepStore.stepHistory, calorieStore.dailyData]);

    // Compute averages and trends
    const latest = weeklyData[6];
    const prev = weeklyData[5];

    const metrics = [
        {
            label: 'Cân nặng', icon: Scale, color: '#AC8E68', dimColor: 'rgba(172,142,104,0.15)',
            value: latest.weight || '--', unit: 'kg',
            trend: latest.weight && prev.weight ? latest.weight - prev.weight : null,
            chartData: weeklyData.map(d => d.weight),
        },
        {
            label: 'Nhịp tim TB', icon: Heart, color: '#FF375F', dimColor: 'rgba(255,55,95,0.15)',
            value: latest.heartRate || '--', unit: 'BPM',
            trend: latest.heartRate && prev.heartRate ? latest.heartRate - prev.heartRate : null,
            chartData: weeklyData.map(d => d.heartRate),
        },
        {
            label: 'Bước chân', icon: Footprints, color: '#30D158', dimColor: 'rgba(48,209,88,0.15)',
            value: latest.steps ? latest.steps.toLocaleString() : '--', unit: 'bước',
            trend: latest.steps && prev.steps ? latest.steps - prev.steps : null,
            chartData: weeklyData.map(d => d.steps),
        },
        {
            label: 'Giấc ngủ', icon: Moon, color: '#BF5AF2', dimColor: 'rgba(191,90,242,0.15)',
            value: latest.sleep || '--', unit: 'giờ',
            trend: latest.sleep && prev.sleep ? latest.sleep - prev.sleep : null,
            chartData: weeklyData.map(d => d.sleep),
        },
        {
            label: 'Calo nạp', icon: Flame, color: '#FF9F0A', dimColor: 'rgba(255,159,10,0.15)',
            value: latest.calories || '--', unit: 'kcal',
            trend: latest.calories && prev.calories ? latest.calories - prev.calories : null,
            chartData: weeklyData.map(d => d.calories),
        },
        {
            label: 'Nước uống', icon: Droplets, color: '#0A84FF', dimColor: 'rgba(10,132,255,0.15)',
            value: latest.water || '--', unit: 'ml',
            trend: latest.water && prev.water ? latest.water - prev.water : null,
            chartData: weeklyData.map(d => d.water),
        },
    ];

    // Overall activity score (0-100)
    const activityScore = useMemo(() => {
        const stepsScore = Math.min((latest.steps / 8000) * 100, 100);
        const sleepScore = latest.sleep ? Math.min((latest.sleep / 8) * 100, 100) : 0;
        const waterScore = latest.water ? Math.min((latest.water / 2000) * 100, 100) : 0;
        return Math.round((stepsScore + sleepScore + waterScore) / 3);
    }, [latest]);

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ background: 'var(--bg-app)' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 pt-6 space-y-5">

                <motion.div variants={fadeUp}>
                    <h1 className="text-2xl font-bold">Tiến trình</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Theo dõi xu hướng 7 ngày qua</p>
                </motion.div>

                {/* Activity Score */}
                <motion.div variants={fadeUp} className="rounded-3xl p-6 flex items-center gap-5"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="relative" style={{ width: 100, height: 100 }}>
                        <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(48,209,88,0.12)" strokeWidth="8" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#30D158" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - activityScore / 100)}
                                style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">{activityScore}</span>
                            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>điểm</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-bold">Điểm hoạt động</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {activityScore >= 80 ? 'Xuất sắc! Tiếp tục phát huy 💪' :
                                activityScore >= 50 ? 'Khá tốt! Cố gắng thêm nhé 🎯' :
                                    activityScore > 0 ? 'Hãy vận động nhiều hơn! 🏃' : 'Chưa có dữ liệu hôm nay'}
                        </p>
                    </div>
                </motion.div>

                {/* Metric Cards with mini sparkline */}
                {metrics.map((m, idx) => (
                    <motion.div key={m.label} variants={fadeUp} className="rounded-2xl p-4"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: m.dimColor }}>
                                    <m.icon size={18} style={{ color: m.color }} />
                                </div>
                                <span className="text-sm font-medium">{m.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-bold" style={{ color: m.color }}>{m.value}</span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.unit}</span>
                            </div>
                        </div>

                        {/* Mini sparkline */}
                        <div className="flex items-end gap-1 h-8">
                            {m.chartData.map((v, i) => {
                                const max = Math.max(...m.chartData.filter(x => x > 0), 1);
                                const h = v > 0 ? (v / max) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 rounded-t transition-all duration-500"
                                        style={{
                                            height: `${Math.max(h, 6)}%`,
                                            background: i === 6 ? m.color : `${m.color}30`,
                                            minHeight: 2
                                        }} />
                                );
                            })}
                        </div>

                        {/* Trend indicator */}
                        {m.trend !== null && m.trend !== 0 && (
                            <div className="flex items-center gap-1 mt-2">
                                {m.trend > 0 ? <TrendingUp size={12} className="text-[#30D158]" /> : <TrendingDown size={12} className="text-[#FF375F]" />}
                                <span className="text-[10px] font-medium" style={{ color: m.trend > 0 ? '#30D158' : '#FF375F' }}>
                                    {m.trend > 0 ? '+' : ''}{typeof m.trend === 'number' ? m.trend.toLocaleString() : m.trend} so với hôm qua
                                </span>
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Empty state message */}
                {latest.steps === 0 && latest.weight === 0 && latest.heartRate === 0 && (
                    <motion.div variants={fadeUp} className="rounded-2xl p-6 text-center"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <Activity size={32} className="mx-auto mb-3" style={{ color: 'var(--text-hint)' }} />
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Chưa có dữ liệu</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Nhập dữ liệu sức khoẻ từ Trang Chủ (nút +) hoặc đồng bộ từ đồng hồ thông minh
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
