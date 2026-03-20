import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Barbell, Clock, CheckCircle, Play, LinkSimple, Timer, ChartLineUp, CaretRight, Sparkle, Wind, X } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { EXERCISE_DB, type Exercise } from '../data/exerciseDB';
import { WORKOUT_PLANS, type WorkoutPlanId } from '../constants/workoutPlans';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { toast } from 'sonner';

// ============================================================
//  MEMBER WORKOUT PAGE — Training Console (Premium Redesign)
// ============================================================

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger: Variants = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { ...spring } }
};

export default function MemberWorkoutPage() {
    const { user } = useAuth();
    const memberId = user?.memberId || 'm1';
    const { members, updateMember, performCheckIn } = useMemberStore();

    const member = useMemo(
        () => members.find((m) => m.id === memberId) || members[0],
        [members, memberId],
    );

    const [activePlanId, setActivePlanId] = useState<WorkoutPlanId>('fullbody_basic');
    useEffect(() => {
        const assigned = member?.assignedWorkoutPlanId;
        if (assigned && WORKOUT_PLANS.some((p) => p.id === assigned)) setActivePlanId(assigned as WorkoutPlanId);
    }, [member?.assignedWorkoutPlanId]);

    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [doneSets, setDoneSets] = useState<Record<string, number>>({});
    const [isFinishing, setIsFinishing] = useState(false);
    const [restSecondsLeft, setRestSecondsLeft] = useState(0);

    useEffect(() => {
        let t: ReturnType<typeof setInterval> | null = null;
        if (restSecondsLeft > 0) {
            t = setInterval(() => setRestSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
        }
        return () => { if (t) clearInterval(t); };
    }, [restSecondsLeft > 0]);

    const activePlan = useMemo(
        () => WORKOUT_PLANS.find((p) => p.id === activePlanId) || WORKOUT_PLANS[0],
        [activePlanId],
    );

    const planExercises: Exercise[] = useMemo(
        () =>
            activePlan.exerciseIds
                .map((id) => EXERCISE_DB.find((ex) => ex.id === id))
                .filter(Boolean) as Exercise[],
        [activePlan],
    );

    const totalSets = useMemo(() => Object.values(doneSets).reduce((acc, v) => acc + v, 0), [doneSets]);
    const exercisesCompletedCount = useMemo(() => {
        // Find how many exercises have at least 1 set done
        return Object.values(doneSets).filter((v) => v > 0).length;
    }, [doneSets]);

    // In our simplified logic, assume 3 sets per exercise
    const setsPerExercise = 3;
    const totalSetsInPlan = planExercises.length * setsPerExercise;
    const progressPct = totalSetsInPlan > 0 ? Math.round((totalSets / totalSetsInPlan) * 100) : 0;

    const handleToggleSet = (exerciseId: string, setNumber: number) => {
        if (!startedAt) {
            handleStartSession();
        }

        setDoneSets((prev) => {
            const current = prev[exerciseId] || 0;
            // logic: if user clicks set 2 but set 1 is not done, we can auto-fill or just let them
            // here we use a toggle logic: if click current done set, decrement. If click higher, set to that.
            const next = current === setNumber ? setNumber - 1 : setNumber;
            return { ...prev, [exerciseId]: next };
        });

        // Trigger rest only if we are ticking UP
        const currentSets = doneSets[exerciseId] || 0;
        if (setNumber > currentSets) {
            setRestSecondsLeft(60); // Auto-start 60s rest
        }
    };

    const handleStartSession = () => {
        if (!startedAt) {
            setStartedAt(Date.now());
            toast.success("Bắt đầu buổi tập! Hãy tập trung tối đa.", {
                style: { background: '#1c1c1e', color: '#FF9F0A', border: '1px solid rgba(255,159,10,0.2)' }
            });
        }
    };

    const handleFinishSession = () => {
        if (!member || totalSets === 0) return;
        setIsFinishing(true);
        const now = Date.now();
        const started = startedAt ?? now;
        const durationMinutes = Math.max(1, Math.round((now - started) / 60000));

        const exerciseLogs = planExercises.map(ex => ({
            exerciseId: ex.id,
            sets: Array.from({ length: setsPerExercise }, (_, i) => ({
                reps: 10,
                weight: 0,
                completed: (doneSets[ex.id] || 0) > i
            }))
        }));

        useWorkoutStore.getState().logSession({
            id: `log-${crypto.randomUUID()}`,
            date: new Date(now).toISOString(),
            planId: activePlan.id,
            planName: activePlan.name,
            durationMinutes,
            exercises: exerciseLogs,
            feeling: 5
        });

        updateMember(member.id, {
            workoutHistory: [
                { id: crypto.randomUUID(), date: new Date(now).toISOString(), planName: activePlan.name, totalSets, durationMinutes },
                ...(member.workoutHistory || []),
            ],
        });

        performCheckIn(member.id, 'Workout Session Completed');

        toast.success("Hệ thống đã ghi nhận. Buổi tập hoàn thành tuyệt vời!", {
            icon: '🏆',
            style: { background: '#1c1c1e', color: '#30D158', border: '1px solid rgba(48,209,88,0.2)' }
        });

        setTimeout(() => {
            setIsFinishing(false);
            setStartedAt(null);
            setDoneSets({});
            navigate('/my-progress');
        }, 1200);
    };

    const navigate = (path: string) => window.location.hash = path; // Minimalist nav for demo

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="min-h-full pb-32 ios-animate-in"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#FF375F]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Training Control Node</span>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                            Bảng Điều Khiển
                        </h1>
                        <p className="text-[13px] font-bold text-white/30 mt-2 italic uppercase tracking-widest">Giao thức tập luyện neural</p>
                    </div>
                    <div className="neural-island w-20 h-20 rounded-[30px] flex flex-col items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group active:scale-95 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                        <span className="text-[28px] font-black italic tracking-tighter tabular-nums text-white relative z-10">{progressPct}<span className="text-[11px] opacity-40 ml-0.5">%</span></span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 relative z-10 italic mt-1">Xong</span>
                    </div>
                </div>

                {/* Main Progress Tube */}
                <div className="mt-8 h-4 w-full rounded-full bg-white/5 p-1 border border-white/5 relative overflow-hidden group">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full relative"
                        style={{
                            background: 'linear-gradient(90deg, #FF9F0A 0%, #FF375F 100%)',
                            boxShadow: '0 0 15px rgba(255,55,95,0.4)'
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50" />
                    </motion.div>
                </div>
            </motion.div>

            {/* ── PLAN SELECTOR ── */}
            <motion.div variants={fadeUp} className="mb-10 px-1">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Chế độ đào tạo</span>
                    <Sparkle size={16} className="text-white/20 animate-spin-slow" />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-1 px-1">
                    {WORKOUT_PLANS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setActivePlanId(p.id)}
                            className={`px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all italic border-2 whitespace-nowrap ${activePlanId === p.id
                                    ? 'bg-white text-black border-white shadow-[0_15px_30px_rgba(255,255,255,0.1)]'
                                    : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* ── ACTIVE PLAN DETAILS ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="superapp-card-glass p-8 rounded-[45px] border border-white/5 relative overflow-hidden group shadow-2xl glass-reflection">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full" />

                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-[30px] flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner group-hover:rotate-[5deg] transition-all"
                            style={{ background: 'linear-gradient(135deg, rgba(255,159,10,0.15), rgba(255,55,95,0.05))' }}>
                            <Barbell size={38} color="#FF9F0A" weight="fill" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[22px] font-black italic uppercase tracking-tighter text-white/90 leading-tight">{activePlan.name}</h3>
                            <p className="text-[12px] font-bold text-white/30 mt-2 italic leading-relaxed line-clamp-2 uppercase tracking-wide">{activePlan.description}</p>

                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} weight="fill" className="text-orange-500" />
                                    <span className="text-[11px] font-black text-white/40 italic uppercase tracking-widest">{activePlan.estimatedMinutes}M</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ChartLineUp size={16} weight="fill" className="text-red-500" />
                                    <span className="text-[11px] font-black text-white/40 italic uppercase tracking-widest">{planExercises.length} BÀI TẬP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4 relative z-10">
                        <motion.button
                            onClick={handleStartSession}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 h-16 rounded-[28px] flex items-center justify-center gap-4 font-black text-[13px] uppercase tracking-[0.2em] italic border-2 transition-all ${startedAt
                                    ? 'bg-white/5 text-white/20 border-white/5 shadow-inner'
                                    : 'bg-[#FF9F0A] text-white border-[#FF9F0A] shadow-[0_15px_35px_rgba(255,159,10,0.4)]'
                                }`}
                        >
                            {startedAt ? <Timer size={24} weight="fill" className="animate-spin-slow" /> : <Play size={24} weight="fill" />}
                            {startedAt ? 'ĐANG TẬP' : 'BẮT ĐẦU NGAY'}
                        </motion.button>
                        <div className="w-20 h-16 rounded-[28px] neural-island flex flex-col items-center justify-center border border-white/5 shadow-xl">
                            <span className="text-[22px] font-black italic tabular-nums text-white/80 leading-none">{exercisesCompletedCount}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1 italic">Bài</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── REST TIMER ── */}
            <AnimatePresence>
                {restSecondsLeft > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 14 }}
                        className="mb-10 p-8 rounded-[45px] bg-[#0A84FF]/10 border border-[#0A84FF]/30 backdrop-blur-3xl shadow-[0_30px_60px_rgba(10,132,255,0.2)] flex items-center justify-between glass-reflection"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center relative border-2 border-white/5">
                                <motion.div
                                    className="absolute inset-0 rounded-full border-[3px] border-[#0A84FF]"
                                    initial={{ pathLength: 1 }}
                                    animate={{ pathLength: restSecondsLeft / 60 }}
                                    transition={{ duration: 1, ease: "linear" }}
                                    style={{ clipPath: `inset(0 0 0 0 round 50%)`, rotate: '-90deg' }}
                                />
                                <Wind size={28} weight="fill" className="text-[#0A84FF] animate-float-gentle" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-[#0A84FF] uppercase tracking-[0.3em] italic mb-1">Thời gian nghỉ</p>
                                <p className="text-[42px] font-black text-white italic leading-none tracking-tighter tabular-nums">{restSecondsLeft}<span className="text-[14px] opacity-40 ml-1">S</span></p>
                            </div>
                        </div>
                        <button
                            onClick={() => setRestSecondsLeft(0)}
                            className="w-14 h-14 rounded-[22px] bg-[#0A84FF] text-white flex items-center justify-center active:scale-90 transition-all shadow-lg"
                        >
                            <X size={24} weight="bold" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── EXERCISE STACK ── */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Chi tiết chương trình</span>
                    <Link to="/exercises" className="text-[10px] font-black text-[#FF9F0A] uppercase tracking-widest italic flex items-center gap-2 group">
                        Thư viện <CaretRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <motion.div variants={stagger} className="space-y-5">
                    {planExercises.map((ex, idx) => {
                        const done = doneSets[ex.id] || 0;
                        const setsLabel = ex.suggestedSets || '3 set x 12 reps';

                        return (
                            <motion.div
                                key={ex.id}
                                variants={fadeUp}
                                className={`superapp-card-glass p-6 rounded-[45px] border transition-all duration-500 overflow-hidden relative group ${done >= setsPerExercise ? 'border-[#30D158]/30 bg-[#30D158]/5 shadow-[0_10px_40px_rgba(48,209,88,0.1)]' : 'border-white/5'
                                    }`}
                            >
                                <div className="flex gap-6">
                                    <div className="w-24 h-24 rounded-[32px] overflow-hidden shrink-0 border border-white/10 shadow-2xl relative">
                                        <ExerciseMedia gifUrl={ex.gifUrl} videoUrl={ex.videoUrl} alt={ex.name} color="#FF9F0A" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            <span className="text-[8px] font-black text-white/60 uppercase italic tracking-widest">LIVE</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div className="flex items-start justify-between">
                                            <h4 className={`text-[17px] font-black italic uppercase tracking-tighter leading-tight transition-colors ${done >= setsPerExercise ? 'text-[#30D158]' : 'text-white/90'}`}>
                                                {ex.name}
                                            </h4>
                                            {done >= setsPerExercise && <CheckCircle size={22} weight="fill" className="text-[#30D158] shadow-[0_0_15px_rgba(48,209,88,0.5)]" />}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[11px] font-bold text-white/30 truncate uppercase tracking-widest italic">{setsLabel}</span>
                                        </div>

                                        <div className="flex gap-2.5 mt-5">
                                            {[1, 2, 3].map((s) => (
                                                <motion.button
                                                    key={s}
                                                    onClick={() => handleToggleSet(ex.id, s)}
                                                    whileTap={{ scale: 0.85 }}
                                                    className={`w-12 h-12 rounded-[20px] flex items-center justify-center text-[16px] font-black italic transition-all border-2 ${s <= done
                                                            ? 'bg-[#30D158] text-white border-[#30D158] shadow-[0_10px_20px_rgba(48,209,88,0.3)]'
                                                            : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20'
                                                        }`}
                                                >
                                                    {s}
                                                </motion.button>
                                            ))}
                                            <Link
                                                to="/exercises"
                                                className="w-12 h-12 rounded-[20px] bg-white/5 border-2 border-white/5 flex items-center justify-center text-white/20 hover:text-white/60 active:scale-90 transition-all"
                                            >
                                                <LinkSimple size={20} weight="bold" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* ── FINISH FOOTER ── */}
            <motion.div variants={fadeUp} className="mt-14 px-1 pb-10">
                <motion.button
                    disabled={totalSets === 0 || isFinishing}
                    onClick={handleFinishSession}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-8 rounded-[45px] flex items-center justify-center gap-4 font-black italic uppercase tracking-[0.3em] text-[18px] shadow-3xl transition-all border-2 ${totalSets > 0
                            ? 'bg-gradient-to-r from-[#30D158] to-[#34C759] text-white border-white/20 shadow-[0_20px_60px_rgba(48,209,88,0.4)]'
                            : 'bg-white/[0.02] text-white/10 border-white/5 pointer-events-none'
                        }`}
                >
                    {isFinishing ? (
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <CheckCircle size={28} weight="fill" />
                            {totalSets === 0 ? 'HOÀN THÀNH 1 SET ĐỂ KẾT THÚC' : 'KẾT THÚC BUỔI TẬP'}
                        </>
                    )}
                </motion.button>
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">HT-STRENGTH BIO-MONITOR NODE v2.0</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
