import { useState } from 'react';
import { useAutomationEngine } from './AutomationEngine';
import { useAutomationStore, type AutomationPlan } from '../store/useAutomationStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit, Zap, Bell, X, ChevronRight,
    Settings, Power, Activity, CheckCircle,
    AlertTriangle, Lightbulb,
    Flame, Droplets, Dumbbell,
    Coffee, Gift, Repeat
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * AUTOMATION PANEL - BẢNG ĐIỀU KHIỂN TỰ ĐỘNG HÓA
 * 
 * Hiển thị trạng thái engine, các gợi ý đang chờ xử lý,
 * và cho phép người dùng quản lý các kế hoạch tự động.
 */

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, any> = {
    energy: Zap,
    training: Dumbbell,
    nutrition: Droplets,
    mindset: Flame,
    system: Settings
};

const CATEGORY_COLORS: Record<string, string> = {
    energy: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    training: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    nutrition: 'text-green-500 bg-green-500/10 border-green-500/20',
    mindset: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    system: 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20'
};

const CATEGORY_NAMES: Record<string, string> = {
    energy: 'Năng Lượng',
    training: 'Tập Luyện',
    nutrition: 'Dinh Dưỡng',
    mindset: 'Tâm Lý',
    system: 'Hệ Thống'
};

const SUGGESTION_ICONS: Record<string, any> = {
    'zap': Zap,
    'alert-triangle': AlertTriangle,
    'coffee': Coffee,
    'gift': Gift,
    'repeat': Repeat,
    'droplet': Droplets,
    'flame': Flame
};

interface AutomationPanelProps {
    compact?: boolean;
}

export function AutomationPanel({ compact = false }: AutomationPanelProps) {
    const {
        pendingSuggestions,
        isEngineRunning,
        lastEngineRun,
        enabledPlansCount,
        totalPlansCount,
        totalTriggersToday,
        dismissSuggestion
    } = useAutomationEngine();

    const [_isExpanded, setIsExpanded] = useState(false);

    if (compact) {
        return (
            <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isEngineRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Engine</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                        {enabledPlansCount}/{totalPlansCount} plans
                    </span>
                </div>

                {pendingSuggestions.length > 0 && (
                    <div className="space-y-2">
                        {pendingSuggestions.slice(0, 2).map(suggestion => (
                            <div key={suggestion.id} className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
                                <div className="font-bold text-white">{suggestion.title}</div>
                                <div className="text-neutral-500 line-clamp-1">{suggestion.message}</div>
                            </div>
                        ))}
                        {pendingSuggestions.length > 2 && (
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="text-[10px] text-blue-500 hover:underline"
                            >
                                +{pendingSuggestions.length - 2} gợi ý khác
                            </button>
                        )}
                    </div>
                )}

                {pendingSuggestions.length === 0 && (
                    <div className="text-center text-neutral-600 text-xs py-2">
                        Chưa có gợi ý mới
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#121214] border border-neutral-800 rounded-[2rem] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 bg-[#0c0c0e]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isEngineRunning ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <BrainCircuit className={isEngineRunning ? 'text-green-500' : 'text-red-500'} size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Bộ Não Tự Động</h3>
                            <p className="text-xs text-neutral-500">
                                {isEngineRunning ? 'Đang hoạt động' : 'Đã tắt'} • {enabledPlansCount} kế hoạch kích hoạt
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-2xl font-black text-white">{totalTriggersToday}</div>
                            <div className="text-[10px] text-neutral-500 uppercase">Kích hoạt hôm nay</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Suggestions */}
            {pendingSuggestions.length > 0 && (
                <div className="p-6 border-b border-neutral-800">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Lightbulb size={14} /> Gợi ý đang chờ ({pendingSuggestions.length})
                    </h4>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {pendingSuggestions.map(suggestion => (
                                <motion.div
                                    key={suggestion.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={`p-4 rounded-xl border ${suggestion.priority === 'high'
                                        ? 'bg-orange-500/10 border-orange-500/20'
                                        : 'bg-neutral-900 border-neutral-800'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg text-blue-400">
                                                    {(() => {
                                                        const IconComponent = SUGGESTION_ICONS[suggestion.icon] || Zap;
                                                        return <IconComponent size={18} />;
                                                    })()}
                                                </span>
                                                <span className="font-bold text-white">{suggestion.title}</span>
                                                {suggestion.priority === 'high' && (
                                                    <span className="px-1.5 py-0.5 bg-orange-500 text-black text-[9px] font-bold rounded uppercase">
                                                        Quan trọng
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-neutral-400">{suggestion.message}</p>
                                            {suggestion.actionLabel && (
                                                <button className="mt-2 text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
                                                    {suggestion.actionLabel} <ChevronRight size={12} />
                                                </button>
                                            )}
                                        </div>
                                        {suggestion.dismissable && (
                                            <button
                                                onClick={() => dismissSuggestion(suggestion.id)}
                                                className="p-1 hover:bg-white/10 rounded-lg text-neutral-500 hover:text-white transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="p-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-xl font-black text-blue-500">{enabledPlansCount}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">Đang bật</div>
                </div>
                <div className="text-center border-x border-neutral-800">
                    <div className="text-xl font-black text-green-500">{totalTriggersToday}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">Hôm nay</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-black text-purple-500">{pendingSuggestions.length}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">Chờ xử lý</div>
                </div>
            </div>

            {/* Last Run */}
            {lastEngineRun && (
                <div className="px-6 pb-4 text-center">
                    <span className="text-[10px] text-neutral-600">
                        Lần chạy cuối: {format(new Date(lastEngineRun), 'HH:mm:ss dd/MM', { locale: vi })}
                    </span>
                </div>
            )}
        </div>
    );
}

/**
 * AUTOMATION SETTINGS - CÀI ĐẶT TỰ ĐỘNG HÓA
 * 
 * Cho phép người dùng bật/tắt từng kế hoạch và xem chi tiết.
 */
export function AutomationSettings() {
    const { plans, togglePlan } = useAutomationStore();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<AutomationPlan | null>(null);

    const categories = ['energy', 'training', 'nutrition', 'mindset'];
    const filteredPlans = selectedCategory
        ? plans.filter(p => p.category === selectedCategory)
        : plans;

    return (
        <div className="bg-[#121214] border border-neutral-800 rounded-[2rem] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 bg-[#0c0c0e]">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Settings className="text-neutral-400" /> Quản Lý Kế Hoạch Tự Động
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                    Bật/tắt các kế hoạch theo nhu cầu của bạn
                </p>
            </div>

            {/* Category Filters */}
            <div className="p-4 border-b border-neutral-800 flex gap-2 overflow-x-auto">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${!selectedCategory
                        ? 'bg-white text-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                >
                    Tất cả ({plans.length})
                </button>
                {categories.map(cat => {
                    const Icon = CATEGORY_ICONS[cat];
                    const count = plans.filter(p => p.category === cat).length;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${selectedCategory === cat
                                ? CATEGORY_COLORS[cat].replace('bg-', 'bg-').replace('/10', '')
                                : 'bg-neutral-900 text-neutral-400 hover:text-white'
                                }`}
                        >
                            <Icon size={12} />
                            {CATEGORY_NAMES[cat]} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Plans List */}
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {filteredPlans.map(plan => {
                    const Icon = CATEGORY_ICONS[plan.category];
                    const colorClass = CATEGORY_COLORS[plan.category];

                    return (
                        <div
                            key={plan.id}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${plan.enabled
                                ? colorClass
                                : 'bg-neutral-900/50 border-neutral-800 opacity-60'
                                }`}
                            onClick={() => setSelectedPlan(plan)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg bg-black/20`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-white text-sm flex items-center gap-2">
                                            {plan.nameVi}
                                            {plan.triggerCount > 0 && (
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">
                                                    x{plan.triggerCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-neutral-400 line-clamp-1">
                                            {plan.description}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlan(plan.id); }}
                                    className={`p-2 rounded-lg transition-colors ${plan.enabled
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-neutral-800 text-neutral-600'
                                        }`}
                                >
                                    <Power size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Plan Detail Modal */}
            <AnimatePresence>
                {selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#121214] w-full max-w-md rounded-2xl border border-neutral-800 overflow-hidden"
                        >
                            <div className="p-6 border-b border-neutral-800 flex items-start justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-lg">{selectedPlan.nameVi}</h4>
                                    <p className="text-xs text-neutral-500 mt-1">{selectedPlan.name}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Mô tả</div>
                                    <div className="text-sm text-neutral-300">{selectedPlan.description}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Loại kích hoạt</div>
                                        <div className="text-sm text-white capitalize">{selectedPlan.triggerType.replace('_', ' ')}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Loại hành động</div>
                                        <div className="text-sm text-white capitalize">{selectedPlan.actionType.replace('_', ' ')}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Điều kiện</div>
                                    <div className="text-xs font-mono bg-black/30 p-2 rounded text-neutral-400">
                                        {selectedPlan.triggerCondition}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                                    <div className="text-xs text-neutral-500">
                                        Đã kích hoạt: <span className="text-white font-bold">{selectedPlan.triggerCount} lần</span>
                                    </div>
                                    <button
                                        onClick={() => { togglePlan(selectedPlan.id); setSelectedPlan(null); }}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm ${selectedPlan.enabled
                                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                            : 'bg-green-500 text-black hover:bg-green-400'
                                            }`}
                                    >
                                        {selectedPlan.enabled ? 'Tắt kế hoạch' : 'Bật kế hoạch'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * AUTOMATION LOGS - LỊCH SỬ HOẠT ĐỘNG
 */
export function AutomationLogs() {
    const { logs } = useAutomationStore();

    return (
        <div className="bg-[#121214] border border-neutral-800 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-neutral-800 bg-[#0c0c0e]">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Activity className="text-blue-500" /> Lịch Sử Hoạt Động
                </h3>
            </div>
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {logs.length === 0 ? (
                    <div className="text-center text-neutral-600 py-8">
                        Chưa có hoạt động nào được ghi nhận
                    </div>
                ) : (
                    logs.slice(0, 20).map(log => (
                        <div
                            key={log.id}
                            className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800"
                        >
                            <div className={`p-1.5 rounded-lg ${log.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                log.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-blue-500/10 text-blue-500'
                                }`}>
                                {log.type === 'success' ? <CheckCircle size={14} /> :
                                    log.type === 'warning' ? <AlertTriangle size={14} /> :
                                        <Bell size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white">{log.planName}</div>
                                <div className="text-[11px] text-neutral-500 line-clamp-1">{log.message}</div>
                            </div>
                            <div className="text-[10px] text-neutral-600 font-mono whitespace-nowrap">
                                {format(new Date(log.timestamp), 'HH:mm', { locale: vi })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
