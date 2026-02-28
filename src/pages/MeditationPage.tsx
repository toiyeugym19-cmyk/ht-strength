import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Wind, Heart, Moon, Sparkles, Play, Pause, RotateCcw,
    Clock, Headphones, Leaf, Brain, Volume2
} from 'lucide-react';

// ============================================================
//  MEDITATION SESSIONS DATA
// ============================================================
const SESSIONS = [
    { id: 'morning', title: 'Morning Mindfulness', duration: 300, icon: '🌅', color: '#F59E0B', category: 'mindfulness', description: 'Start your day with clarity and intention' },
    { id: 'breathing', title: 'Deep Breathing', duration: 180, icon: '🌬️', color: '#06B6D4', category: 'breathing', description: 'Box breathing for stress relief' },
    { id: 'focus', title: 'Focus Flow', duration: 600, icon: '🧠', color: '#8B5CF6', category: 'focus', description: 'Enhance concentration and mental clarity' },
    { id: 'sleep', title: 'Sleep Meditation', duration: 900, icon: '🌙', color: '#6366F1', category: 'sleep', description: 'Drift into deep, restful sleep' },
    { id: 'body-scan', title: 'Body Scan', duration: 480, icon: '🧘', color: '#EC4899', category: 'mindfulness', description: 'Release tension from head to toe' },
    { id: 'gratitude', title: 'Gratitude Practice', duration: 300, icon: '🙏', color: '#22C55E', category: 'mindfulness', description: 'Cultivate thankfulness and joy' },
    { id: 'energy', title: 'Energy Boost', duration: 240, icon: '⚡', color: '#FF6B00', category: 'breathing', description: 'Energizing breathwork for vitality' },
    { id: 'post-workout', title: 'Post-Workout Calm', duration: 420, icon: '🏋️', color: '#EF4444', category: 'recovery', description: 'Cool down mind and body after training' },
];

const CATEGORIES = [
    { id: 'all', label: 'All', icon: <Sparkles size={14} /> },
    { id: 'mindfulness', label: 'Mindfulness', icon: <Leaf size={14} /> },
    { id: 'breathing', label: 'Breathing', icon: <Wind size={14} /> },
    { id: 'focus', label: 'Focus', icon: <Brain size={14} /> },
    { id: 'sleep', label: 'Sleep', icon: <Moon size={14} /> },
    { id: 'recovery', label: 'Recovery', icon: <Heart size={14} /> },
];

// ============================================================
//  MEDITATION PAGE
// ============================================================
export default function MeditationPage() {
    const [category, setCategory] = useState('all');
    const [activeSession, setActiveSession] = useState<typeof SESSIONS[0] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const intervalRef = useRef<number | null>(null);

    const filtered = category === 'all' ? SESSIONS : SESSIONS.filter(s => s.category === category);

    useEffect(() => {
        if (isPlaying && activeSession) {
            intervalRef.current = window.setInterval(() => {
                setElapsed(prev => {
                    if (prev >= activeSession.duration) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, activeSession]);

    // Breathing animation cycle (4-4-4-4 box breathing)
    useEffect(() => {
        if (!isPlaying || !activeSession?.category.includes('breathing')) return;
        const cycle = elapsed % 16;
        if (cycle < 4) setBreathPhase('inhale');
        else if (cycle < 8) setBreathPhase('hold');
        else if (cycle < 12) setBreathPhase('exhale');
        else setBreathPhase('rest');
    }, [elapsed, isPlaying, activeSession]);

    const startSession = (session: typeof SESSIONS[0]) => {
        setActiveSession(session);
        setElapsed(0);
        setIsPlaying(true);
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    if (activeSession) {
        const progress = elapsed / activeSession.duration;
        const remaining = activeSession.duration - elapsed;
        const isBreathing = activeSession.category === 'breathing';

        return (
            <motion.div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: `radial-gradient(ellipse at 50% 30%, ${activeSession.color}15, #0a0a1a 70%)` }}>

                {/* Ambient circles */}
                <motion.div className="absolute w-96 h-96 rounded-full opacity-10"
                    animate={{ scale: isPlaying ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ background: `radial-gradient(${activeSession.color}, transparent)` }} />

                {/* Session Info */}
                <button onClick={() => { setActiveSession(null); setIsPlaying(false); }}
                    className="absolute top-6 left-4 text-gray-400 text-sm">← Back</button>

                <span className="text-5xl mb-4 relative z-10">{activeSession.icon}</span>
                <h2 className="text-white font-bold text-xl mb-1 relative z-10">{activeSession.title}</h2>
                <p className="text-gray-400 text-sm mb-8 relative z-10">{activeSession.description}</p>

                {/* Breathing Circle */}
                {isBreathing && isPlaying && (
                    <div className="mb-6 relative z-10">
                        <motion.div
                            className="w-32 h-32 rounded-full flex items-center justify-center"
                            animate={{
                                scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'exhale' ? 0.8 : 1.1,
                            }}
                            transition={{ duration: 4, ease: 'easeInOut' }}
                            style={{ background: `${activeSession.color}20`, border: `2px solid ${activeSession.color}40` }}
                        >
                            <span className="text-white text-sm font-semibold capitalize">{breathPhase}</span>
                        </motion.div>
                    </div>
                )}

                {/* Timer */}
                <div className="relative z-10 mb-8">
                    <div className="relative w-56 h-56 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                            <motion.circle cx="50" cy="50" r="44" fill="none"
                                stroke={activeSession.color} strokeWidth="3" strokeLinecap="round"
                                strokeDasharray={`${progress * 276} 276`}
                                animate={{ strokeDasharray: `${progress * 276} 276` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-white">{formatTime(remaining)}</span>
                            <span className="text-gray-500 text-xs mt-1">remaining</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 relative z-10">
                    <motion.button whileTap={{ scale: 0.9 }}
                        onClick={() => { setElapsed(0); }}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <RotateCcw size={18} className="text-gray-400" />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${activeSession.color}, ${activeSession.color}CC)` }}>
                        {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <Volume2 size={18} className="text-gray-400" />
                    </motion.button>
                </div>

                {elapsed >= activeSession.duration && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center relative z-10">
                        <p className="text-2xl mb-2">🎉</p>
                        <p className="text-white font-semibold">Session Complete!</p>
                        <p className="text-gray-400 text-sm">Great job staying present.</p>
                    </motion.div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a1a' }}>
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                        <Sparkles size={16} className="text-white" />
                    </div>
                    Meditation
                </h1>
                <p className="text-gray-500 text-xs mt-1">Find your inner peace</p>
            </div>

            {/* Featured Card */}
            <div className="px-4 mb-4">
                <motion.div whileTap={{ scale: 0.98 }}
                    onClick={() => startSession(SESSIONS[3])}
                    className="rounded-3xl p-5 relative overflow-hidden cursor-pointer"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
                        border: '1px solid rgba(99,102,241,0.2)',
                    }}>
                    <motion.div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
                        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }}
                        style={{ background: 'radial-gradient(#8B5CF6, transparent)' }} />
                    <span className="text-3xl">🌙</span>
                    <h3 className="text-white font-bold text-lg mt-2">Tonight's Sleep Session</h3>
                    <p className="text-gray-400 text-sm mt-1">15 min guided meditation for deep rest</p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="px-3 py-1 rounded-full text-xs font-semibold text-purple-300"
                            style={{ background: 'rgba(139,92,246,0.2)' }}>
                            <Clock size={10} className="inline mr-1" />15:00
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-semibold text-purple-300"
                            style={{ background: 'rgba(139,92,246,0.2)' }}>
                            <Headphones size={10} className="inline mr-1" />Guided
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Category Filter */}
            <div className="px-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {CATEGORIES.map(c => (
                        <button key={c.id} onClick={() => setCategory(c.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                            style={{
                                background: category === c.id ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.04)',
                                color: category === c.id ? '#fff' : '#6B7280',
                                border: `1px solid ${category === c.id ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                            }}>
                            {c.icon} {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Session Grid */}
            <div className="px-4 space-y-3">
                {filtered.map((s, i) => (
                    <motion.button key={s.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => startSession(s)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ background: `${s.color}15` }}>
                            {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{s.title}</p>
                            <p className="text-gray-500 text-xs truncate">{s.description}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Clock size={12} className="text-gray-500" />
                            <span className="text-gray-400 text-xs font-medium">{Math.floor(s.duration / 60)}m</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `${s.color}20` }}>
                            <Play size={14} style={{ color: s.color }} className="ml-0.5" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
