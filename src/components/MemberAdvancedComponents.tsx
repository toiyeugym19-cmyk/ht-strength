import { useState, useMemo } from 'react';
import { useMemberStore } from '../store/useMemberStore';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Users, UserPlus,
    DollarSign, Clock, Activity, Target,
    PieChart, ArrowUpRight, ArrowDownRight,
    Award, AlertTriangle, CheckCircle, XCircle,
    Gift, Star, Crown,
    Receipt, Wallet, Download,
    Send, Search, RefreshCw,
    Eye, Edit, ChevronRight,
    Printer, Copy
} from 'lucide-react';
import { toast } from 'sonner';


/**
 * MEMBER ADVANCED COMPONENTS
 * Các component nâng cao cho trang quản lý hội viên
 */

// ========== OVERVIEW CHARTS & STATS ==========
export function MemberOverviewCharts() {
    const { members } = useMemberStore();
    const safeMembers = (members || []).filter(m => !!m);

    // Calculate stats
    const todayCheckIns = safeMembers.reduce((sum, m) => {
        const todayCheckIns = m.checkInHistory?.filter(c => {
            const d = new Date(c.date);
            const today = new Date();
            return d.toDateString() === today.toDateString();
        }).length || 0;
        return sum + todayCheckIns;
    }, 0);

    const weeklyCheckIns: number[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const count = safeMembers.reduce((sum, m) => {
            const dayCheckIns = m.checkInHistory?.filter(c => {
                const d = new Date(c.date);
                return d.toDateString() === date.toDateString();
            }).length || 0;
            return sum + dayCheckIns;
        }, 0);
        weeklyCheckIns.push(count);
    }

    const maxCheckIn = Math.max(...weeklyCheckIns, 1);

    // Membership distribution - Match với data thực trong store
    const membershipDist = {
        'Gói 12 Buổi': safeMembers.filter(m => m.membershipType === 'Gói 12 Buổi').length,
        'Gói 30 Buổi': safeMembers.filter(m => m.membershipType === 'Gói 30 Buổi').length,
        'Gói 100 Buổi': safeMembers.filter(m => m.membershipType === 'Gói 100 Buổi').length,
        'Khác': safeMembers.filter(m => !['Gói 12 Buổi', 'Gói 30 Buổi', 'Gói 100 Buổi'].includes(m.membershipType)).length
    };




    return (
        <div className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <QuickStatCard
                    label="Check-in Hôm Nay"
                    value={todayCheckIns}
                    change={+12}
                    icon={Activity}
                    color="blue"
                />

                <QuickStatCard
                    label="Tỷ Lệ Gia Hạn"
                    value="78%"
                    change={-2.1}
                    icon={RefreshCw}
                    color="orange"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Check-ins Chart */}
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-white">Lượt Check-in 7 Ngày</h3>
                            <p className="text-xs text-neutral-500">Biểu đồ theo ngày</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                            <TrendingUp size={16} />
                            +15%
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-40">
                        {weeklyCheckIns.map((count, idx) => {
                            const height = (count / maxCheckIn) * 100;
                            const date = subDays(new Date(), 6 - idx);
                            const isToday = idx === 6;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        className={`w-full rounded-t-lg ${isToday ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-neutral-700'}`}
                                        style={{ minHeight: count > 0 ? 8 : 0 }}
                                    />
                                    <span className="text-[10px] text-neutral-500 font-mono">
                                        {format(date, 'EEE', { locale: vi })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Membership Distribution */}
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-white">Phân Bố Gói Tập</h3>
                            <p className="text-xs text-neutral-500">Theo loại thẻ</p>
                        </div>
                        <PieChart size={20} className="text-neutral-500" />
                    </div>
                    <div className="space-y-4">
                        {Object.entries(membershipDist).map(([type, count], idx) => {
                            const total = Object.values(membershipDist).reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? (count / total) * 100 : 0;
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                            // Display the type directly since it's already in Vietnamese
                            return (
                                <div key={type}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-neutral-400">{type}</span>

                                        <span className="text-sm font-bold text-white">{count} ({pct.toFixed(0)}%)</span>
                                    </div>
                                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            className={`h-full ${colors[idx]} rounded-full`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Hoạt Động Gần Đây</h3>
                    <button className="text-xs text-blue-500 hover:text-blue-400">Xem tất cả</button>
                </div>
                <div className="space-y-3">
                    {safeMembers.slice(0, 5).map((member, idx) => {
                        const lastCheckIn = member.checkInHistory?.[0];
                        return (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-xl"
                            >
                                <img src={member.avatar} alt="" className="w-10 h-10 rounded-full border border-neutral-700" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                                    <p className="text-xs text-neutral-500">
                                        {lastCheckIn ? `Check-in lúc ${format(new Date(lastCheckIn.date), 'HH:mm')}` : 'Chưa có check-in'}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${member.status === 'Active' ? 'bg-green-500/20 text-green-500' :
                                    member.status === 'Expired' ? 'bg-red-500/20 text-red-500' :
                                        'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {member.status === 'Active' ? 'Hoạt động' : member.status === 'Expired' ? 'Hết hạn' : 'Chờ duyệt'}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ========== PAYMENTS & INVOICES ==========
export function MemberPayments() {
    const { members } = useMemberStore();
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Generate sample invoices from members
    const invoices = useMemo(() => {
        return (members || []).filter(m => !!m).flatMap((member) => {
            const invoices = [];
            const types = ['Gia hạn thẻ', 'Gói PT', 'Thuê tủ đồ', 'Mua sản phẩm'];
            const statuses: Array<'paid' | 'pending' | 'overdue'> = ['paid', 'paid', 'pending', 'overdue'];

            for (let i = 0; i < 2; i++) {
                invoices.push({
                    id: `INV-${member.id}-${i}`,
                    memberId: member.id,
                    memberName: member.name,
                    memberAvatar: member.avatar,
                    type: types[Math.floor(Math.random() * types.length)],
                    amount: Math.floor(Math.random() * 5000000) + 500000,
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    date: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
                    dueDate: format(subDays(new Date(), Math.floor(Math.random() * 10) - 5), 'yyyy-MM-dd')
                });
            }
            return invoices;
        }).slice(0, 20);
    }, [members]);

    const filteredInvoices = invoices.filter(inv => {
        const matchesFilter = filter === 'all' || inv.status === filter;
        const matchesSearch = inv.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        paid: invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
        pending: invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
        overdue: invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-neutral-400 mb-2">
                        <Wallet size={16} />
                        <span className="text-xs font-bold">Tổng Thu</span>
                    </div>
                    <p className="text-2xl font-black text-white">{(stats.total / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-[#121214] border border-green-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                        <CheckCircle size={16} />
                        <span className="text-xs font-bold">Đã Thanh Toán</span>
                    </div>
                    <p className="text-2xl font-black text-green-500">{(stats.paid / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-[#121214] border border-yellow-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                        <Clock size={16} />
                        <span className="text-xs font-bold">Chờ Thanh Toán</span>
                    </div>
                    <p className="text-2xl font-black text-yellow-500">{(stats.pending / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-[#121214] border border-red-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-bold">Quá Hạn</span>
                    </div>
                    <p className="text-2xl font-black text-red-500">{(stats.overdue / 1000000).toFixed(1)}M</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2">
                    {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                        >
                            {f === 'all' ? 'Tất cả' : f === 'paid' ? 'Đã thanh toán' : f === 'pending' ? 'Chờ thanh toán' : 'Quá hạn'}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 outline-none focus:border-blue-500 w-48"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500">
                        <Receipt size={14} />
                        Tạo Hóa Đơn
                    </button>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="text-left text-xs font-bold text-neutral-500 p-4">Mã HĐ</th>
                            <th className="text-left text-xs font-bold text-neutral-500 p-4">Hội Viên</th>
                            <th className="text-left text-xs font-bold text-neutral-500 p-4">Loại</th>
                            <th className="text-left text-xs font-bold text-neutral-500 p-4">Số Tiền</th>
                            <th className="text-left text-xs font-bold text-neutral-500 p-4">Trạng Thái</th>
                            <th className="text-left text-xs font-bold text-neutral-500 p-4">Ngày Tạo</th>
                            <th className="text-right text-xs font-bold text-neutral-500 p-4">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                                <td className="p-4">
                                    <span className="text-xs font-mono text-blue-500">{invoice.id}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <img src={invoice.memberAvatar} alt="" className="w-8 h-8 rounded-full" />
                                        <span className="text-sm text-white">{invoice.memberName}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-neutral-400">{invoice.type}</td>
                                <td className="p-4 text-sm font-bold text-white">{invoice.amount.toLocaleString()}đ</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${invoice.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                                        invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            'bg-red-500/20 text-red-500'
                                        }`}>
                                        {invoice.status === 'paid' ? 'Đã TT' : invoice.status === 'pending' ? 'Chờ TT' : 'Quá hạn'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-neutral-500">{format(new Date(invoice.date), 'dd/MM/yyyy')}</td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-1">
                                        <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                                            <Eye size={14} />
                                        </button>
                                        <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                                            <Printer size={14} />
                                        </button>
                                        <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ========== PACKAGES & PROMOTIONS ==========
export function MemberPackages() {

    const packages = [
        { id: 'pkg_1', name: 'Gói Starter', duration: '1 Tháng', price: 500000, features: ['Tập không giới hạn', 'Tủ đồ miễn phí'], popular: false, color: 'blue' },
        { id: 'pkg_2', name: 'Gói Standard', duration: '3 Tháng', price: 1200000, features: ['Tập không giới hạn', 'Tủ đồ miễn phí', '2 buổi PT', 'Nước uống free'], popular: true, color: 'purple' },
        { id: 'pkg_3', name: 'Gói Premium', duration: '6 Tháng', price: 2000000, features: ['Tập không giới hạn', 'Tủ đồ VIP', '5 buổi PT', 'Nước uống free', 'Khăn tập'], popular: false, color: 'green' },
        { id: 'pkg_4', name: 'Gói VIP', duration: '1 Năm', price: 3500000, features: ['Tập không giới hạn', 'Tủ đồ VIP', '12 buổi PT', 'Đồ uống free', 'Khăn tập', 'Đặt lịch ưu tiên'], popular: false, color: 'orange' }
    ];

    const promotions = [
        { id: 'promo_1', name: 'Flash Sale 50%', code: 'FLASH50', discount: 50, validUntil: '2026-02-15', usageLimit: 100, usageCount: 45 },
        { id: 'promo_2', name: 'Giới Thiệu Bạn', code: 'REFER20', discount: 20, validUntil: '2026-12-31', usageLimit: 500, usageCount: 123 },
        { id: 'promo_3', name: 'Sinh Nhật', code: 'BDAY30', discount: 30, validUntil: '2026-12-31', usageLimit: 0, usageCount: 67 }
    ];

    return (
        <div className="space-y-8">
            {/* Packages */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Các Gói Tập</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500">
                        <UserPlus size={14} />
                        Thêm Gói Mới
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            whileHover={{ y: -5 }}
                            className={`relative bg-[#121214] border rounded-2xl p-6 ${pkg.popular ? 'border-purple-500' : 'border-neutral-800'
                                }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] font-bold text-white">
                                    PHỔ BIẾN
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl bg-${pkg.color}-500/10 flex items-center justify-center mb-4`}>
                                <Crown className={`text-${pkg.color}-500`} size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                            <p className="text-xs text-neutral-500 mb-4">{pkg.duration}</p>
                            <p className="text-3xl font-black text-white mb-4">
                                {pkg.price.toLocaleString()}<span className="text-sm text-neutral-500">đ</span>
                            </p>
                            <ul className="space-y-2 mb-6">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-neutral-400">
                                        <CheckCircle size={14} className="text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${pkg.popular
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                                : 'bg-neutral-800 text-white hover:bg-neutral-700'
                                }`}>
                                Chọn Gói Này
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Promotions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Mã Khuyến Mãi</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-500">
                        <Gift size={14} />
                        Tạo Mã Mới
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="bg-gradient-to-br from-[#1a1a1c] to-[#0c0c0e] border border-neutral-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold border border-green-500/20">
                                    -{promo.discount}%
                                </div>
                                <span className="text-xs text-neutral-500">
                                    HSD: {format(new Date(promo.validUntil), 'dd/MM/yyyy')}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{promo.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <code className="flex-1 px-3 py-2 bg-neutral-900 rounded-lg text-blue-400 font-mono text-sm border border-neutral-800">
                                    {promo.code}
                                </code>
                                <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400"
                                    onClick={() => { navigator.clipboard.writeText(promo.code); toast.success('Đã copy mã!'); }}
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                    <span>Đã dùng</span>
                                    <span>{promo.usageCount}/{promo.usageLimit || '∞'}</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                        style={{ width: `${promo.usageLimit ? (promo.usageCount / promo.usageLimit) * 100 : 50}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ========== MEMBER MESSAGES & NOTIFICATIONS ==========
export function MemberMessages() {
    const [selectedTab, setSelectedTab] = useState<'inbox' | 'sent' | 'templates'>('inbox');
    const [composeOpen, setComposeOpen] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

    const templates = [
        { id: 't1', name: 'Chào mừng HV mới', content: 'Chào mừng {name} đến với Gym! Chúc bạn có những buổi tập hiệu quả.' },
        { id: 't2', name: 'Nhắc gia hạn', content: 'Xin chào {name}, thẻ tập của bạn sẽ hết hạn trong {days} ngày. Gia hạn ngay để không bị gián đoạn!' },
        { id: 't3', name: 'Chúc sinh nhật', content: 'Chúc mừng sinh nhật {name}! Tặng bạn 1 buổi PT miễn phí trong tuần này.' },
        { id: 't4', name: 'Khuyến mãi', content: 'KHUYẾN MÃI KHỦNG! Giảm 30% khi gia hạn trong hôm nay. Dùng mã: {code}' }
    ];

    const messages = [
        { id: 'm1', from: 'Hệ thống', to: 'Tất cả HV', subject: 'Thông báo bảo trì', content: 'Gym sẽ bảo trì vào Chủ nhật 5/2.', date: '2026-01-31', read: true },
        { id: 'm2', from: 'Admin', to: 'Nguyễn Văn A', subject: 'Xác nhận gia hạn', content: 'Cảm ơn bạn đã gia hạn thẻ!', date: '2026-01-30', read: false },
        { id: 'm3', from: 'Hệ thống', to: 'HV sắp hết hạn', subject: 'Nhắc nhở gia hạn', content: 'Thẻ của bạn sắp hết hạn.', date: '2026-01-29', read: true }
    ];

    const handleSendBulk = () => {
        toast.success(`Đã gửi tin nhắn đến ${selectedRecipients.length > 0 ? selectedRecipients.length : 'tất cả'} hội viên!`);
        setComposeOpen(false);
        setMessageContent('');
        setSelectedRecipients([]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {(['inbox', 'sent', 'templates'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${selectedTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                        >
                            {tab === 'inbox' ? '📥 Hộp thư' : tab === 'sent' ? '📤 Đã gửi' : '📝 Mẫu tin'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setComposeOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90"
                >
                    <Send size={16} />
                    Gửi Tin Nhắn
                </button>
            </div>

            {/* Content */}
            {selectedTab === 'templates' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-[#121214] border border-neutral-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-white">{template.name}</h3>
                                <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400">
                                    <Edit size={14} />
                                </button>
                            </div>
                            <p className="text-sm text-neutral-400 line-clamp-2">{template.content}</p>
                            <button
                                onClick={() => { setMessageContent(template.content); setComposeOpen(true); }}
                                className="mt-4 w-full py-2 bg-neutral-800 hover:bg-blue-600 text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                            >
                                Sử dụng mẫu này
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-center gap-4 p-4 border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors cursor-pointer ${!msg.read ? 'bg-blue-500/5' : ''}`}>
                            <div className={`w-3 h-3 rounded-full ${!msg.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-white">{msg.subject}</span>
                                    {!msg.read && <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 text-[9px] font-bold rounded">Mới</span>}
                                </div>
                                <p className="text-xs text-neutral-500 truncate">{msg.from} → {msg.to}</p>
                            </div>
                            <span className="text-xs text-neutral-500">{format(new Date(msg.date), 'dd/MM')}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Compose Modal */}
            <AnimatePresence>
                {composeOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#121214] w-full max-w-2xl rounded-2xl border border-neutral-800 overflow-hidden"
                        >
                            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Gửi Tin Nhắn Hàng Loạt</h3>
                                <button onClick={() => setComposeOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400">
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Người nhận</label>
                                    <select className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                                        <option value="all">Tất cả hội viên</option>
                                        <option value="active">Hội viên đang hoạt động</option>
                                        <option value="expiring">Hội viên sắp hết hạn</option>
                                        <option value="expired">Hội viên đã hết hạn</option>
                                        <option value="birthday">Sinh nhật trong tuần</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Kênh gửi</label>
                                    <div className="flex gap-2">
                                        <label className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl cursor-pointer">
                                            <input type="checkbox" defaultChecked className="accent-blue-500" />
                                            <span className="text-sm text-white">SMS</span>
                                        </label>
                                        <label className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl cursor-pointer">
                                            <input type="checkbox" defaultChecked className="accent-green-500" />
                                            <span className="text-sm text-white">Zalo</span>
                                        </label>
                                        <label className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl cursor-pointer">
                                            <input type="checkbox" className="accent-purple-500" />
                                            <span className="text-sm text-white">Email</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Nội dung</label>
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 outline-none focus:border-blue-500 resize-none"
                                        placeholder="Nhập nội dung tin nhắn... Dùng {name} để chèn tên hội viên."
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-neutral-800 flex justify-end gap-3">
                                <button onClick={() => setComposeOpen(false)} className="px-6 py-2 bg-neutral-800 text-neutral-400 rounded-xl text-sm font-bold hover:text-white">
                                    Hủy
                                </button>
                                <button onClick={handleSendBulk} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90">
                                    Gửi Ngay
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ========== PT/TRAINER MANAGEMENT ==========
export function MemberPTManagement() {
    const trainers = [
        { id: 'pt1', name: 'Trần Văn PT', specialty: 'Bodybuilding', rating: 4.8, clients: 12, avatar: 'https://i.pravatar.cc/150?img=11', status: 'available' },
        { id: 'pt2', name: 'Nguyễn Thị Yoga', specialty: 'Yoga & Pilates', rating: 4.9, clients: 15, avatar: 'https://i.pravatar.cc/150?img=5', status: 'busy' },
        { id: 'pt3', name: 'Lê Văn Cardio', specialty: 'HIIT & Cardio', rating: 4.7, clients: 10, avatar: 'https://i.pravatar.cc/150?img=12', status: 'available' },
        { id: 'pt4', name: 'Phạm Thị Boxing', specialty: 'Boxing & MMA', rating: 4.6, clients: 8, avatar: 'https://i.pravatar.cc/150?img=9', status: 'off' }
    ];

    const sessions = [
        { id: 's1', trainer: 'Trần Văn PT', client: 'Nguyễn Văn A', time: '08:00', date: '2026-01-31', status: 'upcoming' },
        { id: 's2', trainer: 'Nguyễn Thị Yoga', client: 'Trần Thị B', time: '09:30', date: '2026-01-31', status: 'in_progress' },
        { id: 's3', trainer: 'Lê Văn Cardio', client: 'Lê Văn C', time: '14:00', date: '2026-01-31', status: 'completed' }
    ];

    return (
        <div className="space-y-6">
            {/* Trainers Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Huấn Luyện Viên</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500">
                        <UserPlus size={14} />
                        Thêm HLV
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trainers.map((trainer) => (
                        <div key={trainer.id} className="bg-[#121214] border border-neutral-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <img src={trainer.avatar} alt="" className="w-16 h-16 rounded-xl border-2 border-neutral-700" />
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${trainer.status === 'available' ? 'bg-green-500/20 text-green-500' :
                                    trainer.status === 'busy' ? 'bg-yellow-500/20 text-yellow-500' :
                                        'bg-neutral-500/20 text-neutral-500'
                                    }`}>
                                    {trainer.status === 'available' ? 'Sẵn sàng' : trainer.status === 'busy' ? 'Đang bận' : 'Nghỉ'}
                                </span>
                            </div>
                            <h3 className="font-bold text-white">{trainer.name}</h3>
                            <p className="text-xs text-neutral-500 mb-3">{trainer.specialty}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold text-white">{trainer.rating}</span>
                                </div>
                                <span className="text-xs text-neutral-500">{trainer.clients} học viên</span>
                            </div>
                            <button className="mt-4 w-full py-2 bg-neutral-800 hover:bg-blue-600 text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition-all">
                                Xem Chi Tiết
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Sessions */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Buổi Tập Hôm Nay</h2>
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="text-left text-xs font-bold text-neutral-500 p-4">Thời gian</th>
                                <th className="text-left text-xs font-bold text-neutral-500 p-4">HLV</th>
                                <th className="text-left text-xs font-bold text-neutral-500 p-4">Học viên</th>
                                <th className="text-left text-xs font-bold text-neutral-500 p-4">Trạng thái</th>
                                <th className="text-right text-xs font-bold text-neutral-500 p-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50">
                                    <td className="p-4">
                                        <span className="text-sm font-bold text-white">{session.time}</span>
                                    </td>
                                    <td className="p-4 text-sm text-neutral-400">{session.trainer}</td>
                                    <td className="p-4 text-sm text-white">{session.client}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
                                            session.status === 'in_progress' ? 'bg-green-500/20 text-green-500' :
                                                'bg-neutral-500/20 text-neutral-500'
                                            }`}>
                                            {session.status === 'upcoming' ? 'Sắp tới' : session.status === 'in_progress' ? 'Đang diễn ra' : 'Hoàn thành'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-1">
                                            <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                                                <Edit size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ========== ANALYTICS & REPORTS ==========
export function MemberAnalytics() {

    const metrics = [
        { label: 'Tỷ lệ giữ chân', value: '78%', change: +2.3, icon: Target },
        { label: 'Tỷ lệ churn', value: '12%', change: -1.5, icon: TrendingDown },
        { label: 'NPS Score', value: '72', change: +5, icon: Award },
        { label: 'Thời gian TB', value: '45 phút', change: +3, icon: Clock }
    ];

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <metric.icon size={20} className="text-neutral-500" />
                            <span className={`flex items-center gap-1 text-xs font-bold ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {metric.change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {Math.abs(metric.change)}%
                            </span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">{metric.value}</p>
                        <p className="text-xs text-neutral-500">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Reports */}
            <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg">Báo Cáo Nhanh</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500">
                        <Download size={14} />
                        Xuất Báo Cáo
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'Báo cáo check-in', desc: 'Thống kê lượt tập theo ngày/tuần/tháng', icon: Activity },
                        { name: 'Báo cáo doanh thu', desc: 'Chi tiết thu chi và công nợ', icon: DollarSign },
                        { name: 'Báo cáo hội viên', desc: 'Phân tích hành vi và engagement', icon: Users }
                    ].map((report, idx) => (
                        <div key={idx} className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-blue-500/30 transition-all cursor-pointer group">
                            <report.icon size={24} className="text-blue-500 mb-3" />
                            <h4 className="font-bold text-white mb-1">{report.name}</h4>
                            <p className="text-xs text-neutral-500 mb-3">{report.desc}</p>
                            <div className="flex items-center gap-2 text-xs text-blue-500 group-hover:text-blue-400">
                                <span>Tạo báo cáo</span>
                                <ChevronRight size={12} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ========== HELPER COMPONENTS ==========
function QuickStatCard({ label, value, change, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    };

    return (
        <div className={`bg-[#121214] border rounded-2xl p-5 ${colorClasses[color]?.includes('border') ? colorClasses[color].split(' ').find(c => c.includes('border')) : 'border-neutral-800'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={18} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(change)}%
                </span>
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-neutral-500">{label}</p>
        </div>
    );
}
