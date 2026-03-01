import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Wind, Brain, Heart, Leaf, Waves, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================
//  MEDITATION PAGE — Mibro Fit Dark Theme (Functional Timer)
// ============================================================

const SESSIONS = [
    { id: 'focus', label: 'Tập trung', icon: Brain, color: '#0A84FF', dimColor: 'rgba(10,132,255,0.15)', duration: 300, desc: 'Tĩnh tâm, tập trung vào hơi thở' },
    { id: 'relax', label: 'Thư giãn', icon: Leaf, color: '#30D158', dimColor: 'rgba(48,209,88,0.15)', duration: 600, desc: 'Giải tỏa căng thẳng sau buổi tập' },
    { id: 'sleep', label: 'Ngủ ngon', icon: Waves, color: '#BF5AF2', dimColor: 'rgba(191,90,242,0.15)', duration: 900, desc: 'Chuẩn bị cơ thể cho giấc ngủ sâu' },
    { id: 'breathe', label: 'Box Breathing', icon: Wind, color: '#64D2FF', dimColor: 'rgba(100,210,255,0.15)', duration: 240, desc: '4-4-4-4 hít-giữ-thở-giữ' },
    { id: 'calm', label: 'Bình yên', icon: Heart, color: '#FF375F', dimColor: 'rgba(255,55,95,0.15)', duration: 420, desc: 'Thiền yêu thương & lòng biết ơn' },
];

const STORAGE_KEY = 'ht-meditation-log';
function getMeditationLog(): { date: string; minutes: number; session: string }[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function addMeditationLog(minutes: number, sessionId: string) {
    const log = getMeditationLog();
    log.push({ date: new Date().toISOString(), minutes, session: sessionId });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export default function MeditationPage() {
    const [activeSession, setActiveSession] = useState<typeof SESSIONS[0] | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [totalDuration, setTotalDuration] = useState(0);
    const [customMinutes, setCustomMinutes] = useState('');
    const intervalRef = useRef<number | null>(null);

    // Total meditation minutes
    const log = getMeditationLog();
    const totalMinutes = log.reduce((s, l) => s + l.minutes, 0);
    const todayMinutes = log.filter(l => l.date.startsWith(new Date().toISOString().split('T')[0]))
        .reduce((s, l) => s + l.minutes, 0);

    const startSession = (session: typeof SESSIONS[0], customDuration?: number) => {
        const dur = customDuration || session.duration;
        setActiveSession(session);
        setTimeLeft(dur);
        setTotalDuration(dur);
        setIsPlaying(true);
    };

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying && activeSession) {
            setIsPlaying(false);
            const minutes = Math.round(totalDuration / 60);
            addMeditationLog(minutes, activeSession.id);
            toast.success(`🧘 Hoàn thành ${minutes} phút thiền!`);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, timeLeft]);

    const togglePause = () => setIsPlaying(!isPlaying);
    const resetTimer = () => { setIsPlaying(false); setTimeLeft(totalDuration); };
    const exitSession = () => { setIsPlaying(false); setActiveSession(null); setTimeLeft(0); };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

    const ringSize = 220;
    const strokeW = 8;
    const radius = (ringSize - strokeW) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

    // Breathing animation for box breathing
    const [breathPhase, setBreathPhase] = useState(0); // 0-3: hít, giữ, thở, giữ
    useEffect(() => {
        if (!isPlaying || activeSession?.id !== 'breathe') return;
        const id = setInterval(() => setBreathPhase(p => (p + 1) % 4), 4000);
        return () => clearInterval(id);
    }, [isPlaying, activeSession]);
    const breathLabels = ['Hít vào...', 'Giữ...', 'Thở ra...', 'Giữ...'];

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ background: 'var(--bg-app)' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 pt-6 space-y-5">

                <motion.div variants={fadeUp}>
                    <h1 className="text-2xl font-bold">Thiền định</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Thư giãn tinh thần, phục hồi cơ thể</p>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <Clock size={16} className="text-[#BF5AF2] mb-2" />
                        <p className="text-xl font-bold">{todayMinutes}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Phút hôm nay</p>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <Brain size={16} className="text-[#0A84FF] mb-2" />
                        <p className="text-xl font-bold">{totalMinutes}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Tổng phút thiền</p>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!activeSession ? (
                        /* Session List */
                        <motion.div key="list" variants={fadeUp} className="space-y-3">
                            <h2 className="text-base font-bold">Chọn bài thiền</h2>
                            {SESSIONS.map(s => (
                                <motion.button key={s.id} whileTap={{ scale: 0.97 }}
                                    onClick={() => startSession(s)}
                                    className="w-full rounded-2xl p-4 flex items-center gap-4 text-left"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.dimColor }}>
                                        <s.icon size={22} style={{ color: s.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{s.label}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: s.color }}>{Math.round(s.duration / 60)} phút</span>
                                </motion.button>
                            ))}

                            {/* Custom timer */}
                            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <p className="text-sm font-semibold mb-2">Tuỳ chỉnh thời gian</p>
                                <div className="flex gap-2">
                                    <input type="number" value={customMinutes} onChange={e => setCustomMinutes(e.target.value)}
                                        placeholder="Số phút" className="input-clean flex-1 !py-2.5" />
                                    <button onClick={() => {
                                        const m = parseInt(customMinutes);
                                        if (m > 0) startSession(SESSIONS[0], m * 60);
                                    }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                                        style={{ background: '#BF5AF2' }}>Bắt đầu</button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Active Session */
                        <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center pt-4 space-y-6">

                            {/* Timer Ring */}
                            <div className="relative" style={{ width: ringSize, height: ringSize }}>
                                <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                        fill="none" stroke={`${activeSession.color}20`} strokeWidth={strokeW} />
                                    <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                        fill="none" stroke={activeSession.color} strokeWidth={strokeW} strokeLinecap="round"
                                        strokeDasharray={circumference} strokeDashoffset={offset}
                                        style={{ transition: 'stroke-dashoffset 1s linear' }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold tracking-wider" style={{ color: activeSession.color }}>
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{activeSession.label}</span>
                                    {activeSession.id === 'breathe' && isPlaying && (
                                        <motion.span key={breathPhase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="text-sm mt-2 font-medium" style={{ color: activeSession.color }}>
                                            {breathLabels[breathPhase]}
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            {/* Breathing animation circle */}
                            {activeSession.id === 'breathe' && isPlaying && (
                                <motion.div
                                    animate={{ scale: breathPhase === 0 ? 1.3 : breathPhase === 2 ? 0.7 : 1 }}
                                    transition={{ duration: 3.5, ease: 'easeInOut' }}
                                    className="w-16 h-16 rounded-full"
                                    style={{ background: `${activeSession.color}30`, border: `2px solid ${activeSession.color}` }} />
                            )}

                            {/* Controls */}
                            <div className="flex items-center gap-5">
                                <motion.button whileTap={{ scale: 0.9 }} onClick={resetTimer}
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <RotateCcw size={20} style={{ color: 'var(--text-secondary)' }} />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={togglePause}
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-white"
                                    style={{ background: activeSession.color, boxShadow: `0 8px 24px ${activeSession.color}40` }}>
                                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={exitSession}
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(255,55,95,0.1)', border: '1px solid rgba(255,55,95,0.2)' }}>
                                    <span className="text-[#FF375F] text-sm font-bold">✕</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
