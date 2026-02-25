import { useState } from 'react';
import { useNutritionStore } from '../store/useNutritionStore';
import { AutomationSettings, AutomationLogs } from '../components/AutomationPanel';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
    User, Shield, Database, Save, RotateCcw, Cpu, Zap,
    ChevronRight, Bell, Palette, Lock, HelpCircle, Info
} from 'lucide-react';

// ============================================================
//  iOS 18 SETTINGS PAGE - Native Design
// ============================================================

export default function SettingsPage() {
    const { goals, updateGoals } = useNutritionStore();
    const [localGoals, setLocalGoals] = useState({ ...goals });
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleSaveGoals = () => {
        updateGoals(localGoals);
        toast.success("Đã cập nhật mục tiêu dinh dưỡng!");
    };

    // Main Settings List or detail view
    if (activeSection === 'nutrition') {
        return (
            <div className="ios-animate-in pb-4">
                <button onClick={() => setActiveSection(null)} className="text-[var(--ios-tint)] text-[15px] font-medium flex items-center gap-0 px-4 mb-2">
                    <ChevronRight size={20} className="rotate-180" /> Cài đặt
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

                    <button onClick={handleSaveGoals} className="w-full py-3.5 bg-[var(--ios-tint)] text-white rounded-2xl font-semibold text-[17px] active:scale-[0.98] transition-transform">
                        <Save size={18} className="inline mr-2" /> Lưu cấu hình
                    </button>
                </div>
            </div>
        );
    }

    if (activeSection === 'automation') {
        return (
            <div className="ios-animate-in pb-4">
                <button onClick={() => setActiveSection(null)} className="text-[var(--ios-tint)] text-[15px] font-medium flex items-center gap-0 px-4 mb-2">
                    <ChevronRight size={20} className="rotate-180" /> Cài đặt
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
                    <ChevronRight size={20} className="rotate-180" /> Cài đặt
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
                                <RotateCcw size={20} className="text-[#FF453A]" />
                                <div className="text-left">
                                    <p className="text-[15px] text-[#FF453A]">Xoá toàn bộ Database</p>
                                    <p className="text-[13px] text-[var(--ios-text-secondary)]">Không thể hoàn tác</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-[var(--ios-text-tertiary)]" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========== MAIN SETTINGS LIST ==========
    return (
        <div className="ios-animate-in space-y-6 pb-4">

            {/* ===== PROFILE CARD ===== */}
            <div className="mx-4 mt-2">
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4 flex items-center gap-4 active:bg-[var(--ios-fill-tertiary)] transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--ios-tint)] to-[#FF8B5C] flex items-center justify-center">
                        <span className="text-xl font-bold text-white">HP</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[17px] font-semibold text-white">Admin Hùng Phan</p>
                        <p className="text-[13px] text-[var(--ios-text-secondary)]">Quản lý phòng tập</p>
                    </div>
                    <ChevronRight size={20} className="text-[var(--ios-text-tertiary)]" />
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
                    <IOSSettingsRow icon={Zap} label="Mục tiêu dinh dưỡng" color="#FF9F0A" onClick={() => setActiveSection('nutrition')} />
                    <IOSSettingsRow icon={Cpu} label="Hệ thống tự động" color="#64D2FF" onClick={() => setActiveSection('automation')} />
                    <IOSSettingsRow icon={Database} label="Quản lý dữ liệu" color="#30D158" onClick={() => setActiveSection('data')} last />
                </div>
            </div>

            {/* ===== ABOUT ===== */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Thông tin</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <IOSSettingsRow icon={HelpCircle} label="Trợ giúp" color="#8E8E93" onClick={() => { }} />
                    <IOSSettingsRow icon={Info} label="Về ứng dụng" subtitle="v4.92" color="#8E8E93" onClick={() => { }} last />
                </div>
            </div>

            {/* Version */}
            <p className="text-center text-[13px] text-[var(--ios-text-tertiary)] pb-8">TAP GYP v4.92 • Build 2026.02</p>
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
                <Icon size={18} className="text-white" />
            </div>
            <span className="flex-1 text-[17px] text-white">{label}</span>
            {subtitle && <span className="text-[15px] text-[var(--ios-text-secondary)] mr-1">{subtitle}</span>}
            <ChevronRight size={18} className="text-[var(--ios-text-tertiary)]" />
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
