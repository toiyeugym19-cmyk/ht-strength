import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowCounterClockwise, Clock, Wind, Brain, Heart, Leaf, Moon, Sparkle, SunHorizon, Mountains, Tree, Fire, Timer, Waves, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================================
//  MEDITATION PAGE — Premium Dark Theme with Rich Data
// ============================================================

/* ── Guided meditation scripts ── */
const GUIDED_SCRIPTS: Record<string, { steps: { time: number; text: string }[] }> = {
    focus: {
        steps: [
            { time: 0, text: 'Hãy nhắm mắt và hít thở sâu...' },
            { time: 15, text: 'Cảm nhận cơ thể bạn đang thư giãn...' },
            { time: 30, text: 'Tập trung vào hơi thở...' },
            { time: 60, text: 'Hít vào... 1... 2... 3... 4...' },
            { time: 70, text: 'Thở ra... 1... 2... 3... 4...' },
            { time: 90, text: 'Mỗi khi tâm trí lang thang, nhẹ nhàng quay về hơi thở...' },
            { time: 120, text: 'Bạn đang làm rất tốt. Tiếp tục hít thở đều đặn...' },
            { time: 180, text: 'Cảm nhận sự tĩnh lặng bên trong...' },
            { time: 240, text: 'Hít sâu thêm một hơi nữa...' },
            { time: 270, text: 'Chuẩn bị kết thúc, từ từ mở mắt...' },
        ]
    },
    relax: {
        steps: [
            { time: 0, text: 'Tìm một tư thế thoải mái nhất...' },
            { time: 15, text: 'Nhắm mắt... thả lỏng vai...' },
            { time: 30, text: 'Thả lỏng cơ mặt, hàm, trán...' },
            { time: 60, text: 'Cảm nhận trọng lượng cơ thể đang chìm xuống...' },
            { time: 90, text: 'Hít vào tinh thần bình an...' },
            { time: 100, text: 'Thở ra căng thẳng và mệt mỏi...' },
            { time: 150, text: 'Tưởng tượng ánh sáng ấm áp bao phủ toàn thân...' },
            { time: 210, text: 'Từng vùng cơ đang được thư giãn hoàn toàn...' },
            { time: 300, text: 'Bạn đang ở nơi an toàn và bình yên nhất...' },
            { time: 420, text: 'Cảm nhận sự biết ơn với cơ thể mình...' },
            { time: 540, text: 'Từ từ mở mắt khi bạn sẵn sàng...' },
        ]
    },
    sleep: {
        steps: [
            { time: 0, text: 'Nằm xuống, nhắm mắt lại...' },
            { time: 20, text: 'Hít thở nhẹ nhàng... đều đặn...' },
            { time: 45, text: 'Thả lỏng đôi chân... bắp đùi... hông...' },
            { time: 75, text: 'Thả lỏng bụng... ngực... vai...' },
            { time: 105, text: 'Thả lỏng cánh tay... bàn tay...' },
            { time: 135, text: 'Thả lỏng cổ... khuôn mặt... đôi mắt...' },
            { time: 180, text: 'Tưởng tượng bạn đang nằm trên bãi biển yên tĩnh...' },
            { time: 240, text: 'Nghe tiếng sóng vỗ nhẹ... gió biển mát...' },
            { time: 360, text: 'Mỗi hơi thở đưa bạn sâu hơn vào giấc ngủ...' },
            { time: 480, text: 'Bạn đang rất an toàn... và bình yên...' },
            { time: 600, text: 'Chìm dần... chìm dần vào giấc ngủ...' },
            { time: 780, text: 'Zzz... ngủ ngon nhé...' },
        ]
    },
    calm: {
        steps: [
            { time: 0, text: 'Hãy nhắm mắt và mỉm cười nhẹ...' },
            { time: 20, text: 'Nghĩ về một người bạn yêu thương...' },
            { time: 45, text: 'Gửi đến họ lời chúc: "Mong bạn luôn hạnh phúc"...' },
            { time: 75, text: 'Nghĩ về bản thân mình...' },
            { time: 100, text: '"Mong tôi luôn khỏe mạnh và bình an"...' },
            { time: 135, text: 'Cảm nhận tình yêu thương tỏa ra từ trái tim...' },
            { time: 180, text: 'Nghĩ về tất cả mọi người xung quanh...' },
            { time: 220, text: '"Mong mọi người đều hạnh phúc và bình yên"...' },
            { time: 300, text: 'Cảm nhận lòng biết ơn về cuộc sống...' },
            { time: 360, text: 'Từ từ trở lại, mang theo sự bình an này...' },
        ]
    },
    morning: {
        steps: [
            { time: 0, text: 'Chào buổi sáng! Hít một hơi thật sâu...' },
            { time: 15, text: 'Cảm ơn cơ thể đã nghỉ ngơi đêm qua...' },
            { time: 30, text: 'Hôm nay sẽ là một ngày tuyệt vời...' },
            { time: 60, text: 'Đặt ý định cho ngày hôm nay...' },
            { time: 90, text: 'Bạn muốn cảm thấy thế nào khi kết thúc ngày?' },
            { time: 120, text: 'Hít thở... nạp đầy năng lượng...' },
            { time: 180, text: 'Bạn đã sẵn sàng cho một ngày mới...' },
            { time: 240, text: 'Từ từ mở mắt... mỉm cười...' },
            { time: 270, text: 'Hãy bắt đầu ngày mới đầy năng lượng! 🌅' },
        ]
    },
    breathe: {
        steps: [
            { time: 0, text: 'Bắt đầu Box Breathing: Hít vào 4 giây...' },
            { time: 10, text: 'Giữ 4 giây... Thở ra 4 giây... Giữ 4 giây...' },
            { time: 30, text: 'Tiếp tục nhịp 4-4-4-4...' },
            { time: 60, text: 'Bạn đang làm rất tốt. Giữ nhịp đều...' },
            { time: 120, text: 'Cảm nhận nhịp tim chậm lại...' },
            { time: 180, text: 'Hệ thần kinh đang được reset...' },
            { time: 210, text: 'Hoàn thành! Bạn đã thật bình tĩnh rồi đấy.' },
        ]
    },
    'quick-reset': {
        steps: [
            { time: 0, text: 'Reset nhanh! Hít thật sâu...' },
            { time: 10, text: 'Thở ra mạnh... buông bỏ mọi căng thẳng!' },
            { time: 20, text: 'Hít vào... nạp năng lượng mới...' },
            { time: 30, text: 'Thở ra... xả hết sự mệt mỏi...' },
            { time: 60, text: 'Lắc vai, xoay cổ nhẹ nhàng...' },
            { time: 90, text: 'Hít sâu thêm 3 hơi nữa...' },
            { time: 120, text: 'Bạn đã sẵn sàng chiến đấu tiếp! 💪' },
            { time: 150, text: 'Reset hoàn tất! Tiếp tục nào!' },
        ]
    },
    'post-workout': {
        steps: [
            { time: 0, text: 'Tuyệt vời! Buổi tập đã kết thúc...' },
            { time: 15, text: 'Hít thở nhẹ nhàng... hạ nhịp tim xuống...' },
            { time: 30, text: 'Cảm ơn cơ thể đã nỗ lực hôm nay...' },
            { time: 60, text: 'Thả lỏng từng nhóm cơ vừa tập...' },
            { time: 120, text: 'Cảm nhận máu lưu thông đến các cơ...' },
            { time: 180, text: 'Cơ thể đang phục hồi và mạnh mẽ hơn...' },
            { time: 240, text: 'Mỗi buổi tập đều đưa bạn gần hơn mục tiêu...' },
            { time: 300, text: 'Hít thở sâu... thư giãn hoàn toàn...' },
            { time: 360, text: 'Bạn xứng đáng được nghỉ ngơi. Tốt lắm!' },
        ]
    },
    'body-scan': {
        steps: [
            { time: 0, text: 'Nằm thoải mái, nhắm mắt lại...' },
            { time: 20, text: 'Chú ý đến ngón chân... cảm nhận chúng...' },
            { time: 45, text: 'Di chuyển sự chú ý lên bàn chân... mắt cá...' },
            { time: 75, text: 'Cảm nhận bắp chân... đầu gối...' },
            { time: 110, text: 'Đùi... hông... bụng dưới...' },
            { time: 150, text: 'Bụng... ngực... nơi trái tim đang đập...' },
            { time: 200, text: 'Vai... cánh tay... bàn tay...' },
            { time: 250, text: 'Cổ... khuôn mặt... đỉnh đầu...' },
            { time: 300, text: 'Cảm nhận toàn bộ cơ thể như một khối thống nhất...' },
            { time: 380, text: 'Bạn kết nối sâu với chính mình...' },
            { time: 420, text: 'Từ từ trở lại... cử động nhẹ các ngón tay...' },
        ]
    },
    'nature': {
        steps: [
            { time: 0, text: 'Nhắm mắt... hít thở sâu...' },
            { time: 20, text: 'Tưởng tượng bạn đang ở một khu rừng xanh mát...' },
            { time: 45, text: 'Nghe tiếng chim hót... gió thổi qua lá cây...' },
            { time: 75, text: 'Ánh nắng chiếu qua tán lá, ấm áp trên da...' },
            { time: 120, text: 'Cảm nhận mùi đất, mùi cỏ tươi...' },
            { time: 180, text: 'Một con suối nhỏ chảy gần bên...' },
            { time: 240, text: 'Tiếng nước chảy róc rách thật dễ chịu...' },
            { time: 300, text: 'Bạn là một phần của thiên nhiên...' },
            { time: 360, text: 'Bình yên... tĩnh lặng... hài hòa...' },
            { time: 420, text: 'Mang theo cảm giác này khi trở về...' },
        ]
    },
    'gratitude': {
        steps: [
            { time: 0, text: 'Hãy nhắm mắt và mỉm cười...' },
            { time: 15, text: 'Nghĩ về 3 điều bạn biết ơn hôm nay...' },
            { time: 45, text: 'Điều thứ nhất... cảm nhận lòng biết ơn...' },
            { time: 90, text: 'Điều thứ hai... để sự biết ơn lan tỏa...' },
            { time: 135, text: 'Điều thứ ba... mỉm cười với nó...' },
            { time: 180, text: 'Cảm ơn cơ thể khỏe mạnh của bạn...' },
            { time: 240, text: 'Cảm ơn những người yêu thương bạn...' },
            { time: 300, text: 'Cảm ơn chính bạn vì đã cố gắng mỗi ngày...' },
            { time: 360, text: 'Lòng biết ơn sẽ đổi mới cuộc sống bạn...' },
            { time: 420, text: 'Từ từ mở mắt, mang theo niềm vui này...' },
        ]
    },
    'energy': {
        steps: [
            { time: 0, text: 'Ngồi thẳng lưng, mắt nhắm nhẹ...' },
            { time: 10, text: 'Hít mạnh qua mũi... năng lượng đang chảy vào...' },
            { time: 20, text: 'Thở ra mạnh qua miệng... đẩy hết sự mệt mỏi!' },
            { time: 30, text: 'Lặp lại: Hít vào mạnh... 1... 2... 3!' },
            { time: 40, text: 'Thở ra mạnh! Cảm nhận năng lượng bùng nổ!' },
            { time: 60, text: 'Siết nhẹ nắm tay... rồi thả ra...' },
            { time: 90, text: 'Năng lượng đang lan tỏa khắp cơ thể...' },
            { time: 120, text: 'Bạn mạnh mẽ! Bạn đầy năng lượng!' },
            { time: 150, text: 'Mở mắt! Bắt đầu chinh phục thôi! 🔥' },
        ]
    }
};

const SESSIONS = [
    { id: 'morning', label: 'Buổi Sáng Tỉnh Thức', icon: SunHorizon, color: '#F59E0B', dimColor: 'rgba(245,158,11,0.15)', duration: 300, desc: 'Khởi đầu ngày mới đầy năng lượng', category: 'mindfulness', benefit: 'Tăng sự tỉnh táo & tập trung' },
    { id: 'focus', label: 'Tập Trung Sâu', icon: Brain, color: '#0A84FF', dimColor: 'rgba(10,132,255,0.15)', duration: 300, desc: 'Tĩnh tâm, tập trung vào hơi thở', category: 'focus', benefit: 'Cải thiện khả năng tập trung 40%' },
    { id: 'relax', label: 'Thư Giãn Sâu', icon: Leaf, color: '#30D158', dimColor: 'rgba(48,209,88,0.15)', duration: 600, desc: 'Giải tỏa căng thẳng sau buổi tập', category: 'mindfulness', benefit: 'Giảm cortisol, phục hồi nhanh hơn' },
    { id: 'sleep', label: 'Ngủ Ngon', icon: Moon, color: '#BF5AF2', dimColor: 'rgba(191,90,242,0.15)', duration: 900, desc: 'Chuẩn bị cơ thể cho giấc ngủ sâu', category: 'sleep', benefit: 'Cải thiện chất lượng giấc ngủ' },
    { id: 'breathe', label: 'Box Breathing', icon: Wind, color: '#64D2FF', dimColor: 'rgba(100,210,255,0.15)', duration: 240, desc: '4-4-4-4 hít-giữ-thở-giữ', category: 'breathing', benefit: 'Kỹ thuật quân đội SEAL, giảm stress cấp tốc' },
    { id: 'calm', label: 'Yêu Thương & Biết Ơn', icon: Heart, color: '#FF375F', dimColor: 'rgba(255,55,95,0.15)', duration: 420, desc: 'Thiền yêu thương & lòng biết ơn', category: 'mindfulness', benefit: 'Tăng cảm xúc tích cực, giảm lo âu' },
    { id: 'quick-reset', label: 'Reset Nhanh 3 Phút', icon: Fire, color: '#FF9F0A', dimColor: 'rgba(255,159,10,0.15)', duration: 180, desc: '3 phút reset năng lượng giữa ngày', category: 'focus', benefit: 'Nạp lại năng lượng tức thì' },
    { id: 'post-workout', label: 'Hồi Phục Sau Tập', icon: Sparkle, color: '#EF4444', dimColor: 'rgba(239,68,68,0.15)', duration: 420, desc: 'Cool-down tâm trí sau buổi gym', category: 'recovery', benefit: 'Tối ưu phục hồi cơ bắp' },
    { id: 'body-scan', label: 'Body Scan', icon: Waves, color: '#06B6D4', dimColor: 'rgba(6,182,212,0.15)', duration: 480, desc: 'Quét toàn thân, nhận biết cơ thể', category: 'mindfulness', benefit: 'Nâng cao nhận thức cơ thể' },
    { id: 'nature', label: 'Thiên Nhiên Yên Bình', icon: Tree, color: '#22C55E', dimColor: 'rgba(34,197,94,0.15)', duration: 480, desc: 'Hình dung rừng xanh, suối chảy', category: 'visualization', benefit: 'Giảm huyết áp, thư giãn sâu' },
    { id: 'gratitude', label: 'Thiền Biết Ơn', icon: Heart, color: '#EC4899', dimColor: 'rgba(236,72,153,0.15)', duration: 480, desc: 'Nuôi dưỡng lòng biết ơn mỗi ngày', category: 'mindfulness', benefit: 'Cải thiện tâm trạng & giấc ngủ' },
    { id: 'energy', label: 'Nạp Năng Lượng', icon: Fire, color: '#F97316', dimColor: 'rgba(249,115,22,0.15)', duration: 180, desc: 'Kích hoạt năng lượng trước tập', category: 'focus', benefit: 'Tăng hiệu suất tập luyện 25%' },
];

const CATEGORIES = [
    { id: 'all', label: 'Tất cả', icon: <Sparkle size={14} weight="duotone" /> },
    { id: 'mindfulness', label: 'Tĩnh Tâm', icon: <Leaf size={14} weight="duotone" /> },
    { id: 'breathing', label: 'Hơi Thở', icon: <Wind size={14} weight="duotone" /> },
    { id: 'focus', label: 'Tập Trung', icon: <Brain size={14} weight="duotone" /> },
    { id: 'sleep', label: 'Giấc Ngủ', icon: <Moon size={14} weight="duotone" /> },
    { id: 'recovery', label: 'Phục Hồi', icon: <Heart size={14} weight="duotone" /> },
    { id: 'visualization', label: 'Hình Dung', icon: <Mountains size={14} weight="duotone" /> },
];

/* ── Ambient sounds ── */
const ASHISH_URL = 'https://raw.githubusercontent.com/ashishlotake/Focusly/main/public/sounds';
const MOODIST_URL = 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds';

const SOUND_FILES: Record<string, string> = {
    rain: `${ASHISH_URL}/rain.mp3`,
    ocean: `${ASHISH_URL}/ocean.mp3`,
    forest: '/sounds/forest.mp3',
    fire: `${ASHISH_URL}/fire.mp3`,
    wind: `${ASHISH_URL}/wind.mp3`,
    bowl: '/sounds/singing-bowl.mp3',
    temple: '/sounds/temple.mp3',
    church: '/sounds/church.mp3',
    birds: `${ASHISH_URL}/bird.mp3`,
    crickets: '/sounds/crickets.mp3',
    river: `${ASHISH_URL}/river.mp3`,
    waterfall: '/sounds/waterfall.mp3',
    thunder: `${ASHISH_URL}/thunder.mp3`,
    chimes: `${MOODIST_URL}/things/wind-chimes.mp3`,
    night: `${ASHISH_URL}/night.mp3`,
    droplets: '/sounds/droplets.mp3',
    coffee: `${ASHISH_URL}/coffee-shop.mp3`,
    train: `${ASHISH_URL}/train.mp3`,
    white: `${MOODIST_URL}/noise/white-noise.wav`,
    pink: `${MOODIST_URL}/noise/pink-noise.wav`,
    brown: `${MOODIST_URL}/noise/brown-noise.wav`,
    alpha: `${MOODIST_URL}/binaural/binaural-alpha.wav`,
    beta: `${MOODIST_URL}/binaural/binaural-beta.wav`,
    delta: `${MOODIST_URL}/binaural/binaural-delta.wav`,
    gamma: `${MOODIST_URL}/binaural/binaural-gamma.wav`,
    theta: `${MOODIST_URL}/binaural/binaural-theta.wav`,
    mm_om: '/sounds/meditative-mind/om-chanting.mp3',
    mm_432deep: '/sounds/meditative-mind/432hz-deep-healing.mp3',
    mm_432spark: '/sounds/meditative-mind/432hz-spark.mp3',
    mm_ancient: '/sounds/meditative-mind/ancient-healing.mp3',
    mm_oasis: '/sounds/meditative-mind/cosmic-oasis.mp3',
    mm_alphaheal: '/sounds/meditative-mind/alpha-waves-heal.mp3',
    mm_angelic: '/sounds/meditative-mind/angelic-healing.mp3',
    mm_detox: '/sounds/meditative-mind/detox-cleanse.mp3',
    mm_nammyoho: '/sounds/meditative-mind/nam-myoho.mp3',
    mm_tibetan: '/sounds/meditative-mind/tibetan-healing.mp3',
    mm_chakra: '/sounds/meditative-mind/chakra-healing.mp3',
    mm_shores: '/sounds/meditative-mind/cosmic-shores.mp3',
};

const SOUND_GROUPS = [
    {
        label: '🧘 Meditative Mind (Local)', sounds: [
            { id: 'mm_om', emoji: '🕉️', name: 'OM Chanting 1 Hour' },
            { id: 'mm_432deep', emoji: '✨', name: '432Hz Deep Healing' },
            { id: 'mm_angelic', emoji: '👼', name: 'Angelic Deep Relax' },
            { id: 'mm_tibetan', emoji: '🪘', name: 'Tibetan Hang Drum' },
            { id: 'mm_chakra', emoji: '🌈', name: 'Full Chakra Healing' },
            { id: 'mm_ancient', emoji: '⏳', name: 'Ancient Miracles' },
            { id: 'mm_nammyoho', emoji: '🌧️', name: 'Nam Myoho (Cosmic Rain)' },
            { id: 'mm_oasis', emoji: '🌌', name: 'Cosmic Oasis' },
            { id: 'mm_shores', emoji: '🌠', name: 'Cosmic Shores' },
            { id: 'mm_alphaheal', emoji: '🧠', name: 'Alpha Waves Heal' },
            { id: 'mm_432spark', emoji: '⚡', name: '432Hz Spark' },
            { id: 'mm_detox', emoji: '🌿', name: 'Detox Cleanse' },
        ]
    },
    {
        label: '🎧 Sóng Não', sounds: [
            { id: 'alpha', emoji: '🪷', name: 'Alpha (Thư Giãn)' },
            { id: 'beta', emoji: '⚡', name: 'Beta (Tập Trung)' },
            { id: 'theta', emoji: '🌊', name: 'Theta (Thiền Sâu)' },
            { id: 'delta', emoji: '🛌', name: 'Delta (Ngủ Miên)' },
            { id: 'gamma', emoji: '👁️', name: 'Gamma (Nhận Thức)' },
        ]
    },
    {
        label: '🌫️ Ồn Trắng', sounds: [
            { id: 'white', emoji: '📻', name: 'White Noise' },
            { id: 'pink', emoji: '🌸', name: 'Pink Noise' },
            { id: 'brown', emoji: '🟤', name: 'Brown Noise' },
        ]
    },
    {
        label: '🏯 Zen / Chùa', sounds: [
            { id: 'chimes', emoji: '🎐', name: 'Chuông Gió Thiền' },
            { id: 'bowl', emoji: '🔔', name: 'Chuông Bát' },
            { id: 'temple', emoji: '🏯', name: 'Chùa' },
            { id: 'church', emoji: '⛪', name: 'Nhà Thờ' },
        ]
    },
    {
        label: '💧 Nước', sounds: [
            { id: 'rain', emoji: '🌧️', name: 'Mưa' },
            { id: 'thunder', emoji: '⛈️', name: 'Sấm' },
            { id: 'ocean', emoji: '🌊', name: 'Biển' },
            { id: 'river', emoji: '🏞️', name: 'Suối' },
            { id: 'waterfall', emoji: '💧', name: 'Thác' },
            { id: 'droplets', emoji: '💦', name: 'Giọt Nước' },
        ]
    },
    {
        label: '🌿 Thiên Nhiên', sounds: [
            { id: 'forest', emoji: '🌲', name: 'Rừng' },
            { id: 'fire', emoji: '🔥', name: 'Lửa' },
            { id: 'wind', emoji: '💨', name: 'Gió' },
        ]
    },
    {
        label: '🐦 Sinh Vật', sounds: [
            { id: 'birds', emoji: '🐦', name: 'Chim' },
            { id: 'crickets', emoji: '🦗', name: 'Dế' },
            { id: 'night', emoji: '🌙', name: 'Đêm' },
        ]
    },
    {
        label: '🏙️ Đời Sống', sounds: [
            { id: 'coffee', emoji: '☕', name: 'Cà Phê' },
            { id: 'train', emoji: '🚂', name: 'Tàu Hỏa' },
        ]
    },
];

const STORAGE_KEY = 'ht-meditation-log';
function getMeditationLog(): { date: string; minutes: number; session: string }[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function addMeditationLog(minutes: number, sessionId: string) {
    const log = getMeditationLog();
    log.push({ date: new Date().toISOString(), minutes, session: sessionId });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export default function MeditationPage() {
    const [activeSession, setActiveSession] = useState<typeof SESSIONS[0] | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [totalDuration, setTotalDuration] = useState(0);
    const [customMinutes, setCustomMinutes] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [guidedText, setGuidedText] = useState('');

    const intervalRef = useRef<number | null>(null);

    // Multi-sound system
    const [activeSounds, setActiveSounds] = useState<Record<string, { audio: HTMLAudioElement; volume: number }>>({});




    const stopAllSounds = () => {
        Object.values(activeSounds).forEach(s => { s.audio.pause(); s.audio.currentTime = 0; });
        setActiveSounds({});
    };

    // Pause/resume all sounds with timer
    useEffect(() => {
        Object.values(activeSounds).forEach(s => {
            if (isPlaying) s.audio.play().catch(() => { });
            else s.audio.pause();
        });
    }, [isPlaying]);

    // Stop sounds when session ends
    useEffect(() => {
        if (timeLeft === 0 && !isPlaying && activeSession) {
            // Don't stop sounds, user might want to keep listening
        }
    }, [timeLeft, isPlaying]);

    // Cleanup on unmount
    useEffect(() => {
        return () => { Object.values(activeSounds).forEach(s => { s.audio.pause(); }); };
    }, []);

    const activeCount = Object.keys(activeSounds).length;

    // Total meditation minutes
    const log = getMeditationLog();
    const totalMinutes = log.reduce((s, l) => s + l.minutes, 0);
    const todayMinutes = log.filter(l => l.date.startsWith(new Date().toISOString().split('T')[0]))
        .reduce((s, l) => s + l.minutes, 0);
    const totalSessions = log.length;

    // Streak calculation
    const getStreak = () => {
        const dates = [...new Set(log.map(l => l.date.split('T')[0]))].sort().reverse();
        if (dates.length === 0) return 0;
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (dates[0] !== today && dates[0] !== yesterday) return 0;
        let checkDate = dates[0] === today ? new Date() : new Date(Date.now() - 86400000);
        for (const d of dates) {
            if (d === checkDate.toISOString().split('T')[0]) {
                streak++;
                checkDate = new Date(checkDate.getTime() - 86400000);
            } else break;
        }
        return streak;
    };
    const streak = getStreak();

    const startSession = (session: typeof SESSIONS[0], customDuration?: number) => {
        const dur = customDuration || session.duration;
        setActiveSession(session);
        setTimeLeft(dur);
        setTotalDuration(dur);
        setIsPlaying(true);
        setGuidedText('');
        // Start playing any pre-selected sounds
        Object.values(activeSounds).forEach(s => s.audio.play().catch(() => { }));
        // Scroll to top so user sees the timer immediately
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Guided text updater
    useEffect(() => {
        if (!isPlaying || !activeSession) return;
        const elapsed = totalDuration - timeLeft;
        const script = GUIDED_SCRIPTS[activeSession.id];
        if (!script) return;
        const currentStep = [...script.steps].reverse().find(s => elapsed >= s.time);
        if (currentStep) setGuidedText(currentStep.text);
    }, [timeLeft, isPlaying, activeSession, totalDuration]);

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying && activeSession) {
            setIsPlaying(false);
            const minutes = Math.round(totalDuration / 60);
            addMeditationLog(minutes, activeSession.id);
            toast.success(`🧘 Hoàn thành ${minutes} phút thiền ${activeSession.label}!`);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, timeLeft]);

    const togglePause = () => setIsPlaying(!isPlaying);
    const resetTimer = () => { setIsPlaying(false); setTimeLeft(totalDuration); setGuidedText(''); };
    const exitSession = () => { setIsPlaying(false); stopAllSounds(); setActiveSession(null); setTimeLeft(0); setGuidedText(''); };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

    const ringSize = 300;
    const strokeW = 8;
    const radius = (ringSize - strokeW) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);

    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

    // Breathing animation for box breathing
    const [breathPhase, setBreathPhase] = useState(0);
    useEffect(() => {
        if (!isPlaying || activeSession?.id !== 'breathe') return;
        const id = setInterval(() => setBreathPhase(p => (p + 1) % 4), 4000);
        return () => clearInterval(id);
    }, [isPlaying, activeSession]);
    const breathLabels = ['Hít vào...', 'Giữ...', 'Thở ra...', 'Giữ...'];

    const filteredSessions = SESSIONS.filter(s => selectedCategory === 'all' || s.category === selectedCategory);

    // Split sounds into two distinct categories
    const MUSIC_SOUNDS = SOUND_GROUPS[0].sounds; // Meditative Mind (Local)
    const AMBIENT_SOUNDS = SOUND_GROUPS.slice(1).flatMap(g => g.sounds); // Everything else
    const ALL_SOUNDS = [...MUSIC_SOUNDS, ...AMBIENT_SOUNDS];

    const findSoundInfo = (id: string) => ALL_SOUNDS.find(s => s.id === id) || null;

    // Helper to check if an active sound is from a specific group
    const hasActiveMusic = () => MUSIC_SOUNDS.some(s => !!activeSounds[s.id]);
    const hasActiveAmbient = () => AMBIENT_SOUNDS.some(s => !!activeSounds[s.id]);

    const toggleSoundFixed = (id: string) => {
        const next = { ...activeSounds };
        const isMusic = MUSIC_SOUNDS.some(s => s.id === id);

        // Nếu âm thanh đang phát, tắt nó đi
        if (next[id]) {
            next[id].audio.pause();
            next[id].audio.currentTime = 0;
            delete next[id];
            setActiveSounds(next);
            return;
        }

        if (isMusic) {
            // Bật Nhạc: Tắt MỌI CÁC âm thanh khác (cả nhạc cũ lẫn nền)
            Object.keys(next).forEach(k => {
                next[k].audio.pause();
                next[k].audio.currentTime = 0;
                delete next[k];
            });
        } else {
            // Bật Âm Nền: TẮT hết Nhạc (nếu có)
            MUSIC_SOUNDS.forEach(s => {
                if (next[s.id]) {
                    next[s.id].audio.pause();
                    next[s.id].audio.currentTime = 0;
                    delete next[s.id];
                }
            });

            // Kiểm tra giới hạn mix 3 âm thanh nền
            const activeAmbientCount = Object.keys(next).filter(k => AMBIENT_SOUNDS.some(as => as.id === k)).length;
            if (activeAmbientCount >= 3) {
                toast('Chỉ nên mix tối đa 3 loại âm thanh nền!', {
                    icon: '⚠️',
                    style: {
                        borderRadius: '16px',
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)'
                    }
                });
                return; // Hủy, không cho bật thêm
            }
        }

        // Bật âm thanh mới
        const audio = new Audio(SOUND_FILES[id]);
        audio.loop = true;

        // Chỉ phát nhạc nếu đang ở trang ngoài (!activeSession) HOẶC đang bấm nút Play
        if (!activeSession || isPlaying) {
            audio.play().catch(() => { });
        }

        audio.volume = 0.5; // Default volume 50%
        next[id] = { audio, volume: 0.5 };
        setActiveSounds(next);
    };

    const handleVolumeChange = (id: string, newVolume: number) => {
        setActiveSounds(prev => {
            if (!prev[id]) return prev;
            const next = { ...prev };
            next[id].audio.volume = newVolume;
            next[id].volume = newVolume;
            return next;
        });
    };

    /* ── Inline Sound Buttons (mutually exclusive boxes) ── */
    const renderSoundButtons = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Box 1: Music (Meditative Mind) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '16px 0', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', padding: '0 16px' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)', margin: 0 }}>🎵 Nhạc (Meditative Mind)</p>
                    {hasActiveMusic() && (
                        <button onClick={() => {
                            const next = { ...activeSounds };
                            MUSIC_SOUNDS.forEach(s => {
                                if (next[s.id]) {
                                    next[s.id].audio.pause();
                                    delete next[s.id];
                                }
                            });
                            setActiveSounds(next);
                        }}
                            style={{
                                fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '8px',
                                background: 'rgba(255,55,95,0.1)', color: '#FF375F', border: 'none', cursor: 'pointer',
                                flex: 'none', width: 'auto',
                            }}>Tắt nhạc</button>
                    )}
                </div>
                <div className="w-full pb-2 mt-2" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '12px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    justifyContent: 'center'
                }}>
                    {MUSIC_SOUNDS.map(s => {
                        const isActive = !!activeSounds[s.id];
                        return (
                            <button key={s.id} onClick={() => toggleSoundFixed(s.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    borderRadius: '14px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap' as const,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    background: isActive ? 'rgba(48,209,88,0.15)' : 'var(--bg-elevated, var(--bg-card))',
                                    color: isActive ? '#30D158' : 'var(--text-secondary)',
                                    border: `1px solid ${isActive ? 'rgba(48,209,88,0.4)' : 'var(--border-color)'}`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}>
                                <span className="text-[18px]">{s.emoji}</span> <span className="truncate">{s.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Box 2: Ambient Sounds */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '16px 0', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', padding: '0 16px' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)', margin: 0 }}>🍃 Âm thanh nền (Thiên nhiên / Ồn Trắng)</p>
                    {hasActiveAmbient() && (
                        <button onClick={() => {
                            const next = { ...activeSounds };
                            AMBIENT_SOUNDS.forEach(s => {
                                if (next[s.id]) {
                                    next[s.id].audio.pause();
                                    delete next[s.id];
                                }
                            });
                            setActiveSounds(next);
                        }}
                            style={{
                                fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '8px',
                                background: 'rgba(255,55,95,0.1)', color: '#FF375F', border: 'none', cursor: 'pointer',
                                flex: 'none', width: 'auto',
                            }}>Tắt âm nền</button>
                    )}
                </div>
                <div className="w-full pb-2 mt-2" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '12px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    justifyContent: 'center'
                }}>
                    {AMBIENT_SOUNDS.map(s => {
                        const isActive = !!activeSounds[s.id];
                        return (
                            <button key={s.id} onClick={() => toggleSoundFixed(s.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    borderRadius: '14px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap' as const,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    background: isActive ? 'rgba(48,209,88,0.15)' : 'var(--bg-elevated, var(--bg-card))',
                                    color: isActive ? '#30D158' : 'var(--text-secondary)',
                                    border: `1px solid ${isActive ? 'rgba(48,209,88,0.4)' : 'var(--border-color)'}`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}>
                                <span className="text-[18px]">{s.emoji}</span> <span className="truncate">{s.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active sounds summary (bottom) */}
            {activeCount > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span className="text-[12px] font-medium" style={{ color: '#30D158' }}>▶ Đang phát (Chỉnh âm lượng):</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', width: '100%' }}>
                        {Object.keys(activeSounds).map(id => {
                            const info = findSoundInfo(id);
                            if (!info) return null;
                            const soundConf = activeSounds[id];
                            return (
                                <div key={id} style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'var(--bg-elevated, var(--bg-card))',
                                    padding: '8px 12px', borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <span className="text-[13px] font-medium" style={{ color: '#30D158', minWidth: '90px' }}>
                                        {info.emoji} <span className="truncate">{info.name}</span>
                                    </span>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={soundConf.volume}
                                        onChange={(e) => handleVolumeChange(id, parseFloat(e.target.value))}
                                        style={{ width: '80px', accentColor: '#30D158' }}
                                    />
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                        {Math.round(soundConf.volume * 100)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    const activeColor = activeSession?.color || 'var(--bg-app)';
    const bgStyle = activeSession
        ? { background: `radial-gradient(ellipse at top, ${activeColor}20 0%, var(--bg-app) 70%)` }
        : { background: 'var(--bg-app)' };

    return (
        <div className="h-full overflow-y-auto pb-28 no-scrollbar" style={{ ...bgStyle, transition: 'background 0.8s ease' }}>
            <AnimatePresence mode="wait">
                {!activeSession ? (
                    <motion.div key="list" variants={stagger} initial="hidden" animate="show" exit="hidden" className="px-5 pt-6 space-y-5">
                        <motion.div variants={fadeUp}>
                            <h1 className="text-2xl font-bold">🧘 Thiền Định</h1>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Thư giãn tinh thần, phục hồi cơ thể</p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div variants={fadeUp} className="grid grid-cols-4 gap-2">
                            {[
                                { icon: <Clock size={16} weight="duotone" className="text-[#BF5AF2]" />, value: todayMinutes, label: 'Hôm nay' },
                                { icon: <Brain size={16} weight="duotone" className="text-[#0A84FF]" />, value: totalMinutes, label: 'Tổng' },
                                { icon: <Timer size={16} weight="duotone" className="text-[#30D158]" />, value: totalSessions, label: 'Buổi' },
                                { icon: <Fire size={16} weight="duotone" className="text-[#FF9F0A]" />, value: streak, label: 'Streak' },
                            ].map((stat, i) => (
                                <div key={i} className="rounded-2xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="flex justify-center mb-1.5">{stat.icon}</div>
                                    <p className="text-lg font-bold">{stat.value}</p>
                                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Session List (Page 1) */}
                        <motion.div variants={fadeUp} className="space-y-4 pt-2 border-t mt-4" style={{ borderColor: 'var(--border-color)' }}>
                            {/* Category filter */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {CATEGORIES.map(cat => (
                                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                                        style={{
                                            background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--bg-card)',
                                            color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>

                            <h2 className="text-base font-bold">Chọn bài thiền ({filteredSessions.length})</h2>

                            {filteredSessions.map(s => (
                                <motion.button key={s.id} whileTap={{ scale: 0.97 }}
                                    onClick={() => startSession(s)}
                                    className="w-full rounded-2xl p-4 flex items-center gap-4 text-left"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.dimColor }}>
                                        <s.icon size={26} weight="duotone" style={{ color: s.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold">{s.label}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                                        <p className="text-[10px] mt-1 font-medium" style={{ color: s.color }}>✦ {s.benefit}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: s.dimColor, color: s.color }}>
                                            {Math.round(s.duration / 60)} phút
                                        </span>
                                        {GUIDED_SCRIPTS[s.id] && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'rgba(48,209,88,0.15)', color: '#30D158' }}>Guided</span>
                                        )}
                                    </div>
                                </motion.button>
                            ))}

                            {/* Custom timer */}
                            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <p className="text-sm font-semibold mb-3">⏱️ Tuỳ chỉnh thời gian</p>
                                <div className="flex gap-2">
                                    <input type="number" value={customMinutes} onChange={e => setCustomMinutes(e.target.value)}
                                        placeholder="Số phút" className="input-clean flex-1 !py-2.5" min="1" max="120" />
                                    <button onClick={() => {
                                        const m = parseInt(customMinutes);
                                        if (m > 0 && m <= 120) startSession(SESSIONS[0], m * 60);
                                        else toast.error('Nhập từ 1-120 phút');
                                    }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                                        style={{ background: 'linear-gradient(135deg, #BF5AF2, #8B5CF6)' }}>Bắt đầu</button>
                                </div>
                            </div>

                            {/* Tips card */}
                            <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(191,90,242,0.1), rgba(10,132,255,0.1))', border: '1px solid rgba(191,90,242,0.2)' }}>
                                <p className="text-sm font-bold mb-2">💡 Mẹo thiền hiệu quả</p>
                                <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    <li>• Thiền 5-10 phút/ngày đã đủ để thấy sự khác biệt sau 2 tuần</li>
                                    <li>• Mix tiếng Chùa 🏯 + Mưa 🌧️ + Phong Linh 🎐 cực nghệ</li>
                                    <li>• Tâm trí lang thang là bình thường — nhẹ nhàng quay lại hơi thở</li>
                                    <li>• Sau buổi gym, thiền 5 phút giúp phục hồi nhanh hơn 30%</li>
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    /* Active Session (Page 2) */
                    <motion.div key="active" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }} className="flex flex-col items-center justify-between min-h-[90vh] px-6 pt-10 pb-6">

                        {/* Top info */}
                        <div className="w-full flex flex-col items-center text-center">
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
                                className="w-16 h-1 rounded-full mb-8" style={{ background: `${activeSession.color}50` }} />
                            <h2 className="text-[28px] font-bold tracking-tight leading-tight" style={{ color: activeSession.color }}>
                                {activeSession.label}
                            </h2>
                            <p className="text-[15px] mt-2 opacity-80" style={{ color: 'var(--text-secondary)' }}>
                                {activeSession.desc}
                            </p>
                        </div>

                        {/* Active Session Player */}
                        <div className="flex flex-col items-center justify-center w-full relative flex-1">
                            {/* Timer Ring */}
                            <div className="relative mt-8 flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
                                <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                        fill="none" stroke={`${activeSession.color}20`} strokeWidth={strokeW} />
                                    <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
                                        fill="none" stroke={activeSession.color} strokeWidth={strokeW} strokeLinecap="round"
                                        strokeDasharray={circumference} strokeDashoffset={offset}
                                        style={{ transition: 'stroke-dashoffset 1s linear' }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-6xl font-bold tracking-wider" style={{ color: activeSession.color, textShadow: `0 4px 20px ${activeSession.color}30` }}>
                                        {formatTime(timeLeft)}
                                    </span>
                                    {activeSession.id === 'breathe' && isPlaying && (
                                        <motion.span key={breathPhase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                            className="text-sm mt-2 font-medium" style={{ color: activeSession.color }}>
                                            {breathLabels[breathPhase]}
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            {/* Breathing animation circle */}
                            {activeSession.id === 'breathe' && isPlaying && (
                                <motion.div
                                    animate={{ scale: breathPhase === 0 ? 1.3 : breathPhase === 2 ? 0.7 : 1 }}
                                    transition={{ duration: 3.5, ease: 'easeInOut' }}
                                    className="w-16 h-16 rounded-full absolute"
                                    style={{ background: `${activeSession.color}30`, border: `2px solid ${activeSession.color}`, zIndex: -1 }} />
                            )}

                            {/* Guided text */}
                            {guidedText && (
                                <motion.div
                                    key={guidedText}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="rounded-2xl px-6 py-4 text-center max-w-sm mx-auto"
                                    style={{ background: `${activeSession.color}10`, border: `1px solid ${activeSession.color}20` }}>
                                    <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {guidedText}
                                    </p>
                                </motion.div>
                            )}

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-6 mt-8">
                                <motion.button whileTap={{ scale: 0.9 }} onClick={resetTimer}
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <ArrowCounterClockwise size={22} style={{ color: 'var(--text-secondary)' }} />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={togglePause}
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-white relative"
                                    style={{ background: activeSession.color, boxShadow: `0 8px 32px ${activeSession.color}40` }}>
                                    {isPlaying ? <Pause size={36} weight="fill" /> : <Play size={36} weight="fill" className="ml-1" />}
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={exitSession}
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(255,55,95,0.1)', border: '1px solid rgba(255,55,95,0.2)' }}>
                                    <X size={22} weight="bold" style={{ color: '#FF375F' }} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Sound Buttons - only in active session view  */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="w-full mt-10"
                            style={{ paddingBottom: '20px' }}>
                            {renderSoundButtons()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


