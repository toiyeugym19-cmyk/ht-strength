import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, MusicNotes, Waveform, Wind, Brain, Leaf, Sparkle, Heart, Moon, Waves, Tree, Mountains, SunHorizon } from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================================
//  MEDITATION PAGE — Premium Redesign 2026
//  Compact boxes, vibrant colors, immersive feel
// ============================================================

const MOODIST_URL = 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds';

const SOUND_FILES: Record<string, string> = {
    rain: '/sounds/rain.mp3',
    ocean: '/sounds/ocean.mp3',
    forest: '/sounds/forest.mp3',
    fire: '/sounds/fire.mp3',
    wind: '/sounds/wind.mp3',
    bowl: '/sounds/singing-bowl.mp3',
    temple: '/sounds/temple.mp3',
    church: '/sounds/church.mp3',
    birds: '/sounds/birds.mp3',
    crickets: '/sounds/crickets.mp3',
    river: '/sounds/river.mp3',
    waterfall: '/sounds/waterfall.mp3',
    thunder: '/sounds/thunder.mp3',
    chimes: '/sounds/wind-chimes.mp3',
    night: '/sounds/night-village.mp3',
    droplets: '/sounds/droplets.mp3',
    coffee: 'https://raw.githubusercontent.com/ashishlotake/Focusly/main/public/sounds/coffee-shop.mp3',
    train: 'https://raw.githubusercontent.com/ashishlotake/Focusly/main/public/sounds/train.mp3',
    white: `${MOODIST_URL}/noise/white-noise.wav`,
    pink: `${MOODIST_URL}/noise/pink-noise.wav`,
    brown: `${MOODIST_URL}/noise/brown-noise.wav`,
    alpha: `${MOODIST_URL}/binaural/binaural-alpha.wav`,
    beta: `${MOODIST_URL}/binaural/binaural-beta.wav`,
    delta: `${MOODIST_URL}/binaural/binaural-delta.wav`,
    gamma: `${MOODIST_URL}/binaural/binaural-gamma.wav`,
    theta: `${MOODIST_URL}/binaural/binaural-theta.wav`,
    mm_om: '/sounds/meditative-mind/om-chanting.ogg',
    mm_432deep: '/sounds/meditative-mind/compressed_432hz-deep-healing.mp3',
    mm_432spark: '/sounds/meditative-mind/432hz-spark.ogg',
    mm_ancient: '/sounds/meditative-mind/ancient-healing.ogg',
    mm_oasis: '/sounds/meditative-mind/cosmic-oasis.ogg',
    mm_alphaheal: '/sounds/meditative-mind/alpha-waves-heal.ogg',
    mm_angelic: '/sounds/meditative-mind/angelic-healing.ogg',
    mm_detox: '/sounds/meditative-mind/detox-cleanse.ogg',
    mm_nammyoho: '/sounds/meditative-mind/nam-myoho.ogg',
    mm_tibetan: '/sounds/meditative-mind/tibetan-healing.ogg',
    mm_chakra: '/sounds/meditative-mind/chakra-healing.ogg',
    mm_shores: '/sounds/meditative-mind/cosmic-shores.ogg',
};

const SOUND_GROUPS = [
    {
        label: 'Zen Center', color: '#BF5AF2', sounds: [
            { id: 'mm_om', emoji: '🧘‍♂️', name: 'OM Chanting' },
            { id: 'mm_432deep', emoji: '✨', name: '432Hz Deep' },
            { id: 'mm_angelic', emoji: '👼', name: 'Angelic' },
            { id: 'mm_tibetan', emoji: '🪘', name: 'Tibetan' },
            { id: 'mm_chakra', emoji: '🌈', name: 'Chakra' },
            { id: 'mm_ancient', emoji: '⏳', name: 'Ancient' },
            { id: 'mm_nammyoho', emoji: '🌧️', name: 'Nam Myoho' },
            { id: 'mm_oasis', emoji: '🌌', name: 'Oasis' },
            { id: 'mm_shores', emoji: '🏖️', name: 'Shores' },
            { id: 'mm_alphaheal', emoji: '🧠', name: 'Alpha' },
            { id: 'mm_432spark', emoji: '⚡', name: '432Hz Spark' },
            { id: 'mm_detox', emoji: '🌿', name: 'Detox' },
        ]
    },
    {
        label: 'Tần Số Não', color: '#0A84FF', sounds: [
            { id: 'alpha', emoji: '🪷', name: 'Alpha' },
            { id: 'beta', emoji: '⚡', name: 'Beta' },
            { id: 'theta', emoji: '🌊', name: 'Theta' },
            { id: 'delta', emoji: '🛌', name: 'Delta' },
            { id: 'gamma', emoji: '👁️', name: 'Gamma' },
        ]
    },
    {
        label: 'Noise', color: '#FF9F0A', sounds: [
            { id: 'white', emoji: '📻', name: 'White' },
            { id: 'pink', emoji: '🌸', name: 'Pink' },
            { id: 'brown', emoji: '🐻', name: 'Brown' },
        ]
    },
    {
        label: 'Tự Nhiên', color: '#30D158', sounds: [
            { id: 'rain', emoji: '🌧️', name: 'Mưa' },
            { id: 'forest', emoji: '🌲', name: 'Rừng' },
            { id: 'ocean', emoji: '🌊', name: 'Biển' },
            { id: 'fire', emoji: '🔥', name: 'Lửa' },
            { id: 'wind', emoji: '🍃', name: 'Gió' },
            { id: 'thunder', emoji: '⛈️', name: 'Sấm' },
            { id: 'river', emoji: '🏞️', name: 'Suối' },
            { id: 'waterfall', emoji: '💦', name: 'Thác' },
            { id: 'droplets', emoji: '💧', name: 'Giọt' },
        ]
    },
    {
        label: 'Sinh Vật', color: '#FF375F', sounds: [
            { id: 'birds', emoji: '🦅', name: 'Chim' },
            { id: 'crickets', emoji: '🦗', name: 'Dế' },
            { id: 'night', emoji: '🌙', name: 'Đêm' },
        ]
    },
    {
        label: 'Không Gian', color: '#64D2FF', sounds: [
            { id: 'bowl', emoji: '🔔', name: 'Chuông' },
            { id: 'temple', emoji: '🏯', name: 'Chùa' },
            { id: 'church', emoji: '⛪', name: 'Nhà Thờ' },
            { id: 'chimes', emoji: '🎐', name: 'Gió' },
            { id: 'coffee', emoji: '☕', name: 'Cà Phê' },
            { id: 'train', emoji: '🚆', name: 'Tàu' },
        ]
    }
];

const TIME_SESSIONS = [
    { duration: 5, label: 'Tập Trung', icon: Brain, color: '#0A84FF', gradient: 'linear-gradient(135deg, #0A84FF, #5AC8FA)' },
    { duration: 10, label: 'Thư Giãn', icon: Leaf, color: '#30D158', gradient: 'linear-gradient(135deg, #30D158, #22C55E)' },
    { duration: 15, label: 'Tĩnh Tâm', icon: Wind, color: '#64D2FF', gradient: 'linear-gradient(135deg, #64D2FF, #0A84FF)' },
    { duration: 20, label: 'Phục Hồi', icon: Sparkle, color: '#FF9F0A', gradient: 'linear-gradient(135deg, #FF9F0A, #FFD60A)' },
    { duration: 25, label: 'Từ Tâm', icon: Heart, color: '#FF375F', gradient: 'linear-gradient(135deg, #FF375F, #FF6B8A)' },
    { duration: 30, label: 'Xóa Âu Lo', icon: Moon, color: '#BF5AF2', gradient: 'linear-gradient(135deg, #BF5AF2, #AF52DE)' },
    { duration: 45, label: 'Cool-down', icon: Waves, color: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE)' },
    { duration: 60, label: 'Tự Nhiên', icon: Tree, color: '#22C55E', gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)' },
    { duration: 90, label: 'Thiền Sâu', icon: Mountains, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { duration: 120, label: 'Giác Ngộ', icon: SunHorizon, color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #F97316)' },
];

const STORAGE_KEY = 'ht-meditation-log';
function getMeditationLog() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

const stagger = { show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 500, damping: 35 } } };

export default function MeditationPage() {
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSounds, setActiveSounds] = useState<Record<string, { audio: HTMLAudioElement; volume: number }>>({});

    const intervalRef = useRef<number | null>(null);

    const log = useMemo(() => getMeditationLog(), [selectedDuration]);
    const todayMinutes = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return log.filter((l: any) => l.date.startsWith(today)).reduce((s: number, l: any) => s + l.minutes, 0);
    }, [log]);
    const totalMinutes = useMemo(() => log.reduce((s: number, l: any) => s + l.minutes, 0), [log]);

    useEffect(() => {
        document.title = 'Tĩnh tâm & Thiền định | HT-STRENGTH';
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Trải nghiệm thiền định, nhạc sóng não và âm thanh thiên nhiên chất lượng cao.');
    }, []);

    const stopAllSounds = useCallback(() => {
        Object.values(activeSounds).forEach(s => { s.audio.pause(); s.audio.currentTime = 0; });
        setActiveSounds({});
    }, [activeSounds]);

    useEffect(() => {
        Object.values(activeSounds).forEach(s => {
            if (isPlaying) s.audio.play().catch(() => { });
            else s.audio.pause();
        });
    }, [isPlaying, activeSounds]);

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, timeLeft > 0]);

    useEffect(() => {
        if (timeLeft === 0 && isPlaying && selectedDuration !== null) {
            setIsPlaying(false);
            stopAllSounds();
            const minutesToLog = selectedDuration;
            const currentLog = getMeditationLog();
            currentLog.push({ date: new Date().toISOString(), minutes: minutesToLog });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLog));
            toast.success(`🧘 Hoàn thành ${minutesToLog} phút thiền!`);
            setSelectedDuration(null);
        }
    }, [timeLeft, isPlaying, selectedDuration, stopAllSounds]);

    const startTimer = useCallback((min: number) => {
        setSelectedDuration(min);
        setTimeLeft(min * 60);
        setIsPlaying(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const endSessionEarly = useCallback(() => {
        setIsPlaying(false);
        stopAllSounds();
        setSelectedDuration(null);
    }, [stopAllSounds]);

    const toggleSound = useCallback((id: string) => {
        const next = { ...activeSounds };
        if (next[id]) {
            next[id].audio.pause();
            delete next[id];
            setActiveSounds(next);
            return;
        }

        const musicIds = SOUND_GROUPS[0].sounds.map(s => s.id);
        const isMusic = musicIds.includes(id);

        if (isMusic) {
            Object.keys(next).forEach(activeId => {
                next[activeId].audio.pause();
                delete next[activeId];
            });
        } else {
            Object.keys(next).forEach(activeId => {
                if (musicIds.includes(activeId)) {
                    next[activeId].audio.pause();
                    delete next[activeId];
                }
            });
        }

        if (Object.keys(next).length >= 5) {
            toast.error('Chỉ được mix tối đa 5 âm!');
            return;
        }

        const isExternal = SOUND_FILES[id].startsWith('http');
        const baseUrl = isExternal ? SOUND_FILES[id] : window.location.origin + SOUND_FILES[id];
        const bypassUrl = baseUrl + `?type=.html&idm_bypass=true&cb=${Date.now()}`;

        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.src = bypassUrl;
        audio.loop = true;
        audio.volume = 0.5;

        if (isPlaying) {
            audio.play().catch((err) => {
                console.warn("Lỗi phát nhạc:", err);
            });
        }

        next[id] = { audio, volume: 0.5 };
        setActiveSounds(next);
    }, [activeSounds, isPlaying]);

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const secs = s % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const MUSIC_GROUP = SOUND_GROUPS[0];
    const AMBIENT_GROUPS = SOUND_GROUPS.slice(1);

    return (
        <div style={{ minHeight: '100%', paddingBottom: 120, fontFamily: 'Inter, -apple-system, sans-serif' }}>
            <AnimatePresence mode="wait">
                {selectedDuration === null ? (
                    <motion.div
                        key="list"
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ padding: '8px var(--g-page-x) 0' }}
                    >
                        {/* ── HERO HEADER ── */}
                        <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
                            <h1 style={{
                                fontSize: 28, fontWeight: 700, color: 'var(--g-text)',
                                letterSpacing: '-0.5px', margin: '0 0 12px'
                            }}>
                                Tĩnh tâm 🧘
                            </h1>

                            {/* Stats Row */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <div style={{
                                    flex: 1, borderRadius: 16, padding: '14px 16px',
                                    background: 'linear-gradient(135deg, #BF5AF2, #8B5CF6)',
                                    textAlign: 'center', position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -10, top: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                                    <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>Hôm nay</p>
                                    <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{todayMinutes}</span>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginLeft: 3 }}>phút</span>
                                </div>
                                <div style={{
                                    flex: 1, borderRadius: 16, padding: '14px 16px',
                                    background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
                                    textAlign: 'center', position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', right: -10, top: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                                    <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>Tổng cộng</p>
                                    <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{totalMinutes}</span>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginLeft: 3 }}>phút</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── DURATION GRID — Compact Colorful Cards ── */}
                        <motion.div variants={fadeUp}>
                            <h2 style={{
                                fontSize: 18, fontWeight: 700, color: 'var(--g-text)',
                                letterSpacing: '-0.3px', margin: '0 0 10px'
                            }}>
                                Chọn thời gian
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                                {TIME_SESSIONS.map((s) => (
                                    <motion.button
                                        key={s.duration}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={() => startTimer(s.duration)}
                                        style={{
                                            background: 'var(--g-surface)',
                                            border: '1px solid var(--g-border)',
                                            borderRadius: 16, padding: '12px 6px',
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', gap: 6,
                                            cursor: 'pointer', transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: 38, height: 38, borderRadius: 12,
                                            background: s.gradient,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: `0 4px 12px ${s.color}30`
                                        }}>
                                            <s.icon size={20} weight="fill" color="white" />
                                        </div>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--g-text)', lineHeight: 1 }}>
                                            {s.duration}
                                        </span>
                                        <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--g-text-3)', textAlign: 'center', lineHeight: 1.2 }}>
                                            {s.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    /* ── PAGE 2: PLAYER & MIXER ── */
                    <motion.div
                        key="player"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
                        style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative', marginTop: -8 }}
                    >
                        {/* ── TIMER SECTION ── */}
                        <div style={{
                            width: '100%', margin: '8px var(--g-page-x) 0',
                            background: 'var(--g-surface)', backdropFilter: 'blur(40px)',
                            borderRadius: 28, padding: '28px 24px 32px',
                            border: '1px solid var(--g-border)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            position: 'relative', maxWidth: 'calc(100% - 2 * var(--g-page-x))'
                        }}>
                            <button
                                onClick={endSessionEarly}
                                style={{
                                    position: 'absolute', top: 16, left: 16,
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'var(--g-surface-3)', border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'var(--g-text-2)'
                                }}
                            >
                                <X size={18} weight="bold" />
                            </button>

                            <div style={{
                                fontSize: 72, fontWeight: 800, letterSpacing: '-2px',
                                fontVariantNumeric: 'tabular-nums',
                                color: 'var(--g-text)', marginBottom: 20, marginTop: 8,
                                fontFamily: 'SF Mono, Menlo, monospace'
                            }}>
                                {formatTime(timeLeft)}
                            </div>

                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                style={{
                                    width: 72, height: 72, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
                                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 28px rgba(10,132,255,0.4)',
                                    cursor: 'pointer', color: 'white'
                                }}
                            >
                                {isPlaying ? <Pause size={36} weight="fill" /> : <Play size={36} weight="fill" style={{ marginLeft: 4 }} />}
                            </button>
                        </div>

                        {/* ── SOUND MIXER ── */}
                        <div style={{ flex: 1, width: '100%', padding: '20px var(--g-page-x) 120px' }}>

                            {/* NHẠC THIỀN — Compact Grid */}
                            <div style={{
                                background: 'var(--g-surface)', borderRadius: 20,
                                padding: '14px 14px 16px', marginBottom: 14,
                                border: '1px solid var(--g-border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8,
                                        background: '#BF5AF2', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <MusicNotes size={14} weight="fill" color="white" />
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--g-text)' }}>
                                        Nhạc Thiền
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                                    {MUSIC_GROUP.sounds.map(s => {
                                        const isActive = !!activeSounds[s.id];
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => toggleSound(s.id)}
                                                style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                    gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: 0
                                                }}
                                            >
                                                <div style={{
                                                    width: '100%', aspectRatio: '1', borderRadius: 12,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 20, transition: 'all 0.2s ease',
                                                    background: isActive ? '#BF5AF2' : 'var(--g-surface-3)',
                                                    boxShadow: isActive ? '0 4px 14px rgba(191,90,242,0.4)' : 'none',
                                                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                                }}>
                                                    {s.emoji}
                                                </div>
                                                <span style={{
                                                    fontSize: 8, fontWeight: 600, textAlign: 'center',
                                                    lineHeight: 1.1, color: isActive ? '#BF5AF2' : 'var(--g-text-3)',
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    width: '100%'
                                                }}>
                                                    {s.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ÂM THANH MIX — Compact Groups */}
                            <div style={{
                                background: 'var(--g-surface)', borderRadius: 20,
                                padding: '14px 14px 16px',
                                border: '1px solid var(--g-border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8,
                                        background: '#30D158', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Waveform size={14} weight="fill" color="white" />
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--g-text)' }}>
                                        Âm Thanh Mix
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {AMBIENT_GROUPS.map(group => (
                                        <div key={group.label}>
                                            <p style={{
                                                fontSize: 10, fontWeight: 700, color: group.color,
                                                textTransform: 'uppercase', letterSpacing: '0.5px',
                                                margin: '0 0 6px 2px'
                                            }}>
                                                {group.label}
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                                                {group.sounds.map(s => {
                                                    const isActive = !!activeSounds[s.id];
                                                    return (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => toggleSound(s.id)}
                                                            style={{
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                                gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: 0
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: '100%', aspectRatio: '1', borderRadius: 12,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: 20, transition: 'all 0.2s ease',
                                                                background: isActive ? group.color : 'var(--g-surface-3)',
                                                                boxShadow: isActive ? `0 4px 14px ${group.color}40` : 'none',
                                                                transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                                            }}>
                                                                {s.emoji}
                                                            </div>
                                                            <span style={{
                                                                fontSize: 8, fontWeight: 600, textAlign: 'center',
                                                                lineHeight: 1.1, color: isActive ? group.color : 'var(--g-text-3)',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                                width: '100%'
                                                            }}>
                                                                {s.name}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
