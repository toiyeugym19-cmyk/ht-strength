import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Barbell, Clock, CheckCircle, Play, Pause, LinkSimple, Timer } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { EXERCISE_DB, type Exercise } from '../data/exerciseDB';
import { WORKOUT_PLANS, type WorkoutPlanId } from '../constants/workoutPlans';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { ExerciseMedia } from '../components/ExerciseMedia';
import { toast } from 'sonner';

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: spring } };

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
        if (restSecondsLeft <= 0) return;
        const t = setInterval(() => setRestSecondsLeft((s) => (s <= 0 ? 0 : s - 1)), 1000);
        return () => clearInterval(t);
    }, [restSecondsLeft]);

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
    const exercisesCompleted = useMemo(() => Object.values(doneSets).filter((v) => v > 0).length, [doneSets]);
    const totalSetsInPlan = planExercises.length * 3;
    const progressPct = totalSetsInPlan > 0 ? Math.round((totalSets / totalSetsInPlan) * 100) : 0;

    const handleToggleSet = (exerciseId: string, setNumber: number) => {
        setDoneSets((prev) => {
            const current = prev[exerciseId] || 0;
            const next = current === setNumber ? setNumber - 1 : setNumber;
            return { ...prev, [exerciseId]: next };
        });
    };

    const handleStartSession = () => {
        if (!startedAt) setStartedAt(Date.now());
    };

    const handleFinishSession = () => {
        if (!member || totalSets === 0) return;
        setIsFinishing(true);
        const now = Date.now();
        const started = startedAt ?? now;
        const durationMinutes = Math.max(1, Math.round((now - started) / 60000));

        // Detailed log
        const exerciseLogs = planExercises.map(ex => ({
            exerciseId: ex.id,
            sets: Array.from({ length: 3 }, (_, i) => ({
                reps: 10, // Default for simplified mock
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
            feeling: 4
        });

        updateMember(member.id, {
            workoutHistory: [
                { id: crypto.randomUUID(), date: new Date(now).toISOString(), planName: activePlan.name, totalSets, durationMinutes },
                ...(member.workoutHistory || []),
            ],
        });
        performCheckIn(member.id, 'Workout Session');
        toast.success("Tuyệt vời! Buổi tập đã được lưu.");
        setTimeout(() => setIsFinishing(false), 400);
    };

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="ios-animate-in min-h-full superapp-page pb-32"
            style={{ maxWidth: 430, margin: '0 auto' }}
        >
            {/* ── Hero ── */}
            <motion.div variants={fadeUp} className="pt-4 pb-4">
                <h1 className="gym-page-title">Buổi tập hôm nay</h1>
                <p className="gym-page-subtitle">
                    Chọn giáo án · tick set xong là coi như check-in
                </p>
            </motion.div>

            {/* ── Plan tabs: pills ── */}
            <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
                {WORKOUT_PLANS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setActivePlanId(p.id)}
                        className={`gym-pill ${p.id === activePlan.id ? 'gym-pill--active' : ''}`}
                    >
                        {p.name}
                    </button>
                ))}
            </motion.div>

            {/* ── Plan detail card ── */}
            <motion.div variants={fadeUp} className="mb-5">
                <div className="gym-card gym-card--accent-warm p-4 flex gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(255,159,10,0.25), rgba(232,97,58,0.15))', border: '0.5px solid rgba(255,159,10,0.2)' }}
                    >
                        <Barbell size={26} color="#FF9F0A" weight="duotone" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-bold leading-tight">{activePlan.description}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: 'var(--ios-secondary)' }}>{activePlan.focus}</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold" style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}>
                                {planExercises.length} bài · 3 set/bài
                            </span>
                            <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: 'var(--ios-tertiary)' }}>
                                <Clock size={14} weight="duotone" /> ~{activePlan.estimatedMinutes} phút
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── CTA Start + Progress pill ── */}
            <motion.div variants={fadeUp} className="flex gap-3 items-stretch mb-4">
                <motion.button onClick={handleStartSession} className="flex-1 gym-btn gym-btn--primary py-4" whileTap={{ scale: 0.98 }}>
                    {startedAt ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                    {startedAt ? 'Tiếp tục tập' : 'Bắt đầu buổi tập'}
                </motion.button>
                <div className="gym-card px-4 py-3 flex flex-col items-center justify-center min-w-[100px]">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ios-tertiary)' }}>Đã xong</p>
                    <p className="text-[15px] font-bold tabular-nums mt-0.5">{exercisesCompleted}/{planExercises.length} bài</p>
                    <p className="text-[12px] font-semibold" style={{ color: 'var(--ios-secondary)' }}>{totalSets} set</p>
                </div>
            </motion.div>

            {/* ── Progress bar ── */}
            <motion.div variants={fadeUp} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--ios-tertiary)' }}>Tiến độ buổi tập</span>
                    <span className="text-[16px] font-bold tabular-nums" style={{ color: progressPct >= 100 ? '#30D158' : '#FF9F0A' }}>{progressPct}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: progressPct >= 100 ? '#30D158' : 'linear-gradient(90deg, #FF9F0A, #E8613A)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progressPct)}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>
                {restSecondsLeft === 0 && (
                    <button
                        type="button"
                        onClick={() => setRestSecondsLeft(90)}
                        className="flex items-center gap-2 mt-3 text-[13px] font-semibold superapp-tap-scale"
                        style={{ color: 'var(--ios-tint)' }}
                    >
                        <Timer size={16} weight="duotone" /> Nghỉ 90 giây
                    </button>
                )}
            </motion.div>

            {/* ── Rest timer banner ── */}
            {restSecondsLeft > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[20px] p-4 flex items-center justify-between mb-4 superapp-card-glass"
                    style={{ border: '1px solid rgba(10,132,255,0.25)', boxShadow: '0 0 24px -4px rgba(10,132,255,0.2)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.2)' }}>
                            <Timer size={24} color="#0A84FF" weight="duotone" />
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--ios-secondary)' }}>Đang nghỉ</p>
                            <p className="text-[28px] font-bold tabular-nums" style={{ color: '#0A84FF' }}>{restSecondsLeft}s</p>
                        </div>
                    </div>
                    <button onClick={() => setRestSecondsLeft(0)} className="text-[14px] font-semibold px-3 py-2 rounded-xl superapp-tap-scale" style={{ color: '#0A84FF' }}>
                        Bỏ qua
                    </button>
                </motion.div>
            )}

            {/* ── Danh sách bài tập ── */}
            <motion.div variants={fadeUp} className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--ios-tertiary)' }}>
                        Danh sách bài tập
                    </p>
                    <Link to="/exercises" className="flex items-center gap-1.5 text-[13px] font-semibold superapp-tap-scale" style={{ color: '#FF9F0A' }}>
                        <Barbell size={15} weight="duotone" /> Thêm từ thư viện
                    </Link>
                </div>
                <div className="space-y-3">
                    {planExercises.map((ex) => {
                        const muscle = ex.target.replace('Gym/', '');
                        const done = doneSets[ex.id] || 0;
                        const setsLabel = ex.suggestedSets || '3 set · 8–12 reps';
                        const restLabel = ex.restSeconds ? `Nghỉ ${ex.restSeconds}s` : null;
                        const numSets = 3;
                        return (
                            <motion.div
                                key={ex.id}
                                variants={fadeUp}
                                className="rounded-[18px] p-4 flex gap-3 items-start superapp-card-glass superapp-tap-scale"
                                style={{ boxShadow: 'var(--ios-shadow-card)' }}
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, rgba(255,159,10,0.15), rgba(232,97,58,0.1))', border: '0.5px solid rgba(255,159,10,0.12)' }}
                                >
                                    <ExerciseMedia
                                        gifUrl={ex.gifUrl}
                                        videoUrl={ex.videoUrl}
                                        alt={ex.name}
                                        color="#FF9F0A"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-[15px] font-bold line-clamp-1 leading-tight">{ex.name}</p>
                                        {done >= numSets && <CheckCircle size={20} color="#30D158" weight="fill" className="flex-shrink-0" />}
                                    </div>
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' }}>
                                        {ex.primaryMuscle || muscle}
                                    </span>
                                    <p className="text-[12px] mt-1.5" style={{ color: 'var(--ios-secondary)' }}>
                                        {setsLabel}{restLabel ? ` · ${restLabel}` : ''}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        {Array.from({ length: numSets }, (_, i) => i + 1).map((s) => (
                                            <motion.button
                                                key={s}
                                                onClick={() => handleToggleSet(ex.id, s)}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold transition-colors"
                                                style={{
                                                    background: s <= done ? 'rgba(48,209,88,0.25)' : 'rgba(255,255,255,0.06)',
                                                    border: s <= done ? '1.5px solid rgba(48,209,88,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                                    color: s <= done ? '#30D158' : 'var(--ios-tertiary)',
                                                }}
                                                whileTap={{ scale: 0.92 }}
                                            >
                                                {s}
                                            </motion.button>
                                        ))}
                                    </div>
                                    <Link
                                        to="/exercises"
                                        className="inline-flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold"
                                        style={{ color: 'var(--ios-tint)' }}
                                    >
                                        <LinkSimple size={14} weight="duotone" /> Xem hướng dẫn trong thư viện
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── Hoàn thành ── */}
            <motion.div variants={fadeUp} className="mt-6">
                <motion.button
                    className="w-full rounded-[18px] py-4 px-4 flex items-center justify-center gap-2.5 font-bold text-[16px] superapp-tap-scale disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                        background: totalSets > 0 ? 'linear-gradient(135deg, rgba(48,209,88,0.9), rgba(52,199,89,0.85))' : 'rgba(255,255,255,0.06)',
                        color: totalSets > 0 ? '#fff' : 'var(--ios-tertiary)',
                        border: totalSets > 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: totalSets > 0 ? '0 8px 24px rgba(48,209,88,0.3)' : 'none',
                    }}
                    disabled={totalSets === 0 || isFinishing}
                    onClick={handleFinishSession}
                    whileTap={totalSets > 0 ? { scale: 0.98 } : {}}
                >
                    <CheckCircle size={20} weight="fill" />
                    {totalSets === 0 ? 'Tick ít nhất 1 set để hoàn thành' : 'Hoàn thành buổi tập & lưu check-in'}
                </motion.button>
                {isFinishing && (
                    <p className="text-[12px] mt-3 text-center font-medium" style={{ color: 'var(--ios-tertiary)' }}>
                        Đã lưu buổi tập và cập nhật chuyên cần.
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
}
