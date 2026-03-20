import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore
import remarkWikiLink from 'remark-wiki-link';

export interface ObsidianEditorProps {
    initialContent?: string;
    readOnly?: boolean;
    onChange?: (content: string) => void;
}

export default function ObsidianEditor({ initialContent = "", readOnly = false, onChange }: ObsidianEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isPreview, setIsPreview] = useState(readOnly);

    // Update internal state if initialContent changes from parent
    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChange?.(newContent);
    };

    // Custom WikiLink Component for rendering [[Links]]
    const WikiLinkRenderer = useCallback(({ href, children }: any) => {
        // Handle internal navigation logic here later
        return (
            <span className="text-primary font-bold underline decoration-primary/30 hover:decoration-primary cursor-pointer transition-all" title={`Link to: ${href}`}>
                {children}
            </span>
        );
    }, []);

    return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-app)]/50">
                <div className="flex gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                </div>
                {!readOnly && (
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-primary transition-colors"
                    >
                        {isPreview ? 'Sửa (Edit)' : 'Xem (Preview)'}
                    </button>
                )}
            </div>

            {/* Help / Instructions */}
            <div className="px-4 py-2 bg-[var(--bg-app)]/30 border-b border-[var(--border-color)] text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold">[[ ]]</span>
                <span>Sử dụng cú pháp <span className="font-bold text-primary">[[Từ khóa]]</span> để tạo liên kết kiến thức. Ví dụ: <span className="italic">Hôm nay tập [[Ngực]]</span>.</span>
            </div>

            {/* Editor / Preview Area */}
            <div className="flex-1 overflow-y-auto relative">
                {isPreview ? (
                    <div className="prose prose-invert max-w-none p-6 text-[var(--text-main)] leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, [remarkWikiLink, { hrefTemplate: (permalink: string) => `${permalink}` }]]}
                            components={{
                                a: WikiLinkRenderer as any // Override link rendering for WikiLinks
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        value={content}
                        onChange={handleChange}
                        className="w-full h-full p-6 bg-transparent text-[var(--text-main)] font-mono text-sm outline-none resize-none placeholder-[var(--text-muted)]/30"
                        placeholder="Start typing... Use [[WikiLinks]] to connect ideas."
                        spellCheck={false}
                    />
                )}
            </div>
        </div>
    );
}
