import { Link } from '@inertiajs/react';
import { Check, Copy, Sparkles, Star } from 'lucide-react';

export interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
}

export interface TagItem {
    id: number;
    name: string;
    slug: string;
}

export interface PromptItem {
    id: number;
    title: string;
    description: string | null;
    content: string;
    is_favorite: boolean;
    copy_count: number;
    created_at: string;
    category?: CategoryItem | null;
    tags: TagItem[];
}

interface PromptCardProps {
    item: PromptItem;
    isCopied: boolean;
    onCopy: (id: number, content: string) => void;
    onToggleFavorite: (id: number) => void;
    onTagClick: (tagSlug: string) => void;
}

export default function PromptCard({
    item,
    isCopied,
    onCopy,
    onToggleFavorite,
    onTagClick,
}: PromptCardProps) {
    // Detect {{variable}} placeholders in prompt content
    const variables = Array.from(
        new Set(item.content.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [])
    );

    return (
        <div className="group flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-[#141619] dark:hover:border-zinc-700">
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {item.category ? (
                            <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                                {item.category.name}
                            </span>
                        ) : (
                            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                Tanpa Kategori
                            </span>
                        )}

                        {variables.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                                <Sparkles className="h-3 w-3" />
                                <span>{variables.length} variabel</span>
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onToggleFavorite(item.id)}
                        title={item.is_favorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                        aria-label="Toggle Favorit"
                        className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded text-zinc-400 hover:text-amber-500"
                    >
                        <Star
                            className={`h-4 w-4 ${
                                item.is_favorite
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-zinc-400 hover:text-amber-400'
                            }`}
                        />
                    </button>
                </div>

                <Link
                    href={route('prompts.show', item.id)}
                    className="mt-2.5 block group-hover:text-sky-700 dark:group-hover:text-sky-400"
                >
                    <h2 className="text-sm font-bold text-zinc-900 line-clamp-1 dark:text-zinc-100">
                        {item.title}
                    </h2>
                </Link>

                {item.description && (
                    <p className="mt-1 text-xs text-zinc-600 line-clamp-2 dark:text-zinc-400">
                        {item.description}
                    </p>
                )}

                <div className="mt-3 overflow-hidden rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-[#101114]">
                    <p className="font-mono text-[11px] leading-relaxed text-zinc-700 line-clamp-4 dark:text-zinc-300 whitespace-pre-wrap">
                        {item.content}
                    </p>
                </div>

                {item.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => onTagClick(tag.slug)}
                                className="font-mono text-[10px] text-zinc-500 hover:text-sky-600 dark:text-zinc-400 dark:hover:text-sky-400"
                            >
                                #{tag.name}
                            </button>
                        ))}
                        {item.tags.length > 3 && (
                            <span className="font-mono text-[10px] text-zinc-400">
                                +{item.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
                <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    Disalin {item.copy_count}x
                </span>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onCopy(item.id, item.content)}
                        className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors ${
                            isCopied
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
                        }`}
                    >
                        {isCopied ? (
                            <>
                                <Check className="h-3 w-3 stroke-[2.5]" />
                                <span>Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" />
                                <span>Salin</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
