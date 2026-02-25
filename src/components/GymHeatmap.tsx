import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface MuscleData {
    name: string;
    intensity: number; // 0 to 1
}

interface GymHeatmapProps {
    muscles: MuscleData[];
}

export function GymHeatmap({ muscles }: GymHeatmapProps) {
    return (
        <div className="glass-panel p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Activity size={80} />
            </div>

            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary animate-pulse" />
                    MUSCLE ACTIVATION LOG (HEATMAP)
                </h4>
                <span className="text-[10px] font-bold text-text-muted font-mono tracking-widest uppercase">System.Anatomy.Scan()</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {muscles.map((muscle) => (
                    <div key={muscle.name} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                            <span>{muscle.name}</span>
                            <span>{Math.round(muscle.intensity * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: i / 10 <= muscle.intensity ? 1 : 0.1,
                                        backgroundColor: i / 10 <= muscle.intensity
                                            ? (muscle.intensity > 0.7 ? '#a855f7' : '#3b82f6')
                                            : '#ffffff'
                                    }}
                                    className="flex-1 h-full rounded-[1px] transition-colors"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex gap-4 overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="text-[8px] font-black text-text-muted uppercase">Idle</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[8px] font-black text-blue-500 uppercase">Auxiliary</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <span className="text-[8px] font-black text-primary uppercase">Primary Load</span>
                </div>
            </div>
        </div>
    );
}
