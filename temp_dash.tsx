import { useMemo } from 'react';
import { format, isSameDay, startOfWeek, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Barbell, Flame as FlameIcon, Lightning, Calendar, Trophy as Award, CaretRight, Play, ListChecks, PersonSimpleRun, Brain, Bookmark, UserCircle, Target, SignOut } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { useBoardStore } from '../store/useBoardStore';
import { useStore } from '../hooks/useStore';
import { getGreeting, calcStreak, calcAttendanceRate, getMemberRank, formatSessionsRemaining } from '../utils/gymUtils';
import { WORKOUT_PLANS } from '../constants/workoutPlans';
import { CalendarBlank } from '@phosphor-icons/react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

function RingProgress({ progress, size = 110, strokeWidth = 10, color, glow = false, children }: {
    progress: number; size?: number; strokeWidth?: number; color: string; glow?: boolean; children?: React.ReactNode;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - Math.min(Math.max(progress, 0), 1) * circumference;
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            {glow && (
                <div
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                        filter: 'blur(8px)',
                    }}
                />
            )}
            <svg width={size} height={size} className="-rotate-90 relative" viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`${color}18`} strokeWidth={strokeWidth} />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
        </div>
    );
}

function NavCard({ to, icon: Icon, label, desc, color }: { to: string; icon: any; label: string; desc: string; color: string }) {
    return (
        <Link to={to} className="block superapp-tap-scale w-full">
            <motion.div
                variants={fadeUp}
                className="gym-card flex items-center gap-4 p-4 shadow-sm"
                whileTap={{ scale: 0.98 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px' }}
            >
                <div className="w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={28} color={color} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-bold leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-[13px] font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>
                    <CaretRight size={16} weight="bold" style={{ color: 'var(--text-tertiary)' }} />
                </div>
            </motion.div>
        </Link>
    );
}

export default function MemberDashboard() {
    const { user, logout } = useAuth();
    const { members } = useMemberStore();


    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const greeting = getGreeting();

    const computed = useMemo(() => {
        if (!member) return { sessionsUsed: 0, sessionsTotal: 0, streak: 0, weekData: [], joinDays: 0, attendance30: 0 };

        const history = member.checkInHistory || [];
        const joinDate = new Date(member.joinDate);
        const today = new Date();
        const joinDays = Math.max(1, Math.floor((today.getTime() - joinDate.getTime()) / 86_400_000));
        const streak = calcStreak(history);
        const attendance30 = calcAttendanceRate(history, 30);

        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekData = Array.from({ length: 7 }, (_, i) => {
            const day = addDays(weekStart, i);
            return {
                label: format(day, 'EEE', { locale: vi }),
                dayNum: format(day, 'd'),
                isToday: isSameDay(day, today),
                hasFuture: day > today,
                hasCheckIn: history.some(h => isSameDay(new Date(h.date), day)),
            };
        });

        return {
            sessionsUsed: member.sessionsUsed,
            sessionsTotal: member.sessionsTotal,
            streak,
            weekData,
            joinDays,
            attendance30,
        };
    }, [member]);

    const sessionPct = computed.sessionsTotal > 0
        ? Math.min(100, (computed.sessionsUsed / computed.sessionsTotal) * 100)
        : 0;

    const rank = getMemberRank(computed.sessionsUsed);
    const sessionsRemaining = Math.max(0, computed.sessionsTotal - computed.sessionsUsed);
    const sessionAlert = member ? formatSessionsRemaining(member.sessionsTotal, member.sessionsUsed) : null;

    const assignedPlan = useMemo(() => {
        const id = member?.assignedWorkoutPlanId;
        return id ? WORKOUT_PLANS.find(p => p.id === id) : null;
    }, [member?.assignedWorkoutPlanId]);

    const { tasks: tasksMap } = useBoardStore();
    const { workouts } = useStore();

    const todayFocus = useMemo(() => {
        const today = new Date();
        const tasks = Object.values(tasksMap);
        const todayTasks = tasks.filter(t => t.date && isSameDay(new Date(t.date), today) && !t.completed);

        // Return most urgent or first pending
        const urgent = todayTasks.find(t => t.priority === 'urgent' || t.priority === 'high');
        return urgent || todayTasks[0] || null;
    }, [tasksMap]);

    const activeWorkout = useMemo(() => {
        // Just pick the first assigned plan or the primary power plan for demo
        return assignedPlan || workouts[0] || null;
    }, [assignedPlan, workouts]);

    const ringColor = sessionsRemaining === 0 ? '#FF453A' : sessionsRemaining <= 3 ? '#FF9F0A' : '#0A84FF';

    const motivationText =
        sessionPct >= 85 ? 'Gß║ºn ─æß║ít mß╗Ñc ti├¬u! ≡ƒÆ¬' :
            sessionPct >= 50 ? '─Éi ─æ├║ng h╞░ß╗¢ng! ≡ƒÄ»' :
                'Mß╗ùi buß╗òi ─æß╗üu ─æ├íng gi├í! ≡ƒöÑ';

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="ios-animate-in min-h-full superapp-hero superapp-page"
        >
            {/* ΓöÇΓöÇ HERO: Greeting + Rank ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="pt-4 pb-2">
                <p className="text-[13px] font-medium" style={{ color: 'var(--ios-secondary)' }}>{greeting}</p>
                <h1 className="text-[32px] font-bold mt-1 leading-tight tracking-tight" style={{ letterSpacing: -0.8 }}>
                    {member?.name || user?.displayName || 'Hß╗Öi vi├¬n'}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${rank.color}`}>{rank.label} {rank.emoji}</span>
                    {member?.assignedPT && (
                        <span className="text-[12px] font-medium" style={{ color: 'var(--ios-tint)' }}>PT: {member.assignedPT}</span>
                    )}
                </div>
            </motion.div>

            {/* ΓöÇΓöÇ SUPER DASHBOARD: Integrated Focus ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {/* Task Focus */}
                <Link to="/work" className="gym-card p-4 flex flex-col justify-between superapp-tap-scale overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={60} weight="fill" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-50">Viß╗çc ╞░u ti├¬n</p>
                        {todayFocus ? (
                            <>
                                <h3 className="text-[15px] font-bold leading-tight line-clamp-2">{todayFocus.content}</h3>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${todayFocus.priority === 'urgent' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                    <span className="text-[11px] font-medium opacity-70">{todayFocus.category === 'work' ? 'C├┤ng viß╗çc' : 'C├í nh├ón'}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-[15px] font-bold opacity-40">Mß╗ìi thß╗⌐ ─æ├ú xong!</h3>
                                <p className="text-[11px] mt-1 opacity-30">H├┤m nay thß║¡t tuyß╗çt vß╗¥i</p>
                            </>
                        )}
                    </div>
                </Link>

                {/* Workout Next */}
                <Link to="/my-workout" className="gym-card p-4 flex flex-col justify-between superapp-tap-scale overflow-hidden relative group border-l-4 border-l-[#BF5AF2]">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Barbell size={60} weight="fill" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--g-accent-2, #BF5AF2)' }}>Buß╗òi tß║¡p tiß║┐p</p>
                        {activeWorkout ? (
                            <>
                                <h3 className="text-[15px] font-bold leading-tight line-clamp-2">{activeWorkout.name}</h3>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <Play size={10} weight="fill" className="text-[#BF5AF2]" />
                                    <span className="text-[11px] font-medium opacity-70">Bß║»t ─æß║ºu ngay</span>
                                </div>
                            </>
                        ) : (
                            <h3 className="text-[15px] font-bold opacity-40">Ch╞░a c├│ gi├ío ├ín</h3>
                        )}
                    </div>
                </Link>
            </motion.div>



            {/* ΓöÇΓöÇ Alert: Sß║»p hß║┐t / Hß║┐t buß╗òi ΓöÇΓöÇ */}
            {sessionAlert?.urgent && (
                <motion.div variants={fadeUp} className={`mb-4 gym-alert ${sessionsRemaining === 0 ? 'gym-alert--danger' : 'gym-alert--warning'}`}>
                    <Target size={20} color={sessionsRemaining === 0 ? '#FF453A' : '#FF9F0A'} weight="duotone" className="flex-shrink-0 mt-0.5" />
                    <p className="text-[14px] font-semibold flex-1" style={{ color: sessionsRemaining === 0 ? '#FF453A' : '#FF9F0A' }}>
                        {sessionsRemaining === 0 ? '─É├ú hß║┐t buß╗òi ΓÇö li├¬n hß╗ç PT/Admin ─æß╗â gia hß║ín' : `Sß║»p hß║┐t buß╗òi ΓÇö ${sessionAlert.text}`}
                    </p>
                </motion.div>
            )}

            {/* ΓöÇΓöÇ SESSION RING HERO CARD ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="mb-4">
                <div className="gym-card gym-card--strip rounded-[20px] p-5 flex items-center gap-5" style={{ borderColor: `${ringColor}25` }}>
                    <RingProgress progress={sessionPct / 100} size={96} strokeWidth={9} color={ringColor} glow>
                        <p className="text-[24px] font-bold leading-none tabular-nums">{computed.sessionsUsed}</p>
                        <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--ios-tertiary)' }}>/{computed.sessionsTotal}</p>
                    </RingProgress>
                    <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-bold leading-tight">Buß╗òi thß╗⌐ {computed.sessionsUsed} trong g├│i {computed.sessionsTotal}</p>
                        <p className="text-[13px] mt-1 font-medium" style={{ color: 'var(--ios-secondary)' }}>
                            C├▓n {sessionsRemaining} buß╗òi
                        </p>
                        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: ringColor }}
                                initial={{ width: 0 }}
                                animate={{ width: `${sessionPct}%` }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                        <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'var(--ios-tertiary)' }}>{motivationText}</p>
                    </div>
                </div>
            </motion.div>

            {/* ΓöÇΓöÇ H├öM NAY: 1 viß╗çc ch├¡nh ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="gym-section">
                <p className="gym-section__title">H├┤m nay</p>
                <Link to="/my-workout" className="gym-hero-cta">
                    <div className="gym-hero-cta__icon">
                        <Play size={28} color="#FF9F0A" weight="fill" />
                    </div>
                    <div className="gym-hero-cta__body">
                        <p className="gym-hero-cta__title">V├áo buß╗òi tß║¡p</p>
                        <p className="gym-hero-cta__sub">
                            {assignedPlan ? `${assignedPlan.name} ┬╖ ~${assignedPlan.estimatedMinutes} ph├║t` : 'Chß╗ìn gi├ío ├ín ┬╖ tick set ┬╖ ho├án th├ánh'}
                        </p>
                    </div>
                    <CaretRight size={24} weight="bold" style={{ color: 'rgba(255,159,10,0.9)', flexShrink: 0 }} />
                </Link>
            </motion.div>

            {/* ΓöÇΓöÇ 4 STAT CARDS ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="mb-4">
                <div className="grid grid-cols-2 gap-2.5">
                    {[
                        { icon: FlameIcon, value: computed.streak, label: 'Streak', unit: 'ng├áy', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' },
                        { icon: Award, value: computed.attendance30, label: '30 ng├áy', unit: '%', color: '#BF5AF2', bg: 'rgba(191,90,242,0.12)' },
                        { icon: Calendar, value: computed.joinDays, label: 'Th├ánh vi├¬n', unit: 'ng├áy', color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)' },
                        { icon: Lightning, value: motivationText, label: 'Ghi ch├║', color: '#0A84FF', bg: 'rgba(10,132,255,0.1)', isText: true },
                    ].map((s, i) => (
                        <motion.div key={i} variants={fadeUp} className="gym-card p-3 flex items-center gap-2.5 min-h-[76px]">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                                <s.icon size={20} color={s.color} weight="duotone" />
                            </div>
                            <div className="flex-1 min-w-0">
                                {s.isText ? (
                                    <p className="text-[11px] font-bold leading-tight line-clamp-2" style={{ color: 'var(--ios-label)' }}>{s.value}</p>
                                ) : (
                                    <p className="text-[20px] font-bold leading-none tabular-nums" style={{ color: 'var(--ios-label)' }}>{s.value}</p>
                                )}
                                <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--ios-tertiary)' }}>{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ΓöÇΓöÇ TUß║ªN N├ÇY ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="gym-section">
                <p className="gym-section__title">Tuß║ºn n├áy</p>
                <div className="gym-card p-4 flex justify-between">
                    {computed.weekData.map((day, i) => (
                        <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--ios-tertiary)' }}>{day.label}</span>
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors"
                                style={{
                                    background: day.isToday ? ringColor : day.hasCheckIn ? 'rgba(48,209,88,0.2)' : 'rgba(255,255,255,0.05)',
                                    color: day.isToday ? '#fff' : day.hasCheckIn ? '#30D158' : day.hasFuture ? 'rgba(255,255,255,0.25)' : 'var(--ios-tertiary)',
                                    border: day.isToday ? 'none' : day.hasCheckIn ? '2px solid rgba(48,209,88,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {day.dayNum}
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: day.hasCheckIn ? '#30D158' : 'transparent' }} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ΓöÇΓöÇ KH├üM PH├ü (EXPOSED HUB) ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="gym-section">
                <p className="gym-section__title">Tiß╗çn ├¡ch & Kh├ím ph├í</p>
                <div className="flex flex-col gap-3">
                    <NavCard to="/my-workout" icon={Barbell} label="Buß╗òi tß║¡p" desc="Bß║»t ─æß║ºu tß║¡p luyß╗çn ngay h├┤m nay" color="#FF9F0A" />
                    <NavCard to="/my-plan" icon={ListChecks} label="Kß║┐ hoß║ích" desc="Theo d├╡i lß╗ïch tr├¼nh & dinh d╞░ß╗íng" color="#0A84FF" />
                    <NavCard to="/calendar" icon={CalendarBlank} label="Lß╗ïch tr├¼nh" desc="Quß║ún l├╜ sß╗▒ kiß╗çn v├á lß╗ïch hß║╣n" color="#5E5CE6" />
                    <NavCard to="/calories" icon={FlameIcon} label="Calories" desc="Kiß╗âm so├ít Kcal nß║íp & ti├¬u thß╗Ñ" color="#FF453A" />
                    <NavCard to="/steps" icon={PersonSimpleRun} label="B╞░ß╗¢c ch├ón" desc="Theo d├╡i hoß║ít ─æß╗Öng leo thang" color="#30D158" />
                    <NavCard to="/meditation" icon={Brain} label="Thiß╗ün ─æß╗ïnh" desc="Th╞░ gi├ún v├á tß║¡p trung t├óm tr├¡" color="#8B5CF6" />
                    <NavCard to="/journal" icon={Bookmark} label="Nhß║¡t k├╜" desc="Ghi ch├⌐p cß║úm x├║c h├áng ng├áy" color="#BF5AF2" />
                    <NavCard to="/profile" icon={UserCircle} label="Hß╗ô s╞í" desc="Th├┤ng tin c├í nh├ón & mß╗Ñc ti├¬u" color="#6366F1" />
                </div>
            </motion.div>

            {/* ΓöÇΓöÇ LOGOUT ΓöÇΓöÇ */}
            <motion.div variants={fadeUp} className="mt-12 mb-10 pb-8 px-0">
                <button
                    onClick={logout}
                    className="w-full py-4 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
                >
                    <SignOut size={20} weight="bold" className="text-[#FF453A] group-active:-translate-x-1 transition-transform" />
                    <span className="text-[15px] font-black text-[#FF453A] uppercase tracking-widest">─É─âng xuß║Ñt t├ái khoß║ún</span>
                </button>
                <div className="flex flex-col items-center mt-6 opacity-20">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase">HT-STRENGTH SUPERAPP</p>
                    <p className="text-[9px] font-bold mt-1 uppercase">Designed for Peak Performance</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
