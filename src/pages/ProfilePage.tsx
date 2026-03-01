import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Award, Flame, Dumbbell, Heart, LogOut, ChevronRight, Save } from 'lucide-react';
import { useHealthStore } from '../store/useHealthStore';
import { useStepStore } from '../store/useStepStore';
import { useCalorieStore } from '../store/useCalorieStore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

// ============================================================
//  PROFILE PAGE — Mibro Fit Dark Theme (Editable)
// ============================================================

// Profile data stored in localStorage
const STORAGE_KEY = 'ht-profile-v1';
function loadProfile() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { return {}; }
}
function saveProfile(data: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function ProfilePage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const healthStore = useHealthStore();
    const stepStore = useStepStore();
    const calorieStore = useCalorieStore();
    const today = format(new Date(), 'yyyy-MM-dd');

    const [editing, setEditing] = useState(false);
    const stored = loadProfile();
    const [name, setName] = useState(stored.name || 'Chiến binh');
    const [age, setAge] = useState(stored.age || '25');
    const [height, setHeight] = useState(stored.height || '175');
    const [weight, setWeight] = useState(stored.weight || '70');
    const [gender, setGender] = useState(stored.gender || 'male');
    const [goal, setGoal] = useState(stored.goal || 'Khỏe mạnh & Năng động');

    const handleSave = () => {
        const data = { name, age, height, weight, gender, goal };
        saveProfile(data);
        // Also update calorie store for TDEE calculation
        calorieStore.updateGoal({
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender: gender as 'male' | 'female',
        });
        setEditing(false);
        toast.success('Đã lưu hồ sơ!');
    };

    // Stats
    const totalSteps = stepStore.getTotalSteps();
    const achievements = stepStore.achievements.filter(a => a.unlockedAt).length;
    const todayHealth = healthStore.dailyStats[today];
    const streak = stepStore.currentStreak;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        toast.success('Đã đăng xuất');
    };

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ background: 'var(--bg-app)' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 pt-6 space-y-5">

                {/* Avatar & Name */}
                <motion.div variants={fadeUp} className="rounded-3xl p-6 flex flex-col items-center"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                            style={{ background: 'rgba(48,209,88,0.15)', border: '3px solid #30D158' }}>
                            {gender === 'female' ? '👩' : '💪'}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: '#30D158' }} onClick={() => setEditing(true)}>
                            <Camera size={14} className="text-white" />
                        </button>
                    </div>
                    {!editing ? (
                        <>
                            <h2 className="text-xl font-bold mt-3">{name}</h2>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{goal}</p>
                        </>
                    ) : (
                        <input value={name} onChange={e => setName(e.target.value)}
                            className="input-clean text-center !py-2 mt-3 !text-lg !font-bold" />
                    )}
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                    <QuickStat icon={<Flame size={18} className="text-[#FF9F0A]" />} value={`${streak}`} label="Chuỗi ngày" />
                    <QuickStat icon={<Award size={18} className="text-[#FFD60A]" />} value={`${achievements}`} label="Thành tựu" />
                    <QuickStat icon={<Dumbbell size={18} className="text-[#BF5AF2]" />} value={`${(totalSteps / 1000).toFixed(0)}k`} label="Tổng bước" />
                </motion.div>

                {/* Personal Info */}
                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold">Thông tin cá nhân</h2>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} className="text-xs font-medium" style={{ color: '#0A84FF' }}>Chỉnh sửa</button>
                        ) : (
                            <button onClick={handleSave} className="flex items-center gap-1 text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                                style={{ background: '#30D158' }}>
                                <Save size={12} /> Lưu
                            </button>
                        )}
                    </div>
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <InfoRow label="Tuổi" value={age} editing={editing} onChange={setAge} unit="tuổi" />
                        <InfoRow label="Chiều cao" value={height} editing={editing} onChange={setHeight} unit="cm" />
                        <InfoRow label="Cân nặng" value={weight} editing={editing} onChange={setWeight} unit="kg" />
                        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Giới tính</span>
                            {!editing ? (
                                <span className="text-sm font-medium">{gender === 'male' ? 'Nam' : 'Nữ'}</span>
                            ) : (
                                <div className="flex gap-2">
                                    {['male', 'female'].map(g => (
                                        <button key={g} onClick={() => setGender(g)}
                                            className="px-3 py-1 rounded-lg text-xs font-medium"
                                            style={{
                                                background: gender === g ? '#30D158' : 'var(--bg-card-alt)',
                                                color: gender === g ? 'white' : 'var(--text-secondary)'
                                            }}>
                                            {g === 'male' ? 'Nam' : 'Nữ'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {editing && (
                            <div className="px-4 py-3.5">
                                <span className="text-sm block mb-2" style={{ color: 'var(--text-secondary)' }}>Mục tiêu</span>
                                <input value={goal} onChange={e => setGoal(e.target.value)} className="input-clean !py-2 !text-sm" />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Health Summary */}
                <motion.div variants={fadeUp}>
                    <h2 className="text-base font-bold mb-3">Sức khoẻ hôm nay</h2>
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <HealthRow icon={<Heart size={16} className="text-[#FF375F]" />} label="Nhịp tim"
                            value={todayHealth?.heartRateAvg ? `${todayHealth.heartRateAvg} BPM` : '--'} />
                        <HealthRow icon={<Dumbbell size={16} className="text-[#30D158]" />} label="Bước chân"
                            value={todayHealth?.steps ? todayHealth.steps.toLocaleString() : '--'} />
                    </div>
                </motion.div>

                {/* Logout */}
                <motion.div variants={fadeUp}>
                    <button onClick={handleLogout}
                        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold"
                        style={{ background: 'rgba(255,55,95,0.1)', color: '#FF375F', border: '1px solid rgba(255,55,95,0.2)' }}>
                        <LogOut size={16} /> Đăng xuất
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}

function QuickStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="rounded-2xl p-4 flex flex-col items-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {icon}
            <span className="text-lg font-bold mt-1.5">{value}</span>
            <span className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
        </div>
    );
}

function InfoRow({ label, value, editing, onChange, unit }: {
    label: string; value: string; editing: boolean; onChange: (v: string) => void; unit: string;
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            {!editing ? (
                <span className="text-sm font-medium">{value} {unit}</span>
            ) : (
                <div className="flex items-center gap-1">
                    <input type="number" value={value} onChange={e => onChange(e.target.value)}
                        className="input-clean !py-1 !px-2 !text-sm !text-right w-20" />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{unit}</span>
                </div>
            )}
        </div>
    );
}

function HealthRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}
