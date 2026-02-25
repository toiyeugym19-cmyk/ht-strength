import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Lock, Mail, Github, Chrome, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth'; // Import hook mock auth

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ hook
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validation cơ bản
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setIsLoading(false);
            return;
        }

        try {
            await login(email); // Mock Login luôn thành công
            toast.success(mode === 'login' ? 'Đăng nhập thành công!' : 'Tạo tài khoản thành công!');
            navigate('/');
        } catch (err) {
            setError('Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await login('google-user@gmail.com');
            toast.success('Đăng nhập Google thành công!');
            navigate('/');
        } catch (err) {
            toast.error('Lỗi đăng nhập Google');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 rotate-3 hover:rotate-6 transition-transform">
                        <Dumbbell className="text-white w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">HT Strength</h1>
                    <p className="text-zinc-400 font-medium">Hệ thống quản lý Gym tối thượng</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                    <div className="flex gap-4 mb-8 p-1 bg-black/40 rounded-xl">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            ĐĂNG NHẬP
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            ĐĂNG KÝ
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2">
                                <AlertCircle className="text-red-500" size={16} />
                                <span className="text-xs font-bold text-red-500">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 outline-none focus:border-blue-500 transition-all font-medium"
                                    placeholder="admin@htstrength.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 outline-none focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <a href="#" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Quên mật khẩu?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN'}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0c0c12] px-2 text-zinc-500 font-bold">Hoặc tiếp tục với</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                            <Chrome size={18} className="text-white" />
                            <span className="text-sm font-bold text-white">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                            <Github size={18} className="text-white" />
                            <span className="text-sm font-bold text-white">GitHub</span>
                        </button>
                    </div>
                </div>

                <p className="text-center text-zinc-600 text-xs mt-8 font-medium">
                    &copy; 2026 HT Strength Management System
                </p>
            </motion.div>
        </div>
    );
}
