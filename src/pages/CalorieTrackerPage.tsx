import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Flame, ChevronLeft, ChevronRight, Plus, Trash2, Search,
    Settings, Droplets, Target, TrendingUp, Apple, Coffee, Sun, Moon,
    Zap, ArrowLeft, X, Check
} from 'lucide-react';
import { useCalorieStore, type FoodEntry } from '../store/useCalorieStore';

// ============================================================
//  POPULAR FOODS DATABASE
// ============================================================
const POPULAR_FOODS = [
    { name: 'Cơm trắng', emoji: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, unit: 'chén' },
    { name: 'Ức gà', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, unit: '100g' },
    { name: 'Trứng luộc', emoji: '🥚', calories: 78, protein: 6, carbs: 0.6, fat: 5.3, fiber: 0, unit: 'quả' },
    { name: 'Chuối', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, unit: 'trái' },
    { name: 'Sữa chua', emoji: '🥛', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, unit: 'hộp' },
    { name: 'Phở bò', emoji: '🍜', calories: 450, protein: 25, carbs: 55, fat: 12, fiber: 2, unit: 'tô' },
    { name: 'Bún chả', emoji: '🥗', calories: 380, protein: 22, carbs: 45, fat: 10, fiber: 3, unit: 'suất' },
    { name: 'Bánh mì', emoji: '🥖', calories: 350, protein: 15, carbs: 40, fat: 12, fiber: 2, unit: 'ổ' },
    { name: 'Salad cá hồi', emoji: '🥗', calories: 280, protein: 28, carbs: 10, fat: 14, fiber: 4, unit: 'đĩa' },
    { name: 'Whey Protein', emoji: '🥤', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, unit: 'scoop' },
    { name: 'Yến mạch', emoji: '🥣', calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4, unit: 'chén' },
    { name: 'Khoai lang', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, unit: '100g' },
    { name: 'Bơ', emoji: '🥑', calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 7, unit: 'trái' },
    { name: 'Cá hồi nướng', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, unit: '100g' },
    { name: 'Đậu phụ', emoji: '🧈', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, unit: '100g' },
    { name: 'Sữa hạnh nhân', emoji: '🥛', calories: 30, protein: 1, carbs: 1, fat: 2.5, fiber: 0.5, unit: 'ly' },
];

// ============================================================
//  CALORIE TRACKER PAGE
// ============================================================
export default function CalorieTrackerPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [addMealType, setAddMealType] = useState<FoodEntry['mealType']>('breakfast');
    const [showGoalEditor, setShowGoalEditor] = useState(false);

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const { calorieGoal, getDayTotals, getDayData, removeFoodEntry } = useCalorieStore();
    const totals = getDayTotals(dateKey);
    const dayData = getDayData(dateKey);
    const remaining = calorieGoal.calories - totals.calories;

    const progress = Math.min(1, totals.calories / calorieGoal.calories);

    const mealGroups = useMemo(() => ({
        breakfast: dayData.entries.filter(e => e.mealType === 'breakfast'),
        lunch: dayData.entries.filter(e => e.mealType === 'lunch'),
        dinner: dayData.entries.filter(e => e.mealType === 'dinner'),
        snack: dayData.entries.filter(e => e.mealType === 'snack'),
    }), [dayData.entries]);

    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a1a' }}>
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Flame className="text-orange-500" size={22} />
                        Calorie Goal
                    </h1>
                    <button onClick={() => setShowGoalEditor(true)} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Settings size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Date Selector */}
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button onClick={() => setSelectedDate(d => subDays(d, 1))} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <ChevronLeft size={18} className="text-gray-400" />
                    </button>
                    <span className="text-white font-semibold text-sm">
                        {format(selectedDate, 'EEEE, dd/MM', { locale: vi })}
                    </span>
                    <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Main Calorie Display */}
            <div className="px-4 py-6">
                <div className="rounded-3xl p-6 text-center relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Circular Progress */}
                    <div className="relative w-48 h-48 mx-auto mb-4">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                            <motion.circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke="url(#orangeGrad)"
                                strokeWidth="6" strokeLinecap="round"
                                strokeDasharray={`${progress * 264} 264`}
                                initial={{ strokeDasharray: '0 264' }}
                                animate={{ strokeDasharray: `${progress * 264} 264` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                            <defs>
                                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FF6B00" />
                                    <stop offset="100%" stopColor="#FF9500" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Flame className="text-orange-500 mb-1" size={20} />
                            <motion.span
                                className="text-4xl font-black text-white"
                                key={totals.calories}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                {totals.calories.toLocaleString()}
                            </motion.span>
                            <span className="text-xs text-gray-500 mt-1">cal</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm">
                        {remaining > 0 ? `${remaining} cal left for today.` : `${Math.abs(remaining)} cal over budget!`}
                    </p>

                    {/* Macro Breakdown */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <MacroCard label="Protein" current={totals.protein} goal={calorieGoal.protein} color="#EF4444" unit="g" />
                        <MacroCard label="Carbs" current={totals.carbs} goal={calorieGoal.carbs} color="#3B82F6" unit="g" />
                        <MacroCard label="Fat" current={totals.fat} goal={calorieGoal.fat} color="#F59E0B" unit="g" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 space-y-2 mb-6">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowGoalEditor(true)}
                    className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9500)', color: '#fff' }}
                >
                    Edit Calorie Goal <Target size={16} />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        useCalorieStore.getState().autoDetectCalories();
                    }}
                    className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    Autodetect Calorie Goal <Settings size={16} />
                </motion.button>
            </div>

            {/* Water Intake */}
            <div className="px-4 mb-6">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm flex items-center gap-2">
                            <Droplets size={16} className="text-cyan-400" /> Water Intake
                        </span>
                        <span className="text-cyan-400 font-bold text-sm">{dayData.waterGlasses}/8 glasses</span>
                    </div>
                    <div className="flex gap-1.5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => {
                                    if (i < dayData.waterGlasses) useCalorieStore.getState().removeWater(dateKey);
                                    else useCalorieStore.getState().addWater(dateKey);
                                }}
                                className="flex-1 h-8 rounded-lg transition-all"
                                style={{
                                    background: i < dayData.waterGlasses
                                        ? 'linear-gradient(135deg, #06B6D4, #0891B2)'
                                        : 'rgba(255,255,255,0.06)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Meal Sections */}
            <div className="px-4 space-y-3">
                <MealSection title="Breakfast" icon={<Coffee size={16} />} emoji="🌅" entries={mealGroups.breakfast}
                    onAdd={() => { setAddMealType('breakfast'); setShowAddModal(true); }}
                    onDelete={(id) => removeFoodEntry(dateKey, id)} />
                <MealSection title="Lunch" icon={<Sun size={16} />} emoji="☀️" entries={mealGroups.lunch}
                    onAdd={() => { setAddMealType('lunch'); setShowAddModal(true); }}
                    onDelete={(id) => removeFoodEntry(dateKey, id)} />
                <MealSection title="Dinner" icon={<Moon size={16} />} emoji="🌙" entries={mealGroups.dinner}
                    onAdd={() => { setAddMealType('dinner'); setShowAddModal(true); }}
                    onDelete={(id) => removeFoodEntry(dateKey, id)} />
                <MealSection title="Snack" icon={<Apple size={16} />} emoji="🍎" entries={mealGroups.snack}
                    onAdd={() => { setAddMealType('snack'); setShowAddModal(true); }}
                    onDelete={(id) => removeFoodEntry(dateKey, id)} />
            </div>

            {/* Add Food Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddFoodModal
                        mealType={addMealType}
                        dateKey={dateKey}
                        onClose={() => setShowAddModal(false)}
                    />
                )}
                {showGoalEditor && (
                    <GoalEditorModal onClose={() => setShowGoalEditor(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
//  MACRO CARD COMPONENT
// ============================================================
function MacroCard({ label, current, goal, color, unit }: { label: string; current: number; goal: number; color: string; unit: string }) {
    const pct = Math.min(1, current / goal);
    return (
        <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xl font-bold text-white">{Math.round(current)}{unit}</span>
            <div className="w-full h-1.5 rounded-full mt-2 mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div className="h-full rounded-full" style={{ background: color, width: `${pct * 100}%` }}
                    initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );
}

// ============================================================
//  MEAL SECTION COMPONENT
// ============================================================
function MealSection({ title, icon, emoji, entries, onAdd, onDelete }: {
    title: string; icon: React.ReactNode; emoji: string; entries: FoodEntry[]; onAdd: () => void; onDelete: (id: string) => void;
}) {
    const totalCal = entries.reduce((s, e) => s + e.calories, 0);
    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{emoji}</span>
                    <span className="text-white font-semibold text-sm">{title}</span>
                    {totalCal > 0 && <span className="text-xs text-orange-400 font-semibold">{totalCal} cal</span>}
                </div>
                <motion.button whileTap={{ scale: 0.85 }} onClick={onAdd}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9500)' }}>
                    <Plus size={16} className="text-white" />
                </motion.button>
            </div>
            {entries.length > 0 && (
                <div className="px-4 pb-3 space-y-2">
                    {entries.map(e => (
                        <motion.div key={e.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="flex items-center gap-2">
                                <span>{e.emoji || '🍽️'}</span>
                                <div>
                                    <p className="text-white text-xs font-medium">{e.name}</p>
                                    <p className="text-gray-500 text-[10px]">{e.quantity} {e.unit} • P:{e.protein}g C:{e.carbs}g F:{e.fat}g</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-orange-400 text-xs font-bold">{e.calories}</span>
                                <button onClick={() => onDelete(e.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================
//  ADD FOOD MODAL
// ============================================================
function AddFoodModal({ mealType, dateKey, onClose }: { mealType: FoodEntry['mealType']; dateKey: string; onClose: () => void }) {
    const [search, setSearch] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selected, setSelected] = useState<typeof POPULAR_FOODS[0] | null>(null);
    const { addFoodEntry } = useCalorieStore();

    const filtered = POPULAR_FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        if (!selected) return;
        addFoodEntry(dateKey, {
            name: selected.name,
            calories: Math.round(selected.calories * quantity),
            protein: Math.round(selected.protein * quantity * 10) / 10,
            carbs: Math.round(selected.carbs * quantity * 10) / 10,
            fat: Math.round(selected.fat * quantity * 10) / 10,
            fiber: Math.round(selected.fiber * quantity * 10) / 10,
            quantity,
            unit: selected.unit,
            mealType,
            emoji: selected.emoji,
        });
        onClose();
    };

    return (
        <motion.div className="fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-h-[85vh] rounded-t-3xl overflow-hidden"
                style={{ background: '#111127', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-lg">Add to {mealType}</h3>
                        <button onClick={onClose} className="p-2"><X size={20} className="text-gray-400" /></button>
                    </div>

                    <div className="relative mb-4">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search food..."
                            className="w-full py-3 pl-10 pr-4 rounded-xl text-sm text-white placeholder-gray-500 outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                    </div>

                    {selected ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)' }}>
                                <span className="text-3xl">{selected.emoji}</span>
                                <div>
                                    <p className="text-white font-semibold">{selected.name}</p>
                                    <p className="text-orange-400 text-sm">{Math.round(selected.calories * quantity)} cal</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Quantity ({selected.unit})</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ background: 'rgba(255,255,255,0.1)' }}>−</button>
                                    <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 0.5)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ background: 'rgba(255,255,255,0.1)' }}>+</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {[['P', totals('protein'), '#EF4444'], ['C', totals('carbs'), '#3B82F6'], ['F', totals('fat'), '#F59E0B'], ['Fiber', totals('fiber'), '#22C55E']].map(([l, v, c]) => (
                                    <div key={l as string} className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <p className="text-xs font-bold" style={{ color: c as string }}>{Math.round(Number(v) * quantity * 10) / 10}g</p>
                                        <p className="text-gray-500 text-[10px]">{l}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl text-gray-400 text-sm font-semibold"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}>Back</button>
                                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd}
                                    className="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9500)' }}>
                                    Add {Math.round(selected.calories * quantity)} cal
                                </motion.button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                            {filtered.map(f => (
                                <motion.button key={f.name} whileTap={{ scale: 0.97 }}
                                    onClick={() => { setSelected(f); setQuantity(1); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                >
                                    <span className="text-2xl">{f.emoji}</span>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">{f.name}</p>
                                        <p className="text-gray-500 text-xs">P:{f.protein}g C:{f.carbs}g F:{f.fat}g • per {f.unit}</p>
                                    </div>
                                    <span className="text-orange-400 font-bold text-sm">{f.calories}</span>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );

    function totals(key: string) {
        return (selected as any)?.[key] || 0;
    }
}

// ============================================================
//  GOAL EDITOR MODAL
// ============================================================
function GoalEditorModal({ onClose }: { onClose: () => void }) {
    const { calorieGoal, updateGoal, autoDetectCalories } = useCalorieStore();
    const [local, setLocal] = useState({ ...calorieGoal });

    const handleSave = () => {
        updateGoal(local);
        onClose();
    };

    return (
        <motion.div className="fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-h-[85vh] rounded-t-3xl overflow-y-auto"
                style={{ background: '#111127', borderTop: '1px solid rgba(255,255,255,0.08)', scrollbarWidth: 'none' }}
            >
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Edit Goals</h3>
                        <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
                    </div>

                    <div className="space-y-3">
                        <GoalInput label="Daily Calories" value={local.calories} onChange={v => setLocal(l => ({ ...l, calories: v }))} unit="cal" />
                        <GoalInput label="Protein" value={local.protein} onChange={v => setLocal(l => ({ ...l, protein: v }))} unit="g" />
                        <GoalInput label="Carbs" value={local.carbs} onChange={v => setLocal(l => ({ ...l, carbs: v }))} unit="g" />
                        <GoalInput label="Fat" value={local.fat} onChange={v => setLocal(l => ({ ...l, fat: v }))} unit="g" />
                    </div>

                    <div className="border-t border-white/5 pt-4">
                        <h4 className="text-white font-semibold text-sm mb-3">Auto-Calculate from Body Stats</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <GoalInput label="Weight" value={local.weight} onChange={v => setLocal(l => ({ ...l, weight: v }))} unit="kg" />
                            <GoalInput label="Height" value={local.height} onChange={v => setLocal(l => ({ ...l, height: v }))} unit="cm" />
                            <GoalInput label="Age" value={local.age} onChange={v => setLocal(l => ({ ...l, age: v }))} unit="yr" />
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {(['lose', 'maintain', 'gain'] as const).map(g => (
                                <button key={g} onClick={() => setLocal(l => ({ ...l, goal: g }))}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                                    style={{
                                        background: local.goal === g ? 'linear-gradient(135deg,#FF6B00,#FF9500)' : 'rgba(255,255,255,0.06)',
                                        color: local.goal === g ? '#fff' : '#9CA3AF',
                                    }}>{g === 'lose' ? '🔥 Lose' : g === 'maintain' ? '⚖️ Maintain' : '💪 Gain'}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2 pb-4">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { autoDetectCalories(); onClose(); }}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}>Auto-Detect</motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
                            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                            style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9500)' }}>Save Goals</motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function GoalInput({ label, value, onChange, unit }: { label: string; value: number; onChange: (v: number) => void; unit: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-gray-400 text-sm">{label}</span>
            <div className="flex items-center gap-1">
                <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
                    className="w-20 text-right text-white font-bold text-sm bg-transparent outline-none" />
                <span className="text-gray-500 text-xs">{unit}</span>
            </div>
        </div>
    );
}
