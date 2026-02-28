import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Star, Crown, Target
} from 'lucide-react';

// ============================================================
//  MOCK DATA
// ============================================================
const LEADERBOARD = [
    { rank: 1, name: 'Linh Nguyen', points: 8918, workouts: 24, avatar: '👩', isYou: false },
    { rank: 2, name: 'Alfred Owen', points: 7650, workouts: 20, avatar: '👨', isYou: false },
    { rank: 3, name: 'Thanh Pham', points: 6420, workouts: 18, avatar: '🧑', isYou: true },
    { rank: 4, name: 'Mai Tran', points: 5100, workouts: 15, avatar: '👩', isYou: false },
    { rank: 5, name: 'Duc Le', points: 4300, workouts: 13, avatar: '👨', isYou: false },
    { rank: 6, name: 'Hoa Vu', points: 3800, workouts: 11, avatar: '👩', isYou: false },
];

const REWARDS = [
    { id: 'free-shake', title: 'Free Protein Shake', cost: 500, icon: '🥤', category: 'Nutrition' },
    { id: 'pt-session', title: '1 PT Session Free', cost: 2000, icon: '🏋️', category: 'Training' },
    { id: 'merch-tshirt', title: 'HT Gym T-Shirt', cost: 1500, icon: '👕', category: 'Merchandise' },
    { id: 'month-free', title: '1 Month Free', cost: 5000, icon: '🎁', category: 'Membership' },
    { id: 'towel', title: 'Premium Gym Towel', cost: 800, icon: '🧣', category: 'Merchandise' },
    { id: 'massage', title: '30min Massage', cost: 1200, icon: '💆', category: 'Recovery' },
];

const CHALLENGES = [
    { id: 'c1', title: 'Steps 2,000+', desc: 'Keep going! Walk more today.', points: 50, progress: 0.7, icon: '👟' },
    { id: 'c2', title: '5 Workouts/Week', desc: 'Complete 5 workouts this week', points: 200, progress: 0.6, icon: '💪' },
    { id: 'c3', title: 'Log All Meals', desc: 'Track every meal today', points: 30, progress: 0.33, icon: '🍽️' },
    { id: 'c4', title: '10k Steps Streak', desc: '7 days of 10k steps', points: 500, progress: 0.43, icon: '🔥' },
];

// ============================================================
//  SOCIAL / LOYALTY PAGE
// ============================================================
export default function SocialPage() {
    const [tab, setTab] = useState<'points' | 'leaderboard' | 'rewards'>('points');
    const myPoints = 6420;
    const weekPoints = 25;
    const weekTarget = 50;

    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a1a' }}>
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                        <Trophy size={16} className="text-white" />
                    </div>
                    Social & Rewards
                </h1>
                <p className="text-gray-500 text-xs mt-1">Compete, earn points, redeem rewards</p>
            </div>

            {/* Points Summary Card */}
            <div className="px-4 mb-4">
                <div className="rounded-3xl p-5 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <motion.div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-15"
                        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity }}
                        style={{ background: 'radial-gradient(#8B5CF6, transparent)' }} />
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                            style={{ background: 'rgba(255,255,255,0.1)' }}>⚡</div>
                        <div>
                            <p className="text-gray-400 text-xs">Your Available Points</p>
                            <p className="text-3xl font-black text-white">{myPoints.toLocaleString()} <span className="text-sm text-gray-400">pts.</span></p>
                        </div>
                        <div className="ml-auto flex gap-1">
                            <span className="text-2xl">🥇</span>
                            <span className="text-2xl">🏆</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400 text-xs">This week points</span>
                            <span className="text-white font-bold text-xs">{weekPoints}/{weekTarget} pts</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <motion.div className="h-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, #22C55E, #10B981)' }}
                                initial={{ width: 0 }} animate={{ width: `${(weekPoints / weekTarget) * 100}%` }}
                                transition={{ duration: 1 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Toggle */}
            <div className="px-4 mb-4">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {(['points', 'leaderboard', 'rewards'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                            style={{
                                background: tab === t ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'transparent',
                                color: tab === t ? '#fff' : '#6B7280',
                            }}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Points Tab - Challenges */}
            {tab === 'points' && (
                <div className="px-4 space-y-3">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Target size={14} className="text-orange-400" /> Weekly Challenges
                    </h3>
                    {CHALLENGES.map((c, i) => (
                        <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{c.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-semibold text-sm">{c.title}</p>
                                    <p className="text-gray-500 text-xs">{c.desc}</p>
                                </div>
                                <span className="text-orange-400 font-bold text-xs">+{c.points} pts</span>
                            </div>
                            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <motion.div className="h-full rounded-full"
                                    style={{ background: c.progress >= 1 ? '#22C55E' : 'linear-gradient(90deg, #F59E0B, #EF4444)' }}
                                    initial={{ width: 0 }} animate={{ width: `${c.progress * 100}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }} />
                            </div>
                            <p className="text-gray-500 text-[10px] mt-1">{Math.round(c.progress * 100)}% complete</p>
                        </motion.div>
                    ))}

                    {/* Week Winner */}
                    <div className="rounded-2xl p-4 mt-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <Crown size={14} className="text-yellow-400" /> Week Winner
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">👩</span>
                            <div>
                                <p className="text-white font-semibold">Linh Nguyen</p>
                                <p className="text-gray-500 text-xs flex items-center gap-2">
                                    <span>🏋️ 8 workouts</span> <span>⏱️ 4h 20 min</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard Tab */}
            {tab === 'leaderboard' && (
                <div className="px-4 space-y-2">
                    {LEADERBOARD.map((u, i) => (
                        <motion.div key={u.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            className="flex items-center gap-3 p-3 rounded-2xl"
                            style={{
                                background: u.isYou ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${u.isYou ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: u.rank <= 3
                                        ? `linear-gradient(135deg, ${['#F59E0B', '#94A3B8', '#D97706'][u.rank - 1]}, ${['#EF4444', '#64748B', '#B45309'][u.rank - 1]})`
                                        : 'rgba(255,255,255,0.06)',
                                    color: u.rank <= 3 ? '#fff' : '#6B7280',
                                }}>
                                {u.rank}
                            </div>
                            <span className="text-2xl">{u.avatar}</span>
                            <div className="flex-1">
                                <p className="text-white text-sm font-semibold">{u.name} {u.isYou && <span className="text-xs text-indigo-400">(You)</span>}</p>
                                <p className="text-gray-500 text-xs">{u.workouts} workouts</p>
                            </div>
                            <span className="text-orange-400 font-bold text-sm">{u.points.toLocaleString()}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Rewards Tab */}
            {tab === 'rewards' && (
                <div className="px-4">
                    <p className="text-gray-400 text-xs mb-3">Redeem your points for exclusive rewards</p>
                    <div className="grid grid-cols-2 gap-3">
                        {REWARDS.map((r, i) => {
                            const canAfford = myPoints >= r.cost;
                            return (
                                <motion.button key={r.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-2xl p-4 text-left"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${canAfford ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                        opacity: canAfford ? 1 : 0.5,
                                    }}>
                                    <span className="text-3xl block mb-2">{r.icon}</span>
                                    <p className="text-white font-semibold text-sm">{r.title}</p>
                                    <p className="text-gray-500 text-[10px] mb-2">{r.category}</p>
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-yellow-400" />
                                        <span className="text-orange-400 font-bold text-xs">{r.cost.toLocaleString()} pts</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
