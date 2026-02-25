import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
    id: 'init',
    role: 'assistant',
    content: 'Chào Admin! Tôi là trợ lý AI của HT Strength. Tôi có thể giúp gì cho bạn hôm nay?\n(VD: Tạo lịch tập, Kiểm tra doanh thu, Gợi ý dinh dưỡng...)',
    timestamp: new Date()
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Giả lập AI trả lời (Sau này thay bằng API Call thật)
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateMockResponse(userMsg.content),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-white border-2 border-white/20"
                    >
                        <Bot size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] bg-[#0A0E17]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-white/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                                    <Bot size={20} className="text-white" />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0E17]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">HT Assistant</h3>
                                    <p className="text-[10px] text-blue-300 font-medium flex items-center gap-1">
                                        <Sparkles size={10} /> Powered by AI
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            >
                                <Minimize2 size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-white/5'
                                        }`}>
                                        <div className="whitespace-pre-line">{msg.content}</div>
                                        <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-zinc-500'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-sm border border-white/5">
                                        <Loader2 size={16} className="text-zinc-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
                            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition-colors">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Hỏi AI bất cứ điều gì..."
                                    className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2 placeholder:text-zinc-600"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-zinc-700 text-white rounded-xl transition-all shadow-lg active:scale-90"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Hàm giả lập logic trả lời (Mock Brain)
function generateMockResponse(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('chào') || q.includes('hello')) return "Chào bạn! Chúc một ngày tràn đầy năng lượng 💪";
    if (q.includes('tập') || q.includes('lịch')) return "Tôi có thể giúp bạn thiết kế lịch tập. Bạn muốn tập tăng cơ (Hypertrophy) hay sức mạnh (Strength)?";
    if (q.includes('ăn') || q.includes('dinh dưỡng')) return "Dinh dưỡng chiếm 70% thành công! Hãy cho tôi biết cân nặng của bạn để tôi tính Macro.";
    if (q.includes('doanh thu') || q.includes('tiền')) return "⚠️ Dữ liệu doanh thu là bảo mật. Vui lòng xác thực quyền Admin cấp cao.";

    return "Tôi chưa được kết nối với API thực tế (OpenAI/Anthropic). Hãy cấu hình API Key trong file .env để tôi trở nên thông minh hơn nhé! 🧠";
}
