import { useGymStore } from '../store/useGymStore';
import { motion } from 'framer-motion';
import {
    Dumbbell, Calendar, ChevronRight,
    Zap, Clock, Plus,
    Flame, Target
} from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

const PLAN_TYPES = [
    { id: 'Rest', label: 'Nghỉ', color: '#636366' },
    { id: 'Push', label: 'Đẩy', color: '#0A84FF' },
    { id: 'Pull', label: 'Kéo', color: '#FF6B35' },
    { id: 'Legs', label: 'Chân', color: '#30D158' },
    { id: 'Upper', label: 'Trên', color: '#BF5AF2' },
    { id: 'Lower', label: 'Dưới', color: '#FF375F' },
    { id: 'Cardio', label: 'Cardio', color: '#FF453A' },
    { id: 'FullBody', label: 'Full', color: '#FFD60A' },
];

export default function GymPage() {
    const { weeklyPlan, updateWeeklyPlan, logs, userProfile } = useGymStore();

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array(7).fill(null).map((_, i) => addDays(weekStart, i));

    const getPlanForDay = (dayIndex: number) => {
        const planId = weeklyPlan[dayIndex] || 'Rest';
        return PLAN_TYPES.find(p => p.id === planId) || PLAN_TYPES[0];
    };

    const handlePlanChange = (dayIndex: number) => {
        const currentPlanId = weeklyPlan[dayIndex] || 'Rest';
        const currentIndex = PLAN_TYPES.findIndex(p => p.id === currentPlanId);
        const nextIndex = (currentIndex + 1) % PLAN_TYPES.length;
        updateWeeklyPlan(dayIndex, PLAN_TYPES[nextIndex].id);
    };

    const autoFillPlan = () => {
        const pattern = ['Push', 'Pull', 'Rest', 'Legs', 'Upper', 'Lower', 'Rest'];
        pattern.forEach((p, i) => updateWeeklyPlan(i, p));
        toast.success("Đã áp dụng lịch mẫu: PPL Split!");
    };

    const totalVolume = logs.reduce((acc, l) => acc + (l.weight * l.reps), 0);
    const totalSessions = logs.length;
    const bestE1RM = logs.length > 0 ? Math.max(...logs.map(l => l.e1RM)) : 0;

    return (
        <div style={{ padding: '0 0 40px' }}>

            {/* ===== STATS ROW ===== */}
            <div style={{
                display: 'flex', gap: 10,
                margin: '12px 16px 14px', overflow: 'hidden'
            }}>
                {[
                    { icon: <Flame size={16} />, val: totalSessions.toString(), sub: 'Buổi tập', bg: '#FF453A' },
                    { icon: <Dumbbell size={16} />, val: totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : `${totalVolume}`, sub: 'Tổng tải (kg)', bg: '#0A84FF' },
                    { icon: <Target size={16} />, val: bestE1RM > 0 ? `${Math.round(bestE1RM)}` : '—', sub: 'Best 1RM', bg: '#30D158' },
                ].map((s, i) => (
                    <div key={i} style={{
                        flex: 1, background: '#1C1C1F', borderRadius: 12,
                        padding: '14px 10px', textAlign: 'center'
                    }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 8, margin: '0 auto 8px',
                            background: `${s.bg}22`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: s.bg
                        }}>{s.icon}</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.val}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: '#AEAEB2', marginTop: 4 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* ===== TRAINING LEVEL ===== */}
            <div style={{
                margin: '0 16px 14px', padding: '13px 16px',
                background: '#1C1C1F', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 12
            }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: 'rgba(10,132,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0A84FF'
                }}>
                    <Dumbbell size={17} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Trình độ tập luyện</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#AEAEB2', marginTop: 1 }}>
                        {userProfile.trainingClass}
                    </div>
                </div>
                <ChevronRight size={18} style={{ color: '#636366' }} />
            </div>

            {/* ===== WEEKLY PLANNER ===== */}
            <div style={{ margin: '0 16px 14px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 10, gap: 8
                }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                        Lịch tuần
                    </span>
                    <button onClick={autoFillPlan} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '5px 12px', borderRadius: 20,
                        background: 'rgba(255,107,53,0.15)',
                        color: '#FF6B35', fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer'
                    }}>
                        <Zap size={13} /> Tự động
                    </button>
                </div>

                {/* 7 day cards — horizontal scroll */}
                <div style={{
                    display: 'flex', gap: 6,
                    overflowX: 'auto', paddingBottom: 2,
                    msOverflowStyle: 'none', scrollbarWidth: 'none'
                }}>
                    {weekDays.map((date, i) => {
                        const isToday = isSameDay(date, new Date());
                        const plan = getPlanForDay(i);
                        const dayName = format(date, 'EEE', { locale: vi });

                        return (
                            <motion.div
                                key={i}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => handlePlanChange(i)}
                                style={{
                                    minWidth: 56, flex: '0 0 auto',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 4,
                                    padding: '10px 4px 10px',
                                    borderRadius: 14,
                                    background: isToday ? '#FF6B35' : '#1C1C1F',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <span style={{
                                    fontSize: 11, fontWeight: 500,
                                    color: isToday ? 'rgba(255,255,255,0.8)' : '#AEAEB2',
                                    textTransform: 'capitalize'
                                }}>
                                    {dayName}
                                </span>
                                <span style={{
                                    fontSize: 18, fontWeight: 700,
                                    color: isToday ? '#fff' : '#fff'
                                }}>
                                    {format(date, 'd')}
                                </span>
                                <span style={{
                                    fontSize: 10, fontWeight: 600,
                                    color: isToday ? 'rgba(255,255,255,0.9)' : plan.color,
                                    padding: '2px 6px', borderRadius: 6,
                                    background: isToday ? 'rgba(255,255,255,0.15)' : `${plan.color}20`
                                }}>
                                    {plan.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ===== VOLUME CARD ===== */}
            <div style={{
                margin: '0 16px 14px', padding: '16px',
                background: 'linear-gradient(135deg, #1C3F5E, #1C1C3E)',
                borderRadius: 14, display: 'flex',
                alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div>
                    <div style={{
                        fontSize: 12, fontWeight: 600, color: '#64D2FF',
                        marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5
                    }}>
                        <Dumbbell size={14} /> Tổng khối lượng
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                        {totalVolume > 1000
                            ? <>{(totalVolume / 1000).toFixed(1)}<span style={{ fontSize: 18, fontWeight: 600 }}>k</span> <span style={{ fontSize: 16, fontWeight: 500, color: '#AEAEB2' }}>kg</span></>
                            : <>{totalVolume} <span style={{ fontSize: 16, fontWeight: 500, color: '#AEAEB2' }}>kg</span></>
                        }
                    </div>
                </div>
                <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(100, 210, 255, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Dumbbell size={24} style={{ color: '#64D2FF' }} />
                </div>
            </div>

            {/* ===== LOG BUTTON ===== */}
            <div style={{ margin: '0 16px 14px' }}>
                <button style={{
                    width: '100%', padding: '15px',
                    background: '#FF6B35', color: '#fff',
                    borderRadius: 12, border: 'none',
                    fontSize: 17, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
                }}>
                    <Plus size={20} strokeWidth={2.5} /> Ghi bài tập mới
                </button>
            </div>

            {/* ===== WORKOUT LOGS ===== */}
            <div style={{ margin: '0 16px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 8
                }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                        Nhật ký gần đây
                    </span>
                    <span style={{ fontSize: 15, color: '#FF6B35', cursor: 'pointer' }}>
                        Xem tất cả
                    </span>
                </div>

                <div style={{ background: '#1C1C1F', borderRadius: 12, overflow: 'hidden' }}>
                    {logs.length === 0 ? (
                        <div style={{
                            padding: '36px 16px', textAlign: 'center'
                        }}>
                            <Dumbbell size={36} style={{ color: '#3A3A3C', marginBottom: 10 }} />
                            <p style={{ fontSize: 15, color: '#AEAEB2', margin: 0 }}>Chưa có dữ liệu bài tập</p>
                            <p style={{ fontSize: 13, color: '#636366', margin: '4px 0 0' }}>
                                Bấm nút ở trên để bắt đầu ghi
                            </p>
                        </div>
                    ) : (
                        logs.slice().reverse().slice(0, 5).map((log, idx) => (
                            <div key={log.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '11px 16px',
                                borderBottom: idx < Math.min(logs.length, 5) - 1
                                    ? '0.5px solid #2C2C2E' : 'none'
                            }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: '#2C2C2E',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#AEAEB2', flexShrink: 0,
                                    fontSize: 15, fontWeight: 700
                                }}>
                                    {log.exerciseName.charAt(0)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 15, fontWeight: 600, color: '#fff',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>
                                        {log.exerciseName}
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        marginTop: 2, fontSize: 12, color: '#8E8E93'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Calendar size={10} /> {log.date}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Clock size={10} /> {log.reps} reps
                                        </span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>
                                        {log.weight}<span style={{ fontSize: 12, color: '#8E8E93', marginLeft: 1 }}>kg</span>
                                    </div>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#30D158', marginTop: 1 }}>
                                        1RM: {Math.round(log.e1RM)}kg
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
