import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Footprints, Flame, Clock, MapPin, TrendingUp,
    Zap, Trophy
} from 'lucide-react';
import { useStepStore } from '../store/useStepStore';

// ============================================================
//  STEP COUNTER PAGE
// ============================================================
export default function StepCounterPage() {
    const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [selectedDate] = useState(new Date());
    const today = format(selectedDate, 'yyyy-MM-dd');

    const { getStepsForDate, getWeeklySteps, stepGoal, currentStreak, bestStreak, achievements, updateSteps } = useStepStore();
    const todayData = getStepsForDate(today);
    const weekData = getWeeklySteps(today);
    const progress = Math.min(1, todayData.steps / stepGoal.dailySteps);

    // Demo: Add random steps button
    const addDemoSteps = () => {
        const current = todayData.steps;
        updateSteps(today, current + Math.floor(Math.random() * 2000) + 500);
    };

    const weeklyTotal = weekData.reduce((s, d) => s + d.steps, 0);
    const weeklyAvg = Math.round(weeklyTotal / 7);
    const maxWeekDay = Math.max(...weekData.map(d => d.steps), 1);



    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a1a' }}>
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>
                        <Footprints size={16} className="text-white" />
                    </div>
                    Steps
                </h1>
                <p className="text-gray-500 text-xs mt-1">{format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: vi })}</p>
            </div>

            {/* View Toggle */}
            <div className="px-4 mb-4">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {(['daily', 'weekly', 'monthly'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{
                                background: view === v ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent',
                                color: view === v ? '#fff' : '#6B7280',
                            }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                    ))}
                </div>
            </div>

            {/* Main Circle */}
            <div className="px-4 mb-6">
                <div className="rounded-3xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="relative w-52 h-52 mx-auto mb-4">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                            <motion.circle cx="50" cy="50" r="42" fill="none"
                                stroke="url(#pinkGrad)" strokeWidth="7" strokeLinecap="round"
                                strokeDasharray={`${progress * 264} 264`}
                                initial={{ strokeDasharray: '0 264' }}
                                animate={{ strokeDasharray: `${progress * 264} 264` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                            />
                            <defs>
                                <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EC4899" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Footprints className="text-pink-400 mb-1" size={22} />
                            <motion.span className="text-4xl font-black text-white"
                                key={todayData.steps}
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                {todayData.steps.toLocaleString()}
                            </motion.span>
                            <span className="text-gray-500 text-xs mt-1">/ {stepGoal.dailySteps.toLocaleString()} Steps</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <QuickStat icon={<Flame size={14} className="text-orange-400" />} value={todayData.calories} label="Calories" />
                        <QuickStat icon={<Clock size={14} className="text-cyan-400" />} value={`${todayData.activeMinutes}m`} label="Time" />
                        <QuickStat icon={<MapPin size={14} className="text-green-400" />} value={`${todayData.distance}km`} label="Distance" />
                    </div>
                </div>
            </div>

            {/* Demo Button */}
            <div className="px-4 mb-4">
                <motion.button whileTap={{ scale: 0.97 }} onClick={addDemoSteps}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>
                    + Add Steps (Demo)
                </motion.button>
            </div>

            {/* Weekly Chart */}
            <div className="px-4 mb-6">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-semibold text-sm">This Week</span>
                        <span className="text-pink-400 text-xs font-semibold">{weeklyTotal.toLocaleString()} total</span>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-2 h-32 mb-2">
                        {weekData.map((d, i) => {
                            const h = maxWeekDay > 0 ? (d.steps / maxWeekDay) * 100 : 0;
                            const isToday = d.date === today;
                            const metGoal = d.steps >= stepGoal.dailySteps;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[9px] text-gray-500">{d.steps > 0 ? (d.steps / 1000).toFixed(1) + 'k' : ''}</span>
                                    <motion.div
                                        className="w-full rounded-t-lg"
                                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.08 }}
                                        style={{
                                            background: metGoal
                                                ? 'linear-gradient(180deg, #EC4899, #8B5CF6)'
                                                : isToday
                                                    ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.08)',
                                            minHeight: d.steps > 0 ? 4 : 0,
                                        }}
                                    />
                                    <span className={`text-[10px] font-medium ${isToday ? 'text-pink-400' : 'text-gray-500'}`}>
                                        {format(new Date(d.date || new Date()), 'EEE', { locale: vi }).slice(0, 2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">
                        <span>Avg: {weeklyAvg.toLocaleString()} / day</span>
                        <span>Goal: {stepGoal.dailySteps.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Streak & Total */}
            <div className="px-4 grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-pink-400" />
                        <span className="text-white text-sm font-semibold">Streak</span>
                    </div>
                    <p className="text-3xl font-black text-pink-400">{currentStreak}</p>
                    <p className="text-gray-500 text-xs">Best: {bestStreak} days</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-purple-400" />
                        <span className="text-white text-sm font-semibold">Total Steps</span>
                    </div>
                    <p className="text-3xl font-black text-purple-400">{(useStepStore.getState().getTotalSteps() / 1000).toFixed(1)}k</p>
                    <p className="text-gray-500 text-xs">All time</p>
                </div>
            </div>

            {/* Achievements */}
            <div className="px-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" /> Achievements
                </h3>
                <div className="grid grid-cols-5 gap-2 mb-3">
                    {achievements.map(a => (
                        <motion.div key={a.id}
                            whileTap={{ scale: 0.9 }}
                            className="aspect-square rounded-xl flex flex-col items-center justify-center p-1"
                            style={{
                                background: a.unlockedAt ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${a.unlockedAt ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
                                opacity: a.unlockedAt ? 1 : 0.4,
                            }}
                        >
                            <span className="text-lg">{a.icon}</span>
                            <span className="text-[8px] text-gray-500 mt-0.5 text-center leading-tight">{a.title}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
//  QUICK STAT
// ============================================================
function QuickStat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
    return (
        <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">{icon}</div>
            <p className="text-white font-bold text-sm">{value}</p>
            <p className="text-gray-500 text-[10px]">{label}</p>
        </div>
    );
}
