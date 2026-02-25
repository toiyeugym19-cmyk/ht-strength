import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Moon, Book, Heart, Brain, Shield,
    ChevronRight, Zap, Apple,
    Save, RefreshCw, Play, AlertCircle, ChevronDown
} from 'lucide-react';
import { useMemberStore } from '../store/useMemberStore';
import { toast } from 'sonner';

/**
 * HEALTH HUB PAGE - RESTORED
 */

type TabType = 'tracking' | 'knowledge' | 'care';

interface FeatureModule {
    id: string;
    icon: any;
    iconColor: string;
    iconBg: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    tab: TabType;
}

const HEALTH_MODULES: FeatureModule[] = [
    {
        id: 'body-stats',
        icon: Activity,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
        title: 'Chỉ Số Cơ Thể',
        subtitle: 'Cập nhật số đo',
        description: 'Theo dõi sự thay đổi của cơ thể qua từng giai đoạn.',
        features: ['Cân nặng & BMI', 'Tỉ lệ mỡ (Body Fat)', 'Số đo 3 vòng'],
        tab: 'tracking'
    },
    {
        id: 'sleep-recovery',
        icon: Moon,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-500/10',
        title: 'Giấc Ngủ & Phục Hồi',
        subtitle: 'Chất lượng nghỉ ngơi',
        description: 'Theo dõi thời gian và chất lượng ngủ để tối ưu phục hồi.',
        features: ['Thời lượng ngủ', 'Đánh giá chất lượng', 'Lời khuyên ngủ ngon'],
        tab: 'care'
    },
    {
        id: 'technique-library',
        icon: Book,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-500/10',
        title: 'Thư Viện Kỹ Thuật',
        subtitle: 'Kiến thức tập luyện',
        description: 'Học cách tập đúng form để tránh chấn thương.',
        features: ['Hướng dẫn Squat/Bench', 'Lỗi sai thường gặp', 'Tempo tập luyện'],
        tab: 'knowledge'
    },
    {
        id: 'mental-health',
        icon: Brain,
        iconColor: 'text-pink-500',
        iconBg: 'bg-pink-500/10',
        title: 'Sức Khỏe Tinh Thần',
        subtitle: 'Mindset & Mood',
        description: 'Giữ vững tinh thần kỷ luật và động lực.',
        features: ['Nhật ký cảm xúc', 'Playlist tập trung', 'Quote động lực'],
        tab: 'care'
    },
    {
        id: 'nutrition-tips',
        icon: Apple,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-500/10',
        title: 'Kiến Thức Dinh Dưỡng',
        subtitle: 'Ăn đúng để đẹp',
        description: 'Hiểu về Macro, Calories và cách ăn uống.',
        features: ['Cách tính Macro', 'Thực phẩm nên dùng', 'Hydration'],
        tab: 'knowledge'
    },
    {
        id: 'injury-prevention',
        icon: Shield,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-500/10',
        title: 'Phòng Tránh Chấn Thương',
        subtitle: 'An toàn tập luyện',
        description: 'Các bài khởi động và giãn cơ cần thiết.',
        features: ['Routine khởi động', 'Giãn cơ sau tập', 'Xử lý đau nhức'],
        tab: 'care'
    }
];

const TABS: { id: TabType; label: string; icon: any }[] = [
    { id: 'tracking', label: 'Nạp Data', icon: Activity },
    { id: 'care', label: 'Chăm Sóc', icon: Heart },
    { id: 'knowledge', label: 'Học Hỏi', icon: Book },
];

export default function EcosystemPage() {
    const [activeTab, setActiveTab] = useState<TabType>('tracking');
    const [selectedModule, setSelectedModule] = useState<FeatureModule | null>(null);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

    const filteredModules = HEALTH_MODULES.filter(m => m.tab === activeTab);

    if (isMobile) {
        return (
            <div className="flex flex-col min-h-full bg-bg-dark pb-32" data-device="mobile">
                <div className="px-6 pt-10 mb-8">
                    <h1 className="text-3xl font-bold text-white leading-none mb-3">
                        Hệ Sinh Thái <span className="text-primary">Sức Khỏe</span>
                    </h1>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Theo dõi & tối ưu hóa sức khỏe</p>
                </div>

                {/* Vertical Tabs for Mobile? No, horizontal is fine but more stylish */}
                <div className="px-6 mb-8">
                    <div className="flex bg-zinc-900/60 p-1.5 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[1.5rem] transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-2xl shadow-primary/40 scale-[1.05]'
                                    : 'text-zinc-600'
                                    }`}
                            >
                                <tab.icon size={20} className="mb-1.5" strokeWidth={3} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 space-y-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-5"
                        >
                            {filteredModules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    onClick={() => setSelectedModule(module)}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Detail Drawer */}
                <AnimatePresence>
                    {selectedModule && (
                        <div className="fixed inset-0 z-[100] flex items-end">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedModule(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="relative w-full bg-[#0c0c0e] rounded-t-[3rem] p-8 max-h-[85vh] overflow-y-auto border-t border-white/10"
                            >
                                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
                                <div className="flex items-center gap-5 mb-10">
                                    <div className={`p-5 rounded-[1.5rem] ${selectedModule.iconBg} shadow-2xl`}>
                                        <selectedModule.icon className={selectedModule.iconColor} size={30} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-[900] text-white italic uppercase tracking-tight">{selectedModule.title}</h3>
                                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{selectedModule.subtitle}</p>
                                    </div>
                                </div>
                                <div className="pb-10">
                                    <ModuleContent moduleId={selectedModule.id} onClose={() => setSelectedModule(null)} />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pb-32 bg-bg-dark ${isTablet ? 'p-8' : 'p-12'}`} data-device={isTablet ? 'tablet' : 'desktop'}>
            {/* Header */}
            <div className="mb-12">
                <h1 className={`${isTablet ? 'text-4xl' : 'text-5xl'} font-bold text-white leading-none mb-4`}>
                    Hệ Sinh Thái <span className="text-primary">Sức Khỏe</span>
                </h1>
                <p className="text-zinc-500 text-sm md:text-base font-medium">
                    Theo dõi & tối ưu hóa sức khỏe đa tầng
                </p>
            </div>

            {/* Tabs */}
            <div className={`flex gap-3 mb-12 p-2 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 w-fit`}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105'
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={20} strokeWidth={3} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Modules Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`grid grid-cols-1 ${isTablet ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'} gap-8`}
                >
                    {filteredModules.map((module, idx) => (
                        <motion.div
                            key={module.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <ModuleCard
                                module={module}
                                onClick={() => setSelectedModule(module)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedModule && !isMobile && (
                    <ModuleDetailModal
                        module={selectedModule}
                        onClose={() => setSelectedModule(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}


function ModuleCard({ module, onClick }: { module: FeatureModule; onClick: () => void }) {
    const Icon = module.icon;

    return (
        <motion.div
            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0c]/80 hover:border-white/10 backdrop-blur-xl cursor-pointer transition-all group h-full flex flex-col"
        >
            <div className={`w-14 h-14 rounded-2xl ${module.iconBg} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={module.iconColor} size={28} />
            </div>

            <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                    {module.title}
                </h3>
                <p className="text-sm font-medium text-neutral-500 mb-6">{module.subtitle}</p>

                <ul className="space-y-3">
                    {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-primary transition-colors" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Truy cập</span>
                <ChevronRight className="text-white" size={18} />
            </div>
        </motion.div>
    );
}

function ModuleDetailModal({ module, onClose }: { module: FeatureModule; onClose: () => void }) {
    const Icon = module.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#0e0e11] w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
                {/* Close/Minimize Button */}
                <div className="absolute top-6 right-6 z-10">
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-neutral-800 text-white rounded-full backdrop-blur-md border border-white/10 transition-colors group">
                        <ChevronDown size={24} className="text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className={`p-8 ${module.iconBg} relative overflow-hidden shrink-0`}>
                    <div className="relative z-10 flex items-start gap-5">
                        <div className={`w-16 h-16 rounded-2xl bg-black/20 backdrop-blur-lg flex items-center justify-center shadow-2xl border border-white/10`}>
                            <Icon className={module.iconColor} size={32} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white mb-1">{module.title}</h2>
                            <p className="text-neutral-200 text-sm font-medium opacity-90">{module.description}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-8 -mt-2 relative z-10 custom-scrollbar">
                    <ModuleContent moduleId={module.id} onClose={onClose} />
                </div>
            </motion.div>
        </div>
    );
}

function ModuleContent({ moduleId, onClose }: { moduleId: string, onClose: () => void }) {
    switch (moduleId) {
        case 'body-stats': return <BodyStatsContent onClose={onClose} />;
        case 'sleep-recovery': return <SleepRecoveryContent onClose={onClose} />;
        case 'mental-health': return <MentalHealthContent />;
        case 'technique-library': return <TechniqueContent />;
        case 'nutrition-tips': return <NutritionTipsContent />;
        case 'injury-prevention': return <InjuryPreventionContent />;
        default: return <div className="p-10 text-center text-neutral-500">Nội dung đang được cập nhật...</div>;
    }
}

// --- SUB-COMPONENTS ---

function BodyStatsContent({ onClose }: { onClose: () => void }) {
    const { members } = useMemberStore();
    const activeMember = members && members.length > 0
        ? (members.find(m => m.status === 'Active') || members[0])
        : null;

    const initialWeight = activeMember?.healthMetrics?.[0]?.weight || 70;
    const initialBodyFat = activeMember?.healthMetrics?.[0]?.bodyFat || 20;

    const [weight, setWeight] = useState(initialWeight);
    const [bodyFat, setBodyFat] = useState(initialBodyFat);

    // New Fields
    const [chest, setChest] = useState(activeMember?.healthMetrics?.[0]?.chest || 90);
    const [waist, setWaist] = useState(activeMember?.healthMetrics?.[0]?.waist || 75);
    const [hips, setHips] = useState(activeMember?.healthMetrics?.[0]?.hips || 90);

    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            toast.success('Đã cập nhật chỉ số cơ thể!');
            setSaving(false);
            onClose();
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-blue-500" /> Nhập liệu hôm nay
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputGroup label="Cân nặng (kg)" value={weight} onChange={setWeight} type="number" />
                    <InputGroup label="Mỡ cơ thể (%)" value={bodyFat} onChange={setBodyFat} type="number" />
                </div>

                <div className="pt-4 border-t border-white/5">
                    <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Số đo 3 vòng (cm)</h5>
                    <div className="grid grid-cols-3 gap-3">
                        <InputGroup label="Ngực" value={chest} onChange={setChest} type="number" />
                        <InputGroup label="Eo" value={waist} onChange={setWaist} type="number" />
                        <InputGroup label="Mông" value={hips} onChange={setHips} type="number" />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Đang lưu...' : 'Lưu & Đóng'}
                </button>
            </div>
            <p className="text-xs text-neutral-500 italic text-center">* Dữ liệu này sẽ được đồng bộ vào Hồ sơ sức khỏe.</p>
        </div>
    );
}

function SleepRecoveryContent({ onClose }: { onClose: () => void }) {
    const [hours, setHours] = useState(7);
    const [quality, setQuality] = useState('Khá');

    return (
        <div className="space-y-6">
            <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Moon size={18} className="text-purple-500" /> Nhật ký giấc ngủ
                </h4>
                <div className="space-y-4">
                    <InputGroup label="Thời gian ngủ (giờ)" value={hours} onChange={setHours} type="number" />
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 ml-1 mb-2">Chất lượng</label>
                        <div className="flex gap-2">
                            {['Tệ', 'Khá', 'Tốt', 'Tuyệt vời'].map(q => (
                                <button
                                    key={q}
                                    onClick={() => setQuality(q)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${quality === q ? 'bg-purple-600 border-purple-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={() => { toast.success('Đã lưu nhật ký!'); onClose(); }} className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all active:scale-95">
                    Lưu Nhật Ký
                </button>
            </div>
        </div>
    );
}

function MentalHealthContent() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div onClick={() => toast.success('Đang phát: Focus Flow')} className="p-4 bg-neutral-800/50 border border-white/5 rounded-2xl cursor-pointer hover:bg-neutral-800">
                    <Brain className="text-blue-500 mb-2" size={24} />
                    <h4 className="text-white font-bold text-sm">Nhạc tập trung</h4>
                </div>
                <div onClick={() => toast.success('Đang phát: Hype Music')} className="p-4 bg-neutral-800/50 border border-white/5 rounded-2xl cursor-pointer hover:bg-neutral-800">
                    <Zap className="text-red-500 mb-2" size={24} />
                    <h4 className="text-white font-bold text-sm">Nhạc năng lượng</h4>
                </div>
            </div>
        </div>
    );
}

function TechniqueContent() {
    return (
        <div className="space-y-3">
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-neutral-800" onClick={() => toast.info('Mở video: Squat Tutorial')}>
                <Play size={20} className="text-amber-500" />
                <span className="text-white font-bold text-sm">Hướng dẫn Squat</span>
            </div>
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-neutral-800" onClick={() => toast.info('Mở video: Bench Press')}>
                <Play size={20} className="text-amber-500" />
                <span className="text-white font-bold text-sm">Hướng dẫn Bench Press</span>
            </div>
        </div>
    );
}

function NutritionTipsContent() {
    return (
        <div className="space-y-4">
            <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-2xl">
                <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2"><AlertCircle size={16} /> Quy tắc 80/20</h4>
                <p className="text-sm text-green-100/80">80% thực phẩm lành mạnh, 20% thực phẩm tự thưởng để duy trì lâu dài.</p>
            </div>
        </div>
    );
}

function InjuryPreventionContent() {
    return (
        <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-2xl">
            <h4 className="font-bold text-red-400 mb-2">Phương pháp R.I.C.E</h4>
            <p className="text-sm text-red-100/80">Nghỉ ngơi - Chườm lạnh - Băng ép - Nâng cao</p>
        </div>
    );
}

function InputGroup({ label, value, onChange, type = 'text' }: { label: string, value: any, onChange: (v: any) => void, type?: string }) {
    return (
        <div>
            <label className="block text-xs font-bold text-neutral-500 ml-1 mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
    )
}
