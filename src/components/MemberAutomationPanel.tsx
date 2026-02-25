import { useState } from 'react';
import { useMemberAutomation } from './MemberAutomationEngine';
import { useMemberAutomationStore } from '../store/useMemberAutomationStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit, Zap, Bell, X, ChevronRight,
    Settings, Power, Activity, CheckCircle,
    AlertTriangle, Lightbulb
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * MEMBER AUTOMATION PANEL - BẢNG ĐIỀU KHIỂN TỰ ĐỘNG HÓA HỘI VIÊN
 */

export function MemberAutomationDashboard() {
    const {
        isEngineRunning,
        lastRun,
        enabledPlansCount,
        totalPlansCount,
        stats,
        logs
    } = useMemberAutomation();

    const { plans, togglePlan } = useMemberAutomationStore();

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
                            <h3 className="font-bold text-white text-lg">Member Automation Engine</h3>
                            <p className="text-xs text-neutral-500">
                                {isEngineRunning ? 'Đang hoạt động' : 'Đã tắt'} • {enabledPlansCount}/{totalPlansCount} plans active
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <div className="text-2xl font-black text-blue-500">{stats?.expiringThisWeek || 0}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">Hết hạn tuần này</div>
                </div>
                <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <div className="text-2xl font-black text-green-500">{stats?.newSignups || 0}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">Đăng ký mới</div>
                </div>
                <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <div className="text-2xl font-black text-purple-500">{stats?.n8nExecutions || 0}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">n8n Executions</div>
                </div>
                <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <div className="text-2xl font-black text-orange-500">{stats?.atRiskMembers || 0}</div>
                    <div className="text-[10px] text-neutral-500 uppercase">Nguy cơ rời bỏ</div>
                </div>
            </div>

            {/* Logs */}
            <div className="p-6 border-t border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={16} /> Activity Logs
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {logs.map(log => (
                        <div key={log.id} className="flex items-center gap-3 p-3 bg-neutral-900/30 rounded-lg border border-neutral-800/50">
                            <div className={`p-1.5 rounded-lg ${log.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                    log.type === 'critical' ? 'bg-red-500/10 text-red-500' :
                                        log.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-blue-500/10 text-blue-500'
                                }`}>
                                {log.type === 'success' ? <CheckCircle size={14} /> :
                                    log.type === 'critical' || log.type === 'warning' ? <AlertTriangle size={14} /> :
                                        <Activity size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-white">{log.planName}</div>
                                <div className="text-[11px] text-neutral-500 truncate">{log.message}</div>
                            </div>
                            <div className="text-[10px] text-neutral-600 font-mono">
                                {format(new Date(log.timestamp), 'HH:mm', { locale: vi })}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-center text-neutral-600 text-xs py-4">Chưa có hoạt động nào</div>
                    )}
                </div>
            </div>
        </div>
    );
}
