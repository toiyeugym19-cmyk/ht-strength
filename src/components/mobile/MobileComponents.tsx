// ==========================================
// 📱 MOBILE COMPONENT LIBRARY - Brite Thor Pro
// Premium iOS-inspired components
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { ChevronRight, ChevronLeft, X, Search, Plus } from 'lucide-react';


// ============ ANIMATIONS ============
export const mobileAnimations = {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    slideUp: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 } },
    slideRight: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 50, opacity: 0 } },
    scale: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 } },
    stagger: { animate: { transition: { staggerChildren: 0.05 } } }
};

// ============ MOBILE HEADER ============
interface MobilePageHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: ReactNode;
    showBack?: boolean;
    onBack?: () => void;
}

export function MobilePageHeader({ title, subtitle, rightAction, showBack, onBack }: MobilePageHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-[#030014]/90 backdrop-blur-2xl border-b border-white/5">
            <div className="px-5 pt-4 pb-3">
                {subtitle && (
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">{subtitle}</span>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center text-primary">
                                <ChevronLeft size={28} />
                            </button>
                        )}
                        <h1 className="text-[28px] font-black text-white tracking-tight">{title}</h1>
                    </div>
                    {rightAction}
                </div>
            </div>
        </header>
    );
}

// ============ MOBILE SEARCH BAR ============
interface MobileSearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export function MobileSearchBar({ placeholder = "Tìm kiếm...", value, onChange }: MobileSearchBarProps) {
    return (
        <div className="mx-4 mb-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <Search size={18} className="text-neutral-500" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder:text-neutral-600"
                />
                {value && (
                    <button onClick={() => onChange('')} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <X size={12} className="text-neutral-400" />
                    </button>
                )}
            </div>
        </div>
    );
}

// ============ MOBILE STAT CARD ============
interface MobileStatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    color: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';
    trend?: string;
}

export function MobileStatCard({ label, value, icon, color, trend }: MobileStatCardProps) {
    const colors = {
        blue: 'from-blue-600/30 to-blue-600/5 border-blue-500/20 text-blue-400',
        purple: 'from-purple-600/30 to-purple-600/5 border-purple-500/20 text-purple-400',
        green: 'from-green-600/30 to-green-600/5 border-green-500/20 text-green-400',
        orange: 'from-orange-600/30 to-orange-600/5 border-orange-500/20 text-orange-400',
        red: 'from-red-600/30 to-red-600/5 border-red-500/20 text-red-400',
        pink: 'from-pink-600/30 to-pink-600/5 border-pink-500/20 text-pink-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            className={`p-5 rounded-[24px] bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${colors[color].split(' ').pop()}`}>
                    {icon}
                </div>
                {trend && <span className="text-[10px] font-bold text-green-400">{trend}</span>}
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{value}</div>
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mt-1">{label}</div>
        </motion.div>
    );
}

// ============ MOBILE LIST ITEM ============
interface MobileListItemProps {
    avatar?: string;
    title: string;
    subtitle?: string;
    badge?: ReactNode;
    status?: 'active' | 'inactive' | 'warning';
    onClick?: () => void;
    rightElement?: ReactNode;
}

export function MobileListItem({ avatar, title, subtitle, badge, status, onClick, rightElement }: MobileListItemProps) {
    const statusColors = {
        active: 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]',
        inactive: 'bg-red-500',
        warning: 'bg-yellow-500'
    };

    return (
        <motion.div
            whileTap={{ scale: 0.98, backgroundColor: 'rgba(255,255,255,0.03)' }}
            onClick={onClick}
            className="flex items-center gap-4 px-5 py-4 border-b border-white/5 cursor-pointer active:bg-white/5 transition-colors"
        >
            {avatar && (
                <div className="relative">
                    <img src={avatar} className="w-14 h-14 rounded-2xl object-cover border border-white/10" alt="" />
                    {status && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-[3px] border-[#030014] ${statusColors[status]}`} />
                    )}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-[16px] truncate">{title}</h3>
                    {badge}
                </div>
                {subtitle && <p className="text-[13px] text-neutral-500 mt-0.5 truncate">{subtitle}</p>}
            </div>
            {rightElement || <ChevronRight size={20} className="text-neutral-700 shrink-0" />}
        </motion.div>
    );
}

// ============ MOBILE CARD ============
interface MobileCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    gradient?: 'blue' | 'purple' | 'none';
}

export function MobileCard({ children, className = '', onClick, gradient = 'none' }: MobileCardProps) {
    const gradients = {
        none: 'bg-white/[0.03]',
        blue: 'bg-gradient-to-br from-blue-600/20 to-transparent',
        purple: 'bg-gradient-to-br from-purple-600/20 to-transparent'
    };

    return (
        <motion.div
            whileTap={onClick ? { scale: 0.97 } : undefined}
            onClick={onClick}
            className={`p-5 rounded-[24px] border border-white/[0.06] ${gradients[gradient]} backdrop-blur-sm ${className}`}
        >
            {children}
        </motion.div>
    );
}

// ============ MOBILE CHIP/TAG ============
interface MobileChipProps {
    label: string;
    color?: 'primary' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'neutral';
    size?: 'sm' | 'md';
}

export function MobileChip({ label, color = 'neutral', size = 'sm' }: MobileChipProps) {
    const colors = {
        primary: 'bg-primary/20 text-primary border-primary/30',
        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
        orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        red: 'bg-red-500/20 text-red-400 border-red-500/30',
        neutral: 'bg-white/10 text-neutral-400 border-white/10'
    };

    const sizes = {
        sm: 'px-2.5 py-1 text-[9px]',
        md: 'px-3 py-1.5 text-[11px]'
    };

    return (
        <span className={`inline-flex items-center rounded-full font-black uppercase tracking-tight border ${colors[color]} ${sizes[size]}`}>
            {label}
        </span>
    );
}

// ============ MOBILE SEGMENT CONTROL ============
interface MobileSegmentProps {
    options: { id: string; label: string; icon?: ReactNode }[];
    value: string;
    onChange: (value: string) => void;
}

export function MobileSegmentControl({ options, value, onChange }: MobileSegmentProps) {
    return (
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mx-4 mb-4">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-bold transition-all ${value === option.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-neutral-500'
                        }`}
                >
                    {option.icon}
                    <span>{option.label}</span>
                </button>
            ))}
        </div>
    );
}

// ============ MOBILE FLOATING ACTION BUTTON ============
interface MobileFABProps {
    icon?: ReactNode;
    onClick: () => void;
    badge?: number;
}

export function MobileFAB({ icon = <Plus size={24} />, onClick, badge }: MobileFABProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-28 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_8px_32px_rgba(var(--primary-rgb),0.4)] z-[80] border-4 border-[#030014]"
        >
            {icon}
            {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {badge}
                </span>
            )}
        </motion.button>
    );
}

// ============ MOBILE BOTTOM SHEET ============
interface MobileBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function MobileBottomSheet({ isOpen, onClose, title, children }: MobileBottomSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-[32px] z-[101] max-h-[90vh] overflow-hidden"
                    >
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 bg-white/20 rounded-full" />
                        </div>
                        {title && (
                            <div className="px-6 py-3 border-b border-white/10">
                                <h2 className="text-lg font-black text-white text-center">{title}</h2>
                            </div>
                        )}
                        <div className="overflow-y-auto max-h-[calc(90vh-100px)] pb-safe">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============ MOBILE PROGRESS RING ============
interface MobileProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    children?: ReactNode;
}

export function MobileProgressRing({ progress, size = 80, strokeWidth = 8, color = 'var(--primary)', children }: MobileProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

// ============ MOBILE SKELETON ============
export function MobileSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-white/5 rounded-2xl animate-pulse ${className}`} />
    );
}

// ============ MOBILE EMPTY STATE ============
interface MobileEmptyStateProps {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function MobileEmptyState({ icon, title, description, action }: MobileEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-neutral-600 mb-6">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            {description && <p className="text-sm text-neutral-500 mb-6">{description}</p>}
            {action}
        </div>
    );
}

// ============ EXPORTS ============
export default {
    MobilePageHeader,
    MobileSearchBar,
    MobileStatCard,
    MobileListItem,
    MobileCard,
    MobileChip,
    MobileSegmentControl,
    MobileFAB,
    MobileBottomSheet,
    MobileProgressRing,
    MobileSkeleton,
    MobileEmptyState,
    mobileAnimations
};
