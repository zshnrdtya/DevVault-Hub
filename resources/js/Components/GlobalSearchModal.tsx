import { router } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, Search, X } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import GlobalSearchResultsList, {
    FlatSearchItem,
    SearchResults,
} from './GlobalSearchResultsList';

interface GlobalSearchModalProps {
    open: boolean;
    onClose: () => void;
}

export default function GlobalSearchModal({
    open,
    onClose,
}: GlobalSearchModalProps) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults>({
        snippets: [],
        prompts: [],
        resources: [],
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setQuery('');
            setResults({ snippets: [], prompts: [], resources: [] });
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Debounced search query
    useEffect(() => {
        if (!open) return;

        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setResults({ snippets: [], prompts: [], resources: [] });
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            axios
                .get(route('search.global'), { params: { q: trimmed } })
                .then((res) => {
                    setResults(res.data);
                    setSelectedIndex(0);
                })
                .catch(() => {
                    setResults({ snippets: [], prompts: [], resources: [] });
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [query, open]);

    if (!open) return null;

    // Flatten all results into a single indexable list for keyboard navigation
    const allItems: FlatSearchItem[] = [
        ...results.snippets.map((s) => ({
            type: 'snippet' as const,
            id: s.id,
            title: s.title,
            subtitle: s.language.toUpperCase(),
            href: route('snippets.show', s.id),
        })),
        ...results.prompts.map((p) => ({
            type: 'prompt' as const,
            id: p.id,
            title: p.title,
            subtitle: p.category ? p.category.name : 'Prompt AI',
            href: route('prompts.show', p.id),
        })),
        ...results.resources.map((r) => ({
            type: 'resource' as const,
            id: r.id,
            title: r.title,
            subtitle: r.url,
            href: route('resources.show', r.id),
        })),
    ];

    const handleSelect = (href: string) => {
        onClose();
        router.visit(href);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (allItems.length > 0) {
                setSelectedIndex((prev) => (prev + 1) % allItems.length);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (allItems.length > 0) {
                setSelectedIndex((prev) =>
                    prev === 0 ? allItems.length - 1 : prev - 1
                );
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (allItems.length > 0 && allItems[selectedIndex]) {
                handleSelect(allItems[selectedIndex].href);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    const hasAnyResults =
        results.snippets.length > 0 ||
        results.prompts.length > 0 ||
        results.resources.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-zinc-900/60 backdrop-blur-xs">
            <div
                className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#141619] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header Input */}
                <div className="relative flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                    <Search className="h-4 w-4 shrink-0 text-zinc-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ketik untuk mencari snippet, prompt, atau bookmark..."
                        className="flex-1 border-none bg-transparent p-0 text-sm font-mono text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder-zinc-500"
                    />
                    {loading && (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-sky-600 mr-2" />
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        aria-label="Tutup pencarian"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {query.trim().length >= 2 && !loading && !hasAnyResults && (
                        <div className="p-8 text-center">
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Tidak ada hasil untuk "{query}"
                            </p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Coba kata kunci yang lebih spesifik pada judul, tag, atau isi kode.
                            </p>
                        </div>
                    )}

                    {query.trim().length < 2 && (
                        <div className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                            Ketik minimal 2 karakter untuk memulai pencarian global.
                        </div>
                    )}

                    {hasAnyResults && (
                        <GlobalSearchResultsList
                            results={results}
                            allItems={allItems}
                            selectedIndex={selectedIndex}
                            onSelect={handleSelect}
                        />
                    )}
                </div>

                {/* Keyboard Navigation Footer */}
                <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/70 px-4 py-2 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 font-mono">
                    <span>Gunakan tanda panah atas dan bawah untuk memilih</span>
                    <div className="flex items-center gap-2">
                        <span>↵ buka</span>
                        <span>esc tutup</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
