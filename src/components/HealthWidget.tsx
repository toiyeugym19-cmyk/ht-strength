import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Footprints, Moon, Droplets, Heart,
    Smartphone, RefreshCw, Link2, X, CheckCircle2, ShieldAlert,
    Stethoscope, ChevronRight
} from 'lucide-react';
import { useHealthStore, type DailyHealth } from '../store/useHealthStore';
import { DIAGNOSTIC_TOOLS } from '../data/healthDiagnostics';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function HealthWidget() {
    const { dailyStats, isSyncing, lastSyncTime, syncWithDevice, updateStat, connectedSource, setConnectedSource } = useHealthStore();
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayStats = dailyStats[today] || { steps: 0, sleepHours: 0, waterMl: 0, heartRateAvg: 0 };

    const [isEditMode, setIsEditMode] = useState(false);
    const [isConnectMode, setIsConnectMode] = useState(false);
    const [isPermissionOpen, setIsPermissionOpen] = useState(false);
    const [pendingSource, setPendingSource] = useState<'apple' | 'google' | null>(null);
    const [manualValues, setManualValues] = useState<DailyHealth>(todayStats);

    // Diagnostic State
    const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, number>>({});
    const [currentStep, setCurrentStep] = useState<string | null>(null); // For flow-based tools

    const handleSync = async () => {
        if (!connectedSource) {
            toast.error("Vui lòng kết nối thiết bị trước!", {
                action: {
                    label: "Kết nối",
                    onClick: () => setIsConnectMode(true)
                }
            });
            return;
        }

        try {
            await syncWithDevice();
            toast.success("Dữ liệu đã được cập nhật từ thiết bị!");
        } catch (e) {
            toast.error("Lỗi đồng bộ hóa.");
        }
    };

    const handleSaveManual = () => {
        updateStat(today, manualValues);
        setIsEditMode(false);
        toast.success("Đã cập nhật chỉ số thủ công!");
    };

    const handleInputChange = (field: keyof DailyHealth, value: string) => {
        setManualValues(prev => ({
            ...prev,
            [field]: Number(value)
        }));
    };

    const initiateConnection = (source: 'apple' | 'google') => {
        setPendingSource(source);
        setIsPermissionOpen(true);
        // setIsConnectMode remains true to keep the background context, or false to focus on permission?
        // Let's keep connect mode open behind or close it?
        // Better to stack them or close the selection menu. Let's close selection menu.
        setIsConnectMode(false);
    };

    const confirmConnection = () => {
        if (pendingSource) {
            setConnectedSource(pendingSource);
            toast.success(`Đã cấp quyền truy cập cho ${pendingSource === 'apple' ? 'Apple Health' : 'Google Fit'}`);
            setIsPermissionOpen(false);
            setPendingSource(null);

            // Auto sync after connection
            setTimeout(() => syncWithDevice(), 500);
        }
    };

    const disconnect = () => {
        setConnectedSource(null);
        toast.info("Đã ngắt kết nối thiết bị.");
    };

    return (
        <div className="glass-panel p-8 bg-gradient-to-br from-teal-900/10 via-transparent to-transparent border-white/5 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-32 bg-teal-500/05 blur-[100px] rounded-full group-hover:bg-teal-500/10 transition-colors pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white italic flex items-center gap-3 tracking-tight">
                        <Activity className="text-teal-400" /> SINH TRẮC HỌC
                    </h3>
                    <div className="flex items-center gap-4 mt-1 pl-9">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                            {connectedSource
                                ? <span className="text-green-400 flex items-center gap-1"><Link2 size={10} /> {connectedSource === 'apple' ? 'Apple Health' : 'Google Fit'}</span>
                                : 'Chưa kết nối nguồn dữ liệu'
                            }
                        </p>
                        {lastSyncTime && (
                            <span className="text-[10px] font-bold text-white/20">
                                {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : format(new Date(lastSyncTime), 'HH:mm')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex border border-white/10 rounded-xl bg-black/20 p-1">
                    <button
                        onClick={() => setIsDiagnosticOpen(true)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-white hover:bg-teal-500/20 rounded-lg transition-all flex items-center gap-2"
                    >
                        <Stethoscope size={14} /> Chẩn đoán AI
                    </button>
                    <div className="w-[1px] bg-white/10 mx-1 my-2" />
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        Nhập tay
                    </button>

                    {connectedSource ? (
                        <div className="flex gap-1 ml-1">
                            <button
                                onClick={disconnect}
                                className="px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                title="Ngắt kết nối"
                            >
                                <X size={14} />
                            </button>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="px-4 py-2 bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSyncing ? 'Đang quét...' : (
                                    <>
                                        <Smartphone size={14} /> Đồng bộ
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsConnectMode(true)}
                            className="ml-1 px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 animate-pulse"
                        >
                            <Link2 size={14} /> Kết Nối
                        </button>
                    )}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <MetricCard
                    label="BƯỚC CHÂN"
                    value={todayStats.steps.toLocaleString()}
                    unit="steps"
                    icon={<Footprints size={18} className="text-blue-400" />}
                    color="bg-blue-500/10 border-blue-500/20"
                    percent={(todayStats.steps / 10000) * 100}
                />
                <MetricCard
                    label="GIẤC NGỦ"
                    value={todayStats.sleepHours.toString()}
                    unit="giờ"
                    icon={<Moon size={18} className="text-purple-400" />}
                    color="bg-purple-500/10 border-purple-500/20"
                    percent={(todayStats.sleepHours / 8) * 100}
                />
                <MetricCard
                    label="NƯỚC"
                    value={todayStats.waterMl.toLocaleString()}
                    unit="ml"
                    icon={<Droplets size={18} className="text-cyan-400" />}
                    color="bg-cyan-500/10 border-cyan-500/20"
                    percent={(todayStats.waterMl / 2500) * 100}
                />
                <MetricCard
                    label="NHỊP TIM"
                    value={todayStats.heartRateAvg.toString()}
                    unit="bpm"
                    icon={<Heart size={18} className="text-red-400" />}
                    color="bg-red-500/10 border-red-500/20"
                    percent={(todayStats.heartRateAvg / 100) * 100} // Loose standard
                />
            </div>

            {/* Edit Modal / Form Overlay */}
            <AnimatePresence>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 z-50 bg-[#09090b]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
                    >
                        <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Cập nhật chỉ số hôm nay</h4>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-white/50">Bước chân</label>
                                <input
                                    type="number"
                                    value={manualValues.steps}
                                    onChange={(e) => handleInputChange('steps', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:border-primary outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-white/50">Giấc ngủ (h)</label>
                                <input
                                    type="number"
                                    value={manualValues.sleepHours}
                                    onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:border-primary outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-white/50">Nước (ml)</label>
                                <input
                                    type="number"
                                    value={manualValues.waterMl}
                                    onChange={(e) => handleInputChange('waterMl', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:border-primary outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-white/50">Nhịp tim (bpm)</label>
                                <input
                                    type="number"
                                    value={manualValues.heartRateAvg}
                                    onChange={(e) => handleInputChange('heartRateAvg', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsEditMode(false)} className="px-6 py-2 text-xs font-bold text-white/50 hover:text-white uppercase">Hủy</button>
                            <button onClick={handleSaveManual} className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase hover:bg-primary/80">Lưu Dữ Liệu</button>
                        </div>
                    </motion.div>
                )}

                {/* Connection Selection Modal */}
                {isConnectMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-50 bg-[#09090b]/98 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <button
                            onClick={() => setIsConnectMode(false)}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/50 text-primary">
                                <Link2 size={32} />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Kết Nối Thiết Bị</h4>
                            <p className="text-white/50 text-sm max-w-sm mx-auto mt-2">
                                Chọn nền tảng để đồng bộ dữ liệu.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            <button
                                onClick={() => initiateConnection('apple')}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center gap-3 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 384 512" width="20" height="20" fill="currentColor">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 78.1 76.2 78.1 22.8 0 29.4-14.4 54.3-14.4 25.3 0 33.4 14.4 56.7 14.4 29 0 54.8-32.3 69.4-65.7 6.7-15.4 4.2-10 12.4-13.6-1.6-2.5-12.8-19.1-13.7-21.2 5.3-24.9 19.3-43.1 33.3-64.8-23.7-27.4-56-42.9-88.3-42.9zm41.3-176.6c13.4-15.8 21.2-37.4 19.2-59.3-19.5 1 40.5 49-65.8 46.1-2.4 20.7 7.7 54.6 22 72 17.5 20.1 53 17.2 68.8 6z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/70">Apple Health</span>
                            </button>

                            <button
                                onClick={() => initiateConnection('google')}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center gap-3 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/70">Google Fit</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* PERMISSION CONSENT MODAL */}
                {isPermissionOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute inset-0 z-[60] bg-black flex items-end md:items-center justify-center p-4 md:p-8"
                    >
                        <div className={`w-full max-w-sm bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${pendingSource === 'apple' ? 'font-sans' : 'font-roboto'}`}>
                            {/* ... Permission Mock Content (Keeping existing) ... */}
                            {/* Shortened for tool view, strictly use the original content if not modifying logic */}
                            {/* Assuming content is unchanged, just wrapping correctly */}
                            {/* Header */}
                            <div className="p-6 text-center border-b border-white/5">
                                {pendingSource === 'apple' ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3">
                                            <Heart className="text-red-500 fill-current" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">"Brite Thor" muốn truy cập Dữ liệu Y tế của bạn</h3>
                                            <p className="text-sm text-white/60 mt-1">Dữ liệu sẽ được sử dụng để hiển thị chỉ số trên Dashboard.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><span className="text-xs font-bold text-black">G</span></div>
                                            <span className="text-sm font-medium text-white/80">Đăng nhập bằng Google</span>
                                        </div>
                                        <h3 className="text-lg font-normal text-white">Brite Thor muốn truy cập vào Tài khoản Google của bạn</h3>
                                    </div>
                                )}
                            </div>

                            {/* Permissions List */}
                            <div className="p-6 space-y-4">
                                <p className="text-xs font-bold uppercase text-white/40 tracking-wider">Quyền hạn yêu cầu:</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        <span className="text-sm">Đọc số bước chân</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        <span className="text-sm">Đọc dữ liệu nhịp tim</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        <span className="text-sm">Đọc phân tích giấc ngủ</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-4 grid grid-cols-2 gap-3 ${pendingSource === 'apple' ? '' : 'flex-row-reverse'}`}>
                                <button onClick={() => { setIsPermissionOpen(false); setPendingSource(null); }} className={`py-3 rounded-xl font-bold text-sm ${pendingSource === 'apple' ? 'bg-white/10 text-blue-400' : 'text-white/60 hover:text-white'}`}>{pendingSource === 'apple' ? 'Từ chối' : 'Hủy bỏ'}</button>
                                <button onClick={confirmConnection} className={`py-3 rounded-xl font-bold text-sm ${pendingSource === 'apple' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-400'}`}>{pendingSource === 'apple' ? 'Cho phép' : 'Tiếp tục'}</button>
                            </div>
                            <div className="px-6 pb-4 text-center">
                                <p className="text-[9px] text-white/20 flex items-center justify-center gap-1">
                                    <ShieldAlert size={10} /> Môi trường Demo: Không yêu cầu mật khẩu thật
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* HEALTH DIAGNOSTIC MODAL */}
                {isDiagnosticOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsDiagnosticOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#09090b] w-full max-w-4xl h-[80vh] rounded-[2rem] border border-white/10 overflow-hidden flex shadow-2xl"
                        >
                            {/* Sidebar Tool Selection */}
                            <div className="w-1/3 border-r border-white/10 bg-white/5 p-6 overflow-y-auto">
                                <h3 className="text-xl font-black text-white px-2 mb-6 flex items-center gap-2">
                                    <Stethoscope className="text-teal-400" /> CHẨN ĐOÁN
                                </h3>
                                <div className="space-y-2">
                                    {Object.values(DIAGNOSTIC_TOOLS).map(tool => (
                                        <button
                                            key={tool.id}
                                            onClick={() => {
                                                setActiveToolId(tool.id);
                                                setDiagnosticAnswers({});
                                                const diagnosticTool = tool as any;
                                                setCurrentStep(diagnosticTool.flow?.[0].id || null);
                                            }}
                                            className={`w-full p-4 rounded-xl text-left transition-all border ${activeToolId === tool.id ? 'bg-teal-500/20 border-teal-500/50 text-white' : 'bg-transparent border-transparent hover:bg-white/5 text-text-muted hover:text-white'}`}
                                        >
                                            <p className="font-bold text-sm">{tool.name}</p>
                                            <p className="text-[10px] opacity-60 mt-1 line-clamp-1">{tool.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 p-8 overflow-y-auto relative">
                                {!activeToolId ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                        <Stethoscope size={64} className="mb-4" />
                                        <p className="text-lg font-bold">Chọn công cụ chẩn đoán bên trái</p>
                                        <p className="text-sm mt-2 max-w-xs">Các công cụ này sử dụng thuật toán y khoa cơ bản để đưa ra gợi ý.</p>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in">
                                        {(() => {
                                            const tool = Object.values(DIAGNOSTIC_TOOLS).find(t => t.id === activeToolId);
                                            if (!tool) return null;

                                            // Render Questionnaire (PHQ-9, GAD-7)
                                            if (tool.questions) {
                                                const score = Object.values(diagnosticAnswers).reduce((a, b) => (a as number) + (b as number), 0) as number;
                                                const isComplete = Object.keys(diagnosticAnswers).length === tool.questions.length;

                                                return (
                                                    <div className="space-y-8 pb-20">
                                                        <div className="mb-6">
                                                            <h2 className="text-3xl font-black text-white mb-2">{tool.name}</h2>
                                                            <p className="text-text-muted">{tool.description}</p>
                                                        </div>

                                                        {tool.questions.map((q) => (
                                                            <div key={q.id} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                                                <p className="font-bold text-white mb-4 text-lg">{q.question}</p>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                                    {q.options.map((opt) => (
                                                                        <button
                                                                            key={opt.value}
                                                                            onClick={() => setDiagnosticAnswers(prev => ({ ...prev, [q.id]: opt.value! }))}
                                                                            className={`p-3 rounded-xl text-xs font-bold transition-all ${diagnosticAnswers[q.id] === opt.value
                                                                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                                                                : 'bg-black/20 text-text-muted hover:bg-white/10'
                                                                                }`}
                                                                        >
                                                                            {opt.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {isComplete && (
                                                            <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#09090b] border-t border-white/10 md:absolute md:left-0 md:bottom-0 backdrop-blur-xl">
                                                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                                                                    <div>
                                                                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">KẾT QUẢ ĐÁNH GIÁ</p>
                                                                        <div className="flex items-baseline gap-2 mt-1">
                                                                            <span className="text-3xl font-black text-white">{score}</span>
                                                                            <span className="text-sm font-bold text-white/60">điểm</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {(() => {
                                                                            if (tool.interpret) {
                                                                                const result = tool.interpret(score);
                                                                                return (
                                                                                    <>
                                                                                        <p className={`text-xl font-bold ${result.color}`}>{result.level}</p>
                                                                                        <p className="text-xs text-white/60 mt-1 max-w-[200px]">{result.advice}</p>
                                                                                    </>
                                                                                );
                                                                            }
                                                                            return null;
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            // Render Flow (Symptom Checker)
                                            if (tool.flow) {
                                                const step = tool.flow.find((s) => s.id === currentStep);
                                                if (!step) return <div className="text-white">Không tìm thấy bước tiếp theo.</div>;

                                                return (
                                                    <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-8 animate-fade-in-up">
                                                        <h2 className="text-3xl font-black text-white leading-tight">{step.question}</h2>
                                                        <div className="grid gap-4 w-full">
                                                            {step.options.map((opt, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => {
                                                                        if (opt.next) setCurrentStep(opt.next);
                                                                        else if (opt.result) {
                                                                            toast("Đã có kết quả chẩn đoán!", { icon: <CheckCircle2 className="text-green-500" /> });
                                                                            alert(`KẾT QUẢ: ${opt.result}`);
                                                                        }
                                                                    }}
                                                                    className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all group text-left"
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-bold text-white group-hover:text-primary transition-colors text-lg">{opt.label}</span>
                                                                        <ChevronRight className="text-white/20 group-hover:text-primary transition-colors" />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => setCurrentStep(tool.flow![0].id)}
                                                            className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest mt-8"
                                                        >
                                                            <RefreshCw size={12} className="inline mr-2" /> Bắt đầu lại
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsDiagnosticOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}

interface MetricCardProps {
    label: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    percent: number;
}

function MetricCard({ label, value, unit, icon, color, percent }: MetricCardProps) {
    return (
        <div className={`p-4 rounded-2xl border ${color} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
            {/* Progress bg */}
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full" />
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percent, 100)}%` }}
                className="absolute bottom-0 left-0 h-1 bg-current opacity-50"
            />

            <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">{label}</span>
                {icon}
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tight">{value}</span>
                <span className="text-[10px] font-bold text-white/40">{unit}</span>
            </div>
        </div>
    );
}
