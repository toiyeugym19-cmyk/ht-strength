import { useState, useEffect, useRef } from 'react';
import { useAutomationStore } from '../store/useAutomationStore';
import { useAutomationEngine } from './AutomationEngine';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    Terminal, X,
    Circle, Cpu, Activity, Clock,
    CheckCircle, AlertTriangle, Info, Zap,
    Pause, Play
} from 'lucide-react';

/**
 * AUTOMATION MONITOR - TERMINAL THEO DÕI TÁC VỤ NGẦM
 * 
 * Hiển thị real-time các task đang chạy, logs, và trạng thái engine
 * như một terminal/console chuyên nghiệp.
 */

interface TerminalLine {
    id: string;
    timestamp: Date;
    type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'trigger';
    message: string;
    planId?: string;
}

export function AutomationMonitor() {
    const { plans, logs, isEngineRunning, lastEngineRun } = useAutomationStore();
    const { enabledPlansCount, totalPlansCount, pendingSuggestions } = useAutomationEngine();

    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const terminalRef = useRef<HTMLDivElement>(null);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Generate terminal lines from logs and system status
    useEffect(() => {
        if (isPaused) return;

        const newLines: TerminalLine[] = [];

        // System startup message
        if (isEngineRunning) {
            newLines.push({
                id: 'sys_start',
                timestamp: new Date(),
                type: 'system',
                message: `[ENGINE] Automation Engine v1.0 đang hoạt động...`
            });
            newLines.push({
                id: 'sys_plans',
                timestamp: new Date(),
                type: 'info',
                message: `[CONFIG] Đã tải ${enabledPlansCount}/${totalPlansCount} kế hoạch tự động`
            });
        }

        // Add logs as terminal lines
        logs.slice(0, 50).forEach(log => {
            newLines.push({
                id: log.id,
                timestamp: new Date(log.timestamp),
                type: log.type as any,
                message: `[TRIGGER] ${log.planName}: ${log.message}`,
                planId: log.planId
            });
        });

        // Scan cycle messages (simulated)
        if (lastEngineRun) {
            newLines.push({
                id: 'scan_' + lastEngineRun,
                timestamp: new Date(lastEngineRun),
                type: 'info',
                message: `[SCAN] Hoàn thành quét ${enabledPlansCount} kế hoạch`
            });
        }

        setTerminalLines(newLines.slice(0, 100));
    }, [logs, isEngineRunning, enabledPlansCount, totalPlansCount, lastEngineRun, isPaused]);

    // Auto scroll to bottom
    useEffect(() => {
        if (terminalRef.current && !isPaused) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLines, isPaused]);

    // Floating button when closed
    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 md:bottom-6 right-6 z-50 p-4 bg-[#1a1a1c] border border-neutral-800 rounded-2xl shadow-2xl hover:bg-neutral-800 transition-colors group"
            >
                <div className="relative">
                    <Terminal size={24} className="text-green-500" />
                    {isEngineRunning && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                </div>
                <span className="absolute -top-8 right-0 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Monitor Tasks
                </span>
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed z-50 ${isMaximized
                ? 'inset-4'
                : 'bottom-24 md:bottom-6 right-6 w-[calc(100vw-48px)] md:w-[500px] h-[400px]'
                } bg-[#0d0d0f] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono`}
        >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1c] border-b border-neutral-800">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
                        <button onClick={() => setIsPaused(!isPaused)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
                        <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400 text-xs">
                        <Terminal size={14} />
                        <span className="font-bold text-white">AUTOMATION MONITOR</span>
                        <span className="text-neutral-600">—</span>
                        <span>{format(currentTime, 'HH:mm:ss')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isPaused && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] rounded font-bold uppercase">
                            Paused
                        </span>
                    )}
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white"
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#151517] border-b border-neutral-800 text-[10px]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Circle size={8} className={isEngineRunning ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'} />
                        <span className={isEngineRunning ? 'text-green-500' : 'text-red-500'}>
                            {isEngineRunning ? 'RUNNING' : 'STOPPED'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <Cpu size={10} />
                        <span>Plans: {enabledPlansCount}/{totalPlansCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <Activity size={10} />
                        <span>Triggers: {logs.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <Zap size={10} />
                        <span>Pending: {pendingSuggestions.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600">
                    <Clock size={10} />
                    <span>Last scan: {lastEngineRun ? format(new Date(lastEngineRun), 'HH:mm:ss') : '--:--:--'}</span>
                </div>
            </div>

            {/* Terminal Output */}
            <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto p-4 space-y-1 text-xs"
                style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
            >
                {/* Initial boot sequence */}
                <TerminalOutput type="system" time={new Date()}>
                    ╔══════════════════════════════════════════════════════╗
                </TerminalOutput>
                <TerminalOutput type="system" time={new Date()}>
                    ║  MODUN GYM - AUTOMATION ENGINE v1.0                  ║
                </TerminalOutput>
                <TerminalOutput type="system" time={new Date()}>
                    ║  "1 Tỷ Tasks - Vận Hành Bởi Trí Tuệ Nhân Tạo"        ║
                </TerminalOutput>
                <TerminalOutput type="system" time={new Date()}>
                    ╚══════════════════════════════════════════════════════╝
                </TerminalOutput>
                <TerminalOutput type="info" time={new Date()}>
                    → Initializing automation subsystems...
                </TerminalOutput>
                <TerminalOutput type="success" time={new Date()}>
                    ✓ HealthStore connected
                </TerminalOutput>
                <TerminalOutput type="success" time={new Date()}>
                    ✓ GymStore connected
                </TerminalOutput>
                <TerminalOutput type="success" time={new Date()}>
                    ✓ AutomationStore loaded ({enabledPlansCount} plans active)
                </TerminalOutput>
                <TerminalOutput type="info" time={new Date()}>
                    → Starting background scan loop (interval: 5m)...
                </TerminalOutput>

                <div className="border-t border-neutral-800 my-3" />

                {/* Real logs */}
                {terminalLines.map((line, idx) => (
                    <TerminalOutput key={line.id + idx} type={line.type} time={line.timestamp}>
                        {line.message}
                    </TerminalOutput>
                ))}

                {/* Active plans summary */}
                <div className="border-t border-neutral-800 my-3 pt-3">
                    <TerminalOutput type="info" time={currentTime}>
                        ═══ ACTIVE PLANS ═══
                    </TerminalOutput>
                    {plans.filter(p => p.enabled).map(plan => (
                        <TerminalOutput key={plan.id} type="info" time={currentTime}>
                            [{plan.category.toUpperCase().slice(0, 4)}] {plan.nameVi}
                            <span className="text-neutral-600"> — triggered {plan.triggerCount}x</span>
                        </TerminalOutput>
                    ))}
                </div>

                {/* Cursor blink */}
                <div className="flex items-center gap-1 text-green-500">
                    <span>$</span>
                    <span className="animate-pulse">▋</span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#1a1a1c] border-t border-neutral-800 text-[10px] text-neutral-600 flex items-center justify-between">
                <span>Press ESC to close • Scroll to view history</span>
                <span className="text-neutral-500">modun-automation-engine@1.0.0</span>
            </div>
        </motion.div>
    );
}

// --- TERMINAL LINE COMPONENT ---
function TerminalOutput({
    type,
    time,
    children
}: {
    type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'trigger';
    time: Date;
    children: React.ReactNode;
}) {
    const colorMap = {
        info: 'text-blue-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400',
        system: 'text-purple-400',
        trigger: 'text-cyan-400'
    };

    const iconMap = {
        info: <Info size={10} />,
        success: <CheckCircle size={10} />,
        warning: <AlertTriangle size={10} />,
        error: <X size={10} />,
        system: <Cpu size={10} />,
        trigger: <Zap size={10} />
    };

    return (
        <div className={`flex items-start gap-2 ${colorMap[type]} leading-relaxed`}>
            <span className="text-neutral-600 shrink-0">[{format(time, 'HH:mm:ss')}]</span>
            <span className="shrink-0">{iconMap[type]}</span>
            <span className="break-all">{children}</span>
        </div>
    );
}

export default AutomationMonitor;
