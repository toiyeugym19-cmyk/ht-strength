import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Barbell,
    ListChecks,
    BookOpenText,
    Flame,
    PersonSimpleRun,
    Brain,
    UserCircle,
    CaretRight,
    Bookmark,
    AppleLogo,
    Star,
    Sparkle,
    Gear,
    UserCheck,
    ChartBar,
} from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';

const MEMBER_LINKS = [
    { to: '/my-workout', icon: Barbell, label: 'Buổi Tập Hôm Nay', color: '#FF9F0A' },
    { to: '/my-plan', icon: ListChecks, label: 'Kế Hoạch Của Tôi', color: '#0A84FF' },
    { to: '/knowledge', icon: BookOpenText, label: 'Cẩm Nang', color: '#FF9F0A' },
    { to: '/calories', icon: Flame, label: 'Calories', color: '#FF6B00' },
    { to: '/steps', icon: PersonSimpleRun, label: 'Bước Chân', color: '#EC4899' },
    { to: '/meditation', icon: Brain, label: 'Thiền', color: '#8B5CF6' },
    { to: '/journal', icon: Bookmark, label: 'Nhật Ký', color: '#BF5AF2' },
    { to: '/profile', icon: UserCircle, label: 'Hồ Sơ', color: '#6366F1' },
];

const ADMIN_LINKS = [
    { to: '/pt', icon: UserCheck, label: 'Quản Lý Huấn Luyện Viên', color: '#BF5AF2' },
    { to: '/gym', icon: Barbell, label: 'Quản Lý Phòng Gym', color: '#0A84FF' },
    { to: '/analytics', icon: ChartBar, label: 'Phân Tích Dữ Liệu', color: '#30D158' },
    { to: '/nutrition', icon: AppleLogo, label: 'Dinh Dưỡng', color: '#30D158' },
    { to: '/journal', icon: Bookmark, label: 'Nhật Ký', color: '#BF5AF2' },
    { to: '/review-hub', icon: Star, label: 'Review Hub', color: '#FFD60A' },
    { to: '/ecosystem', icon: Sparkle, label: 'Hệ Sinh Thái', color: '#64D2FF' },
];

const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.04 } } };

export default function MorePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isMember = user?.role !== 'admin' && user?.role !== 'pt';
    const links = isMember ? MEMBER_LINKS : ADMIN_LINKS;

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="ios-animate-in min-h-full superapp-page"
        >
            <div className="pt-4 pb-5">
                <h1 className="text-[28px] font-bold leading-tight" style={{ color: 'var(--g-text)', letterSpacing: '-0.5px' }}>Mục khác</h1>
                <p className="text-[15px] mt-1.5" style={{ color: 'var(--g-text-2)' }}>
                    {isMember ? 'Tập luyện, sức khỏe & cá nhân' : 'Công việc, kiến thức & tiện ích'}
                </p>
            </div>

            <div className="gym-card overflow-hidden rounded-2xl">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <motion.button
                            key={link.to}
                            variants={fadeUp}
                            onClick={() => navigate(link.to)}
                            className="gym-row w-full text-left"
                        >
                            <div className="gym-row__icon" style={{ background: link.color + '22' }}>
                                <Icon size={22} color={link.color} weight="duotone" />
                            </div>
                            <div className="gym-row__body">
                                <span className="gym-row__title">{link.label}</span>
                            </div>
                            <CaretRight size={20} weight="bold" className="gym-row__arrow" />
                        </motion.button>
                    );
                })}
            </div>

            <motion.button variants={fadeUp} onClick={() => navigate('/settings')} className="gym-row w-full mt-4 rounded-2xl">
                <div className="gym-row__icon" style={{ background: 'var(--g-accent)' }}>
                    <Gear size={22} color="#fff" weight="duotone" />
                </div>
                <div className="gym-row__body">
                    <p className="gym-row__title">{isMember ? (user?.displayName || 'Hội viên') : 'Admin'}</p>
                    <p className="gym-row__sub">Cài đặt & tuỳ chọn</p>
                </div>
                <CaretRight size={20} weight="bold" className="gym-row__arrow" />
            </motion.button>
        </motion.div>
    );
}
