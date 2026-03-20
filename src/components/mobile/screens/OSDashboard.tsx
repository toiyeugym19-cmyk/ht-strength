// OS Dashboard Screen
import { PieChart, Calendar, Bell, FileText, Settings, Users, UserCheck } from 'lucide-react';
import { useMemberStore } from '../../../store/useMemberStore';
import { AppHeader, SubMenuGrid, KPICard, NavFunction, Screen } from '../ui';

export const OSDashboard = ({ nav }: { nav: NavFunction }) => {
    const { members } = useMemberStore();
    const activeCount = members.filter(m => m.status === 'Active').length;

    const osSubFeatures = [
        { icon: PieChart, label: 'Analytics', desc: 'Thống kê tổng quan', screen: 'os_analytics' as Screen, color: 'bg-blue-600' },
        { icon: Calendar, label: 'Lịch', desc: 'Quản lý lịch trình', screen: 'os_calendar' as Screen, color: 'bg-purple-600' },
        { icon: Bell, label: 'Thông báo', desc: 'Cảnh báo hệ thống', screen: 'os_notifications' as Screen, color: 'bg-yellow-600' },
        { icon: FileText, label: 'Báo cáo', desc: 'Xuất dữ liệu', screen: 'os_reports' as Screen, color: 'bg-green-600' },
        { icon: Settings, label: 'Cài đặt', desc: 'Tùy chỉnh hệ thống', screen: 'os_settings' as Screen, color: 'bg-zinc-600' },
    ];

    return (
        <div className="p-6 pt-12 h-screen bg-[#030014] overflow-y-auto no-scrollbar pb-32">
            {/* Header with Logo */}
            <AppHeader nav={nav} showLogo={true} showHomeButton={false} />

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <KPICard
                    icon={Users}
                    label="Tổng HV"
                    value={members.length}
                    color="blue"
                    onClick={() => nav('members')}
                />
                <KPICard
                    icon={UserCheck}
                    label="Đang tập"
                    value={activeCount}
                    color="green"
                    onClick={() => nav('members')}
                />
            </div>

            {/* Sub-features */}
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Chức năng OS</h3>
            <SubMenuGrid items={osSubFeatures} nav={nav} />
        </div>
    );
};
