import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PaperPlaneTilt, Sparkle,
    Brain, X, Barbell, AppleLogo, Lightning, Heart, PersonSimpleRun
} from '@phosphor-icons/react';
import { EXERCISE_DB } from '../data/exerciseDB';
import QA_DATA from '../data/qa.json';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// ── Build knowledge base from real app data ──
const QUALITY_QA = (QA_DATA as any[]).filter(q =>
    q.answer && q.answer.length > 60 && q.question
);

function buildExerciseKnowledge(): Map<string, string> {
    const kb = new Map<string, string>();

    EXERCISE_DB.forEach(ex => {
        const keywords = [
            ex.name.toLowerCase(),
            (ex.nameEn || '').toLowerCase(),
            (ex.primaryMuscle || '').toLowerCase(),
            ex.target.toLowerCase(),
        ].filter(Boolean);

        let response = `💪 **${ex.name}**`;
        if (ex.nameEn) response += ` (${ex.nameEn})`;
        response += `\n`;

        if (ex.primaryMuscle) response += `🎯 Cơ chính: ${ex.primaryMuscle}\n`;
        if (ex.secondaryMuscles?.length) response += `🔗 Cơ phụ: ${ex.secondaryMuscles.join(', ')}\n`;
        if (ex.equipment) response += `🏋️ Dụng cụ: ${ex.equipment}\n`;
        if (ex.difficulty) {
            const diffMap: Record<string, string> = { beginner: 'Cơ bản', intermediate: 'Trung bình', advanced: 'Nâng cao' };
            response += `📊 Độ khó: ${diffMap[ex.difficulty] || ex.difficulty}\n`;
        }

        if (ex.instructions?.length) {
            response += `\n📋 Hướng dẫn:\n`;
            ex.instructions.forEach((inst, i) => { response += `${i + 1}. ${inst}\n`; });
        }

        if (ex.tips?.length) {
            response += `\n💡 Mẹo quan trọng:\n`;
            ex.tips.forEach(tip => { response += `• ${tip}\n`; });
        }

        if (ex.commonMistakes?.length) {
            response += `\n⚠️ Lỗi thường gặp:\n`;
            ex.commonMistakes.forEach(m => { response += `• ${m}\n`; });
        }

        if (ex.suggestedSets) response += `\n🔢 Khuyến nghị: ${ex.suggestedSets}`;
        if (ex.restSeconds) response += `\n⏱ Nghỉ giữa set: ${ex.restSeconds}s`;
        if (ex.caloriesPer10Min) response += `\n🔥 Đốt ~${ex.caloriesPer10Min} kcal/10 phút`;
        if (ex.variations?.length) response += `\n🔄 Biến thể: ${ex.variations.join(', ')}`;

        keywords.forEach(kw => { if (kw) kb.set(kw, response); });
    });

    return kb;
}

function findBestAnswer(query: string): string | null {
    const q = query.toLowerCase().trim();

    // 1. Try exercise database first (most detailed)
    const exerciseKB = buildExerciseKnowledge();
    for (const [keyword, response] of exerciseKB) {
        if (keyword && q.includes(keyword)) return response;
    }

    // 2. Check exercise by English name or partial match
    const matchedExercise = EXERCISE_DB.find(ex => {
        const names = [ex.name, ex.nameEn || '', ex.primaryMuscle || ''];
        return names.some(n => n && q.includes(n.toLowerCase()));
    });
    if (matchedExercise) {
        for (const [, response] of exerciseKB) {
            if (response.includes(matchedExercise.name)) return response;
        }
    }

    // 3. Match by muscle group
    const muscleGroups: Record<string, string[]> = {
        'ngực': ['chest', 'ngực', 'bench press', 'đẩy ngực', 'push up', 'hít đất'],
        'lưng': ['lưng', 'back', 'pull up', 'hít xà', 'deadlift', 'kéo xà', 'chèo'],
        'chân': ['chân', 'leg', 'squat', 'gánh tạ', 'đùi', 'mông', 'bắp chân'],
        'vai': ['vai', 'shoulder', 'overhead press', 'nhún vai'],
        'tay': ['tay', 'arm', 'bicep', 'tricep', 'tay trước', 'tay sau', 'cuốn tạ'],
        'bụng': ['bụng', 'abs', 'core', 'plank', 'crunch', 'gập bụng'],
    };

    for (const [group, keywords] of Object.entries(muscleGroups)) {
        if (keywords.some(kw => q.includes(kw))) {
            const exercises = EXERCISE_DB.filter(ex =>
                ex.target.toLowerCase().includes(group) ||
                (ex.primaryMuscle || '').toLowerCase().includes(group)
            );
            if (exercises.length > 0) {
                let response = `🏋️ **Bài tập ${group.toUpperCase()}** (${exercises.length} bài có sẵn):\n\n`;
                exercises.slice(0, 5).forEach((ex, i) => {
                    response += `${i + 1}. **${ex.name}**`;
                    if (ex.suggestedSets) response += ` — ${ex.suggestedSets}`;
                    response += `\n`;
                    if (ex.primaryMuscle) response += `   🎯 ${ex.primaryMuscle}`;
                    if (ex.equipment) response += ` | 🏋️ ${ex.equipment}`;
                    response += `\n`;
                });
                response += `\n💡 Hỏi tên bài tập cụ thể để xem hướng dẫn chi tiết nhé!`;
                return response;
            }
        }
    }

    // 4. Search QA database for matching questions
    const qaMatch = QUALITY_QA.find(qa => {
        const question = qa.question.toLowerCase();
        const words = q.split(/\s+/).filter((w: string) => w.length > 2);
        const matchCount = words.filter((w: string) => question.includes(w)).length;
        return matchCount >= 2 || q.includes(question.substring(0, 15).toLowerCase());
    });
    if (qaMatch) {
        return `📚 **${qaMatch.question}**\n\n${qaMatch.answer}`;
    }

    // 5. Topic-based responses
    if (q.includes('giảm mỡ') || q.includes('giảm cân') || q.includes('giảm béo')) {
        return `🔥 **Chiến lược giảm mỡ hiệu quả:**\n\n1. **Thâm hụt calo**: Ăn ít hơn TDEE 300-500 kcal/ngày\n2. **Protein cao**: 2-2.2g/kg cân nặng để giữ cơ\n3. **Tập tạ nặng**: Duy trì sức mạnh, đốt calo EPOC\n4. **Cardio HIIT**: 3 buổi/tuần × 20 phút\n5. **Ngủ đủ**: 7-8 tiếng để hormone ổn định\n\n⚠️ Không thể giảm mỡ CỤC BỘ (spot reduction). Phải giảm mỡ toàn thân!\n💡 Tốc độ lý tưởng: 0.5-1kg/tuần.`;
    }

    if (q.includes('tăng cơ') || q.includes('tăng cân') || q.includes('bulk')) {
        return `💪 **Chiến lược tăng cơ:**\n\n1. **Thặng dư calo**: Ăn hơn TDEE 300-500 kcal/ngày\n2. **Protein**: 1.6-2.2g/kg cân nặng\n3. **Progressive Overload**: Tăng tạ đều mỗi tuần\n4. **Volume**: 10-20 set/nhóm cơ/tuần\n5. **Nghỉ ngơi**: 48h+ giữa cùng nhóm cơ\n\n📋 Giáo án gợi ý (PPL 6 ngày):\n• T2: Push (Ngực + Vai + Tay sau)\n• T3: Pull (Lưng + Tay trước)\n• T4: Legs (Chân + Mông + Bụng)\n• T5-T7: Lặp lại\n• CN: Nghỉ`;
    }

    if (q.includes('protein') || q.includes('đạm') || q.includes('whey')) {
        return `🥩 **Hướng dẫn Protein:**\n\n📊 Lượng khuyến nghị:\n• Tăng cơ: 1.6-2.2g/kg/ngày\n• Giữ cơ (giảm mỡ): 2-2.5g/kg/ngày\n• Ví dụ 70kg: 112-154g protein/ngày\n\n🍗 Nguồn protein tốt:\n• Ức gà 100g = 31g protein\n• Cá hồi 100g = 20g protein\n• Trứng 1 quả = 6g protein\n• Whey 1 scoop = 24g protein\n• Đậu phụ 100g = 8g protein\n\n⏰ Chia đều 4-5 bữa, mỗi bữa 20-40g.`;
    }

    if (q.includes('calor') || q.includes('calo') || q.includes('kcal') || q.includes('tdee')) {
        return `🔢 **Tính TDEE & Calories:**\n\n📐 Công thức Harris-Benedict:\n• Nam: 88.4 + (13.4 × kg) + (4.8 × cm) - (5.7 × tuổi)\n• Nữ: 447.6 + (9.2 × kg) + (3.1 × cm) - (4.3 × tuổi)\n\n📊 Nhân hệ số hoạt động:\n• Ít vận động: × 1.2\n• Tập 3 buổi/tuần: × 1.375\n• Tập 5 buổi/tuần: × 1.55\n• Tập nặng hàng ngày: × 1.725\n\n🎯 Mục tiêu:\n• Giảm mỡ: TDEE - 300~500\n• Giữ cân: = TDEE\n• Tăng cơ: TDEE + 300~500\n\n💡 App HT-Strength tự tính TDEE cho bạn ở mục Tiến Độ!`;
    }

    if (q.includes('đau') || q.includes('chấn thương') || q.includes('bị thương')) {
        return `🩺 **Xử lý đau/chấn thương khi tập:**\n\nQuy tắc RICE:\n• R — Rest (Nghỉ ngơi)\n• I — Ice (Chườm lạnh 15-20 phút)\n• C — Compression (Băng ép nhẹ)\n• E — Elevation (Kê cao vùng đau)\n\n⚠️ Dấu hiệu cần khám bác sĩ:\n• Đau nhói, sưng to\n• Bầm tím lan rộng\n• Yếu cơ đột ngột\n• Đau không giảm sau 5-7 ngày\n\n💡 Đau DOMS (mỏi cơ sau tập) là BÌNH THƯỜNG, thường hết sau 2-3 ngày. Vẫn có thể tập nhóm cơ khác!`;
    }

    if (q.includes('warm') || q.includes('khởi động') || q.includes('giãn')) {
        return `🔥 **Quy trình Khởi Động chuẩn:**\n\n1️⃣ **Cardio nhẹ** (5 phút): Chạy bộ/đạp xe nhẹ\n2️⃣ **Dynamic Stretch** (5 phút):\n• Xoay khớp vai × 10\n• Xoay hông × 10 mỗi chiều\n• Xoay cổ tay, cổ chân\n• High knees × 20\n3️⃣ **Set nhẹ** (2 set × 50% tạ làm việc)\n\n⚠️ KHÔNG kéo giãn tĩnh (static stretch) trước khi tập nặng!\n💡 Static stretch chỉ nên làm SAU buổi tập.`;
    }

    if (q.includes('ngủ') || q.includes('nghỉ') || q.includes('phục hồi') || q.includes('recovery')) {
        return `😴 **Phục hồi & Nghỉ ngơi:**\n\n🛏 Ngủ:\n• 7-8 tiếng mỗi đêm\n• Growth Hormone tiết ra mạnh nhất khi ngủ sâu\n• Thiếu ngủ = tăng Cortisol = phân hủy cơ\n\n♻️ Phục hồi chủ động:\n• Đi bộ nhẹ 20-30 phút\n• Foam roll các nhóm cơ lớn\n• Giãn cơ tĩnh 15-20 phút\n• Tắm nước ấm/lạnh xen kẽ\n\n📅 Deload:\n• Mỗi 4-6 tuần, giảm tạ xuống 50-60%\n• Giữ tần suất tập nhưng nhẹ hơn\n• Giúp gân, khớp, thần kinh phục hồi`;
    }

    if (q.includes('giáo án') || q.includes('lịch tập') || q.includes('chương trình') || q.includes('ppl') || q.includes('split')) {
        return `📋 **Giáo án tập luyện phổ biến:**\n\n🔥 **PPL (Push-Pull-Legs) — 6 ngày:**\n• Push: Ngực + Vai + Tay sau\n• Pull: Lưng + Tay trước\n• Legs: Đùi + Mông + Bắp chân\n\n💪 **Upper/Lower — 4 ngày:**\n• T2: Upper (Ngực + Lưng + Vai + Tay)\n• T3: Lower (Squat + RDL + Leg Press)\n• T4: Nghỉ\n• T5-T6: Lặp lại\n\n🌟 **Full Body — 3 ngày (Người mới):**\n• Squat + Bench Press + Row + Plank\n\n💡 Người mới: Full Body 3 ngày\n💡 Trung cấp: Upper/Lower 4 ngày\n💡 Nâng cao: PPL 5-6 ngày`;
    }

    return null;
}

const INITIAL_MESSAGE: Message = {
    id: 'init',
    role: 'assistant',
    content: `Xin chào! 👋 Tôi là trợ lý AI của HT-Strength.

Tôi có sẵn kiến thức về ${EXERCISE_DB.length}+ bài tập và ${QUALITY_QA.length}+ câu hỏi thường gặp.

Tôi có thể giúp bạn:
• Hướng dẫn chi tiết từng bài tập
• Gợi ý giáo án theo nhóm cơ
• Tư vấn dinh dưỡng & calories
• Xử lý chấn thương & phục hồi

Hãy hỏi tôi bất cứ điều gì!`,
    timestamp: new Date()
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Auto-close when navigating to a different page
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (text?: string) => {
        const msgText = text || input;
        if (!msgText.trim()) return;
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: msgText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const answer = findBestAnswer(msgText) ||
                `🧠 Tôi có thể giúp bạn về:\n• Hướng dẫn bài tập (ví dụ: "bench press", "squat")\n• Nhóm cơ (ví dụ: "bài tập ngực", "tập lưng")\n• Dinh dưỡng (ví dụ: "protein", "calories")\n• Giáo án tập (ví dụ: "giáo án PPL")\n• Giảm mỡ / tăng cơ\n• Chấn thương & phục hồi\n\nHãy hỏi cụ thể hơn nhé!`;

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: answer,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestions = useMemo(() => [
        { label: 'Bài tập ngực', icon: Barbell },
        { label: 'Giảm mỡ', icon: Lightning },
        { label: 'Protein', icon: AppleLogo },
        { label: 'Giáo án PPL', icon: PersonSimpleRun },
        { label: 'Đau cơ', icon: Heart },
    ], []);

    return (
        <>
            {/* ═══════════ FLOATING ACTION BUTTON ═══════════ */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            position: 'fixed', bottom: 100, right: 20, zIndex: 200,
                            width: 56, height: 56, borderRadius: 18,
                            background: 'linear-gradient(135deg, #E8613A, #FF8B5C)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', cursor: 'pointer',
                            boxShadow: '0 8px 32px rgba(232,97,58,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                        }}
                    >
                        <Brain size={28} weight="fill" />
                        <motion.div
                            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                            style={{ position: 'absolute', inset: -4, borderRadius: 22, border: '2px solid #E8613A' }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ═══════════ CHAT PANEL ═══════════ */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 299 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 60, scale: 0.92 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            style={{
                                position: 'fixed', bottom: 80, left: 0, right: 0, zIndex: 300,
                                height: '75vh', maxHeight: 600,
                                background: '#111114', borderRadius: '28px 28px 0 0',
                                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                boxShadow: '0 -10px 60px rgba(0,0,0,0.6)',
                            }}
                        >
                            {/* HEADER */}
                            <div style={{
                                padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                                flexShrink: 0, background: 'linear-gradient(180deg, rgba(232,97,58,0.08) 0%, transparent 100%)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                                    <div style={{ width: 36, height: 4, borderRadius: 100, background: 'rgba(255,255,255,0.15)' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 14,
                                            background: 'linear-gradient(135deg, #E8613A, #FF8B5C)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            position: 'relative', boxShadow: '0 4px 16px rgba(232,97,58,0.3)',
                                        }}>
                                            <Brain size={24} weight="fill" color="white" />
                                            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: '#30D158', border: '2.5px solid #111114' }} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>HT Coach AI</span>
                                                <Sparkle size={14} weight="fill" color="#FFD60A" />
                                            </div>
                                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                                                {EXERCISE_DB.length}+ bài tập • {QUALITY_QA.length}+ Q&A
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} style={{
                                        width: 36, height: 36, borderRadius: 12,
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                                    }}>
                                        <X size={18} weight="bold" />
                                    </button>
                                </div>
                            </div>

                            {/* MESSAGES */}
                            <div ref={scrollRef} style={{
                                flex: 1, overflowY: 'auto', padding: '20px 16px',
                                display: 'flex', flexDirection: 'column', gap: 16, scrollbarWidth: 'none',
                            }}>
                                {messages.map((msg) => (
                                    <motion.div key={msg.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                                    >
                                        <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            {msg.role === 'assistant' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4, marginBottom: 2 }}>
                                                    <div style={{
                                                        width: 20, height: 20, borderRadius: 7,
                                                        background: 'linear-gradient(135deg, #E8613A, #FF8B5C)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <Brain size={11} weight="fill" color="white" />
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>HT Coach</span>
                                                </div>
                                            )}
                                            <div style={{
                                                padding: '12px 16px',
                                                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                                fontSize: 14, lineHeight: 1.55, fontWeight: 500,
                                                ...(msg.role === 'user' ? {
                                                    background: 'linear-gradient(135deg, #E8613A, #D4542F)', color: '#fff',
                                                } : {
                                                    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.88)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                }),
                                            }}>
                                                <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                                            </div>
                                            <span style={{
                                                fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 500,
                                                paddingLeft: msg.role === 'user' ? 0 : 4,
                                                textAlign: msg.role === 'user' ? 'right' : 'left',
                                            }}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div style={{
                                            padding: '14px 20px', borderRadius: '20px 20px 20px 4px',
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)',
                                            display: 'flex', gap: 5, alignItems: 'center',
                                        }}>
                                            {[0, 1, 2].map(i => (
                                                <motion.div key={i}
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                    style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8613A' }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* SUGGESTIONS */}
                            {messages.length <= 1 && (
                                <div style={{
                                    padding: '0 16px 10px', display: 'flex', gap: 8, flexShrink: 0,
                                    overflowX: 'auto', scrollbarWidth: 'none',
                                }}>
                                    {suggestions.map((s) => {
                                        const Icon = s.icon;
                                        return (
                                            <button key={s.label}
                                                onClick={() => handleSend(s.label)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 6,
                                                    padding: '8px 14px', borderRadius: 20,
                                                    background: 'rgba(232,97,58,0.1)', border: '1px solid rgba(232,97,58,0.2)',
                                                    color: '#E8613A', fontSize: 12, fontWeight: 600,
                                                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                                                }}
                                            >
                                                <Icon size={14} weight="fill" />
                                                {s.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* INPUT */}
                            <div style={{
                                padding: '12px 16px 16px',
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                background: 'rgba(0,0,0,0.3)', flexShrink: 0,
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 24, padding: '6px 6px 6px 18px',
                                }}>
                                    <input type="text" value={input}
                                        onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                        placeholder="Hỏi về bài tập, dinh dưỡng..."
                                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15, fontWeight: 500 }}
                                    />
                                    <motion.button onClick={() => handleSend()} disabled={!input.trim()} whileTap={{ scale: 0.85 }}
                                        style={{
                                            width: 40, height: 40, borderRadius: 14,
                                            background: input.trim() ? 'linear-gradient(135deg, #E8613A, #D4542F)' : 'rgba(255,255,255,0.06)',
                                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: input.trim() ? '#fff' : 'rgba(255,255,255,0.15)',
                                            cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                                            boxShadow: input.trim() ? '0 4px 12px rgba(232,97,58,0.3)' : 'none', flexShrink: 0,
                                        }}
                                    >
                                        <PaperPlaneTilt size={20} weight="fill" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
