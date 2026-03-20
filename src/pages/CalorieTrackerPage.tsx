import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Flame, Plus, Trash, MagnifyingGlass,
    Gear, Drop, Target, AppleLogo, Coffee, Sun, Moon,
    Lightning, X, Check, CaretLeft, CaretRight, Sparkle, Wind, ChartLineUp
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useCalorieStore, type FoodEntry } from '../store/useCalorieStore';

// ============================================================
//  CALORIE TRACKER PAGE — Fuel Matrix (Premium Redesign)
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
];

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

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
        <motion.div variants={stagger} initial="hidden" animate="show" className="min-h-full pb-32 ios-animate-in">

            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#FF9F0A]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Fuel Matrix Analyzer</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                            Calo & Macro
                        </h1>
                        <p className="text-[13px] font-bold text-white/30 mt-2 italic uppercase tracking-widest">Kiểm soát năng lượng sinh học</p>
                    </div>
                    <button onClick={() => setShowGoalEditor(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90 transition-transform">
                        <Gear size={22} weight="fill" />
                    </button>
                </div>

                {/* Date Selector */}
                <div className="flex items-center justify-center gap-6 mt-10">
                    <button onClick={() => setSelectedDate(d => subDays(d, 1))} className="p-3 rounded-full bg-white/5 text-white/40 active:scale-90 transition-all">
                        <CaretLeft size={20} weight="bold" />
                    </button>
                    <div className="text-center px-4">
                        <span className="text-[14px] font-black uppercase tracking-[0.2em] text-white italic">
                            {format(selectedDate, 'EEEE, dd/MM', { locale: vi })}
                        </span>
                    </div>
                    <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-3 rounded-full bg-white/5 text-white/40 active:scale-90 transition-all">
                        <CaretRight size={20} weight="bold" />
                    </button>
                </div>
            </motion.div>

            {/* ── MAIN GAUGE ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="superapp-card-glass p-8 rounded-[45px] border border-white/5 relative overflow-hidden text-center glass-reflection floating-card-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />

                    <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(255,159,10,0.2)]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                            <motion.circle
                                cx="50" cy="50" r="44" fill="none"
                                stroke="#FF9F0A" strokeWidth="6" strokeLinecap="round"
                                strokeDasharray="276.5"
                                initial={{ strokeDashoffset: 276.5 }}
                                animate={{ strokeDashoffset: 276.5 * (1 - progress) }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <ChartLineUp className="text-orange-500 mb-2 animate-bounce-slow" size={24} weight="fill" />
                            <span className="text-[48px] font-black italic tracking-tighter tabular-nums text-white leading-none">
                                {totals.calories.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2 italic">Calories nạp</span>
                        </div>
                    </div>

                    <p className="text-[13px] font-black uppercase tracking-widest italic text-white/40 mb-8">
                        {remaining > 0 ? `Còn thiếu ${remaining} cal để đạt mục tiêu` : `Vượt mức ${Math.abs(remaining)} cal bộ nhớ`}
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                        <MacroMini label="PROTEIN" current={totals.protein} goal={calorieGoal.protein} color="#FF375F" />
                        <MacroMini label="CARBS" current={totals.carbs} goal={calorieGoal.carbs} color="#0A84FF" />
                        <MacroMini label="FAT" current={totals.fat} goal={calorieGoal.fat} color="#FFD60A" />
                    </div>
                </div>
            </motion.div>

            {/* ── WATER INTAKE ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="neural-island p-6 rounded-[35px] border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Drop size={20} weight="fill" className="text-cyan-400" />
                            <span className="text-[12px] font-black uppercase tracking-widest italic text-white/80">Cung cấp nước</span>
                        </div>
                        <span className="text-[14px] font-black italic color-cyan-400">{dayData.waterGlasses}/8 <span className="text-[10px] opacity-40">ly</span></span>
                    </div>
                    <div className="flex gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => {
                                    if (i < dayData.waterGlasses) useCalorieStore.getState().removeWater(dateKey);
                                    else useCalorieStore.getState().addWater(dateKey);
                                }}
                                className={`flex-1 h-10 rounded-xl transition-all border ${i < dayData.waterGlasses
                                    ? 'bg-cyan-500 border-cyan-400 shadow-[0_5px_15px_rgba(6,182,212,0.3)]'
                                    : 'bg-white/5 border-white/5'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── MEAL LOGS ── */}
            <motion.div variants={fadeUp} className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Nhật ký dinh dưỡng</span>
                    <Sparkle size={16} className="text-white/20" />
                </div>

                <div className="space-y-4">
                    <MealRow title="Bữa Sáng" icon={Coffee} entries={mealGroups.breakfast} color="#FF9F0A" onAdd={() => { setAddMealType('breakfast'); setShowAddModal(true); }} onDelete={(id: string) => removeFoodEntry(dateKey, id)} />
                    <MealRow title="Bữa Trưa" icon={Sun} entries={mealGroups.lunch} color="#FFD60A" onAdd={() => { setAddMealType('lunch'); setShowAddModal(true); }} onDelete={(id: string) => removeFoodEntry(dateKey, id)} />
                    <MealRow title="Bữa Tối" icon={Moon} entries={mealGroups.dinner} color="#BF5AF2" onAdd={() => { setAddMealType('dinner'); setShowAddModal(true); }} onDelete={(id: string) => removeFoodEntry(dateKey, id)} />
                    <MealRow title="Ăn Vặt" icon={AppleLogo} entries={mealGroups.snack} color="#30D158" onAdd={() => { setAddMealType('snack'); setShowAddModal(true); }} onDelete={(id: string) => removeFoodEntry(dateKey, id)} />
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showAddModal && (
                    <AddFoodModal mealType={addMealType} dateKey={dateKey} onClose={() => setShowAddModal(false)} />
                )}
                {showGoalEditor && (
                    <GoalEditorModal onClose={() => setShowGoalEditor(false)} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function MacroMini({ label, current, goal, color }: any) {
    const pct = Math.min(1, current / goal);
    return (
        <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5">
            <p className="text-[14px] font-black italic tabular-nums text-white/90">{Math.round(current)}<span className="text-[9px] opacity-30 ml-0.5">g</span></p>
            <div className="w-full h-1 mt-2 mb-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: color, width: `${pct * 100}%` }} initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} />
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">{label}</p>
        </div>
    );
}

function MealRow({ title, icon: Icon, entries, color, onAdd, onDelete }: any) {
    const totalCal = entries.reduce((s: number, e: any) => s + e.calories, 0);
    return (
        <div className="superapp-card-glass rounded-[35px] border border-white/5 overflow-hidden">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10" style={{ background: `${color}10`, color }}>
                        <Icon size={24} weight="fill" />
                    </div>
                    <div>
                        <h4 className="text-[16px] font-black italic uppercase tracking-tighter text-white/90">{title}</h4>
                        {totalCal > 0 && <p className="text-[10px] font-black text-orange-400/60 uppercase tracking-widest mt-0.5">{totalCal} CALORIES</p>}
                    </div>
                </div>
                <button onClick={onAdd} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-all">
                    <Plus size={18} weight="bold" />
                </button>
            </div>
            {entries.length > 0 && (
                <div className="px-6 pb-6 space-y-3">
                    {entries.map((e: any) => (
                        <div key={e.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{e.emoji || '🍽️'}</span>
                                <div>
                                    <p className="text-[13px] font-black italic uppercase text-white/80">{e.name}</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{e.quantity} {e.unit} • P:{e.protein}g C:{e.carbs}g F:{e.fat}g</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[14px] font-black italic text-orange-400">{e.calories}</span>
                                <button onClick={() => onDelete(e.id)} className="text-red-500/30 hover:text-red-500 transition-colors">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AddFoodModal({ mealType, dateKey, onClose }: any) {
    const [search, setSearch] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selected, setSelected] = useState<any>(null);
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
        <motion.div className="fixed inset-0 z-[200] flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-h-[90vh] rounded-t-[45px] bg-[#111111] border-t border-white/10 p-8 pt-4 overflow-hidden flex flex-col"
            >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[22px] font-black italic uppercase tracking-tighter text-white">Thêm vào {mealType === 'breakfast' ? 'Bữa Sáng' : mealType === 'lunch' ? 'Bữa Trưa' : mealType === 'dinner' ? 'Bữa Tối' : 'Ăn Vặt'}</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40"><X size={20} weight="bold" /></button>
                </div>

                <div className="relative mb-6">
                    <MagnifyingGlass size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm kiếm thực phẩm..."
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[15px] font-black italic uppercase text-white outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                </div>

                {selected ? (
                    <div className="space-y-8 pb-10 overflow-y-auto no-scrollbar">
                        <div className="superapp-card-glass p-6 rounded-3xl border border-orange-500/20 flex items-center gap-6">
                            <span className="text-4xl">{selected.emoji}</span>
                            <div>
                                <h4 className="text-[18px] font-black italic uppercase text-white">{selected.name}</h4>
                                <p className="text-orange-500 text-[14px] font-black italic tabular-nums">{Math.round(selected.calories * quantity)} calories</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-black uppercase tracking-widest text-white/30 italic">Định lượng ({selected.unit})</span>
                            <div className="flex items-center gap-6">
                                <button onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white text-xl font-black active:scale-90 transition-all">−</button>
                                <span className="text-2xl font-black italic tabular-nums text-white w-8 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 0.5)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white text-xl font-black active:scale-90 transition-all">+</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { l: 'PRO', v: selected.protein * quantity, c: '#FF375F' },
                                { l: 'CAR', v: selected.carbs * quantity, c: '#0A84FF' },
                                { l: 'FAT', v: selected.fat * quantity, c: '#FFD60A' },
                                { l: 'FIB', v: (selected.fiber || 0) * quantity, c: '#30D158' }
                            ].map(m => (
                                <div key={m.l} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[14px] font-black italic tabular-nums" style={{ color: m.c }}>{Math.round(m.v * 10) / 10}g</p>
                                    <p className="text-[8px] font-black uppercase text-white/20 mt-1 italic tracking-widest">{m.l}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setSelected(null)} className="flex-1 h-16 rounded-[28px] bg-white/5 text-white/40 text-[12px] font-black uppercase tracking-widest italic active:scale-95 transition-all">QUAY LẠI</button>
                            <button onClick={handleAdd} className="flex-[2] h-16 rounded-[28px] bg-orange-500 text-white text-[14px] font-black uppercase tracking-widest italic shadow-[0_15px_35px_rgba(255,159,10,0.3)] active:scale-95 transition-all">XÁC NHẬN</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pb-10">
                        {filtered.map(f => (
                            <button
                                key={f.name}
                                onClick={() => { setSelected(f); setQuantity(1); }}
                                className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all active:scale-[0.98] text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <span className="text-3xl">{f.emoji}</span>
                                    <div>
                                        <h4 className="text-[15px] font-black italic uppercase text-white/90">{f.name}</h4>
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">P:{f.protein}g C:{f.carbs}g F:{f.fat}g</p>
                                    </div>
                                </div>
                                <span className="text-[16px] font-black italic text-orange-400/80 tabular-nums">{f.calories}</span>
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

function GoalEditorModal({ onClose }: any) {
    const { calorieGoal, updateGoal, autoDetectCalories } = useCalorieStore();
    const [local, setLocal] = useState({ ...calorieGoal });

    const handleSave = () => {
        updateGoal(local);
        onClose();
        toast.success("Mục tiêu dinh dưỡng đã được cập nhật!");
    };

    return (
        <motion.div className="fixed inset-0 z-[200] flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-h-[90vh] rounded-t-[45px] bg-[#111111] border-t border-white/10 p-8 pt-4 overflow-y-auto no-scrollbar"
            >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[22px] font-black italic uppercase tracking-tighter text-white">Cài Đặt Mục Tiêu</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40"><X size={20} weight="bold" /></button>
                </div>

                <div className="space-y-4 mb-10">
                    <GoalInput label="Lượng Calo Ngày" value={local.calories} onChange={(v: any) => setLocal((l: any) => ({ ...l, calories: v }))} unit="CAL" />
                    <GoalInput label="Mục Tiêu Protein" value={local.protein} onChange={(v: any) => setLocal((l: any) => ({ ...l, protein: v }))} unit="G" />
                    <GoalInput label="Mục Tiêu Carbs" value={local.carbs} onChange={(v: any) => setLocal((l: any) => ({ ...l, carbs: v }))} unit="G" />
                    <GoalInput label="Mục Tiêu Chất Béo" value={local.fat} onChange={(v: any) => setLocal((l: any) => ({ ...l, fat: v }))} unit="G" />
                </div>

                <div className="flex gap-4 pb-10">
                    <button onClick={() => { autoDetectCalories(); onClose(); }} className="flex-1 h-16 rounded-[28px] bg-white/5 text-white/40 text-[12px] font-black uppercase tracking-widest italic active:scale-95 transition-all">TỰ ĐỘNG TÍNH</button>
                    <button onClick={handleSave} className="flex-[2] h-16 rounded-[28px] bg-orange-500 text-white text-[14px] font-black uppercase tracking-widest italic shadow-[0_15px_35px_rgba(255,159,10,0.3)] active:scale-95 transition-all">LƯU CÀI ĐẶT</button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function GoalInput({ label, value, onChange, unit }: any) {
    return (
        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
            <span className="text-[12px] font-black uppercase tracking-widest text-white/40 italic">{label}</span>
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="w-24 bg-transparent text-right text-[20px] font-black italic tabular-nums text-white outline-none"
                />
                <span className="text-[10px] font-black text-white/20 italic">{unit}</span>
            </div>
        </div>
    );
}
