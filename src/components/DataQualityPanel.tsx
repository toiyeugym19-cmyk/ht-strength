import { useState, useMemo } from 'react';
import { useMemberStore } from '../store/useMemberStore';
import { format, differenceInDays, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import {
    Calendar, Database,
    RefreshCw, Send, Phone,
    Gift, Clock, AlertCircle,
    Search, Edit, Save, X, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * DATA QUALITY & SYNC COMPONENTS
 * Theo dõi chất lượng dữ liệu và đồng bộ
 */

// ========================================
// DATA QUALITY DASHBOARD
// ========================================
export function DataQualityDashboard() {
    const { members, updateMember } = useMemberStore();
    const [activeSection, setActiveSection] = useState<'overview' | 'birthday' | 'health' | 'expiry' | 'status'>('overview');

    const safeMembers = (members || []).filter(m => !!m);

    // Calculate data quality stats
    const stats = useMemo(() => {
        const total = safeMembers.length;
        const withBirthday = safeMembers.filter(m => !!m.dateOfBirth).length;
        const withHealthMetrics = safeMembers.filter(m => m.healthMetrics && m.healthMetrics.length > 0).length;
        const withExpiry = safeMembers.filter(m => !!m.expiryDate).length;

        // Status inconsistencies
        const today = new Date();
        const statusIssues = safeMembers.filter(m => {
            if (!m.expiryDate) return false;
            const expiry = new Date(m.expiryDate);
            const isExpired = expiry < today;
            return (isExpired && m.status === 'Active') || (!isExpired && m.status === 'Expired');
        });

        // Today's birthdays
        const todayStr = format(today, 'MM-dd');
        const birthdaysToday = safeMembers.filter(m => {
            if (!m.dateOfBirth) return false;
            return format(new Date(m.dateOfBirth), 'MM-dd') === todayStr;
        });

        // Expiring soon (within 7 days)
        const expiringSoon = safeMembers.filter(m => {
            if (!m.expiryDate || m.status !== 'Active') return false;
            const days = differenceInDays(new Date(m.expiryDate), today);
            return days >= 0 && days <= 7;
        });

        // Health metrics outdated (> 30 days)
        const outdatedHealth = safeMembers.filter(m => {
            if (!m.healthMetrics || m.healthMetrics.length === 0) return true;
            const lastRecord = new Date(m.healthMetrics[0].recordDate);
            return differenceInDays(today, lastRecord) > 30;
        }).filter(m => m.status === 'Active');

        return {
            total,
            withBirthday,
            withHealthMetrics,
            withExpiry,
            missingBirthday: total - withBirthday,
            missingHealth: total - withHealthMetrics,
            missingExpiry: total - withExpiry,
            statusIssues: statusIssues.length,
            birthdaysToday: birthdaysToday.length,
            birthdaysList: birthdaysToday,
            expiringSoon: expiringSoon.length,
            expiringSoonList: expiringSoon,
            outdatedHealth: outdatedHealth.length,
            dataCompleteness: Math.round(((withBirthday + withHealthMetrics + withExpiry) / (total * 3)) * 100)
        };
    }, [safeMembers]);

    // Auto-fix status issues
    const handleSyncStatus = () => {
        const today = new Date();
        let fixed = 0;

        safeMembers.forEach(member => {
            if (!member.expiryDate) return;

            const expiry = new Date(member.expiryDate);
            const isExpired = expiry < today;

            if (isExpired && member.status === 'Active') {
                updateMember(member.id, { status: 'Expired' });
                fixed++;
            } else if (!isExpired && member.status === 'Expired') {
                updateMember(member.id, { status: 'Active' });
                fixed++;
            }
        });

        if (fixed > 0) {
            toast.success(`Đã đồng bộ ${fixed} hội viên!`);
        } else {
            toast.info('Không có gì cần đồng bộ');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Database className="text-blue-500" size={28} />
                        Chất Lượng Dữ Liệu
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">
                        Theo dõi và đồng bộ dữ liệu hội viên
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSyncStatus}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500"
                    >
                        <RefreshCw size={16} />
                        Đồng Bộ Status
                    </button>
                </div>
            </div>

            {/* Data Completeness */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Độ Hoàn Thiện Dữ Liệu</h3>
                    <span className="text-3xl font-black text-white">{stats.dataCompleteness}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.dataCompleteness}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${stats.dataCompleteness >= 80 ? 'bg-green-500' :
                            stats.dataCompleteness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                    />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">Có Ngày Sinh</p>
                        <p className="text-lg font-bold text-white">{stats.withBirthday}/{stats.total}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">Có Chỉ Số SK</p>
                        <p className="text-lg font-bold text-white">{stats.withHealthMetrics}/{stats.total}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-neutral-500">Có Ngày Hết Hạn</p>
                        <p className="text-lg font-bold text-white">{stats.withExpiry}/{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AlertCard
                    title="Sinh Nhật Hôm Nay"
                    count={stats.birthdaysToday}
                    icon={Gift}
                    color="purple"
                    onClick={() => setActiveSection('birthday')}
                    active={activeSection === 'birthday'}
                />
                <AlertCard
                    title="Thiếu Ngày Sinh"
                    count={stats.missingBirthday}
                    icon={Calendar}
                    color="yellow"
                    onClick={() => setActiveSection('birthday')}
                    active={activeSection === 'birthday'}
                    alert={stats.missingBirthday > 0}
                />
                <AlertCard
                    title="Sắp Hết Hạn"
                    count={stats.expiringSoon}
                    icon={Clock}
                    color="orange"
                    onClick={() => setActiveSection('expiry')}
                    active={activeSection === 'expiry'}
                    alert={stats.expiringSoon > 0}
                />
                <AlertCard
                    title="Status Lỗi"
                    count={stats.statusIssues}
                    icon={AlertCircle}
                    color="red"
                    onClick={() => setActiveSection('status')}
                    active={activeSection === 'status'}
                    alert={stats.statusIssues > 0}
                />
            </div>

            {/* Section Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Birthday Section */}
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Gift size={18} className="text-purple-500" />
                            Sinh Nhật Hôm Nay
                        </h3>
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg">
                            {stats.birthdaysToday} HV
                        </span>
                    </div>
                    {stats.birthdaysList.length > 0 ? (
                        <div className="space-y-2">
                            {stats.birthdaysList.map(member => (
                                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{member.name}</p>
                                        <p className="text-xs text-neutral-400">{member.phone}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">
                                            <Phone size={14} />
                                        </button>
                                        <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">
                                            <MessageSquare size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 text-center py-4">
                            Không có sinh nhật hôm nay
                        </p>
                    )}
                </div>

                {/* Expiring Soon */}
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Clock size={18} className="text-orange-500" />
                            Sắp Hết Hạn (7 ngày)
                        </h3>
                        <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg">
                            {stats.expiringSoon} HV
                        </span>
                    </div>
                    {stats.expiringSoonList.length > 0 ? (
                        <div className="space-y-2">
                            {stats.expiringSoonList.slice(0, 5).map(member => {
                                const daysLeft = differenceInDays(new Date(member.expiryDate!), new Date());
                                return (
                                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white">{member.name}</p>
                                            <p className="text-xs text-neutral-400">
                                                Hết hạn: {format(new Date(member.expiryDate!), 'dd/MM/yyyy')}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${daysLeft <= 1 ? 'bg-red-500/20 text-red-400' :
                                            daysLeft <= 3 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {daysLeft === 0 ? 'Hôm nay' : daysLeft === 1 ? 'Ngày mai' : `${daysLeft} ngày`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 text-center py-4">
                            Không có HV sắp hết hạn
                        </p>
                    )}
                </div>
            </div>

            {/* Missing Birthday Collector */}
            <BirthdayCollector />
        </div>
    );
}

// ========================================
// BIRTHDAY COLLECTOR COMPONENT
// ========================================
function BirthdayCollector() {
    const { members, updateMember } = useMemberStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newDob, setNewDob] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const missingBirthday = (members || []).filter(m => !!m && !m.dateOfBirth);

    const filteredMembers = missingBirthday.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
    );

    const handleSave = (memberId: string) => {
        if (!newDob) {
            toast.error('Vui lòng nhập ngày sinh');
            return;
        }

        updateMember(memberId, { dateOfBirth: newDob });
        setEditingId(null);
        setNewDob('');
        toast.success('Đã cập nhật ngày sinh!');
    };

    const handleSendSMS = () => {
        toast.info(`Đang gửi SMS đến ${filteredMembers.length} hội viên...`);
        // Simulate SMS sending
        setTimeout(() => {
            toast.success('Đã gửi SMS yêu cầu cập nhật ngày sinh!');
        }, 1500);
    };

    if (missingBirthday.length === 0) return null;

    return (
        <div className="bg-[#121214] border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Calendar className="text-yellow-500" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Thu Thập Ngày Sinh</h3>
                        <p className="text-xs text-neutral-500">{missingBirthday.length} hội viên chưa có ngày sinh</p>
                    </div>
                </div>
                <button
                    onClick={handleSendSMS}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400"
                >
                    <Send size={14} />
                    Gửi SMS Thu Thập
                </button>
            </div>

            <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Tìm kiếm hội viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 outline-none focus:border-yellow-500"
                />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredMembers.slice(0, 10).map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                        <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{member.name}</p>
                            <p className="text-xs text-neutral-500">{member.phone}</p>
                        </div>

                        {editingId === member.id ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={newDob}
                                    onChange={(e) => setNewDob(e.target.value)}
                                    className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white outline-none focus:border-yellow-500"
                                />
                                <button
                                    onClick={() => handleSave(member.id)}
                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-400"
                                >
                                    <Save size={14} />
                                </button>
                                <button
                                    onClick={() => { setEditingId(null); setNewDob(''); }}
                                    className="p-1.5 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditingId(member.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg text-xs font-bold hover:bg-yellow-500 hover:text-black transition-colors"
                            >
                                <Edit size={12} />
                                Nhập DOB
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {filteredMembers.length > 10 && (
                <p className="text-xs text-neutral-500 text-center mt-3">
                    Và {filteredMembers.length - 10} hội viên khác...
                </p>
            )}
        </div>
    );
}

// ========================================
// EXPIRY DATE CALCULATOR
// ========================================
export function ExpiryCalculator() {
    const { members, updateMember } = useMemberStore();

    const packageDurations: Record<string, number> = {
        '1 Month': 30,
        '3 Months': 90,
        '6 Months': 180,
        '1 Year': 365
    };

    const membersNeedingExpiry = (members || []).filter(m =>
        !!m && !m.expiryDate && m.joinDate && m.membershipType
    );

    const handleAutoCalculate = () => {
        let updated = 0;

        membersNeedingExpiry.forEach(member => {
            const duration = packageDurations[member.membershipType] || 30;
            const startDate = new Date(member.joinDate);
            const expiryDate = addDays(startDate, duration);

            updateMember(member.id, {
                expiryDate: format(expiryDate, 'yyyy-MM-dd'),
                registrationDate: member.joinDate
            });
            updated++;
        });

        if (updated > 0) {
            toast.success(`Đã tính ngày hết hạn cho ${updated} hội viên!`);
        } else {
            toast.info('Tất cả hội viên đã có ngày hết hạn');
        }
    };

    if (membersNeedingExpiry.length === 0) return null;

    return (
        <div className="bg-[#121214] border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Clock className="text-blue-500" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Tính Ngày Hết Hạn</h3>
                        <p className="text-xs text-neutral-500">{membersNeedingExpiry.length} hội viên chưa có ngày hết hạn</p>
                    </div>
                </div>
                <button
                    onClick={handleAutoCalculate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500"
                >
                    <RefreshCw size={14} />
                    Tính Tự Động
                </button>
            </div>

            <div className="mt-4 p-3 bg-neutral-900 rounded-xl">
                <p className="text-xs text-neutral-400 mb-2">Công thức:</p>
                <code className="text-xs text-blue-400">
                    expiry_date = join_date + package_duration
                </code>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(packageDurations).map(([pkg, days]) => (
                        <div key={pkg} className="flex justify-between text-xs">
                            <span className="text-neutral-500">{pkg}:</span>
                            <span className="text-white">{days} ngày</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ========================================
// ALERT CARD COMPONENT
// ========================================
function AlertCard({ title, count, icon: Icon, color, onClick, active, alert }: {
    title: string;
    count: number;
    icon: any;
    color: string;
    onClick?: () => void;
    active?: boolean;
    alert?: boolean;
}) {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
        yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
        red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
    };

    const c = colors[color];

    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-2xl border transition-all text-left ${active ? c.border + ' ' + c.bg : 'border-neutral-800 bg-[#121214] hover:bg-neutral-900'
                } ${alert ? 'animate-pulse' : ''}`}
        >
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={c.text} />
            </div>
            <p className="text-2xl font-black text-white">{count}</p>
            <p className="text-xs text-neutral-500 truncate">{title}</p>
        </button>
    );
}

// ========================================
// STATUS SYNC ENGINE
// ========================================
export function useStatusSync() {
    const { members, updateMember } = useMemberStore();

    const syncAllStatus = () => {
        const today = new Date();
        const results = { synced: 0, errors: 0 };

        (members || []).forEach(member => {
            if (!member || !member.expiryDate) return;

            try {
                const expiry = new Date(member.expiryDate);
                const isExpired = expiry < today;

                if (isExpired && member.status === 'Active') {
                    updateMember(member.id, { status: 'Expired' });
                    results.synced++;
                } else if (!isExpired && member.status === 'Expired') {
                    updateMember(member.id, { status: 'Active' });
                    results.synced++;
                }
            } catch {
                results.errors++;
            }
        });

        return results;
    };

    const getStatusIssues = () => {
        const today = new Date();
        return (members || []).filter(member => {
            if (!member || !member.expiryDate) return false;
            const expiry = new Date(member.expiryDate);
            const isExpired = expiry < today;
            return (isExpired && member.status === 'Active') || (!isExpired && member.status === 'Expired');
        });
    };

    return { syncAllStatus, getStatusIssues };
}

// ========================================
// BIRTHDAY CHECKER HOOK
// ========================================
export function useBirthdayChecker() {
    const { members } = useMemberStore();

    const getTodayBirthdays = () => {
        const today = format(new Date(), 'MM-dd');
        return (members || []).filter(member => {
            if (!member || !member.dateOfBirth) return false;
            return format(new Date(member.dateOfBirth), 'MM-dd') === today;
        });
    };

    const getUpcomingBirthdays = (days: number = 7) => {
        const today = new Date();
        return (members || []).filter(member => {
            if (!member || !member.dateOfBirth) return false;
            const dob = new Date(member.dateOfBirth);
            // Set to this year
            dob.setFullYear(today.getFullYear());
            if (dob < today) dob.setFullYear(today.getFullYear() + 1);
            const diff = differenceInDays(dob, today);
            return diff >= 0 && diff <= days;
        });
    };

    const getMissingBirthdays = () => {
        return (members || []).filter(m => !!m && !m.dateOfBirth);
    };

    return { getTodayBirthdays, getUpcomingBirthdays, getMissingBirthdays };
}

// ========================================
// HEALTH METRICS CHECKER HOOK
// ========================================
export function useHealthChecker() {
    const { members } = useMemberStore();

    const getOutdatedMetrics = (maxDays: number = 30) => {
        const today = new Date();
        return (members || []).filter(member => {
            if (!member || member.status !== 'Active') return false;
            if (!member.healthMetrics || member.healthMetrics.length === 0) return true;
            const lastRecord = new Date(member.healthMetrics[0].recordDate);
            return differenceInDays(today, lastRecord) > maxDays;
        });
    };

    const getNoMetrics = () => {
        return (members || []).filter(m =>
            !!m && m.status === 'Active' && (!m.healthMetrics || m.healthMetrics.length === 0)
        );
    };

    const getPositiveProgress = () => {
        return (members || []).filter(m =>
            !!m && m.progressScore && m.progressScore > 30
        );
    };

    const getNeedsAttention = () => {
        return (members || []).filter(m =>
            !!m && m.progressScore && m.progressScore < -20
        );
    };

    return { getOutdatedMetrics, getNoMetrics, getPositiveProgress, getNeedsAttention };
}
