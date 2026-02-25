import { useState, useMemo } from 'react';
import { useMemberStore, type Member, type HealthMetrics } from '../store/useMemberStore';
import { format } from 'date-fns';

import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Activity,
    ArrowUpRight, ArrowDownRight, Award, AlertTriangle,
    Scale, User,
    Plus, Save, Calendar, Search,
    Dna, Flame, Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

/**
 * MEMBER HEALTH TRACKING COMPONENTS
 * Theo dõi sức khỏe và chỉ số thể chất hội viên
 */

// ========== HEALTH DASHBOARD ==========
export function MemberHealthDashboard({ initialMember }: { initialMember?: Member | null }) {
    const { members } = useMemberStore();
    const [selectedMember, setSelectedMember] = useState<Member | null>(initialMember || null);
    const [searchTerm, setSearchTerm] = useState('');

    // Sync from parent if provided
    useMemo(() => {
        if (initialMember) setSelectedMember(initialMember);
    }, [initialMember]);

    const safeMembers = (members || []).filter(m => !!m && m.status === 'Active');

    // Filter members
    const filteredMembers = safeMembers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
    );

    // Calculate stats
    const stats = useMemo(() => {
        const withMetrics = safeMembers.filter(m => m.healthMetrics && m.healthMetrics.length > 0);
        const withBirthday = safeMembers.filter(m => !!m.dateOfBirth);

        // Check today's birthdays
        const today = format(new Date(), 'MM-dd');
        const birthdaysToday = safeMembers.filter(m => {
            if (!m.dateOfBirth) return false;
            const bday = format(new Date(m.dateOfBirth), 'MM-dd');
            return bday === today;
        });

        // Progress analysis
        let positive = 0, negative = 0, plateau = 0;
        safeMembers.forEach(m => {
            if (m.progressScore && m.progressScore > 30) positive++;
            else if ((m.progressScore && m.progressScore < -20) || m.riskLevel === 'high') negative++;
            else if (m.healthMetrics && m.healthMetrics.length > 0) plateau++;
        });

        return {
            total: safeMembers.length,
            withMetrics: withMetrics.length,
            withBirthday: withBirthday.length,
            missingBirthday: safeMembers.length - withBirthday.length,
            birthdaysToday: birthdaysToday.length,
            positive,
            negative,
            plateau,
            needsMeasurement: safeMembers.length - withMetrics.length
        };
    }, [safeMembers]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard
                    label="Tổng HV Active"
                    value={stats.total}
                    icon={User}
                    color="blue"
                />
                <StatCard
                    label="Đã Đo Chỉ Số"
                    value={stats.withMetrics}
                    subtext={`${Math.round((stats.withMetrics / stats.total) * 100)}%`}
                    icon={Scale}
                    color="green"
                />
                <StatCard
                    label="Tiến Bộ Tích Cực"
                    value={stats.positive}
                    icon={TrendingUp}
                    color="emerald"
                />
                <StatCard
                    label="Cần Quan Tâm"
                    value={stats.negative}
                    icon={AlertTriangle}
                    color="red"
                />
                <StatCard
                    label="Sinh Nhật Hôm Nay"
                    value={stats.birthdaysToday}
                    icon={Award}
                    color="purple"
                />
                <StatCard
                    label="Thiếu Ngày Sinh"
                    value={stats.missingBirthday}
                    icon={Calendar}
                    color="yellow"
                    alert={false}
                />
            </div>

            {/* Data Quality Alert */}


            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Member List */}
                <div className="lg:col-span-1 bg-[#121214] border border-neutral-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Danh Sách Hội Viên</h3>
                        <span className="text-xs text-neutral-500">{filteredMembers.length} HV</span>
                    </div>

                    <div className="relative mb-4">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredMembers.slice(0, 20).map((member) => {
                            const hasMetrics = member.healthMetrics && member.healthMetrics.length > 0;
                            const hasBirthday = !!member.dateOfBirth;
                            const isSelected = selectedMember?.id === member.id;

                            return (
                                <button
                                    key={member.id}
                                    onClick={() => setSelectedMember(member)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isSelected
                                        ? 'bg-blue-500/20 border border-blue-500/30'
                                        : 'hover:bg-neutral-800 border border-transparent'
                                        }`}
                                >
                                    <img src={member.avatar} alt="" className="w-10 h-10 rounded-full border border-neutral-700" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                                        <div className="flex gap-1 mt-1">
                                            {hasMetrics ? (
                                                <span className="text-[9px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded">Có chỉ số</span>
                                            ) : (
                                                <span className="text-[9px] px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">Chưa đo</span>
                                            )}
                                            {!hasBirthday && (
                                                <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded">Thiếu DOB</span>
                                            )}
                                        </div>
                                    </div>
                                    {member.progressScore !== undefined && (
                                        <div className={`text-xs font-bold ${member.progressScore > 0 ? 'text-green-500' : member.progressScore < 0 ? 'text-red-500' : 'text-neutral-400'
                                            }`}>
                                            {member.progressScore > 0 ? '+' : ''}{member.progressScore}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Member Detail / Form */}
                <div className="lg:col-span-2">
                    {selectedMember ? (
                        <MemberHealthDetail member={selectedMember} />
                    ) : (
                        <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                            <Scale size={48} className="text-neutral-700 mb-4" />
                            <p className="text-neutral-500 text-center">
                                Chọn một hội viên để xem hoặc nhập chỉ số sức khỏe
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Alerts & Needs Attention */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positive Progress */}
                <div className="bg-[#121214] border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-green-500" />
                        <h3 className="font-bold text-white">Tiến Bộ Tích Cực</h3>
                    </div>
                    <div className="space-y-2">
                        {safeMembers
                            .filter(m => m.progressScore && m.progressScore > 30)
                            .slice(0, 5)
                            .map(member => (
                                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-green-500/5">
                                    <img src={member.avatar} alt="" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm text-white flex-1">{member.name}</span>
                                    <span className="text-xs font-bold text-green-500">+{member.progressScore}</span>
                                </div>
                            ))}
                        {stats.positive === 0 && (
                            <p className="text-sm text-neutral-500">Chưa có dữ liệu tiến bộ</p>
                        )}
                    </div>
                </div>

                {/* Needs Attention */}
                <div className="bg-[#121214] border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={20} className="text-red-500" />
                        <h3 className="font-bold text-white">Cần Quan Tâm</h3>
                    </div>
                    <div className="space-y-2">
                        {safeMembers
                            .filter(m => (m.progressScore && m.progressScore < -20) || m.riskLevel === 'high')
                            .slice(0, 5)
                            .map(member => (
                                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-red-500/5">
                                    <img src={member.avatar} alt="" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm text-white flex-1">{member.name}</span>
                                    <span className="text-xs font-bold text-red-500">{member.progressScore}</span>
                                    <button className="text-[10px] px-2 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                                        Liên hệ
                                    </button>
                                </div>
                            ))}
                        {stats.negative === 0 && (
                            <p className="text-sm text-neutral-500">Không có cảnh báo</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ========== MEMBER HEALTH DETAIL (PRO 360) ==========
function MemberHealthDetail({ member }: { member: Member }) {
    const { updateMember } = useMemberStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newMetrics, setNewMetrics] = useState<Partial<HealthMetrics>>({});

    const metrics = member.healthMetrics || [];
    const latestMetrics = metrics[0];
    const previousMetrics = metrics[1];

    // Mock Capability Data for Radar Chart (Pro Feature)
    const capabilityData = useMemo(() => [
        { subject: 'Sức Mạnh', A: Math.min(((latestMetrics?.muscleMass || 20) * 3), 100), fullMark: 100 },
        { subject: 'Sức Bền', A: Math.min(member.sessionsUsed * 1.5, 100), fullMark: 100 },
        { subject: 'Kỷ Luật', A: Math.min(((member.sessionsUsed / (member.sessionsTotal || 100)) * 100), 100), fullMark: 100 },
        { subject: 'Body', A: (member.progressScore ? Math.min(50 + member.progressScore, 100) : 60), fullMark: 100 },
        { subject: 'Kỹ Thuật', A: 75, fullMark: 100 },
    ], [member, latestMetrics]);

    const handleAddMetrics = () => {
        if (!newMetrics.weight) {
            toast.error('Vui lòng nhập cân nặng');
            return;
        }

        const newRecord: HealthMetrics = {
            id: `HM-${Date.now()}`,
            recordDate: new Date().toISOString(),
            recordedBy: 'Staff',
            weight: newMetrics.weight || 0,
            height: newMetrics.height || latestMetrics?.height,
            bodyFat: newMetrics.bodyFat,
            muscleMass: newMetrics.muscleMass,
            waist: newMetrics.waist,
            chest: newMetrics.chest,
            hips: newMetrics.hips,
            notes: newMetrics.notes
        };

        if (newRecord.height) {
            newRecord.bmi = parseFloat((newRecord.weight / Math.pow(newRecord.height / 100, 2)).toFixed(1));
        }

        const updatedMetrics = [newRecord, ...metrics];

        // Simple progress calc
        const weightDiff = previousMetrics ? previousMetrics.weight - newRecord.weight : 0;
        const muscleDiff = previousMetrics && newRecord.muscleMass && previousMetrics.muscleMass ? newRecord.muscleMass - previousMetrics.muscleMass : 0;
        const progressScore = Math.round((muscleDiff * 5) + (weightDiff * 2)); // Mock logic

        updateMember(member.id, {
            healthMetrics: updatedMetrics,
            progressScore: (member.progressScore || 0) + progressScore
        });

        setIsEditing(false);
        setNewMetrics({});
        toast.success('Đã cập nhật chỉ số sức khỏe');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            {/* 1. Header Profile 360 */}
            <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-neutral-800 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="flex items-start gap-6 relative z-10">
                    <div className="relative">
                        <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} alt="" className="w-24 h-24 rounded-full border-4 border-[#262626] shadow-xl" />
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-[#1a1a1c]">
                            LEGEND RANK
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black text-white">{member.name}</h2>
                                <p className="text-neutral-500 flex items-center gap-2 mt-1">
                                    <User size={14} /> ID: {member.id} • {member.phone}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                {isEditing ? 'Hủy Bỏ' : '+ Đo Chỉ Số Mới'}
                            </button>
                        </div>

                        {/* Level Progress */}
                        <div className="mt-6">
                            <div className="flex justify-between text-xs font-bold text-neutral-400 mb-1">
                                <span>Level Progress</span>
                                <span>{member.sessionsUsed} / 200 Sessions to Legend</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[75%] relative">
                                    <div className="absolute right-0 top-0 h-full w-2 bg-white/50 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="bg-[#1a1a1c] p-4 rounded-2xl border border-neutral-800 h-[320px] relative">
                    <h4 className="font-bold text-white mb-2 absolute top-4 left-4 flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-500" />
                        Hồ Sơ Năng Lực
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="55%" outerRadius="70%" data={capabilityData}>
                            <PolarGrid stroke="#404040" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Member" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.5} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase">
                            <Scale size={14} /> Cân nặng
                        </div>
                        <div>
                            <span className="text-3xl font-black text-white">{latestMetrics?.weight || '--'}</span>
                            <span className="text-sm text-neutral-500 ml-1">kg</span>
                        </div>
                        <div className="text-xs text-green-500 flex items-center gap-1">
                            <ArrowDownRight size={12} /> Giảm 2.5kg
                        </div>
                    </div>
                    <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase">
                            <Dna size={14} /> Cơ bắp
                        </div>
                        <div>
                            <span className="text-3xl font-black text-white">{latestMetrics?.muscleMass || '--'}</span>
                            <span className="text-sm text-neutral-500 ml-1">kg</span>
                        </div>
                        <div className="text-xs text-blue-500 flex items-center gap-1">
                            <ArrowUpRight size={12} /> Tăng 1.2kg
                        </div>
                    </div>
                    <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase">
                            <Flame size={14} /> Mỡ cơ thể
                        </div>
                        <div>
                            <span className="text-3xl font-black text-white">{latestMetrics?.bodyFat || '--'}</span>
                            <span className="text-sm text-neutral-500 ml-1">%</span>
                        </div>
                        <div className="text-xs text-green-500 flex items-center gap-1">
                            <ArrowDownRight size={12} /> Giảm 1.5%
                        </div>
                    </div>
                    <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase">
                            <Activity size={14} /> BMI
                        </div>
                        <div>
                            <span className="text-3xl font-black text-white">{latestMetrics?.bmi || '--'}</span>
                        </div>
                        <div className="text-xs text-neutral-500">
                            Bình thường
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. New Record Form (Collapsible) */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#1a1a1c] border border-blue-500/30 rounded-2xl p-6 overflow-hidden"
                    >
                        {/* INPUT FORM CONTENT (Existing code) */}
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Plus size={18} className="text-blue-500" /> Nhập Chỉ Số Mới
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Cân nặng (kg)</label>
                                <input
                                    type="number"
                                    value={newMetrics.weight || ''}
                                    onChange={e => setNewMetrics({ ...newMetrics, weight: Number(e.target.value) })}
                                    className="w-full bg-[#121214] border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Cơ bắp (kg)</label>
                                <input
                                    type="number"
                                    value={newMetrics.muscleMass || ''}
                                    onChange={e => setNewMetrics({ ...newMetrics, muscleMass: Number(e.target.value) })}
                                    className="w-full bg-[#121214] border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Mỡ (%)</label>
                                <input
                                    type="number"
                                    value={newMetrics.bodyFat || ''}
                                    onChange={e => setNewMetrics({ ...newMetrics, bodyFat: Number(e.target.value) })}
                                    className="w-full bg-[#121214] border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Vòng bụng (cm)</label>
                                <input
                                    type="number"
                                    value={newMetrics.waist || ''}
                                    onChange={e => setNewMetrics({ ...newMetrics, waist: Number(e.target.value) })}
                                    className="w-full bg-[#121214] border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-4 mt-2">
                                <label className="text-xs text-neutral-500 mb-1 block">Đánh giá rủi ro / Cần quan tâm</label>
                                <select
                                    value={member.riskLevel || 'low'}
                                    onChange={(e) => {
                                        updateMember(member.id, { riskLevel: e.target.value as 'low' | 'medium' | 'high' });
                                    }}
                                    className="w-full bg-[#121214] border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="low">🟢 Ổn định (Low Risk) - Khách tập đều</option>
                                    <option value="medium">🟡 Cần theo dõi (Medium Check) - Có dấu hiệu chán</option>
                                    <option value="high">🔴 Báo động (High Alert) - CẦN QUAN TÂM ĐẶC BIỆT</option>
                                </select>
                                <p className="text-[10px] text-neutral-500 mt-1">* Chọn "Báo động" sẽ đưa hội viên này vào danh sách Cần Quan Tâm ngay lập tức.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddMetrics}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Lưu Kết Quả
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. ATTENDANCE HISTORY (Check-in Logs) */}
            <MemberAttendanceHistory member={member} />

        </div>
    );
}


// ========== ATTENDANCE HISTORY COMPONENT ==========
function MemberAttendanceHistory({ member }: { member: Member }) {
    const history = member.checkInHistory || [];

    // Group logs by month
    const groupedHistory = useMemo(() => {
        const groups: Record<string, any[]> = {};
        history.forEach(log => {
            const date = new Date(log.date);
            const key = format(date, 'MM/yyyy'); // "02/2026"
            if (!groups[key]) groups[key] = [];
            groups[key].push(log);
        });
        return groups;
    }, [history]);

    const sortedMonths = Object.keys(groupedHistory).sort((a, b) => {
        // Sort descending MM/YYYY
        const [mA, yA] = a.split('/').map(Number);
        const [mB, yB] = b.split('/').map(Number);
        return (yB - yA) || (mB - mA);
    });

    return (
        <div className="bg-[#1a1a1c] border border-neutral-800 rounded-2xl p-6">
            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-green-500" />
                Lịch Sử Điểm Danh
            </h4>

            {history.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                    Chưa có dữ liệu điểm danh
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedMonths.map((month) => (
                        <div key={month} className="relative pl-4 border-l border-neutral-800">
                            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a1a1c]"></div>
                            <h5 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">THÁNG {month}</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {groupedHistory[month].map((log, idx) => {
                                    const date = new Date(log.date);
                                    return (
                                        <div key={idx} className="bg-[#121214] border border-neutral-800 rounded-xl p-3 flex flex-col items-center hover:border-green-500/30 transition-all">
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase">{format(date, 'EEE')}</span>
                                            <span className="text-2xl font-black text-white">{format(date, 'dd')}</span>
                                            <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded mt-1">
                                                {format(date, 'HH:mm')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ========== HELPER COMPONENTS ==========

function StatCard({ label, value, subtext, icon: Icon, color, alert }: {
    label: string;
    value: number;
    subtext?: string;
    icon: any;
    color: string;
    alert?: boolean;
}) {
    const colors: Record<string, string> = {
        blue: 'text-blue-500 bg-blue-500/10',
        green: 'text-green-500 bg-green-500/10',
        emerald: 'text-emerald-500 bg-emerald-500/10',
        red: 'text-red-500 bg-red-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
        yellow: 'text-yellow-500 bg-yellow-500/10',
    };

    return (
        <div className={`bg-[#121214] border rounded-2xl p-4 ${alert ? 'border-yellow-500/30' : 'border-neutral-800'}`}>
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                <Icon size={20} />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-neutral-500">{label}</p>
            {subtext && <p className="text-[10px] text-neutral-600 mt-1">{subtext}</p>}
        </div>
    );
}


