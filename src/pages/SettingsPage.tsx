import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNutritionStore } from '../store/useNutritionStore';
import { AutomationSettings, AutomationLogs } from '../components/AutomationPanel';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    User, Database, FloppyDisk, ArrowCounterClockwise, Cpu, Lightning,
    CaretRight, Bell, Palette, Lock, Question, Info,
    House, Users, UserCheck, Barbell, ChartBar,
    TrendUp, Trophy, MapTrifold, SignOut
} from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';

// ============================================================
//  iOS 18 SETTINGS PAGE - Native Design
// ============================================================

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { goals, updateGoals } = useNutritionStore();
    const [localGoals, setLocalGoals] = useState({ ...goals });
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleLogout = async () => {
        await logout();
        toast.success('Đã đăng xuất!');
        navigate('/login');
    };

    const handleSaveGoals = () => {
        updateGoals(localGoals);
        toast.success("Đã cập nhật mục tiêu dinh dưỡng!");
    };

    // Main Settings List or detail view
    if (activeSection === 'nutrition') {
        return (
            <div className="ios-animate-in pb-4">
                <button onClick={() => setActiveSection(null)} className="text-[var(--ios-tint)] text-[15px] font-medium flex items-center gap-0 px-4 mb-2">
                    <CaretRight size={20} weight="bold" className="rotate-180" /> Cài đặt
                </button>

                <div className="mx-4 space-y-5">
                    {/* Nutrition Goals */}
                    <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-[var(--ios-separator)]">
                            <h3 className="text-[17px] font-semibold text-white">Mục tiêu dinh dưỡng</h3>
                            <p className="text-[13px] text-[var(--ios-text-secondary)] mt-1">Cấu hình chỉ số Macro hàng ngày</p>
                        </div>

                        <IOSInputRow label="Calories / ngày" value={localGoals.dailyCalories}
                            onChange={(v: number) => setLocalGoals({ ...localGoals, dailyCalories: v })} unit="kcal" />
                        <IOSInputRow label="Protein" value={localGoals.protein}
                            onChange={(v: number) => setLocalGoals({ ...localGoals, protein: v })} unit="g" color="#0A84FF" />
                        <IOSInputRow label="Carbs" value={localGoals.carbs}
                            onChange={(v: number) => setLocalGoals({ ...localGoals, carbs: v })} unit="g" color="#FF9F0A" />
                        <IOSInputRow label="Fat" value={localGoals.fat}
                            onChange={(v: number) => setLocalGoals({ ...localGoals, fat: v })} unit="g" last color="#30D158" />
                    </div>

                    <button onClick={handleSaveGoals} className="apple-btn apple-btn--filled w-full py-3.5 gap-2">
                        <FloppyDisk size={18} weight="duotone" /> Lưu cấu hình
                    </button>
                </div>
            </div>
        );
    }

    if (activeSection === 'automation') {
        return (
            <div className="ios-animate-in pb-4">
                <button onClick={() => setActiveSection(null)} className="text-[var(--ios-tint)] text-[15px] font-medium flex items-center gap-0 px-4 mb-2">
                    <CaretRight size={20} weight="bold" className="rotate-180" /> Cài đặt
                </button>
                <div className="mx-4 space-y-5">
                    <AutomationSettings />
                    <AutomationLogs />
                </div>
            </div>
        );
    }

    if (activeSection === 'data') {
        return (
            <div className="ios-animate-in pb-4">
                <button onClick={() => setActiveSection(null)} className="text-[var(--ios-tint)] text-[15px] font-medium flex items-center gap-0 px-4 mb-2">
                    <CaretRight size={20} weight="bold" className="rotate-180" /> Cài đặt
                </button>
                <div className="mx-4 space-y-5">
                    {/* Data Generator */}
                    <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-[var(--ios-separator)]">
                            <h3 className="text-[17px] font-semibold text-white">Tạo dữ liệu mẫu</h3>
                            <p className="text-[13px] text-[var(--ios-text-secondary)] mt-1">Dành cho môi trường phát triển</p>
                        </div>

                        <IOSActionRow label="Hội viên mẫu (x100)" desc="Tạo 100 khách hàng đầy đủ dữ liệu"
                            onClick={() => {
                                import('../utils/dataGenerator').then(({ generateMembers }) => {
                                    const members = generateMembers(100);
                                    localStorage.setItem('generated-members', JSON.stringify(members));
                                    toast.success(`Đã tạo ${members.length} hội viên mẫu!`);
                                    window.location.reload();
                                });
                            }} />

                        <IOSActionRow label="Nhiệm vụ mẫu (x100)" desc="Tạo 100 task CRM và follow-up"
                            onClick={() => {
                                import('../utils/dataGenerator').then(({ generateTasks }) => {
                                    const tasks = generateTasks(100);
                                    localStorage.setItem('generated-tasks', JSON.stringify(tasks));
                                    toast.success(`Đã tạo ${tasks.length} tasks mẫu!`);
                                });
                            }} />

                        <IOSActionRow label="Xuất dữ liệu (JSON)" desc="Tải toàn bộ dữ liệu máy khách"
                            onClick={() => {
                                const data: Record<string, any> = {};
                                for (let i = 0; i < localStorage.length; i++) {
                                    const key = localStorage.key(i);
                                    if (key) data[key] = JSON.parse(localStorage.getItem(key) || '{}');
                                }
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `tap-gyp-export-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                                toast.success("Đã xuất dữ liệu thành công!");
                            }} last />
                    </div>

                    {/* Full Initialize */}
                    <button
                        onClick={() => {
                            import('../utils/dataGenerator').then(({ generateAllData }) => {
                                const data = generateAllData();
                                localStorage.setItem('member-storage-v5', JSON.stringify({
                                    state: { members: data.members, schedule: data.schedule }, version: 0
                                }));
                                localStorage.setItem('member-automation-store-v1', JSON.stringify({
                                    state: {
                                        tasks: data.tasks, logs: data.logs, todayStats: data.todayStats,
                                        plans: [], isEngineRunning: true,
                                        lastEngineRun: new Date().toISOString(), n8nStatus: 'connected'
                                    }, version: 0
                                }));
                                toast.success('Đã khởi tạo toàn bộ dữ liệu!');
                                setTimeout(() => window.location.reload(), 1000);
                            });
                        }}
                        className="w-full py-3.5 bg-[#30D158] text-white rounded-2xl font-semibold text-[17px] active:scale-[0.98] transition-transform"
                    >
                        Khởi tạo toàn bộ hệ sinh thái 🚀
                    </button>

                    {/* Danger Zone */}
                    <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden mt-8">
                        <div className="p-4 border-b border-[var(--ios-separator)]">
                            <h3 className="text-[17px] font-semibold text-[#FF453A]">Vùng nguy hiểm</h3>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Bạn có chắc muốn xoá toàn bộ dữ liệu?')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 active:bg-[var(--ios-fill-tertiary)]"
                        >
                            <div className="flex items-center gap-3">
                                <ArrowCounterClockwise size={20} className="text-[#FF453A]" />
                                <div className="text-left">
                                    <p className="text-[15px] text-[#FF453A]">Xoá toàn bộ Database</p>
                                    <p className="text-[13px] text-[var(--ios-text-secondary)]">Không thể hoàn tác</p>
                                </div>
                            </div>
                            <CaretRight size={18} weight="bold" className="text-[var(--ios-text-tertiary)]" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========== MAIN SETTINGS LIST ==========
    return (
        <div className="ios-animate-in space-y-6 pb-4">

            {/* ===== APP MAP ===== */}
            <AppMapSection />

            {/* ===== TÀI KHOẢN ===== */}
            <div className="mx-4 mt-2">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Tài khoản</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--ios-tint)] to-[#FF8B5C] flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-white">{user?.displayName?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[17px] font-semibold text-white truncate">{user?.displayName || 'User'}</p>
                            <p className="text-[13px] text-[var(--ios-text-secondary)]">
                                {user?.role === 'admin' ? 'Quản lý phòng tập' : user?.role === 'pt' ? 'Huấn luyện viên' : 'Hội viên'}
                            </p>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase flex-shrink-0"
                            style={{
                                background: user?.role === 'admin' ? 'rgba(10,132,255,0.15)' : user?.role === 'pt' ? 'rgba(191,90,242,0.15)' : 'rgba(232,97,58,0.15)',
                                color: user?.role === 'admin' ? '#0A84FF' : user?.role === 'pt' ? '#BF5AF2' : '#E8613A',
                            }}>
                            {user?.role || 'member'}
                        </span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--ios-separator)' }}>
                        <button onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2.5 py-3.5 active:bg-[var(--ios-fill-tertiary)] transition-colors"
                            style={{ color: '#FF3B30' }}>
                            <SignOut size={18} weight="duotone" />
                            <span className="text-[16px] font-semibold">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== GENERAL SETTINGS ===== */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Cài đặt chung</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <IOSSettingsRow icon={User} label="Hồ sơ cá nhân" color="#0A84FF" onClick={() => { }} />
                    <IOSSettingsRow icon={Bell} label="Thông báo" color="#FF3B30" onClick={() => { }} />
                    <IOSSettingsRow icon={Palette} label="Giao diện" color="#BF5AF2" onClick={() => { }} />
                    <IOSSettingsRow icon={Lock} label="Bảo mật" color="#30D158" onClick={() => { }} last />
                </div>
            </div>

            {/* ===== APP SETTINGS ===== */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Ứng dụng</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <IOSSettingsRow icon={Lightning} label="Mục tiêu dinh dưỡng" color="#FF9F0A" onClick={() => setActiveSection('nutrition')} />
                    <IOSSettingsRow icon={Cpu} label="Hệ thống tự động" color="#64D2FF" onClick={() => setActiveSection('automation')} />
                    <IOSSettingsRow icon={Database} label="Quản lý dữ liệu" color="#30D158" onClick={() => setActiveSection('data')} last />
                </div>
            </div>

            {/* ===== ABOUT ===== */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Thông tin</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <IOSSettingsRow icon={Question} label="Trợ giúp" color="#8E8E93" onClick={() => { }} />
                    <IOSSettingsRow icon={Info} label="Về ứng dụng" subtitle="v4.92" color="#8E8E93" onClick={() => { }} last />
                </div>
            </div>

            {/* Version */}
            <p className="text-center text-[13px] text-[var(--ios-text-tertiary)] pb-8">TAP GYP v4.92 • Build 2026.02</p>
        </div>
    );
}

// ============================================================
//  APP MAP — Mindmap visual của toàn bộ app
//  Single source of truth: Admin vs Member, tính năng, luồng
// ============================================================

const APP_TREE = [
    {
        role: 'Admin / PT',
        color: '#0A84FF',
        icon: UserCheck,
        desc: 'Quản lý phòng gym',
        sections: [
            {
                path: '/', icon: House, label: 'Trang Chủ', color: '#0A84FF',
                nodes: ['🟢 Live check-in (ai đang tập)', '📊 Doanh thu ước tính', '🧾 Phân loại gói tập', '⚠️ Cảnh báo hết hạn', '👤 PT & HV phụ trách'],
            },
            {
                path: '/members', icon: Users, label: 'Hội Viên', color: '#30D158',
                nodes: ['✅ Check-in double-tap', '📋 D.sách · tìm kiếm · lọc', '📊 Tổng kê: retention + PT', '🏥 Sinh trắc học', '🤖 Tự động hoá AI', '📈 Báo cáo nâng cao'],
            },
            {
                path: '/pt', icon: UserCheck, label: 'Huấn Luyện Viên', color: '#BF5AF2',
                nodes: ['👤 Profile · chuyên môn · rating', '📊 Số HV đang phụ trách', '🔍 Tìm kiếm · lọc theo status'],
            },
            {
                path: '/gym', icon: Barbell, label: 'Phòng Gym', color: '#FF9F0A',
                nodes: ['📅 Lịch tập tuần (PPL, Full...)', '📝 Nhật ký bài tập', '💪 Thể tích tổng · Best 1RM'],
            },
            {
                path: '/analytics', icon: ChartBar, label: 'Phân Tích', color: '#FF453A',
                nodes: ['📋 Hiệu suất công việc (7 ngày)', '🏋️ Khối lượng gym (7 ngày)', '🥗 Xu hướng dinh dưỡng', '🔥 Heatmap kiên trì (28 ngày)'],
            },
        ],
    },
    {
        role: 'Hội Viên',
        color: '#30D158',
        icon: Users,
        desc: 'Theo dõi tập luyện cá nhân',
        sections: [
            {
                path: '/', icon: House, label: 'Trang Chủ', color: '#30D158',
                nodes: ['💍 Ring tiến độ buổi tập', '📅 Calendar check-in tuần', '🔥 Streak ngày liên tiếp', '🏆 Rank: Newbie→Pro→Elite→Legend'],
            },
            {
                path: '/exercises', icon: Barbell, label: 'Bài Tập', color: '#0A84FF',
                nodes: ['7 nhóm cơ: Ngực·Lưng·Chân·Vai·Tay·Bụng·Full', '🎬 GIF minh hoạ từng động tác', '📖 Hướng dẫn từng bước chi tiết', '🎯 Độ khó: Cơ bản / Trung bình / Nâng cao'],
            },
            {
                path: '/my-progress', icon: TrendUp, label: 'Tiến Trình', color: '#FF9F0A',
                nodes: ['⚡ Tần suất check-in 7 ngày', '📊 Sessions/tuần · 12 tuần', '💪 Cân nặng · Mỡ · Cơ · BMI', '📌 So sánh trước / hiện tại'],
            },
            {
                path: '/my-stats', icon: Trophy, label: 'Thống Kê', color: '#BF5AF2',
                nodes: ['🔥 Streak ngày liên tiếp', '📆 Buổi tập 7 ngày / 30 ngày', '🗓 Calendar heatmap tháng này'],
            },
        ],
    },
];

function AppMapSection() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mx-4 mb-2">
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:opacity-75 transition-opacity"
                style={{ background: 'var(--ios-card-bg)', boxShadow: 'var(--ios-shadow-card)' }}
            >
                <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: '#FF9F0A' }}>
                    <MapTrifold size={18} weight="duotone" color="white" />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-[16px] font-semibold">Bản Đồ Ứng Dụng</p>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--ios-tertiary)' }}>Tất cả tính năng · không trùng lặp</p>
                </div>
                <CaretRight size={17} weight="bold" className="transition-transform" style={{ color: 'var(--ios-tertiary)', transform: expanded ? 'rotate(90deg)' : 'none' }} />
            </button>

            {expanded && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-4">
                    {APP_TREE.map(role => (
                        <div key={role.role}>
                            {/* Role node */}
                            <div className="flex items-center gap-2 px-2 mb-2">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: role.color }}>
                                    <role.icon size={12} color="white" weight="fill" />
                                </div>
                                <p className="text-[13px] font-bold" style={{ color: role.color }}>{role.role}</p>
                                <p className="text-[11px]" style={{ color: 'var(--ios-tertiary)' }}>— {role.desc}</p>
                            </div>

                            {/* Section nodes */}
                            <div className="ml-4 space-y-2.5 border-l-2 pl-4" style={{ borderColor: `${role.color}30` }}>
                                {role.sections.map(sec => (
                                    <Link to={sec.path} key={sec.path + sec.label} className="block">
                                        <div className="rounded-2xl p-3.5 active:opacity-75 transition-opacity" style={{ background: 'var(--ios-card-bg)', boxShadow: 'var(--ios-shadow-card)' }}>
                                            {/* Section header */}
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${sec.color}20` }}>
                                                    <sec.icon size={14} weight="duotone" style={{ color: sec.color }} />
                                                </div>
                                                <p className="text-[14px] font-semibold">{sec.label}</p>
                                                <CaretRight size={13} weight="bold" style={{ color: 'var(--ios-tertiary)', marginLeft: 'auto' }} />
                                            </div>
                                            {/* Child nodes — mindmap bullets */}
                                            <div className="space-y-1">
                                                {sec.nodes.map((node, ni) => (
                                                    <div key={ni} className="flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: `${sec.color}60` }} />
                                                        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--ios-secondary)' }}>{node}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

// ============================================================
//  iOS Sub-Components
// ============================================================

function IOSSettingsRow({ icon: Icon, label, subtitle, color, onClick, last }: {
    icon: any; label: string; subtitle?: string; color: string; onClick: () => void; last?: boolean
}) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 p-4 active:bg-[var(--ios-fill-tertiary)] transition-colors text-left ${!last ? 'border-b border-[var(--ios-separator)]' : ''}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                <Icon size={18} weight="fill" className="text-white" />
            </div>
            <span className="flex-1 text-[17px] text-white">{label}</span>
            {subtitle && <span className="text-[15px] text-[var(--ios-text-secondary)] mr-1">{subtitle}</span>}
            <CaretRight size={18} weight="bold" className="text-[var(--ios-text-tertiary)]" />
        </button>
    );
}

function IOSInputRow({ label, value, onChange, unit, color, last }: {
    label: string; value: number; onChange: (v: number) => void; unit: string; color?: string; last?: boolean
}) {
    return (
        <div className={`flex items-center justify-between p-4 ${!last ? 'border-b border-[var(--ios-separator)]' : ''}`}>
            <div className="flex items-center gap-2">
                {color && <div className="w-3 h-3 rounded-full" style={{ background: color }} />}
                <span className="text-[17px] text-white">{label}</span>
            </div>
            <div className="flex items-center gap-1">
                <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
                    className="w-20 text-right bg-transparent text-[17px] text-[var(--ios-tint)] font-semibold outline-none tabular-nums" />
                <span className="text-[15px] text-[var(--ios-text-secondary)]">{unit}</span>
            </div>
        </div>
    );
}

function IOSActionRow({ label, desc, onClick, last }: {
    label: string; desc: string; onClick: () => void; last?: boolean
}) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 p-4 active:bg-[var(--ios-fill-tertiary)] transition-colors text-left ${!last ? 'border-b border-[var(--ios-separator)]' : ''}`}>
            <div className="flex-1">
                <p className="text-[15px] text-white">{label}</p>
                <p className="text-[13px] text-[var(--ios-text-secondary)] mt-0.5">{desc}</p>
            </div>
            <div className="px-3 py-1.5 bg-[#30D158] rounded-lg text-white text-[13px] font-semibold active:scale-95">
                Tạo
            </div>
        </button>
    );
}
