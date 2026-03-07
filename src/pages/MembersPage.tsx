import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemberStore, type Member } from '../store/useMemberStore';
import { usePTStore } from '../store/usePTStore';
import { useAuth } from '../hooks/useAuth';
import {
    UserCheck,
    MagnifyingGlass,
    CaretLeft,
    CaretRight,
    CheckCircle,
    ListChecks,
    ArrowLineDown,
    Plus,
    Clock,
    User,
    Lightning,
    WarningCircle
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { isSameDay } from 'date-fns';
import { MemberAutomationDashboard } from '../components/MemberAutomationPanel';
import { IntelligenceConsole } from '../components/IntelligenceConsole';
import {
    MemberOverviewCharts,
    MemberAnalytics
} from '../components/MemberAdvancedComponents';
import { MemberHealthDashboard } from '../components/MemberHealthTracking';

// --- UTILS ---
import { translateStatus, getMemberRank, isLowSessions } from '../utils/gymUtils';
import { WORKOUT_PLANS } from '../constants/workoutPlans';
import { MEAL_PLANS } from '../data/mealPlans';

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } } as any;

// ─────────────────────────────────────────────────────────────
//  Premium Components
// ─────────────────────────────────────────────────────────────

function HubMetric({ label, value, sub, color, icon: Icon }: { label: string, value: string | number, sub: string, color: string, icon: any }) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-4 rounded-[24px] relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={32} weight="fill" color={color} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] mb-1.5 opacity-40">{label}</p>
            <p className="text-[30px] font-black leading-none tabular-nums text-white">{value}</p>
            <p className="text-[11px] font-bold mt-2 opacity-60" style={{ color }}>{sub}</p>
        </motion.div>
    );
}

function MemberRow({ member, selected, onSelect, onAction, onCheckInToggle }: any) {
    const rank = getMemberRank(member.sessionsUsed);
    const percentage = Math.min(100, (member.sessionsUsed / (member.sessionsTotal || 1)) * 100);
    const isCheckedInToday = !!(member.lastCheckIn && isSameDay(new Date(member.lastCheckIn), new Date()));

    return (
        <motion.div
            layout
            variants={fadeUp}
            className={`superapp-card-glass group relative overflow-hidden mb-3 rounded-[24px] ${selected ? 'ring-2 ring-blue-500/50' : ''}`}
        >
            <div className="p-4 flex items-center gap-4">
                <div className="relative" onClick={onSelect}>
                    <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2C2C2E&color=fff&size=128`}
                        className="w-14 h-14 rounded-[20px] object-cover"
                        alt={member.name}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-[#1C1C1E] ${member.status === 'Active' ? 'bg-[#30D158]' : 'bg-[#FF453A]'}`} />
                </div>

                <div className="flex-1 min-w-0" onClick={onSelect}>
                    <h3 className="text-[16px] font-black text-white/95 leading-tight truncate">{member.name}</h3>
                    <p className="text-[11px] text-white/40 mt-0.5 font-bold mb-2 uppercase tracking-wide">{member.phone}</p>
                    <div className="flex gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${rank.color} bg-opacity-10 border border-current`}>{rank.label}</span>
                        {member.assignedPT && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">{member.assignedPT}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onCheckInToggle(); }}
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${isCheckedInToday ? 'bg-green-500 text-white' : 'bg-white/5 border border-white/10 text-white/40'}`}
                    >
                        {isCheckedInToday ? <CheckCircle size={24} weight="fill" /> : <Lightning size={20} weight="fill" />}
                    </motion.button>
                    <button onClick={() => onAction('plan')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <ListChecks size={20} weight="bold" className="text-white/40" />
                    </button>
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full rounded-full"
                        style={{ background: percentage > 85 ? '#FF453A' : '#30D158' }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{member.sessionsUsed} / {member.sessionsTotal} BUỔI</span>
                    <span className="text-[9px] font-black text-white/40 uppercase tabular-nums">{Math.round(percentage)}%</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function MembersPage() {
    const [searchParams] = useSearchParams();
    const ptFilter = searchParams.get('pt') || '';
    const { user } = useAuth();
    const {
        members, addMember, updateMember,
        performCheckIn, performCheckOut, setMemberWorkoutPlan,
        setMemberMealPlan, setMemberGoalTargets, addMemberBodyMetric
    } = useMemberStore();
    const { pts } = usePTStore();

    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'automation' | 'health'>('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [planMember, setPlanMember] = useState<Member | null>(null);
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());

    const safeMembers = useMemo(() => {
        let list = (members || []).filter(m => !!m);
        if (user?.role === 'pt' && user?.ptName) {
            list = list.filter(m => (m.assignedPT || '') === user.ptName);
        }
        return list;
    }, [members, user?.role, user?.ptName]);

    const stats = useMemo(() => ({
        active: safeMembers.filter(m => m.status === 'Active').length,
        expired: safeMembers.filter(m => m.status === 'Expired').length,
        low: safeMembers.filter(m => m.status === 'Active' && isLowSessions(m.sessionsTotal, m.sessionsUsed)).length,
        total: safeMembers.length
    }), [safeMembers]);

    const filteredMembers = useMemo(() => {
        return safeMembers.filter(m => {
            const sTerm = searchTerm.toLowerCase();
            const matchesSearch = (m.name || '').toLowerCase().includes(sTerm) || (m.phone || '').includes(sTerm);
            let statusMatch = true;
            if (filterStatus === 'LowSessions') {
                statusMatch = m.status === 'Active' && isLowSessions(m.sessionsTotal, m.sessionsUsed);
            } else if (filterStatus !== 'All') {
                statusMatch = (m.status || '').toLowerCase() === filterStatus.toLowerCase();
            }
            return matchesSearch && statusMatch && (!ptFilter || m.assignedPT === ptFilter);
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [safeMembers, searchTerm, filterStatus, ptFilter]);

    const paginated = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Phone', 'Membership', 'Sessions', 'Expiry'];
        const csv = [headers.join(','), ...filteredMembers.map(m => [m.id, m.name, m.phone, m.membershipType, `${m.sessionsUsed}/${m.sessionsTotal}`, m.expiryDate].join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'members.csv';
        a.click();
        toast.success('Đã xuất file');
    };

    return (
        <div className="min-h-full pb-20 px-4 pt-4" style={{ maxWidth: 430, margin: '0 auto' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[28px] font-black text-white tracking-tighter leading-none">Hội viên</h1>
                    <p className="text-[12px] font-bold text-white/30 uppercase mt-1 tracking-widest">{stats.active} ĐANG HOẠT ĐỘNG</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportCSV} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <ArrowLineDown size={20} weight="bold" className="text-white/60" />
                    </button>
                    <button onClick={() => setIsAddMemberModalOpen(true)} className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(10,132,255,0.4)]">
                        <Plus size={20} weight="bold" className="text-white" />
                    </button>
                </div>
            </div>

            {/* Segmented */}
            <div className="apple-segmented mb-6">
                {['members', 'overview', 'automation', 'health'].map(id => (
                    <button key={id} onClick={() => setActiveTab(id as any)} className={`apple-segmented__item ${activeTab === id ? 'apple-segmented__item--active' : ''}`}>
                        {id === 'members' ? 'D.Sách' : id === 'overview' ? 'S.Liệu' : id === 'automation' ? 'AI' : 'S.Trắc'}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'members' && (
                    <motion.div key="members" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                        <div className="apple-search-bar mb-4">
                            <MagnifyingGlass size={18} className="text-white/20" />
                            <input placeholder="Tên hoặc số điện thoại..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
                            {['All', 'Active', 'LowSessions', 'Expired'].map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-full text-[12px] font-bold tracking-wide uppercase transition-all ${filterStatus === s ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                                    {s === 'All' ? 'Tất cả' : s === 'LowSessions' ? 'Sắp hết' : translateStatus(s)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-0">
                            {paginated.map((m) => (
                                <MemberRow
                                    key={m.id}
                                    member={m}
                                    selected={selectedMemberIds.has(m.id)}
                                    onSelect={() => {
                                        const next = new Set(selectedMemberIds);
                                        if (next.has(m.id)) next.delete(m.id); else next.add(m.id);
                                        setSelectedMemberIds(next);
                                        setSelectedMember(m);
                                    }}
                                    onAction={(action: string) => {
                                        setSelectedMember(m);
                                        if (action === 'edit') setIsEditModalOpen(true);
                                        if (action === 'plan') setPlanMember(m);
                                    }}
                                    onCheckInToggle={() => {
                                        const checkedInToday = !!(m.lastCheckIn && isSameDay(new Date(m.lastCheckIn), new Date()));
                                        if (checkedInToday) performCheckOut(m.id); else performCheckIn(m.id);
                                        toast.success(checkedInToday ? 'Check-out' : 'Check-in');
                                    }}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-6 mt-6">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-20"><CaretLeft size={20} weight="bold" /></button>
                                <span className="text-[13px] font-black text-white/40 uppercase tracking-widest">{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-20"><CaretRight size={20} weight="bold" /></button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <HubMetric label="Hoạt động" value={stats.active} sub="Tăng 12% tháng này" color="#30D158" icon={UserCheck} />
                            <HubMetric label="Sắp hết" value={stats.low} sub="Cần gia hạn gấp" color="#FFD60A" icon={Clock} />
                            <HubMetric label="Hết hạn" value={stats.expired} sub="Giữ chân ngay" color="#FF453A" icon={WarningCircle} />
                            <HubMetric label="Tổng số" value={stats.total} sub="Thành viên hệ thống" color="#0A84FF" icon={User} />
                        </div>
                        <div className="superapp-card-glass p-5 rounded-[24px]">
                            <p className="text-[11px] font-black uppercase text-white/30 tracking-widest mb-4">Tăng trưởng hội viên</p>
                            <MemberOverviewCharts />
                        </div>
                        <div className="superapp-card-glass p-5 rounded-[24px]">
                            <p className="text-[11px] font-black uppercase text-white/30 tracking-widest mb-4">Báo cáo chi tiết</p>
                            <MemberAnalytics />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'automation' && (
                    <motion.div key="automation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <MemberAutomationDashboard />
                        <IntelligenceConsole />
                    </motion.div>
                )}

                {activeTab === 'health' && (
                    <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <MemberHealthDashboard initialMember={selectedMember} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(isAddMemberModalOpen || isEditModalOpen) && (
                    <MemberFormModal
                        member={isEditModalOpen ? selectedMember : null}
                        pts={pts}
                        onClose={() => { setIsAddMemberModalOpen(false); setIsEditModalOpen(false); }}
                        onSave={(data: any) => {
                            if (isEditModalOpen && selectedMember) updateMember(selectedMember.id, data); else addMember(data);
                            setIsAddMemberModalOpen(false); setIsEditModalOpen(false);
                            toast.success('Đã lưu');
                        }}
                    />
                )}
                {planMember && (
                    <MemberPlanModal
                        member={planMember}
                        onClose={() => setPlanMember(null)}
                        setMemberWorkoutPlan={setMemberWorkoutPlan}
                        setMemberMealPlan={setMemberMealPlan}
                        setMemberGoalTargets={setMemberGoalTargets}
                        addMemberBodyMetric={addMemberBodyMetric}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  Form & Plan Modals
// ─────────────────────────────────────────────────────────────

function MemberFormModal({ member, onClose, onSave }: any) {
    const [formData, setFormData] = useState(member || { name: '', phone: '', status: 'Active', membershipType: 'Gói 3 Tháng' });
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="w-full max-w-md bg-[#1C1C1E] rounded-t-[32px] overflow-hidden p-6" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
                <h2 className="text-[24px] font-black text-white mb-6 tracking-tight">{member ? 'Sửa thông tin' : 'Hội viên mới'}</h2>
                <div className="space-y-4 mb-8">
                    <input className="apple-input bg-white/5" placeholder="Họ và tên" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input className="apple-input bg-white/5" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <select className="apple-input bg-white/5" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="Active">Đang hoạt động</option>
                        <option value="Expired">Hết hạn</option>
                    </select>
                </div>
                <button onClick={() => onSave(formData)} className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(10,132,255,0.3)]">Lưu thay đổi</button>
            </motion.div>
        </motion.div>
    );
}

function MemberPlanModal({ member, onClose, setMemberWorkoutPlan, setMemberMealPlan, setMemberGoalTargets }: any) {
    const [tab, setTab] = useState('workout');
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="w-full max-w-md bg-[#1C1C1E] rounded-t-[32px] overflow-hidden p-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4" />
                <div className="flex gap-2 mb-6">
                    {['workout', 'meal', 'goals'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wide ${tab === t ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-white/40'}`}>
                            {t === 'workout' ? 'Tập' : t === 'meal' ? 'Ăn' : 'Mục tiêu'}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto px-2">
                    {tab === 'workout' && (
                        <div className="space-y-4">
                            {WORKOUT_PLANS.map(p => (
                                <button key={p.id} onClick={() => { setMemberWorkoutPlan(member.id, p.id); toast.success('Đã giao'); }} className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${member.assignedWorkoutPlanId === p.id ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-white/5 border border-white/5'}`}>
                                    <span className={`font-bold ${member.assignedWorkoutPlanId === p.id ? 'text-blue-400' : 'text-white/80'}`}>{p.name}</span>
                                    {member.assignedWorkoutPlanId === p.id && <CheckCircle size={20} weight="fill" className="text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                    {tab === 'meal' && (
                        <div className="space-y-4 pb-10">
                            {MEAL_PLANS.map(m => (
                                <button key={m.id} onClick={() => { setMemberMealPlan(member.id, m as any); toast.success('Đã giao'); }} className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 items-start text-left">
                                    <span className="font-bold text-white/80">{m.name}</span>
                                    <span className="text-[11px] text-white/40 uppercase font-black">{m.totalCalories} CAL / {m.protein}G P</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {tab === 'goals' && (
                        <div className="space-y-4 pb-10">
                            <input className="apple-input bg-white/5" placeholder="Ghi chú mục tiêu" onChange={e => setMemberGoalTargets(member.id, { note: e.target.value })} />
                            <button onClick={onClose} className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold">Xong</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
