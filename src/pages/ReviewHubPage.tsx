import { useState, useEffect } from 'react';
import { Copy, ExternalLink, RefreshCw, Star, Trophy } from 'lucide-react';
import REVIEWS from '../data/gymReviews.json';
import { toast } from 'sonner';

// ============================================================
//  iOS 18 REVIEW HUB - Native Design
// ============================================================

export default function ReviewHubPage() {
    const [view, setView] = useState<'admin' | 'customer'>('admin');
    const [randomReview, setRandomReview] = useState('');
    const [targetUrl, setTargetUrl] = useState('https://maps.app.goo.gl/EoatxPKih7iD5WzM7?g_st=ipc');
    const [publicUrl, setPublicUrl] = useState('https://curvy-tables-cheat.loca.lt');

    const displayUrl = publicUrl || (typeof window !== 'undefined' ? `${window.location.origin}/review-hub` : '');
    const qrData = `${displayUrl}${displayUrl.includes('?') ? '&' : '?'}mode=customer`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mode') === 'customer') {
            setView('customer');
            setRandomReview(REVIEWS[Math.floor(Math.random() * REVIEWS.length)]);
        }
    }, []);

    const refreshReview = () => setRandomReview(REVIEWS[Math.floor(Math.random() * REVIEWS.length)]);

    const handleCopyAndGo = () => {
        navigator.clipboard.writeText(randomReview);
        toast.success("Đã sao chép nội dung!", { description: "Đang chuyển hướng tới Google Maps..." });
        setTimeout(() => { window.location.href = targetUrl; }, 800);
    };

    // =================== CUSTOMER VIEW (iOS Native) ===================
    if (view === 'customer') {
        return (
            <div className="ios-animate-in flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
                <div className="w-20 h-20 bg-[var(--ios-tint)]/20 rounded-3xl flex items-center justify-center mb-6">
                    <Trophy className="text-[var(--ios-tint)]" size={40} />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Cảm ơn bạn!</h1>
                <p className="text-[var(--ios-text-secondary)] text-[15px] mb-8 max-w-sm">
                    Sự đánh giá của bạn là động lực để chúng tôi nâng tầm dịch vụ.
                </p>

                {/* Stars */}
                <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={28} className="text-[#FFD60A] fill-[#FFD60A]" />
                    ))}
                </div>

                {/* Review Content */}
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-5 mb-6 w-full max-w-sm">
                    <p className="text-[15px] text-[var(--ios-text-secondary)] leading-relaxed">
                        "{randomReview || REVIEWS[0]}"
                    </p>
                </div>

                {/* CTA */}
                <button onClick={handleCopyAndGo}
                    className="w-full max-w-sm py-4 bg-[var(--ios-tint)] text-white rounded-2xl font-semibold text-[17px] active:scale-[0.98] transition-transform mb-4">
                    <Copy size={18} className="inline mr-2" /> Sao chép và đánh giá 5⭐
                </button>

                {/* Instruction */}
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-4 w-full max-w-sm text-left mb-6">
                    <p className="text-[13px] text-[var(--ios-text-secondary)] leading-relaxed">
                        <span className="text-[var(--ios-tint)] font-semibold">Hướng dẫn:</span> Sau khi nhấn nút trên, bạn chỉ cần <span className="text-white font-semibold">chạm giữ</span> vào ô nhận xét và chọn <span className="text-white font-semibold">Dán (Paste)</span>.
                    </p>
                </div>

                <button onClick={refreshReview} className="flex items-center gap-2 text-[var(--ios-tint)] text-[15px] font-medium">
                    <RefreshCw size={16} /> Đổi nội dung khác
                </button>
            </div>
        );
    }

    // =================== ADMIN VIEW (iOS Native) ===================
    return (
        <div className="ios-animate-in space-y-5 pb-4">

            {/* Switch to customer view */}
            <div className="mx-4 mt-2">
                <button onClick={() => { setView('customer'); refreshReview(); }}
                    className="w-full bg-[var(--ios-tint)] text-white rounded-2xl p-4 font-semibold text-[17px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    <ExternalLink size={18} /> Xem giao diện khách hàng
                </button>
            </div>

            {/* QR Code Card */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Mã QR đánh giá</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl p-5">
                    <div className="bg-white rounded-2xl p-6 max-w-[200px] mx-auto mb-4">
                        <img src={qrUrl} alt="QR Code" className="w-full h-auto" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => window.print()}
                            className="py-3 bg-[var(--ios-fill-tertiary)] text-white rounded-xl font-semibold text-[15px] active:scale-95 transition-transform">
                            In mã QR
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(qrData); toast.success("Đã sao chép link!"); }}
                            className="py-3 bg-[var(--ios-fill-tertiary)] text-white rounded-xl font-semibold text-[15px] active:scale-95 transition-transform">
                            Sao chép link
                        </button>
                    </div>
                </div>
            </div>

            {/* URL Settings */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">Cấu hình URL</p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-[var(--ios-separator)]">
                        <label className="text-[13px] text-[var(--ios-text-secondary)] block mb-1.5">Google Maps URL</label>
                        <input type="text" value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
                            className="w-full bg-transparent text-[15px] text-white outline-none" />
                    </div>
                    <div className="p-4">
                        <label className="text-[13px] text-[var(--ios-text-secondary)] block mb-1.5">Public Deploy URL</label>
                        <input type="text" value={publicUrl} onChange={e => setPublicUrl(e.target.value)}
                            className="w-full bg-transparent text-[15px] text-white outline-none" placeholder="https://your-site.com" />
                    </div>
                </div>
            </div>

            {/* AI Tip */}
            <div className="mx-4">
                <div className="bg-[#0A84FF]/10 rounded-2xl p-4 border border-[#0A84FF]/20">
                    <p className="text-[13px] text-[#0A84FF] leading-relaxed">
                        <span className="font-semibold">💡 Mẹo:</span> In mã QR và dán tại khu vực chờ. Khi khách quét, hệ thống sẽ ngẫu nhiên chọn 1 trong {REVIEWS.length} mẫu đánh giá.
                    </p>
                </div>
            </div>

            {/* Review Templates */}
            <div className="mx-4">
                <p className="text-[13px] font-medium text-[var(--ios-text-secondary)] uppercase px-4 mb-2">
                    Thư viện nội dung ({REVIEWS.length} mẫu)
                </p>
                <div className="bg-[var(--ios-card-bg)] rounded-2xl overflow-hidden">
                    {REVIEWS.slice(0, 10).map((review, idx) => (
                        <div key={idx} className={`p-4 ${idx < 9 ? 'border-b border-[var(--ios-separator)]' : ''}`}>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-[#FFD60A] fill-[#FFD60A]" />)}
                                </div>
                                <span className="text-[11px] text-[var(--ios-text-tertiary)]">Mẫu #{idx + 1}</span>
                            </div>
                            <p className="text-[15px] text-[var(--ios-text-secondary)] leading-relaxed line-clamp-2">"{review}"</p>
                        </div>
                    ))}
                    {REVIEWS.length > 10 && (
                        <div className="p-4 text-center">
                            <span className="text-[15px] text-[var(--ios-text-tertiary)]">Và {REVIEWS.length - 10} mẫu khác...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
