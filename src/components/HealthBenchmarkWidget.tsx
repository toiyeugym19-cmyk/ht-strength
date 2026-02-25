import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Footprints, Moon, Droplets, Heart, Scale, Flame,
    Activity, RefreshCw, TrendingUp, Gauge, Wind, Timer, HeartPulse
} from 'lucide-react';
import { useHealthStore } from '../store/useHealthStore';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import { format } from 'date-fns';

// ============================================================
//  Benchmark config — thresholds for each metric
// ============================================================
interface BenchmarkConfig {
    key: string;
    label: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
    min: number;
    max: number;
    optimal: [number, number]; // [low, high] of "good" range
    format?: (v: number) => string;
}

const BENCHMARKS: BenchmarkConfig[] = [
    {
        key: 'steps', label: 'Bước chân', unit: 'bước',
        icon: <Footprints size={16} />, color: '#30D158',
        min: 0, max: 15000, optimal: [8000, 12000],
    },
    {
        key: 'heartRateAvg', label: 'Nhịp tim', unit: 'bpm',
        icon: <Heart size={16} />, color: '#FF453A',
        min: 40, max: 120, optimal: [60, 80],
    },
    {
        key: 'sleepHours', label: 'Giấc ngủ', unit: 'giờ',
        icon: <Moon size={16} />, color: '#BF5AF2',
        min: 0, max: 12, optimal: [7, 9],
        format: (v) => v.toFixed(1),
    },
    {
        key: 'waterMl', label: 'Nước uống', unit: 'ml',
        icon: <Droplets size={16} />, color: '#0A84FF',
        min: 0, max: 4000, optimal: [2000, 3000],
    },
    {
        key: 'caloriesBurned', label: 'Calories đốt', unit: 'kcal',
        icon: <Flame size={16} />, color: '#FF9F0A',
        min: 0, max: 1000, optimal: [300, 600],
    },
    {
        key: 'weight', label: 'Cân nặng', unit: 'kg',
        icon: <Scale size={16} />, color: '#64D2FF',
        min: 40, max: 120, optimal: [65, 80],
        format: (v) => v.toFixed(1),
    },
    {
        key: 'bodyFat', label: 'Tỷ lệ mỡ', unit: '%',
        icon: <Activity size={16} />, color: '#FFD60A',
        min: 5, max: 40, optimal: [10, 20],
        format: (v) => v.toFixed(1),
    },
    {
        key: 'bloodPressureSystolic', label: 'Huyết áp (tâm thu)', unit: 'mmHg',
        icon: <Gauge size={16} />, color: '#FF375F',
        min: 80, max: 180, optimal: [110, 130],
    },
    {
        key: 'oxygenSaturation', label: 'Oxy trong máu', unit: '%',
        icon: <Wind size={16} />, color: '#5AC8FA',
        min: 85, max: 100, optimal: [95, 100],
        format: (v) => v.toFixed(1),
    },
    {
        key: 'restingHeartRate', label: 'Nhịp tim nghỉ', unit: 'bpm',
        icon: <HeartPulse size={16} />, color: '#FF6482',
        min: 40, max: 100, optimal: [50, 70],
    },
    {
        key: 'activeMinutes', label: 'Thời gian vận động', unit: 'phút',
        icon: <Timer size={16} />, color: '#34C759',
        min: 0, max: 120, optimal: [30, 60],
    },
];

function getRating(value: number, optimal: [number, number]): { label: string; color: string; bg: string } {
    const [low, high] = optimal;
    const mid = (low + high) / 2;
    const diff = Math.abs(value - mid) / (high - low);

    if (value >= low && value <= high) {
        if (diff < 0.25) return { label: 'Xuất sắc', color: '#30D158', bg: 'rgba(48,209,88,0.12)' };
        return { label: 'Tốt', color: '#0A84FF', bg: 'rgba(10,132,255,0.12)' };
    }
    if (value < low) {
        const pct = (low - value) / low;
        if (pct < 0.3) return { label: 'Khá', color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)' };
        return { label: 'Thấp', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' };
    }
    // value > high
    const pct = (value - high) / high;
    if (pct < 0.2) return { label: 'Khá', color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)' };
    return { label: 'Cao', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' };
}

// ============================================================
//  Main component
// ============================================================
export default function HealthBenchmarkWidget() {
    const { dailyStats, isSyncing, lastSyncTime, syncWithDevice } = useHealthStore();
    const device = useDeviceDetect();
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayStats = dailyStats[today];

    // Auto-sync on mount if no data
    useEffect(() => {
        if (!todayStats) {
            syncWithDevice();
        }
    }, []); // eslint-disable-line

    return (
        <div style={{ padding: '0 0 20px' }}>

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                margin: '0 16px 6px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={16} style={{ color: '#30D158' }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F7' }}>
                        Chỉ số sức khỏe
                    </span>
                </div>
                <button
                    onClick={() => syncWithDevice()}
                    disabled={isSyncing}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 20,
                        background: 'rgba(120,120,128,0.16)',
                        color: isSyncing ? '#8E8E93' : '#0A84FF',
                        fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        transition: 'transform 0.15s',
                    }}
                >
                    <RefreshCw size={13} strokeWidth={2.5} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}
                </button>
            </div>

            {/* Subtitle */}
            <div style={{
                margin: '0 16px 12px', fontSize: 12, color: '#636366'
            }}>
                {lastSyncTime
                    ? `Cập nhật lần cuối: ${format(new Date(lastSyncTime), 'HH:mm dd/MM')}`
                    : 'Chưa có dữ liệu — bấm đồng bộ để bắt đầu'
                }
            </div>

            {/* Benchmark cards — 2-column on iPad, 1-column on iPhone */}
            <div style={{
                margin: '0 16px',
                display: 'grid',
                gridTemplateColumns: device.isTablet ? '1fr 1fr' : '1fr',
                gap: device.isTablet ? 10 : 0,
            }}>
                {BENCHMARKS.map((bm, idx) => {
                    const value = todayStats ? (todayStats as any)[bm.key] || 0 : 0;
                    const rating = getRating(value, bm.optimal);
                    const position = Math.max(0, Math.min(100, ((value - bm.min) / (bm.max - bm.min)) * 100));
                    const optLow = ((bm.optimal[0] - bm.min) / (bm.max - bm.min)) * 100;
                    const optHigh = ((bm.optimal[1] - bm.min) / (bm.max - bm.min)) * 100;
                    const displayValue = bm.format ? bm.format(value) : Math.round(value).toLocaleString();

                    return (
                        <div key={bm.key} style={{
                            padding: device.isTablet ? '16px 18px' : '14px 16px',
                            background: '#1C1C1F',
                            borderRadius: device.isTablet ? 14 : 0,
                            ...(!device.isTablet && idx > 0 ? {
                                borderTop: '0.5px solid rgba(84,84,88,0.35)'
                            } : {}),
                            ...(!device.isTablet && idx === 0 ? {
                                borderRadius: '14px 14px 0 0'
                            } : {}),
                            ...(!device.isTablet && idx === BENCHMARKS.length - 1 ? {
                                borderRadius: idx === 0 ? 14 : '0 0 14px 14px'
                            } : {}),
                        }}>
                            {/* Row 1: Label + Rating badge */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: 8
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ color: bm.color }}>{bm.icon}</div>
                                    <span style={{ fontSize: 15, fontWeight: 500, color: '#F5F5F7' }}>
                                        {bm.label}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: 12, fontWeight: 600,
                                    padding: '3px 10px', borderRadius: 6,
                                    background: todayStats ? rating.bg : 'rgba(142,142,147,0.12)',
                                    color: todayStats ? rating.color : '#636366'
                                }}>
                                    {todayStats ? rating.label : '—'}
                                </span>
                            </div>

                            {/* Row 2: Bar + Value indicator */}
                            <div style={{ position: 'relative', marginBottom: 4 }}>
                                {/* Value label above bar */}
                                {todayStats && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            position: 'absolute',
                                            left: `${position}%`,
                                            top: -18, transform: 'translateX(-50%)',
                                            fontSize: 11, fontWeight: 600, color: bm.color,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Bạn: {displayValue} {bm.unit}
                                    </motion.div>
                                )}

                                {/* Background bar */}
                                <div style={{
                                    width: '100%', height: 8, borderRadius: 4,
                                    background: '#2C2C2E', position: 'relative',
                                    overflow: 'hidden', marginTop: 20
                                }}>
                                    {/* Optimal range highlight */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${optLow}%`,
                                        width: `${optHigh - optLow}%`,
                                        height: '100%',
                                        background: `${bm.color}25`,
                                        borderRadius: 4
                                    }} />

                                    {/* Value fill bar */}
                                    {todayStats && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${position}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            style={{
                                                height: '100%', borderRadius: 4,
                                                background: bm.color,
                                                position: 'absolute', left: 0, top: 0
                                            }}
                                        />
                                    )}

                                    {/* Position indicator triangle */}
                                    {todayStats && (
                                        <motion.div
                                            initial={{ left: '0%' }}
                                            animate={{ left: `${position}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            style={{
                                                position: 'absolute', top: -3,
                                                width: 0, height: 0, transform: 'translateX(-50%)',
                                                borderLeft: '5px solid transparent',
                                                borderRight: '5px solid transparent',
                                                borderTop: `5px solid ${bm.color}`
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Scale labels */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontSize: 10, color: '#636366', marginTop: 4
                            }}>
                                <span>{bm.min}</span>
                                <span style={{ color: '#8E8E93', fontWeight: 500 }}>
                                    Mức tốt: {bm.optimal[0]}–{bm.optimal[1]}
                                </span>
                                <span>{bm.max.toLocaleString()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
