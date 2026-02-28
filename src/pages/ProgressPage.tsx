import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Trophy
} from 'lucide-react';

// ============================================================
//  MOCK PR DATA (integrate with real store later)
// ============================================================
const PR_DATA = [
    { exercise: 'Bench Press', current: 100, previous: 95, unit: 'kg', icon: '🏋️' },
    { exercise: 'Squat', current: 140, previous: 130, unit: 'kg', icon: '🦵' },
    { exercise: 'Deadlift', current: 180, previous: 170, unit: 'kg', icon: '💪' },
    { exercise: 'Overhead Press', current: 65, previous: 60, unit: 'kg', icon: '🙌' },
    { exercise: 'Barbell Row', current: 90, previous: 85, unit: 'kg', icon: '🚣' },
    { exercise: 'Pull-Up', current: 15, previous: 12, unit: 'reps', icon: '🔝' },
];

const BODY_STATS = [
    { label: 'Weight', value: 75.2, prev: 76.1, unit: 'kg', color: '#3B82F6', trend: 'down' },
    { label: 'Body Fat', value: 14.5, prev: 15.2, unit: '%', color: '#EF4444', trend: 'down' },
    { label: 'Muscle Mass', value: 35.8, prev: 35.2, unit: 'kg', color: '#22C55E', trend: 'up' },
    { label: 'BMI', value: 23.1, prev: 23.4, unit: '', color: '#F59E0B', trend: 'down' },
];

const WEEKLY_WEIGHTS = [76.5, 76.2, 76.0, 75.8, 75.5, 75.3, 75.2];

export default function ProgressPage() {
    const [tab, setTab] = useState<'body' | 'strength' | 'overview'>('overview');

    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a1a' }}>
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #22C55E, #10B981)' }}>
                        <TrendingUp size={16} className="text-white" />
                    </div>
                    Progress
                </h1>
            </div>

            {/* Tab Toggle */}
            <div className="px-4 mb-4">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {(['overview', 'body', 'strength'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                            style={{
                                background: tab === t ? 'linear-gradient(135deg, #22C55E, #10B981)' : 'transparent',
                                color: tab === t ? '#fff' : '#6B7280',
                            }}>{t}</button>
                    ))}
                </div>
            </div>

            {tab === 'overview' && (
                <div className="px-4 space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {BODY_STATS.map(s => (
                            <motion.div key={s.label} whileTap={{ scale: 0.97 }}
                                className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-xs">{s.label}</span>
                                    {s.trend === 'down' ? <TrendingDown size={14} className="text-green-400" /> : <TrendingUp size={14} className="text-green-400" />}
                                </div>
                                <p className="text-2xl font-black text-white">{s.value}<span className="text-sm text-gray-500 ml-1">{s.unit}</span></p>
                                <p className="text-xs mt-1" style={{ color: '#22C55E' }}>
                                    {s.trend === 'down' ? '↓' : '↑'} {Math.abs(s.value - s.prev).toFixed(1)} from last week
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Weight Chart */}
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 className="text-white font-semibold text-sm mb-3">Weight Trend</h3>
                        <div className="flex items-end gap-1 h-24">
                            {WEEKLY_WEIGHTS.map((w, i) => {
                                const min = Math.min(...WEEKLY_WEIGHTS) - 1;
                                const max = Math.max(...WEEKLY_WEIGHTS) + 1;
                                const h = ((w - min) / (max - min)) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[8px] text-gray-500">{w}</span>
                                        <motion.div className="w-full rounded-t-md"
                                            initial={{ height: 0 }} animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.08 }}
                                            style={{ background: i === WEEKLY_WEIGHTS.length - 1 ? 'linear-gradient(180deg, #22C55E, #10B981)' : 'rgba(34,197,94,0.3)' }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick PR Card */}
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <Trophy size={14} className="text-yellow-400" /> Recent PRs
                        </h3>
                        {PR_DATA.slice(0, 3).map(pr => (
                            <div key={pr.exercise} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-2">
                                    <span>{pr.icon}</span>
                                    <span className="text-white text-sm">{pr.exercise}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 font-bold text-sm">{pr.current}{pr.unit}</span>
                                    <span className="text-gray-600 text-xs">+{pr.current - pr.previous}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'body' && (
                <div className="px-4 space-y-3">
                    {BODY_STATS.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                            className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-semibold text-sm">{s.label}</span>
                                <div className="flex items-center gap-1">
                                    {s.trend === 'down' ? <TrendingDown size={12} style={{ color: s.color }} /> : <TrendingUp size={12} style={{ color: s.color }} />}
                                    <span className="text-xs" style={{ color: s.color }}>{Math.abs(s.value - s.prev).toFixed(1)}</span>
                                </div>
                            </div>
                            <p className="text-3xl font-black text-white">{s.value}<span className="text-sm text-gray-500 ml-1">{s.unit}</span></p>
                            <div className="w-full h-1.5 rounded-full mt-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <motion.div className="h-full rounded-full" style={{ background: s.color }}
                                    initial={{ width: 0 }} animate={{ width: `${(s.value / (s.value * 1.3)) * 100}%` }} transition={{ duration: 0.8 }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {tab === 'strength' && (
                <div className="px-4 space-y-3">
                    {PR_DATA.map((pr, i) => (
                        <motion.div key={pr.exercise} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                            className="rounded-2xl p-4 flex items-center gap-4"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{ background: 'rgba(255,255,255,0.04)' }}>{pr.icon}</div>
                            <div className="flex-1">
                                <p className="text-white font-semibold text-sm">{pr.exercise}</p>
                                <p className="text-gray-500 text-xs">Previous: {pr.previous}{pr.unit}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-white">{pr.current}<span className="text-xs text-gray-500">{pr.unit}</span></p>
                                <p className="text-green-400 text-xs font-semibold">+{pr.current - pr.previous} PR 🏆</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
