import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, LayoutGrid, RefreshCw,
    Users, Heart, UserCheck, MessageSquare, Settings, Search, Sparkles, Crown, Flame, Home, Book, CheckCircle2, Dumbbell,
    AlertTriangle, Play, Zap, Timer
} from 'lucide-react';
import { useExerciseStore } from '../../store/useExerciseStore';
import { Toaster, toast } from 'sonner';

import { useHealthStore } from '../../store/useHealthStore';
import { useMemberStore } from '../../store/useMemberStore';
import { useGymStore } from '../../store/useGymStore';
import { format } from 'date-fns';

import { WORKOUT_PROGRAMS, WARMUP_PROTOCOLS, calculateE1RM, REST_TIME_SECONDS } from '../../data/mock_workouts';
import { useFatigueAnalysis } from '../../utils/fatigueSystem';

// --- TYPES ---
type Screen = 'os' | 'members' | 'chat' | 'bio' | 'neural' | 'member_detail' | 'onboarding' | 'knowledge' | 'workout' | 'active_workout';

// --- CLICKABLE LOGO (Goes to main homepage) ---
const ThorProLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
    const navigate = useNavigate();
    const widthMap = {
        small: 'w-28',
        default: 'w-40',
        large: 'w-56'
    };
    return (
        <div onClick={() => navigate('/')} className={`cursor-pointer active:scale-95 transition-all select-none hover:opacity-80`}>
            <img
                src="/logo-hts.png"
                alt="HT Strength Training"
                className={`${widthMap[size]} h-auto object-contain`}
            />
        </div>
    );
};

// --- BACK TO HOME BUTTON ---
const BackToHomeButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all"
        >
            <LayoutGrid size={14} />
            <span>Trang chủ</span>
        </button>
    );
};

// --- HOME TAB BUTTON (for bottom navigation) ---
const HomeTabButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 transition-all relative px-2 py-2 rounded-xl group"
        >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-active:scale-90 transition-all">
                <Home size={18} className="text-white" />
            </div>
            <span className="text-[7px] font-black uppercase tracking-wide text-blue-400">HOME</span>
        </button>
    );
};


// --- 0. ONBOARDING SCREEN (PREMIUM) ---
const OnboardingScreen = ({ nav }: { nav: (s: Screen) => void }) => {
    const levels = [
        {
            id: 'beginner',
            title: 'BEGINNER',
            subtitle: 'Tôi mới bắt đầu hành trình',
            gradient: 'from-blue-600 via-blue-500 to-cyan-400',
            icon: Sparkles,
            stats: '4 tuần • 3x/tuần'
        },
        {
            id: 'intermediate',
            title: 'INTERMEDIATE',
            subtitle: 'Tôi đã có nền tảng tốt',
            gradient: 'from-purple-600 via-violet-500 to-fuchsia-400',
            icon: Flame,
            stats: '8 tuần • 4x/tuần'
        },
        {
            id: 'advanced',
            title: 'ADVANCED',
            subtitle: 'Tôi là Pro Athlete',
            gradient: 'from-orange-600 via-red-500 to-pink-500',
            icon: Crown,
            stats: '12 tuần • 5x/tuần'
        }
    ];

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black overflow-hidden">
            {/* Header - Logo removed */}
            <div className="pt-10"></div>

            {/* Title */}
            <div className="px-6 mb-8">
                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl font-[1000] text-white italic uppercase tracking-tight leading-tight"
                >
                    Chọn<br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Cấp Độ</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-zinc-500 text-sm mt-2 font-medium"
                >
                    Bắt đầu hành trình của bạn
                </motion.p>
            </div>

            {/* Level Cards */}
            <div className="flex-1 px-6 space-y-4 overflow-y-auto no-scrollbar pb-10">
                {levels.map((lvl, i) => (
                    <motion.button
                        key={lvl.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 100 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            localStorage.setItem('app_onboarded', 'true');
                            nav('os');
                        }}
                        className="w-full group"
                    >
                        <div className={`relative w-full p-6 rounded-[2rem] bg-gradient-to-r ${lvl.gradient} overflow-hidden shadow-2xl`}>
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${lvl.gradient} opacity-50 blur-2xl -z-10 group-hover:opacity-80 transition-opacity`} />

                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

                            {/* Content */}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner">
                                        <lvl.icon size={28} className="text-white drop-shadow-lg" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-[1000] text-white italic uppercase tracking-tight drop-shadow-md">{lvl.title}</h3>
                                        <p className="text-white/80 text-xs font-medium mt-0.5">{lvl.subtitle}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-black/30 rounded-full text-[9px] font-bold text-white/90 backdrop-blur-sm">{lvl.stats}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                                    <ChevronRight size={20} className="text-white group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6 pb-10 text-center"
            >
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                    HT-STRENGTH SYSTEM © 2026
                </p>
            </motion.div>
        </div>
    );
};

// --- 1. OS DASHBOARD (PREMIUM) ---
const OSDashboard = ({ nav }: { nav: (s: Screen) => void }) => {
    const { members } = useMemberStore();
    const activeCount = members.filter(m => m.status === 'Active').length;

    const quickAccess = [
        { icon: Users, label: 'Members', desc: 'CRM System', color: 'from-blue-600 to-cyan-500', screen: 'members' as Screen },
        { icon: Flame, label: 'Workout', desc: 'Start Training', color: 'from-orange-500 to-red-500', screen: 'workout' as Screen },
        { icon: MessageSquare, label: 'Chat', desc: 'Messaging', color: 'from-green-600 to-emerald-500', screen: 'chat' as Screen },
        { icon: Heart, label: 'Bio', desc: 'Profile', color: 'from-red-500 to-orange-500', screen: 'bio' as Screen },
        { icon: Book, label: 'Library', desc: 'Knowledge Base', color: 'from-amber-500 to-orange-500', screen: 'knowledge' as Screen },
    ];

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black overflow-y-auto no-scrollbar pb-32">
            {/* Header */}
            <div className="p-6 pt-14 flex justify-between items-start">
                <ThorProLogo />
                <div className="flex items-center gap-2">
                    <BackToHomeButton />
                    <button onClick={() => toast.info('Settings')} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-zinc-400 hover:bg-white/10 transition-all">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="px-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => nav('members')}
                        className="p-5 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-transform group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Users size={40} className="absolute -right-1 -top-1 text-blue-500/20" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest relative z-10">Tổng HV</span>
                        <h2 className="text-4xl font-[1000] text-white italic relative z-10 mt-1">{members.length}</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => nav('members')}
                        className="p-5 rounded-[2rem] bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-transform group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <UserCheck size={40} className="absolute -right-1 -top-1 text-green-500/20" />
                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest relative z-10">Đang tập</span>
                        <h2 className="text-4xl font-[1000] text-white italic relative z-10 mt-1">{activeCount}</h2>
                        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    </motion.div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="px-6">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                    {quickAccess.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            onClick={() => nav(item.screen)}
                            className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-[2rem] cursor-pointer active:scale-95 transition-all group hover:bg-white/[0.06] hover:border-white/10"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                <item.icon size={22} className="text-white" />
                            </div>
                            <h3 className="text-[12px] font-black text-white uppercase italic tracking-tight">{item.label}</h3>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wide mt-0.5">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* SYSTEM INTEGRATION STATUS (The Monolith Scale) */}
            <div className="px-6 mt-8">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">SYSTEM MODULES</h3>
                <div className="space-y-2">
                    {[
                        { name: 'WGER DB', status: 'ONLINE', ver: '2.4', color: 'text-green-500' },
                        { name: 'FIT-AI', status: 'ACTIVE', ver: '1.2', color: 'text-blue-500' },
                        { name: 'HEALTHKIT', status: 'SYNCED', ver: '17.0', color: 'text-purple-500' },
                        { name: 'FASTLOG', status: 'READY', ver: '0.9', color: 'text-orange-500' }
                    ].map((mod, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                            <span className="text-[10px] font-bold text-zinc-400 font-mono">{mod.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-zinc-600">v{mod.ver}</span>
                                <span className={`text-[9px] font-black ${mod.color} tracking-wider`}>{mod.status}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${mod.color.replace('text', 'bg')} animate-pulse`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 2. MEMBERS SCREEN ---
const MembersScreen = ({ nav }: { nav: (s: Screen, d?: any) => void }) => {
    const { members, performCheckIn } = useMemberStore();
    const [search, setSearch] = useState('');
    const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col pb-32">
            {/* Header */}
            <div className="p-6 pt-14 flex items-center gap-4">
                <button onClick={() => nav('os')} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <ThorProLogo size="small" />
            </div>

            {/* Search */}
            <div className="px-6 mb-4">
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm hội viên..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
                    />
                </div>
            </div>

            {/* Member List */}
            <div className="flex-1 px-6 overflow-y-auto no-scrollbar space-y-2">
                {filtered.map((m, i) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => nav('member_detail', m)}
                        className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] hover:bg-white/[0.06] transition-all group"
                    >
                        <div className="relative">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`} className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10" />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#030014] ${m.status === 'Active' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]' : 'bg-zinc-600'}`} />
                        </div >
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                            <p className="text-[11px] text-zinc-500 font-medium truncate">{m.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const isCheckedIn = m.lastCheckIn && new Date(m.lastCheckIn).toDateString() === new Date().toDateString();
                                    if (isCheckedIn) {
                                        toast.error(`${m.name} đã check-in hôm nay!`);
                                    } else {
                                        performCheckIn(m.id, 'Gym Access');
                                        toast.success(`Check-in thành công: ${m.name}`);
                                    }
                                }}
                                className={`p-2.5 rounded-xl border ${m.lastCheckIn && new Date(m.lastCheckIn).toDateString() === new Date().toDateString()
                                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                                    : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'
                                    } transition-all shadow-lg active:scale-95`}
                            >
                                {m.lastCheckIn && new Date(m.lastCheckIn).toDateString() === new Date().toDateString()
                                    ? <CheckCircle2 size={16} strokeWidth={3} />
                                    : <UserCheck size={16} strokeWidth={3} />}
                            </button>
                            <ChevronRight size={16} className="text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </motion.div >
                ))}
                {
                    filtered.length === 0 && (
                        <div className="text-center py-16">
                            <Users size={40} className="text-zinc-800 mx-auto mb-3" />
                            <p className="text-zinc-600 text-sm font-medium">Không tìm thấy hội viên</p>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

// --- 3. MEMBER DETAIL ---
const MemberDetailScreen = ({ member, nav }: { member: any, nav: (s: Screen) => void }) => {
    const { performCheckIn } = useMemberStore();
    const isCheckedIn = member?.lastCheckIn && new Date(member.lastCheckIn).toDateString() === new Date().toDateString();

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col pb-32 overflow-y-auto no-scrollbar">
            <div className="p-6 pt-14 flex items-center justify-between sticky top-0 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/5 z-10">
                <button onClick={() => nav('members')} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={20} className="text-white" /></button>
                <ThorProLogo size="small" />
                <div className="w-12" />
            </div>
            <div className="p-6 text-center">
                <div className="relative inline-block">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.id}`} className="w-28 h-28 rounded-[2rem] border-4 border-white/10 mx-auto shadow-2xl" />
                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#030014] ${member?.status === 'Active' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]' : 'bg-zinc-600'}`} />
                </div>
                <h2 className="text-3xl font-[1000] italic uppercase tracking-tight mt-4 text-white">{member?.name}</h2>
                <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.15em] mt-1">{member?.id?.substring(0, 12)}</p>
            </div>
            <div className="px-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Ngày tham gia', value: member?.joinDate || 'N/A', color: 'text-white' },
                        { label: 'Ngày hết hạn', value: member?.expiryDate || 'N/A', color: 'text-red-400' },
                        { label: 'Email', value: member?.email || 'N/A', color: 'text-white', span: true },
                    ].map((item, i) => (
                        <div key={i} className={`p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl ${item.span ? 'col-span-2' : ''}`}>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider block mb-1">{item.label}</span>
                            <p className={`text-sm font-bold ${item.color} truncate`}>{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => {
                            if (isCheckedIn) {
                                toast.error('Hội viên đã check-in hôm nay rồi!');
                                return;
                            }
                            performCheckIn(member.id, 'Gym Access');
                            toast.success(`✅ Đã check-in cho ${member.name}`);
                            nav('members'); // Quay lại danh sách để cập nhật
                        }}
                        disabled={isCheckedIn}
                        className={`col-span-2 py-4 ${isCheckedIn ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25 active:scale-[0.98]'} font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-transform flex items-center justify-center gap-2`}
                    >
                        {isCheckedIn ? <CheckCircle2 size={18} /> : <UserCheck size={18} />}
                        {isCheckedIn ? 'ĐÃ CHECK-IN HÔM NAY' : 'ĐIỂM DANH NGAY'}
                    </button>
                    <button className="col-span-2 py-4 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
                        Ghi nhận Metrics
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 4. AI CHAT SCREEN (Fitness Coach) ---
const ChatScreen = ({ nav }: { nav: (s: Screen) => void }) => {
    const [messages, setMessages] = useState<Array<{ id: string, role: 'user' | 'ai', content: string, time: string }>>([
        { id: '1', role: 'ai', content: 'Xin chào! Tôi là Thor AI Coach 🏋️ Hãy hỏi tôi bất cứ điều gì về tập luyện, dinh dưỡng, hoặc phục hồi!', time: format(new Date(), 'HH:mm') }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Fetch articles for chat
    const [articlesData, setArticlesData] = useState<any[]>([]);
    useEffect(() => {
        fetch('/articles.json').then(res => res.json()).then(setArticlesData).catch(console.error);
    }, []);

    const quickPrompts = [
        { icon: '💪', text: 'Cách tăng cơ hiệu quả?' },
        { icon: '🥗', text: 'Chế độ ăn giảm mỡ?' },
        { icon: '😴', text: 'Phục hồi sau tập?' },
        { icon: '🔥', text: 'Bài tập cardio tốt nhất?' },
    ];

    const aiResponses: Record<string, string> = {
        'cách tăng cơ hiệu quả': '💪 **Để tăng cơ hiệu quả:**\n\n1. **Progressive Overload** - Tăng dần trọng lượng mỗi tuần\n2. **Protein 1.6-2.2g/kg** - Ăn đủ protein mỗi bữa\n3. **Ngủ 7-9 tiếng** - Cơ phát triển khi nghỉ ngơi\n4. **Compound exercises** - Squat, Deadlift, Bench Press\n5. **Consistency** - Tập đều 4-5 buổi/tuần',
        'chế độ ăn giảm mỡ': '🥗 **Chế độ ăn giảm mỡ:**\n\n1. **Caloric deficit** - Ăn ít hơn TDEE 300-500 calo\n2. **High protein** - Giữ cơ khi giảm mỡ\n3. **Rau xanh** - Chất xơ no lâu\n4. **Uống nước** - 3-4L mỗi ngày\n5. **Tránh đường** - Cắt nước ngọt, bánh kẹo',
        'phục hồi sau tập': '😴 **Phục hồi hiệu quả:**\n\n1. **Sleep** - 7-9 tiếng/đêm\n2. **Stretching** - 10 phút sau tập\n3. **Foam rolling** - Massage cơ\n4. **Cold shower** - Giảm viêm\n5. **Active recovery** - Đi bộ nhẹ ngày nghỉ',
        'bài tập cardio tốt nhất': '🔥 **Top Cardio Workouts:**\n\n1. **HIIT** - 20 phút, đốt mỡ tối đa\n2. **Jump rope** - Full body, coordination\n3. **Swimming** - Low impact, toàn diện\n4. **Cycling** - Tốt cho chân và tim\n5. **Rowing** - Upper + lower body',
    };

    // Extended responses for common queries
    const extendedResponses: Record<string, string> = {
        '6 múi': '🎯 Bụng 6 múi: Body fat <12%, Plank, Leg Raise, HIIT, Kiên trì!',
        'bụng': '🎯 Bụng 6 múi: Giảm body fat, Ab exercises, HIIT, Cắt đường!',
        'yêu': '❤️ Yêu gym = Lifestyle! Khỏe mạnh, tự tin hơn! 🏆',
        'gym': '🏋️ Gym: Khỏe, tinh thần tốt, tự tin!',
        'ngực': '🏋️ Ngực: Bench Press, Incline DB, Cable Fly, Dips',
        'lưng': '💪 Lưng: Pull-ups, Barbell Row, Lat Pulldown',
        'chân': '🦵 Chân: Squat, RDL, Leg Press. Never skip leg day!',
        'vai': '💪 Vai: OHP, Lateral Raise, Face Pull',
        'protein': '🥩 Protein 1.6-2.2g/kg: Gà, cá, trứng, whey',
    };
    const allResponses = { ...aiResponses, ...extendedResponses };

    // Fitness-related keywords to check if question is about gym
    const fitnessKeywords = ['gym', 'tập', 'cơ', 'protein', 'whey', 'cardio', 'squat', 'deadlift', 'bench', 'workout', 'exercise', 'bulking', 'cutting', 'calorie', 'dinh dưỡng', 'muscle', 'weight', 'fat', 'abs', 'chest', 'leg', 'arm', 'back', 'shoulder', 'creatine', 'supplement', 'recovery', 'rest', 'sleep', 'ngủ', 'ăn', 'diet', 'macro', 'hiit', 'liss', 'strength', 'endurance', 'flexibility', 'mobility', '6 múi', 'bụng', 'ngực', 'lưng', 'chân', 'vai', 'tay', 'yêu', 'khỏe', 'health', 'fitness', 'giảm', 'tăng', 'cân', 'mỡ', 'bcaa', 'omega', 'vitamin', 'pre-workout', 'post-workout', 'deload', 'hypertrophy', 'overload'];

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now().toString(), role: 'user' as const, content: text, time: format(new Date(), 'HH:mm') };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let response = '';
            let foundAnswer = false;

            // Check if question is fitness-related
            const isFitnessRelated = fitnessKeywords.some(kw => lowerText.includes(kw));

            if (!isFitnessRelated) {
                // Not a fitness question - politely decline
                response = '🏋️ Xin lỗi! Tôi là Trợ Lý Thể Hình - chuyên gia về **gym và sức khỏe**.\n\nTôi chỉ có thể trả lời các câu hỏi về:\n• 💪 Tập luyện & bài tập\n• 🥗 Dinh dưỡng & thực phẩm\n• 😴 Phục hồi & nghỉ ngơi\n• 💊 Thực phẩm bổ sung\n\nHãy hỏi về gym nhé! 🔥';
                foundAnswer = true;
            }

            // Search in quick responses first
            if (!foundAnswer) {
                for (const [key, value] of Object.entries(allResponses)) {
                    if (lowerText.includes(key)) {
                        response = value;
                        foundAnswer = true;
                        break;
                    }
                }
            }

            // Search in articles knowledge base
            if (!foundAnswer) {
                const matchedArticle = articlesData.find((article: { title: string; summary: string; content: string }) => {
                    const titleLower = article.title.toLowerCase();
                    const summaryLower = article.summary.toLowerCase();
                    const searchTerms = lowerText.split(' ').filter(t => t.length > 2);
                    return searchTerms.some(term => titleLower.includes(term) || summaryLower.includes(term));
                });

                if (matchedArticle) {
                    response = `📚 **${matchedArticle.title}**\n\n${matchedArticle.summary}\n\n💡 *Xem thêm chi tiết trong mục Kiến Thức!*`;
                    foundAnswer = true;
                }
            }

            // Default response for fitness questions without specific answer
            if (!foundAnswer) {
                response = '🤔 Câu hỏi hay về fitness! Tuy nhiên tôi chưa có thông tin cụ thể.\n\nBạn có thể thử hỏi về:\n• Bài tập cụ thể (ngực, lưng, chân, vai...)\n• Dinh dưỡng (protein, carbs, giảm mỡ...)\n• Phục hồi và nghỉ ngơi\n\nHoặc xem thêm trong mục **Kiến Thức** nhé! 📖';
            }

            const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai' as const, content: response, time: format(new Date(), 'HH:mm') };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col">
            {/* Header */}
            <div className="p-4 pt-14 flex items-center gap-4 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <button onClick={() => nav('os')} className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <ChevronLeft size={18} className="text-white" />
                </button>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tight">Thor AI Coach</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-green-400 uppercase">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md'
                            : 'bg-white/5 border border-white/10 text-zinc-300 rounded-2xl rounded-bl-md'
                            } px-4 py-3`}>
                            <p className="text-sm font-medium whitespace-pre-line">{msg.content}</p>
                            <span className={`text-[9px] font-bold mt-2 block ${msg.role === 'user' ? 'text-white/60' : 'text-zinc-600'}`}>
                                {msg.time}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {quickPrompts.map((prompt) => (
                        <button
                            key={prompt.text}
                            onClick={() => sendMessage(prompt.text)}
                            className="shrink-0 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-zinc-400 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30 transition-all active:scale-95"
                        >
                            {prompt.icon} {prompt.text}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 pb-24 border-t border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Hỏi về tập luyện, dinh dưỡng..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-white placeholder:text-zinc-600 outline-none focus:border-purple-500/50 transition-all"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- 5. BIO SCREEN ---
const BioScreen = ({ nav }: { nav: (s: Screen) => void }) => {
    const { syncWithDevice } = useHealthStore();
    const { userProfile } = useGymStore();

    const stats = [
        { label: 'Cân nặng', value: `${userProfile.weight} KG`, color: 'text-blue-400' },
        { label: 'Chiều cao', value: `${userProfile.height} CM`, color: 'text-green-400' },
        { label: 'Kinh nghiệm', value: `${userProfile.yearsTraining} NĂM`, color: 'text-purple-400' },
        { label: 'Phân hạng', value: userProfile.trainingClass, color: 'text-orange-400' },
    ];

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col pb-32 overflow-y-auto no-scrollbar">
            <div className="p-6 pt-14 flex items-center gap-4">
                <button onClick={() => nav('os')} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={20} className="text-white" /></button>
                <ThorProLogo size="small" />
            </div>
            <div className="px-6 mb-6">
                <div className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/[0.06] rounded-[2rem]">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-16 h-16 rounded-2xl border border-white/10" />
                    <div className="flex-1">
                        <h2 className="text-lg font-[1000] text-white italic uppercase tracking-tight">COACH FELIX</h2>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{userProfile.trainingClass} ATHLETE</span>
                    </div>
                    <button onClick={() => syncWithDevice()} className="p-3 bg-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all"><RefreshCw size={18} /></button>
                </div>
            </div>
            <div className="px-6 grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider block mb-1">{stat.label}</span>
                        <p className={`text-xl font-[1000] ${stat.color} italic`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


// --- 5.5 KNOWLEDGE SCREEN ---
const KnowledgeScreen = ({ nav }: { nav: (s: Screen) => void }) => {
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/articles.json')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const filtered = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col pb-32">
            <div className="p-6 pt-14 flex items-center gap-4 sticky top-0 bg-[#0a0a1a]/80 backdrop-blur-xl z-20">
                <button onClick={() => nav('os')} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={20} className="text-white" /></button>
                <h1 className="text-2xl font-serif font-black italic text-white uppercase">Kiến Thức</h1>
            </div>

            <div className="px-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm bài viết..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-4">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-white/20 rounded-full animate-spin" />
                        <p className="text-zinc-500 text-xs animate-pulse">Đang tải thư viện...</p>
                    </div>
                ) : (
                    filtered.slice(0, 20).map((article, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 active:scale-[0.98] transition-all">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider mb-2 block">{article.category}</span>
                            <h3 className="text-white font-bold mb-2 line-clamp-2 text-sm">{article.title}</h3>
                            <p className="text-zinc-500 text-[10px] line-clamp-2 mb-3 leading-relaxed">{article.summary}</p>
                            <div className="flex items-center gap-2">
                                <div className="h-0.5 flex-1 bg-white/5 rounded-full" />
                                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Read More</span>
                            </div>
                        </div>
                    ))
                )}
                {!isLoading && filtered.length === 0 && (
                    <div className="text-center text-zinc-500 py-10 text-xs">Không tìm thấy bài viết</div>
                )}
            </div>
        </div>
    );
};


// --- 6. WORKOUT SCREEN: Program Selection ---


const WorkoutScreen = ({ nav }: { nav: (s: Screen, d?: any) => void }) => {
    const fatigueReport = useFatigueAnalysis();

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col pb-32 overflow-y-auto no-scrollbar">
            <div className="p-6 pt-14 flex items-center gap-4">
                <button onClick={() => nav('os')} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={20} className="text-white" /></button>
                <h1 className="text-2xl font-black text-white italic uppercase tracking-tight">CHỌN CHƯƠNG TRÌNH</h1>
            </div>

            {/* Fatigue Warning */}
            {fatigueReport.forceDeload && (
                <div className="mx-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl mb-6 flex items-center gap-3">
                    <AlertTriangle size={24} className="text-red-400" />
                    <div>
                        <h4 className="text-xs font-black text-red-400 uppercase">DELOAD CẦN THIẾT</h4>
                        <p className="text-[10px] text-red-300/80">{fatigueReport.recommendations[0]}</p>
                    </div>
                </div>
            )}

            {/* Joint Stress Overview */}
            {fatigueReport.jointStress.length > 0 && (
                <div className="px-6 mb-6">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">TÌNH TRẠNG KHỚP</h3>
                    <div className="flex gap-2 flex-wrap">
                        {fatigueReport.jointStress.map((js, i) => (
                            <div key={i} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${js.status === 'CRITICAL' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                                js.status === 'WARNING' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' :
                                    js.status === 'ELEVATED' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                                        'bg-green-500/20 border-green-500/30 text-green-400'
                                }`}>
                                {js.joint}: {js.stressLevel}%
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Program List */}
            <div className="px-6 space-y-4">
                {WORKOUT_PROGRAMS.map((program, i) => (
                    <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => nav('active_workout', program)}
                        className="relative overflow-hidden rounded-[2rem] border border-white/10 cursor-pointer active:scale-[0.98] transition-all group"
                    >
                        <img src={program.cover} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative z-10 p-6 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${program.level === 'Expert' ? 'bg-red-500/30 text-red-400' :
                                    program.level === 'Hard' ? 'bg-orange-500/30 text-orange-400' :
                                        'bg-green-500/30 text-green-400'
                                    }`}>{program.level}</span>
                                <span className="text-[9px] text-zinc-500 font-bold">{program.duration}</span>
                            </div>
                            <h3 className="text-lg font-[1000] text-white italic uppercase tracking-tight">{program.name}</h3>
                            <p className="text-[10px] text-zinc-400 mt-1">{program.focus} • {program.exercises.length} bài tập</p>
                            <div className="flex items-center gap-2 mt-3">
                                <Play size={14} className="text-primary" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">BẮT ĐẦU</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


// --- 7. ACTIVE WORKOUT SCREEN ---
const ActiveWorkoutScreen = ({ program, nav }: { program: any, nav: (s: Screen) => void }) => {
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [showWarmup, setShowWarmup] = useState(true);
    const [restTime, setRestTime] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const { addLog } = useGymStore();

    const currentExercise = program?.exercises?.[currentExIndex];
    const warmupProtocol = WARMUP_PROTOCOLS[currentExercise?.name];
    const totalSets = currentExercise?.sets || 3;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isResting && restTime > 0) {
            interval = setInterval(() => {
                setRestTime(prev => {
                    if (prev <= 1) {
                        setIsResting(false);
                        toast.success('🔥 LIFT NOW!');
                        return 0;
                    }
                    if (prev === 60) toast.info('⏳ 60 giây còn lại - Chuẩn bị tinh thần');
                    if (prev === 20) toast.warning('🏋️ Tiến về phía tạ!');
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResting, restTime]);

    const logSet = () => {
        if (!weight || !reps) {
            toast.error('Nhập đủ thông tin!');
            return;
        }

        const w = Number(weight);
        const r = Number(reps);
        const e1rm = calculateE1RM(w, r);

        addLog({
            date: format(new Date(), 'yyyy-MM-dd'),
            exerciseName: currentExercise.name,
            weight: w,
            reps: r,
            rpe: 8, // Default, can be enhanced
            muscleGroup: currentExercise.muscleGroup
        });

        toast.success(`✅ Set ${currentSet} logged! E1RM: ${e1rm}kg`);

        // Start rest timer
        const restSeconds = currentExercise.restSeconds || REST_TIME_SECONDS['default_compound'];
        setRestTime(restSeconds);
        setIsResting(true);

        // Move to next set or exercise
        if (currentSet >= totalSets) {
            if (currentExIndex < program.exercises.length - 1) {
                setCurrentExIndex(prev => prev + 1);
                setCurrentSet(1);
                setShowWarmup(true);
            } else {
                toast.success('🏆 WORKOUT HOÀN THÀNH!');
                nav('workout');
            }
        } else {
            setCurrentSet(prev => prev + 1);
        }

        setWeight('');
        setReps('');
    };

    const skipWarmup = () => setShowWarmup(false);

    if (!program || !currentExercise) {
        return <div className="h-full flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#0a0a1a] via-[#030014] to-black flex flex-col">
            {/* Header */}
            <div className="p-6 pt-14 flex items-center justify-between border-b border-white/5">
                <button onClick={() => nav('workout')} className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <div className="text-center">
                    <h2 className="text-sm font-black text-white uppercase italic tracking-tight">{program.name}</h2>
                    <span className="text-[9px] text-zinc-500">Bài {currentExIndex + 1}/{program.exercises.length}</span>
                </div>
                <div className="w-12" />
            </div>

            {/* Rest Timer Overlay */}
            {isResting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-6"
                >
                    <Timer size={48} className="text-primary animate-pulse" />
                    <div className="text-7xl font-mono font-[1000] text-white italic">
                        {Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, '0')}
                    </div>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">NGHỈ GIỮA SET</p>
                    <button onClick={() => { setIsResting(false); setRestTime(0); }} className="px-6 py-3 bg-primary rounded-2xl text-white font-black text-xs uppercase">
                        BỎ QUA
                    </button>
                </motion.div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                {/* Current Exercise Info */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
                        <Dumbbell size={16} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase">{currentExercise.type}</span>
                    </div>
                    <h1 className="text-3xl font-[1000] text-white italic uppercase tracking-tight">{currentExercise.name}</h1>
                    <p className="text-zinc-500 text-xs mt-2">{currentExercise.sets} sets × {currentExercise.reps} reps</p>
                </div>

                {/* Warmup Protocol */}
                {showWarmup && warmupProtocol && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-5 bg-white/5 border border-white/10 rounded-[2rem]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} /> WARM-UP PROTOCOL
                            </h3>
                            <span className="text-[9px] text-zinc-500">{warmupProtocol.duration} min</span>
                        </div>
                        <ul className="space-y-2">
                            {warmupProtocol.steps.map((step, i) => (
                                <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-2">
                                    <span className="text-primary">•</span> {step}
                                </li>
                            ))}
                        </ul>
                        <button onClick={skipWarmup} className="mt-4 w-full py-3 bg-primary rounded-2xl text-white font-black text-xs uppercase tracking-widest">
                            ĐÃ KHỞI ĐỘNG XONG
                        </button>
                    </motion.div>
                )}

                {/* Set Logger */}
                {!showWarmup && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="text-center mb-6">
                            <span className="text-6xl font-[1000] text-white italic">{currentSet}</span>
                            <span className="text-2xl text-zinc-600 font-black">/{totalSets}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">TẢI (KG)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl font-black text-white outline-none focus:border-primary"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">SỐ REP</label>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={e => setReps(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl font-black text-white outline-none focus:border-primary"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <button
                            onClick={logSet}
                            className="w-full py-5 bg-gradient-to-r from-primary to-blue-500 rounded-[2rem] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all"
                        >
                            GHI NHẬN SET {currentSet}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};


// --- MAIN APP ---
export function FitnessMobileApp() {
    const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
        // Tự động bỏ qua Onboarding nếu đã từng vào
        return localStorage.getItem('app_onboarded') === 'true' ? 'os' : 'onboarding';
    });
    const [data, setData] = useState<any>(null);
    const nav = (s: Screen, d?: any) => { if (d) setData(d); setCurrentScreen(s); };

    return (
        <div className="max-w-[430px] mx-auto h-screen bg-black text-white relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border-x border-white/5 overflow-hidden">
            <Toaster position="top-center" theme="dark" richColors />
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentScreen === 'onboarding' && <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><OnboardingScreen nav={nav} /></motion.div>}
                    {currentScreen === 'os' && <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><OSDashboard nav={nav} /></motion.div>}
                    {currentScreen === 'members' && <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><MembersScreen nav={nav} /></motion.div>}
                    {currentScreen === 'member_detail' && <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><MemberDetailScreen member={data} nav={nav} /></motion.div>}
                    {currentScreen === 'chat' && <motion.div key="5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><ChatScreen nav={nav} /></motion.div>}
                    {currentScreen === 'bio' && <motion.div key="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><BioScreen nav={nav} /></motion.div>}
                    {currentScreen === 'knowledge' && <motion.div key="lib" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><KnowledgeScreen nav={nav} /></motion.div>}
                    {currentScreen === 'workout' && <motion.div key="wk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><WorkoutScreen nav={nav} /></motion.div>}
                    {currentScreen === 'active_workout' && <motion.div key="awk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><ActiveWorkoutScreen program={data} nav={nav} /></motion.div>}
                </AnimatePresence>
            </div>
            {currentScreen !== 'onboarding' && (
                <div className="h-20 bg-black/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 z-[100] pb-2">
                    <HomeTabButton />
                    <TabButton active={currentScreen === 'os'} onClick={() => nav('os')} icon={LayoutGrid} label="OS" />
                    <TabButton active={currentScreen === 'workout' || currentScreen === 'active_workout'} onClick={() => nav('workout')} icon={Dumbbell} label="TẬP" />
                    <TabButton active={currentScreen === 'members' || currentScreen === 'member_detail'} onClick={() => nav('members')} icon={Users} label="HỘI VIÊN" />
                    <TabButton active={currentScreen === 'chat'} onClick={() => nav('chat')} icon={MessageSquare} label="CHAT" />
                    <TabButton active={currentScreen === 'bio'} onClick={() => nav('bio')} icon={Heart} label="BIO" />
                </div>
            )}
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all relative px-3 py-2 rounded-xl ${active ? 'text-white' : 'text-zinc-600'}`}>
            {active && <motion.div layoutId="tab-glow" className="absolute inset-0 bg-white/5 rounded-xl border border-white/10" />}
            <Icon size={20} strokeWidth={active ? 2.5 : 2} className="relative z-10" />
            <span className={`text-[8px] font-black uppercase tracking-wide relative z-10 ${active ? 'opacity-100' : 'opacity-50'}`}>{label}</span>
        </button>
    );
}
