import { useMemo } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Play, Brain, Fire, Footprints, 
    ChartLineUp, SignOut, GearSix,
    CalendarBlank, Sparkle, Lightning
} from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { useMemberStore } from '../store/useMemberStore';
import { useCalorieStore } from '../store/useCalorieStore';
import { useHealthStore } from '../store/useHealthStore';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } }
};

export default function MemberDashboard() {
    const { user, logout } = useAuth();
    const { members } = useMemberStore();
    const { calorieGoal, getDayTotals } = useCalorieStore();
    const { dailyStats } = useHealthStore();

    const member = useMemo(() => {
        const id = user?.memberId || 'm1';
        return members.find(m => m.id === id) || members[0];
    }, [user?.memberId, members]);

    const todayDateStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
    const todayFormatted = useMemo(() => format(new Date(), "EEEE, dd 'tháng' MM", { locale: vi }), []);

    const todayTotals = useMemo(() => getDayTotals(todayDateStr), [getDayTotals, todayDateStr]);
    const targetCalories = calorieGoal?.calories || 2500;
    const currentCalories = Math.round(todayTotals?.calories || 0);
    const caloriePercent = Math.min((currentCalories / targetCalories) * 100, 100);

    const todayHealth = useMemo(() => dailyStats[todayDateStr] || { steps: 0 }, [dailyStats, todayDateStr]);
    const todaySteps = todayHealth.steps || 0;
    const stepGoal = 10000;
    const stepPercent = Math.min((todaySteps / stepGoal) * 100, 100);

    const firstName = member?.name?.split(' ').pop() || 'Thành viên';

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

            {/* ═══════════ HERO: IMMERSIVE WORKOUT ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 12 }}>
                <Link to="/my-workout" style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ height: 'auto', minHeight: 240, position: 'relative', overflow: 'hidden', borderRadius: 32, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800"
                            alt="Workout Background"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9, 9, 11, 1) 10%, rgba(9, 9, 11, 0.4) 70%, transparent 100%)' }} />
                        <div style={{ position: 'relative', padding: '32px 24px 24px', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <span style={{ fontSize: 11, color: '#FF375F', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, background: 'rgba(255,55,95,0.15)', padding: '4px 10px', borderRadius: 8, backdropFilter: 'blur(10px)' }}>HỘI VIÊN ELITE</span>
                                <span style={{ fontSize: 13, color: 'white', opacity: 0.6, fontWeight: 700 }}>{todayFormatted}</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(24px, 6vw, 30px)', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                                CHÀO {firstName},<br/>BẮT ĐẦU TẬP LUYỆN
                            </h2>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '12px 0 24px', fontWeight: 500 }}>
                                Kiến tạo vóc dáng anh hùng ngay hôm nay
                            </p>
                            <button className="tony-btn-primary" style={{ padding: '16px 28px', fontSize: 13, fontWeight: 900, alignSelf: 'flex-start', border: 'none', background: 'var(--tony-red)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                TẬP NGAY <Play size={18} weight="fill" />
                            </button>
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* ═══════════ PREMIUM STATS GRID ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 className="tony-title" style={{ fontSize: 17 }}>CHỈ SỐ SINH TỒN</h3>
                    <span className="tony-amber-gradient" style={{ fontSize: 11, fontWeight: 850, letterSpacing: 1.5 }}>REAL-TIME DATA</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <TonyStatCard 
                        label="Calories" 
                        value={currentCalories} 
                        unit="Kcal" 
                        icon={Fire} 
                        color="var(--tony-lava)" 
                        percent={caloriePercent}
                        trend="+15%"
                    />
                    <TonyStatCard 
                        label="Steps" 
                        value={todaySteps} 
                        unit="Bước" 
                        icon={Footprints} 
                        color="var(--tony-blue)" 
                        percent={stepPercent}
                        trend="-2%"
                    />
                </div>
            </motion.div>

            {/* ═══════════ IMMERSIVE CATEGORIES ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 24 }}>
                <h3 className="tony-title" style={{ fontSize: 17, marginBottom: 16 }}>TRUNG TÂM HUẤN LUYỆN</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <ImmersiveCategoryCard 
                        to="/exercises" 
                        title="HỆ THỐNG BÀI TẬP" 
                        bg="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400"
                        count="1200+ KỸ THUẬT"
                    />
                    <ImmersiveCategoryCard 
                        to="/knowledge" 
                        title="CẨM NANG ELITE" 
                        bg="https://images.unsplash.com/photo-1541534741688-6078c65b5a33?auto=format&fit=crop&q=80&w=400"
                        count="KIẾN THỨC CHUYÊN GIA"
                    />
                </div>
            </motion.div>

            {/* ═══════════ STREAK GAMIFICATION ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 24 }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(232,97,58,0.12), rgba(255,139,92,0.05))',
                    borderRadius: 24,
                    padding: '20px 20px 18px',
                    border: '1px solid rgba(232,97,58,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background decoration */}
                    <div style={{ position: 'absolute', top: -30, right: -20, opacity: 0.06 }}>
                        <Fire size={140} weight="fill" color="#E8613A" />
                    </div>

                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 14,
                                background: 'linear-gradient(135deg, #E8613A, #FF8B5C)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 6px 16px rgba(232,97,58,0.3)',
                            }}>
                                <Lightning size={24} weight="fill" color="white" />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                    <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>7</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>ngày liên tiếp</span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255,214,10,0.15)',
                            color: '#FFD60A',
                            padding: '5px 10px',
                            borderRadius: 8,
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase' as const,
                            letterSpacing: 0.5,
                        }}>🔥 Kỷ lục!</div>
                    </div>

                    {/* Day circles */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => {
                            const done = i < 4;
                            const isToday = i === 3;
                            return (
                                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: done
                                            ? (isToday ? 'linear-gradient(135deg, #E8613A, #FF8B5C)' : '#E8613A')
                                            : 'rgba(255,255,255,0.04)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: isToday ? '2px solid #FFD60A' : done ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                        boxShadow: isToday ? '0 0 12px rgba(232,97,58,0.4)' : 'none',
                                    }}>
                                        {done
                                            ? <Fire size={16} weight="fill" color="white" />
                                            : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                                        }
                                    </div>
                                    <span style={{
                                        fontSize: 10,
                                        color: done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                                        fontWeight: isToday ? 800 : 500,
                                    }}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* ═══════════ QUICK MENU ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 32 }}>
                <div className="tony-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 900, color: 'var(--tony-text-3)', textTransform: 'uppercase', letterSpacing: 2 }}>TIỆN ÍCH HỆ THỐNG</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                        <TonyMenuIcon to="/my-plan" icon={CalendarBlank} label="Lịch tập" color="var(--tony-blue)" />
                        <TonyMenuIcon to="/my-progress" icon={ChartLineUp} label="Tiến độ" color="var(--tony-neon-green)" />
                        <TonyMenuIcon to="/meditation" icon={Brain} label="Thiền" color="var(--tony-purple)" />
                        <TonyMenuIcon to="/success-forecast" icon={Sparkle} label="Dự báo" color="#BF5AF2" />
                        <TonyMenuIcon to="/settings" icon={GearSix} label="Cài đặt" color="var(--tony-text-3)" />
                    </div>
                </div>
            </motion.div>

            {/* ═══════════ LOGOUT ═══════════ */}
            <motion.div variants={item} style={{ marginTop: 40 }}>
                <button 
                    onClick={logout}
                    className="tony-btn-primary" 
                    style={{ width: '100%', background: 'rgba(255, 77, 0, 0.05)', border: '1px solid var(--tony-lava)', color: 'var(--tony-lava)', boxShadow: 'none' }}
                >
                    <SignOut size={20} weight="bold" style={{ marginRight: 10 }} />
                    ĐĂNG XUẤT HỆ THỐNG
                </button>
            </motion.div>
        </motion.div>
    );
}

function TonyStatCard({ label, value, unit, icon: Icon, color, percent, trend }: any) {
    return (
        <div className="tony-card" style={{ padding: '20px', minHeight: '140px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                    <Icon size={24} weight="fill" color={color} />
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: trend.startsWith('+') ? 'var(--tony-neon-green)' : 'var(--tony-red)' }}>{trend}</span>
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>{value.toLocaleString()}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tony-text-3)', textTransform: 'uppercase' }}>{unit}</span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 850, color: 'var(--tony-text-2)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</p>
            </div>
            {/* Fire Progress Bar */}
            <div style={{ marginTop: 16, height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ height: '100%', background: color, boxShadow: `0 0 15px ${color}` }}
                />
            </div>
        </div>
    );
}

function ImmersiveCategoryCard({ to, title, bg, count }: any) {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <div className="tony-card-immersive" style={{ height: 160 }}>
                <img src={bg} className="tony-card-immersive-img" alt={title} />
                <div className="tony-card-immersive-overlay" style={{ background: 'linear-gradient(to top, rgba(9, 9, 11, 0.98), transparent)' }} />
                <div className="tony-card-immersive-content" style={{ padding: '20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--tony-lava)', letterSpacing: 2 }}>{count}</span>
                    <h4 style={{ fontSize: 20, fontWeight: 950, color: '#fff', margin: '4px 0 0', textTransform: 'uppercase', lineHeight: 1.2 }}>{title}</h4>
                </div>
            </div>
        </Link>
    );
}

function TonyMenuIcon({ to, icon: Icon, label, color }: any) {
    return (
        <Link to={to} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <motion.div 
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
                style={{ 
                    width: 60, height: 60, borderRadius: 20, background: 'rgba(255,255,255,0.03)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Icon size={28} weight="bold" color={color} />
            </motion.div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--tony-text-2)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        </Link>
    );
}
