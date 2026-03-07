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
            case 'task': return isCompleted ? <CheckCircle size={18} weight="fill" className="text-[#30D158]" /> : <Circle size={18} weight="duotone" className="text-white/40" />;
            case 'gym': return <Dumbbell size={18} weight="duotone" className="text-[#BF5AF2]" />;
            case 'nutrition': return <Zap size={18} weight="duotone" className="text-[#FF9F0A]" />;
            case 'journal': return <Book size={18} weight="duotone" className="text-[#0A84FF]" />;
            case 'appointment': return <Clock size={18} weight="duotone" className="text-[#FF375F]" />;
            case 'focus': return <Zap size={18} weight="duotone" className="text-[#FFD60A]" />;
            case 'social': return <Circle size={18} weight="duotone" className="text-[#64D2FF]" />;
            default: return <Clock size={18} weight="duotone" className="text-white/40" />;
        }
    };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`${isDragging ? 'opacity-50' : 'opacity-100'} mb-4 relative`}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-6 group"
            >
                {/* Time Column */}
                <div className="w-14 shrink-0 flex flex-col items-end pt-1">
                    <span className="text-sm font-black text-white/80">{item.time || "--:--"}</span>
                </div>

                {/* Dot Indicator */}
                <div className="relative pt-2">
                    <div className={`w-3 h-3 rounded-full border-2 border-[#030014] z-10 relative ${isCompleted ? 'bg-current text-green-500' : 'bg-current text-white/50'}`} />
                    {/* Vertical Line Connector */}
                    <div className="absolute top-5 left-1.5 w-px h-[calc(100%+16px)] bg-white/5 -z-0" />
                </div>

                {/* Content Card */}
                <div className={`flex-1 p-4 rounded-[16px] backdrop-blur-md transition-all duration-300
                    ${item.type === 'task' ? 'border-l-4 border-l-[#0A84FF] bg-[#0A84FF]/10' : ''}
                    ${item.type === 'gym' ? 'border-l-4 border-l-[#BF5AF2] bg-[#BF5AF2]/10' : ''}
                    ${item.type === 'nutrition' ? 'border-l-4 border-l-[#FF9F0A] bg-[#FF9F0A]/10' : ''}
                    ${item.type === 'journal' ? 'border-l-4 border-l-[#30D158] bg-[#30D158]/10' : ''}
                `} style={{ boxShadow: 'var(--sa-shadow-card)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1 opacity-80 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ios-tertiary)' }}>
                                {getIcon()}
                                <span>{item.type}</span>
                            </div>
                            <h4 className={`text-[16px] font-semibold leading-tight text-white ${isCompleted && item.type === 'task' ? 'line-through opacity-50' : ''}`}>
                                {item.title}
                            </h4>
                            {item.subtitle && <p className="text-[13px] opacity-70 mt-1" style={{ color: 'var(--ios-secondary)' }}>{item.subtitle}</p>}
                        </div>
                        {isDraggable && (
                            <div className="text-white/20 group-hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing">
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
                relative h-[44px] w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-[12px]
                ${!isCurrentMonth ? "text-white/20 opacity-50" : "text-white hover:bg-white/5"}
                ${isSelected ? "text-white shadow-lg scale-105 z-10 font-bold" : ""}
                ${isTodayDate && !isSelected ? "text-[var(--sa-primary)] font-bold" : ""}
                ${isOver ? "scale-110 ring-2 z-20" : ""}
            `}
            style={{
                background: isSelected ? 'var(--sa-primary)' : 'transparent',
                boxShadow: isSelected ? 'var(--sa-shadow-glow)' : 'none',
                borderColor: isOver ? 'var(--sa-primary)' : 'transparent',
            }}
            onClick={onClick}
        >
            <span className="text-sm">{children}</span>
            {hasEvents && !isSelected && (
                <div className="flex gap-0.5 mt-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
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
                    title: 'Nhật Ký',
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
                    title: 'Dinh Dưỡng',
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
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

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
                            relative aspect-square flex flex-col items-center justify-center rounded-[12px] transition-all duration-200
                            ${!isCurrentMonth ? "text-white/20" : "text-white"}
                            ${isSelected ? "text-white shadow-lg scale-105 z-10 font-bold" : "hover:bg-white/5"}
                            ${isTodayDate && !isSelected ? "text-[var(--sa-primary)] font-bold" : ""}
                        `}
                        style={{
                            background: isSelected ? 'var(--sa-primary)' : 'transparent',
                            boxShadow: isSelected ? 'var(--sa-shadow-glow)' : 'none',
                        }}
                    >
                        <span className="text-[14px] font-medium">{format(cloneDay, 'd')}</span>
                        {itemsCount > 0 && !isSelected && (
                            <div className="flex gap-[3px] mt-1">
                                {Array.from({ length: Math.min(itemsCount, 3) }).map((_, i) => (
                                    <div key={i} className="w-[4px] h-[4px] rounded-full" style={{ background: 'var(--sa-primary)' }} />
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
            <div className="ios-animate-in min-h-full superapp-page pb-24">
                {/* Calendar Card Mobile */}
                <div className="px-4 mb-5 gym-section pt-4">
                    <div className="gym-card p-5">
                        {/* Month Navigator */}
                        <div className="flex items-center justify-between mb-5">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-[var(--ios-fill-tertiary)] rounded-[10px] text-[var(--ios-text-secondary)] active:scale-95 transition-transform">
                                <CaretLeft size={20} weight="bold" />
                            </button>
                            <h2 className="text-[16px] font-semibold text-white tracking-wide">
                                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                            </h2>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-[var(--ios-fill-tertiary)] rounded-[10px] text-[var(--ios-text-secondary)] active:scale-95 transition-transform">
                                <CaretRight size={20} weight="bold" />
                            </button>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 gap-1 mb-3">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                <div key={d} className="text-center text-[12px] font-medium text-[var(--ios-tertiary)]">{d}</div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        {renderMobileCalendarGrid()}
                    </div>
                </div>

                {/* Agenda Info */}
                <div className="px-4 mb-4 flex justify-between items-end">
                    <div>
                        <p className="text-[12px] font-medium uppercase mb-1" style={{ color: 'var(--sa-primary)' }}>Lịch Trình</p>
                        <h2 className="text-[20px] font-bold text-white capitalize leading-none">
                            {format(selectedDate, 'EEEE, d/M', { locale: vi })}
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[20px] font-bold text-white leading-none block">{agendaItems.length}</span>
                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--ios-tertiary)' }}>SỰ KIỆN</span>
                    </div>
                </div>

                {/* Agenda List */}
                <div className="px-4 space-y-3 pb-6">
                    <AnimatePresence mode="wait">
                        {agendaItems.length > 0 ? (
                            <motion.div
                                key={selectedDate.toISOString()}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                {agendaItems.map((item) => {
                                    const isCompleted = item.status === 'completed';
                                    return (
                                        <div
                                            key={item.id}
                                            className="gym-card p-4 flex items-center gap-4 relative group"
                                        >
                                            <div className="w-12 shrink-0 text-center flex flex-col items-center">
                                                <span className="text-[14px] font-bold text-white tracking-wide">{item.time || '--:--'}</span>
                                                <div className={`w-1.5 h-1.5 rounded-full mt-2`} style={{ background: item.type === 'task' ? '#0A84FF' : item.type === 'gym' ? '#BF5AF2' : item.type === 'nutrition' ? '#FF9F0A' : '#30D158' }} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ios-tertiary)' }}>{item.type}</span>
                                                    {item.type === 'task' && (isCompleted ? <CheckCircle size={14} weight="fill" color="#30D158" /> : <Circle size={14} weight="duotone" color="#0A84FF" />)}
                                                </div>
                                                <h4 className={`font-semibold text-white text-[16px] leading-tight ${isCompleted && item.type === 'task' ? 'line-through opacity-50' : ''}`}>
                                                    {item.title}
                                                </h4>
                                                {item.subtitle && <p className="text-[12px] font-medium mt-1" style={{ color: 'var(--ios-secondary)' }}>{item.subtitle}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center opacity-40 flex flex-col items-center"
                            >
                                <div className="w-16 h-16 rounded-[20px] bg-[var(--ios-fill-tertiary)] flex items-center justify-center mb-4">
                                    <CalendarIcon size={32} weight="duotone" color="var(--ios-tertiary)" />
                                </div>
                                <p className="text-[15px] font-medium" style={{ color: 'var(--ios-text-secondary)' }}>Không có lịch trình</p>
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
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

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
            <div className={`h-[calc(100vh-100px)] flex ${isTablet ? 'flex-col lg:flex-row' : 'flex-row'} gap-8 pb-10 relative z-10`} data-device={isTablet ? 'tablet' : 'desktop'}>
                {/* Background Effects */}
                <div className="fixed top-20 left-20 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

                {/* LEFT COLUMN: NAVIGATOR */}
                <div className={`w-full ${isTablet ? 'lg:w-[320px]' : 'lg:w-[380px]'} shrink-0 flex flex-col gap-6`}>
                    {/* Date Card */}
                    <div className="glass-panel p-8 bg-black/40 border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">Hôm nay</h4>
                        <h1 className="text-6xl font-[900] text-white tracking-tighter italic leading-none">
                            {format(new Date(), 'dd')}
                            <span className="text-2xl text-white/40 not-italic ml-2 font-thin">
                                / {format(new Date(), 'MM')}
                            </span>
                        </h1>
                    </div>

                    {/* Mini Calendar */}
                    <div className="glass-panel p-6 bg-black/20 border-white/5 flex-1 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-white uppercase italic tracking-wider capitalize">
                                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                            </h2>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors"><CaretLeft size={18} /></button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors"><CaretRight size={18} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-white/30 py-2">{d}</div>
                            ))}
                        </div>
                        {renderCalendarGrid()}
                    </div>
                </div>

                {/* RIGHT COLUMN: TIMELINE */}
                <div className="flex-1 flex flex-col h-full min-h-0">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 pl-1">Lịch Trình Chi Tiết</h3>
                            <h2 className="text-4xl font-[900] text-white italic uppercase tracking-tighter capitalize drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                {format(selectedDate, 'EEEE, d MMMM', { locale: vi })}
                            </h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-black text-white leading-none">{agendaItems.length}</span>
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Sự kiện</span>
                        </div>
                    </div>

                    <div className="flex-1 glass-panel bg-white/[0.015] border-white/5 overflow-y-auto pr-2 custom-scrollbar p-6 relative">
                        {agendaItems.length > 0 ? (
                            <div className="space-y-2 relative z-10">
                                {agendaItems.map((item) => (
                                    <DraggableAgendaItem key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <CalendarIcon size={64} className="mb-4 text-white/20" />
                                <p className="text-lg font-bold uppercase tracking-widest">Trống Lịch</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {draggedItem ? (
                    <div className="glass-panel p-4 bg-primary/20 backdrop-blur-xl border border-primary text-white w-64 shadow-2xl rotate-3">
                        <span className="font-bold">{draggedItem.title}</span>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
