import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from '@phosphor-icons/react';
import { useStepStore } from '../store/useStepStore';
import { toast } from 'sonner';

// ============================================================
//  SOCIAL / LOYALTY PAGE — Mibro Fit Dark Theme (Functional)
//  Includes: Challenges, Rewards, AND Leaderboard (all restored)
// ============================================================

const STORAGE_KEY = 'ht-loyalty-v1';
function getLoyalty() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveLoyalty(data: any) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

// Challenges that earn points
const CHALLENGES = [
    { id: 'steps-5k', title: '5,000 bước hôm nay', desc: 'Đi bộ 5,000 bước trong 1 ngày', points: 50, icon: '🚶', requirement: 5000, type: 'steps' as const },
    { id: 'steps-10k', title: '10,000 bước hôm nay', desc: 'Đi bộ 10,000 bước trong 1 ngày', points: 100, icon: '🏃', requirement: 10000, type: 'steps' as const },
    { id: 'streak-3', title: 'Chuỗi 3 ngày', desc: 'Đạt mục tiêu 3 ngày liên tiếp', points: 150, icon: '🔥', requirement: 3, type: 'streak' as const },
    { id: 'streak-7', title: 'Chuỗi 7 ngày', desc: 'Đạt mục tiêu 7 ngày liên tiếp', points: 300, icon: '⚡', requirement: 7, type: 'streak' as const },
    { id: 'total-50k', title: '50K tổng bước', desc: 'Tích lũy 50,000 bước chân', points: 200, icon: '🌟', requirement: 50000, type: 'total' as const },
];

const REWARDS = [
    { id: 'towel', title: 'Khăn tập HT', desc: 'Khăn microfiber thể thao', cost: 200, icon: '🏋️' },
    { id: 'bottle', title: 'Bình nước HT', desc: 'Bình giữ nhiệt 750ml', cost: 350, icon: '🥤' },
    { id: 'shirt', title: 'Áo tập HT', desc: 'Áo thun thể thao dry-fit', cost: 500, icon: '👕' },
    { id: 'session', title: 'Buổi PT miễn phí', desc: '1 buổi Personal Training', cost: 800, icon: '💪' },
    { id: 'month', title: 'Miễn phí 1 tháng', desc: 'Thẻ tập 1 tháng miễn phí', cost: 1500, icon: '🏆' },
];

// Leaderboard (restored from old version)
const LEADERBOARD = [
    { rank: 1, name: 'Minh Tran', points: 8200, workouts: 24, avatar: '🥇', isYou: false },
    { rank: 2, name: 'Lan Nguyen', points: 7100, workouts: 20, avatar: '🥈', isYou: false },
    { rank: 3, name: 'Bạn', points: 5500, workouts: 18, avatar: '🥉', isYou: true },
    { rank: 4, name: 'Tuan Pham', points: 4800, workouts: 15, avatar: '👤', isYou: false },
    { rank: 5, name: 'Duc Le', points: 4300, workouts: 13, avatar: '👨', isYou: false },
    { rank: 6, name: 'Hoa Vu', points: 3800, workouts: 11, avatar: '👩', isYou: false },
];

export default function SocialPage() {
    const stepStore = useStepStore();
    const [tab, setTab] = useState<'challenges' | 'rewards' | 'leaderboard'>('challenges');
    const loyalty = getLoyalty();
    const [points, setPoints] = useState(loyalty.points || 0);
    const [claimed, setClaimed] = useState<string[]>(loyalty.claimed || []);
    const [redeemed, setRedeemed] = useState<string[]>(loyalty.redeemed || []);

    const today = new Date().toISOString().split('T')[0];
    const todaySteps = stepStore.getStepsForDate(today).steps;
    const totalSteps = stepStore.getTotalSteps();
    const streak = stepStore.currentStreak;

    const handleClaim = (challenge: typeof CHALLENGES[0]) => {
        if (claimed.includes(challenge.id)) return;
        const newPoints = points + challenge.points;
        const newClaimed = [...claimed, challenge.id];
        setPoints(newPoints);
        setClaimed(newClaimed);
        saveLoyalty({ points: newPoints, claimed: newClaimed, redeemed });
        toast.success(`+${challenge.points} điểm! 🎉`);
    };

    const handleRedeem = (reward: typeof REWARDS[0]) => {
        if (points < reward.cost || redeemed.includes(reward.id)) return;
        const newPoints = points - reward.cost;
        const newRedeemed = [...redeemed, reward.id];
        setPoints(newPoints);
        setRedeemed(newRedeemed);
        saveLoyalty({ points: newPoints, claimed, redeemed: newRedeemed });
        toast.success(`Đã đổi ${reward.title}! Liên hệ quầy lễ tân 📦`);
    };

    const isEligible = (c: typeof CHALLENGES[0]) => {
        if (c.type === 'steps') return todaySteps >= c.requirement;
        if (c.type === 'streak') return streak >= c.requirement;
        if (c.type === 'total') return totalSteps >= c.requirement;
        return false;
    };

    // Tier
    const tier = points >= 1500 ? 'Diamond' : points >= 800 ? 'Platinum' : points >= 500 ? 'Gold' : points >= 200 ? 'Silver' : 'Bronze';
    const tierColor = tier === 'Diamond' ? '#64D2FF' : tier === 'Platinum' ? '#BF5AF2' : tier === 'Gold' ? '#FFD60A' : tier === 'Silver' ? '#A0A0AB' : '#AC8E68';

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ background: 'var(--bg-app)' }}>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 pt-6 space-y-5">

                <motion.div variants={fadeUp}>
                    <h1 className="text-2xl font-bold">Thưởng & Thử thách</h1>
                </motion.div>

                {/* Points Card */}
                <motion.div variants={fadeUp} className="rounded-3xl p-6 text-center relative overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${tierColor}, ${tierColor}80)` }} />
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${tierColor}20`, color: tierColor }}>{tier}</span>
                    <p className="text-4xl font-bold mt-3" style={{ color: tierColor }}>{points}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>điểm tích luỹ</p>
                </motion.div>

                {/* Tabs — 3 tabs: Challenges, Rewards, Leaderboard */}
                <motion.div variants={fadeUp} className="flex rounded-xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    {(['challenges', 'rewards', 'leaderboard'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className="flex-1 py-3 text-sm font-semibold transition-all"
                            style={{
                                background: tab === t ? 'var(--primary)' : 'transparent',
                                color: tab === t ? 'white' : 'var(--text-secondary)'
                            }}>
                            {t === 'challenges' ? '🎯 Thử thách' : t === 'rewards' ? '🎁 Đổi thưởng' : '🏆 BXH'}
                        </button>
                    ))}
                </motion.div>

                {/* TAB: Challenges */}
                {tab === 'challenges' && (
                    <div className="space-y-3">
                        {CHALLENGES.map(c => {
                            const eligible = isEligible(c);
                            const isClaimed = claimed.includes(c.id);
                            return (
                                <motion.div key={c.id} variants={fadeUp} className="rounded-2xl p-4 flex items-center gap-3"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', opacity: isClaimed ? 0.5 : 1 }}>
                                    <span className="text-2xl">{c.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{c.title}</p>
                                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.desc}</p>
                                    </div>
                                    {isClaimed ? (
                                        <div className="flex items-center gap-1 text-xs" style={{ color: '#30D158' }}>
                                            <Check size={14} weight="bold" /> Đã nhận
                                        </div>
                                    ) : eligible ? (
                                        <button onClick={() => handleClaim(c)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                                            style={{ background: '#30D158' }}>
                                            +{c.points} ⭐
                                        </button>
                                    ) : (
                                        <span className="text-xs" style={{ color: 'var(--text-hint)' }}>
                                            {c.points} ⭐
                                        </span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* TAB: Rewards */}
                {tab === 'rewards' && (
                    <div className="space-y-3">
                        {REWARDS.map(r => {
                            const canAfford = points >= r.cost;
                            const isRedeemed = redeemed.includes(r.id);
                            return (
                                <motion.div key={r.id} variants={fadeUp} className="rounded-2xl p-4 flex items-center gap-3"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', opacity: isRedeemed ? 0.5 : 1 }}>
                                    <span className="text-2xl">{r.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{r.title}</p>
                                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
                                    </div>
                                    {isRedeemed ? (
                                        <div className="flex items-center gap-1 text-xs" style={{ color: '#BF5AF2' }}>
                                            <Check size={14} weight="bold" /> Đã đổi
                                        </div>
                                    ) : canAfford ? (
                                        <button onClick={() => handleRedeem(r)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                                            style={{ background: '#FF9F0A' }}>
                                            {r.cost} ⭐
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-hint)' }}>
                                            <Lock size={12} weight="duotone" /> {r.cost} ⭐
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* TAB: Leaderboard (restored from old version) */}
                {tab === 'leaderboard' && (
                    <div className="space-y-3">
                        {LEADERBOARD.map((u, i) => (
                            <motion.div key={u.rank} variants={fadeUp} className="rounded-2xl p-4 flex items-center gap-3"
                                style={{
                                    background: u.isYou ? 'rgba(48,209,88,0.08)' : 'var(--bg-card)',
                                    border: `1px solid ${u.isYou ? 'rgba(48,209,88,0.3)' : 'var(--border-color)'}`
                                }}>
                                <span className="text-2xl w-8 text-center">{u.avatar}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">
                                        {u.name} {u.isYou && <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-1" style={{ background: 'rgba(48,209,88,0.2)', color: '#30D158' }}>Bạn</span>}
                                    </p>
                                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{u.workouts} buổi tập</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold" style={{ color: i === 0 ? '#FFD60A' : i === 1 ? '#A0A0AB' : i === 2 ? '#AC8E68' : 'var(--text-secondary)' }}>
                                        {u.points.toLocaleString()}
                                    </p>
                                    <p className="text-[10px]" style={{ color: 'var(--text-hint)' }}>điểm</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
