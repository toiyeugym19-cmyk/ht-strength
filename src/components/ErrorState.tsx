import { Warning } from '@phosphor-icons/react';

// ============================================================
//  ERROR STATE — Empty state khi lỗi (fetch fail, v.v.) + nút Thử lại
//  Dùng thống nhất trên toàn app theo SUPERAPP_ROADMAP
// ============================================================

export interface ErrorStateProps {
    /** Tiêu đề ngắn */
    title?: string;
    /** Mô tả chi tiết (optional) */
    message?: string;
    /** Gọi khi bấm "Thử lại" */
    onRetry?: () => void;
    /** Custom class cho container */
    className?: string;
}

export function ErrorState({
    title = 'Có lỗi xảy ra',
    message,
    onRetry,
    className = '',
}: ErrorStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
            style={{ minHeight: 200 }}
        >
            <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,69,58,0.15)', color: '#FF453A' }}
            >
                <Warning size={32} weight="duotone" />
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-1">{title}</h3>
            {message && (
                <p className="text-[13px] max-w-[280px] mb-4" style={{ color: 'var(--ios-secondary)' }}>
                    {message}
                </p>
            )}
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="apple-btn apple-btn--filled"
                >
                    Thử lại
                </button>
            )}
        </div>
    );
}
