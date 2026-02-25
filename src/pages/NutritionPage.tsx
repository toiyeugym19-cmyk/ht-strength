import React, { useState, useEffect } from 'react';
import { FOOD_DB, type FoodItem } from '../data/nutritionDB';
import { useNutritionStore, DIET_EXTENSIONS } from '../store/useNutritionStore';
import type { MealCommit } from '../store/useNutritionStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Flame,
    PieChart,
    Trash2,
    Search,
    UtensilsCrossed,
    Coffee,
    Sun,
    Moon,
    Apple,
    Settings,
    Edit3
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function NutritionPage() {
    const {
        commits,
        addCommit,
        deleteCommit,
        goals,
        currentPhase,
        activeExtensionId,
        applyExtension,
        userWeight,
        setWeight,
        calculateAutoPlan
    } = useNutritionStore();

    const [showPushModal, setShowPushModal] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<MealCommit['type']>('breakfast');
    const [showSettings, setShowSettings] = useState(false);

    const today = new Date();
    const todayMeals = commits.filter(c => isSameDay(new Date(c.date), today));

    const stats = todayMeals.reduce((acc, c) => ({
        calories: acc.calories + c.calories,
        protein: acc.protein + c.protein,
        carbs: acc.carbs + c.carbs,
        fat: acc.fat + c.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const activeMode = DIET_EXTENSIONS.find(e => e.id === activeExtensionId);

    const openAddMeal = (type: MealCommit['type']) => {
        setSelectedMealType(type);
        setShowPushModal(true);
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

    // ========== MOBILE VIEW ==========
    if (isMobile) {
        const caloriePercent = Math.min((stats.calories / goals.dailyCalories) * 100, 100);

        return (
            <div className="flex flex-col min-h-full bg-bg-dark pb-32" data-device="mobile">
                {/* Header Stats */}
                <div className="px-6 pt-8 pb-12 flex flex-col items-center">
                    <div className="relative w-48 h-48 group">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-[50px] rounded-full scale-75 group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <svg className="w-full h-full transform -rotate-90 relative z-10">
                            <circle cx="96" cy="96" r="82" strokeWidth="12" stroke="rgba(255,255,255,0.03)" fill="transparent" />
                            <circle
                                cx="96" cy="96" r="82" strokeWidth="12" stroke="currentColor" fill="transparent"
                                strokeDasharray={2 * Math.PI * 82}
                                strokeDashoffset={2 * Math.PI * 82 * (1 - caloriePercent / 100)}
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <Flame size={24} className="text-emerald-500 mb-2 animate-pulse" />
                            <span className="text-4xl font-[900] text-white italic tracking-tighter">{stats.calories}</span>
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">/ {goals.dailyCalories} KCAL</span>
                        </div>
                    </div>
                </div>

                {/* Macro Distribution */}
                <div className="grid grid-cols-3 gap-3 px-6 mb-8">
                    <div className="p-4 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 flex flex-col items-center">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">P</span>
                        <span className="text-lg font-black text-white italic">{stats.protein}g</span>
                    </div>
                    <div className="p-4 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 flex flex-col items-center">
                        <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-1">C</span>
                        <span className="text-lg font-black text-white italic">{stats.carbs}g</span>
                    </div>
                    <div className="p-4 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 flex flex-col items-center">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">F</span>
                        <span className="text-lg font-black text-white italic">{stats.fat}g</span>
                    </div>
                </div>

                {/* Meals Feed */}
                <div className="flex-1 space-y-6 px-6 no-scrollbar">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] px-2 mb-2">BỮA ĂN HÔM NAY</h3>
                    <MobileMealCard
                        icon={<Coffee size={18} />}
                        title="Bữa Sáng"
                        meals={todayMeals.filter(m => m.type === 'breakfast')}
                        onAdd={() => openAddMeal('breakfast')}
                        onDelete={deleteCommit}
                    />
                    <MobileMealCard
                        icon={<Sun size={18} />}
                        title="Bữa Trưa"
                        meals={todayMeals.filter(m => m.type === 'lunch')}
                        onAdd={() => openAddMeal('lunch')}
                        onDelete={deleteCommit}
                    />
                    <MobileMealCard
                        icon={<Moon size={18} />}
                        title="Bữa Tối"
                        meals={todayMeals.filter(m => m.type === 'dinner')}
                        onAdd={() => openAddMeal('dinner')}
                        onDelete={deleteCommit}
                    />
                    <MobileMealCard
                        icon={<Apple size={18} />}
                        title="Ăn Nhẹ"
                        meals={todayMeals.filter(m => ['snack', 'pre-workout', 'post-workout'].includes(m.type))}
                        onAdd={() => openAddMeal('snack')}
                        onDelete={deleteCommit}
                    />
                </div>

                {/* Floating Add Menu */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPushModal(true)}
                    className="fixed bottom-24 right-6 w-16 h-16 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-black shadow-[0_20px_50px_rgba(16,185,129,0.4)] z-[90] border-4 border-[#030014]"
                >
                    <Plus size={30} strokeWidth={3} />
                </motion.button>

                <AnimatePresence>
                    {showPushModal && (
                        <CommitModal type={selectedMealType} onClose={() => setShowPushModal(false)} onAdd={addCommit} />
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ========== TABLET VIEW ==========
    if (isTablet) {
        return (
            <div className="flex flex-col h-full bg-bg-dark text-white overflow-hidden" data-device="tablet">
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    <div className="grid grid-cols-12 gap-8">
                        {/* LEFT: Stats & Progression */}
                        <div className="col-span-4 space-y-8">
                            <div className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 flex flex-col items-center shadow-2xl">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8">Daily Progress</span>
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="rgba(255,255,255,0.03)" fill="transparent" />
                                        <circle
                                            cx="96" cy="96" r="88" strokeWidth="12" stroke="currentColor" fill="transparent"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - Math.min(stats.calories / goals.dailyCalories, 1))}
                                            className="text-emerald-500 transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-[900] italic leading-none">{stats.calories}</span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-2">of {goals.dailyCalories}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4">Macronutrients</h4>
                                <div className="p-6 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 space-y-6">
                                    <MacroBar label="Protein" current={stats.protein} goal={goals.protein} color="bg-blue-500" textColor="text-blue-500" />
                                    <MacroBar label="Carbs" current={stats.carbs} goal={goals.carbs} color="bg-yellow-500" textColor="text-yellow-500" />
                                    <MacroBar label="Fat" current={stats.fat} goal={goals.fat} color="bg-rose-500" textColor="text-rose-500" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Meals & Controls */}
                        <div className="col-span-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-[900] italic uppercase leading-tight tracking-tighter">Nutrition <span className="text-emerald-500">Hub</span></h1>
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 active:scale-95 transition-all"
                                >
                                    <Settings size={22} className="text-zinc-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <MealSection title="Breakfast" icon={<Coffee size={20} />} recommended={`${Math.round(goals.dailyCalories * 0.25)} kcal`} meals={todayMeals.filter(m => m.type === 'breakfast')} onAdd={() => openAddMeal('breakfast')} onDelete={deleteCommit} />
                                <MealSection title="Lunch" icon={<Sun size={20} />} recommended={`${Math.round(goals.dailyCalories * 0.35)} kcal`} meals={todayMeals.filter(m => m.type === 'lunch')} onAdd={() => openAddMeal('lunch')} onDelete={deleteCommit} />
                                <MealSection title="Dinner" icon={<Moon size={20} />} recommended={`${Math.round(goals.dailyCalories * 0.30)} kcal`} meals={todayMeals.filter(m => m.type === 'dinner')} onAdd={() => openAddMeal('dinner')} onDelete={deleteCommit} />
                                <MealSection title="Snacks" icon={<Apple size={20} />} recommended={`${Math.round(goals.dailyCalories * 0.10)} kcal`} meals={todayMeals.filter(m => ['snack', 'pre-workout', 'post-workout'].includes(m.type))} onAdd={() => openAddMeal('snack')} onDelete={deleteCommit} />
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showPushModal && (
                        <CommitModal type={selectedMealType} onClose={() => setShowPushModal(false)} onAdd={addCommit} />
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ========== DESKTOP VIEW ==========
    return (
        <div className="space-y-8 pb-32 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-[900] text-white italic uppercase tracking-tighter leading-none mb-2">
                        CHẾ ĐỘ <span className="text-emerald-500">DINH DƯỠNG</span>
                    </h1>
                    <p className="text-text-muted text-xs font-medium flex items-center gap-2">
                        {format(today, 'EEEE, d MMMM, yyyy', { locale: vi })}
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        Mục tiêu: <span className="text-emerald-400 font-bold uppercase">{currentPhase}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Cân nặng hiện tại</div>
                        <div className="text-2xl font-black italic text-white">{userWeight} kg</div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="btn bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10"
                    >
                        <Settings size={20} />
                    </button>
                    {showSettings && (
                        <div className="absolute top-24 right-4 md:right-10 z-50 w-72 glass-panel p-6 bg-[#0a0a0a] shadow-2xl animate-fade-in-up">
                            <h4 className="text-sm font-bold text-white mb-4">Cài đặt cá nhân</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-text-muted uppercase">Cân nặng (kg)</label>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={userWeight}
                                            onChange={(e) => setWeight(Number(e.target.value))}
                                            className="input bg-white/5 flex-1"
                                        />
                                        <button onClick={() => { calculateAutoPlan(); toast.success("Đã cập nhật mục tiêu!"); }} className="btn btn-primary px-3"><Edit3 size={14} /></button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-text-muted uppercase">Chế độ ăn</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {DIET_EXTENSIONS.map(ext => (
                                            <button
                                                key={ext.id}
                                                onClick={() => { applyExtension(ext.id); toast.success(`Đã chọn: ${ext.name}`); }}
                                                className={`text-left p-2 rounded-lg text-xs font-bold border ${activeExtensionId === ext.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-white/5 text-text-muted hover:bg-white/5'}`}
                                            >
                                                {ext.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nutrition Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Calories Circle */}
                <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="rgba(255,255,255,0.05)" fill="transparent" />
                            <circle
                                cx="96" cy="96" r="88" strokeWidth="12" stroke="currentColor" fill="transparent"
                                strokeDasharray={2 * Math.PI * 88}
                                strokeDashoffset={2 * Math.PI * 88 * (1 - Math.min(stats.calories / goals.dailyCalories, 1))}
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Flame size={24} className="text-emerald-500 mb-1" />
                            <span className="text-4xl font-black italic text-white tracking-tighter">{stats.calories}</span>
                            <span className="text-xs font-bold text-text-muted uppercase">/ {goals.dailyCalories} kcal</span>
                        </div>
                    </div>
                </div>

                {/* Macro Distribution */}
                <div className="lg:col-span-2 glass-panel p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <PieChart size={16} className="text-emerald-500" /> Phân Phối Macros (Hôm nay)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MacroBar label="ĐẠM (Protein)" current={stats.protein} goal={goals.protein} color="bg-blue-500" textColor="text-blue-500" />
                        <MacroBar label="TINH BỘT (Carbs)" current={stats.carbs} goal={goals.carbs} color="bg-yellow-500" textColor="text-yellow-500" />
                        <MacroBar label="CHẤT BÉO (Fat)" current={stats.fat} goal={goals.fat} color="bg-rose-500" textColor="text-rose-500" />
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="block w-2 h-2 rounded-full bg-blue-500" />
                            <span className="font-bold">{activeMode?.macroSplit.protein}% Protein</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="block w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="font-bold">{activeMode?.macroSplit.carbs}% Carbs</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="block w-2 h-2 rounded-full bg-rose-500" />
                            <span className="font-bold">{activeMode?.macroSplit.fat}% Fat</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meal Logging Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MealSection
                    title="BỮA SÁNG"
                    icon={<Coffee size={20} />}
                    recommended={`${Math.round(goals.dailyCalories * 0.25)} kcal`}
                    meals={todayMeals.filter(m => m.type === 'breakfast')}
                    onAdd={() => openAddMeal('breakfast')}
                    onDelete={deleteCommit}
                />

                <MealSection
                    title="BỮA TRƯA"
                    icon={<Sun size={20} />}
                    recommended={`${Math.round(goals.dailyCalories * 0.35)} kcal`}
                    meals={todayMeals.filter(m => m.type === 'lunch')}
                    onAdd={() => openAddMeal('lunch')}
                    onDelete={deleteCommit}
                />

                <MealSection
                    title="BỮA TỐI"
                    icon={<Moon size={20} />}
                    recommended={`${Math.round(goals.dailyCalories * 0.30)} kcal`}
                    meals={todayMeals.filter(m => m.type === 'dinner')}
                    onAdd={() => openAddMeal('dinner')}
                    onDelete={deleteCommit}
                />

                <MealSection
                    title="ĂN NHẸ / PRE-WORKOUT"
                    icon={<Apple size={20} />}
                    recommended={`${Math.round(goals.dailyCalories * 0.10)} kcal`}
                    meals={todayMeals.filter(m => ['snack', 'pre-workout', 'post-workout'].includes(m.type))}
                    onAdd={() => openAddMeal('snack')}
                    onDelete={deleteCommit}
                />
            </div>

            <AnimatePresence>
                {showPushModal && (
                    <CommitModal
                        type={selectedMealType}
                        onClose={() => setShowPushModal(false)}
                        onAdd={addCommit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Mobile Meal Card Component
function MobileMealCard({ icon, title, meals, onAdd, onDelete }: any) {
    const totalCals = meals.reduce((acc: number, m: any) => acc + m.calories, 0);

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        {icon}
                    </div>
                    <span className="font-bold text-white text-[14px]">{title}</span>
                </div>
                <span className="text-lg font-black text-white">{totalCals} <span className="text-[10px] text-neutral-500 font-normal">kcal</span></span>
            </div>

            {meals.length > 0 && (
                <div className="p-3 space-y-2">
                    {meals.map((meal: any) => (
                        <div key={meal.id} className="flex items-center justify-between p-2 bg-white/5 rounded-xl">
                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-white text-[13px] block truncate">{meal.message}</span>
                                <span className="text-[10px] text-neutral-500">{meal.calories} kcal • P:{meal.protein} C:{meal.carbs} F:{meal.fat}</span>
                            </div>
                            <button onClick={() => onDelete(meal.id)} className="p-1.5 text-neutral-600 active:text-red-400">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={onAdd}
                className="w-full p-3 flex items-center justify-center gap-2 text-[12px] text-neutral-500 font-bold border-t border-white/5"
            >
                <Plus size={14} /> Thêm món
            </button>
        </div>
    );
}

function MacroBar({ label, current, goal, color, textColor }: any) {
    const percent = Math.min((current / goal) * 100, 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">{label}</span>
                <span className={`text-sm font-black italic ${textColor}`}>{current} / {goal}g</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    )
}

function MealSection({ title, icon, recommended, meals, onAdd, onDelete }: any) {
    const totalCals = meals.reduce((acc: number, m: any) => acc + m.calories, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#0a0a0a] rounded-xl border border-white/5 text-emerald-500">
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase italic tracking-wide">{title}</h4>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Mục tiêu: {recommended}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-black text-white italic">{totalCals}</div>
                    <div className="text-[10px] text-text-muted font-bold uppercase">Kcal</div>
                </div>
            </div>

            <div className="space-y-2 pl-4 border-l border-white/5 ml-4">
                {meals.map((meal: any) => (
                    <div key={meal.id} className="group flex items-center justify-between p-3 bg-transparent hover:bg-white/5 rounded-xl transition-all">
                        <div>
                            <div className="font-bold text-sm text-white mb-0.5">{meal.message}</div>
                            <div className="text-[10px] text-text-muted font-mono flex gap-3">
                                <span className="text-emerald-400">{meal.calories} kcal</span>
                                <span>P: {meal.protein}</span>
                                <span>C: {meal.carbs}</span>
                                <span>F: {meal.fat}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onDelete(meal.id)}
                            className="p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={onAdd}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-text-muted hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> Thêm món ăn
                </button>
            </div>
        </div>
    )
}

function CommitModal({ onClose, onAdd, type }: { onClose: () => void, onAdd: (c: any) => void, type: string }) {
    const [formData, setFormData] = useState({
        message: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        type: type // Default to selected type
    });
    const [foodSearch, setFoodSearch] = useState('');
    const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);

    useEffect(() => {
        if (foodSearch.trim()) {
            setFilteredFoods(FOOD_DB.filter(f =>
                f.name.toLowerCase().includes(foodSearch.toLowerCase())
            ).slice(0, 5));
        } else {
            setFilteredFoods([]);
        }
    }, [foodSearch]);

    const selectFood = (food: FoodItem) => {
        setFormData({
            ...formData,
            message: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat
        });
        setFoodSearch('');
        setFilteredFoods([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            date: new Date().toISOString()
        });
        toast.success(`Đã thêm món vào bữa ${type === 'breakfast' ? 'Sáng' : type === 'lunch' ? 'Trưa' : 'Tối'}!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative glass-panel p-8 w-full max-w-xl border border-white/20 bg-[#0a0a0a] shadow-2xl">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <UtensilsCrossed className="text-emerald-500" /> THÊM MÓN ĂN
                </h3>

                {/* Food Quick Search */}
                <div className="relative mb-6 z-50">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">Tìm kiếm món ăn (100+ món có sẵn)</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                            className="input w-full pl-10 bg-white/5 border-white/10 focus:border-emerald-500/50"
                            placeholder="Phở bò, Cơm tấm, Ức gà..."
                            value={foodSearch}
                            onChange={e => setFoodSearch(e.target.value)}
                        />
                    </div>
                    {filteredFoods.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto custom-scrollbar z-[60]">
                            {filteredFoods.map(food => (
                                <button
                                    key={food.id}
                                    type="button"
                                    onClick={() => selectFood(food)}
                                    className="w-full p-3 text-left hover:bg-white/5 flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
                                >
                                    <div>
                                        <div className="font-bold text-white text-sm">{food.name} <span className="text-text-muted font-normal text-xs">({food.unit})</span></div>
                                        <div className="text-[10px] text-text-muted font-mono mt-0.5 space-x-2">
                                            <span className="text-orange-400">{food.calories}kcal</span>
                                            <span className="text-blue-400">P:{food.protein}</span>
                                            <span className="text-yellow-400">C:{food.carbs}</span>
                                        </div>
                                    </div>
                                    <Plus size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-white/5 my-6" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tên món ăn</label>
                        <input required type="text" className="input w-full bg-white/5 border-white/10" placeholder="Ví dụ: Ức gà nướng..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Bữa</label>
                            <select className="input uppercase font-bold text-xs bg-white/5 border-white/10" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                                <option value="breakfast">Sáng</option>
                                <option value="lunch">Trưa</option>
                                <option value="dinner">Tối</option>
                                <option value="snack">Ăn nhẹ</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Calo</label>
                            <input required type="number" className="input bg-white/5 border-white/10" value={formData.calories || ''} onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Đạm (g)</label>
                            <input required type="number" className="input bg-white/5 border-white/10" value={formData.protein || ''} onChange={e => setFormData({ ...formData, protein: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Carb (g)</label>
                            <input required type="number" className="input bg-white/5 border-white/10" value={formData.carbs || ''} onChange={e => setFormData({ ...formData, carbs: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Fat (g)</label>
                            <input required type="number" className="input bg-white/5 border-white/10" value={formData.fat || ''} onChange={e => setFormData({ ...formData, fat: Number(e.target.value) })} />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 btn bg-white/5 border border-white/10 hover:bg-white/10">HỦY</button>
                        <button type="submit" className="flex-1 btn btn-primary bg-emerald-500 hover:bg-emerald-600 border-none text-black">LƯU MÓN</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
