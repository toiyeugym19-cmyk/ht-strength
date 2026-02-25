import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPWA() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ User accepted PWA install');
            setShowBanner(false);
        }

        setInstallPrompt(null);
    };

    if (!showBanner || !installPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 z-[9999] max-w-sm"
            >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-[2px] rounded-2xl shadow-2xl shadow-blue-500/30">
                    <div className="bg-[#0A0E17] p-4 rounded-2xl">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Download className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase">Cài đặt App</h3>
                                    <p className="text-[10px] text-zinc-400 font-medium">HT Strength System</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="text-zinc-500" size={16} />
                            </button>
                        </div>

                        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                            Cài đặt ứng dụng để truy cập nhanh hơn, làm việc offline và nhận thông báo!
                        </p>

                        <button
                            onClick={handleInstall}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-3 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wide"
                        >
                            Cài đặt ngay
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
