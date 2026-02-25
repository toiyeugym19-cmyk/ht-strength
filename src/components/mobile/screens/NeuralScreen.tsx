// Neural Screen - N8N Control Center
import { useState, useEffect } from 'react';
import { Zap, FileText, Database, Network, Activity, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { useAutomationStore } from '../../../store/useAutomationStore';
import { useMemberAutomationStore } from '../../../store/useMemberAutomationStore';
import { useMemberAutomation } from '../../MemberAutomationEngine';
import { AppHeader, SubMenuGrid, NavFunction, Screen } from '../ui';

export const NeuralScreen = ({ nav }: { nav: NavFunction }) => {
    const { logs: personalLogs, isEngineRunning: personalRunning, setEngineStatus: personalToggle, addLog: addPersonalLog } = useAutomationStore();
    const { logs: memberLogs, n8nStatus } = useMemberAutomationStore();
    const { isEngineRunning: memberRunning, setEngineStatus: memberToggle, pendingTasks } = useMemberAutomation();
    const [command, setCommand] = useState('');

    const allLogs = [
        ...personalLogs.map(l => ({ ...l, source: 'PERS' })),
        ...memberLogs.map(l => ({ ...l, source: 'MEMB' }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const neuralSubFeatures = [
        { icon: Zap, label: 'Workflows', desc: 'Automation flows', screen: 'neural_workflows' as Screen, color: 'bg-yellow-600' },
        { icon: FileText, label: 'Logs', desc: 'Nhật ký hệ thống', screen: 'neural_logs' as Screen, color: 'bg-blue-600' },
        { icon: Database, label: 'Blueprints', desc: 'Kế hoạch 1M steps', screen: 'neural_blueprints' as Screen, color: 'bg-purple-600' },
        { icon: Network, label: 'Tích hợp', desc: 'API & Webhooks', screen: 'neural_integrations' as Screen, color: 'bg-green-600' },
        { icon: Activity, label: 'Chẩn đoán', desc: 'System health', screen: 'neural_diagnostics' as Screen, color: 'bg-red-600' },
    ];

    useEffect(() => {
        if (personalLogs.length === 0) {
            addPersonalLog({
                message: 'SYSTEM_BOOT: Neural Bridge localized.',
                timestamp: new Date().toISOString(),
                type: 'info',
                planId: 'SYS',
                planName: 'SYSTEM'
            });
        }
    }, [personalLogs.length, addPersonalLog]);

    const handleCommand = (cmd: string) => {
        toast.promise(new Promise(res => setTimeout(res, 800)), {
            loading: `PROTOCOL_${cmd}: Executing...`,
            success: () => {
                addPersonalLog({
                    message: `${cmd}_COMPLETE: Action dispatched.`,
                    timestamp: new Date().toISOString(),
                    type: 'success',
                    planId: 'CMD',
                    planName: 'PROTOCOL'
                });
                return `Neural Link: ${cmd} Dispatched.`;
            },
            error: 'Timeout.'
        });
        setCommand('');
    };

    return (
        <div className="p-6 pt-12 h-screen bg-[#030014] flex flex-col pb-32 overflow-y-auto no-scrollbar">
            <AppHeader nav={nav} showLogo={true} />

            {/* Status Bar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => personalToggle(!personalRunning)}
                        className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase transition-all active:scale-95 ${personalRunning ? 'bg-primary/20 border-primary/50 text-white' : 'bg-zinc-900 border-white/10 text-zinc-600'}`}
                    >
                        P_AUTO: {personalRunning ? 'ON' : 'OFF'}
                    </button>
                    <button
                        onClick={() => memberToggle(!memberRunning)}
                        className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase transition-all active:scale-95 ${memberRunning ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-zinc-900 border-white/10 text-zinc-600'}`}
                    >
                        M_AUTO: {memberRunning ? 'ON' : 'OFF'}
                    </button>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-full ${n8nStatus === 'connected' ? 'border-green-500/30 text-green-500' : 'border-red-500/30 text-red-500'}`}>
                    <Network size={10} className={n8nStatus === 'connected' ? 'animate-pulse' : ''} />
                    <span className="text-[8px] font-black uppercase">{n8nStatus === 'connected' ? 'ACTIVE' : 'OFFLINE'}</span>
                </div>
            </div>

            {/* Quick Protocols */}
            <div className="flex gap-2 mb-4">
                {['SYNC', 'SCAN', 'BOOT'].map(btn => (
                    <button
                        key={btn}
                        onClick={() => handleCommand(btn)}
                        className="flex-1 py-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-[9px] font-black uppercase text-zinc-400 hover:bg-primary/20 hover:text-white transition-all active:scale-95"
                    >
                        {btn}
                    </button>
                ))}
            </div>

            {/* Sub-features */}
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">Modules</h3>
            <SubMenuGrid items={neuralSubFeatures} nav={nav} />

            {/* Console Preview */}
            <div className="mt-4 bg-black border border-white/10 rounded-2xl p-4 flex-1 max-h-48">
                <div className="flex items-center gap-2 mb-3">
                    <Terminal size={12} className="text-primary" />
                    <span className="text-[8px] font-black text-zinc-500 uppercase">Console • {pendingTasks.length} tasks</span>
                </div>
                <div className="space-y-1 text-[8px] font-mono text-zinc-600 overflow-y-auto h-24 no-scrollbar">
                    {allLogs.slice(0, 8).map((log: any) => (
                        <div key={log.id} className="flex gap-2">
                            <span className="text-zinc-700 shrink-0">{format(new Date(log.timestamp), 'HH:mm')}</span>
                            <span className={`shrink-0 ${log.source === 'MEMB' ? 'text-purple-500' : 'text-blue-500'}`}>[{log.source}]</span>
                            <span className="text-zinc-400 truncate">{log.message}</span>
                        </div>
                    ))}
                    {allLogs.length === 0 && (
                        <p className="text-zinc-700 italic">Establishing Neural Handshake...</p>
                    )}
                </div>

                {/* Command Input */}
                <div className="mt-3 flex items-center gap-2 p-2 bg-zinc-900/50 rounded-lg">
                    <span className="text-primary font-black animate-pulse">{'>'}</span>
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && command && handleCommand(command.toUpperCase())}
                        placeholder="COMMAND..."
                        className="bg-transparent border-none outline-none text-[9px] font-bold text-white placeholder:text-zinc-700 flex-1 uppercase tracking-wider"
                    />
                </div>
            </div>
        </div>
    );
};
