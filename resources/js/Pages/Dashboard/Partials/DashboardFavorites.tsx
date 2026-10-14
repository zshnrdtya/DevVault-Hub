import { Link } from '@inertiajs/react';
import { Bookmark, Code2, ExternalLink, Star, TerminalSquare } from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
}

export interface FavoriteSnippet {
    id: number;
    title: string;
    language: string;
    category?: CategoryItem | null;
    created_at: string;
}

export interface FavoritePrompt {
    id: number;
    title: string;
    category?: CategoryItem | null;
    created_at: string;
}

export interface FavoriteResource {
    id: number;
    title: string;
    url: string;
    category?: CategoryItem | null;
    created_at: string;
}

interface DashboardFavoritesProps {
    favoriteSnippets: FavoriteSnippet[];
    favoritePrompts: FavoritePrompt[];
    favoriteResources: FavoriteResource[];
}

export default function DashboardFavorites({
    favoriteSnippets = [],
    favoritePrompts = [],
    favoriteResources = [],
}: DashboardFavoritesProps) {
    const hasFavorites =
        favoriteSnippets.length > 0 ||
        favoritePrompts.length > 0 ||
        favoriteResources.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Item Favorit
                    </h2>
                </div>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    Paling sering diakses
                </span>
            </div>

            {!hasFavorites ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
                    <Star className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                    <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Belum ada item yang ditandai favorit
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Klik ikon bintang pada kartu snippet, prompt, atau resource untuk menampilkannya di sini.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Snippets Column */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <Code2 className="h-3.5 w-3.5" />
                            <span>Snippet Favorit</span>
                        </div>
                        {favoriteSnippets.length === 0 ? (
                            <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#141619]">
                                Tidak ada snippet favorit.
                            </div>
                        ) : (
                            favoriteSnippets.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('snippets.show', item.id)}
                                    className="block rounded-md border border-zinc-200 bg-white p-3 transition-colors hover:border-sky-500 dark:border-zinc-800 dark:bg-[#141619] dark:hover:border-sky-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[10px] uppercase tracking-wider text-sky-700 dark:text-sky-400">
                                            {item.language}
                                        </span>
                                        {item.category && (
                                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {item.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                        {item.title}
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Prompts Column */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <TerminalSquare className="h-3.5 w-3.5" />
                            <span>Prompt Favorit</span>
                        </div>
                        {favoritePrompts.length === 0 ? (
                            <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#141619]">
                                Tidak ada prompt favorit.
                            </div>
                        ) : (
                            favoritePrompts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('prompts.show', item.id)}
                                    className="block rounded-md border border-zinc-200 bg-white p-3 transition-colors hover:border-sky-500 dark:border-zinc-800 dark:bg-[#141619] dark:hover:border-sky-500"
                                >
                                    {item.category && (
                                        <span className="inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            {item.category.name}
                                        </span>
                                    )}
                                    <p className="mt-1 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                        {item.title}
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Resources Column */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <Bookmark className="h-3.5 w-3.5" />
                            <span>Resource Favorit</span>
                        </div>
                        {favoriteResources.length === 0 ? (
                            <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#141619]">
                                Tidak ada resource favorit.
                            </div>
                        ) : (
                            favoriteResources.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block rounded-md border border-zinc-200 bg-white p-3 transition-colors hover:border-sky-500 dark:border-zinc-800 dark:bg-[#141619] dark:hover:border-sky-500"
                                >
                                    <div className="flex items-center justify-between">
                                        {item.category && (
                                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {item.category.name}
                                            </span>
                                        )}
                                        <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-sky-500" />
                                    </div>
                                    <p className="mt-1 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                        {item.title}
                                    </p>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
