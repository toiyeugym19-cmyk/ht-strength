import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Command, CornerDownLeft, Sparkles } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { useNutritionStore, type DietPhase } from '../store/useNutritionStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const { addTask } = useBoardStore();
    const { addCommit: addMeal } = useNutritionStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
                setInput('');
            }, 10);
        }
    }, [isOpen]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        setHistory(prev => [input, ...prev].slice(0, 10));

        // Command Parser
        if (cmd.startsWith('commit task ')) {
            const taskText = input.substring(12);
            addTask('col-1', taskText, 'work', 'medium');
            toast.success(`Task committed: ${taskText}`);
        } else if (cmd.startsWith('commit meal ')) {
            const parts = input.substring(12).split(' ');
            const cals = parseInt(parts.pop() || '0');
            const mealName = parts.join(' ');
            addMeal({
                message: mealName,
                calories: cals,
                protein: 0, carbs: 0, fat: 0,
                type: 'lunch',
                date: new Date().toISOString()
            });
            toast.success(`Meal committed: ${mealName} (${cals} kcal)`);
        } else if (cmd.startsWith('checkout ')) {
            const pageOrPhase = cmd.substring(9);
            const routes: Record<string, string> = {
                'gym': '/gym',
                'work': '/work',
                'nutrition': '/nutrition',
                'calendar': '/calendar',
                'journal': '/journal',
                'analytics': '/analytics',
                'home': '/'
            };

            const phases = ['cutting', 'bulking', 'maintenance', 'recomp'];

            if (routes[pageOrPhase]) {
                navigate(routes[pageOrPhase]);
                setIsOpen(false);
            } else if (phases.includes(pageOrPhase)) {
                useNutritionStore.getState().setPhase(pageOrPhase as DietPhase);
                toast.success(`System phase switched to: ${pageOrPhase}`);
                setIsOpen(false);
            } else {
                toast.error(`Target not found: ${pageOrPhase}`);
            }
        } else if (cmd.startsWith('install extension ')) {
            const extId = cmd.substring(18);
            useNutritionStore.getState().applyExtension(extId);
            toast.success(`Extension ${extId} successfully installed and active`);
            setIsOpen(false);
        } else if (cmd === 'status') {
            toast.info("System: healthy | Branch: production | Uptime: nominal");
        } else {
            toast.error(`Unknown command: ${cmd}`);
        }

        setInput('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        className="relative w-full max-w-2xl bg-[#0D1117]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center gap-3">
                            <Terminal size={18} className="text-primary" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a command... (e.g., commit task Buy milk, checkout gym)"
                                className="bg-transparent border-none outline-none text-white flex-1 font-mono text-sm h-10"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCommand(e)}
                            />
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] text-text-muted font-bold">
                                <CornerDownLeft size={10} /> ENTER
                            </div>
                        </div>

                        <div className="p-4 bg-black/40">
                            <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                <Sparkles size={12} /> Suggested Commands
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                                <SuggestionItem cmd="commit task [text]" desc="Add a new task to main branch" />
                                <SuggestionItem cmd="commit meal [name] [kcal]" desc="Log caloric intake" />
                                <SuggestionItem cmd="checkout [page]" desc="Switch to a different module" />
                                <SuggestionItem cmd="status" desc="Environment health report" />
                            </div>
                        </div>

                        {history.length > 0 && (
                            <div className="p-4 border-t border-white/5">
                                <div className="text-[10px] font-black text-white/30 uppercase mb-3">Recent Commands</div>
                                <div className="space-y-2">
                                    {history.map((h, i) => (
                                        <div key={i} className="text-xs font-mono text-text-muted flex items-center gap-2">
                                            <span className="text-white/20">$</span> {h}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-3 bg-[#161B22] flex justify-between items-center text-[10px] font-bold text-text-muted border-t border-white/5 uppercase">
                            <div className="flex gap-4">
                                <span><span className="text-white">↑↓</span> select</span>
                                <span><span className="text-white">esc</span> close</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Command size={10} /> K
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function SuggestionItem({ cmd, desc }: { cmd: string, desc: string }) {
    return (
        <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
            <div className="text-primary group-hover:text-accent transition-colors mb-0.5">{cmd}</div>
            <div className="text-[10px] text-white/40">{desc}</div>
        </div>
    );
}
