// Members Screen & Member Detail
import { useState } from 'react';
import { UserPlus, Users, Clock, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemberStore } from '../../../store/useMemberStore';
import { AppHeader, HorizontalMenu, SearchInput, ListItem, NavFunction, Screen } from '../ui';

export const MembersScreen = ({ nav }: { nav: NavFunction }) => {
    const { members } = useMemberStore();
    const [search, setSearch] = useState('');
    const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

    const memberSubFeatures = [
        { icon: UserPlus, label: 'Thêm mới', desc: 'Đăng ký hội viên', screen: 'members_add' as Screen, color: 'bg-blue-600' },
        { icon: Users, label: 'Nhóm', desc: 'Quản lý nhóm tập', screen: 'members_groups' as Screen, color: 'bg-purple-600' },
        { icon: Clock, label: 'Hết hạn', desc: 'HV sắp hết hạn', screen: 'members_expired' as Screen, color: 'bg-red-600' },
        { icon: BarChart3, label: 'Thống kê', desc: 'Báo cáo hội viên', screen: 'members_stats' as Screen, color: 'bg-green-600' },
    ];

    return (
        <div className="p-6 pt-12 h-screen bg-[#030014] flex flex-col pb-32">
            <AppHeader nav={nav} showLogo={true} />

            {/* Sub-features horizontal menu */}
            <HorizontalMenu items={memberSubFeatures} nav={nav} />

            {/* Search */}
            <div className="my-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Tìm hội viên..." />
            </div>

            {/* Member List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {filtered.map(m => (
                    <ListItem
                        key={m.id}
                        avatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`}
                        title={m.name}
                        subtitle={m.email}
                        onClick={() => nav('member_detail', m)}
                    />
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-zinc-600 text-xs font-bold uppercase">Không tìm thấy hội viên</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const MemberDetailScreen = ({ member, nav }: { member: any, nav: NavFunction }) => (
    <div className="h-screen flex flex-col bg-[#030014] text-white pb-32 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-[#030014]/90 backdrop-blur-xl border-b border-white/5 z-10">
            <button onClick={() => nav('members')} className="p-3 bg-zinc-900 rounded-2xl border border-white/5">
                <ChevronLeft size={20} />
            </button>
            <h3 className="text-sm font-[1000] italic uppercase tracking-widest">Chi tiết HV</h3>
            <div className="w-12" />
        </div>

        {/* Profile */}
        <div className="p-6 text-center">
            <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.id}`}
                className="w-24 h-24 rounded-[2rem] border-2 border-primary/50 mx-auto mb-4"
            />
            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-1">{member?.name}</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{member?.id?.substring(0, 12)}</p>
        </div>

        {/* Info Cards */}
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Ngày tham gia</span>
                    <p className="text-sm font-bold">{member?.joinDate || 'N/A'}</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Ngày hết hạn</span>
                    <p className="text-sm font-bold text-red-400">{member?.expiryDate || 'N/A'}</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Email</span>
                    <p className="text-[10px] font-bold truncate">{member?.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Trạng thái</span>
                    <p className={`text-sm font-bold ${member?.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>{member?.status || 'N/A'}</p>
                </div>
            </div>

            <button className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-transform">
                Ghi nhận Metrics
            </button>
        </div>
    </div>
);
