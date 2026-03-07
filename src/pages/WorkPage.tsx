import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import type { Task } from '../store/useBoardStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Plus, Check, Lightning, User,
    Briefcase, Trash, DotsThree,
    CalendarBlank, CheckCircle
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTeamStore } from '../store/useTeamStore';
import { useAuth } from '../hooks/useAuth';

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function WorkPage() {
    const { tasks: tasksMap, columnOrder, addTask, toggleTaskCompletion, deleteTask } = useBoardStore();
    const tasks = Object.values(tasksMap);
    const [newTaskText, setNewTaskText] = useState('');
    const [category, setCategory] = useState<Task['category']>('work');
    const [assigneeId, setAssigneeId] = useState<string | undefined>();
    const [showAddSheet, setShowAddSheet] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const { members: teamMembers } = useTeamStore();
    const { user } = useAuth();

    const handleAdd = (e: any) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const firstCol = columnOrder[0];
        addTask(firstCol, newTaskText, category, 'medium', assigneeId);

        setNewTaskText('');
        setAssigneeId(undefined);
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

    const pct = stats.total > 0 ? Math.round((stats.completed / Math.max(stats.total, 1)) * 100) : 0;

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="ios-animate-in min-h-full superapp-page pt-4 pb-24"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[32px] font-black tracking-tighter text-white">Quản lý Task</h1>
                    <p className="text-[13px] font-medium opacity-40">Điều hành vận hành phòng Gym</p>
                </div>
                <button onClick={() => setShowAddSheet(true)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E8613A] text-white shadow-[0_8px_20px_rgba(232,97,58,0.3)] active:scale-90 transition-transform">
                    <Plus size={24} weight="bold" />
                </button>
            </motion.div>

            {/* ── PROGRESS HERO ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <div className="superapp-card-glass p-6 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#0A84FF] opacity-10 blur-[60px] translate-x-12 -translate-y-12" />

                    <div className="flex items-center gap-6 relative z-10">
                        {/* Apple-style Ring */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                <motion.circle
                                    initial={{ strokeDasharray: "0 100" }}
                                    animate={{ strokeDasharray: `${pct} ${100 - pct}` }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    cx="18" cy="18" r="16" fill="none" stroke="#0A84FF" strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-black text-xl tabular-nums">{pct}<span className="text-[10px] opacity-40">%</span></span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0A84FF] mb-1">Tiến độ hôm nay</p>
                            <p className="text-[28px] font-black text-white leading-none tracking-tighter">
                                {stats.completed}<span className="text-[16px] opacity-30 mx-1">/</span>{stats.total}
                            </p>
                            <p className="text-[13px] font-medium opacity-40 mt-1">nhiệm vụ hoàn tất</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── FILTER CONTROL ── */}
            <motion.div variants={fadeUp} className="flex p-1 rounded-[16px] bg-white/5 border border-white/5 mb-6">
                {(['all', 'pending', 'completed'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-2.5 rounded-[12px] text-[13px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-white/10 text-white shadow-sm' : 'text-white/30'
                            }`}
                    >
                        {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Đang chờ' : 'Đã xong'}
                    </button>
                ))}
            </motion.div>

            {/* ── TASK LIST ── */}
            <motion.div variants={fadeUp} className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-20 text-center flex flex-col items-center gap-4 bg-white/[0.02] border border-dashed border-white/10 rounded-[32px]"
                        >
                            <div className="w-20 h-20 rounded-[28px] bg-white/5 flex items-center justify-center">
                                <CheckCircle size={48} weight="duotone" className="text-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-bold text-[17px]">Mọi thứ đã sẵn sàng</p>
                                <p className="text-white/30 text-[13px]">Bắt đầu ngày mới bằng một nhiệm vụ!</p>
                            </div>
                        </motion.div>
                    ) : (
                        filteredTasks.map((task, idx) => (
                            <IOSTaskRow
                                key={task.id} task={task}
                                onToggle={toggleTaskCompletion}
                                onDelete={deleteTask}
                                teamMembers={teamMembers}
                            />
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── ADD TASK SHEET ── */}
            <AnimatePresence>
                {showAddSheet && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddSheet(false)}
                            className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-[6px]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[301] superapp-card-glass rounded-t-[32px] border-t border-white/10 pb-10"
                        >
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-white/20" />
                            </div>

                            <div className="px-6 py-4 flex justify-between items-center border-b border-white/5">
                                <button onClick={() => setShowAddSheet(false)} className="text-[17px] font-bold text-red-500 active:scale-95 transition-transform">Huỷ</button>
                                <h3 className="text-[17px] font-black text-white">Nhiệm vụ mới</h3>
                                <button onClick={handleAdd} className="text-[17px] font-black text-[#0A84FF] active:scale-95 transition-transform">Lưu</button>
                            </div>

                            <div className="p-6 space-y-6">
                                <textarea
                                    value={newTaskText}
                                    onChange={e => setNewTaskText(e.target.value)}
                                    placeholder="Nội dung công việc..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-[20px] p-5 text-white text-[18px] outline-none focus:border-[#0A84FF]/40 transition-colors"
                                    autoFocus
                                />

                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'work', label: 'Vận hành', icon: Briefcase, color: '#0A84FF' },
                                        { id: 'personal', label: 'Hội viên', icon: User, color: '#BF5AF2' },
                                        { id: 'life', label: 'Đột xuất', icon: Lightning, color: '#30D158' }
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setCategory(item.id as any)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-[22px] border transition-all ${category === item.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-40'
                                                }`}
                                        >
                                            <item.icon size={24} weight="fill" style={{ color: item.color }} />
                                            <span className="text-[11px] font-black uppercase text-white tracking-widest">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function IOSTaskRow({ task, onToggle, onDelete, teamMembers }: {
    task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; teamMembers: any[]
}) {
    const priorityColor = { 'urgent': '#FF453A', 'high': '#FF9F0A', 'medium': '#0A84FF', 'low': '#30D158' }[task.priority] || '#8E8E93';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`superapp-card-glass p-5 rounded-[28px] flex items-start gap-4 transition-opacity ${task.completed ? 'opacity-40' : 'opacity-100'}`}
        >
            <button
                onClick={() => onToggle(task.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${task.completed ? 'bg-[#30D158] border-[#30D158]' : 'border-white/20'
                    }`}
            >
                {task.completed && <Check size={16} weight="bold" color="#fff" />}
            </button>

            <div className="flex-1 min-w-0">
                <p className={`text-[17px] font-bold tracking-tight text-white leading-tight ${task.completed ? 'line-through opacity-50' : ''}`}>
                    {task.content}
                </p>
                <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: priorityColor }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ưu tiên</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/30">
                        <CalendarBlank size={12} />
                        {format(new Date(task.date), 'dd/MM', { locale: vi })}
                    </div>
                </div>
            </div>

            <button onClick={() => onDelete(task.id)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 active:scale-90 transition-transform active:bg-red-500/20 active:text-red-500">
                <Trash size={20} weight="fill" />
            </button>
        </motion.div>
    );
}
