// Bio Screen - Personal Profile
import { Activity, Target, Shield, Calendar, Settings, RefreshCw } from 'lucide-react';
import { useHealthStore } from '../../../store/useHealthStore';
import { AppHeader, SubMenuGrid, NavFunction, Screen } from '../ui';

export const BioScreen = ({ nav }: { nav: NavFunction }) => {
    const { syncWithDevice } = useHealthStore();

    const bioSubFeatures = [
        { icon: Activity, label: 'Sức khỏe', desc: 'Theo dõi chỉ số', screen: 'bio_health' as Screen, color: 'bg-red-600' },
        { icon: Target, label: 'Mục tiêu', desc: 'Cài đặt goals', screen: 'bio_goals' as Screen, color: 'bg-blue-600' },
        { icon: Shield, label: 'Thành tích', desc: 'Huy hiệu đạt được', screen: 'bio_achievements' as Screen, color: 'bg-yellow-600' },
        { icon: Calendar, label: 'Lịch tập', desc: 'Schedule', screen: 'bio_schedule' as Screen, color: 'bg-purple-600' },
        { icon: Settings, label: 'Cài đặt', desc: 'Tùy chỉnh cá nhân', screen: 'bio_settings' as Screen, color: 'bg-zinc-600' },
    ];

    return (
        <div className="p-6 pt-12 h-screen bg-[#030014] flex flex-col pb-32 overflow-y-auto no-scrollbar">
            <AppHeader nav={nav} showLogo={true} />

            {/* Profile Card */}
            <div className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-white/5 rounded-[2rem] mb-6">
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    className="w-16 h-16 rounded-[1.5rem] border border-primary/30"
                />
                <div className="flex-1">
                    <h2 className="text-xl font-[1000] text-white italic uppercase tracking-tighter">COACH FELIX</h2>
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">ELITE OPERATIVE</span>
                </div>
                <button
                    onClick={() => syncWithDevice()}
                    className="p-2 bg-primary/20 rounded-xl text-primary active:scale-95 transition-transform"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Sub-features */}
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Quản lý cá nhân</h3>
            <SubMenuGrid items={bioSubFeatures} nav={nav} />
        </div>
    );
};
