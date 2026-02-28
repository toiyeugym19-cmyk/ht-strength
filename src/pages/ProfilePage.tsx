import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Settings, Camera, Calendar,
    Award, Flame, Dumbbell, Heart, Shield, LogOut,
    ChevronRight, Bell, Lock, Smartphone, Globe
} from 'lucide-react';

// ============================================================
//  PROFILE PAGE
// ============================================================
export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'timeline' | 'stats' | 'settings'>('stats');

    // Mock user data
    const user = {
        name: 'Thanh Phạm',
        email: 'thanh@htstrength.com',
        avatar: '🧑‍💪',
        joinDate: 'Jan 2024',
        totalCalories: 246000,
        followers: 682,
        workoutsCompleted: 156,
        currentStreak: 12,
        bestStreak: 30,
        level: 'Elite',
        bio: 'Fitness enthusiast | HT Strength member | 🏋️ Lifting heavy things since 2020',
    };

    const stats = [
        { label: 'Total Workouts', value: user.workoutsCompleted, icon: <Dumbbell size={14} className="text-orange-400" /> },
        { label: 'Total Calories', value: `${(user.totalCalories / 1000).toFixed(0)}k`, icon: <Flame size={14} className="text-red-400" /> },
        { label: 'Current Streak', value: `${user.currentStreak}d`, icon: <Award size={14} className="text-yellow-400" /> },
        { label: 'Member Since', value: user.joinDate, icon: <Calendar size={14} className="text-blue-400" /> },
    ];

    const recentActivities = [
        { type: 'workout', title: 'Indoor Run', subtitle: '24 min • 5.56 km', calories: 348, icon: '🏃', color: '#EC4899' },
        { type: 'workout', title: 'Outdoor Cycle', subtitle: '24 min • 4.22 km', calories: 248, icon: '🚴', color: '#8B5CF6' },
        { type: 'workout', title: 'Upper Body', subtitle: '45 min • 12 exercises', calories: 420, icon: '💪', color: '#F59E0B' },
        { type: 'meditation', title: 'Morning Mindfulness', subtitle: '10 min', calories: 0, icon: '🧘', color: '#22C55E' },
    ];

    const settingsItems = [
        { icon: <Bell size={16} />, label: 'Notifications', desc: 'Push, email, reminders', color: '#EF4444' },
        { icon: <Lock size={16} />, label: 'Privacy & Security', desc: 'Password, 2FA, data', color: '#6366F1' },
        { icon: <Heart size={16} />, label: 'Health Integrations', desc: 'Apple Health, Google Fit', color: '#EC4899' },
        { icon: <Smartphone size={16} />, label: 'Connected Devices', desc: 'Fitbit, Oura Ring, WHOOP', color: '#22C55E' },
        { icon: <Globe size={16} />, label: 'Language & Region', desc: 'Vietnamese, UTC+7', color: '#F59E0B' },
        { icon: <Shield size={16} />, label: 'Data Privacy', desc: 'Download, delete data', color: '#3B82F6' },
    ];

    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a1a' }}>
            {/* Profile Header */}
            <div className="relative px-4 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm cursor-pointer">✕</span>
                    <Settings size={20} className="text-gray-400 cursor-pointer" />
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))', border: '3px solid rgba(99,102,241,0.3)' }}>
                            {user.avatar}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                            <Camera size={14} className="text-white" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <p className="text-gray-500 text-xs mt-1">{user.bio}</p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-8 mt-4">
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <Flame size={14} className="text-orange-400" />
                                <span className="text-white font-bold">{(user.totalCalories / 1000).toFixed(0)}k</span>
                            </div>
                            <p className="text-gray-500 text-[10px]">Total calories</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <User size={14} className="text-blue-400" />
                                <span className="text-white font-bold">{user.followers}</span>
                            </div>
                            <p className="text-gray-500 text-[10px]">Followers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Toggle */}
            <div className="px-4 mb-4">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {(['timeline', 'stats', 'settings'] as const).map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                            style={{
                                background: activeTab === t ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                                color: activeTab === t ? '#fff' : '#6B7280',
                            }}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
                <div className="px-4 space-y-3">
                    <h3 className="text-white font-semibold text-sm mb-2">Recent Activity</h3>
                    {recentActivities.map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="flex items-center gap-3 p-3 rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                style={{ background: `${a.color}15` }}>{a.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold">{a.title}</p>
                                <p className="text-gray-500 text-xs">{a.subtitle}</p>
                            </div>
                            {a.calories > 0 && (
                                <div className="text-right flex-shrink-0">
                                    <p className="text-orange-400 font-bold text-sm">{a.calories}</p>
                                    <p className="text-gray-600 text-[10px]">kcal</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
                <div className="px-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {stats.map((s, i) => (
                            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                                className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center gap-2 mb-2">{s.icon}</div>
                                <p className="text-2xl font-black text-white">{s.value}</p>
                                <p className="text-gray-500 text-xs">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Level Badge */}
                    <div className="rounded-2xl p-4 text-center"
                        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <span className="text-4xl">🏆</span>
                        <p className="text-white font-bold text-lg mt-2">Level: {user.level}</p>
                        <p className="text-gray-400 text-xs">Top 5% of all HT Strength members</p>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="px-4 space-y-2">
                    {settingsItems.map((item, i) => (
                        <motion.button key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                            className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold">{item.label}</p>
                                <p className="text-gray-500 text-xs">{item.desc}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
                        </motion.button>
                    ))}

                    <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl mt-4"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <LogOut size={16} className="text-red-400" />
                        <span className="text-red-400 font-semibold text-sm">Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    );
}
