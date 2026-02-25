import { useState, useEffect, useRef } from 'react';
import { useAutomationStore } from '../store/useAutomationStore';
import { useMemberAutomationStore } from '../store/useMemberAutomationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    Terminal, Cpu, Zap, Activity, ShieldCheck,
    MessageSquare, Globe,
    Maximize2, Minimize2, Trash2
} from 'lucide-react';

export function IntelligenceConsole() {
    const { logs: personalLogs, isEngineRunning: personalRunning } = useAutomationStore();
    const { logs: memberLogs, isEngineRunning: memberRunning, n8nStatus, clearLogs } = useMemberAutomationStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Merge and sort logs
    const allLogs = [
        ...personalLogs.map(l => ({ ...l, source: 'PERSONAL' })),
        ...memberLogs.map(l => ({ ...l, source: 'MEMBER' }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current && !isExpanded) {
            scrollRef.current.scrollTop = 0;
        }
    }, [allLogs.length, isExpanded]);

    return (
        <div className={`bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-500 shadow-2xl ${isExpanded ? 'fixed inset-4 z-[200]' : 'h-[450px]'}`}>
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/20 backdrop-blur-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Terminal size={20} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white italic tracking-widest uppercase flex items-center gap-2">
                            OS Intelligence Console
                            <span className="flex gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${personalRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className={`w-1.5 h-1.5 rounded-full ${memberRunning ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'}`} />
                            </span>
                        </h3>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                            {n8nStatus === 'connected' ? 'n8n Connected' : 'n8n Standby'} • {allLogs.length} Events Logged
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => clearLogs()}
                        className="p-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                        title="Clear History"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2.5 bg-white/5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                    >
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Status Bar */}
            <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex items-center justify-between text-[9px] font-black text-zinc-500 tracking-widest uppercase">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><Cpu size={10} /> Kernel: Active</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck size={10} /> Auth: Verified</span>
                    <span className="flex items-center gap-1.5 text-primary"><Globe size={10} /> Proxy: n8n-tunnel-α</span>
                </div>
                <div>{format(currentTime, 'HH:mm:ss')}</div>
            </div>

            {/* Console Output */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 custom-scrollbar bg-[#050505]"
            >
                <div className="py-4 border-b border-white/5 mb-4 opacity-50">
                    <div className="text-primary">╔══════════════════════════════════════════════════════╗</div>
                    <div className="text-primary">║  ANTIGRAVITY OS - CORE INTELLIGENCE v4.0.2           ║</div>
                    <div className="text-primary">║  Unified Automation & n8n Ecosystem                  ║</div>
                    <div className="text-primary">╚══════════════════════════════════════════════════════╝</div>
                </div>

                {allLogs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 italic">
                        <Activity size={40} className="mb-4 animate-pulse" />
                        Waiting for triggers...
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {allLogs.map((log: any) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-3 py-1.5 px-2 rounded hover:bg-white/[0.02] group border-l-2 transition-all
                                ${log.type === 'critical' ? 'border-red-500/50 bg-red-500/5' :
                                    log.type === 'n8n_trigger' ? 'border-blue-500/50 bg-blue-500/5' :
                                        log.type === 'success' ? 'border-green-500/50' : 'border-transparent'}`}
                        >
                            <span className="text-zinc-600 shrink-0 select-none">[{format(new Date(log.timestamp), 'HH:mm:ss')}]</span>

                            <span className={`shrink-0 font-bold px-1.5 rounded-[4px] text-[9px]
                                ${log.source === 'PERSONAL' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                                {log.source}
                            </span>

                            <div className="flex-1 min-w-0">
                                <span className={`font-bold mr-2 ${log.type === 'critical' ? 'text-red-400' :
                                    log.type === 'n8n_trigger' ? 'text-blue-300' :
                                        log.type === 'success' ? 'text-green-400' : 'text-zinc-300'
                                    }`}>
                                    {log.planName} »
                                </span>
                                <span className="text-zinc-400 break-words">{log.message}</span>
                                {log.memberName && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded text-[9px] font-black italic">
                                        @{String(log.memberName).replace(/\s/g, '').toLowerCase()}
                                    </span>
                                )}
                            </div>

                            {log.n8nExecutionId && (
                                <div className="hidden group-hover:flex items-center gap-1 text-[9px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded italic">
                                    <Zap size={8} /> EXEC: {String(log.n8nExecutionId).slice(0, 8)}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="flex items-center gap-2 text-primary pt-4 pb-10">
                    <span className="animate-pulse">_</span>
                    <span className="text-[10px] font-black tracking-tighter opacity-50 italic uppercase">System Listeners Active...</span>
                </div>
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-zinc-900/40 border-t border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <MessageSquare size={12} />
                        <span>Triggers: {allLogs.filter(l => l.type !== 'n8n_trigger').length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500 font-bold">
                        <Globe size={12} />
                        <span>n8n Flows: {allLogs.filter(l => l.type === 'n8n_trigger').length}</span>
                    </div>
                </div>
                <div className="text-zinc-700 italic">kernel@modun-ai ~ v4.0.2</div>
            </div>
        </div>
    );
}
