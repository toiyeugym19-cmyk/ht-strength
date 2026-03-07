import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlass, X, Barbell, Flame, Clock,
    Warning, Lightbulb, Shuffle, Plus,
    Heart, GridFour, Person, Lightning,
    CaretLeft, Play, Pause, SkipBack, SkipForward,
} from '@phosphor-icons/react';
import { EXERCISE_DB, type Exercise } from '../data/exerciseDB';
import { useHealthStore } from '../store/useHealthStore';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { toast } from 'sonner';

// Theme dynamic tokens
const LIBRARY_ACCENT = 'var(--g-accent)';
const LIBRARY_ACCENT_BG = 'var(--g-accent-dim)';
const LIBRARY_BG = 'var(--g-bg)';
const LIBRARY_TEXT = 'var(--g-text)';
const LIBRARY_TEXT_SECONDARY = 'var(--g-text-2)';
const LIBRARY_CARD_BG = 'var(--g-surface)';
const LIBRARY_CARD_BORDER = 'var(--g-border)';
const LIBRARY_CARD_SHADOW = 'var(--g-shadow-card)';

const MUSCLE_GROUPS: { id: string; label: string; icon: typeof GridFour; color: string }[] = [
    { id: 'all', label: 'Tất Cả', icon: GridFour, color: LIBRARY_ACCENT },
    { id: 'Ngực', label: 'Ngực', icon: Barbell, color: '#FF6B35' },
    { id: 'Lưng', label: 'Lưng', icon: Barbell, color: '#0A84FF' },
    { id: 'Chân', label: 'Chân', icon: Person, color: '#30D158' },
    { id: 'Vai', label: 'Vai', icon: Barbell, color: '#FF9F0A' },
    { id: 'Tay', label: 'Tay', icon: Barbell, color: '#BF5AF2' },
    { id: 'Bụng', label: 'Bụng', icon: Lightning, color: '#FF453A' },
    { id: 'FullBody', label: 'Full Body', icon: Lightning, color: '#64D2FF' },
    { id: 'Stretching', label: 'Giãn Cơ', icon: Person, color: '#8E8E93' },
];

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
    beginner: { label: 'Cơ bản', color: '#30D158' },
    intermediate: { label: 'Trung bình', color: '#FF9F0A' },
    advanced: { label: 'Nâng cao', color: '#FF453A' },
};

const FAVORITES_KEY = 'ht-exercise-favorites';

function getFavorites(): Set<string> {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) return new Set();
        const arr = JSON.parse(raw) as string[];
        return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
}

function setFavoritesStorage(ids: Set<string>) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
}

/** Ước tính thời gian (phút) từ suggestedSets + restSeconds */
function estimateDurationMinutes(ex: Exercise): number {
    const rest = ex.restSeconds ?? 60;
    const setsMatch = (ex.suggestedSets || '3×10').match(/(\d+)\s*[×x]\s*(\d+)/i);
    const sets = setsMatch ? parseInt(setsMatch[1], 10) : 3;
    const reps = setsMatch ? parseInt(setsMatch[2], 10) : 10;
    const secPerSet = Math.min(90, reps * 4) + rest;
    return Math.round((sets * secPerSet) / 60);
}

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };



// ═══════════════════════════════════════════════════════════
//  WORKOUT LIBRARY ROW — Thumbnail + Title + Duration + Heart (như ref)
// ═══════════════════════════════════════════════════════════
function WorkoutLibraryRow({
    ex,
    onSelect,
    color,
    isFavorite,
    onToggleFavorite,
}: {
    ex: Exercise;
    onSelect: () => void;
    color: string;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
}) {
    const mins = estimateDurationMinutes(ex);
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={onSelect}
            className="flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer active:scale-[0.99] transition-transform"
            style={{
                background: LIBRARY_CARD_BG,
                border: `1px solid ${LIBRARY_CARD_BORDER}`,
                boxShadow: LIBRARY_CARD_SHADOW,
            }}
        >
            <div
                className="w-[72px] h-[72px] rounded-xl flex-shrink-0 overflow-hidden"
                style={{ background: 'var(--g-surface-2)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
            >
                <ExerciseMedia
                    gifUrl={ex.gifUrl}
                    videoUrl={ex.videoUrl}
                    alt={ex.name}
                    color={color}
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold leading-tight line-clamp-1" style={{ color: LIBRARY_TEXT }}>
                    {ex.name}
                </p>
                <p className="text-[12px] mt-1" style={{ color: LIBRARY_TEXT_SECONDARY }}>
                    Duration: {mins} mins
                </p>
            </div>
            <button
                onClick={onToggleFavorite}
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                style={{ background: 'transparent' }}
                aria-label={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
                <Heart
                    size={22}
                    weight={isFavorite ? 'fill' : 'regular'}
                    style={{ color: isFavorite ? '#FF375F' : LIBRARY_TEXT_SECONDARY }}
                />
            </button>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════
//  EXERCISE DETAIL MODAL — GIF mô phỏng + Timer + Hướng dẫn
// ═══════════════════════════════════════════════════════════
function ExerciseDetailModal({
    ex,
    onClose,
}: {
    ex: Exercise;
    onClose: () => void;
}) {
    const [activeTab, setActiveTab] = useState<'guide' | 'mistakes' | 'variations'>('guide');
    const initialTimer = ex.restSeconds ?? 60;
    const [timerSec, setTimerSec] = useState(initialTimer);
    const [isPaused, setIsPaused] = useState(true);
    const muscle = ex.target.replace('Gym/', '');
    const groupInfo = MUSCLE_GROUPS.find(m => m.id === muscle);
    const color = groupInfo?.color || LIBRARY_ACCENT;
    const diff = DIFFICULTY_MAP[ex.difficulty] || DIFFICULTY_MAP.beginner;

    useEffect(() => {
        if (isPaused) return;
        const t = setInterval(() => {
            setTimerSec((s) => {
                if (s <= 0) return initialTimer;
                if (s === 1) {
                    toast.success('Hết giờ nghỉ! Bắt đầu hiệp tiếp theo.');
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [isPaused, initialTimer]);

    const progress = 1 - timerSec / initialTimer;

    const handleSkipBack = () => setTimerSec(initialTimer);
    const handleSkipForward = () => setTimerSec(0);
    const tabs = [
        { id: 'guide' as const, label: 'Hướng Dẫn' },
        { id: 'mistakes' as const, label: 'Lỗi Hay Gặp' },
        { id: 'variations' as const, label: 'Biến Thể' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex flex-col workout-library-detail"
            style={{ background: LIBRARY_BG, color: LIBRARY_TEXT }}
        >
            {/* Top bar: Back — nền trắng như hình */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${LIBRARY_CARD_BORDER}`, background: LIBRARY_BG }}>
                <button onClick={onClose} className="flex items-center gap-1 text-[15px] font-semibold" style={{ color: LIBRARY_ACCENT }}>
                    <CaretLeft size={22} weight="bold" /> Back
                </button>
                <span className="text-[13px] font-semibold" style={{ color: LIBRARY_TEXT_SECONDARY }}>Chi tiết bài tập</span>
                <div className="w-14" />
            </div>

            <div className="flex-1 overflow-y-auto pb-24" style={{ background: LIBRARY_BG }}>
                {/* Mô phỏng động tác — GIF nhỏ gọn, không vỡ hình */}
                <div
                    className="relative w-full flex items-center justify-center overflow-hidden py-3"
                    style={{ background: 'var(--g-surface-2)', minHeight: 160 }}
                >
                    {(ex.gifUrl || ex.videoUrl) ? (
                        <div className="w-full max-w-[240px] aspect-square flex items-center justify-center overflow-hidden rounded-2xl">
                            <ExerciseMedia
                                gifUrl={ex.gifUrl}
                                videoUrl={ex.videoUrl}
                                alt={ex.name}
                                color={color}
                                objectFit="contain"
                                className="w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: `${color}20` }}>
                            <Barbell size={48} weight="duotone" style={{ color }} />
                        </div>
                    )}
                </div>

                {/* Title */}
                <div className="px-5 -mt-2 relative z-10">
                    <h1 className="text-[22px] font-bold leading-tight" style={{ color: LIBRARY_TEXT }}>{ex.name}</h1>
                    {ex.nameEn && (
                        <p className="text-[13px] mt-1" style={{ color: LIBRARY_TEXT_SECONDARY }}>{ex.nameEn}</p>
                    )}
                </div>

                {/* Timer nghỉ giữa hiệp + nút điều khiển (có chức năng) */}
                <div className="px-5 mt-4 flex items-center gap-3">
                    <span className="text-[13px] font-medium tabular-nums min-w-[3ch]" style={{ color: LIBRARY_TEXT_SECONDARY }}>
                        {String(Math.floor(timerSec / 60)).padStart(2, '0')}:{String(timerSec % 60).padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--g-border)' }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: LIBRARY_ACCENT }}
                            initial={false}
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSkipBack}
                            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
                            style={{ background: '#F2F2F7' }}
                            title="Reset timer"
                        >
                            <SkipBack size={18} weight="bold" style={{ color: LIBRARY_TEXT_SECONDARY }} />
                        </button>
                        <button
                            onClick={() => setIsPaused((p) => !p)}
                            className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90"
                            style={{ background: LIBRARY_ACCENT, color: '#fff' }}
                            title={isPaused ? 'Bắt đầu đếm' : 'Tạm dừng'}
                        >
                            {isPaused ? <Play size={20} weight="fill" /> : <Pause size={20} weight="fill" />}
                        </button>
                        <button
                            onClick={handleSkipForward}
                            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
                            style={{ background: '#F2F2F7' }}
                            title="Bỏ qua (về 0)"
                        >
                            <SkipForward size={18} weight="bold" style={{ color: LIBRARY_TEXT_SECONDARY }} />
                        </button>
                    </div>
                </div>
                <p className="text-[11px] mt-1 px-5" style={{ color: LIBRARY_TEXT_SECONDARY }}>Timer nghỉ giữa hiệp ({initialTimer}s)</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 px-5">
                    <span className="px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: `${color}20`, color }}>
                        {ex.primaryMuscle || muscle}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: '#F2F2F7', color: LIBRARY_TEXT_SECONDARY }}>
                        {ex.equipment}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[12px] font-medium" style={{ background: `${diff.color}20`, color: diff.color }}>
                        {diff.label}
                    </span>
                </div>

                {/* Quick info */}
                <div className="mx-5 mt-4 rounded-2xl grid grid-cols-3 overflow-hidden" style={{ background: LIBRARY_CARD_BG, border: `1px solid ${LIBRARY_CARD_BORDER}` }}>
                    <div className="flex flex-col items-center py-3 gap-0.5" style={{ borderRight: `1px solid ${LIBRARY_CARD_BORDER}` }}>
                        <Barbell size={16} weight="duotone" style={{ color }} />
                        <span className="text-[13px] font-bold" style={{ color: LIBRARY_TEXT }}>{ex.suggestedSets || '3×10'}</span>
                        <span className="text-[9px] uppercase" style={{ color: LIBRARY_TEXT_SECONDARY }}>Sets × Reps</span>
                    </div>
                    <div className="flex flex-col items-center py-3 gap-0.5" style={{ borderRight: `1px solid ${LIBRARY_CARD_BORDER}` }}>
                        <Clock size={16} weight="duotone" style={{ color: LIBRARY_TEXT_SECONDARY }} />
                        <span className="text-[13px] font-bold" style={{ color: LIBRARY_TEXT }}>{ex.restSeconds ?? 60}s</span>
                        <span className="text-[9px] uppercase" style={{ color: LIBRARY_TEXT_SECONDARY }}>Nghỉ</span>
                    </div>
                    <div className="flex flex-col items-center py-3 gap-0.5">
                        <Flame size={16} weight="duotone" style={{ color: '#FF9F0A' }} />
                        <span className="text-[13px] font-bold" style={{ color: LIBRARY_TEXT }}>{ex.caloriesPer10Min ?? '~60'}</span>
                        <span className="text-[9px] uppercase" style={{ color: LIBRARY_TEXT_SECONDARY }}>Kcal/10p</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mx-5 mt-5">
                    <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--g-surface-2)', border: `1px solid ${LIBRARY_CARD_BORDER}` }}>
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className="flex-1 py-2.5 text-[13px] font-semibold transition-colors"
                                style={{
                                    background: activeTab === t.id ? LIBRARY_ACCENT : 'transparent',
                                    color: activeTab === t.id ? '#fff' : LIBRARY_TEXT_SECONDARY,
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content (rút gọn) */}
                <div className="px-5 mt-4">
                    <AnimatePresence mode="wait">
                        {activeTab === 'guide' && (
                            <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <ol className="space-y-3">
                                    {ex.instructions.map((step, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold" style={{ background: `${color}20`, color }}>{i + 1}</span>
                                            <span className="text-[14px] leading-relaxed pt-0.5" style={{ color: LIBRARY_TEXT }}>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                                {ex.tips && ex.tips.length > 0 && (
                                    <div className="mt-4 flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,214,10,0.12)' }}>
                                        <Lightbulb size={16} color="#FFD60A" weight="duotone" className="flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            {ex.tips.slice(0, 3).map((tip, i) => (
                                                <p key={i} className="text-[13px]" style={{ color: LIBRARY_TEXT }}>• {tip}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'mistakes' && (
                            <motion.div key="mistakes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {ex.commonMistakes?.length ? (
                                    <div className="space-y-2">
                                        {ex.commonMistakes.map((m, i) => (
                                            <div key={i} className="flex gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,59,48,0.08)' }}>
                                                <Warning size={16} color="#FF3B30" weight="duotone" className="flex-shrink-0 mt-0.5" />
                                                <p className="text-[13px]" style={{ color: LIBRARY_TEXT }}>{m}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[13px]" style={{ color: LIBRARY_TEXT_SECONDARY }}>Chưa có dữ liệu.</p>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'variations' && (
                            <motion.div key="variations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {ex.variations?.length ? (
                                    <div className="space-y-2">
                                        {ex.variations.map((v, i) => (
                                            <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: LIBRARY_CARD_BG, border: `1px solid ${LIBRARY_CARD_BORDER}` }}>
                                                <Shuffle size={14} weight="duotone" style={{ color }} />
                                                <span className="text-[14px] font-medium" style={{ color: LIBRARY_TEXT }}>{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[13px]" style={{ color: LIBRARY_TEXT_SECONDARY }}>Chưa có biến thể.</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CTA */}
                <div className="px-5 pt-2 pb-6">
                    <Link
                        to="/my-workout"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[16px] font-semibold active:scale-[0.98]"
                        style={{ background: LIBRARY_ACCENT, color: '#fff' }}
                    >
                        <Plus size={20} weight="bold" /> Thêm vào buổi tập hôm nay
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE — Workout library style (như ref)
// ═══════════════════════════════════════════════════════════
export default function MemberExercisesPage() {
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(getFavorites);

    const todayKey = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);
    const caloriesBurned = useHealthStore((s) => s.dailyStats[todayKey]?.caloriesBurned ?? 0);

    const grouped = useMemo(() => {
        const map: Record<string, Exercise[]> = {};
        EXERCISE_DB.forEach((ex) => {
            const muscle = ex.target.replace('Gym/', '').replace('Cardio', 'FullBody').replace('Yoga', 'Stretching');
            if (!map[muscle]) map[muscle] = [];
            map[muscle].push(ex);
        });
        return map;
    }, []);

    const normalize = (str: string) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
            .replace(/\s+/g, ' ');
    };

    const filteredExercises = useMemo(() => {
        const query = normalize(search);

        // If searching, search globally across all groups
        let list = (query || selectedGroup === 'all') ? EXERCISE_DB : (grouped[selectedGroup] || []);

        if (query) {
            list = list.filter((ex) => {
                const searchStr = `${ex.name} ${ex.nameEn || ''} ${ex.equipment} ${ex.primaryMuscle || ''} ${ex.target}`.toLowerCase();
                const normSearchStr = normalize(searchStr);
                return normSearchStr.includes(query);
            });
        }
        return list;
    }, [selectedGroup, search, grouped]);

    const getColor = useCallback((ex: Exercise) => {
        const muscle = ex.target.replace('Gym/', '');
        return MUSCLE_GROUPS.find((m) => m.id === muscle)?.color || LIBRARY_ACCENT;
    }, []);

    const toggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setFavoritesStorage(next);
            return next;
        });
    }, []);

    return (
        <div
            className="ios-animate-in min-h-full workout-library-page"
            style={{ maxWidth: 430, margin: '0 auto', background: LIBRARY_BG, color: LIBRARY_TEXT }}
        >
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }} className="space-y-4 pb-6 px-4 pt-2">
                {/* ── Calories burned: pill xanh nhạt dài, lửa đỏ + text (đúng hình) ── */}
                <motion.div
                    variants={fadeUp}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-full w-full"
                    style={{ background: LIBRARY_ACCENT_BG, border: `1px solid ${LIBRARY_ACCENT}40` }}
                >
                    <Flame size={20} weight="fill" style={{ color: '#FF453A' }} />
                    <span className="text-[14px] font-semibold" style={{ color: LIBRARY_TEXT }}>
                        Calories burned: <span style={{ color: LIBRARY_ACCENT, fontWeight: 700 }}>{Math.round(caloriesBurned)} kcal</span>
                    </span>
                </motion.div>

                {/* ── Title: Workout library: (bold, lớn) ── */}
                <motion.div variants={fadeUp}>
                    <h1 className="text-[22px] font-bold" style={{ color: LIBRARY_TEXT }}>
                        Workout library:
                    </h1>
                </motion.div>

                {/* ── Category pills: active = nền xanh + trắng, inactive = nền trắng + viền xám + chữ xám ── */}
                <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1">
                    {MUSCLE_GROUPS.map((g) => {
                        const isActive = selectedGroup === g.id;
                        const Icon = g.icon;
                        return (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGroup(g.id)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap flex-shrink-0 active:scale-95 transition-all"
                                style={{
                                    background: isActive ? LIBRARY_ACCENT : LIBRARY_BG,
                                    color: isActive ? '#FFFFFF' : LIBRARY_TEXT_SECONDARY,
                                    border: `2px solid ${isActive ? LIBRARY_ACCENT : LIBRARY_CARD_BORDER}`,
                                }}
                            >
                                <Icon size={18} weight={isActive ? 'fill' : 'duotone'} style={{ color: isActive ? '#FFFFFF' : LIBRARY_TEXT_SECONDARY }} />
                                {g.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* ── Search bar ── */}
                <motion.div variants={fadeUp}>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'var(--g-surface-2)', border: `1px solid ${LIBRARY_CARD_BORDER}` }}>
                        <MagnifyingGlass size={16} weight="duotone" style={{ color: LIBRARY_TEXT_SECONDARY }} />
                        <input
                            type="text"
                            placeholder="Tìm bài tập..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-[14px] outline-none"
                            style={{ color: LIBRARY_TEXT }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')}>
                                <X size={16} weight="bold" style={{ color: LIBRARY_TEXT_SECONDARY }} />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* ── List: card trắng, thumbnail trái, tên + Duration: X mins, heart phải ── */}
                <motion.div variants={fadeUp} className="space-y-2.5">
                    <AnimatePresence mode="popLayout">
                        {filteredExercises.map((ex) => (
                            <WorkoutLibraryRow
                                key={ex.id}
                                ex={ex}
                                onSelect={() => setSelectedEx(ex)}
                                color={getColor(ex)}
                                isFavorite={favorites.has(ex.id)}
                                onToggleFavorite={(e) => toggleFavorite(e, ex.id)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredExercises.length === 0 && (
                    <motion.div variants={fadeUp} className="py-16 text-center">
                        <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F2F2F7' }}>
                            <MagnifyingGlass size={36} weight="duotone" style={{ color: LIBRARY_TEXT_SECONDARY }} />
                        </div>
                        <p className="text-[16px] font-semibold" style={{ color: LIBRARY_TEXT }}>Không tìm thấy bài tập</p>
                        <p className="text-[13px] mt-2" style={{ color: LIBRARY_TEXT_SECONDARY }}>Thử từ khoá khác hoặc đổi nhóm cơ</p>
                        <button
                            onClick={() => { setSearch(''); setSelectedGroup('all'); }}
                            className="mt-5 px-5 py-2.5 rounded-xl text-[14px] font-semibold active:scale-95"
                            style={{ background: LIBRARY_ACCENT, color: '#fff' }}
                        >
                            Xem tất cả
                        </button>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {selectedEx && (
                    <ExerciseDetailModal
                        key={selectedEx.id}
                        ex={selectedEx}
                        onClose={() => setSelectedEx(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
