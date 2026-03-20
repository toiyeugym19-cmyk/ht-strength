import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { WORKOUT_PLANS } from '../constants/workoutPlans';
import { Barbell, ForkKnife, Target, Info, Sparkle, Clock, ChartLineUp, AppleLogo } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

// ============================================================
//  MY PLAN PAGE — Strategic Hub (Premium Redesign)
// ============================================================

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

export default function MyPlanPage() {
    const { user } = useAuth();
    const { members } = useMemberStore();
    const navigate = useNavigate();

    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const workoutPlan = useMemo(() => {
        return WORKOUT_PLANS.find(p => p.id === member?.assignedWorkoutPlanId);
    }, [member?.assignedWorkoutPlanId]);

    const mealPlan = member?.assignedMealPlan;

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="min-h-full pb-32 ios-animate-in"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#0A84FF]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Strategic Analysis Node</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                            Kế Hoạch
                        </h1>
                        <p className="text-[13px] font-bold text-white/30 mt-2 italic uppercase tracking-widest">Giao thức tối ưu hóa cơ thể</p>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-12">
                {/* ── WORKOUT PLAN SECTION ── */}
                <motion.div variants={fadeUp} className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <Barbell size={20} weight="fill" className="text-blue-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Lộ trình tập luyện</span>
                        </div>
                        <Sparkle size={16} className="text-white/20 animate-spin-slow" />
                    </div>

                    {workoutPlan ? (
                        <div className="superapp-card-glass p-8 rounded-[45px] border border-white/5 relative overflow-hidden group shadow-2xl glass-reflection">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full" />

                            <h3 className="text-[24px] font-black italic uppercase tracking-tighter text-blue-400 leading-tight">{workoutPlan.name}</h3>
                            <p className="text-[12px] font-bold text-white/30 mt-3 italic leading-relaxed uppercase tracking-wide">{workoutPlan.description}</p>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="neural-island p-5 rounded-[28px] border border-white/5 flex flex-col gap-2">
                                    <Clock size={20} weight="fill" className="text-blue-500/40" />
                                    <div>
                                        <p className="text-[18px] font-black italic tabular-nums">{workoutPlan.estimatedMinutes}<span className="text-[10px] ml-1 opacity-30">M</span></p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Dự kiến</p>
                                    </div>
                                </div>
                                <div className="neural-island p-5 rounded-[28px] border border-white/5 flex flex-col gap-2">
                                    <ChartLineUp size={20} weight="fill" className="text-blue-500/40" />
                                    <div>
                                        <p className="text-[18px] font-black italic tabular-nums">{workoutPlan.exerciseIds.length}<span className="text-[10px] ml-1 opacity-30">BÀI</span></p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Chính</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Danh sách khối lượng</p>
                                <div className="space-y-3">
                                    {workoutPlan.exerciseIds.slice(0, 4).map((exId, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#0A84FF]" />
                                            <span className="text-[13px] font-black italic uppercase text-white/80 tracking-tight">
                                                {exId.split('-').slice(0, 2).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                            </span>
                                        </div>
                                    ))}
                                    {workoutPlan.exerciseIds.length > 4 && (
                                        <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-[0.2em] mt-4 pt-2 border-t border-white/5 italic">
                                            + {workoutPlan.exerciseIds.length - 4} bài tập hỗ trợ khác
                                        </p>
                                    )}
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/my-workout')}
                                className="w-full mt-10 h-16 rounded-[28px] bg-blue-600 text-white font-black italic uppercase text-[14px] tracking-[0.3em] shadow-[0_15px_30px_rgba(10,132,255,0.4)] border-2 border-white/10 flex items-center justify-center gap-4 group"
                            >
                                <Barbell size={24} weight="fill" className="group-hover:rotate-[15deg] transition-all" />
                                BẮT ĐẦU TẬP LUYỆN
                            </motion.button>
                        </div>
                    ) : (
                        <div className="superapp-card-glass p-12 rounded-[45px] text-center border border-white/5 opacity-40 italic">
                            Chưa đồng bộ lộ trình tập luyện
                        </div>
                    )}
                </motion.div>

                {/* ── MEAL PLAN SECTION ── */}
                <motion.div variants={fadeUp} className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <ForkKnife size={20} weight="fill" className="text-orange-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Nhiên liệu tiêu chuẩn</span>
                        </div>
                        <AppleLogo size={16} className="text-white/20" />
                    </div>

                    {mealPlan ? (
                        <div className="superapp-card-glass p-8 rounded-[45px] border border-white/5 relative overflow-hidden group shadow-2xl glass-reflection">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                            <h3 className="text-[24px] font-black italic uppercase tracking-tighter text-orange-400 leading-tight">{mealPlan.name}</h3>

                            <div className="grid grid-cols-4 gap-3 mt-8">
                                {[
                                    { l: 'CAL', v: mealPlan.dailyCalories, c: '#FF9F0A' },
                                    { l: 'PRO', v: mealPlan.protein, c: '#FF375F' },
                                    { l: 'CAR', v: mealPlan.carbs, c: '#0A84FF' },
                                    { l: 'FAT', v: mealPlan.fat, c: '#FFD60A' }
                                ].map(m => (
                                    <div key={m.l} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                        <p className="text-[14px] font-black italic tabular-nums" style={{ color: m.c }}>{m.v}{m.l === 'CAL' ? '' : 'G'}</p>
                                        <p className="text-[8px] font-black uppercase text-white/20 mt-1 italic tracking-widest">{m.l}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 space-y-6">
                                {mealPlan.meals.map((meal, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex flex-col items-center pt-1">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#FF9F0A]" />
                                            <div className="w-px flex-1 bg-white/5 my-2" />
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] italic">{meal.split(':')[0] || 'Bữa ăn'}</p>
                                            <p className="text-[15px] font-bold text-white/80 leading-relaxed mt-1 uppercase tracking-tight italic">{meal.split(':').slice(1).join(':').trim() || meal}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/[0.02] p-6 rounded-[35px] border border-white/5 flex items-start gap-5 mt-4 group">
                                <Info size={24} weight="fill" className="text-white/20 group-hover:text-orange-500 transition-colors" />
                                <p className="text-[12px] font-medium text-white/40 italic leading-relaxed uppercase tracking-wide">
                                    LƯU Ý: ƯU TIÊN THỰC PHẨM TỰ NHIÊN. DUY TRÌ LƯỢNG NƯỚC 2.5L-3L MỖI CHU KỲ 24H.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="superapp-card-glass p-12 rounded-[45px] text-center border border-white/5 opacity-40 italic">
                            Đang phân tích định mức dinh dưỡng
                        </div>
                    )}
                </motion.div>

                {/* ── GOALS ANALYSIS ── */}
                <motion.div variants={fadeUp} className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <Target size={20} weight="fill" className="text-green-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Chỉ số hội tụ</span>
                        </div>
                        <ChartLineUp size={16} className="text-white/20" />
                    </div>

                    <div className="superapp-card-glass p-8 rounded-[45px] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full" />

                        {member?.goalTargets ? (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[14px] font-black italic uppercase text-white/40 tracking-widest">Cân nặng mục tiêu</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[32px] font-black italic tabular-nums text-white leading-none">{member.goalTargets.weightTo}</span>
                                        <span className="text-[12px] font-black italic color-green-500">KG</span>
                                    </div>
                                </div>

                                <div className="h-6 w-full rounded-full bg-white/5 p-1 border border-white/5 relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '68%' }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                        className="h-full rounded-full relative"
                                        style={{ background: 'linear-gradient(90deg, #30D158 0%, #34C759 100%)', boxShadow: '0 0 15px rgba(48,209,88,0.3)' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50" />
                                    </motion.div>
                                </div>

                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] italic text-white/30">
                                    <span>BẮT ĐẦU: {member.goalTargets.weightFrom}KG</span>
                                    <span className="text-green-500">HIỆN TẠI: {member.bodyMetrics?.[0]?.weight || '--'}KG</span>
                                </div>

                                {member.goalTargets.note && (
                                    <div className="p-6 rounded-[30px] bg-white/[0.02] border border-white/5 italic text-[14px] font-bold text-white/60 text-center leading-relaxed">
                                        "{member.goalTargets.note}"
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[13px] text-center text-white/20 py-10 italic uppercase tracking-widest">Đang cập nhật chỉ tiêu mục tiêu</p>
                        )}
                    </div>
                </motion.div>

                <div className="text-center mt-4">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">HT-STRENGTH STRATEGIC HUB v2.0</p>
                    <div className="flex items-center justify-center gap-4 opacity-[0.05] mt-4">
                        <div className="w-12 h-[1px] bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="w-12 h-[1px] bg-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
