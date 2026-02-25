import { useState, useMemo, useEffect } from 'react';
import {
    Search, ChevronRight, Share2, Bookmark,
    Dumbbell, Utensils, Zap, Heart, Brain, Activity, Sparkles, Filter, X,
    ArrowUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// removed direct import
import QA_DATA from '../data/qa.json';

type Tab = 'articles' | 'qa';

const CATEGORY_ICONS: Record<string, any> = {
    "Kiến Thức Tập Luyện": Dumbbell,
    "Dinh Dưỡng": Utensils,
    "Phục Hồi": Activity,
    "Thực Phẩm Bổ Sung": Zap,
    "Sức Khỏe Tinh Thần": Brain,
    "Giải Phẫu Cơ Thể": Heart,
    "default": Sparkles
};

const CATEGORY_IMAGES: Record<string, string[]> = {
    "Kiến Thức Tập Luyện": [
        "https://picsum.photos/seed/workout1/800/600",
        "https://picsum.photos/seed/workout2/800/600",
        "https://picsum.photos/seed/workout3/800/600",
        "https://picsum.photos/seed/workout4/800/600",
        "https://picsum.photos/seed/workout5/800/600",
        "https://picsum.photos/seed/workout6/800/600"
    ],
    "Dinh Dưỡng": [
        "https://picsum.photos/seed/nutrition1/800/600",
        "https://picsum.photos/seed/nutrition2/800/600",
        "https://picsum.photos/seed/nutrition3/800/600",
        "https://picsum.photos/seed/nutrition4/800/600",
        "https://picsum.photos/seed/nutrition5/800/600"
    ],
    "Phục Hồi": [
        "https://picsum.photos/seed/recovery1/800/600",
        "https://picsum.photos/seed/recovery2/800/600",
        "https://picsum.photos/seed/recovery3/800/600",
        "https://picsum.photos/seed/recovery4/800/600"
    ],
    "Thực Phẩm Bổ Sung": [
        "https://picsum.photos/seed/supplement1/800/600",
        "https://picsum.photos/seed/supplement2/800/600",
        "https://picsum.photos/seed/supplement3/800/600",
        "https://picsum.photos/seed/supplement4/800/600"
    ],
    "Sức Khỏe Tinh Thần": [
        "https://picsum.photos/seed/mental1/800/600",
        "https://picsum.photos/seed/mental2/800/600",
        "https://picsum.photos/seed/mental3/800/600",
        "https://picsum.photos/seed/mental4/800/600"
    ],
    "Giải Phẫu Cơ Thể": [
        "https://picsum.photos/seed/anatomy1/800/600",
        "https://picsum.photos/seed/anatomy2/800/600",
        "https://picsum.photos/seed/anatomy3/800/600"
    ],
    "default": [
        "https://picsum.photos/seed/default1/800/600",
        "https://picsum.photos/seed/default2/800/600"
    ]
};

const getArticleImage = (category: string, id: string) => {
    if (!category) return CATEGORY_IMAGES.default[0];
    const key = Object.keys(CATEGORY_IMAGES).find(k => k.toLowerCase() === category.toLowerCase()) || "default";
    const images = CATEGORY_IMAGES[key];
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[index % images.length];
};

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://picsum.photos/seed/fallback/800/600";
};

// Simplified article interface for UI use
interface Article {
    id: string;
    title: string;
    summary: string;
    category: string;
    date: string;
    content: string;
}

export default function KnowledgePage() {
    const [activeTab, setActiveTab] = useState<Tab>('articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedQA, setExpandedQA] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Data state
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 15;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

    // Fetch Articles logic
    useEffect(() => {
        setIsLoading(true);
        fetch('/articles.json')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                console.log("Articles loaded:", data.length);
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    throw new Error("Data format invalid (not an array)");
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load articles:", err);
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    // Scroll tracking logic removed for fixed header consistency 


    // Get unique categories
    // Get unique categories
    const categories = useMemo(() => Array.from(new Set(articles.map(a => a.category))), [articles]);

    // Filter Logic
    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const filteredArticles = useMemo(() => {
        if (isLoading) return [];
        return articles.filter(article => {
            const title = article.title || '';
            const summary = article.summary || '';
            const category = article.category || '';

            const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                summary.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory ? category === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, articles, isLoading]);

    const filteredQA = useMemo(() => QA_DATA.filter(qa =>
        qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

    // Group QA by category
    const groupedQA = useMemo(() => {
        const groups: Record<string, typeof QA_DATA> = {};
        filteredQA.forEach(qa => {
            if (!groups[qa.category]) groups[qa.category] = [];
            groups[qa.category].push(qa);
        });
        return groups;
    }, [filteredQA]);

    // Articles to display (Growing list for "Load More")
    const displayCount = useMemo(() => (currentPage * ITEMS_PER_PAGE), [currentPage, ITEMS_PER_PAGE]);

    // Distribute data correctly
    const featured = useMemo(() => (!searchQuery && !selectedCategory ? filteredArticles[0] : null), [filteredArticles, searchQuery, selectedCategory]);

    const sidebarItems = useMemo(() => {
        const start = featured ? 1 : 0;
        return filteredArticles.slice(start, start + 8);
    }, [filteredArticles, featured]);

    const feedArticles = useMemo(() => {
        const start = (featured ? 1 : 0) + 8;
        return filteredArticles.slice(start, start + displayCount);
    }, [filteredArticles, featured, displayCount]);

    const hasMore = ((featured ? 1 : 0) + 8 + displayCount) < filteredArticles.length;

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert("Đã sao chép liên kết!");
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert("Đã lưu bài viết!");
    };

    return (
        <div className="min-h-screen pb-32 animate-fade-in text-white relative font-sans selection:bg-primary/30 selection:text-white">
            {/* Scroll Top Marker */}
            <div id="scroll-top" className="absolute top-0 left-0 w-px h-px pointer-events-none" />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-6'} relative z-10`}>

                {/* 1. SCROLLABLE HEADER SECTION (Big Title) */}
                <header className={`flex flex-col ${isMobile ? 'pt-6 mb-4' : 'pt-10 mb-8'}`}>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl'} font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent`}
                        >
                            Thư Viện Kiến Thức
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`${isMobile ? 'text-sm' : 'text-lg'} text-zinc-400 font-light tracking-wide max-w-lg`}
                        >
                            Khám phá khoa học vận động, dinh dưỡng và nghệ thuật sống khỏe.
                        </motion.p>
                    </div>
                </header>

                {/* 2. FIXED STICKY CONTROLS (Tabs, Search, Filter) */}
                <div className="sticky top-0 z-[60] -mx-4 px-4 pt-4 pb-6 bg-bg-dark/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50">
                    <div className="flex flex-col gap-5">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 ${isMobile ? 'w-full' : 'max-w-xs'}`}
                        >
                            <button
                                onClick={() => setActiveTab('articles')}
                                className={`flex-1 ${isMobile ? 'py-2' : 'px-6 py-2'} rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'articles' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Tạp Chí
                            </button>
                            <button
                                onClick={() => setActiveTab('qa')}
                                className={`flex-1 ${isMobile ? 'py-2' : 'px-6 py-2'} rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'qa' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Tra Cứu
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Tìm chủ đề, bài viết..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-10 outline-none focus:border-primary/50 transition-all text-sm font-medium text-white"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-white">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            {activeTab === 'articles' && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${isFilterOpen || selectedCategory ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/20'}`}
                                    >
                                        <Filter size={18} />
                                    </button>

                                    <AnimatePresence>
                                        {isFilterOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-4 bg-[#121214] border border-white/10 rounded-2xl p-3 shadow-2xl w-64 backdrop-blur-2xl z-50 origin-top-right flex flex-col gap-1"
                                            >
                                                <div className="flex justify-between items-center mb-1 px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">CHỦ ĐỀ</span>
                                                    {selectedCategory && (
                                                        <button onClick={() => { setSelectedCategory(null); setIsFilterOpen(false) }} className="text-[10px] text-primary font-black uppercase hover:underline">Xóa</button>
                                                    )}
                                                </div>
                                                {categories.map(cat => {
                                                    const Icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS["default"];
                                                    return (
                                                        <button
                                                            key={cat}
                                                            onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false) }}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${selectedCategory === cat ? 'bg-primary/20 text-primary' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
                                                        >
                                                            <Icon size={14} className={selectedCategory === cat ? 'text-primary' : 'text-zinc-700'} />
                                                            {cat}
                                                        </button>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'articles' ? (
                            <motion.div
                                key="articles"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-12"
                            >
                                {isLoading ? (
                                    <div className="py-32 flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-primary border-t-white/20 rounded-full animate-spin" />
                                        <p className="text-zinc-500 font-medium tracking-wide animate-pulse">Đang tải thư viện...</p>
                                    </div>
                                ) : error ? (
                                    <div className="py-32 text-center text-red-400">
                                        <p className="text-xl font-bold mb-2">⚠️ Không thể tải dữ liệu</p>
                                        <p className="text-sm font-mono opacity-70">{error}</p>
                                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20">Thử lại</button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Layout: Main Content + Sidebar */}
                                        <div className={`grid grid-cols-1 ${isTablet ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8`}>

                                            {/* LEFT: Main Articles (Hero + Grid) */}
                                            <div className={`${isTablet ? 'lg:col-span-1' : 'lg:col-span-8'} space-y-8`}>
                                                {featured && (
                                                    <div
                                                        className="group cursor-pointer space-y-4 mb-12"
                                                        onClick={() => setSelectedArticle(featured)}
                                                    >
                                                        <div className={`relative ${isMobile ? 'aspect-[16/10]' : 'aspect-[21/9]'} overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl shadow-primary/5`}>
                                                            <img
                                                                src={getArticleImage(featured.category, featured.id)}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                alt=""
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                            <div className={`absolute ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-8 left-8 right-8'}`}>
                                                                <span className="text-primary uppercase tracking-[0.2em] font-black text-[10px] mb-3 block">{featured.category}</span>
                                                                <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-serif font-black text-white group-hover:text-primary transition-colors leading-tight italic uppercase`}>
                                                                    {featured.title}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* FEED: List Style like Tinh te */}
                                                <div className="space-y-10">
                                                    {feedArticles.map((article: Article) => (
                                                        <div
                                                            key={article.id}
                                                            className={`group cursor-pointer flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row gap-6'} pb-10 border-b border-white/5 last:border-0`}
                                                            onClick={() => setSelectedArticle(article)}
                                                        >
                                                            <div className={`w-full ${isMobile ? 'aspect-[16/9]' : isTablet ? 'md:w-60 md:h-40' : 'md:w-72 md:h-44'} shrink-0 relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-lg`}>
                                                                <img
                                                                    src={getArticleImage(article.category, article.id)}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-center">
                                                                <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-serif font-bold text-white group-hover:text-primary transition-colors leading-snug mb-3 italic`}>
                                                                    {article.title}
                                                                </h3>
                                                                <p className="text-zinc-500 text-sm line-clamp-2 font-medium leading-relaxed mb-4">
                                                                    {article.summary}
                                                                </p>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-400 border border-white/10" />
                                                                    <span className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">THOR_ADMIN</span>
                                                                    <span className="text-zinc-700">•</span>
                                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                                                        #{article.category.replace(/\s+/g, '')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Load More Button */}
                                                {hasMore && (
                                                    <div className="pt-8">
                                                        <motion.button
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                                            className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-primary font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-2xl"
                                                        >
                                                            Xem thêm tài liệu
                                                            <ChevronRight size={18} className="rotate-90 group-hover:translate-y-1 transition-transform" />
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* RIGHT: Quick View Sidebar (Xem nhanh) */}
                                            {!isTablet && !isMobile && (
                                                <div className="lg:col-span-4">
                                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
                                                        <div className="flex justify-between items-center mb-10">
                                                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Xem nhiều</h3>
                                                        </div>

                                                        <div className="relative space-y-8">
                                                            {/* Vertical Timeline Divider */}
                                                            <div className="absolute left-[3px] top-2 bottom-2 w-px border-l border-white/10" />

                                                            {sidebarItems.map((article) => (
                                                                <div
                                                                    key={article.id}
                                                                    className="relative pl-8 group cursor-pointer flex gap-4"
                                                                    onClick={() => setSelectedArticle(article)}
                                                                >
                                                                    {/* Dot */}
                                                                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors z-10 border border-white/5" />

                                                                    <div className="flex-1">
                                                                        <h4 className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors leading-snug line-clamp-2 mb-2">
                                                                            {article.title}
                                                                        </h4>
                                                                        <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">
                                                                            #{article.category.replace(/\s+/g, '')}
                                                                        </span>
                                                                    </div>

                                                                    <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-lg">
                                                                        <img
                                                                            src={getArticleImage(article.category, article.id)}
                                                                            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                                                            alt=""
                                                                            onError={handleImgError}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Removed Pagination Buttons because of Load More */}

                                        {filteredArticles.length === 0 && (
                                            <div className="py-32 text-center opacity-50 col-span-full">
                                                <Sparkles className="mx-auto mb-4 text-zinc-600" size={48} />
                                                <p className="text-xl font-serif italic text-zinc-400">Không tìm thấy bài viết nào phù hợp.</p>
                                                <button onClick={() => { setSearchQuery(''); setSelectedCategory(null) }} className="mt-4 text-primary hover:underline text-sm font-bold uppercase tracking-wider">
                                                    Xóa bộ lọc
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qa"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="max-w-4xl mx-auto space-y-12"
                            >
                                {Object.entries(groupedQA).map(([category, items]) => {
                                    const Icon = CATEGORY_ICONS[category] || Sparkles;
                                    return (
                                        <div key={category} className="relative">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary shadow-lg shadow-primary/10">
                                                    <Icon size={isMobile ? 20 : 24} />
                                                </div>
                                                <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-serif font-black text-white italic uppercase`}>{category}</h3>
                                            </div>
                                            <div className="grid gap-3">
                                                {items.map((qa) => (
                                                    <motion.div
                                                        layout
                                                        key={qa.id}
                                                        onClick={() => setExpandedQA(expandedQA === qa.id ? null : qa.id)}
                                                        className={`overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${expandedQA === qa.id ? 'bg-[#1a1a1c] border-primary/50 ring-1 ring-primary/20 shadow-2xl shadow-primary/5' : 'bg-[#121214] border-white/5 hover:bg-[#1a1a1c] hover:border-white/20'}`}
                                                    >
                                                        <div className={`${isMobile ? 'p-5' : 'p-6'} flex gap-4 items-start`}>
                                                            <div className={`mt-1 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'} rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${expandedQA === qa.id ? 'bg-primary text-white' : 'bg-white/10 text-zinc-500'}`}>?</div>
                                                            <div className="flex-1">
                                                                <h4 className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'} leading-snug mb-1 transition-colors ${expandedQA === qa.id ? 'text-white' : 'text-zinc-400'}`}>
                                                                    {qa.question}
                                                                </h4>
                                                                <AnimatePresence>
                                                                    {expandedQA === qa.id && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="pt-4 text-zinc-500 leading-relaxed font-medium text-sm border-t border-white/5 mt-4">
                                                                                {qa.answer.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                            <ChevronRight
                                                                size={20}
                                                                className={`text-zinc-600 transition-transform duration-300 ${expandedQA === qa.id ? 'rotate-90 text-primary' : ''}`}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}

                                {filteredQA.length === 0 && (
                                    <div className="py-20 text-center opacity-50">
                                        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Không tìm thấy câu hỏi nào phù hợp.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Reading Modal */}
                <AnimatePresence>
                    {selectedArticle && (
                        <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isMobile ? 'p-0' : 'p-4'}`}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedArticle(null)}
                                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                            />
                            <motion.div
                                layoutId={`article-${selectedArticle.id}`}
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                                className={`bg-[#0e0e10] border border-white/10 ${isMobile ? 'rounded-none h-full' : 'rounded-[2.5rem] max-h-[90vh] shadow-2xl'} w-full max-w-4xl overflow-hidden relative z-10 flex flex-col`}
                            >
                                {/* Sticky Title Bar */}
                                <div className={`relative ${isMobile ? 'h-56' : isTablet ? 'h-72' : 'h-96'} overflow-hidden shrink-0`}>
                                    <img
                                        src={getArticleImage(selectedArticle.category, selectedArticle.id)}
                                        alt={selectedArticle.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                        onError={handleImgError}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent" />
                                    <div className={`absolute ${isMobile ? 'top-4 left-4 right-4' : 'top-8 left-8 right-8'} flex justify-between items-center z-20`}>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-primary px-4 py-1.5 rounded-full shadow-2xl">
                                            {selectedArticle.category}
                                        </span>
                                        <button
                                            onClick={() => setSelectedArticle(null)}
                                            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-6' : 'p-12'}`}>
                                        <h1 className={`${isMobile ? 'text-2xl leading-tight' : isTablet ? 'text-4xl' : 'text-5xl'} font-serif font-black text-white mb-6 italic uppercase tracking-tight shadow-black drop-shadow-lg`}>
                                            {selectedArticle.title}
                                        </h1>
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-[10px]">TH</div>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase">Admin Hùng Phan</p>
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">{selectedArticle.date.split('T')[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0e0e10]">
                                    <div className={`${isMobile ? 'p-6' : 'p-12'} pt-10`}>
                                        <p className={`${isMobile ? 'text-lg' : 'text-2xl'} text-zinc-300 font-medium leading-relaxed mb-12 border-l-4 border-primary pl-6 py-2 italic`}>
                                            {selectedArticle.summary}
                                        </p>

                                        <div className="prose prose-invert prose-lg max-w-none 
                                        prose-headings:font-serif prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:text-white prose-headings:tracking-tight
                                        prose-p:text-zinc-300 prose-p:font-light prose-p:leading-8 prose-p:tracking-wide
                                        prose-strong:text-purple-400 prose-strong:font-black prose-strong:tracking-wide
                                        prose-li:text-zinc-300 prose-li:leading-7 prose-li:marker:text-purple-500
                                        prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                                        prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {selectedArticle.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Interaction */}
                                <div className={`${isMobile ? 'p-4' : 'p-6'} border-t border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl flex justify-between items-center pb-safe`}>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                        THOR KNOWLEDGE BASE © 2024
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleShare} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                                            <Share2 size={20} />
                                        </button>
                                        <button onClick={handleBookmark} className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-90">
                                            <Bookmark size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Floating Navigation Buttons */}
                {!isMobile && (
                    <div className="fixed bottom-10 right-8 z-[200] flex flex-col gap-4 pointer-events-auto">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                document.getElementById('scroll-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg flex items-center justify-center group pointer-events-auto cursor-pointer"
                            title="Cuộn lên đầu"
                        >
                            <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                document.getElementById('scroll-bottom')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            }}
                            className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg flex items-center justify-center group pointer-events-auto cursor-pointer"
                            title="Cuộn xuống cuối"
                        >
                            <ArrowDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        </motion.button>
                    </div>
                )}

                {/* Scroll Bottom Marker */}
                <div id="scroll-bottom" className="absolute bottom-0 left-0 w-px h-px pointer-events-none" />
            </div>
        </div>
    );
}
