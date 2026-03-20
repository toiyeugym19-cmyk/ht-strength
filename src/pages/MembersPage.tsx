import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
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
    WarningCircle,
    DotsThreeOutlineVertical,
    TrendUp
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

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger: Variants = {
    show: { transition: { staggerChildren: 0.08 } }
};

// ─────────────────────────────────────────────────────────────
//  Premium Components
// ─────────────────────────────────────────────────────────────

function HubMetric({ label, value, sub, color, icon: Icon }: { label: string, value: string | number, sub: string, color: string, icon: any }) {
    return (
        <motion.div
            variants={fadeUp}
            whileTap={{ scale: 0.96 }}
            className="superapp-card-glass p-5 rounded-[32px] relative overflow-hidden group border border-white/5"
        >
            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700">
                <Icon size={80} weight="fill" color={color} />
            </div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shadow-inner" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={20} weight="fill" color={color} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-40">{label}</p>
            <p className="text-[32px] font-black leading-none tabular-nums text-white tracking-tighter">{value}</p>
            <p className="text-[11px] font-bold mt-2 opacity-60 flex items-center gap-1">
                <TrendUp size={12} weight="bold" />
                {sub}
            </p>
        </motion.div>
    );
}

function MemberCard({ member, selected, onSelect, onAction, onCheckInToggle }: any) {
    const rank = getMemberRank(member.sessionsUsed);
    const percentage = Math.min(100, (member.sessionsUsed / (member.sessionsTotal || 1)) * 100);
    const isCheckedInToday = !!(member.lastCheckIn && isSameDay(new Date(member.lastCheckIn), new Date()));

    return (
        <motion.div
            layout
            variants={fadeUp}
            className={`superapp-card-glass group relative overflow-hidden mb-4 rounded-[36px] border border-white/5 shadow-xl transition-all ${selected ? 'ring-2 ring-blue-500/40 bg-blue-500/5' : ''}`}
        >
            <div className="p-5 flex items-center gap-4">
                <div className="relative flex-shrink-0" onClick={onSelect}>
                    <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2C2C2E&color=fff&size=200`}
                        className="w-16 h-16 rounded-[24px] object-cover shadow-2xl transition-transform group-hover:scale-105 duration-500"
                        alt={member.name}
                    />
                    <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-[4px] border-[#1C1C1E] shadow-lg ${member.status === 'Active' ? 'bg-[#30D158]' : 'bg-[#FF453A]'} flex items-center justify-center`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                    </div>
                </div>

                <div className="flex-1 min-w-0" onClick={onSelect}>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[17px] font-black text-white leading-tight truncate tracking-tight">{member.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${rank.color} bg-opacity-10 border border-current tracking-widest`}>{rank.label}</span>
                        <p className="text-[11px] text-white/30 font-black tracking-widest uppercase">{member.phone}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => { e.stopPropagation(); onCheckInToggle(); }}
                        className={`w-12 h-12 rounded-[22px] flex flex-col items-center justify-center transition-all ${isCheckedInToday ? 'bg-[#30D158] text-white shadow-[0_8px_20px_rgba(48,209,88,0.4)]' : 'bg-white/5 border border-white/5 text-white/20 hover:text-white/60'}`}
                    >
                        {isCheckedInToday ? <CheckCircle size={24} weight="fill" /> : <Lightning size={22} weight="fill" />}
                    </motion.button>
                    <button onClick={() => onAction('plan')} className="w-12 h-12 rounded-[22px] bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ListChecks size={22} weight="bold" className="text-white/30" />
                    </button>
                </div>
            </div>

            <div className="px-6 pb-6 pt-1">
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full relative"
                        style={{
                            background: percentage > 85 ? 'linear-gradient(90deg, #FF453A 0%, #FF2D55 100%)' : 'linear-gradient(90deg, #30D158 0%, #34C759 100%)',
                            boxShadow: `0 0 10px ${percentage > 85 ? 'rgba(255,69,58,0.3)' : 'rgba(48,209,88,0.3)'}`
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                </div>
                <div className="flex justify-between mt-3 px-1">
                    <div className="flex items-center gap-2">
                        <Clock size={12} weight="bold" className="text-white/20" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{member.sessionsUsed} / {member.sessionsTotal} Buổi</span>
                    </div>
                    <span className={`text-[11px] font-black tabular-nums transition-colors ${percentage > 85 ? 'text-[#FF453A]' : 'text-[#30D158]'}`}>{Math.round(percentage)}% Đã dùng</span>
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
    const itemsPerPage = 8;

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
        toast.success('Đã xuất file báo cáo dữ liệu');
    };

    return (
        <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="ios-animate-in min-h-screen pb-40 pt-8 px-5 superapp-hero superapp-page"
            style={{ maxWidth: 430, margin: '0 auto' }}
        >
            {/* Header */}
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[34px] font-black text-white tracking-tighter leading-none superapp-text-gradient ios-title">Danh Bạ</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] shadow-[0_0_8px_#30D158]" />
                        <p className="text-[11px] font-black text-[#30D158] uppercase tracking-[0.25em]">{stats.active} Đang hoạt động</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExportCSV} className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                        <ArrowLineDown size={22} weight="bold" className="text-white/40" />
                    </button>
                    <button onClick={() => setIsAddMemberModalOpen(true)} className="w-12 h-12 rounded-[20px] bg-blue-500 flex items-center justify-center shadow-[0_12px_24px_rgba(10,132,255,0.4)] hover:brightness-110 active:scale-90 transition-all">
                        <Plus size={22} weight="bold" className="text-white" />
                    </button>
                </div>
            </motion.div>

            {/* Segmented Control */}
            <motion.div variants={fadeUp} className="superapp-card-glass p-1 rounded-[24px] mb-8 border border-white/5 flex gap-1">
                {['members', 'overview', 'automation', 'health'].map(id => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id as any)}
                        className={`flex-1 py-3 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
                    >
                        {id === 'members' ? 'Hồ sơ' : id === 'overview' ? 'Thống kê' : id === 'automation' ? 'Tự động' : 'Sức khỏe'}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'members' && (
                    <motion.div
                        key="members"
                        initial="hidden" animate="show" variants={stagger}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeUp} className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors">
                                <MagnifyingGlass size={20} weight="bold" />
                            </div>
                            <input
                                placeholder="Tìm theo tên hoặc số điện thoại..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full h-16 pl-14 pr-6 rounded-3xl bg-white/5 border border-white/5 text-[15px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all"
                            />
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {['All', 'Active', 'LowSessions', 'Expired'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`flex-shrink-0 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-lg ${filterStatus === s ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-white/5 text-white/30 border border-white/5 hover:bg-white/10'}`}
                                >
                                    {s === 'All' ? 'Tất cả' : s === 'LowSessions' ? 'Hết lượt' : translateStatus(s)}
                                </button>
                            ))}
                        </motion.div>

                        <div className="space-y-1">
                            {paginated.length > 0 ? (
                                paginated.map((m) => (
                                    <MemberCard
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
                                            toast.success(checkedInToday ? 'Đã check-out' : 'Đã check-in');
                                        }}
                                    />
                                ))
                            ) : (
                                <motion.div variants={fadeUp} className="py-20 flex flex-col items-center opacity-20">
                                    <MagnifyingGlass size={64} weight="light" />
                                    <p className="mt-4 font-black uppercase tracking-widest text-sm">Không tìm thấy hồ sơ</p>
                                </motion.div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <motion.div variants={fadeUp} className="flex items-center justify-center gap-8 mt-10">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center disabled:opacity-20 active:scale-90 transition-all"><CaretLeft size={22} weight="bold" /></button>
                                <div className="flex flex-col items-center">
                                    <span className="text-[14px] font-black text-white tracking-widest tabular-nums">{currentPage}</span>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">TRANG</span>
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center disabled:opacity-20 active:scale-90 transition-all"><CaretRight size={22} weight="bold" /></button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'overview' && (
                    <motion.div key="overview" initial="hidden" animate="show" variants={stagger} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <HubMetric label="Đang hoạt động" value={stats.active} sub="Ổn định" color="#30D158" icon={UserCheck} />
                            <HubMetric label="Cảnh báo" value={stats.low} sub="Sắp hết buổi" color="#FFD60A" icon={Clock} />
                            <HubMetric label="Hết hạn" value={stats.expired} sub="Ngừng hoạt động" color="#FF453A" icon={WarningCircle} />
                            <HubMetric label="Tổng cộng" value={stats.total} sub="Toàn hệ thống" color="#0A84FF" icon={User} />
                        </div>
                        <motion.div variants={fadeUp} className="superapp-card-glass p-8 rounded-[40px] border border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-[12px] font-black uppercase text-white/30 tracking-[0.3em]">Đường Tăng Trưởng</p>
                                <div className="p-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    <TrendUp size={16} weight="bold" className="text-blue-400" />
                                </div>
                            </div>
                            <MemberOverviewCharts />
                        </motion.div>
                        <motion.div variants={fadeUp} className="superapp-card-glass p-8 rounded-[40px] border border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-[12px] font-black uppercase text-white/30 tracking-[0.3em]">Phân Tích Nâng Cao</p>
                                <DotsThreeOutlineVertical size={20} weight="fill" className="text-white/20" />
                            </div>
                            <MemberAnalytics />
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === 'automation' && (
                    <motion.div key="automation" initial="hidden" animate="show" variants={stagger} className="space-y-6">
                        <MemberAutomationDashboard />
                        <IntelligenceConsole />
                    </motion.div>
                )}

                {activeTab === 'health' && (
                    <motion.div key="health" initial="hidden" animate="show" variants={stagger}>
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
                            toast.success('Hệ thống đã ghi nhận');
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
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
//  Premium Modals
// ─────────────────────────────────────────────────────────────

function MemberFormModal({ member, pts = [], onClose, onSave }: any) {
    const defaultData = {
        name: '',
        phone: '',
        status: 'Active',
        membershipType: '1 Month',
        assignedPT: '',
        sessionsTotal: 30,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    // Convert dates for inputs if editing existing member
    const initialData = member ? {
        ...member,
        startDate: member.startDate ? new Date(member.startDate).toISOString().split('T')[0] : defaultData.startDate,
        expiryDate: member.expiryDate ? new Date(member.expiryDate).toISOString().split('T')[0] : defaultData.expiryDate,
    } : defaultData;

    const [formData, setFormData] = useState<any>(initialData);

    const handleMembershipChange = (e: any) => {
        const type = e.target.value;
        let sessions = 30;
        let days = 30;
        
        switch (type) {
            case '1 Month': sessions = 30; days = 30; break;
            case '3 Months': sessions = 90; days = 90; break;
            case '6 Months': sessions = 180; days = 180; break;
            case '1 Year': sessions = 365; days = 365; break;
            case 'PT 12 Sessions': sessions = 12; days = 45; break;
            case 'PT 24 Sessions': sessions = 24; days = 90; break;
            case 'PT 36 Sessions': sessions = 36; days = 180; break;
        }
        
        // Recalculate expiry from current start date
        const currentStart = new Date(formData.startDate).getTime();
        const newExpiry = new Date(currentStart + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        setFormData({ 
            ...formData, 
            membershipType: type,
            sessionsTotal: sessions,
            expiryDate: newExpiry
        });
    };

    const handleStartDateChange = (e: any) => {
        const newStartStr = e.target.value;
        const currentType = formData.membershipType;
        let days = 30;
        
        switch (currentType) {
            case '3 Months': days = 90; break;
            case '6 Months': days = 180; break;
            case '1 Year': days = 365; break;
            case 'PT 12 Sessions': days = 45; break;
            case 'PT 24 Sessions': days = 90; break;
            case 'PT 36 Sessions': days = 180; break;
        }

        const newExpiry = new Date(new Date(newStartStr).getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setFormData({ ...formData, startDate: newStartStr, expiryDate: newExpiry });
    };

    const submitData = () => {
        if (!formData.name || !formData.phone) {
            toast.error('Vui lòng nhập tên và số điện thoại');
            return;
        }
        // convert to complete ISO strings for store
        onSave({
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            expiryDate: new Date(formData.expiryDate).toISOString(),
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-md bg-[#1C1C1E] rounded-[36px] overflow-hidden p-6 border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-shrink-0 mb-6 flex flex-col items-center">
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mb-6" />
                    <h2 className="text-[26px] font-black text-white tracking-tighter superapp-text-gradient">{member ? 'Chỉnh Sửa Hồ Sơ' : 'Thêm Hội Viên'}</h2>
                    <p className="text-[12px] text-white/40 mt-1 uppercase tracking-widest font-bold">HT Strength Identity System</p>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
                    {/* INFO GROUP */}
                    <div className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/[0.05]">
                        <div>
                            <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-1.5 ml-1">Thông tin cá nhân</p>
                            <input className="w-full h-12 px-4 rounded-xl bg-[#151517] border border-white/5 text-white font-medium text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/20" placeholder="Họ và tên..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <input className="w-full h-12 px-4 rounded-xl bg-[#151517] border border-white/5 text-white font-medium text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/20" placeholder="Số điện thoại..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>

                    {/* MEMBERSHIP GROUP */}
                    <div className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/[0.05]">
                        <p className="text-[10px] font-black uppercase text-[#30D158] tracking-[0.2em] mb-1 ml-1">Đăng ký & Dịch vụ</p>
                        <select className="w-full h-12 px-4 rounded-xl bg-[#151517] border border-white/5 text-white font-medium text-sm outline-none appearance-none" value={formData.membershipType} onChange={handleMembershipChange}>
                            <optgroup label="Thẻ Tập Gym">
                                <option value="1 Month">Gói 1 Tháng</option>
                                <option value="3 Months">Gói 3 Tháng</option>
                                <option value="6 Months">Gói 6 Tháng</option>
                                <option value="1 Year">Gói 1 Năm</option>
                            </optgroup>
                            <optgroup label="Huấn Luyện Viên Cá Nhân">
                                <option value="PT 12 Sessions">PT - 12 Buổi</option>
                                <option value="PT 24 Sessions">PT - 24 Buổi</option>
                                <option value="PT 36 Sessions">PT - 36 Buổi</option>
                            </optgroup>
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-1">Ngày bắt đầu</p>
                                <input type="date" className="w-full h-12 px-3 rounded-xl bg-[#151517] border border-white/5 text-white/80 text-xs outline-none" value={formData.startDate} onChange={handleStartDateChange} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-1">Ngày kết thúc</p>
                                <input type="date" className="w-full h-12 px-3 rounded-xl bg-[#151517] border border-white/5 text-[#FF453A] font-bold text-xs outline-none" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* ASSIGNMENTS */}
                    <div className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/[0.05]">
                        <p className="text-[10px] font-black uppercase text-[#BF5AF2] tracking-[0.2em] mb-1 ml-1">Phân bổ hệ thống</p>
                        <select className="w-full h-12 px-4 rounded-xl bg-[#151517] border border-white/5 text-white font-medium text-sm outline-none appearance-none" value={formData.assignedPT} onChange={e => setFormData({ ...formData, assignedPT: e.target.value })}>
                            <option value="">-- Không chỉ định PT --</option>
                            {pts?.map((pt: any) => (
                                <option key={pt.id} value={pt.name}>{pt.name} ({pt.level})</option>
                            ))}
                        </select>
                        <select className="w-full h-12 px-4 rounded-xl bg-[#151517] border border-white/5 text-white font-medium text-sm outline-none appearance-none" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Active">🟢 Trạng thái: Đang hoạt động</option>
                            <option value="Pending">🟡 Trạng thái: Chờ kích hoạt</option>
                            <option value="Expired">🔴 Trạng thái: Hết hạn</option>
                            <option value="Banned">⚫ Trạng thái: Chặn truy cập</option>
                        </select>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 mt-2">
                    <button
                        onClick={submitData}
                        className="w-full py-4 rounded-[20px] bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black uppercase tracking-[0.15em] text-xs shadow-[0_12px_24px_rgba(10,132,255,0.3)] hover:shadow-[0_16px_32px_rgba(10,132,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {member ? 'Cập Nhật Dữ Liệu' : 'Khởi tạo Hồ Sơ'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function MemberPlanModal({ member, onClose, setMemberWorkoutPlan, setMemberMealPlan, setMemberGoalTargets }: any) {
    const [tab, setTab] = useState('workout');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-end justify-center px-4 pb-10 bg-black/80 backdrop-blur-xl" onClick={onClose}>
            <motion.div
                initial={{ y: '100%', scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: '100%', scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-sm bg-[#1C1C1E] rounded-[48px] overflow-hidden p-8 flex flex-col max-h-[85vh] border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                <div className="flex gap-2 mb-10 bg-white/5 p-1 rounded-[24px]">
                    {['workout', 'meal', 'goals'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-500 text-white shadow-xl' : 'text-white/30 hover:text-white/50'}`}
                        >
                            {t === 'workout' ? 'Tập' : t === 'meal' ? 'Ăn' : 'Mục tiêu'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
                    {tab === 'workout' && (
                        <div className="space-y-4">
                            {WORKOUT_PLANS.map(p => (
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    key={p.id}
                                    onClick={() => { setMemberWorkoutPlan(member.id, p.id); toast.success('Đã nạp gói tập'); }}
                                    className={`w-full p-5 rounded-[24px] flex items-center justify-between transition-all border ${member.assignedWorkoutPlanId === p.id ? 'bg-blue-500/15 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/5 text-white/40'}`}
                                >
                                    <span className="font-black uppercase tracking-tighter text-[15px]">{p.name}</span>
                                    {member.assignedWorkoutPlanId === p.id && <CheckCircle size={22} weight="fill" className="text-blue-400" />}
                                </motion.button>
                            ))}
                        </div>
                    )}
                    {tab === 'meal' && (
                        <div className="space-y-4">
                            {MEAL_PLANS.map(m => (
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    key={m.id}
                                    onClick={() => { setMemberMealPlan(member.id, m as any); toast.success('Đã nạp chế độ ăn'); }}
                                    className="w-full p-6 rounded-[28px] bg-white/5 border border-white/5 flex flex-col gap-2 items-start text-left hover:bg-white/10 transition-all"
                                >
                                    <span className="font-black text-[16px] text-white/90">{m.name}</span>
                                    <div className="flex gap-3">
                                        <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md uppercase tracking-wider">{m.totalCalories} KCAL</span>
                                        <span className="text-[10px] font-black text-[#BF5AF2] bg-[#BF5AF2]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">{m.protein}G P</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                    {tab === 'goals' && (
                        <div className="space-y-6">
                            <div className="space-y-2 px-1">
                                <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-2">Mục tiêu chiến lược</p>
                                <textarea
                                    className="w-full h-32 p-6 rounded-3xl bg-white/5 border border-white/5 text-white font-medium resize-none focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                                    placeholder="Ghi chú mục tiêu..."
                                    onChange={e => setMemberGoalTargets(member.id, { note: e.target.value })}
                                />
                            </div>
                            <button onClick={onClose} className="w-full py-5 rounded-[24px] bg-blue-500 text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30">Hoàn tất</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
