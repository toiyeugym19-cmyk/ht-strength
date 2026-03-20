import { motion } from 'framer-motion';
import { LayoutGrid, Users, MessageSquare, Heart, BrainCircuit } from 'lucide-react';
import type { Screen } from '../ui';

interface MobileTabBarProps {
    currentScreen: Screen;
    onNavigate: (screen: Screen) => void;
}

export function MobileTabBar({ currentScreen, onNavigate }: MobileTabBarProps) {
    const isActiveTab = (tab: string) => {
        if (tab === 'os') return currentScreen === 'os' || currentScreen.startsWith('os_');
        if (tab === 'members') return currentScreen === 'members' || currentScreen.startsWith('members_') || currentScreen === 'member_detail';
        if (tab === 'chat') return currentScreen === 'chat' || currentScreen.startsWith('chat_');
        if (tab === 'bio') return currentScreen === 'bio' || currentScreen.startsWith('bio_');
        if (tab === 'neural') return currentScreen === 'neural' || currentScreen.startsWith('neural_');
        return false;
    };

    const tabs = [
        { id: 'os', label: 'OS', icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
        { id: 'members', label: 'HỘI VIÊN', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
        { id: 'chat', label: 'CHAT', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500', shadow: 'shadow-amber-500/50' },
        { id: 'bio', label: 'BIO', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500', shadow: 'shadow-rose-500/50' },
        { id: 'neural', label: 'NEURAL', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-500', shadow: 'shadow-purple-500/50' },
    ];

    return (
        <div className="h-[84px] bg-black/80 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2 z-[100] pb-6 pt-2 sticky bottom-0 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
            {tabs.map((tab) => {
                const active = isActiveTab(tab.id);
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onNavigate(tab.id as Screen)}
                        className={`flex flex-col items-center justify-center gap-1.5 w-[72px] h-12 relative transition-all duration-300 ${active ? tab.color : 'text-zinc-500 hover:text-zinc-400'
                            }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {active && (
                            <motion.div
                                layoutId="mobile-tab-indicator"
                                className={`absolute -top-3 w-10 h-1 rounded-full ${tab.bg} shadow-[0_0_12px_rgba(0,0,0,0)] ${tab.shadow}`}
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                style={{ boxShadow: `0 0 15px var(--tw-shadow-color)` }}
                            />
                        )}
                        <motion.div
                            whileTap={{ scale: 0.85 }}
                            animate={{ scale: active ? 1.15 : 1, y: active ? -4 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="relative"
                        >
                            {active && (
                                <div className={`absolute inset-0 ${tab.bg} opacity-20 blur-md rounded-full transform scale-150 transition-all duration-500`} />
                            )}
                            <Icon
                                size={22}
                                strokeWidth={active ? 2.5 : 2}
                                className="relative z-10 transition-colors duration-300"
                            />
                        </motion.div>
                        <span
                            className={`text-[8px] font-[900] uppercase tracking-wider transition-all duration-300 absolute ${active ? 'bottom-[-4px] opacity-100' : 'bottom-[-10px] opacity-0'
                                }`}
                        >
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
