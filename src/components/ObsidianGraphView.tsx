import { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ARTICLES from '../data/articles.json';
import QA_DATA from '../data/qa.json';

export default function ObsidianGraphView({ onNodeClick, editorContent = "" }: { onNodeClick?: (node: any) => void, editorContent?: string }) {
    // Simple dark mode check or default to dark for now
    const isDark = true;

    // Transform Data into Graph Nodes & Links
    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];

        // 1. Add "Central" Node
        nodes.push({ id: 'ROOT', name: 'Knowledge Base', val: 20, color: '#f59e0b', type: 'root' });

        // 2. Add Category Nodes
        const categories = Array.from(new Set(ARTICLES.map(a => a.category)));
        categories.forEach(cat => {
            nodes.push({ id: `CAT-${cat}`, name: cat, val: 10, color: '#3b82f6', type: 'category' });
            links.push({ source: 'ROOT', target: `CAT-${cat}` });
        });

        // 3. Add Article Nodes
        ARTICLES.forEach(article => {
            nodes.push({ id: article.id, name: article.title, val: 5, color: '#10b981', type: 'article', data: article });
            // Link to Category
            links.push({ source: `CAT-${article.category}`, target: article.id });
        });

        // 4. Add QA Nodes (optional, or separate clusters)
        QA_DATA.forEach((qa, idx) => {
            const qaId = `QA-${idx}`;
            nodes.push({ id: qaId, name: `Q: ${qa.question}`, val: 3, color: '#8b5cf6', type: 'qa', data: qa });
            // Attempt to link to category if exists, else link to ROOT
            // Assuming QA has category field matching Article categories, otherwise loose link
            const catNodeId = `CAT-${qa.category}`;
            if (nodes.find(n => n.id === catNodeId)) {
                links.push({ source: catNodeId, target: qaId });
            } else {
                links.push({ source: 'ROOT', target: qaId });
            }
        });

        // 5. Parse Editor Content for WikiLinks
        const wikiLinkRegex = /\[\[(.*?)\]\]/g;
        let match;
        const editorNodes = new Set<string>();

        // Add "Editor" Source Node
        if (editorContent) {
            nodes.push({ id: 'EDITOR', name: 'My Notes', val: 15, color: '#ec4899', type: 'editor' });
            links.push({ source: 'ROOT', target: 'EDITOR' });

            while ((match = wikiLinkRegex.exec(editorContent)) !== null) {
                const linkName = match[1];
                const nodeId = `NOTE-${linkName}`;

                // Check if node exists (e.g. valid article), if so link to it
                const existingNode = nodes.find(n => n.name.toLowerCase() === linkName.toLowerCase());

                if (existingNode) {
                    links.push({ source: 'EDITOR', target: existingNode.id });
                } else {
                    // Create new "Ghost" node for undefined link
                    if (!editorNodes.has(linkName)) {
                        nodes.push({ id: nodeId, name: linkName, val: 5, color: '#6366f1', type: 'ghost' });
                        editorNodes.add(linkName);
                    }
                    links.push({ source: 'EDITOR', target: nodeId });
                }
            }
        }

        return { nodes, links };
    }, [editorContent]);

    return (
        <div className="w-full h-[500px] border border-[var(--border-color)] rounded-3xl overflow-hidden bg-[var(--bg-card)] relative group">
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[var(--bg-app)]/80 backdrop-blur rounded-lg border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-muted)] pointer-events-none">
                OBSIDIAN GRAPH VIEW
            </div>

            <ForceGraph2D
                width={800} // This matches the container normally, or use ResizeObserver
                height={500}
                graphData={graphData}
                backgroundColor={isDark ? '#09090b' : '#ffffff'}
                nodeLabel="name"
                nodeColor="color"
                linkColor={() => isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                onNodeClick={onNodeClick}
                nodeRelSize={6}
                linkWidth={1}
                d3VelocityDecay={0.3}
                cooldownTicks={100}
                onEngineStop={() => { }}
            />
        </div>
    );
}
