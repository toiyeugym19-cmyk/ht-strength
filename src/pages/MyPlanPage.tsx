import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { WORKOUT_PLANS } from '../constants/workoutPlans';
import { Barbell, ForkKnife, Target, CaretLeft, CheckCircle, Info } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

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
            className="ios-animate-in min-h-full superapp-page pb-20"
        >
            {/* Header */}
            <div className="flex items-center gap-4 py-4 px-4 sticky top-0 bg-[var(--g-bg)] z-10 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900">
                    <CaretLeft size={20} weight="bold" />
                </button>
                <h1 className="text-[20px] font-bold">Kế hoạch của tôi</h1>
            </div>

            <div className="px-4 space-y-6">
                {/* Workout Plan Section */}
                <motion.div variants={fadeUp} className="gym-section">
                    <p className="gym-section__title flex items-center gap-2">
                        <Barbell size={18} weight="duotone" />
                        Kế hoạch tập luyện
                    </p>
                    {workoutPlan ? (
                        <div className="gym-card p-5 border-l-4 border-blue-500">
                            <h3 className="text-[18px] font-bold text-blue-400">{workoutPlan.name}</h3>
                            <p className="text-[13px] mt-2 leading-relaxed ios-secondary">{workoutPlan.description}</p>

                            <div className="grid grid-cols-1 gap-3 mt-4">
                                <div className="bg-zinc-900/50 p-3 rounded-2xl flex items-center justify-between">
                                    <p className="text-[11px] uppercase font-bold text-zinc-500">Dự kiến thời gian</p>
                                    <p className="text-[15px] font-bold">{workoutPlan.estimatedMinutes} phút</p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-2">
                                <p className="text-[11px] font-bold uppercase text-zinc-500">Các bài tập chính</p>
                                {workoutPlan.exerciseIds.slice(0, 5).map((exId, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[13px]">
                                        <CheckCircle size={16} weight="fill" className="text-blue-500" />
                                        <span className="font-medium">{exId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span>
                                    </div>
                                ))}
                                {workoutPlan.exerciseIds.length > 5 && (
                                    <p className="text-[12px] text-zinc-500 pt-1">...và {workoutPlan.exerciseIds.length - 5} bài khác</p>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/my-workout')}
                                className="w-full mt-6 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[15px] superapp-tap-scale"
                            >
                                Bắt đầu tập ngay
                            </button>
                        </div>
                    ) : (
                        <div className="gym-card p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                <Barbell size={28} className="text-zinc-600" />
                            </div>
                            <p className="text-[15px] font-bold">Chưa có kế hoạch tập</p>
                            <p className="text-[13px] ios-tertiary mt-1">Liên hệ PT của bạn để được thiết kế giáo án riêng.</p>
                        </div>
                    )}
                </motion.div>

                {/* Meal Plan Section */}
                <motion.div variants={fadeUp} className="gym-section">
                    <p className="gym-section__title flex items-center gap-2">
                        <ForkKnife size={18} weight="duotone" />
                        Kế hoạch dinh dưỡng
                    </p>
                    {mealPlan ? (
                        <div className="gym-card p-5 border-l-4 border-orange-500">
                            <h3 className="text-[18px] font-bold text-orange-400">{mealPlan.name}</h3>

                            {/* Macros */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                <div className="bg-orange-500/10 p-2 rounded-xl text-center">
                                    <p className="text-[9px] uppercase font-bold text-orange-500">Calo</p>
                                    <p className="text-[13px] font-bold">{mealPlan.dailyCalories}</p>
                                </div>
                                <div className="bg-red-500/10 p-2 rounded-xl text-center">
                                    <p className="text-[9px] uppercase font-bold text-red-500">Pro</p>
                                    <p className="text-[13px] font-bold">{mealPlan.protein}g</p>
                                </div>
                                <div className="bg-blue-500/10 p-2 rounded-xl text-center">
                                    <p className="text-[9px] uppercase font-bold text-blue-500">Carb</p>
                                    <p className="text-[13px] font-bold">{mealPlan.carbs}g</p>
                                </div>
                                <div className="bg-yellow-500/10 p-2 rounded-xl text-center">
                                    <p className="text-[9px] uppercase font-bold text-yellow-500">Fat</p>
                                    <p className="text-[13px] font-bold">{mealPlan.fat}g</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {mealPlan.meals.map((meal, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            <div className="w-0.5 flex-1 bg-zinc-800 my-1" />
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-[11px] font-black text-orange-500 uppercase">{meal.split(':')[0] || 'Bữa ăn'}</p>
                                            <p className="text-[14px] font-medium leading-snug mt-1">{meal.split(':').slice(1).join(':').trim() || meal}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-zinc-900/50 p-4 rounded-2xl flex items-start gap-3 mt-2">
                                <Info size={18} className="text-zinc-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[12px] ios-tertiary">
                                    Ghi chú: Luôn ưu tiên thực phẩm tươi sống. Uống đủ 2.5-3L nước mỗi ngày.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="gym-card p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                <ForkKnife size={28} className="text-zinc-600" />
                            </div>
                            <p className="text-[15px] font-bold">Chưa có kế hoạch ăn</p>
                            <p className="text-[13px] ios-tertiary mt-1">Hệ thống sẽ cập nhật thực đơn khi PT hoàn tất đánh giá cơ thể bạn.</p>
                        </div>
                    )}
                </motion.div>

                {/* Goals Progress Section (MINDMAP E2) */}
                <motion.div variants={fadeUp} className="gym-section">
                    <p className="gym-section__title flex items-center gap-2">
                        <Target size={18} weight="duotone" />
                        Chỉ tiêu mục tiêu
                    </p>
                    <div className="gym-card p-5">
                        {member?.goalTargets ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[13px] mb-2">
                                        <span className="ios-secondary font-medium">Cân nặng mục tiêu</span>
                                        <span className="font-bold text-white">{member.goalTargets.weightTo} kg</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                                        <div className="h-full bg-green-500 w-[65%]" />
                                    </div>
                                    <div className="flex justify-between text-[10px] mt-1 ios-tertiary">
                                        <span>Bắt đầu: {member.goalTargets.weightFrom}kg</span>
                                        <span>Hiện tại: {member.bodyMetrics?.[0]?.weight || '--'}kg</span>
                                    </div>
                                </div>

                                {member.goalTargets.note && (
                                    <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 italic text-[12px] ios-secondary">
                                        "{member.goalTargets.note}"
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[13px] text-center ios-tertiary py-4">Chưa thiết lập chỉ tiêu.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
