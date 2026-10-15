import { Bookmark, Code2, TerminalSquare } from 'lucide-react';

export interface SearchSnippet {
    id: number;
    title: string;
    language: string;
    category?: { id: number; name: string; color: string | null } | null;
}

export interface SearchPrompt {
    id: number;
    title: string;
    category?: { id: number; name: string; color: string | null } | null;
}

export interface SearchResource {
    id: number;
    title: string;
    url: string;
    category?: { id: number; name: string; color: string | null } | null;
}

export interface SearchResults {
    snippets: SearchSnippet[];
    prompts: SearchPrompt[];
    resources: SearchResource[];
}

export interface FlatSearchItem {
    type: 'snippet' | 'prompt' | 'resource';
    id: number;
    title: string;
    subtitle: string;
    href: string;
}

interface GlobalSearchResultsListProps {
    results: SearchResults;
    allItems: FlatSearchItem[];
    selectedIndex: number;
    onSelect: (href: string) => void;
}

export default function GlobalSearchResultsList({
    results,
    allItems,
    selectedIndex,
    onSelect,
}: GlobalSearchResultsListProps) {
    return (
        <div className="space-y-3">
            {/* Snippets Results */}
            {results.snippets.length > 0 && (
                <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Code2 className="h-3 w-3 text-sky-600" />
                        <span>Code Snippets ({results.snippets.length})</span>
                    </div>
                    <div className="space-y-1">
                        {results.snippets.map((snippet) => {
                            const itemIdx = allItems.findIndex(
                                (i) => i.type === 'snippet' && i.id === snippet.id
                            );
                            const isSelected = itemIdx === selectedIndex;
                            return (
                                <button
                                    key={`s-${snippet.id}`}
                                    type="button"
                                    onClick={() =>
                                        onSelect(route('snippets.show', snippet.id))
                                    }
                                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                                        isSelected
                                            ? 'bg-sky-50 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200'
                                            : 'hover:bg-zinc-100 text-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800/60'
                                    }`}
                                >
                                    <span className="truncate font-semibold max-w-[400px]">
                                        {snippet.title}
                                    </span>
                                    <span className="font-mono text-[10px] uppercase rounded bg-zinc-200/70 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {snippet.language}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Prompts Results */}
            {results.prompts.length > 0 && (
                <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <TerminalSquare className="h-3 w-3 text-purple-600" />
                        <span>AI Prompts ({results.prompts.length})</span>
                    </div>
                    <div className="space-y-1">
                        {results.prompts.map((prompt) => {
                            const itemIdx = allItems.findIndex(
                                (i) => i.type === 'prompt' && i.id === prompt.id
                            );
                            const isSelected = itemIdx === selectedIndex;
                            return (
                                <button
                                    key={`p-${prompt.id}`}
                                    type="button"
                                    onClick={() =>
                                        onSelect(route('prompts.show', prompt.id))
                                    }
                                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                                        isSelected
                                            ? 'bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-200'
                                            : 'hover:bg-zinc-100 text-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800/60'
                                    }`}
                                >
                                    <span className="truncate font-semibold max-w-[400px]">
                                        {prompt.title}
                                    </span>
                                    {prompt.category && (
                                        <span className="text-[10px] rounded bg-zinc-200/70 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            {prompt.category.name}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Resources Results */}
            {results.resources.length > 0 && (
                <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Bookmark className="h-3 w-3 text-amber-600" />
                        <span>Resource Bookmarks ({results.resources.length})</span>
                    </div>
                    <div className="space-y-1">
                        {results.resources.map((resource) => {
                            const itemIdx = allItems.findIndex(
                                (i) => i.type === 'resource' && i.id === resource.id
                            );
                            const isSelected = itemIdx === selectedIndex;
                            return (
                                <button
                                    key={`r-${resource.id}`}
                                    type="button"
                                    onClick={() =>
                                        onSelect(route('resources.show', resource.id))
                                    }
                                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                                        isSelected
                                            ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                                            : 'hover:bg-zinc-100 text-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800/60'
                                    }`}
                                >
                                    <span className="truncate font-semibold max-w-[340px]">
                                        {resource.title}
                                    </span>
                                    <span className="truncate font-mono text-[10px] text-zinc-500 max-w-[180px]">
                                        {resource.url}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
