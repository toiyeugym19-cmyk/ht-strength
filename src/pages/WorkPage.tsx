import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import type { Task } from '../store/useBoardStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Zap, User, Briefcase, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// ============================================================
//  iOS 18 WORK PAGE - Native Design
// ============================================================

export default function WorkPage() {
    const { tasks: tasksMap, columnOrder, addTask, toggleTaskCompletion, deleteTask } = useBoardStore();
    const tasks = Object.values(tasksMap);
    const [newTaskText, setNewTaskText] = useState('');
    const [category, setCategory] = useState<Task['category']>('work');
    const [showAddSheet, setShowAddSheet] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const handleAdd = (e: any) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const firstCol = columnOrder[0];
        addTask(firstCol, newTaskText, category);
        setNewTaskText('');
        setShowAddSheet(false);
        toast.success('Đã tạo nhiệm vụ mới!');
    };

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="ios-animate-in space-y-5 pb-4">

            {/* ===== PROGRESS CARD ===== */}
            <div className="mx-4 mt-2">
                <div className="bg-gradient-to-br from-[var(--ios-tint)] to-[#FF8B5C] rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                    <div className="flex items-center gap-5 relative z-10">
                        {/* Progress Ring */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeWidth="3"
                                    strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{pct}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm">Tiến độ hôm nay</p>
                            <p className="text-white text-2xl font-bold">{stats.completed}/{stats.total} nhiệm vụ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== QUICK STATS ===== */}
            <div className="mx-4 grid grid-cols-2 gap-3">
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#30D158]/20 flex items-center justify-center mx-auto mb-2">
                        <Check size={20} className="text-[#30D158]" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.completed}</p>
                    <p className="text-[11px] text-[var(--ios-text-secondary)]">Hoàn thành</p>
                </div>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-[var(--ios-tint)]/20 flex items-center justify-center mx-auto mb-2">
                        <Target size={20} className="text-[var(--ios-tint)]" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    <p className="text-[11px] text-[var(--ios-text-secondary)]">Đang chờ</p>
                </div>
            </div>

            {/* ===== FILTER (iOS Segmented Control) ===== */}
            <div className="mx-4">
                <div className="ios-segmented" style={{ margin: 0 }}>
                    {(['all', 'pending', 'completed'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`ios-segmented__item ${filter === f ? 'ios-segmented__item--active' : ''}`}
                            style={filter === f ? { background: 'var(--ios-card-bg)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' } : {}}>
                            {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Đang chờ' : 'Đã xong'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== TASK LIST ===== */}
            <div className="mx-4">
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        {filteredTasks.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="py-16 text-center flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-[var(--ios-fill-tertiary)] flex items-center justify-center">
                                    <Check size={32} className="text-[var(--ios-text-tertiary)]" />
                                </div>
                                <p className="text-[var(--ios-text-secondary)] text-[15px]">Không có nhiệm vụ nào</p>
                            </motion.div>
                        ) : (
                            filteredTasks.map((task, idx) => (
                                <IOSTaskRow key={task.id} task={task} last={idx === filteredTasks.length - 1}
                                    onToggle={toggleTaskCompletion} onDelete={deleteTask} />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ===== FAB (Add Button) ===== */}
            <button onClick={() => setShowAddSheet(true)}
                className="fixed bottom-24 right-5 w-14 h-14 bg-[var(--ios-tint)] rounded-full flex items-center justify-center text-white shadow-lg z-[90] active:scale-90 transition-transform">
                <Plus size={28} />
            </button>

            {/* ===== ADD TASK SHEET ===== */}
            <AnimatePresence>
                {showAddSheet && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddSheet(false)} className="fixed inset-0 bg-black/40 z-[300]" />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[301] bg-[var(--ios-sheet-bg)] rounded-t-[14px]"
                            style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
                        >
                            <div className="flex justify-center pt-2 pb-1">
                                <div className="w-9 h-[5px] rounded-full bg-[var(--ios-separator-opaque)]" />
                            </div>
                            <div className="p-4 border-b border-[var(--ios-separator)] flex justify-between items-center">
                                <button onClick={() => setShowAddSheet(false)} className="text-[var(--ios-text-secondary)] text-[17px]">Huỷ</button>
                                <h3 className="text-[17px] font-semibold text-white">Nhiệm vụ mới</h3>
                                <button onClick={handleAdd} className="text-[var(--ios-tint)] text-[17px] font-semibold">Thêm</button>
                            </div>
                            <form onSubmit={handleAdd} className="p-5 space-y-5">
                                <textarea value={newTaskText} onChange={e => setNewTaskText(e.target.value)}
                                    placeholder="Nhập nội dung..."
                                    className="w-full h-28 bg-[var(--ios-fill-tertiary)] rounded-xl p-4 text-white text-[17px] outline-none resize-none placeholder:text-[var(--ios-text-tertiary)]"
                                    autoFocus />

                                <div>
                                    <p className="text-[13px] text-[var(--ios-text-secondary)] mb-2">Phân loại</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <IOSCategoryBtn active={category === 'work'} onClick={() => setCategory('work')}
                                            icon={<Briefcase size={18} />} label="Công việc" color="#0A84FF" />
                                        <IOSCategoryBtn active={category === 'personal'} onClick={() => setCategory('personal')}
                                            icon={<User size={18} />} label="Cá nhân" color="#BF5AF2" />
                                        <IOSCategoryBtn active={category === 'life'} onClick={() => setCategory('life')}
                                            icon={<Zap size={18} />} label="Cuộc sống" color="#30D158" />
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================
//  iOS Sub-Components
// ============================================================

function IOSTaskRow({ task, last, onToggle, onDelete }: {
    task: Task; last: boolean; onToggle: (id: string) => void; onDelete: (id: string) => void
}) {
    const priorityMap: Record<string, { label: string; color: string }> = {
        'urgent': { label: 'Gấp', color: '#FF453A' },
        'high': { label: 'Cao', color: '#FF9F0A' },
        'medium': { label: 'Vừa', color: '#0A84FF' },
        'low': { label: 'Thấp', color: '#30D158' },
    };
    const p = priorityMap[task.priority] || { label: task.priority, color: '#8E8E93' };

    const categoryMap: Record<string, string> = { 'work': 'Công việc', 'personal': 'Cá nhân', 'life': 'Cuộc sống' };

    return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
            style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16,
                borderBottom: !last ? '0.5px solid var(--ios-separator)' : 'none',
                opacity: task.completed ? 0.5 : 1,
            }}>

            {/* Checkbox */}
            <button onClick={() => onToggle(task.id)}
                style={{
                    width: 22, height: 22, marginTop: 2, borderRadius: '50%',
                    border: task.completed ? '2px solid var(--ios-tint)' : '2px solid var(--ios-text-tertiary)',
                    background: task.completed ? 'var(--ios-tint)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, cursor: 'pointer', padding: 0,
                }}>
                {task.completed && <Check size={12} color="#fff" strokeWidth={3} />}
            </button>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: 15, lineHeight: 1.4, margin: 0,
                    color: task.completed ? 'var(--ios-text-tertiary)' : '#F5F5F7',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {task.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 6, color: p.color, background: `${p.color}18` }}>{p.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--ios-text-tertiary)', padding: '2px 6px', borderRadius: 6, background: 'var(--ios-fill-tertiary)' }}>{categoryMap[task.category] || task.category}</span>
                    <span style={{ fontSize: 11, color: 'var(--ios-text-tertiary)' }}>{format(new Date(task.date), 'dd/MM')}</span>
                </div>
            </div>

            {/* Delete */}
            <button onClick={() => onDelete(task.id)}
                style={{ padding: 8, marginRight: -4, color: 'var(--ios-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                <Trash2 size={16} />
            </button>
        </motion.div>
    );
}

function IOSCategoryBtn({ active, onClick, icon, label, color }: {
    active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string
}) {
    return (
        <button type="button" onClick={onClick}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${active ? 'bg-opacity-20 ring-1' : 'bg-[var(--ios-fill-tertiary)]'
                }`}
            style={active ? { background: `${color}20`, boxShadow: `0 0 0 1px ${color}50` } : {}}>
            <div style={{ color: active ? color : 'var(--ios-text-secondary)' }}>{icon}</div>
            <span className="text-[11px] font-medium" style={{ color: active ? color : 'var(--ios-text-secondary)' }}>{label}</span>
        </button>
    );
}
