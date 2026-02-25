import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    RefreshCw,
    Users,
    Dumbbell,
    Settings,
    House,
    ChevronLeft,
    Menu,
    ChevronRight,
    Sparkles,
    CalendarDays,
    BookMarked,
    BarChart3,
    Star,
    Apple,
    SquareCheckBig,
    BookOpenText
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import CommandPalette from './CommandPalette';
import InstallPWA from './InstallPWA';
import { useDeviceDetect } from '../hooks/useDeviceDetect';

// ============================================================
//  TAB BAR — 5 mục dùng nhiều nhất (iOS HIG)
// ============================================================
const TABS = [
    { to: "/", icon: House, label: "Trang Chủ" },
    { to: "/members", icon: Users, label: "Hội Viên" },
    { to: "/gym", icon: Dumbbell, label: "Phòng Gym" },
    { to: "/analytics", icon: BarChart3, label: "Phân Tích" },
    { to: "/settings", icon: Settings, label: "Cài Đặt" },
];

// ============================================================
//  MENU "THÊM" — sắp xếp theo nhóm chức năng
// ============================================================
const MORE_LINKS = [
    // — Công việc & năng suất
    { to: "/work", icon: SquareCheckBig, label: "Nhiệm Vụ", color: "#0A84FF" },
    { to: "/calendar", icon: CalendarDays, label: "Lịch", color: "#FF3B30" },
    // — Sức khỏe & kiến thức
    { to: "/nutrition", icon: Apple, label: "Dinh Dưỡng", color: "#30D158" },
    { to: "/knowledge", icon: BookOpenText, label: "Kiến Thức", color: "#FF9F0A" },
    { to: "/journal", icon: BookMarked, label: "Nhật Ký", color: "#BF5AF2" },
    // — Tiện ích
    { to: "/review-hub", icon: Star, label: "Review Hub", color: "#FFD60A" },
    { to: "/ecosystem", icon: Sparkles, label: "Hệ Sinh Thái", color: "#64D2FF" },
];

// iOS-style page titles
const PAGE_TITLES: Record<string, string> = {
    '/': 'Trang Chủ',
    '/members': 'Hội Viên',
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
};

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const device = useDeviceDetect();
    const [isSyncing, setIsSyncing] = useState(true);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isLargeTitle, setIsLargeTitle] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsSyncing(false), 2000);
    }, []);

    // Track scroll for iOS large title collapse
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handler = () => setIsLargeTitle(el.scrollTop < 40);
        el.addEventListener('scroll', handler, { passive: true });
        return () => el.removeEventListener('scroll', handler);
    }, [location.pathname]);

    // Reset scroll on navigation
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
        setIsLargeTitle(true);
        setShowMoreMenu(false);
    }, [location.pathname]);

    const currentTitle = PAGE_TITLES[location.pathname] || 'HT-Strength';
    const isHome = location.pathname === '/';
    const canGoBack = !isHome && window.history.length > 1;

    return (
        <div className="ios-app-root" style={device.isTablet ? { display: 'flex', flexDirection: 'row' } : {}}>
            <CommandPalette />

            {/* ============ iPad SIDEBAR ============ */}
            {device.isTablet && <IPadSidebar />}

            <div style={device.isTablet ? { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 } : { display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* ============ iOS STATUS BAR ============ */}
                <div className="ios-status-bar-spacer" />

                {/* ============ iOS NAVIGATION BAR ============ */}
                <header className={`ios-nav-bar ${!isLargeTitle ? 'ios-nav-bar--collapsed' : ''}`}>
                    <div className="ios-nav-bar__top">
                        <div className="ios-nav-bar__left">
                            {canGoBack ? (
                                <button onClick={() => navigate(-1)} className="ios-nav-back">
                                    <ChevronLeft size={28} strokeWidth={2.5} />
                                    <span>Quay lại</span>
                                </button>
                            ) : (
                                <div className="ios-nav-bar__logo">
                                    <img src="/logo-hts.png" alt="HTS" className="ios-nav-logo-img" />
                                </div>
                            )}
                        </div>

                        <motion.div className="ios-nav-bar__center"
                            animate={{ opacity: isLargeTitle ? 0 : 1, y: isLargeTitle ? 8 : 0 }}
                            transition={{ duration: 0.2 }}>
                            <span className="ios-nav-small-title">{currentTitle}</span>
                        </motion.div>

                        <div className="ios-nav-bar__right">
                            <button onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 2000); }}
                                className="ios-nav-action">
                                <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                            </button>
                            {/* Hide hamburger on iPad — sidebar is always visible */}
                            {!device.isTablet && (
                                <button onClick={() => setShowMoreMenu(true)} className="ios-nav-action">
                                    <Menu size={20} />
                                </button>
                            )}
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
                        <Outlet />
                    </div>
                </div>

                {/* ============ iOS TAB BAR (iPhone only) ============ */}
                {!device.isTablet && <IOSTabBar />}
            </div>

            {/* ============ MORE MENU (iPhone only) ============ */}
            {!device.isTablet && (
                <AnimatePresence>
                    {showMoreMenu && (
                        <IOSMoreSheet onClose={() => setShowMoreMenu(false)} />
                    )}
                </AnimatePresence>
            )}

            <InstallPWA />
            <Toaster theme="dark" position="top-center" toastOptions={{
                style: { borderRadius: '14px', fontSize: '13px', fontWeight: '600' }
            }} />
        </div>
    );
}

// ============================================================
//  iOS 18 TAB BAR — Pixel-perfect native design
// ============================================================
function IOSTabBar() {
    const location = useLocation();

    return (
        <nav className="ios-tabbar">
            {TABS.map(tab => {
                const isActive = tab.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(tab.to);
                const Icon = tab.icon;
                return (
                    <NavLink key={tab.to} to={tab.to} end={tab.to === '/'}
                        className="ios-tabbar__item">
                        <div className={`ios-tabbar__icon ${isActive ? 'ios-tabbar__icon--active' : ''}`}>
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.2 : 1.8}
                                fill={isActive ? 'currentColor' : 'none'}
                            />
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

// ============================================================
//  iPad SIDEBAR — iPadOS 18 style permanent navigation
// ============================================================
const ALL_SIDEBAR_LINKS = [
    // Main tabs
    { to: "/", icon: House, label: "Trang Chủ", section: "main" },
    { to: "/members", icon: Users, label: "Hội Viên", section: "main" },
    { to: "/gym", icon: Dumbbell, label: "Phòng Gym", section: "main" },
    { to: "/analytics", icon: BarChart3, label: "Phân Tích", section: "main" },
    // More links
    { to: "/work", icon: SquareCheckBig, label: "Nhiệm Vụ", section: "more", color: "#0A84FF" },
    { to: "/calendar", icon: CalendarDays, label: "Lịch", section: "more", color: "#FF3B30" },
    { to: "/nutrition", icon: Apple, label: "Dinh Dưỡng", section: "more", color: "#30D158" },
    { to: "/knowledge", icon: BookOpenText, label: "Kiến Thức", section: "more", color: "#FF9F0A" },
    { to: "/journal", icon: BookMarked, label: "Nhật Ký", section: "more", color: "#BF5AF2" },
    { to: "/review-hub", icon: Star, label: "Review Hub", section: "more", color: "#FFD60A" },
    { to: "/ecosystem", icon: Sparkles, label: "Hệ Sinh Thái", section: "more", color: "#64D2FF" },
    // Settings
    { to: "/settings", icon: Settings, label: "Cài Đặt", section: "settings" },
];

function IPadSidebar() {
    const location = useLocation();

    const sidebarStyle: React.CSSProperties = {
        width: 220,
        minWidth: 220,
        height: '100%',
        background: 'rgba(28, 28, 30, 0.95)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRight: '0.5px solid rgba(84, 84, 88, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 12px 20px',
        overflowY: 'auto',
        overflowX: 'hidden',
    };

    const linkStyle = (isActive: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        fontSize: 15,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#fff' : '#98989F',
        background: isActive ? 'rgba(10, 132, 255, 0.18)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        marginBottom: 2,
    });

    const sectionLabelStyle: React.CSSProperties = {
        fontSize: 11,
        fontWeight: 600,
        color: '#636366',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        padding: '16px 14px 6px',
    };

    const mainLinks = ALL_SIDEBAR_LINKS.filter(l => l.section === 'main');
    const moreLinks = ALL_SIDEBAR_LINKS.filter(l => l.section === 'more');
    const settingsLinks = ALL_SIDEBAR_LINKS.filter(l => l.section === 'settings');

    return (
        <aside style={sidebarStyle}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 20px' }}>
                <img src="/logo-hts.png" alt="HTS" style={{ height: 32, borderRadius: 8 }} />
                <span style={{ fontSize: 17, fontWeight: 700, color: '#F5F5F7', letterSpacing: -0.3 }}>
                    HT Strength
                </span>
            </div>

            {/* Main nav */}
            {mainLinks.map(link => {
                const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                    <NavLink key={link.to} to={link.to} end={link.to === '/'} style={linkStyle(isActive)}>
                        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} style={{ color: isActive ? '#0A84FF' : '#98989F' }} />
                        {link.label}
                    </NavLink>
                );
            })}

            {/* Divider + More */}
            <div style={sectionLabelStyle}>Thêm</div>
            {moreLinks.map(link => {
                const isActive = location.pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                    <NavLink key={link.to} to={link.to} style={linkStyle(isActive)}>
                        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} style={{ color: isActive ? link.color : '#98989F' }} />
                        {link.label}
                    </NavLink>
                );
            })}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Settings */}
            {settingsLinks.map(link => {
                const isActive = location.pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                    <NavLink key={link.to} to={link.to} style={linkStyle(isActive)}>
                        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} style={{ color: isActive ? '#8E8E93' : '#636366' }} />
                        {link.label}
                    </NavLink>
                );
            })}
        </aside>
    );
}

// ============================================================
//  iOS MORE SHEET — Native grouped inset list
// ============================================================
function IOSMoreSheet({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();

    const handleNav = (to: string) => {
        onClose();
        navigate(to);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 200
                }}
                onClick={onClose} />

            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    maxHeight: '85vh',
                    background: '#1C1C1F',
                    borderRadius: '14px 14px 0 0',
                    zIndex: 201, overflowY: 'auto',
                    paddingBottom: 'env(safe-area-inset-bottom, 20px)'
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
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Thêm</span>
                    <button onClick={onClose} style={{
                        fontSize: 17, fontWeight: 600, color: '#FF6B35',
                        background: 'none', border: 'none', cursor: 'pointer',
                        width: 60, textAlign: 'right', padding: 0
                    }}>
                        Xong
                    </button>
                </div>

                {/* ===== Grouped sections ===== */}
                {/* Section 1: Công việc */}
                <div style={{
                    fontSize: 13, fontWeight: 400, color: '#8E8E93',
                    padding: '4px 32px 6px', textTransform: 'uppercase' as const,
                    letterSpacing: 0.5
                }}>
                    Công việc
                </div>
                <div style={{
                    margin: '0 16px 12px',
                    background: '#2C2C2E',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '0.5px solid rgba(255,255,255,0.06)'
                }}>
                    {[MORE_LINKS[0], MORE_LINKS[1]].map((link, idx) => (
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
                                <link.icon size={16} color="white" strokeWidth={2} />
                            </div>
                            <span style={{ flex: 1, fontSize: 16, color: '#fff' }}>
                                {link.label}
                            </span>
                            <ChevronRight size={16} style={{ color: '#636366', flexShrink: 0 }} />
                        </div>
                    ))}
                </div>

                {/* Section 2: Sức khỏe */}
                <div style={{
                    fontSize: 13, fontWeight: 400, color: '#8E8E93',
                    padding: '0 32px 6px', textTransform: 'uppercase' as const,
                    letterSpacing: 0.5
                }}>
                    Sức khỏe & Kiến thức
                </div>
                <div style={{
                    margin: '0 16px 12px',
                    background: '#2C2C2E',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '0.5px solid rgba(255,255,255,0.06)'
                }}>
                    {[MORE_LINKS[2], MORE_LINKS[3], MORE_LINKS[4]].map((link, idx) => (
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
                                <link.icon size={16} color="white" strokeWidth={2} />
                            </div>
                            <span style={{ flex: 1, fontSize: 16, color: '#fff' }}>
                                {link.label}
                            </span>
                            <ChevronRight size={16} style={{ color: '#636366', flexShrink: 0 }} />
                        </div>
                    ))}
                </div>

                {/* Section 3: Tiện ích */}
                <div style={{
                    fontSize: 13, fontWeight: 400, color: '#8E8E93',
                    padding: '0 32px 6px', textTransform: 'uppercase' as const,
                    letterSpacing: 0.5
                }}>
                    Tiện ích
                </div>
                <div style={{
                    margin: '0 16px 12px',
                    background: '#2C2C2E',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '0.5px solid rgba(255,255,255,0.06)'
                }}>
                    {[MORE_LINKS[5], MORE_LINKS[6]].map((link, idx) => (
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
                                <link.icon size={16} color="white" strokeWidth={2} />
                            </div>
                            <span style={{ flex: 1, fontSize: 16, color: '#fff' }}>
                                {link.label}
                            </span>
                            <ChevronRight size={16} style={{ color: '#636366', flexShrink: 0 }} />
                        </div>
                    ))}
                </div>

                {/* ===== Profile Card ===== */}
                <div onClick={() => handleNav('/settings')} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    margin: '0 16px 12px',
                    background: '#2C2C2E',
                    borderRadius: 10, cursor: 'pointer',
                    border: '0.5px solid rgba(255,255,255,0.06)'
                }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6B35, #FF8B5C)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0
                    }}>HP</div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>
                            Admin Hùng Phan
                        </p>
                        <p style={{ fontSize: 13, color: '#AEAEB2', margin: '2px 0 0' }}>
                            v4.92 · Trực tuyến
                        </p>
                    </div>
                    <ChevronRight size={18} style={{ color: 'rgba(142,142,147,0.5)' }} />
                </div>
            </motion.div>
        </>
    );
}
