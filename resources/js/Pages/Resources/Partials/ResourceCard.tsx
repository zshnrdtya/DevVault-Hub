import { Link, router } from '@inertiajs/react';
import {
    Bookmark,
    ExternalLink,
    MoreVertical,
    Pencil,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

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

export interface ResourceItem {
    id: number;
    title: string;
    url: string;
    note: string | null;
    is_favorite: boolean;
    category?: CategoryItem | null;
    tags?: TagItem[];
    created_at: string;
    updated_at: string;
}

interface ResourceCardProps {
    resource: ResourceItem;
    onTagClick?: (slug: string) => void;
}

export default function ResourceCard({
    resource,
    onTagClick,
}: ResourceCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getHostname = (rawUrl: string): string => {
        try {
            const parsed = new URL(rawUrl);
            return parsed.hostname.replace(/^www\./, '');
        } catch {
            return rawUrl;
        }
    };

    const handleToggleFavorite = () => {
        router.patch(
            route('resources.favorite', resource.id),
            {},
            { preserveScroll: true }
        );
    };

    const handleDelete = () => {
        if (confirm(`Hapus bookmark "${resource.title}"?`)) {
            router.delete(route('resources.destroy', resource.id));
        }
    };

    return (
        <div className="flex h-full flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-[#141619]">
            <div className="space-y-3">
                {/* Header: Hostname & Favorite Toggle */}
                <div className="flex items-center justify-between gap-2">
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded bg-zinc-100 px-2 py-1 font-mono text-[11px] font-medium text-zinc-600 transition-colors hover:text-sky-600 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:text-sky-400"
                    >
                        <Bookmark className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                        <span className="truncate max-w-[170px] sm:max-w-[200px]">
                            {getHostname(resource.url)}
                        </span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleToggleFavorite}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-zinc-400 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:text-amber-400"
                            aria-label={
                                resource.is_favorite
                                    ? 'Hapus dari favorit'
                                    : 'Tambah ke favorit'
                            }
                        >
                            <Star
                                className={`h-4 w-4 ${
                                    resource.is_favorite
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-zinc-400'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Title (opens external URL directly) */}
                <div>
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-1.5 text-sm font-bold text-zinc-900 transition-colors hover:text-sky-600 dark:text-zinc-100 dark:hover:text-sky-400"
                    >
                        <span className="line-clamp-2 leading-snug">
                            {resource.title}
                        </span>
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
                    </a>

                    {/* Category */}
                    {resource.category && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                    backgroundColor:
                                        resource.category.color || '#0284C7',
                                }}
                            />
                            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                                {resource.category.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Note preview if available */}
                {resource.note && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {resource.note}
                    </p>
                )}

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {resource.tags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => onTagClick?.(tag.slug)}
                                className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                            >
                                #{tag.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
                <Link
                    href={route('resources.show', resource.id)}
                    className="inline-flex min-h-[44px] items-center text-xs font-semibold text-sky-700 hover:underline dark:text-sky-400"
                >
                    Lihat Detail
                </Link>

                <div className="flex items-center gap-1">
                    <Link
                        href={route('resources.edit', resource.id)}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        title="Edit Bookmark"
                        aria-label="Edit Bookmark"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="Hapus Bookmark"
                        aria-label="Hapus Bookmark"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
