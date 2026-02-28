import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemberStore, type Member } from '../store/useMemberStore';
import {
    Users,
    UserCheck,
    AlertTriangle,
    Zap,
    Search,
    UserPlus,
    ChevronRight,
    MoreHorizontal,
    ChevronLeft,
    CheckCircle2,
    type LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { isSameDay } from 'date-fns';
import { MemberAutomationDashboard } from '../components/MemberAutomationPanel';
import { IntelligenceConsole } from '../components/IntelligenceConsole';
import {
    MemberOverviewCharts,
    MemberMessages,
    MemberAnalytics
} from '../components/MemberAdvancedComponents';
import { MemberHealthDashboard } from '../components/MemberHealthTracking';
import { DataQualityDashboard } from '../components/DataQualityPanel';

// --- UTILS ---
const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active': return 'Hoạt động';
        case 'expired': return 'Hết hạn';
        case 'pending': return 'Chờ duyệt';
        default: return 'Khác';
    }
};

const translateMembership = (type: string) => {
    if (!type) return 'N/A';
    if (type.includes('Gói') || type.includes('Buổi')) return type;
    const t = type.toLowerCase();
    if (t.includes('1 month')) return 'Gói 1 Tháng';
    if (t.includes('3 months')) return 'Gói 3 Tháng';
    if (t.includes('6 months')) return 'Gói 6 Tháng';
    if (t.includes('1 year')) return 'Gói 1 Năm';
    return type;
};

const getMemberRank = (sessionsUsed: number = 0) => {
    if (sessionsUsed >= 200) return { label: 'Legend 🏆', color: 'text-yellow-400 border-yellow-400/30' };
    if (sessionsUsed >= 50) return { label: 'Elite 💎', color: 'text-purple-400 border-purple-400/30' };
    if (sessionsUsed >= 10) return { label: 'Pro 🥇', color: 'text-blue-400 border-blue-400/30' };
    return { label: 'Newbie 🌱', color: 'text-zinc-500 border-zinc-500/30' };
};

export default function MembersPage() {
    const { members, deleteMember, performCheckIn } = useMemberStore();

    const handleCheckIn = (member: Member) => {
        if (!member) return;

        if (member.sessionsUsed >= member.sessionsTotal) {
            toast.error(`⚠️ ${member.name} đã hết buổi tập! Vui lòng gia hạn.`);
            return;
        }

        if (member.lastCheckIn && member.lastCheckIn !== 'N/A') {
            const lastDate = new Date(member.lastCheckIn);
            const today = new Date();
            if (lastDate.toDateString() === today.toDateString()) {
                toast.error(`⚠️ ${member.name} đã check-in hôm nay rồi!`);
                return;
            }
        }

        performCheckIn(member.id, 'Gym Access');
        toast.success(`✅ Check-in thành công: ${member.name}`);
    };

    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'messages' | 'health' | 'automation' | 'analytics' | 'dataquality'>('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const filterType = 'All';
    const [sortBy] = useState<'name' | 'joinDate' | 'status'>('name');
    const [sortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());

    const safeMembers = useMemo(() => (members || []).filter(m => !!m), [members]);

    const activeMembersCount = safeMembers.filter(m => m.status === 'Active').length;
    const newMembersThisMonth = safeMembers.filter(m => {
        const d = new Date(m.joinDate);
        return !isNaN(d.getTime()) && d.getMonth() === new Date().getMonth();
    }).length;
    const expiredCount = safeMembers.filter(m => m.status === 'Expired').length;

    const filteredMembers = useMemo(() => {
        const result = safeMembers.filter(m => {
            const sTerm = searchTerm.toLowerCase();
            const matchesSearch = (m.name || '').toLowerCase().includes(sTerm) ||
                (m.phone || '').includes(sTerm) ||
                (m.id || '').toLowerCase().includes(sTerm);

            const statusMatch = filterStatus === 'All' || (m.status || '').toLowerCase() === filterStatus.toLowerCase();
            const typeMatch = filterType === 'All' || m.membershipType === filterType;
            return matchesSearch && statusMatch && typeMatch;
        });

        result.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'name') cmp = (a.name || '').localeCompare(b.name || '');
            if (sortBy === 'status') cmp = (a.status || '').localeCompare(b.status || '');
            if (sortBy === 'joinDate') {
                const da = new Date(a.joinDate).getTime() || 0;
                const db = new Date(b.joinDate).getTime() || 0;
                cmp = da - db;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [safeMembers, searchTerm, filterStatus, filterType, sortBy, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterType]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const paginatedMembers = useMemo(() => {
        return filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredMembers, currentPage, itemsPerPage]);

    const handleBulkDelete = () => {
        if (window.confirm(`Xóa ${selectedMemberIds.size} hội viên này?`)) {
            selectedMemberIds.forEach(id => deleteMember(id));
            setSelectedMemberIds(new Set());
            toast.success("Đã xóa hội viên đã chọn");
        }
    };

    const TAB_OPTIONS = [
        { id: 'members', label: 'D.Sách' },
        { id: 'overview', label: 'Tổng Kê' },
        { id: 'health', label: 'Sinh Trắc' },
        { id: 'automation', label: 'AI' },
        { id: 'analytics', label: 'Báo Cáo' },
    ];

    return (
        <div className="ios-animate-in">
            {/* iOS Action Bar */}
            <div className="flex items-center justify-between px-4 py-2">
                <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="ios-btn ios-btn--filled ios-btn--small"
                >
                    <UserPlus size={16} strokeWidth={2.5} />
                    <span>Thêm Mới</span>
                </button>
                {selectedMemberIds.size > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="ios-btn ios-btn--danger ios-btn--small"
                    >
                        Xóa ({selectedMemberIds.size})
                    </button>
                )}
            </div>

            {/* iOS Segmented Control */}
            <div className="ios-segmented mx-4 mb-3">
                {TAB_OPTIONS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`ios-segmented__item ${activeTab === tab.id ? 'ios-segmented__item--active' : ''}`}
                        style={activeTab === tab.id ? { background: 'var(--ios-card-bg)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' } : {}}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            <div className={`grid gap-3 grid-cols-2`}>
                                <IOSStatCard label="Tổng" value={safeMembers.length} icon={Users} color="#0A84FF" />
                                <IOSStatCard label="Hoạt Động" value={activeMembersCount} icon={UserCheck} color="#30D158" />
                                <IOSStatCard label="Hết Hạn" value={expiredCount} icon={AlertTriangle} color="#FF453A" />
                                <IOSStatCard label="Mới" value={newMembersThisMonth} icon={Zap} color="#BF5AF2" />
                            </div>
                            <div className="ios-list">
                                <div className="p-4">
                                    <MemberOverviewCharts />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'members' && (
                        <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                            {/* iOS Search Bar */}
                            <div className="ios-search-bar">
                                <Search className="ios-search-bar__icon" size={18} />
                                <input
                                    placeholder="Tìm kiếm hội viên..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filter chips */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                {['All', 'Active', 'Expired', 'Pending'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`ios-chip ${filterStatus === s ? 'ios-chip--active' : ''}`}
                                    >
                                        {s === 'All' ? 'Tất Cả' : translateStatus(s)}
                                    </button>
                                ))}
                            </div>

                            {/* Member List */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: 0
                            }}>
                                <AnimatePresence mode="popLayout">
                                    {paginatedMembers.map((member, idx) => (
                                        <MemberRow
                                            key={member.id}
                                            member={member}
                                            index={idx}
                                            view={'mobile'}
                                            selected={selectedMemberIds.has(member.id)}
                                            onSelect={() => {
                                                const nextSet = new Set(selectedMemberIds);
                                                if (nextSet.has(member.id)) nextSet.delete(member.id);
                                                else nextSet.add(member.id);
                                                setSelectedMemberIds(nextSet);
                                            }}
                                            onAction={(action: 'edit' | 'health' | 'more') => {
                                                setSelectedMember(member);
                                                if (action === 'edit') setIsEditModalOpen(true);
                                                if (action === 'health') setActiveTab('health');
                                            }}
                                            onCheckIn={() => handleCheckIn(member)}
                                        />
                                    ))}
                                </AnimatePresence>

                                {paginatedMembers.length === 0 && (
                                    <div className="py-16 text-center space-y-3">
                                        <Users size={48} strokeWidth={1} className="mx-auto text-[var(--ios-text-tertiary)]" />
                                        <p className="text-sm text-[var(--ios-text-secondary)]">Không tìm thấy hội viên</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 py-3">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="ios-btn ios-btn--gray ios-btn--small">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-sm font-medium text-[var(--ios-text-secondary)]">{currentPage} / {totalPages}</span>
                                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="ios-btn ios-btn--gray ios-btn--small">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'messages' && <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MemberMessages /></motion.div>}
                    {activeTab === 'health' && <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MemberHealthDashboard initialMember={selectedMember} /></motion.div>}
                    {activeTab === 'automation' && (
                        <motion.div key="automation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            <MemberAutomationDashboard />
                            <IntelligenceConsole />
                        </motion.div>
                    )}
                    {activeTab === 'analytics' && <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MemberAnalytics /></motion.div>}
                    {activeTab === 'dataquality' && <motion.div key="dataquality" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DataQualityDashboard /></motion.div>}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {(isAddMemberModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full max-w-md bg-[var(--ios-card-bg)] rounded-t-[14px] overflow-hidden"
                        >
                            <div className="flex justify-center pt-2 pb-1">
                                <div className="w-9 h-[5px] rounded-full bg-[var(--ios-separator-opaque)]" />
                            </div>
                            <div className="p-4 border-b border-[var(--ios-separator)] flex justify-between items-center">
                                <button onClick={() => { setIsAddMemberModalOpen(false); setIsEditModalOpen(false); }} className="text-[var(--ios-tint)] text-[17px]">Huỷ</button>
                                <h3 className="text-[17px] font-semibold">
                                    {isAddMemberModalOpen ? 'Thêm Hội Viên' : 'Sửa Thông Tin'}
                                </h3>
                                <button onClick={() => { setIsAddMemberModalOpen(false); setIsEditModalOpen(false); toast.success('Đã lưu!'); }} className="text-[var(--ios-tint)] text-[17px] font-semibold">Lưu</button>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-[var(--ios-text-secondary)] text-sm">Tính năng đang được phát triển...</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function IOSStatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: LucideIcon, color: string }) {
    return (
        <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4 active:scale-95 transition-transform">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon size={18} style={{ color }} />
                </div>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
            <div className="text-xs text-[var(--ios-text-secondary)] mt-1">{label}</div>
        </div>
    );
}

function MemberRow({ member, index, view, selected, onSelect, onAction, onCheckIn }: { member: Member, index: number, view: 'mobile' | 'tablet' | 'desktop', selected: boolean, onSelect: () => void, onAction: (action: 'edit' | 'health' | 'more') => void, onCheckIn: () => void }) {
    const rank = getMemberRank(member.sessionsUsed);
    const percentage = Math.min(100, (member.sessionsUsed / member.sessionsTotal) * 100);

    if (view === 'mobile') {
        const isCheckedInToday = !!(member.lastCheckIn && member.lastCheckIn !== 'N/A' && isSameDay(new Date(member.lastCheckIn), new Date()));
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={onSelect}
                style={{
                    background: selected ? 'rgba(255,107,53,0.08)' : '#1C1C1F',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 10,
                    border: selected ? '1px solid rgba(255,107,53,0.3)' : '1px solid transparent',
                    cursor: 'pointer'
                }}
            >
                {/* Top: Avatar + Name + Rank */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                            src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=2C2C2E&color=fff`}
                            alt=""
                            style={{
                                width: 50, height: 50, borderRadius: 14,
                                objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        />
                        <div style={{
                            position: 'absolute', bottom: -2, right: -2,
                            width: 14, height: 14, borderRadius: '50%',
                            background: member.status === 'Active' ? '#30D158' : '#FF453A',
                            border: '2.5px solid #1C1C1F'
                        }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: 17, fontWeight: 600, color: '#F5F5F7',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                            {member.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                            <span style={{
                                fontSize: 11, fontWeight: 500, color: '#98989D'
                            }}>
                                {member.phone}
                            </span>
                            <span style={{
                                fontSize: 10, fontWeight: 600,
                                padding: '2px 8px', borderRadius: 6,
                                background: member.sessionsUsed >= 200 ? 'rgba(255,214,10,0.15)' :
                                    member.sessionsUsed >= 50 ? 'rgba(191,90,242,0.15)' :
                                        member.sessionsUsed >= 10 ? 'rgba(10,132,255,0.15)' : 'rgba(142,142,147,0.12)',
                                color: member.sessionsUsed >= 200 ? '#FFD60A' :
                                    member.sessionsUsed >= 50 ? '#BF5AF2' :
                                        member.sessionsUsed >= 10 ? '#0A84FF' : '#8E8E93'
                            }}>
                                {rank.label}
                            </span>
                        </div>
                    </div>
                    <ChevronRight size={18} style={{ color: '#636366', flexShrink: 0 }} />
                </div>

                {/* Usage Progress */}
                <div style={{
                    background: '#2C2C2E', borderRadius: 10, padding: '12px 14px', marginBottom: 12
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#98989D' }}>Đã sử dụng</span>
                        <div>
                            <span style={{ fontSize: 20, fontWeight: 700, color: '#F5F5F7' }}>{member.sessionsUsed}</span>
                            <span style={{ fontSize: 14, fontWeight: 500, color: '#636366' }}> / {member.sessionsTotal} buổi</span>
                        </div>
                    </div>
                    <div style={{
                        width: '100%', height: 6, background: '#3A3A3C', borderRadius: 3,
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                                height: '100%', borderRadius: 3,
                                background: percentage > 80 ? '#FF453A' :
                                    percentage > 50 ? '#FF9F0A' : '#30D158'
                            }}
                        />
                    </div>
                </div>

                {/* Bottom: Status + Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: member.status === 'Active' ? '#30D158' : '#FF453A'
                        }} />
                        <span style={{
                            fontSize: 13, fontWeight: 500,
                            color: member.status === 'Active' ? '#98989D' : '#FF453A'
                        }}>
                            {member.status === 'Active' ? 'Đang hoạt động' :
                                member.status === 'Expired' ? 'Hết hạn' : 'Chờ duyệt'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onCheckIn(); }}
                            disabled={isCheckedInToday}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '7px 14px', borderRadius: 20,
                                fontSize: 13, fontWeight: 600, border: 'none',
                                cursor: isCheckedInToday ? 'default' : 'pointer',
                                background: isCheckedInToday ? 'rgba(191,90,242,0.15)' : '#FF6B35',
                                color: isCheckedInToday ? '#BF5AF2' : '#fff',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            {isCheckedInToday ? <CheckCircle2 size={14} /> : <UserCheck size={14} />}
                            {isCheckedInToday ? 'Đã check-in' : 'Check-in'}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onAction('more'); }}
                            style={{
                                width: 34, height: 34, borderRadius: 10,
                                background: '#2C2C2E', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#98989D', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (view === 'tablet') {
        const isCheckedInToday = !!(member.lastCheckIn && member.lastCheckIn !== 'N/A' && isSameDay(new Date(member.lastCheckIn), new Date()));
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`p-4 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex items-center gap-4 hover:bg-zinc-900/50 transition-all cursor-pointer group shadow-lg ${selected ? 'border-primary/50 bg-primary/5 shadow-primary/5' : ''}`}
                onClick={onSelect}
            >
                <div className="relative" onClick={(e) => { e.stopPropagation(); onAction('health'); }}>
                    <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} className="w-16 h-16 rounded-[1.2rem] object-cover border border-white/10 group-hover:border-primary/50 transition-all shadow-md" alt="" />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#09090b] ${member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-[900] italic text-white uppercase tracking-tighter truncate leading-tight group-hover:text-primary transition-colors">{member.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{member.membershipType}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border bg-black/20 ${rank.color}`}>{rank.label}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onCheckIn(); }}
                        disabled={isCheckedInToday}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-[9px] font-black uppercase tracking-wider shadow-lg ${isCheckedInToday ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 cursor-default' : 'bg-primary text-white border-primary cursor-pointer active:scale-90'}`}
                    >
                        {isCheckedInToday ? <CheckCircle2 size={14} strokeWidth={3} /> : <UserCheck size={14} strokeWidth={3} />}
                        {isCheckedInToday ? 'XONG' : 'IN'}
                    </button>
                    <div className="flex items-center gap-1 opacity-50">
                        <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-[8px] font-mono text-zinc-500">{member.sessionsUsed}/{member.sessionsTotal}</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`group border-b border-white/5 last:border-0 hover:bg-white/[0.02] p-4 lg:grid grid-cols-12 gap-4 items-center transition-all relative px-8 mx-2 rounded-xl ${selected ? 'bg-primary/5' : ''}`}
            onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
                    onSelect();
                }
            }}
        >
            <div className="col-span-1 flex items-center justify-center pr-4">
                <input type="checkbox" checked={selected} onChange={onSelect} className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary ring-offset-zinc-900" />
            </div>
            <div className="col-span-3 flex items-center gap-4">
                <div className="relative shrink-0">
                    <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#09090b] ${member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-black text-white truncate">{member.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">{member.phone}</p>
                </div>
            </div>
            <div className="col-span-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{translateMembership(member.membershipType)}</span>
            </div>
            <div className="col-span-2 flex flex-col items-center gap-2">
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-primary" />
                </div>
                <span className="text-[9px] font-mono text-zinc-600">{member.sessionsUsed}/{member.sessionsTotal} ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="col-span-2 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${member.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {translateStatus(member.status)}
                </span>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); onCheckIn(); }} className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"><UserCheck size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); onAction('edit'); }} className="p-2.5 bg-white/5 text-zinc-400 hover:text-white rounded-xl transition-all"><MoreHorizontal size={16} /></button>
            </div>
        </motion.div>
    );
}
