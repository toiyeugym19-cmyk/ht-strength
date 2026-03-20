// ==========================================
// 📲 TABLET COMPONENT LIBRARY - Brite Thor Pro
// iPad-inspired components
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { Search } from 'lucide-react';


// ============ TABLET SPLIT VIEW ============
interface TabletSplitViewProps {
    sidebar: ReactNode;
    content: ReactNode;
    sidebarWidth?: number;
}

export function TabletSplitView({ sidebar, content, sidebarWidth = 320 }: TabletSplitViewProps) {
    return (
        <div className="flex h-full bg-[#030014]">
            <aside
                style={{ width: sidebarWidth }}
                className="h-full bg-[#0a0a0f] border-r border-white/5 overflow-y-auto shrink-0"
            >
                {sidebar}
            </aside>
            <main className="flex-1 overflow-y-auto">
                {content}
            </main>
        </div>
    );
}

// ============ TABLET HEADER ============
interface TabletHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: ReactNode;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

export function TabletHeader({ title, subtitle, rightAction, searchValue, onSearchChange }: TabletHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-[#030014]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    {subtitle && (
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">{subtitle}</span>
                    )}
                    <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {onSearchChange && (
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-64">
                            <Search size={16} className="text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-neutral-600"
                            />
                        </div>
                    )}
                    {rightAction}
                </div>
            </div>
        </header>
    );
}

// ============ TABLET GRID ============
interface TabletGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    gap?: number;
}

export function TabletGrid({ children, columns = 2, gap = 16 }: TabletGridProps) {
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4'
    };

    return (
        <div className={`grid ${gridCols[columns]}`} style={{ gap }}>
            {children}
        </div>
    );
}

// ============ TABLET CARD ============
interface TabletCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    selected?: boolean;
}

export function TabletCard({ children, className = '', onClick, selected }: TabletCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
                p-6 rounded-[24px] border backdrop-blur-sm transition-all cursor-pointer
                ${selected
                    ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
                }
                ${className}
            `}
        >
            {children}
        </motion.div>
    );
}

// ============ TABLET NAV RAIL ============
interface TabletNavRailProps {
    items: { id: string; icon: ReactNode; label: string }[];
    activeId: string;
    onSelect: (id: string) => void;
    collapsed?: boolean;
}

export function TabletNavRail({ items, activeId, onSelect, collapsed = false }: TabletNavRailProps) {
    return (
        <nav className={`flex flex-col gap-2 p-3 ${collapsed ? 'w-20' : 'w-56'} transition-all`}>
            {items.map((item) => (
                <motion.button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                        ${activeId === item.id
                            ? 'bg-primary/20 text-primary'
                            : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                        }
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    {item.icon}
                    {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
                </motion.button>
            ))}
        </nav>
    );
}

// ============ TABLET STAT ROW ============
interface TabletStatRowProps {
    stats: { label: string; value: string | number; color: string; icon: ReactNode }[];
}

export function TabletStatRow({ stats }: TabletStatRowProps) {
    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            {stat.icon}
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-[11px] font-bold text-white/60 uppercase tracking-widest mt-1">{stat.label}</div>
                </motion.div>
            ))}
        </div>
    );
}

// ============ TABLET POPOVER ============
interface TabletPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right';
}

export function TabletPopover({ isOpen, onClose, children, align = 'right' }: TabletPopoverProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[90]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`
                            absolute top-full mt-2 z-[100] min-w-[240px]
                            bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden
                            ${align === 'right' ? 'right-0' : 'left-0'}
                        `}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============ TABLET TABLE ============
interface TabletTableColumn<T> {
    key: keyof T;
    header: string;
    width?: number;
    render?: (value: T[keyof T], item: T) => ReactNode;
}

interface TabletTableProps<T> {
    columns: TabletTableColumn<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    selectedId?: string;
}

export function TabletTable<T extends { id: string }>({ columns, data, onRowClick, selectedId }: TabletTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/5">
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-4 py-3"
                                style={{ width: col.width }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <motion.tr
                            key={item.id}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                            onClick={() => onRowClick?.(item)}
                            className={`
                                border-b border-white/5 cursor-pointer transition-colors
                                ${selectedId === item.id ? 'bg-primary/10' : ''}
                            `}
                        >
                            {columns.map((col) => (
                                <td key={String(col.key)} className="px-4 py-4 text-sm text-white">
                                    {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ============ TABLET TABS ============
interface TabletTabsProps {
    tabs: { id: string; label: string; icon?: ReactNode }[];
    activeTab: string;
    onChange: (id: string) => void;
}

export function TabletTabs({ tabs, activeTab, onChange }: TabletTabsProps) {
    return (
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
                        ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'text-neutral-500 hover:text-white hover:bg-white/5'
                        }
                    `}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ============ EXPORTS ============
export default {
    TabletSplitView,
    TabletHeader,
    TabletGrid,
    TabletCard,
    TabletNavRail,
    TabletStatRow,
    TabletPopover,
    TabletTable,
    TabletTabs
};
