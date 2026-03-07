import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    House,
    Barbell,
    Users,
    ChartBar,
    Sun,
    Moon,
    CaretLeft,
    CalendarBlank,
    Trophy,
    BookOpenText,
    UserCircle,
} from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import CommandPalette from './CommandPalette';
import InstallPWA from './InstallPWA';
import { useMemberStore } from '../store/useMemberStore';
import { useTheme } from '../hooks/useTheme';

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

/* Member: Trang chủ | Bài tập | Tiến độ | Thống kê | Kiến thức */
const MEMBER_TABS = [
    { to: "/", icon: House, label: "Trang Chủ" },
    { to: "/exercises", icon: Barbell, label: "Bài Tập" },
    { to: "/my-progress", icon: ChartBar, label: "Tiến Độ" },
    { to: "/my-stats", icon: Trophy, label: "Thống Kê" },
    { to: "/knowledge", icon: BookOpenText, label: "Cẩm Nang" },
];

// iOS-style page titles
const PAGE_TITLES: Record<string, string> = {
    '/': 'Trang Chủ',
    '/exercises': 'Bài Tập',
    '/my-workout': 'Buổi Tập Hôm Nay',
    '/my-plan': 'Kế Hoạch Của Tôi',
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
    '/social': 'Thưởng & XH',
    '/profile': 'Hồ Sơ',
};

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isLargeTitle, setIsLargeTitle] = useState(true);
    const { theme, setLight, setDark } = useTheme();

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
    }, [location.pathname]);

    const currentTitle = PAGE_TITLES[location.pathname] || 'HT-Strength';
    const isHome = location.pathname === '/';
    const canGoBack = !isHome && window.history.length > 1;

    return (
        <div className="ios-app-root gym-app">
            <CommandPalette />

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* ============ iOS STATUS BAR ============ */}
                <div className="ios-status-bar-spacer" />

                {/* ============ iOS NAVIGATION BAR ============ */}
                <header className={`ios-nav-bar ${!isLargeTitle ? 'ios-nav-bar--collapsed' : ''}`}>
                    <div className="ios-nav-bar__top">
                        <div className="ios-nav-bar__left">
                            {canGoBack ? (
                                <button onClick={() => navigate(-1)} className="ios-nav-back">
                                    <CaretLeft size={24} weight="bold" />
                                    <span>Quay lại</span>
                                </button>
                            ) : (
                                <div className="ios-nav-bar__logo">
                                    <img src="/logo-hts.png" alt="HTS" className="ios-nav-logo-img" />
                                </div>
                            )}
                        </div>

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

                        <div className="ios-nav-bar__right" style={{ gap: 6, position: 'relative', zIndex: 1000 }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setLight(); }}
                                className={`ios-nav-action ${theme === 'light' ? 'ios-nav-action--active' : ''}`}
                                title="Light"
                                aria-label="Light mode"
                                style={{
                                    opacity: theme === 'light' ? 1 : 0.5,
                                    transform: theme === 'light' ? 'scale(1)' : 'scale(0.85)',
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                <Sun size={20} weight={theme === 'light' ? 'fill' : 'bold'} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDark(); }}
                                className={`ios-nav-action ${theme === 'dark' ? 'ios-nav-action--active' : ''}`}
                                title="Dark"
                                aria-label="Dark mode"
                                style={{
                                    opacity: theme === 'dark' ? 1 : 0.5,
                                    transform: theme === 'dark' ? 'scale(1)' : 'scale(0.85)',
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                <Moon size={20} weight={theme === 'dark' ? 'fill' : 'bold'} />
                            </button>
                        </div>
                    </div>

                    <motion.div className="ios-nav-bar__large-title"
                        animate={{ opacity: isLargeTitle ? 1 : 0, height: isLargeTitle ? 'auto' : 0, marginBottom: isLargeTitle ? 4 : 0 }}
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

            <InstallPWA />
            {/* <AutomationMonitor /> */}
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
//  iOS 18 TAB BAR — Pixel-perfect native design
// ============================================================
function IOSTabBar() {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'pt';
    const baseTabs = isAdmin ? ADMIN_TABS : MEMBER_TABS;
    const tabs = user?.role === 'pt' ? baseTabs.filter(t => t.to !== '/pt') : baseTabs;

    return (
        <nav className="ios-tabbar">
            {tabs.map(tab => {
                const isActive = tab.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(tab.to);
                const Icon = tab.icon;
                return (
                    <NavLink key={tab.to} to={tab.to} end={tab.to === '/'}
                        className={({ isActive }) => `ios-tabbar__item${isActive ? ' ios-tabbar__item--active' : ''}`}>
                        <div className={`ios-tabbar__icon ${isActive ? 'ios-tabbar__icon--active' : ''}`}>
                            <Icon size={24} weight={isActive ? 'fill' : 'duotone'} />
                        </div>
                        <span className={`ios-tabbar__label ${isActive ? 'ios-tabbar__label--active' : ''}`}>
                            {tab.label}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
