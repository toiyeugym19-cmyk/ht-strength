import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useJournalStore } from '../store/useJournalStore';
import type { JournalEntry } from '../store/useJournalStore';
import { Save, Bold, Italic, List, PenTool, Trash2, Calendar, Smile, Meh, Frown, Zap, Plus, Clock, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { JOURNAL_TEMPLATES } from '../data/journalTemplates';

const moodMap = {
    happy: { emoji: '😊', icon: <Smile />, label: 'Vui vẻ', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    neutral: { emoji: '😐', icon: <Meh />, label: 'Bình thường', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    stressed: { emoji: '😫', icon: <Frown />, label: 'Căng thẳng', color: 'text-red-400', bg: 'bg-red-400/10' },
    energetic: { emoji: '🔥', icon: <Zap />, label: 'Năng lượng', color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

export default function JournalPage() {
    const { entries, addEntry, deleteEntry } = useJournalStore();
    const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('neutral');
    const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: `<h2>feat(daily): hoàn thành mục tiêu ngày hôm nay...</h2><p>Ghi lại những trải nghiệm, cảm xúc và bài học của ngày hôm nay.</p>`,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-lg leading-relaxed'
            }
        }
    });

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const [mobileView, setMobileView] = useState<'list' | 'editor' | 'detail'>('list');

    const handleSave = () => {
        if (!editor || !editor.getText().trim()) return;
        const content = editor.getHTML();
        addEntry({
            date: new Date().toISOString(),
            content,
            mood: selectedMood
        });
        editor.commands.setContent('<h2>feat(daily): hoàn thành mục tiêu ngày hôm nay...</h2><p>Ghi lại những trải nghiệm, cảm xúc và bài học của ngày hôm nay.</p>');
        toast.success('Đã lưu nhật ký thành công!');
        if (isMobile) setMobileView('list');
    };

    if (!editor) return null;

    // --- MOBILE VIEW ---
    if (isMobile) {
        return (
            <div className="flex flex-col min-h-full bg-bg-dark pb-24" data-device="mobile">
                <AnimatePresence mode="wait">
                    {mobileView === 'list' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-6 pt-6 flex flex-col h-full">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h1 className="text-4xl font-[900] text-white italic uppercase tracking-tighter leading-none mb-2">JOURNAL</h1>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">COMMIT HISTORY</p>
                                </div>
                                <button onClick={() => { setViewEntry(null); setMobileView('editor'); }} className="w-14 h-14 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 active:scale-90 transition-all">
                                    <Plus size={28} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="space-y-4 no-scrollbar pb-10">
                                {entries.map(entry => (
                                    <div
                                        key={entry.id}
                                        onClick={() => { setViewEntry(entry); setMobileView('detail'); }}
                                        className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-5 active:scale-95 transition-all"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-primary/60"># {entry.id.substring(0, 7)}</span>
                                                {entry.mood && (
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${moodMap[entry.mood].bg} ${moodMap[entry.mood].color}`}>
                                                        {moodMap[entry.mood].label}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-zinc-600 font-bold">{format(new Date(entry.date), 'dd/MM')}</span>
                                        </div>
                                        <h4 className="font-bold text-white text-[15px] mb-1 line-clamp-1 italic">{new DOMParser().parseFromString(entry.content, 'text/html').body.textContent?.split('.')[0] || 'No Context'}</h4>
                                        <div className="flex justify-end">
                                            <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className="p-2 text-zinc-700 active:text-rose-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {entries.length === 0 && (
                                    <div className="text-center py-20 opacity-20"><BookOpen size={64} className="mx-auto mb-4" /><p className="font-black uppercase tracking-widest text-xs">No records found</p></div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {mobileView === 'editor' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col h-full bg-[#0c0c0e] rounded-t-[3rem] mt-4 flex-1">
                            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-white/5">
                                <button onClick={() => setMobileView('list')} className="text-[10px] font-black uppercase tracking-widest text-zinc-500">CANCEL</button>
                                <div className="flex gap-2">
                                    {(Object.keys(moodMap) as Array<keyof typeof moodMap>).map(m => (
                                        <button key={m} onClick={() => setSelectedMood(m)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${selectedMood === m ? moodMap[m].bg + ' scale-110' : 'opacity-30'}`}>
                                            {React.cloneElement(moodMap[m].icon, { size: 18, className: selectedMood === m ? moodMap[m].color : 'text-white' })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 px-8 pt-8 overflow-y-auto no-scrollbar">
                                <EditorContent editor={editor} className="min-h-[300px]" />
                            </div>
                            <div className="p-8">
                                <button onClick={handleSave} className="w-full py-5 bg-primary text-white font-[900] rounded-[2rem] shadow-2xl shadow-primary/40 italic uppercase tracking-[0.2em]">COMMIT ENTRY</button>
                            </div>
                        </motion.div>
                    )}

                    {mobileView === 'detail' && viewEntry && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-bg-dark px-6 pt-8">
                            <div className="flex justify-between items-start mb-10">
                                <button onClick={() => setMobileView('list')} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 active:scale-95"><Clock size={20} /></button>
                                <div className={`p-4 rounded-2xl ${moodMap[viewEntry.mood || 'neutral'].bg} flex items-center gap-3`}>
                                    {React.cloneElement(moodMap[viewEntry.mood || 'neutral'].icon, { className: moodMap[viewEntry.mood || 'neutral'].color })}
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${moodMap[viewEntry.mood || 'neutral'].color}`}>{moodMap[viewEntry.mood || 'neutral'].label}</span>
                                </div>
                            </div>
                            <div className="mb-8">
                                <h1 className="text-3xl font-[900] text-white italic uppercase leading-tight tracking-tighter mb-2">ENTRY DETAIL</h1>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{format(new Date(viewEntry.date), 'PPPP', { locale: vi })}</p>
                            </div>
                            <div className="flex-1 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 overflow-y-auto no-scrollbar prose prose-invert max-w-none mb-10" dangerouslySetInnerHTML={{ __html: viewEntry.content }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] ${isTablet ? 'p-6' : ''}`} data-device={isTablet ? 'tablet' : 'desktop'}>
            {/* Sidebar: Commit History */}
            <div className={`${isTablet ? 'lg:col-span-5' : 'lg:col-span-4'} flex flex-col gap-6 h-full overflow-hidden`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-[900] text-white italic uppercase tracking-tighter">
                            JOURNAL
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 pl-1">Lịch sử hoạt động / MASTER</p>
                    </div>
                    <button
                        onClick={() => setViewEntry(null)}
                        className="w-12 h-12 bg-zinc-900/50 rounded-2xl border border-white/5 flex items-center justify-center text-primary shadow-xl hover:bg-zinc-800 transition-all active:scale-90"
                    >
                        <Plus size={24} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => setViewEntry(entry)}
                            className={`p-6 rounded-[2rem] cursor-pointer transition-all duration-300 relative border ${viewEntry?.id === entry.id ? 'bg-primary/5 border-primary shadow-[0_0_50px_rgba(168,85,247,0.1)]' : 'bg-zinc-900/20 border-white/5 hover:bg-zinc-900/40 hover:border-white/10'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-zinc-600">
                                        commit # {entry.id.substring(0, 7)}
                                    </span>
                                    {entry.mood && (
                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${moodMap[entry.mood].bg} ${moodMap[entry.mood].color}`}>
                                            {moodMap[entry.mood].label}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); if (viewEntry?.id === entry.id) setViewEntry(null); }}
                                    className="p-2 text-zinc-700 hover:text-rose-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h4 className="font-[900] text-white text-base mb-2 italic">
                                {new DOMParser().parseFromString(entry.content, 'text/html').body.textContent?.split('.')[0] || 'No context'}
                            </h4>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-2 font-black uppercase tracking-widest">
                                <Clock size={12} strokeWidth={3} /> {format(new Date(entry.date), 'dd MMM yyyy · HH:mm')}
                            </div>
                        </div>
                    ))}
                    {entries.length === 0 && (
                        <div className="text-center py-24 opacity-10 border-4 border-dashed border-white/5 rounded-[3rem]">
                            <PenTool size={64} className="mx-auto mb-6" />
                            <p className="text-xs font-black uppercase tracking-[0.5em]">System Idle</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className={`${isTablet ? 'lg:col-span-7' : 'lg:col-span-8'} h-full flex flex-col`}>
                <AnimatePresence mode="wait">
                    {viewEntry ? (
                        <motion.div
                            key={`view-${viewEntry.id}`}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="bg-zinc-900/10 border border-white/5 h-full flex flex-col p-12 overflow-y-auto relative rounded-[3rem] shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`w-20 h-20 rounded-[2rem] ${moodMap[viewEntry.mood || 'neutral'].bg} flex items-center justify-center shadow-2xl`}>
                                        {React.cloneElement(moodMap[viewEntry.mood || 'neutral'].icon, { size: 36, className: moodMap[viewEntry.mood || 'neutral'].color })}
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-[900] text-white italic tracking-tighter leading-none mb-3">ENTRY READOUT</h2>
                                        <p className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Calendar size={14} strokeWidth={3} /> {format(new Date(viewEntry.date), 'PPPP', { locale: vi })}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setViewEntry(null)} className="px-8 py-3 bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 active:scale-95 transition-all">TERMINATE VIEW</button>
                            </div>
                            <div className="prose prose-invert max-w-none text-xl leading-relaxed font-medium text-zinc-200 bg-zinc-900/20 p-10 rounded-[2.5rem] border border-white/5" dangerouslySetInnerHTML={{ __html: viewEntry.content }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="new-entry"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-[#0c0c0e] border border-white/5 h-full flex flex-col overflow-hidden rounded-[3rem] shadow-2xl"
                        >
                            {/* Toolbar */}
                            <div className="bg-zinc-900/40 p-6 border-b border-white/5 flex flex-wrap gap-4 items-center backdrop-blur-3xl">
                                <div className="flex gap-1.5 p-1 bg-black/40 rounded-[1.2rem]">
                                    <ToolbarButton isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                                        <Bold size={20} strokeWidth={3} />
                                    </ToolbarButton>
                                    <ToolbarButton isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                                        <Italic size={20} strokeWidth={3} />
                                    </ToolbarButton>
                                    <ToolbarButton isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                                        <List size={20} strokeWidth={3} />
                                    </ToolbarButton>
                                </div>

                                <div className="h-10 w-[1px] bg-white/5 hidden md:block" />

                                <div className="relative">
                                    <button
                                        onClick={() => setShowTemplates(!showTemplates)}
                                        className={`h-12 px-6 rounded-[1.2rem] flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${showTemplates ? 'bg-primary text-white shadow-lg' : 'bg-black/40 text-zinc-500 hover:text-white'}`}
                                    >
                                        <BookOpen size={18} strokeWidth={3} /> TEMPLATES
                                    </button>

                                    <AnimatePresence>
                                        {showTemplates && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-4 w-72 bg-[#0c0c0e] border border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-3xl"
                                            >
                                                {JOURNAL_TEMPLATES.map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => {
                                                            editor.commands.setContent(t.content);
                                                            setShowTemplates(false);
                                                            toast.success('Đã áp dụng mẫu: ' + t.name);
                                                        }}
                                                        className="w-full text-left p-5 hover:bg-primary/10 border-b border-white/5 last:border-0 group"
                                                    >
                                                        <div className="text-white font-black text-[11px] mb-1 group-hover:text-primary uppercase tracking-widest">{t.name}</div>
                                                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{t.description}</div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="h-10 w-[1px] bg-white/5 hidden md:block" />

                                <div className="flex gap-2 p-1.5 bg-black/40 rounded-[1.2rem]">
                                    {(Object.keys(moodMap) as Array<keyof typeof moodMap>).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setSelectedMood(m)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500 ${selectedMood === m ? moodMap[m].bg + ' scale-110 shadow-lg shadow-black/40' : 'hover:bg-white/5 opacity-30 shadow-none'}`}
                                            title={moodMap[m].label}
                                        >
                                            {React.cloneElement(moodMap[m].icon, { size: 22, className: selectedMood === m ? moodMap[m].color : 'text-white' })}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1" />
                                <button onClick={handleSave} className="bg-primary px-10 py-4 rounded-[1.5rem] font-[900] italic text-white text-[11px] flex items-center gap-3 group shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                                    <Save size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> COMMIT
                                </button>
                            </div>

                            {/* Editor content */}
                            <div className="flex-1 p-12 overflow-y-auto no-scrollbar bg-gradient-to-b from-transparent to-black/30">
                                <EditorContent editor={editor} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ToolbarButton({ children, onClick, isActive }: { children: React.ReactNode, onClick: () => void, isActive: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive
                ? 'text-primary bg-primary/20 shadow-inner'
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
        >
            {children}
        </button>
    );
}
