import { useMemo } from 'react';
import { format, getMonth, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, UserCheck, ChartBar,
    CaretRight,
    ChartLineUp, TrendUp, Lightning,
    Barbell, AppleLogo, BookOpenText, Sparkle,
    CheckSquare
} from '@phosphor-icons/react';
import { useMemberStore } from '../store/useMemberStore';
import { usePTStore } from '../store/usePTStore';
import { useAutomationStore } from '../store/useAutomationStore';
import { useAutomationEngine } from '../components/AutomationEngine';
import { getGreeting, formatVND } from '../utils/gymUtils';
import { useAuth } from '../hooks/useAuth';
import { SignOut } from '@phosphor-icons/react';

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } } as any;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } } as any;

// ─────────────────────────────────────────────────────────────
//  Metric Card — Apple-style glass
// ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color = '#0A84FF' }: {
    label: string; value: string | number; sub?: string; color?: string;
}) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-4 flex flex-col justify-between min-h-[110px] rounded-[24px] relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lightning size={48} weight="fill" color={color} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] mb-2 opacity-50">{label}</p>
            <div>
                <p className="text-[32px] font-black leading-none tabular-nums tracking-tighter" style={{ color: 'white' }}>{value}</p>
                {sub && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-1 h-1 rounded-full" style={{ background: color }} />
                        <p className="text-[11px] font-medium opacity-60 truncate">{sub}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
//  Row link — Settings-style glass
// ─────────────────────────────────────────────────────────────
function RowLink({ to, icon: Icon, label, desc, color }: {
    to: string; icon: any; label: string; desc: string; color: string;
}) {
    return (
        <Link to={to} className="group block mb-2 superapp-tap-scale">
            <div className="superapp-card-glass flex items-center gap-4 p-4 rounded-[20px] transition-all group-active:translate-x-1">
                <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={24} color={color} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-white/90 leading-tight">{label}</p>
                    <p className="text-[11px] font-medium text-white/40 mt-0.5">{desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <CaretRight size={14} weight="bold" className="text-white/20" />
                </div>
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────────────────────
//  Main dashboard
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { members } = useMemberStore();
    const { pts } = usePTStore();
    const { logout } = useAuth();

    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = getMonth(now);
        const todayStr = now.toDateString();

        const checkedIn = members.filter(m => m.lastCheckIn && new Date(m.lastCheckIn).toDateString() === todayStr);
        const expiring = members.filter(m =>
            m.expiryDate &&
            differenceInDays(new Date(m.expiryDate), now) >= 0 &&
            differenceInDays(new Date(m.expiryDate), now) <= 7 &&
            m.status === 'Active'
        );

        const revenue = members.filter(m => m.status === 'Active').length * 690_000;

        return {
            total: members.length,
            active: members.filter(m => m.status === 'Active').length,
            checkedIn: checkedIn.slice(0, 4),
            checkedInCount: checkedIn.length,
            expiring: expiring.length,
            newThisMonth: members.filter(m => getMonth(new Date(m.joinDate)) === currentMonth).length,
            ptTotal: pts?.length ?? 0,
            ptActive: pts?.filter(p => p.status === 'Active').length ?? 0,
            revenue,
            occupancyPct: Math.round((checkedIn.length / Math.max(members.length, 1)) * 100),
        };
    }, [members, pts]);

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="ios-animate-in min-h-full superapp-page pt-4 pb-10"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <p className="text-[12px] font-black uppercase tracking-[0.2em] opacity-40">Hệ thống điều hành</p>
                <div className="flex items-center justify-between mt-1">
                    <h1 className="text-[32px] font-black tracking-tighter text-white">HT ADMIN</h1>
                    <div className="px-3 py-1 rounded-full bg-[#E8613A]/10 border border-[#E8613A]/30">
                        <span className="text-[11px] font-black text-[#E8613A] uppercase tracking-wider">Phiên bản 2.0</span>
                    </div>
                </div>
                <p className="text-[13px] font-medium opacity-40 mt-1">
                    {getGreeting()} · {format(new Date(), "EEEE, d 'tháng' M", { locale: vi })}
                </p>
            </motion.div>

            {/* ── LIVE PANOPTICON ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <div className="superapp-card-glass p-6 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#30D158] opacity-10 blur-[60px] translate-x-12 -translate-y-12" />

                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse shadow-[0_0_8px_#30D158]" />
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#30D158]">Trình trạng Live</p>
                            </div>
                            <p className="text-[64px] font-black leading-none tracking-tighter text-white">
                                {stats.checkedInCount}
                            </p>
                            <p className="text-[14px] font-medium opacity-50 mt-2">
                                hội viên đang tập luyện
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#30D158]/10 border border-[#30D158]/20">
                            <ChartLineUp size={28} weight="fill" color="#30D158" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[11px] font-black uppercase opacity-20 tracking-widest">Hiệu suất phòng</span>
                            <span className="text-[15px] font-black text-[#30D158]">{stats.occupancyPct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.occupancyPct}%` }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                                className="h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #30D158 0%, #34C759 100%)',
                                    boxShadow: '0 0 15px rgba(48,209,88,0.4)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── KEY PERFORMANCE INDICATORS ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <MetricCard label="Tổng Hội Viên" value={stats.total} sub={`${stats.newThisMonth} mới tháng này`} color="#BF5AF2" />
                <MetricCard label="Check-in" value={stats.checkedInCount} sub="Hôm nay" color="#0A84FF" />
                <MetricCard label="Đội ngũ PT" value={stats.ptTotal} sub={`${stats.ptActive} đang trực`} color="#FF9F0A" />
                <MetricCard label="Gia hạn" value={stats.expiring} sub="Cần xử lý ngay" color="#FF453A" />
            </motion.div>

            {/* ── REVENUE ANALYTICS ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <div className="superapp-card-glass p-6 rounded-[28px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E8613A]/5 to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E8613A]">Doanh thu tháng {format(new Date(), 'M')}</p>
                        <ChartBar size={18} weight="fill" className="text-white/20" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[38px] font-black text-white tracking-tighter">{formatVND(stats.revenue)}</span>
                        <span className="text-[14px] font-bold text-white/30 uppercase">VNĐ</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                        <TrendUp size={14} color="#30D158" weight="bold" />
                        <p className="text-[11px] font-bold text-[#30D158] uppercase">Tăng trưởng ổn định</p>
                    </div>
                </div>
            </motion.div>

            {/* ── AUTOMATION ENGINE ── */}
            <AutomationStatus />

            {/* ── OPERATIONAL MODULES ── */}
            <motion.div variants={fadeUp} className="gym-section">
                <p className="gym-section__title">Trung tâm điều hành</p>
                <div className="space-y-1">
                    <RowLink to="/members" icon={Users} label="Quản lý Hội Viên" desc="Phê duyệt, gia hạn, giao PT" color="#0A84FF" />
                    <RowLink to="/pt" icon={UserCheck} label="Đội ngũ PT" desc="Lịch trực & hiệu suất HLV" color="#FF9F0A" />
                    <RowLink to="/work" icon={CheckSquare} label="Nhiệm vụ Task" desc="Điều phối vận hành phòng Gym" color="#BF5AF2" />
                    <RowLink to="/gym" icon={Barbell} label="Cơ sở vật chất" desc="Kiểm soát thiết bị & bảo trì" color="#30D158" />
                </div>
            </motion.div>

            {/* ── ECOSYSTEM ── */}
            <motion.div variants={fadeUp} className="gym-section mt-8">
                <p className="gym-section__title">Hệ sinh thái & Dữ liệu</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { to: '/nutrition', icon: AppleLogo, label: 'Dinh dưỡng', color: '#FF3B30' },
                        { to: '/analytics', icon: ChartBar, label: 'Báo cáo', color: '#0A84FF' },
                        { to: '/ecosystem', icon: Sparkle, label: 'Tiện ích', color: '#FFD60A' },
                    ].map((item) => (
                        <Link key={item.to} to={item.to} className="superapp-card-glass p-4 rounded-[22px] flex flex-col items-center gap-3 transition-transform active:scale-95">
                            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ background: `${item.color}15` }}>
                                <item.icon size={24} color={item.color} weight="fill" />
                            </div>
                            <span className="text-[13px] font-bold text-white/80">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* ── LOGOUT ── */}
            <motion.div variants={fadeUp} className="mt-12 mb-10 px-0">
                <button
                    onClick={logout}
                    className="w-full py-4 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
                >
                    <SignOut size={20} weight="bold" className="text-[#FF453A] group-active:translate-x-1 transition-transform" />
                    <span className="text-[15px] font-black text-[#FF453A] uppercase tracking-wider">Đăng xuất hệ thống</span>
                </button>
                <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-6">
                    Mibro Fit Ecosystem · Thor Admin v2.0
                </p>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
//  Automation Monitor Summary
// ─────────────────────────────────────────────────────────────
function AutomationStatus() {
    const { isEngineRunning, logs } = useAutomationStore();
    const { enabledPlansCount, totalTriggersToday } = useAutomationEngine();

    return (
        <motion.div variants={fadeUp} className="mb-6">
            <div className="superapp-card-glass p-6 rounded-[32px] border-[#0A84FF]/20">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${isEngineRunning ? 'bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20' : 'bg-white/5 text-white/20'}`}>
                            <Lightning size={24} weight="fill" className={isEngineRunning ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <p className="text-[15px] font-black text-white leading-tight">Automation Core</p>
                            <p className="text-[11px] font-black uppercase tracking-widest text-[#0A84FF]">
                                {isEngineRunning ? 'Hệ thống Trực tuyến' : 'Ngoại tuyến'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Trigger Ngày</p>
                        <p className="text-[20px] font-black text-white tabular-nums mt-1">{totalTriggersToday}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Kịch bản chạy</p>
                        <p className="text-[20px] font-black text-white tabular-nums mt-1">{enabledPlansCount}</p>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-3 rounded-2xl bg-[#0A84FF] text-white text-[13px] font-black uppercase tracking-wider active:scale-95 transition-transform shadow-[0_8px_20px_rgba(10,132,255,0.3)]">
                        Quét hệ thống
                    </button>
                    <Link to="/automation" className="px-6 py-3 rounded-2xl bg-white/5 text-white/40 text-[13px] font-black uppercase active:scale-95 transition-transform">
                        Chi tiết
                    </Link>
                </div>

                {logs.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] animate-ping" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Tín hiệu mới nhất</p>
                        </div>
                        <p className="text-[12px] font-medium text-white/80 leading-snug line-clamp-2">
                            {logs[0].planName}: {logs[0].message}
                        </p>
                        <p className="text-[9px] font-bold text-[#0A84FF] mt-1 tabular-nums">
                            TÍN HIỆU: {format(new Date(logs[0].timestamp), 'HH:mm:ss')}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
