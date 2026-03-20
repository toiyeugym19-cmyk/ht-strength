import { useMemo } from 'react';
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendUp, ChartLineUp, Medal, Crown, Fire, CalendarCheck, Info, CaretRight, Trophy } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { ...spring, duration: 0.4 }
    }
};
const stagger: Variants = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

export default function MemberStatsPage() {
    const { user } = useAuth();
    const { members } = useMemberStore();

    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const { streak, monthlyTotal, yearMap } = useMemo(() => {
        if (!member) return { streak: 0, monthlyTotal: 0, yearMap: [] };

        const history = member.checkInHistory || [];

        // Streak calculation
        let streakCount = 0;
        let d = new Date();
        while (history.some(h => isSameDay(new Date(h.date), d))) {
            streakCount++;
            d = subDays(d, 1);
        }

        const now = new Date();

        // Yearly Heatmap (Last 12 weeks for mobile view)
        const heatmapStart = startOfWeek(subDays(now, 84), { weekStartsOn: 1 });
        const heatmapDays = eachDayOfInterval({ start: heatmapStart, end: endOfWeek(now, { weekStartsOn: 1 }) });

        return {
            streak: streakCount,
            monthlyTotal: history.filter(h => new Date(h.date) >= subDays(now, 30)).length,
            yearMap: heatmapDays
        };
    }, [member]);

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="ios-animate-in min-h-screen pb-32"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#FF9F0A]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Neural Ranks</span>
                </div>
                <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                    Bảng Xếp Hạng
                </h1>
                <p className="text-[13px] font-bold opacity-30 mt-2">Dữ liệu hiệu suất được đồng bộ hóa</p>
            </motion.div>

            {/* ── HIGH PERFORMANCE METRICS ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 mb-10">
                <div className="neural-island p-6 rounded-[35px] relative overflow-hidden group border border-white/5">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FF453A]/10 blur-3xl rounded-full" />
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-[#FF453A]/20 flex items-center justify-center border border-[#FF453A]/20">
                            <Fire size={22} weight="fill" color="#FF3B30" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic mb-1">Chuỗi ngày</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[36px] font-black tabular-nums tracking-tighter leading-none">{streak}</span>
                                <span className="text-[12px] font-black text-[#FF3B30] uppercase italic">🔥 On Fire</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="neural-island p-6 rounded-[35px] relative overflow-hidden group border border-white/5">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#0A84FF]/10 blur-3xl rounded-full" />
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-[#0A84FF]/20 flex items-center justify-center border border-[#0A84FF]/20">
                            <CalendarCheck size={22} weight="fill" color="#0A84FF" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic mb-1">Tháng này</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[36px] font-black tabular-nums tracking-tighter leading-none">{monthlyTotal}</span>
                                <span className="text-[12px] font-black text-[#0A84FF] uppercase italic">Sessions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── ACTIVITY HEATMAP ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Lịch sử 12 tuần</span>
                    <Info size={16} className="text-white/20" />
                </div>
                <div className="superapp-card-glass p-8 rounded-[45px] floating-card-shadow glass-reflection">
                    <div className="grid grid-cols-12 gap-[5px]">
                        {yearMap.map((day: any, i: number) => {
                            const hasCheckIn = member?.checkInHistory?.some(h => isSameDay(new Date(h.date), day));
                            return (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-[4px] transition-all duration-700`}
                                    style={{
                                        background: hasCheckIn ? '#30D158' : 'rgba(255,255,255,0.03)',
                                        opacity: hasCheckIn ? 1 : 0.3,
                                        boxShadow: hasCheckIn ? '0 0 10px rgba(48,209,88,0.5)' : 'none',
                                        scale: hasCheckIn ? 1 : 0.95
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-[3px] bg-white/5 border border-white/5" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Nghỉ</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#30D158] shadow-[0_0_8px_#30D158]" />
                                <span className="text-[10px] font-black text-[#30D158] uppercase tracking-widest italic">Tập</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy size={14} weight="fill" className="text-white/20" />
                            <p className="text-[11px] font-black text-white/40 italic uppercase tracking-widest">{member?.checkInHistory?.length} BUỔI TỔNG</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── ACHIEVEMENTS SHELF ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Khu trưng bày</span>
                    <Link to="/achievements" className="text-[10px] font-black text-[#0A84FF] uppercase tracking-widest italic flex items-center gap-1 group">
                        Xem tất cả <CaretRight size={10} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="flex gap-5 overflow-x-auto no-scrollbar py-4 px-1 -mx-1">
                    {[
                        { icon: Medal, label: 'Kỷ luật', color: '#FFD700', desc: '7 ngày tập liên tục', sub: 'ELITE HUNTER' },
                        { icon: Crown, label: 'Lực sĩ', color: '#BF5AF2', desc: 'Đạt mốc 100 buổi', sub: 'IRON GOLEM' },
                        { icon: Fire, label: 'Nhiệt huyết', color: '#FF453A', desc: '1,000 kcal/buổi', sub: 'KINETIC SOUL' },
                        { icon: Medal, label: 'Đồng hành', color: '#0A84FF', desc: '1 năm gắn kết', sub: 'ORIGIN NODE' },
                    ].map((a, i) => (
                        <div key={i} className="min-w-[140px] flex flex-col items-center gap-4 group">
                            <div className="w-24 h-24 rounded-[35px] superapp-card-glass flex items-center justify-center relative shadow-2xl overflow-hidden border border-white/5 active:scale-95 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                                <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: a.color }} />
                                <a.icon size={42} color={a.color} weight="duotone" className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">{a.sub}</p>
                                <p className="text-[15px] font-black text-white italic tracking-tighter uppercase">{a.label}</p>
                                <p className="text-[10px] font-bold text-white/30 mt-1">{a.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── PERFORMANCE TREND ── */}
            <motion.div variants={fadeUp} className="mb-14">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Xu hướng</span>
                    <ChartLineUp size={20} className="text-[#0A84FF]" />
                </div>
                <div className="superapp-card-glass p-8 rounded-[45px] overflow-hidden relative floating-card-shadow border border-white/5">
                    <div className="flex items-end justify-between h-32 gap-2">
                        {[40, 60, 45, 90, 65, 80, 50, 70, 85, 60, 75, 95].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + (i * 0.05), type: 'spring' }}
                                className="flex-1 bg-gradient-to-t from-[#0A84FF] to-[#64D2FF] rounded-full opacity-40 hover:opacity-100 transition-opacity"
                            />
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Tháng 1</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">Hôm nay</p>
                    </div>
                    <div className="mt-8 p-6 neural-island rounded-[30px] flex items-center justify-between border border-white/5">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic mb-1.5">Tăng trưởng tháng</p>
                            <h4 className="text-[20px] font-black text-white tracking-tighter italic uppercase">+12.5% NEURAL POWER</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#30D158]/20 flex items-center justify-center shadow-[0_4px_15px_rgba(48,209,88,0.3)] border border-[#30D158]/20">
                            <TrendUp size={24} color="#30D158" weight="bold" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
