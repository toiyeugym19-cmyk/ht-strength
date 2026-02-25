// Mobile UI Components - Shared across all screens
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, Settings } from 'lucide-react';

// Types
export type Screen =
    | 'os' | 'members' | 'chat' | 'bio' | 'neural' | 'onboarding'
    | 'os_analytics' | 'os_calendar' | 'os_notifications' | 'os_reports' | 'os_settings'
    | 'member_detail' | 'members_add' | 'members_groups' | 'members_expired' | 'members_stats'
    | 'chat_broadcast' | 'chat_templates' | 'chat_history' | 'chat_bots'
    | 'bio_health' | 'bio_goals' | 'bio_achievements' | 'bio_schedule' | 'bio_settings'
    | 'neural_workflows' | 'neural_logs' | 'neural_blueprints' | 'neural_integrations' | 'neural_diagnostics';

export type NavFunction = (screen: Screen, data?: any) => void;

// --- THOR PRO LOGO (Clickable to Home) ---
export const ThorProLogo = ({ nav, size = 'default' }: { nav: NavFunction, size?: 'small' | 'default' | 'large' }) => {
    const sizes = {
        small: { text: 'text-lg', badge: 'text-[6px]' },
        default: { text: 'text-2xl', badge: 'text-[8px]' },
        large: { text: 'text-3xl', badge: 'text-[9px]' }
    };

    return (
        <div
            onClick={() => nav('os')}
            className="cursor-pointer active:scale-95 transition-transform select-none"
        >
            <h1 className={`${sizes[size].text} font-[1000] text-white italic uppercase tracking-tighter leading-none`}>
                THOR <span className="text-primary">PRO</span>
            </h1>
            <span className={`${sizes[size].badge} font-black text-zinc-600 uppercase tracking-widest`}>
                MODUN OS v4.2
            </span>
        </div>
    );
};

// --- APP HEADER with Logo ---
export const AppHeader = ({
    title,
    subtitle,
    nav,
    showBack = false,
    backTo = 'os',
    showLogo = true,
    showHomeButton = true
}: {
    title?: string,
    subtitle?: string,
    nav: NavFunction,
    showBack?: boolean,
    backTo?: Screen,
    showLogo?: boolean,
    showHomeButton?: boolean
}) => (
    <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            {showBack && (
                <button
                    onClick={() => nav(backTo)}
                    className="p-3 bg-zinc-900 rounded-2xl border border-white/5 active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} className="text-white" />
                </button>
            )}
            {showLogo ? (
                <ThorProLogo nav={nav} size={showBack ? 'small' : 'default'} />
            ) : (
                <div onClick={() => nav('os')} className="cursor-pointer active:scale-95 transition-transform">
                    <h1 className="text-2xl font-[1000] text-white italic uppercase tracking-tighter leading-none">{title}</h1>
                    {subtitle && <span className="text-[8px] font-black text-primary uppercase tracking-widest">{subtitle}</span>}
                </div>
            )}
        </div>
        {showHomeButton && (
            <button
                onClick={() => nav('os')}
                className="p-2.5 bg-zinc-900/50 rounded-xl border border-white/5 active:scale-95 transition-transform"
                title="Về trang chủ"
            >
                <LayoutGrid size={18} className="text-zinc-400" />
            </button>
        )}
    </div>
);

// --- SUB-MENU GRID ---
interface SubMenuItem {
    icon: any;
    label: string;
    desc: string;
    screen: Screen;
    color: string;
}

export const SubMenuGrid = ({ items, nav }: { items: SubMenuItem[], nav: NavFunction }) => (
    <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => nav(item.screen)}
                className="p-5 bg-zinc-900/40 border border-white/5 rounded-[2rem] active:scale-95 transition-all cursor-pointer group hover:bg-zinc-900/60"
            >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon size={18} className="text-white" />
                </div>
                <h3 className="text-[11px] font-black text-white uppercase italic mb-1">{item.label}</h3>
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wide">{item.desc}</p>
            </motion.div>
        ))}
    </div>
);

// --- HORIZONTAL MENU BAR ---
export const HorizontalMenu = ({ items, nav }: { items: SubMenuItem[], nav: NavFunction }) => (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {items.map((item, i) => (
            <button
                key={i}
                onClick={() => nav(item.screen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 border border-white/5 rounded-xl shrink-0 active:scale-95 transition-transform hover:bg-zinc-900/80"
            >
                <item.icon size={14} className="text-zinc-400" />
                <span className="text-[9px] font-black text-zinc-400 uppercase">{item.label}</span>
            </button>
        ))}
    </div>
);

// --- KPI CARD ---
export const KPICard = ({
    icon: Icon,
    label,
    value,
    color = 'blue',
    onClick
}: {
    icon: any,
    label: string,
    value: string | number,
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple',
    onClick?: () => void
}) => {
    const colors = {
        blue: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
        green: 'bg-green-600/10 border-green-500/20 text-green-400',
        red: 'bg-red-600/10 border-red-500/20 text-red-400',
        yellow: 'bg-yellow-600/10 border-yellow-500/20 text-yellow-400',
        purple: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
    };
    const iconColors = {
        blue: 'text-blue-500/10',
        green: 'text-green-500/10',
        red: 'text-red-500/10',
        yellow: 'text-yellow-500/10',
        purple: 'text-purple-500/10',
    };

    return (
        <div
            onClick={onClick}
            className={`p-5 ${colors[color].split(' ')[0]} border ${colors[color].split(' ')[1]} rounded-[2rem] relative overflow-hidden ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
        >
            <Icon size={50} className={`absolute -right-2 -top-2 ${iconColors[color]}`} />
            <span className={`text-[9px] font-black ${colors[color].split(' ')[2]} uppercase tracking-widest`}>{label}</span>
            <h2 className="text-4xl font-[1000] text-white italic">{value}</h2>
        </div>
    );
};

// --- PLACEHOLDER SCREEN ---
export const PlaceholderScreen = ({ title, nav, backTo }: { title: string, nav: NavFunction, backTo: Screen }) => (
    <div className="p-6 pt-12 h-screen bg-[#030014] flex flex-col pb-32">
        <AppHeader nav={nav} showBack backTo={backTo} />
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Settings size={32} className="text-zinc-700 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <h2 className="text-xl font-black text-white italic uppercase mb-2">{title}</h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Đang Phát Triển</p>
            </div>
        </div>
    </div>
);

// --- TAB BUTTON (Bottom Navigation) ---
export const TabButton = ({
    active,
    onClick,
    icon: Icon,
    label
}: {
    active: boolean,
    onClick: () => void,
    icon: any,
    label: string
}) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-all duration-300 relative px-3 ${active ? 'text-blue-500' : 'text-zinc-600'}`}
    >
        {active && (
            <motion.div
                layoutId="tab-active"
                className="absolute -top-2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            />
        )}
        <Icon size={20} strokeWidth={active ? 2.5 : 2} className="transition-transform active:scale-95" />
        <span className={`text-[7px] font-black uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
    </button>
);

// --- LIST ITEM ---
export const ListItem = ({
    avatar,
    title,
    subtitle,
    onClick
}: {
    avatar?: string,
    title: string,
    subtitle?: string,
    onClick?: () => void
}) => (
    <div
        onClick={onClick}
        className="p-3 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
    >
        {avatar && <img src={avatar} className="w-10 h-10 rounded-xl bg-zinc-800" />}
        <div className="flex-1">
            <h4 className="text-[12px] font-black text-white uppercase">{title}</h4>
            {subtitle && <p className="text-[9px] text-zinc-500 font-bold">{subtitle}</p>}
        </div>
        <ChevronRight size={14} className="text-zinc-700" />
    </div>
);

// --- SEARCH INPUT ---
export const SearchInput = ({
    value,
    onChange,
    placeholder = 'Tìm kiếm...'
}: {
    value: string,
    onChange: (val: string) => void,
    placeholder?: string
}) => (
    <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white placeholder:text-zinc-700 outline-none focus:border-primary/30 transition-colors"
        />
    </div>
);
