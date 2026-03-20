import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlass, X, Barbell, Flame,
    Warning, Shuffle,
    Heart, GridFour, Person, Lightning,
    CaretLeft, Wind, ChartLineUp, Timer
} from '@phosphor-icons/react';
import { EXERCISE_DB, type Exercise } from '../data/exerciseDB';
import { useHealthStore } from '../store/useHealthStore';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { toast } from 'sonner';

// ============================================================
//  MEMBER EXERCISES PAGE — Library Node (Premium Redesign)
// ============================================================

const MUSCLE_GROUPS: { id: string; label: string; icon: any; color: string }[] = [
    { id: 'all', label: 'Tất Cả', icon: GridFour, color: '#0A84FF' },
    { id: 'Ngực', label: 'Ngực', icon: Barbell, color: '#FF375F' },
    { id: 'Lưng', label: 'Lưng', icon: Barbell, color: '#0A84FF' },
    { id: 'Chân', label: 'Chân', icon: Person, color: '#30D158' },
    { id: 'Vai', label: 'Vai', icon: Barbell, color: '#FF9F0A' },
    { id: 'Tay', label: 'Tay', icon: Barbell, color: '#BF5AF2' },
    { id: 'Bụng', label: 'Bụng', icon: Lightning, color: '#FF453A' },
    { id: 'FullBody', label: 'Toàn Thân', icon: ChartLineUp, color: '#64D2FF' },
    { id: 'Stretching', label: 'Giãn Cơ', icon: Wind, color: '#8E8E93' },
];

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
    beginner: { label: 'Cơ bản', color: '#30D158' },
    intermediate: { label: 'Trung bình', color: '#FF9F0A' },
    advanced: { label: 'Nâng cao', color: '#FF375F' },
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

function estimateDurationMinutes(ex: Exercise): number {
    const rest = ex.restSeconds ?? 60;
    const setsMatch = (ex.suggestedSets || '3×10').match(/(\d+)\s*[×x]\s*(\d+)/i);
    const sets = setsMatch ? parseInt(setsMatch[1], 10) : 3;
    const reps = setsMatch ? parseInt(setsMatch[2], 10) : 10;
    const secPerSet = Math.min(90, reps * 4) + rest;
    return Math.round((sets * secPerSet) / 60);
}

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

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
        return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D')).replace(/\s+/g, ' ');
    };

    const filteredExercises = useMemo(() => {
        const query = normalize(search);
        let list = (query || selectedGroup === 'all') ? EXERCISE_DB : (grouped[selectedGroup] || []);
        if (query) {
            list = list.filter((ex) => {
                const searchStr = `${ex.name} ${ex.nameEn || ''} ${ex.equipment} ${ex.primaryMuscle || ''} ${ex.target} `.toLowerCase();
                return normalize(searchStr).includes(query);
            });
        }
        return list;
    }, [selectedGroup, search, grouped]);

    const toggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                toast.info("Đã xóa khỏi danh sách yêu thích");
            } else {
                next.add(id);
                toast.success("Đã thêm vào danh sách yêu thích");
            }
            setFavoritesStorage(next);
            return next;
        });
    }, []);

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="min-h-full pb-32 ios-animate-in">
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-4 pb-6 px-1">
                {/* Calo Pill */}
                <div className="flex items-center gap-3 px-5 py-4 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-inner">
                    <Flame size={20} weight="fill" className="text-red-500 animate-pulse" />
                    <span className="text-[13px] font-black uppercase tracking-[0.1em] text-white/80 italic">
                        Năng lượng tiêu hao hôm nay: <span className="text-blue-400 tabular-nums">{Math.round(caloriesBurned)} KCAL</span>
                    </span>
                </div>
            </motion.div>

            {/* ── CATEGORY SELECTOR ── */}
            <motion.div variants={fadeUp} className="mb-8 overflow-hidden">
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-1 px-1">
                    {MUSCLE_GROUPS.map((g) => {
                        const isActive = selectedGroup === g.id;
                        const Icon = g.icon;
                        return (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGroup(g.id)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all italic border-2 whitespace-nowrap ${isActive
                                        ? 'bg-white text-black border-white shadow-[0_15px_30px_rgba(255,255,255,0.1)]'
                                        : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={18} weight={isActive ? 'fill' : 'bold'} />
                                {g.label}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── SEARCH ISLAND ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="superapp-card-glass flex items-center gap-5 px-8 py-6 rounded-[35px] border border-white/5 focus-within:border-blue-500/50 transition-all shadow-2xl glass-reflection">
                    <MagnifyingGlass size={24} weight="bold" className="text-white/20" />
                    <input
                        type="text"
                        placeholder="TÌM KIẾM ĐỘNG TÁC..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[16px] font-black italic uppercase text-white outline-none placeholder:text-white/10"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <X size={16} weight="bold" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ── EXERCISE LIST ── */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredExercises.map((ex) => {
                        const mins = estimateDurationMinutes(ex);
                        const isFav = favorites.has(ex.id);
                        return (
                            <motion.div
                                layout
                                key={ex.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => setSelectedEx(ex)}
                                className="superapp-card-glass p-5 rounded-[40px] border border-white/5 flex items-center gap-6 group cursor-pointer active:scale-[0.98] transition-all hover:border-blue-500/20 shadow-xl"
                            >
                                <div className="w-24 h-24 rounded-[32px] overflow-hidden shrink-0 border border-white/10 shadow-2xl relative">
                                    <ExerciseMedia gifUrl={ex.gifUrl} videoUrl={ex.videoUrl} alt={ex.name} color="#0A84FF" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                                    <h4 className="text-[17px] font-black italic uppercase tracking-tighter text-white/90 leading-tight group-hover:text-blue-400 transition-colors">
                                        {ex.name}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 opacity-40">
                                            <Timer size={14} weight="fill" />
                                            <span className="text-[11px] font-black uppercase tracking-widest tabular-nums italic">{mins}M</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[11px] font-black uppercase tracking-widest opacity-40 italic truncate">{ex.equipment}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => toggleFavorite(e, ex.id)}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center active:scale-75 transition-transform"
                                >
                                    <Heart size={24} weight={isFav ? 'fill' : 'bold'} style={{ color: isFav ? '#FF375F' : 'rgba(255,255,255,0.15)' }} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredExercises.length === 0 && (
                    <div className="py-20 text-center opacity-40">
                        <MagnifyingGlass size={64} weight="bold" className="mx-auto mb-6 opacity-10" />
                        <p className="text-[14px] font-black uppercase tracking-[0.3em] italic">Không có dữ liệu khớp</p>
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL ── */}
            <AnimatePresence>
                {selectedEx && <ExerciseDetailModal ex={selectedEx} onClose={() => setSelectedEx(null)} />}
            </AnimatePresence>
        </motion.div>
    );
}

function ExerciseDetailModal({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'guide' | 'mistakes' | 'variations'>('guide');
    const diff = DIFFICULTY_MAP[ex.difficulty] || DIFFICULTY_MAP.beginner;

    return (
        <motion.div className="fixed inset-0 z-[500] flex flex-col bg-[#050505]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/5">
                <button onClick={onClose} className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-blue-500 italic">
                    <CaretLeft size={22} weight="bold" /> QUAY LẠI
                </button>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
                <div className="relative w-full aspect-square flex items-center justify-center p-8 bg-white/[0.01]">
                    <div className="w-full max-w-[320px] aspect-square rounded-[60px] overflow-hidden border border-white/5 shadow-3xl relative">
                        <ExerciseMedia gifUrl={ex.gifUrl} videoUrl={ex.videoUrl} alt={ex.name} color="#0A84FF" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-3">
                            <Barbell size={20} weight="fill" className="text-blue-500" />
                            <span className="text-[12px] font-black uppercase tracking-[0.2em] italic text-white">{ex.target.replace('Gym/', '')}</span>
                        </div>
                    </div>
                </div>

                <div className="px-8 pt-6">
                    <h2 className="text-[36px] font-black italic uppercase leading-none tracking-tighter text-white/90">
                        {ex.name}
                    </h2>

                    <div className="flex gap-4 mt-8">
                        <div className="neural-island flex-1 p-5 rounded-[30px] border border-white/5 flex flex-col items-center gap-2">
                            <Flame size={20} weight="fill" className="text-red-500" />
                            <p className="text-[15px] font-black italic tabular-nums">{ex.caloriesPer10Min || '~60'}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">KCAL/10P</p>
                        </div>
                        <div className="neural-island flex-1 p-5 rounded-[30px] border border-white/5 flex flex-col items-center gap-2">
                            <Lightning size={20} weight="fill" style={{ color: diff.color }} />
                            <p className="text-[15px] font-black italic uppercase" style={{ color: diff.color }}>{diff.label}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">CẤP ĐỘ</p>
                        </div>
                    </div>

                    <div className="flex mt-10 p-1 rounded-[24px] bg-white/5 border border-white/5">
                        {['guide', 'mistakes', 'variations'].map((t: any) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[20px] transition-all ${activeTab === t ? 'bg-white text-black shadow-lg' : 'text-white/30'
                                    }`}
                            >
                                {t === 'guide' ? 'Hướng dẫn' : t === 'mistakes' ? 'Lỗi sai' : 'Biến thể'}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 pb-10">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                {activeTab === 'guide' && (
                                    <div className="space-y-6">
                                        {ex.instructions.map((step, i) => (
                                            <div key={i} className="flex gap-6 group">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-[14px] font-black italic tabular-nums text-blue-500/60 group-hover:text-blue-500 transition-colors">
                                                    {String(i + 1).padStart(2, '0')}
                                                </div>
                                                <p className="text-[16px] font-bold text-white/70 italic leading-relaxed uppercase tracking-tight">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'mistakes' && (
                                    <div className="space-y-4">
                                        {ex.commonMistakes?.map((m, i) => (
                                            <div key={i} className="flex gap-5 p-6 rounded-[30px] bg-red-500/5 border border-red-500/10 italic">
                                                <Warning size={22} weight="fill" className="text-red-500 shrink-0" />
                                                <p className="text-[15px] font-bold text-white/60 leading-relaxed uppercase tracking-tight">{m}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'variations' && (
                                    <div className="grid grid-cols-1 gap-4">
                                        {ex.variations?.map((v, i) => (
                                            <div key={i} className="flex items-center gap-5 p-6 rounded-[30px] bg-white/5 border border-white/5 group">
                                                <Shuffle size={20} weight="fill" className="text-white/20 group-hover:text-blue-500 transition-colors" />
                                                <span className="text-[15px] font-bold text-white/80 italic uppercase tracking-widest">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="p-8 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                <button
                    onClick={onClose}
                    className="w-full h-18 py-6 rounded-[30px] bg-blue-600 text-white text-[15px] font-black italic uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(10,132,255,0.4)] active:scale-95 transition-all"
                >
                    ĐÃ HIỂU PHƯƠNG PHÁP
                </button>
            </div>
        </motion.div>
    );
}
