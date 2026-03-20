import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Trophy, Flame, Barbell, SignOut, CaretRight, FloppyDisk, Bell, Shield, DeviceMobile, Globe, Gear, IdentificationCard } from '@phosphor-icons/react';
import { useStepStore } from '../store/useStepStore';
import { useCalorieStore } from '../store/useCalorieStore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ============================================================
//  PROFILE PAGE — Neural Identity Node (Premium Redesign)
// ============================================================

const STORAGE_KEY = 'ht-profile-v1';
function loadProfile() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProfile(data: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { ...spring } } };

export default function ProfilePage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const stepStore = useStepStore();
    const calorieStore = useCalorieStore();

    const [editing, setEditing] = useState(false);
    const stored = loadProfile();
    const [name, setName] = useState(stored.name || 'Chiến binh');
    const [age, setAge] = useState(stored.age || '25');
    const [height, setHeight] = useState(stored.height || '175');
    const [weight, setWeight] = useState(stored.weight || '70');
    const [gender, setGender] = useState(stored.gender || 'male');
    const [goal] = useState(stored.goal || 'Tăng cường sức mạnh');

    const handleSave = () => {
        const data = { name, age, height, weight, gender, goal };
        saveProfile(data);
        calorieStore.updateGoal({
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender: gender as 'male' | 'female',
        });
        setEditing(false);
        toast.success('Danh tính neural đã được cập nhật!', {
            icon: '⚡',
            style: { background: '#1c1c1e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }
        });
    };

    const totalSteps = stepStore.getTotalSteps();
    const achievements = stepStore.achievements.filter(a => a.unlockedAt).length;
    const streak = stepStore.currentStreak;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        toast.success('Hệ thống đã ngắt kết nối. Hẹn gặp lại!');
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="min-h-full pb-32 ios-animate-in">

            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="pt-8 pb-8 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#FF9F0A]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Hồ Sơ Danh Tính</span>
                </div>
                <h1 className="superapp-text-gradient" style={{ fontSize: 'clamp(22px, 7vw, 30px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, fontStyle: 'italic', textTransform: 'uppercase', whiteSpace: 'normal', display: 'block', overflowWrap: 'break-word' }}>
                    Hồ Sơ Cá Nhân
                </h1>
            </motion.div>

            {/* ── AVATAR CARD ── */}
            <motion.div variants={fadeUp} className="relative mb-10">
                <div className="superapp-card-glass p-10 rounded-[45px] flex flex-col items-center border border-white/5 floating-card-shadow glass-reflection">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[45px] flex items-center justify-center text-6xl relative z-10 overflow-hidden border-2 border-white/10 bg-white/[0.02] shadow-2xl">
                            {gender === 'female' ? '👩' : '💪'}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent" />
                        </div>
                        <button
                            onClick={() => setEditing(true)}
                            className="absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl flex items-center justify-center z-20 shadow-[0_8px_20px_rgba(10,132,255,0.4)] border border-white/20 active:scale-90 transition-transform bg-[#0A84FF]"
                        >
                            <Camera size={20} weight="fill" className="text-white" />
                        </button>
                    </div>

                    <div className="text-center mt-8">
                        {!editing ? (
                            <>
                                <h2 className="text-[28px] font-black italic tracking-tighter uppercase text-white/90">{name}</h2>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 flex items-center gap-2">
                                        <Globe size={12} weight="bold" className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{goal}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full max-w-[280px] space-y-4">
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Tên của bạn"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-[18px] font-black italic uppercase tracking-tight outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── QUICK METRICS ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-10">
                {[
                    { icon: Flame, value: streak, label: 'CHUỖI', color: '#FF453A' },
                    { icon: Trophy, value: achievements, label: 'DANH HIỆU', color: '#FFD60A' },
                    { icon: Barbell, value: `${(totalSteps / 1000).toFixed(1)}k`, label: 'BƯỚC CHÂN', color: '#BF5AF2' },
                ].map((s, i) => (
                    <div key={i} className="neural-island p-5 flex flex-col items-center gap-3 border border-white/5 rounded-[32px] group relative overflow-hidden active:scale-95 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                        <s.icon size={22} weight="fill" color={s.color} />
                        <div className="text-center">
                            <p className="text-[22px] font-black leading-none italic tracking-tighter">{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/20 mt-1 italic">{s.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* ── PERSONAL DATA ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Thông số sinh học</span>
                    {!editing ? (
                        <button onClick={() => setEditing(true)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic flex items-center gap-2 group">
                            Cập nhật <CaretRight size={12} weight="bold" />
                        </button>
                    ) : (
                        <button onClick={handleSave} className="px-5 py-2 rounded-full bg-green-500 text-[#1c1c1e] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_8px_20px_rgba(48,209,88,0.4)]">
                            <FloppyDisk size={14} weight="fill" /> Lưu lại
                        </button>
                    )}
                </div>

                <div className="superapp-card-glass rounded-[40px] border border-white/5 overflow-hidden">
                    <InfoRow label="Tuổi" value={age} editing={editing} onChange={setAge} unit="Tuổi" />
                    <InfoRow label="Chiều cao" value={height} editing={editing} onChange={setHeight} unit="CM" />
                    <InfoRow label="Cân nặng" value={weight} editing={editing} onChange={setWeight} unit="KG" />
                    <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white/20 italic">Giới tính</span>
                        {!editing ? (
                            <span className="text-[15px] font-black italic uppercase text-white/90">{gender === 'male' ? 'Nam' : 'Nữ'}</span>
                        ) : (
                            <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5">
                                {[
                                    { id: 'male', label: 'Nam' },
                                    { id: 'female', label: 'Nữ' }
                                ].map(g => (
                                    <button
                                        key={g.id}
                                        onClick={() => setGender(g.id)}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${gender === g.id ? 'bg-white text-black' : 'text-white/30'
                                            }`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── SETTINGS ── */}
            <motion.div variants={fadeUp} className="mb-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Cấu hình hệ thống</span>
                    <Gear size={20} className="text-white/20" />
                </div>
                <div className="superapp-card-glass rounded-[45px] border border-white/5 overflow-hidden p-2">
                    <SettingsRow icon={Bell} label="Thông báo & Nhắc nhở" color="#FF9F0A" />
                    <SettingsRow icon={Shield} label="Quyền riêng tư & Bảo mật" color="#30D158" />
                    <SettingsRow icon={DeviceMobile} label="Quản lý thiết bị Neural" color="#0A84FF" />
                    <SettingsRow icon={IdentificationCard} label="Xác thực danh tính" color="#A0A0AB" hideBorder />
                </div>
            </motion.div>

            {/* ── LOGOUT ── */}
            <motion.div variants={fadeUp} className="pt-4">
                <button
                    onClick={handleLogout}
                    className="w-full py-8 rounded-[40px] superapp-card-glass border border-red-500/20 active:bg-red-500/10 transition-all flex items-center justify-center gap-4 group"
                >
                    <SignOut size={24} weight="bold" className="text-red-500 group-active:scale-90 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                    <span className="text-[16px] font-black uppercase tracking-[0.3em] text-red-500 italic">Ngắt Kết Nối Neural</span>
                </button>
                <div className="text-center mt-10">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">HT-STRENGTH HỒ SƠ SINH TRẮC v2.0.4</p>
                </div>
            </motion.div>

        </motion.div>
    );
}

function InfoRow({ label, value, editing, onChange, unit }: any) {
    return (
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white/20 italic">{label}</span>
            {!editing ? (
                <div className="flex items-baseline gap-2">
                    <span className="text-[18px] font-black text-white/90 italic">{value}</span>
                    <span className="text-[11px] font-black text-white/20 uppercase italic">{unit}</span>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-20 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right text-[16px] font-black italic uppercase outline-none focus:border-blue-500/50 transition-all"
                    />
                    <span className="text-[11px] font-black text-white/20 uppercase italic">{unit}</span>
                </div>
            )}
        </div>
    );
}

function SettingsRow({ icon: Icon, label, color, hideBorder }: any) {
    return (
        <button className={`w-full flex items-center justify-between p-5 active:bg-white/5 transition-all group ${!hideBorder ? 'border-b border-white/5' : ''}`}>
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 shadow-lg group-active:scale-9 anchor transition-all"
                    style={{ background: `${color}15`, color }}>
                    <Icon size={24} weight="fill" />
                </div>
                <span className="text-[15px] font-black tracking-tight text-white/80 group-hover:text-white transition-colors italic uppercase">{label}</span>
            </div>
            <CaretRight size={20} className="text-white/10 group-hover:text-white/40 transition-all" weight="bold" />
        </button>
    );
}
