import { useState } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay,
    isToday, parseISO
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CaretLeft, CaretRight, CalendarBlank as CalendarIcon,
    CheckCircle, Circle, Clock, Barbell as Dumbbell, BookOpen as Book,
    Lightning as Zap, DotsSix as GripHorizontal
} from '@phosphor-icons/react';
import { useStore } from '../hooks/useStore';
import { useBoardStore } from '../store/useBoardStore';
import { useJournalStore } from '../store/useJournalStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { useCalendarStore } from '../store/useCalendarStore';
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

// --- DATA TYPES ---
type AgendaItem = {
    id: string;
    type: 'task' | 'gym' | 'nutrition' | 'journal' | 'appointment' | 'focus' | 'social' | 'health';
    title: string;
    subtitle?: string;
    time?: string;
    date: Date;
    status?: 'completed' | 'pending' | 'none';
    meta?: any;
    originalObj?: any; // To pass back to store updates
};

// --- SUB COMPONENTS ---
function DraggableAgendaItem({ item }: { item: AgendaItem }) {
    // Only tasks are draggable for now as they are the main "schedule" units we might reschedule
    const isDraggable = item.type === 'task';
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `agenda-${item.id}`,
        data: item,
        disabled: !isDraggable
    });

    const isCompleted = item.status === 'completed';

    const getIcon = () => {
        switch (item.type) {
            case 'task': return isCompleted ? <CheckCircle size={18} weight="fill" className="text-[#30D158] shadow-[0_0_10px_#30D158]" /> : <Circle size={18} weight="duotone" className="text-white/20" />;
            case 'gym': return <Dumbbell size={18} weight="duotone" className="text-[#BF5AF2]" />;
            case 'nutrition': return <Zap size={18} weight="duotone" className="text-[#FF9F0A]" />;
            case 'journal': return <Book size={18} weight="duotone" className="text-[#0A84FF]" />;
            case 'appointment': return <Clock size={18} weight="duotone" className="text-[#FF375F]" />;
            case 'focus': return <Zap size={18} weight="duotone" className="text-[#FFD60A]" />;
            case 'social': return <Circle size={18} weight="duotone" className="text-[#64D2FF]" />;
            default: return <Clock size={18} weight="duotone" className="text-white/20" />;
        }
    };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`${isDragging ? 'opacity-50' : 'opacity-100'} mb-5 relative group`}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-8"
            >
                {/* Time Column */}
                <div className="w-16 shrink-0 flex flex-col items-end pt-1.5">
                    <span className="text-[14px] font-black tabular-nums text-white/40 italic">{item.time || "--:--"}</span>
                </div>

                {/* Vertical Line Connector */}
                <div className="relative pt-3 flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-4 border-[#030014] z-10 relative ${isCompleted ? 'bg-[#30D158] shadow-[0_0_10px_#30D158]' : 'bg-white/10'}`} />
                    <div className="absolute top-6 w-px h-[calc(100%+20px)] bg-white/5 -z-0" />
                </div>

                {/* Content Card (Neural Style) */}
                <div className={`flex-1 p-6 rounded-[30px] superapp-card-glass transition-all duration-500 relative overflow-hidden group-hover:border-white/20
                    ${item.type === 'task' ? 'border-l-[6px] border-l-[#0A84FF]' : ''}
                    ${item.type === 'gym' ? 'border-l-[6px] border-l-[#BF5AF2]' : ''}
                    ${item.type === 'nutrition' ? 'border-l-[6px] border-l-[#FF9F0A]' : ''}
                    ${item.type === 'journal' ? 'border-l-[6px] border-l-[#30D158]' : ''}
                `} style={{ border: '1px solid rgba(255,255,255,0.05)', borderLeftWidth: '6px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    <div className="flex items-start justify-between relative z-10">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-2 opacity-60">
                                {getIcon()}
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] italic text-white/40">{item.type}</span>
                            </div>
                            <h4 className={`text-[17px] font-black leading-tight text-white uppercase italic tracking-tighter truncate ${isCompleted && item.type === 'task' ? 'line-through opacity-30 text-white/50' : ''}`}>
                                {item.title}
                            </h4>
                            {item.subtitle && <p className="text-[11px] font-black text-white/20 mt-1.5 uppercase tracking-widest truncate italic">{item.subtitle}</p>}
                        </div>
                        {isDraggable && (
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-white/40 group-hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing">
                                <GripHorizontal size={20} weight="bold" />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function DroppableDay({ date, isSelected, isCurrentMonth, isTodayDate, hasEvents, onClick, children }: any) {
    const { setNodeRef, isOver } = useDroppable({
        id: date.toISOString(),
        data: { date }
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                relative h-[48px] w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 rounded-[15px]
                ${!isCurrentMonth ? "opacity-10 scale-90" : "hover:bg-white/5"}
                ${isSelected ? "z-10 scale-110" : ""}
                ${isOver ? "ring-2 ring-blue-500 scale-110 bg-blue-500/10 z-20" : ""}
            `}
            style={{
                background: isSelected ? 'var(--sa-primary)' : 'transparent',
                boxShadow: isSelected ? '0 10px 25px rgba(59, 130, 246, 0.4)' : 'none',
                color: isSelected ? 'white' : isTodayDate ? '#3b82f6' : 'white'
            }}
            onClick={onClick}
        >
            <span className={`text-[13px] font-black tabular-nums transition-colors ${isSelected ? 'text-white' : isTodayDate ? 'text-blue-400' : 'text-white/60'}`}>
                {children}
            </span>
            {hasEvents && !isSelected && (
                <div className="absolute bottom-2 flex gap-[2px]">
                    <div className={`w-[3px] h-[3px] rounded-full ${isTodayDate ? 'bg-blue-400' : 'bg-primary'}`} />
                </div>
            )}
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);

    const { gymLogs } = useStore();
    const { tasks, updateTaskDate } = useBoardStore();
    const { entries } = useJournalStore();
    const { commits } = useNutritionStore();
    const { events: standaloneEvents } = useCalendarStore();

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

    // --- DATA TRANSFORMATION ---
    const getItemsForDate = (date: Date): AgendaItem[] => {
        const items: AgendaItem[] = [];

        // Tasks
        Object.values(tasks).forEach(task => {
            const taskDate = parseISO(task.date);
            if (isSameDay(taskDate, date)) {
                items.push({
                    id: task.id,
                    type: 'task',
                    title: task.content,
                    subtitle: task.priority.toUpperCase(),
                    time: format(taskDate, 'HH:mm'),
                    date: taskDate,
                    status: task.completed ? 'completed' : 'pending',
                    originalObj: task
                });
            }
        });

        // Gym Logs
        gymLogs.forEach(log => {
            const logDate = parseISO(log.date);
            if (isSameDay(logDate, date)) {
                items.push({
                    id: log.id,
                    type: 'gym',
                    title: log.planName,
                    subtitle: `${log.duration} phút`,
                    time: format(logDate, 'HH:mm'),
                    date: logDate,
                    status: 'completed'
                });
            }
        });

        // Journal
        entries.forEach(entry => {
            const entryDate = parseISO(entry.date);
            if (isSameDay(entryDate, date)) {
                items.push({
                    id: entry.id,
                    type: 'journal',
                    title: 'Nhật Ký Neural',
                    subtitle: entry.mood,
                    time: format(entryDate, 'HH:mm'),
                    date: entryDate,
                    status: 'completed'
                });
            }
        });

        // Nutrition
        commits.forEach(commit => {
            const commitDate = parseISO(commit.date);
            if (isSameDay(commitDate, date)) {
                items.push({
                    id: commit.id,
                    type: 'nutrition',
                    title: 'Dinh Dưỡng Bio',
                    subtitle: `${commit.calories} Kcal`,
                    time: format(commitDate, 'HH:mm'),
                    date: commitDate,
                    status: 'completed'
                });
            }
        });

        // Standalone Events
        standaloneEvents.forEach(evt => {
            const evtDate = parseISO(evt.startTime);
            if (isSameDay(evtDate, date)) {
                items.push({
                    id: evt.id,
                    type: evt.type as any,
                    title: evt.title,
                    subtitle: evt.description,
                    time: format(evtDate, 'HH:mm'),
                    date: evtDate,
                    status: 'none'
                });
            }
        });

        return items.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    };

    const agendaItems = getItemsForDate(selectedDate);

    // --- DRAG HANDLERS ---
    const handleDragStart = (event: any) => {
        setDraggedItem(event.active.data.current);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggedItem(null);

        if (over && active.data.current) {
            const targetDate = new Date(over.id as string);
            const item = active.data.current as AgendaItem;

            if (item.type === 'task') {
                const oldDate = item.date;
                const newDate = new Date(targetDate);
                newDate.setHours(oldDate.getHours(), oldDate.getMinutes());
                updateTaskDate(item.id, newDate.toISOString());
            }
        }
    };

    // --- RENDER GRID (for mobile) ---
    const renderMobileCalendarGrid = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const itemsCount = getItemsForDate(cloneDay).length;
                const isSelected = isSameDay(cloneDay, selectedDate);
                const isTodayDate = isToday(cloneDay);
                const isCurrentMonth = isSameMonth(cloneDay, monthStart);

                days.push(
                    <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(cloneDay)}
                        className={`
                            relative aspect-square flex flex-col items-center justify-center rounded-[14px] transition-all duration-300
                            ${!isCurrentMonth ? "opacity-20 translate-y-1" : "opacity-100"}
                            ${isSelected ? "z-10 scale-110 shadow-[0_10px_20px_rgba(0,0,0,0.4)]" : "active:scale-90"}
                        `}
                        style={{
                            background: isSelected ? 'var(--sa-primary)' : isTodayDate ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                            border: isTodayDate && !isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                    >
                        <span className={`text-[13px] font-black tracking-tight ${isSelected ? 'text-white' : isTodayDate ? 'text-blue-400' : 'text-white/60'}`}>
                            {format(cloneDay, 'd')}
                        </span>
                        {itemsCount > 0 && !isSelected && (
                            <div className="absolute bottom-1.5 flex gap-[2px]">
                                {Array.from({ length: Math.min(itemsCount, 3) }).map((_, i) => (
                                    <div key={i} className={`w-[3px] h-[3px] rounded-full ${isTodayDate ? 'bg-blue-400' : 'bg-primary'}`} />
                                ))}
                            </div>
                        )}
                    </button>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-1">{rows}</div>;
    };

    // ========== MOBILE VIEW ==========
    if (isMobile) {
        return (
            <div className="ios-animate-in min-h-full pb-32">
                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 pb-8 px-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#0A84FF]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Ma Trận Thời Gian</span>
                    </div>
                    <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                        Lịch Trình
                    </h1>
                </motion.div>

                {/* Calendar Core Mobile */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10">
                    <div className="superapp-card-glass rounded-[45px] p-6 floating-card-shadow glass-reflection relative overflow-hidden">
                        {/* Month Selector */}
                        <div className="flex items-center justify-between mb-8 px-2">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 active:scale-90 transition-all">
                                <CaretLeft size={20} weight="bold" className="text-white/40" />
                            </button>
                            <h2 className="text-[17px] font-black text-white italic uppercase tracking-widest bg-white/5 px-6 py-2 rounded-full border border-white/5">
                                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                            </h2>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 active:scale-90 transition-all">
                                <CaretRight size={20} weight="bold" className="text-white/40" />
                            </button>
                        </div>

                        {/* Day Labels */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest italic">{d}</div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="relative z-10">
                            {renderMobileCalendarGrid()}
                        </div>
                    </div>
                </motion.div>

                {/* Agenda Info Header */}
                <div className="px-1 mb-6 flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Lịch sử Ops</span>
                        <h2 className="text-[24px] font-black text-white italic uppercase tracking-tighter leading-none">
                            {format(selectedDate, 'EEEE, d/M', { locale: vi })}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <span className="text-[18px] font-black text-white leading-none tabular-nums">{agendaItems.length}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Levents</span>
                    </div>
                </div>

                {/* Agenda List Mobile */}
                <div className="space-y-4 px-1">
                    <AnimatePresence mode="wait">
                        {agendaItems.length > 0 ? (
                            <motion.div
                                key={selectedDate.toISOString()}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {agendaItems.map((item) => {
                                    const isCompleted = item.status === 'completed';
                                    return (
                                        <div
                                            key={item.id}
                                            className="superapp-card-glass p-6 rounded-[35px] border border-white/5 group active:scale-[0.98] transition-all flex items-center gap-6"
                                        >
                                            <div className="w-16 shrink-0 flex flex-col items-center justify-center border-r border-white/5">
                                                <span className="text-[16px] font-black text-white tabular-nums italic">{item.time || '--:--'}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5`} style={{ color: item.type === 'task' ? '#0A84FF' : item.type === 'gym' ? '#BF5AF2' : item.type === 'nutrition' ? '#FF9F0A' : '#30D158' }}>{item.type}</span>
                                                    {item.type === 'task' && (isCompleted ? <CheckCircle size={14} weight="fill" color="#30D158" className="neural-text-glow" /> : <Circle size={14} weight="duotone" color="#white" style={{ opacity: 0.2 }} />)}
                                                </div>
                                                <h4 className={`font-black text-white text-[17px] leading-tight uppercase italic tracking-tighter truncate ${isCompleted && item.type === 'task' ? 'line-through opacity-40' : ''}`}>
                                                    {item.title}
                                                </h4>
                                                {item.subtitle && <p className="text-[11px] font-black text-white/20 mt-1 uppercase tracking-widest truncate italic">{item.subtitle}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center neural-island rounded-[45px] border border-dashed border-white/10"
                            >
                                <CalendarIcon size={64} weight="thin" className="text-white/10 mx-auto mb-6" />
                                <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.4em] italic">Trống Lịch Trình</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // --- RENDER GRID (for desktop) ---
    const renderCalendarGrid = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                days.push(
                    <DroppableDay
                        key={day.toString()}
                        date={cloneDay}
                        isSelected={isSameDay(day, selectedDate)}
                        isCurrentMonth={isSameMonth(day, monthStart)}
                        isTodayDate={isToday(day)}
                        hasEvents={getItemsForDate(day).length > 0}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        {format(day, 'd')}
                    </DroppableDay>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="mt-4">{rows}</div>;
    };

    // ========== DESKTOP/TABLET VIEW ==========
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={`h-[calc(100vh-140px)] flex ${isTablet ? 'flex-col lg:flex-row' : 'flex-row'} gap-10 pb-10 relative z-10`} data-device={isTablet ? 'tablet' : 'desktop'}>
                {/* ── BACKGROUND AMBIENCE ── */}
                <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
                <div className="fixed bottom-[-10%] right-[0%] w-[600px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full pointer-events-none -z-10" />

                {/* LEFT COLUMN: NAVIGATOR */}
                <div className={`w-full ${isTablet ? 'lg:w-[320px]' : 'lg:w-[400px]'} shrink-0 flex flex-col gap-8`}>
                    {/* Neural Date Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="neural-island p-10 relative overflow-hidden group rounded-[45px] border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <h4 className="text-[12px] font-black text-blue-400/60 uppercase tracking-[0.5em] italic">Điểm Nút Hiện Tại</h4>
                        </div>
                        <h1 className="text-[100px] font-black text-white tracking-tighter italic leading-none superapp-text-gradient drop-shadow-2xl">
                            {format(new Date(), 'dd')}
                        </h1>
                        <p className="text-[20px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 italic leading-none pl-2">
                            tháng {format(new Date(), 'MM')} / {format(new Date(), 'yyyy')}
                        </p>
                    </motion.div>

                    {/* Mini Calendar Node */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="superapp-card-glass p-8 flex-1 relative overflow-hidden rounded-[45px] border border-white/5 backdrop-blur-3xl glass-reflection">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-[18px] font-black text-white uppercase italic tracking-widest bg-white/5 px-6 py-2 rounded-full border border-white/5">
                                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"><CaretLeft size={20} weight="bold" className="text-white/40" /></button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"><CaretRight size={20} weight="bold" className="text-white/40" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                <div key={d} className="text-center text-[11px] font-black text-white/20 uppercase py-2 tracking-widest italic">{d}</div>
                            ))}
                        </div>
                        {renderCalendarGrid()}
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: TIMELINE */}
                <div className="flex-1 flex flex-col h-full min-h-0">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8 px-2">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic">Nhật Ký Dữ Liệu Thời Gian</span>
                                <div className="h-[2px] w-20 bg-primary/20 rounded-full" />
                            </div>
                            <h2 className="text-[48px] font-black text-white italic uppercase tracking-tighter capitalize leading-none drop-shadow-2xl">
                                {format(selectedDate, 'EEEE, d MMMM', { locale: vi })}
                            </h2>
                        </div>
                        <div className="flex flex-col items-end gap-2 bg-white/5 px-6 py-4 rounded-[30px] border border-white/10 shadow-xl">
                            <span className="text-[32px] font-black text-white leading-none tabular-nums italic text-shadow-sm">{agendaItems.length}</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">Hoạt Động</span>
                        </div>
                    </motion.div>

                    <div className="flex-1 neural-island bg-black/20 border border-white/5 overflow-y-auto pr-4 custom-scrollbar p-10 relative rounded-[50px] shadow-inner shadow-black/60">
                        {/* Grid Pattern Background */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {agendaItems.length > 0 ? (
                            <div className="space-y-4 relative z-10">
                                {agendaItems.map((item) => (
                                    <DraggableAgendaItem key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10">
                                <CalendarIcon size={120} weight="thin" className="mb-8 text-white" />
                                <p className="text-[20px] font-black uppercase tracking-[0.5em] italic">Dữ Liệu Lịch Trình Trống</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DragOverlay dropAnimation={null}>
                {draggedItem ? (
                    <div className="superapp-card-glass p-6 bg-primary/30 backdrop-blur-3xl border border-primary/50 text-white w-80 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-[25px] rotate-3 pointer-events-none">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{draggedItem.type}</div>
                        <span className="text-[18px] font-black italic uppercase tracking-tighter">{draggedItem.title}</span>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
