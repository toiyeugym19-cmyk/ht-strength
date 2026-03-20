import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, Target, Warning, 
    ShieldCheck, ChartBar, 
    UsersThree, Sparkle, ArrowClockwise
} from '@phosphor-icons/react';
import { useMemberStore } from '../store/useMemberStore';
import { useAuth } from '../hooks/useAuth';
import { SwarmIntelligenceEngine } from '../services/SwarmIntelligenceEngine';
import type { SwarmForecast, SwarmMessage } from '../services/SwarmIntelligenceEngine';

/**
 * 🐝 DỰ BÁO THÀNH CÔNG AI — Giao diện Mô phỏng Trí tuệ Bầy đàn
 */

export default function SuccessForecastPage() {
    const { user } = useAuth();
    const { members } = useMemberStore();
    const [isSimulating, setIsSimulating] = useState(false);
    const [forecast, setForecast] = useState<SwarmForecast | null>(null);
    const [visibleMessages, setVisibleMessages] = useState<SwarmMessage[]>([]);

    const memberData = members.find(m => m.id === user?.memberId) || members[0];

    const runSimulation = async () => {
        setIsSimulating(true);
        setVisibleMessages([]);
        setForecast(null);

        const engine = new SwarmIntelligenceEngine(memberData);
        const result = await engine.runSimulation();

        // Hiển thị từng tin nhắn agent theo thứ tự
        for (let i = 0; i < result.agentsDiscussion.length; i++) {
            setVisibleMessages(prev => [...prev, result.agentsDiscussion[i]]);
            await new Promise(resolve => setTimeout(resolve, 1800));
        }

        // Chờ thêm 1 giây rồi hiển thị kết quả
        await new Promise(resolve => setTimeout(resolve, 1000));
        setForecast(result);
        setIsSimulating(false);
    };

    const getAgentName = (type: string) => {
        switch (type) {
            case 'HEAD_COACH': return 'HLV Trưởng';
            case 'SPORTS_SCIENTIST': return 'Khoa Học Thể Thao';
            case 'DIETITIAN': return 'Chuyên Gia Dinh Dưỡng';
            case 'BEHAVIORAL': return 'Phân Tích Hành Vi';
            default: return 'Cố Vấn AI';
        }
    };

    const getAgentEmoji = (type: string) => {
        switch (type) {
            case 'HEAD_COACH': return '👑';
            case 'SPORTS_SCIENTIST': return '🔬';
            case 'DIETITIAN': return '🥗';
            case 'BEHAVIORAL': return '🧠';
            default: return '🤖';
        }
    };

    const getAgentColor = (type: string) => {
        switch (type) {
            case 'HEAD_COACH': return '#BF5AF2';
            case 'SPORTS_SCIENTIST': return '#0A84FF';
            case 'DIETITIAN': return '#FF375F';
            case 'BEHAVIORAL': return '#30D158';
            default: return 'var(--ios-tint)';
        }
    };

    const getSuccessColor = (prob: number) => {
        if (prob >= 70) return '#30D158';
        if (prob >= 45) return '#FF9F0A';
        return '#FF453A';
    };

    return (
        <div className="ios-animate-in space-y-5 pb-24">
            {/* Tiêu đề */}
            <header className="px-4 pt-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[var(--ios-tint)]/10 rounded-xl flex items-center justify-center">
                        <Brain className="text-[var(--ios-tint)]" size={24} weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-[22px] font-bold text-white leading-tight">Dự Báo Thành Công AI</h1>
                        <p className="text-[13px] text-[var(--ios-text-secondary)] font-medium">Mô phỏng trí tuệ bầy đàn • 4 chuyên gia</p>
                    </div>
                </div>
            </header>

            {!forecast && !isSimulating ? (
                /* Màn hình khởi động */
                <div className="mx-4">
                    <div className="bg-[var(--ios-card-bg)] rounded-[24px] p-6 border border-[var(--ios-separator)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--ios-tint)]/10 blur-3xl rounded-full -mr-10 -mt-10" />
                        
                        <div className="relative z-10 text-center py-6">
                            <UsersThree className="mx-auto text-[var(--ios-tint)] mb-4" size={56} weight="duotone" />
                            <h2 className="text-[20px] font-bold text-white mb-2">Kích hoạt Mô Phỏng Bầy Đàn?</h2>
                            <p className="text-[14px] text-[var(--ios-text-secondary)] mb-8 px-2 leading-relaxed">
                                Hệ thống sẽ triệu tập <strong className="text-white">4 Chuyên Gia AI</strong> để phân tích toàn diện dữ liệu tập luyện, sức khỏe và hành vi của bạn.
                            </p>
                            
                            {/* Danh sách agent */}
                            <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                                {[
                                    { emoji: '🧠', name: 'Phân Tích Hành Vi', color: '#30D158' },
                                    { emoji: '🔬', name: 'Khoa Học Thể Thao', color: '#0A84FF' },
                                    { emoji: '🥗', name: 'Dinh Dưỡng', color: '#FF375F' },
                                    { emoji: '👑', name: 'HLV Trưởng', color: '#BF5AF2' },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-[var(--ios-fill-tertiary)] rounded-xl p-3">
                                        <span className="text-[18px]">{a.emoji}</span>
                                        <span className="text-[12px] font-bold" style={{ color: a.color }}>{a.name}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={runSimulation}
                                className="w-full bg-[var(--ios-tint)] text-white py-4 rounded-2xl font-bold text-[17px] shadow-lg shadow-[var(--ios-tint)]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkle size={20} weight="fill" /> Bắt Đầu Mô Phỏng
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Khu vực mô phỏng + kết quả */
                <div className="mx-4 space-y-4">
                    {/* Khung hội thoại AI */}
                    <div className="bg-[var(--ios-card-bg)] rounded-[24px] p-5 border border-[var(--ios-separator)]">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[13px] font-bold text-[var(--ios-text-secondary)] uppercase tracking-wider">Hội Đồng Cố Vấn AI</h3>
                            {isSimulating && (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#30D158] rounded-full animate-pulse" />
                                    <span className="text-[11px] text-[#30D158] font-bold">ĐANG MÔ PHỎNG</span>
                                </div>
                            )}
                            {forecast && (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[var(--ios-tint)] rounded-full" />
                                    <span className="text-[11px] text-[var(--ios-tint)] font-bold">HOÀN TẤT</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {visibleMessages.map((msg, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex gap-3"
                                    >
                                        <div 
                                            className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[16px]"
                                            style={{ backgroundColor: `${getAgentColor(msg.agent)}20`, border: `1px solid ${getAgentColor(msg.agent)}40` }}
                                        >
                                            {getAgentEmoji(msg.agent)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[11px] font-bold mb-1" style={{ color: getAgentColor(msg.agent) }}>
                                                {getAgentName(msg.agent)}
                                            </p>
                                            <div className="bg-[var(--ios-fill-tertiary)] rounded-2xl rounded-tl-none p-3">
                                                <p className="text-[13px] text-white/90 leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Hiệu ứng đang gõ */}
                            {isSimulating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 items-center pl-12"
                                >
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-[11px] text-white/40">Đang phân tích...</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* === KẾT QUẢ DỰ BÁO === */}
                    {forecast && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            {/* Biểu đồ xác suất */}
                            <div className="bg-[var(--ios-card-bg)] rounded-[24px] p-6 border border-[var(--ios-separator)]">
                                <p className="text-[11px] font-bold text-[var(--ios-text-secondary)] uppercase mb-4 text-center tracking-wider">Xác Suất Thành Công</p>
                                
                                <div className="flex flex-col items-center justify-center py-2 relative">
                                    <svg viewBox="0 0 100 100" className="w-36 h-36 transform -rotate-90">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ios-fill-tertiary)" strokeWidth="8" />
                                        <motion.circle 
                                            cx="50" cy="50" r="42" fill="none" 
                                            stroke={getSuccessColor(forecast.probabilityOfSuccess)} 
                                            strokeWidth="8" strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 264" }}
                                            animate={{ strokeDasharray: `${(forecast.probabilityOfSuccess / 100) * 264} 264` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span 
                                            className="text-[40px] font-bold tracking-tighter"
                                            style={{ color: getSuccessColor(forecast.probabilityOfSuccess) }}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: 'spring' }}
                                        >
                                            {forecast.probabilityOfSuccess}%
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Kết luận */}
                                <div className="mt-4 text-center">
                                    <span 
                                        className="inline-block px-4 py-1.5 rounded-full text-[12px] font-bold"
                                        style={{ 
                                            backgroundColor: `${getSuccessColor(forecast.probabilityOfSuccess)}15`,
                                            color: getSuccessColor(forecast.probabilityOfSuccess),
                                            border: `1px solid ${getSuccessColor(forecast.probabilityOfSuccess)}30`
                                        }}
                                    >
                                        Đồng thuận: {forecast.consensusLabel}
                                    </span>
                                </div>

                                {/* Thẻ thống kê */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <div className="bg-[var(--ios-fill-tertiary)] rounded-2xl p-4 text-center">
                                        <p className="text-[10px] text-[var(--ios-text-secondary)] font-bold mb-1 uppercase">Thời gian dự kiến</p>
                                        <p className="text-[22px] font-bold text-white">{forecast.estimatedTimeFrameWeeks} <span className="text-[14px] text-white/60">tuần</span></p>
                                    </div>
                                    <div className="bg-[var(--ios-fill-tertiary)] rounded-2xl p-4 text-center">
                                        <p className="text-[10px] text-[var(--ios-text-secondary)] font-bold mb-1 uppercase">Rủi ro bỏ tập</p>
                                        <p className="text-[22px] font-bold" style={{ color: forecast.riskOfChurnColor }}>
                                            {forecast.riskOfChurn}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Lời khuyên chuyên gia */}
                            <div className="bg-[var(--ios-card-bg)] rounded-[24px] border border-[var(--ios-separator)] overflow-hidden">
                                <div className="p-4 border-b border-[var(--ios-separator)] flex items-center gap-3">
                                    <Target className="text-[var(--ios-tint)]" size={20} weight="fill" />
                                    <p className="text-[15px] font-bold text-white">Đề Xuất Hành Động</p>
                                </div>
                                <div className="divide-y divide-[var(--ios-separator)]">
                                    <div className="p-4 flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center flex-shrink-0">
                                            <ChartBar className="text-[#0A84FF]" size={18} weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#0A84FF] mb-1 uppercase">Tập luyện</p>
                                            <p className="text-[13px] text-white/85 leading-relaxed">{forecast.expertAdvice.training}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#FF375F]/10 flex items-center justify-center flex-shrink-0">
                                            <Warning className="text-[#FF375F]" size={18} weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#FF375F] mb-1 uppercase">Dinh dưỡng</p>
                                            <p className="text-[13px] text-white/85 leading-relaxed">{forecast.expertAdvice.nutrition}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#30D158]/10 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="text-[#30D158]" size={18} weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#30D158] mb-1 uppercase">Lối sống & Hành vi</p>
                                            <p className="text-[13px] text-white/85 leading-relaxed">{forecast.expertAdvice.lifestyle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút mô phỏng lại */}
                            <button 
                                onClick={() => runSimulation()}
                                className="w-full bg-[var(--ios-fill-tertiary)] text-white py-4 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[var(--ios-separator)]"
                            >
                                <ArrowClockwise size={18} weight="bold" /> Mô Phỏng Lại
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
