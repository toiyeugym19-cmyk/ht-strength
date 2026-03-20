import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlass,
    X,
    CircleNotch,
    CaretDown
} from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import QA_DATA from '../data/qa.json';

interface Article {
    id: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    date: string;
    type: 'article';
}

interface QAItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    type: 'qa';
}

type KnowledgeItem = Article | QAItem;

export default function KnowledgePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('/articles.json')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setArticles(data.slice(0, 8).map(a => ({ ...a, type: 'article' })));
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const allItems = useMemo(() => {
        const qaItems: KnowledgeItem[] = (QA_DATA as any[]).map(q => ({ ...q, type: 'qa', id: `qa-${q.id}` }));
        const articleItems: KnowledgeItem[] = articles.map(a => ({ ...a, id: `art-${a.id}` }));
        const combined = [...articleItems, ...qaItems];
        const seen = new Set();
        return combined.filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });
    }, [articles]);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const title = item.type === 'article' ? item.title : item.question;
            const content = item.type === 'article' ? item.summary + (item as Article).content : item.answer;
            return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                content.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [searchQuery, allItems]);

    return (
        <div className="min-h-screen bg-black pb-32 ios-animate-in text-white font-sans selection:bg-[#0A84FF]/30">
            {/* ── STICKY HEADER AREA ── */}
            <div className="sticky top-[env(safe-area-inset-top)] z-[100] bg-black/85 backdrop-blur-2xl px-4 pt-0 pb-3">
                {/* ── SEARCH BAR (Native iOS Style Minimal) ── */}
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-white/40 pointer-events-none flex items-center justify-center">
                        <MagnifyingGlass size={18} weight="bold" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] bg-[#1C1C1E] rounded-[10px] pr-9 text-[17px] text-white outline-none caret-[#0A84FF] placeholder:text-white/40"
                        style={{ paddingLeft: '38px' }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 text-black/60 bg-[#EBEBF5]/60 flex items-center justify-center w-[18px] h-[18px] rounded-full active:bg-[#EBEBF5]/80 transition-colors"
                        >
                            <X size={12} weight="bold" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── LIST ── */}
            <div className="px-4 space-y-3">
                {isLoading ? (
                    <div className="h-40 flex items-center justify-center">
                        <CircleNotch size={32} weight="bold" className="animate-spin text-[#0A84FF]" />
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <KnowledgeCard
                            key={item.id}
                            item={item}
                            isExpanded={expandedId === item.id}
                            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        />
                    ))
                )}

                {!isLoading && filteredItems.length === 0 && (
                    <div className="py-20 text-center">
                        <MagnifyingGlass size={48} className="text-white/20 mx-auto mb-4" />
                        <h4 className="text-[17px] font-semibold text-white/60 mb-1">Không tìm thấy kết quả</h4>
                        <p className="text-[15px] text-white/40">Thử tìm kiếm với từ khóa khác.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function KnowledgeCard({ item, isExpanded, onToggle }: { item: KnowledgeItem, isExpanded: boolean, onToggle: () => void }) {
    const isArticle = item.type === 'article';

    return (
        <div className="bg-[#1C1C1E] rounded-[20px] overflow-hidden border border-white/5 shadow-md">
            <button
                onClick={onToggle}
                className="w-full p-5 flex items-start gap-4 active:bg-[#2C2C2E] transition-colors text-left"
            >
                <div className="flex-1 min-w-0">
                    <h4 className="text-[17px] font-semibold text-white leading-snug">
                        {isArticle ? item.title : item.question}
                    </h4>
                    {!isExpanded && isArticle && (
                        <p className="text-[15px] text-white/60 line-clamp-2 mt-1.5 leading-relaxed">
                            {item.summary}
                        </p>
                    )}
                </div>

                <div className="pt-1 text-white/30 shrink-0">
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <CaretDown size={20} weight="bold" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-1 border-t border-white/5">
                            {isArticle ? (
                                <div className="prose prose-invert max-w-none 
                                    text-[15px] leading-relaxed text-white/80 font-sans
                                    prose-headings:text-white prose-headings:font-bold prose-headings:mb-3
                                    prose-h2:text-[20px] prose-h3:text-[18px]
                                    prose-p:mb-4
                                    prose-a:text-[#0A84FF] prose-a:no-underline
                                    prose-strong:text-white prose-strong:font-bold
                                    prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4
                                    prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4
                                    prose-li:mb-1">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {item.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-[15px] leading-relaxed text-white/80 font-sans whitespace-pre-line">
                                    {item.answer}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
