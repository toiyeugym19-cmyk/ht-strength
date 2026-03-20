import { useMemo } from 'react';
import { format, getMonth, differenceInDays } from 'date-fns';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, UserCheck, ChartBar,
    CaretRight,
    Lightning,
    Sparkle,
    CheckSquare, SignOut,
    GearSix, Bell
} from '@phosphor-icons/react';
import { useMemberStore } from '../store/useMemberStore';
import { usePTStore } from '../store/usePTStore';
import { useAutomationStore } from '../store/useAutomationStore';
import { useAutomationEngine } from '../components/AutomationEngine';
import { formatVND } from '../utils/gymUtils';
import { useAuth } from '../hooks/useAuth';

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } }
};

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
            variants={container}
            initial="hidden"
            animate="show"
            className="tony-style"
            style={{ padding: '0 0 40px', minHeight: '100vh', position: 'relative' }}
        >
            <div className="tony-plasma-bg" />
            <div className="tony-particles" />
            <div className="tony-vignette" />

            {/* ═══════════ CINEMATIC HEADER ═══════════ */}
            <motion.div variants={item} style={{
                padding: '16px 0 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div>
                    <span className="tony-amber-gradient" style={{ fontSize: 11, fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>
                        TRẠNG THÁI VẬN HÀNH
                    </span>
                    <h1 className="tony-title" style={{ marginTop: 2, fontSize: 28 }}>
                        TRUNG TÂM <span className="tony-text-gradient">QUẢN TRỊ</span>
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="ios-nav-action" style={{ background: 'var(--tony-surface)', border: '1px solid var(--tony-border)' }}>
                        <Bell size={22} weight="fill" />
                    </button>
                    <button className="ios-nav-action" style={{ background: 'var(--tony-surface)', border: '1px solid var(--tony-border)' }}>
                        <GearSix size={22} weight="fill" />
                    </button>
                </div>
            </motion.div>

            {/* ═══════════ PANOPTICON LIVE PANEL ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 8 }} className="tony-card-glow-red">
                <div className="tony-card" style={{ padding: '36px', background: 'var(--tony-bg-alt)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div className="tony-pulse-red" style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--tony-neon-green)', boxShadow: '0 0 10px var(--tony-neon-green)' }} />
                        <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--tony-neon-green)', textTransform: 'uppercase', letterSpacing: 2.5 }}>TRẠNG THÁI TRỰC TIẾP</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                        <span style={{ fontSize: 96, fontWeight: 950, color: '#fff', lineHeight: 1, letterSpacing: '-6px' }}>{stats.checkedInCount}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="tony-text-gradient" style={{ fontSize: 20, fontWeight: 950, textTransform: 'uppercase', letterSpacing: 2 }}>HỘI VIÊN</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tony-text-3)', textTransform: 'uppercase' }}>ĐANG TRỰC TUYẾN</span>
                        </div>
                    </div>

                    <div style={{ marginTop: 36 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--tony-text-3)', textTransform: 'uppercase', letterSpacing: 1.5 }}>CÔNG SUẤT VẬN HÀNH</span>
                            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--tony-neon-green)' }}>{stats.occupancyPct}%</span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.occupancyPct}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'var(--tony-gradient-red)', boxShadow: '0 0 20px var(--tony-red)' }} 
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ═══════════ KEY METRICS GRID ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <AdminMetricCard label="TỔNG HỘI VIÊN" value={stats.total} unit="NGƯỜI" color="var(--tony-blue)" trend={`+${stats.newThisMonth} mới`} icon={Users} />
                    <AdminMetricCard label="ĐỘI NGŨ PT" value={stats.ptTotal} unit="HLV" color="var(--tony-amber)" trend={`${stats.ptActive} đang trực`} icon={UserCheck} />
                </div>
            </motion.div>

            {/* ═══════════ REVENUE IMMERSIVE ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 24 }}>
                <div className="tony-card-immersive" style={{ height: 180 }}>
                    <img 
                        src="https://images.unsplash.com/photo-1593005517304-1933580a8b98?auto=format&fit=crop&q=80&w=800"
                        className="tony-card-immersive-img"
                        alt="Revenue Background"
                    />
                    <div className="tony-card-immersive-overlay" style={{ background: 'linear-gradient(45deg, rgba(9, 9, 11, 0.98), transparent)' }} />
                    <div className="tony-card-immersive-content" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Sparkle size={20} weight="fill" color="var(--tony-amber)" />
                            <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--tony-amber)', textTransform: 'uppercase', letterSpacing: 2 }}>DOANH THU THÁNG {format(new Date(), 'M')}</span>
                        </div>
                        <h2 style={{ fontSize: 42, fontWeight: 950, color: '#fff', margin: 0, letterSpacing: '-1.5px' }}>
                            {formatVND(stats.revenue)}
                        </h2>
                        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                             <div className="tony-pulse-red" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tony-neon-green)' }} />
                             <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--tony-text-2)', textTransform: 'uppercase', letterSpacing: 1 }}>HỆ THỐNG ỔN ĐỊNH</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ═══════════ AUTOMATION CORE ═══════════ */}
            <AdminAutomationWidget />

            {/* ═══════════ OPERATION MODULES ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 36 }}>
                <h3 className="tony-title" style={{ fontSize: 18, marginBottom: 20 }}>MÔ-ĐUN VẬN HÀNH</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <AdminOperationRow to="/members" icon={Users} label="QUẢN LÝ HỘI VIÊN" desc="Phê duyệt, gia hạn, hồ sơ chi tiết" color="var(--tony-blue)" />
                    <AdminOperationRow to="/pt" icon={UserCheck} label="ĐỘI NGŨ PT" desc="Theo dõi lịch trực & hiệu quả HLV" color="var(--tony-amber)" />
                    <AdminOperationRow to="/work" icon={CheckSquare} label="BẢNG NHIỆM VỤ" desc="Điều phối vận hành trung tâm" color="var(--tony-purple)" />
                    <AdminOperationRow to="/analytics" icon={ChartBar} label="BÁO CÁO PHÂN TÍCH" desc="Phân tích dữ liệu & xu hướng" color="var(--tony-neon-green)" />
                </div>
            </motion.div>

            {/* ═══════════ LOGOUT ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 48 }}>
                <button 
                    onClick={logout}
                    className="tony-btn-primary" 
                    style={{ width: '100%', background: 'rgba(255, 77, 0, 0.05)', border: '1px solid var(--tony-lava)', color: 'var(--tony-lava)', boxShadow: 'none', fontWeight: 900, fontSize: 15 }}
                >
                    <SignOut size={22} weight="bold" style={{ marginRight: 12 }} />
                    KẾT THÚC PHIÊN VẬN HÀNH
                </button>
            </motion.div>
        </motion.div>
    );
}

function AdminMetricCard({ label, value, unit, icon: Icon, color, trend }: any) {
    return (
        <div className="tony-card" style={{ padding: '24px', minHeight: '150px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                    <Icon size={26} weight="fill" color={color} />
                </div>
                <div style={{ padding: '4px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'white' }}>{trend}</span>
                </div>
            </div>
            <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 34, fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>{value.toLocaleString()}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tony-text-3)', textTransform: 'uppercase' }}>{unit}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 900, color: 'var(--tony-text-2)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 2 }}>{label}</p>
            </div>
        </div>
    );
}

function AdminOperationRow({ to, icon: Icon, label, desc, color }: any) {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <motion.div 
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}
                className="tony-card" 
                style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                    <Icon size={28} weight="fill" color={color} />
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 950, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</h4>
                    <p style={{ fontSize: 13, color: 'var(--tony-text-3)', margin: '4px 0 0', fontWeight: 500 }}>{desc}</p>
                </div>
                <CaretRight size={24} weight="bold" color="var(--tony-text-3)" />
            </motion.div>
        </Link>
    );
}

function AdminAutomationWidget() {
    const { isEngineRunning, logs } = useAutomationStore();
    const { enabledPlansCount, totalTriggersToday } = useAutomationEngine();

    return (
        <motion.div variants={item} style={{ marginTop: 24 }}>
            <div className="tony-card" style={{ padding: '28px', border: '1px solid var(--tony-blue-dim)', background: 'rgba(10, 132, 255, 0.05)', boxShadow: isEngineRunning ? 'inset 0 0 20px rgba(10, 132, 255, 0.1)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors ${isEngineRunning ? 'bg-tony-blue text-white tony-pulse-blue' : 'bg-white/5 text-white/20'}`} 
                        style={{ background: isEngineRunning ? 'var(--tony-blue)' : 'rgba(255,255,255,0.05)', boxShadow: isEngineRunning ? '0 0 30px var(--tony-blue)' : 'none' }}>
                        <Lightning size={28} weight="fill" className={isEngineRunning ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: 19, fontWeight: 950, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>LÕI TỰ ĐỘNG HÓA</h4>
                        <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--tony-blue)', textTransform: 'uppercase', letterSpacing: 2.5 }}>
                            {isEngineRunning ? 'Đang hoạt động' : 'Hệ thống tắt'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                    <div style={{ padding: '20px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--tony-text-3)', textTransform: 'uppercase', display: 'block', marginBottom: 8, letterSpacing: 1.5 }}>Kích hoạt hôm nay</span>
                        <span style={{ fontSize: 28, fontWeight: 950, color: '#fff' }}>{totalTriggersToday}</span>
                    </div>
                    <div style={{ padding: '20px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--tony-text-3)', textTransform: 'uppercase', display: 'block', marginBottom: 8, letterSpacing: 1.5 }}>Kế hoạch đang chạy</span>
                        <span style={{ fontSize: 28, fontWeight: 950, color: '#fff' }}>{enabledPlansCount}</span>
                    </div>
                </div>

                {logs.length > 0 && (
                     <div style={{ padding: '16px 20px', borderRadius: 16, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(10, 132, 255, 0.2)', fontStyle: 'italic' }}>
                        <p style={{ fontSize: 14, color: 'var(--tony-text-2)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                            {logs[0].planName}: {logs[0].message}
                        </p>
                     </div>
                )}
            </div>
        </motion.div>
    );
}
