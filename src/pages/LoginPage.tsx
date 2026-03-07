import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CaretRight, Lock, Envelope, Warning, Shield, UserCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setIsLoading(false);
            return;
        }
        try {
            await login(email);
            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch {
            setError('Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const quickLogin = async (role: 'admin' | 'member') => {
        setIsLoading(true);
        try {
            const email = role === 'admin' ? 'admin@htstrength.com' : 'member@htstrength.com';
            await login(email);
            toast.success(role === 'admin' ? 'Xin chào Admin!' : 'Xin chào Hội Viên!');
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="min-h-screen flex items-center justify-center p-5" style={{ background: '#0C0C0E' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]" style={{ background: '#E8613A' }} />
            </div>

            <motion.div
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                className="w-full max-w-[380px] relative z-10"
            >
                {/* Logo */}
                <motion.div variants={fadeUp} className="flex flex-col items-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="w-32 h-32 rounded-[28px] overflow-hidden flex items-center justify-center mb-5"
                        style={{ background: '#161618', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}
                    >
                        <img src="/logo-hts.png" alt="HT Strength" className="w-full h-full object-contain p-2" />
                    </motion.div>
                    <h1 className="text-[30px] font-black tracking-tighter" style={{ color: '#F0F0F5' }}>HT STRENGTH</h1>
                    <p className="text-[14px] mt-1 font-medium" style={{ color: '#9494A0' }}>Elite Gym Management System</p>
                </motion.div>

                {/* ── DEMO BUTTONS — to, rõ ràng ── */}
                <motion.div variants={fadeUp} className="space-y-3 mb-6">
                    <button
                        onClick={() => quickLogin('admin')}
                        disabled={isLoading}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl active:scale-[0.97] transition-all disabled:opacity-50"
                        style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,132,255,0.15)' }}>
                            <Shield size={24} color="#0A84FF" weight="duotone" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[16px] font-semibold" style={{ color: '#F0F0F5' }}>Admin / Chủ Gym</p>
                            <p className="text-[12px] mt-0.5" style={{ color: '#9494A0' }}>Quản lý hội viên, PT, doanh thu</p>
                        </div>
                        <CaretRight size={18} weight="bold" style={{ color: '#4E4E58' }} />
                    </button>

                    <button
                        onClick={() => quickLogin('member')}
                        disabled={isLoading}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl active:scale-[0.97] transition-all disabled:opacity-50"
                        style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,97,58,0.15)' }}>
                            <UserCircle size={24} color="#E8613A" weight="duotone" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[16px] font-semibold" style={{ color: '#F0F0F5' }}>Hội Viên</p>
                            <p className="text-[12px] mt-0.5" style={{ color: '#9494A0' }}>Tập luyện, xem tiến trình, thống kê</p>
                        </div>
                        <CaretRight size={18} weight="bold" style={{ color: '#4E4E58' }} />
                    </button>
                </motion.div>

                {/* Loading spinner overlay */}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex justify-center py-3">
                        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(232,97,58,0.2)', borderTopColor: '#E8613A' }} />
                    </motion.div>
                )}

                {/* ── HOẶC ĐĂNG NHẬP BẰNG EMAIL ── */}
                <motion.div variants={fadeUp}>
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></div>
                        <div className="relative flex justify-center">
                            <span className="text-[11px] font-medium px-3" style={{ background: '#0C0C0E', color: '#4E4E58' }}>hoặc</span>
                        </div>
                    </div>

                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full py-3 rounded-xl text-[14px] font-medium active:opacity-60 transition-opacity"
                            style={{ background: 'rgba(255,255,255,0.04)', color: '#9494A0', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            Đăng nhập bằng email
                        </button>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-5" style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <form onSubmit={handleAuth} className="space-y-4">
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,59,48,0.1)', border: '0.5px solid rgba(255,59,48,0.2)' }}>
                                        <Warning size={16} color="#FF3B30" weight="duotone" />
                                        <span className="text-[13px] font-medium" style={{ color: '#FF3B30' }}>{error}</span>
                                    </div>
                                )}
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: '#4E4E58' }}>Email</label>
                                    <div className="relative">
                                        <Envelope className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} weight="duotone" style={{ color: '#4E4E58' }} />
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full py-3 pl-11 pr-4 rounded-xl text-[15px] outline-none"
                                            style={{ background: '#1E1E22', border: '1px solid rgba(255,255,255,0.07)', color: '#F0F0F5' }}
                                            placeholder="email@htstrength.com" />
                                    </div>
                                    <p className="text-[10px] mt-1.5" style={{ color: '#4E4E58' }}>
                                        Gõ "admin" trong email = Admin · còn lại = Member
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: '#4E4E58' }}>Mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} weight="duotone" style={{ color: '#4E4E58' }} />
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="w-full py-3 pl-11 pr-4 rounded-xl text-[15px] outline-none"
                                            style={{ background: '#1E1E22', border: '1px solid rgba(255,255,255,0.07)', color: '#F0F0F5' }}
                                            placeholder="••••••••" />
                                    </div>
                                </div>
                                <button type="submit" disabled={isLoading}
                                    className="w-full py-3.5 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-50"
                                    style={{ background: '#E8613A', color: 'white' }}>
                                    Đăng nhập <CaretRight size={16} weight="bold" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </motion.div>

                <motion.p variants={fadeUp} className="text-center text-[11px] mt-8" style={{ color: '#4E4E58' }}>
                    © 2026 HT Strength Gym
                </motion.p>
            </motion.div>
        </div>
    );
}
