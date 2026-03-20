import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePTStore, type PT } from '../store/usePTStore';
import { useMemberStore } from '../store/useMemberStore';
import {
    Users,
    UserCheck,
    MagnifyingGlass,
    CaretRight,
    Plus,
    Star,
    Barbell,
    Phone,
    DotsThree,
    Trash,
    UserCirclePlus
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

function IOSStatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-4 rounded-[24px] flex flex-col gap-3"
        >
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={20} weight="fill" style={{ color }} />
            </div>
            <div>
                <div className="text-[26px] font-black text-white tabular-nums leading-none tracking-tighter">{value}</div>
                <div className="text-[10px] font-black uppercase mt-1.5 opacity-40 tracking-widest">{label}</div>
            </div>
        </motion.div>
    );
}

export default function PTsPage() {
    const { pts, deletePT } = usePTStore();
    const { members } = useMemberStore();

    const [activeTab, setActiveTab] = useState<'list' | 'overview'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPTIds, setSelectedPTIds] = useState<Set<string>>(new Set());

    const safePTs = useMemo(() => (pts || []).filter((p) => !!p), [pts]);

    const memberCountByPT = useMemo(() => {
        const map: Record<string, number> = {};
        (members || []).forEach((m) => {
            const ptName = (m as any).assignedPT;
            if (ptName) {
                const pt = safePTs.find((p) => p.name === ptName);
                if (pt) map[pt.id] = (map[pt.id] || 0) + 1;
            }
        });
        return map;
    }, [members, safePTs]);

    const activePTsCount = safePTs.filter((p) => p.status === 'Active').length;

    const filteredPTs = useMemo(() => {
        return safePTs.filter((p) => {
            return (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.phone || '').includes(searchTerm) ||
                (p.specialty?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [safePTs, searchTerm]);

    const handleBulkDelete = () => {
        if (window.confirm(`Xóa ${selectedPTIds.size} PT đã chọn?`)) {
            selectedPTIds.forEach((id) => deletePT(id));
            setSelectedPTIds(new Set());
            toast.success('Đã xóa thành công');
        }
    };

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="ios-animate-in superapp-page pt-4 pb-20"
        >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[32px] font-black tracking-tighter text-white">Đội Ngũ HLV</h1>
                    <p className="text-[13px] font-medium opacity-40">Đội ngũ Huấn Luyện Viên chuyên nghiệp</p>
                </div>
                <div className="flex gap-2">
                    {selectedPTIds.size > 0 ? (
                        <button onClick={handleBulkDelete} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 active:scale-90 transition-transform">
                            <Trash size={24} weight="fill" />
                        </button>
                    ) : (
                        <button className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E8613A] text-white shadow-[0_8px_20px_rgba(232,97,58,0.3)] active:scale-90 transition-transform">
                            <Plus size={24} weight="bold" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ── SEGMENTED CONTROL ── */}
            <motion.div variants={fadeUp} className="flex p-1 rounded-[16px] bg-white/5 border border-white/5 mb-6">
                {['list', 'overview'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2.5 rounded-[12px] text-[13px] font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-white/30'
                            }`}
                    >
                        {tab === 'list' ? 'Danh sách' : 'Tổng quan'}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                    <motion.div key="overview" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: 10 }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <IOSStatCard label="Tổng Huấn Luyện" value={safePTs.length} icon={Users} color="#0A84FF" />
                            <IOSStatCard label="Đang trực" value={activePTsCount} icon={UserCheck} color="#30D158" />
                            <IOSStatCard label="Hội viên PT" value={Object.values(memberCountByPT).reduce((a, b) => a + b, 0)} icon={Barbell} color="#BF5AF2" />
                            <IOSStatCard label="Đánh giá TB" value="4.9" icon={Star} color="#FF9F0A" />
                        </div>

                        <section className="mt-6">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 px-1">Xếp hạng hiệu suất</p>
                            <div className="space-y-2">
                                {safePTs
                                    .map((p) => ({ p, count: memberCountByPT[p.id] || 0 }))
                                    .sort((a, b) => b.count - a.count)
                                    .map(({ p, count }) => (
                                        <div key={p.id} className="superapp-card-glass p-4 rounded-[20px] flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=2C2C2E&color=fff`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[14px] font-bold text-white/90">{p.name}</p>
                                                <div className="h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (count / 20) * 100)}%` }}
                                                        className="h-full bg-[#0A84FF]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[14px] font-black text-white">{count}</p>
                                                <p className="text-[10px] font-black uppercase opacity-30 mt-0.5">HV</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <motion.div key="list" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: 10 }} className="space-y-4">
                        {/* ── SEARCH ── */}
                        <div className="relative">
                            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                                placeholder="Tìm huấn luyện viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 rounded-[20px] bg-white/5 border border-white/5 text-[15px] text-white focus:outline-none focus:border-[#E8613A]/30 transition-colors"
                            />
                        </div>

                        {/* ── PT CARDS ── */}
                        <div className="space-y-3">
                            {filteredPTs.map((pt, idx) => (
                                <motion.div
                                    key={pt.id}
                                    variants={fadeUp}
                                    onClick={() => {
                                        const next = new Set(selectedPTIds);
                                        if (next.has(pt.id)) next.delete(pt.id);
                                        else next.add(pt.id);
                                        setSelectedPTIds(next);
                                    }}
                                    className={`superapp-card-glass p-5 rounded-[28px] relative overflow-hidden transition-all ${selectedPTIds.has(pt.id) ? 'ring-1 ring-[#E8613A] border-transparent' : ''
                                        }`}
                                >
                                    {selectedPTIds.has(pt.id) && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8613A] opacity-10 blur-[30px]" />
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-[22px] overflow-hidden p-0.5 bg-gradient-to-br from-white/10 to-transparent">
                                                <img
                                                    src={pt.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pt.name)}&background=2C2C2E&color=fff&size=128`}
                                                    alt="" className="w-full h-full rounded-[20px] object-cover"
                                                />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-[#1C1C1E] flex items-center justify-center ${pt.status === 'Active' ? 'bg-[#30D158]' : 'bg-[#FF453A]'}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[18px] font-black tracking-tighter text-white">{pt.name}</h3>
                                                {pt.rating && (
                                                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                                                        <Star size={10} weight="fill" className="text-amber-400" />
                                                        <span className="text-[10px] font-black text-amber-400">{pt.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {(pt.specialty || []).map((s) => (
                                                    <span key={s} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 text-white/40 border border-white/5">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 active:scale-90 transition-transform">
                                            <DotsThree size={24} weight="bold" className="text-white/40" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-white/5">
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                                            <Phone size={14} weight="fill" className="text-[#0A84FF]" />
                                            <span className="text-[11px] font-bold text-white/50">{pt.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                                            <Barbell size={14} weight="fill" className="text-[#BF5AF2]" />
                                            <span className="text-[11px] font-bold text-white/50">{memberCountByPT[pt.id] || 0} Hội viên</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <Link to={`/members?pt=${encodeURIComponent(pt.name)}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                                            <button className="w-full py-2.5 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/30 text-[#0A84FF] text-[11px] font-black uppercase tracking-wider active:scale-95 transition-transform">
                                                Danh sách hội viên
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
