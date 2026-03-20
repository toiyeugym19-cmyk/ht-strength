import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    House,
    Barbell,
    Users,
    ChartBar,
    Sun,
    Moon,
    CaretRight,
    CalendarBlank,
    Trophy,
    BookOpenText,
    UserCircle,
    List,
    CheckSquare,
    AppleLogo,
    Notebook,
    Star,
    Sparkle,
    Fire,
    Footprints,
    Brain,
    TrendUp,
    Target,
    GearSix,
    SignOut,
    MagnifyingGlass,
    Bell,
} from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import CommandPalette from './CommandPalette';
import InstallPWA from './InstallPWA';
import { useMemberStore } from '../store/useMemberStore';
import { useTheme } from '../hooks/useTheme';
import logoHts from '../assets/logo-hts.png';
import AIChatbot from './AIChatbot';

// ============================================================
//  TAB BAR — Admin: Quản lý | Member: Tập luyện & Tiến độ
// ============================================================
const ADMIN_TABS = [
    { to: "/", icon: House, label: "Trang Chủ" },
    { to: "/members", icon: Users, label: "Hội Viên" },
    { to: "/calendar", icon: CalendarBlank, label: "Lịch" },
    { to: "/analytics", icon: ChartBar, label: "Phân Tích" },
    { to: "/profile", icon: UserCircle, label: "Hồ Sơ" },
];

/* Member: Trang chủ | Bài tập | Thiền Định | Tiến độ | Cẩm Nang */
const MEMBER_TABS = [
    { to: "/", icon: House, label: "Trang Chủ" },
    { to: "/exercises", icon: Barbell, label: "Bài Tập" },
    { to: "/meditation", icon: Brain, label: "Thiền Định" },
    { to: "/my-progress", icon: ChartBar, label: "Tiến Độ" },
    { to: "/knowledge", icon: BookOpenText, label: "Cẩm Nang" },
];

// ============================================================
//  MENU "THÊM" — sắp xếp theo nhóm chức năng
// ============================================================
const MORE_LINKS_ADMIN = [
    // — Công việc & năng suất
    { to: "/work", icon: CheckSquare, label: "Nhiệm Vụ", color: "#0A84FF" },
    { to: "/calendar", icon: CalendarBlank, label: "Lịch", color: "#FF3B30" },
    // — Sức khỏe & kiến thức
    { to: "/nutrition", icon: AppleLogo, label: "Dinh Dưỡng", color: "#30D158" },
    { to: "/knowledge", icon: BookOpenText, label: "Kiến Thức", color: "#FF9F0A" },
    { to: "/journal", icon: Notebook, label: "Nhật Ký", color: "#BF5AF2" },
    // — Tiện ích
    { to: "/review-hub", icon: Star, label: "Review Hub", color: "#FFD60A" },
    { to: "/ecosystem", icon: Sparkle, label: "Hệ Sinh Thái", color: "#64D2FF" },
];

// ============================================================
//  FITNESS LINKS — các trang fitness
// ============================================================
const FITNESS_LINKS = [
    { to: "/calories", icon: Fire, label: "Calories", color: "#FF6B00" },
    { to: "/steps", icon: Footprints, label: "Bước Chân", color: "#EC4899" },
    { to: "/meditation", icon: Brain, label: "Thiền", color: "#8B5CF6" },
    { to: "/progress", icon: TrendUp, label: "Tiến Trình", color: "#22C55E" },
    { to: "/social", icon: Trophy, label: "Thưởng & XH", color: "#F59E0B" },
    { to: "/profile", icon: UserCircle, label: "Hồ Sơ", color: "#6366F1" },
];

// Member version — chỉ các trang member cần
const MORE_LINKS_MEMBER = [
    { to: "/my-workout", icon: Barbell, label: "Buổi Tập Hôm Nay", color: "#FF6B35" },
    { to: "/my-plan", icon: CheckSquare, label: "Kế Hoạch Của Tôi", color: "#0A84FF" },
    { to: "/calendar", icon: CalendarBlank, label: "Lịch", color: "#FF3B30" },
    { to: "/calories", icon: Fire, label: "Calories", color: "#FF6B00" },
    { to: "/steps", icon: Footprints, label: "Bước Chân", color: "#EC4899" },
    { to: "/meditation", icon: Brain, label: "Thiền", color: "#8B5CF6" },
    { to: "/settings", icon: GearSix, label: "Cài Đặt", color: "#8E8E93" },
];

// iOS-style page titles
const PAGE_TITLES: Record<string, string> = {
    '/': 'Trang Chủ',
    '/exercises': 'Bài Tập',
    '/my-workout': 'Buổi Tập',
    '/my-plan': 'Kế Hoạch',
    '/my-progress': 'Tiến Trình',
    '/my-stats': 'Thống Kê',
    '/members': 'Hội Viên',
    '/pt': 'Huấn Luyện Viên',
    '/gym': 'Phòng Gym',
    '/analytics': 'Phân Tích',
    '/settings': 'Cài Đặt',
    '/work': 'Nhiệm Vụ',
    '/calendar': 'Lịch',
    '/nutrition': 'Dinh Dưỡng',
    '/knowledge': 'Kiến Thức',
    '/journal': 'Nhật Ký',
    '/review-hub': 'Review Hub',
    '/ecosystem': 'Hệ Sinh Thái',
    '/calories': 'Calories',
    '/steps': 'Bước Chân',
    '/meditation': 'Thiền',
    '/progress': 'Tiến Trình',
    '/social': 'Xã Hội',
    '/profile': 'Hồ Sơ',
};

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isLargeTitle, setIsLargeTitle] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'pt';

    useEffect(() => {
        useMemberStore.getState().refreshMemberStatus();
    }, []);

    // Track scroll for iOS large title collapse
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let ticking = false;
        const handler = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const current = el.scrollTop;
                    // Hysteresis: collapse at 45, expand only when nearly at top (5)
                    // Added a wider deadzone to prevent jittery layout shifts
                    setIsLargeTitle((prev) => {
                        if (prev && current > 45) return false;
                        if (!prev && current < 5) return true;
                        return prev;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };
        el.addEventListener('scroll', handler, { passive: true });
        return () => el.removeEventListener('scroll', handler);
    }, [location.pathname]);

    // Reset scroll on navigation
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
            setIsLargeTitle(true);
        }
        setIsMenuOpen(false);
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const currentTitle = PAGE_TITLES[location.pathname] || 'HT-Strength';

    return (
        <div className="ios-app-root gym-app">
            <CommandPalette />
            <div className="tony-island" />

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* ============ iOS STATUS BAR ============ */}
                <div className="ios-status-bar-spacer" />

                {/* ============ iOS NAVIGATION BAR ============ */}
                <header className={`ios-nav-bar ${!isLargeTitle ? 'ios-nav-bar--collapsed' : ''} ${location.pathname === '/' ? 'tony-nav-seamless' : ''}`} style={{ zIndex: 150 }}>
                    <div className="ios-nav-bar__top">
                        <div className="ios-nav-bar__left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                {/* Apple-style squircle icon badge with real logo */}
                                <div className="w-10 h-10 rounded-[12px] bg-[#161618] border border-white/10 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-all">
                                    <img src={logoHts} alt="HT Strength" className="w-full h-full object-contain p-1" />
                                </div>
                        </div>

                        {/* CENTER: Page title (hidden on home large title) */}
                        <motion.div className="ios-nav-bar__center"
                            initial={false}
                            animate={{
                                opacity: isLargeTitle ? 0 : 1,
                                y: isLargeTitle ? 8 : 0,
                                pointerEvents: isLargeTitle ? 'none' : 'auto'
                            }}
                            transition={{ duration: 0.2 }}>
                            <span className="ios-nav-small-title">{currentTitle}</span>
                        </motion.div>

                        {/* RIGHT: Hamburger always visible */}
                        <div className="ios-nav-bar__right" style={{ gap: 8 }}>
                            {location.pathname !== '/' && (
                                <>
                                    <button className="ios-nav-action" style={{ background: 'var(--tony-surface)', border: '1px solid var(--tony-border)' }}>
                                        <MagnifyingGlass size={20} weight="bold" />
                                    </button>
                                    <button className="ios-nav-action" style={{ background: 'var(--tony-red-dim)', border: '1px solid var(--tony-red)' }}>
                                        <Bell size={20} weight="fill" color="var(--tony-red)" />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="ios-nav-action"
                                aria-label="Open sidebar"
                            >
                                <List size={24} weight="bold" />
                            </button>
                        </div>
                    </div>

                    <motion.div className="ios-nav-bar__large-title"
                        animate={{ 
                            opacity: isLargeTitle && location.pathname !== '/' ? 1 : 0, 
                            height: isLargeTitle && location.pathname !== '/' ? 'auto' : 0, 
                            marginBottom: isLargeTitle && location.pathname !== '/' ? 4 : 0 
                        }}
                        transition={{ duration: 0.2 }}>
                        <h1 className="ios-large-title">{currentTitle}</h1>
                    </motion.div>
                </header>

                {/* ============ MAIN SCROLL CONTENT ============ */}
                <div ref={scrollRef} className="ios-content-scroll">
                    <div className="ios-content-inner">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                style={{ minHeight: '100%' }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ============ iOS TAB BAR ============ */}
                <IOSTabBar />
            </div>

            {/* ============ MORE MENU (Bottom Sheet) ============ */}
            <AnimatePresence>
                {isMenuOpen && (
                    <IOSMoreSheet
                        onClose={() => setIsMenuOpen(false)}
                        isAdmin={user?.role === 'admin' || user?.role === 'pt'}
                        userName={user?.displayName || user?.email || 'Người dùng'}
                    />
                )}
            </AnimatePresence>

            {/* ============ SIDEBAR DRAWER (Left) ============ */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <IOSSidebar
                        onClose={() => setIsSidebarOpen(false)}
                        isAdmin={user?.role === 'admin' || user?.role === 'pt'}
                        userName={user?.displayName || user?.email || 'Người dùng'}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                )}
            </AnimatePresence>

            <InstallPWA />
            {/* <AutomationMonitor /> */}
            {!isAdmin && <AIChatbot />}
            <Toaster
                theme="dark"
                position="top-center"
                toastOptions={{
                    style: {
                        borderRadius: '14px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: '#1E1E22',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F0F5',
                        padding: '12px 16px',
                    }
                }}
            />
        </div>
    );
}

// ============================================================
//  iOS 18 TAB BAR — Tony Edition
// ============================================================
function IOSTabBar() {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'pt';
    const baseTabs = isAdmin ? ADMIN_TABS : MEMBER_TABS;
    const tabs = user?.role === 'pt' ? baseTabs.filter(t => t.to !== '/pt') : baseTabs;

    return (
        <nav className="tony-tabbar">
            {tabs.map(tab => {
                const isActive = tab.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(tab.to);
                const Icon = tab.icon;
                return (
                    <NavLink key={tab.to} to={tab.to} end={tab.to === '/'}
                        style={{ textDecoration: 'none' }}
                        className={({ isActive }) => `ios-tabbar__item ${isActive ? 'ios-tabbar__item--active' : ''}`}>
                        <div className={`ios-tabbar__icon ${isActive ? 'ios-tabbar__icon--active' : ''}`}
                            style={{ color: isActive ? 'var(--tony-red)' : 'var(--tony-text-3)' }}>
                            <Icon size={26} weight={isActive ? 'fill' : 'bold'} />
                        </div>
                        <span className={`ios-tabbar__label ${isActive ? 'ios-tabbar__label--active' : ''}`}
                            style={{ color: isActive ? 'white' : 'var(--tony-text-3)', fontWeight: isActive ? 700 : 500 }}>
                            {tab.label}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
}

// ============================================================
//  iOS SIDEBAR — Comprehensive Navigation Drawer
// ============================================================
function IOSSidebar({ onClose, isAdmin, userName, theme, toggleTheme }: {
    onClose: () => void; isAdmin: boolean; userName: string;
    theme: string; toggleTheme: () => void;
}) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const location = useLocation();

    const menuLinks = isAdmin ? [
        { to: "/pt", icon: UserCircle, label: "Đội ngũ PT" },
        { to: "/gym", icon: Barbell, label: "Cơ sở" },
        { to: "/work", icon: CheckSquare, label: "Nhiệm vụ" },
        { to: "/nutrition", icon: AppleLogo, label: "Dinh dưỡng" },
        { to: "/analytics", icon: ChartBar, label: "Báo cáo" },
        { to: "/settings", icon: GearSix, label: "Cài đặt" },
    ] : [
        { to: "/my-stats", icon: Trophy, label: "Thống kê" },
        { to: "/my-workout", icon: Barbell, label: "Buổi tập hôm nay" },
        { to: "/my-plan", icon: Target, label: "Kế hoạch tập" },
        { to: "/calories", icon: Fire, label: "Calories" },
        { to: "/steps", icon: Footprints, label: "Bước chân" },
        { to: "/settings", icon: GearSix, label: "Cài đặt" },
    ];

    const handleNav = (to: string) => {
        onClose();
        navigate(to);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 500
                }}
                onClick={onClose}
            />

            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                    position: 'fixed', top: 0, left: 0, bottom: 0,
                    width: '280px',
                    background: 'var(--tony-bg)',
                    zIndex: 501,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '20px 0 50px rgba(0,0,0,0.8)',
                    borderRight: '1px solid var(--tony-border)'
                }}
            >
                {/* Sidebar Header */}
                <div style={{ padding: '40px 24px 20px', borderBottom: '1px solid var(--g-separator)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{
                            width: 50, height: 50, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--g-accent), #FF8B5C)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, fontWeight: 700, color: '#fff',
                            boxShadow: '0 4px 12px rgba(232, 97, 58, 0.3)'
                        }}>
                            {userName[0].toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--g-text)', margin: 0 }}>{userName}</p>
                            <p style={{ fontSize: 12, color: 'var(--g-text-3)', margin: 0 }}>{isAdmin ? 'Quản trị viên' : 'Hội viên'} • Trực tuyến</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Scroll Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }} className="no-scrollbar">
                    {menuLinks.map((link, idx) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.to;
                        return (
                            <div
                                key={idx}
                                onClick={() => handleNav(link.to)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    cursor: 'pointer',
                                    background: isActive ? 'var(--g-accent-dim)' : 'transparent',
                                    marginBottom: 4,
                                    transition: 'background 0.2s'
                                }}
                            >
                                <Icon size={22} weight={isActive ? 'fill' : 'bold'} color={isActive ? 'var(--g-accent)' : 'var(--g-text-2)'} />
                                <span style={{
                                    fontSize: 15,
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? 'var(--g-text)' : 'var(--g-text-2)'
                                }}>
                                    {link.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar Footer */}
                <div style={{ padding: '20px 16px', borderTop: '1px solid var(--g-separator)' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 12,
                            background: 'var(--g-surface-2)',
                            border: 'none',
                            color: 'var(--g-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            marginBottom: 12,
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {theme === 'dark' ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
                        {theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
                    </button>

                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 12,
                            background: 'rgba(255, 69, 58, 0.1)',
                            border: 'none',
                            color: '#FF453A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        <SignOut size={20} weight="bold" />
                        Đăng xuất
                    </button>
                    <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--g-text-3)', marginTop: 16, opacity: 0.5 }}>
                        HT-STRENGTH v4.2.1
                    </p>
                </div>
            </motion.div>
        </>
    );
}

// ============================================================
//  iOS MORE SHEET — Native grouped inset list
// ============================================================
function IOSMoreSheet({ onClose, isAdmin, userName }: { onClose: () => void; isAdmin: boolean; userName: string }) {
    const navigate = useNavigate();

    const handleNav = (to: string) => {
        onClose();
        navigate(to);
    };

    const renderGroup = (title: string, links: typeof MORE_LINKS_ADMIN) => (
        <>
            <div style={{
                fontSize: 13, fontWeight: 400, color: 'var(--g-text-tertiary, #8E8E93)',
                padding: '4px 32px 6px', textTransform: 'uppercase' as const,
                letterSpacing: 0.5
            }}>
                {title}
            </div>
            <div style={{
                margin: '0 16px 12px',
                background: 'var(--g-card, #2C2C2E)',
                borderRadius: 10,
                overflow: 'hidden',
                border: '0.5px solid var(--g-border, rgba(255,255,255,0.06))'
            }}>
                {links.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                        <div key={link.to}
                            onClick={() => handleNav(link.to)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderTop: idx > 0 ? '0.5px solid rgba(84,84,88,0.35)' : 'none',
                                WebkitTapHighlightColor: 'transparent'
                            }}>
                            <div style={{
                                width: 30, height: 30, borderRadius: 7,
                                background: link.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Icon size={16} color="white" weight="bold" />
                            </div>
                            <span style={{ flex: 1, fontSize: 16, color: 'var(--g-text, #fff)' }}>
                                {link.label}
                            </span>
                            <CaretRight size={16} weight="bold" style={{ color: 'var(--g-text-tertiary, #636366)', flexShrink: 0 }} />
                        </div>
                    );
                })}
            </div>
        </>
    );

    // Get initials for avatar
    const initials = userName
        .split(' ')
        .map(w => w[0])
        .slice(-2)
        .join('')
        .toUpperCase();

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 200
                }}
                onClick={onClose} />

            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                display: 'flex', justifyContent: 'center',
                zIndex: 201, pointerEvents: 'none'
            }}>
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    style={{
                        width: '100%', maxWidth: 430,
                        maxHeight: '85vh',
                        background: 'var(--g-bg-secondary, #1C1C1F)',
                        borderRadius: '14px 14px 0 0',
                        overflowY: 'auto',
                        paddingBottom: 'env(safe-area-inset-bottom, 20px)',
                        pointerEvents: 'auto'
                    }}>

                    {/* Handle */}
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                        <div style={{
                            width: 36, height: 5, borderRadius: 100,
                            background: 'rgba(142,142,147,0.5)'
                        }} />
                    </div>

                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '6px 16px 10px'
                    }}>
                        <div style={{ width: 60 }} />
                        <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--g-text, #fff)' }}>Thêm</span>
                        <button onClick={onClose} style={{
                            fontSize: 17, fontWeight: 600, color: 'var(--g-accent, #FF6B35)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            width: 60, textAlign: 'right', padding: 0
                        }}>
                            Xong
                        </button>
                    </div>

                    {/* ===== Grouped sections ===== */}
                    {isAdmin ? (
                        <>
                            {renderGroup('Công việc', [MORE_LINKS_ADMIN[0], MORE_LINKS_ADMIN[1]])}
                            {renderGroup('Sức khỏe & Kiến thức', [MORE_LINKS_ADMIN[2], MORE_LINKS_ADMIN[3], MORE_LINKS_ADMIN[4]])}
                            {renderGroup('Tiện ích', [MORE_LINKS_ADMIN[5], MORE_LINKS_ADMIN[6]])}
                            {renderGroup('Fitness', FITNESS_LINKS)}
                        </>
                    ) : (
                        <>
                            {renderGroup('Tập luyện', [MORE_LINKS_MEMBER[0], MORE_LINKS_MEMBER[1]])}
                            {renderGroup('Sức khỏe', [MORE_LINKS_MEMBER[2], MORE_LINKS_MEMBER[3], MORE_LINKS_MEMBER[4], MORE_LINKS_MEMBER[5]])}
                            {renderGroup('Khác', [MORE_LINKS_MEMBER[6]])}
                        </>
                    )}

                    {/* ===== Profile Card ===== */}
                    <div onClick={() => handleNav('/profile')} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px',
                        margin: '0 16px 12px',
                        background: 'var(--g-card, #2C2C2E)',
                        borderRadius: 10, cursor: 'pointer',
                        border: '0.5px solid var(--g-border, rgba(255,255,255,0.06))'
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF6B35, #FF8B5C)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0
                        }}>{initials}</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--g-text, #fff)', margin: 0 }}>
                                {userName}
                            </p>
                            <p style={{ fontSize: 13, color: 'var(--g-text-secondary, #AEAEB2)', margin: '2px 0 0' }}>
                                {isAdmin ? 'Admin' : 'Member'} · Trực tuyến
                            </p>
                        </div>
                        <CaretRight size={18} weight="bold" style={{ color: 'rgba(142,142,147,0.5)' }} />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
