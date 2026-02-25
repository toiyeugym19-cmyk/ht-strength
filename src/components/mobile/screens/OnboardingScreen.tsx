// Onboarding Screen
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { NavFunction } from '../ui';

const LOCAL_COVERS = [
    '/workout-covers/2.png',
    '/workout-covers/4.png',
    '/workout-covers/6.png',
];

export const OnboardingScreen = ({ nav }: { nav: NavFunction }) => {
    const levels = [
        { id: 'beginner', title: 'BEGINNER', subtitle: 'Tôi muốn bắt đầu', color: 'from-blue-600 to-blue-400', img: LOCAL_COVERS[0] },
        { id: 'intermediate', title: 'INTERMEDIATE', subtitle: 'Tôi tập 3x/tuần', color: 'from-purple-600 to-purple-400', img: LOCAL_COVERS[1] },
        { id: 'advanced', title: 'ADVANCED', subtitle: 'Tôi là Pro Athlete', color: 'from-red-600 to-red-400', img: LOCAL_COVERS[2] }
    ];

    return (
        <div className="p-6 pt-12 h-full flex flex-col justify-between relative overflow-hidden bg-black">
            {/* Logo */}
            <div className="mb-8">
                <h1 className="text-4xl font-[1000] text-white italic uppercase tracking-tighter leading-none">
                    THOR <span className="text-primary">PRO</span>
                </h1>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    MODUN OS v4.2
                </span>
            </div>

            {/* Title */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white italic uppercase tracking-tighter">
                    Chọn<br /><span className="text-blue-500">Cấp độ</span>
                </h2>
            </div>

            {/* Level Selection */}
            <div className="space-y-4 z-10 flex-1 flex flex-col justify-center">
                {levels.map((lvl) => (
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        key={lvl.id}
                        onClick={() => nav('os')}
                        className="w-full h-28 rounded-3xl relative overflow-hidden border border-white/10"
                    >
                        <img src={lvl.img} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${lvl.color} opacity-70 mix-blend-multiply`} />
                        <div className="absolute inset-0 p-5 flex flex-col justify-center items-start">
                            <h3 className="text-xl font-black text-white italic uppercase">{lvl.title}</h3>
                            <p className="text-white/80 text-sm">{lvl.subtitle}</p>
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
                    </motion.button>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                    Powered by N8N Neural Engine
                </p>
            </div>
        </div>
    );
};
