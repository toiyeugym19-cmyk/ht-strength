import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pulse, Moon, Book, Brain, Shield,
    CaretRight, Lightning, AppleLogo,
    Play,
    Plus, Sparkle, User
} from '@phosphor-icons/react';
import { toast } from 'sonner';

/**
 * HEALTH HUB & ECOSYSTEM - THE PREMIUM VERSION
 */

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } } as any;

type TabType = 'tracking' | 'knowledge' | 'care';

interface FeatureModule {
    id: string;
    icon: any;
    color: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    tab: TabType;
}

const HEALTH_MODULES: FeatureModule[] = [
    {
        id: 'body-stats',
        icon: Pulse,
        color: '#0A84FF',
        title: 'Chỉ Số Cơ Thể',
        subtitle: 'Cập nhật sinh trắc',
        description: 'Theo dõi sự thay đổi của cơ thể qua từng giai đoạn một cách khoa học.',
        features: ['Cân nặng & BMI', 'Tỉ lệ mỡ %', 'Số đo các vòng'],
        tab: 'tracking'
    },
    {
        id: 'sleep-recovery',
        icon: Moon,
        color: '#BF5AF2',
        title: 'Giấc Ngủ',
        subtitle: 'Tối ưu phục hồi',
        description: 'Theo dõi và đánh giá chất lượng nghỉ ngơi để đạt hiệu suất cao nhất.',
        features: ['Thời lượng ngủ', 'Đánh giá sâu', 'Mẹo ngủ ngon'],
        tab: 'care'
    },
    {
        id: 'technique-library',
        icon: Book,
        color: '#FF9F0A',
        title: 'Thư Viện Kỹ Thuật',
        subtitle: 'Kiến thức tập luyện',
        description: 'Học cách thực hiện các bài tập chuẩn form để tối đa hóa kết quả.',
        features: ['Video hướng dẫn', 'Lỗi sai thường gặp', 'Tempo tập luyện'],
        tab: 'knowledge'
    },
    {
        id: 'mental-health',
        icon: Brain,
        color: '#FF375F',
        title: 'Tâm Trí',
        subtitle: 'Mindset & Focus',
        description: 'Duy trì trạng thái tinh thần tốt nhất để vượt qua giới hạn.',
        features: ['Zen Mode', 'Focus Music', 'Quotes động lực'],
        tab: 'care'
    },
    {
        id: 'nutrition-tips',
        icon: AppleLogo,
        color: '#30D158',
        title: 'Dinh Dưỡng',
        subtitle: 'Ăn để chiến thắng',
        description: 'Nền tảng thực hiện hóa ước mơ hình thể lý tưởng.',
        features: ['Cách tính Macro', 'Mẫu thực đơn AI', 'Hydration Pro'],
        tab: 'knowledge'
    },
    {
        id: 'injury-prevention',
        icon: Shield,
        color: '#FF453A',
        title: 'An Toàn',
        subtitle: 'Phòng tránh chấn thương',
        description: 'Luôn bảo vệ bản thân trước những rủi ro khi tập nặng.',
        features: ['Warm-up Routine', 'Giãn cơ Mobility', 'Sơ cứu R.I.C.E'],
        tab: 'care'
    }
];

export default function EcosystemPage() {
    const [activeTab, setActiveTab] = useState<TabType>('tracking');
    const [selectedModule, setSelectedModule] = useState<FeatureModule | null>(null);

    const filtered = HEALTH_MODULES.filter(m => m.tab === activeTab);

    return (
        <div className="min-h-full pb-32 px-4 pt-4 ios-animate-in" style={{ maxWidth: 430, margin: '0 auto' }}>
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#30D158]">Mibro Fit Ecosystem</p>
                </div>
                <h1 className="text-[32px] font-black text-white tracking-tighter leading-none mb-2">Hệ sinh thái</h1>
                <p className="text-[13px] font-medium text-white/30 leading-snug">Tối ưu hóa hành trình sức khỏe và phong cách sống của bạn.</p>
            </header>

            {/* Premium Tabs */}
            <div className="apple-segmented mb-8">
                {(['tracking', 'care', 'knowledge'] as const).map(id => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`apple-segmented__item ${activeTab === id ? 'apple-segmented__item--active' : ''}`}
                    >
                        {id === 'tracking' ? 'Nạp data' : id === 'care' ? 'Chăm sóc' : 'Kiến thức'}
                    </button>
                ))}
            </div>

            {/* Modules Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                    className="grid grid-cols-1 gap-4"
                >
                    {filtered.map((module) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            onClick={() => setSelectedModule(module)}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Detail Sheet */}
            <AnimatePresence>
                {selectedModule && (
                    <div className="fixed inset-0 z-[500] flex items-end justify-center px-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setSelectedModule(null)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-[#1C1C1E] rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

                            <div className="flex items-start gap-5 mb-8">
                                <div className="p-4 rounded-[22px] bg-white/5 border border-white/10 shadow-2xl">
                                    <selectedModule.icon size={32} weight="fill" style={{ color: selectedModule.color }} />
                                </div>
                                <div>
                                    <h3 className="text-[24px] font-black text-white leading-tight tracking-tight">{selectedModule.title}</h3>
                                    <p className="text-[13px] font-bold mt-1 uppercase tracking-widest" style={{ color: selectedModule.color }}>{selectedModule.subtitle}</p>
                                </div>
                            </div>

                            <div className="space-y-6 pb-12">
                                <div className="p-5 rounded-[24px] bg-white/5 border border-white/5">
                                    <p className="text-[14px] leading-relaxed text-white/70 italic">&ldquo;{selectedModule.description}&rdquo;</p>
                                </div>

                                <ModuleContent moduleId={selectedModule.id} color={selectedModule.color} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ModuleCard({ module, onClick }: { module: FeatureModule, onClick: () => void }) {
    return (
        <motion.div
            variants={fadeUp}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="superapp-card-glass p-5 rounded-[28px] flex items-center gap-5 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <module.icon size={64} weight="fill" style={{ color: module.color }} />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 relative z-10">
                <module.icon size={24} weight="fill" style={{ color: module.color }} />
            </div>

            <div className="flex-1 relative z-10">
                <h3 className="text-[17px] font-black text-white/90 leading-tight">{module.title}</h3>
                <p className="text-[11px] font-bold opacity-30 uppercase tracking-widest mt-1">{module.subtitle}</p>
            </div>

            <CaretRight size={18} weight="bold" className="text-white/20 relative z-10" />
        </motion.div>
    );
}

function ModuleContent({ moduleId, color }: { moduleId: string, color: string }) {
    switch (moduleId) {
        case 'body-stats': return <StatsForm color={color} />;
        case 'sleep-recovery': return <SleepForm color={color} />;
        case 'mental-health': return <MentalBox color={color} />;
        case 'technique-library': return <LibraryBox color={color} />;
        default: return (
            <div className="py-10 text-center opacity-30">
                <Sparkle size={48} weight="fill" className="mx-auto mb-4" style={{ color }} />
                <p className="text-[13px] font-bold uppercase tracking-widest">Đang cập nhật...</p>
            </div>
        );
    }
}

// --- FORMS ---

function StatsForm({ color }: { color: string }) {
    const handleSave = () => {
        toast.success('Đã lưu chỉ số cơ thể');
    };
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/30 ml-1">Cân nặng (kg)</label>
                    <input className="apple-input bg-white/5" placeholder="70.0" type="number" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/30 ml-1">Body Fat (%)</label>
                    <input className="apple-input bg-white/5" placeholder="15.0" type="number" />
                </div>
            </div>
            <button
                onClick={handleSave}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl mt-4 active:scale-95 transition-transform"
                style={{ backgroundColor: color }}
            >
                Lưu chỉ số
            </button>
        </div>
    );
}

function SleepForm({ color }: { color: string }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 ml-1">Thời gian ngủ</label>
                <input className="apple-input bg-white/5" placeholder="8.0" type="number" />
            </div>
            <div className="flex gap-2">
                {['Tệ', 'Ổn', 'Tốt', 'Cực tốt'].map(v => (
                    <button key={v} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-[12px] font-bold text-white/60 hover:text-white transition-colors">{v}</button>
                ))}
            </div>
            <button
                onClick={() => toast.success('Đã ghi nhật ký giấc ngủ')}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white mt-4 active:scale-95 transition-transform"
                style={{ backgroundColor: color }}
            >
                Ghi nhật ký
            </button>
        </div>
    );
}

function MentalBox({ color }: { color: string }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: 'Deep Focus', icon: Brain },
                { label: 'Work Hard', icon: Lightning },
                { label: 'Zen Calm', icon: Sparkle },
                { label: 'Fast Recovery', icon: Pulse }
            ].map(m => (
                <button
                    key={m.label}
                    onClick={() => toast.info(`Đã kích hoạt: ${m.label}`)}
                    className="p-4 rounded-[22px] bg-white/5 border border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-transform"
                >
                    <m.icon size={24} weight="fill" style={{ color }} />
                    <span className="text-[12px] font-bold text-white/70">{m.label}</span>
                </button>
            ))}
        </div>
    );
}

function LibraryBox({ color }: { color: string }) {
    return (
        <div className="space-y-3">
            {['Squat Cơ Bản', 'Bench Press Form', 'Deadlift Chuẩn'].map(t => (
                <div
                    key={t}
                    onClick={() => toast.info(`Mở video: ${t}`)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-3">
                        <Play size={20} weight="fill" style={{ color }} />
                        <span className="text-[14px] font-bold text-white/80">{t}</span>
                    </div>
                    <CaretRight size={16} weight="bold" className="text-white/20" />
                </div>
            ))}
        </div>
    );
}
