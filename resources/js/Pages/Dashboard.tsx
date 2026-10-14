import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bookmark,
    Code2,
    ExternalLink,
    FolderKanban,
    Plus,
    Star,
    TerminalSquare,
} from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
}

interface FavoriteSnippet {
    id: number;
    title: string;
    language: string;
    category?: CategoryItem | null;
    created_at: string;
}

interface FavoritePrompt {
    id: number;
    title: string;
    category?: CategoryItem | null;
    created_at: string;
}

interface FavoriteResource {
    id: number;
    title: string;
    url: string;
    category?: CategoryItem | null;
    created_at: string;
}

interface DashboardProps {
    stats: {
        snippets: number;
        prompts: number;
        resources: number;
        categories: number;
    };
    favoriteSnippets: FavoriteSnippet[];
    favoritePrompts: FavoritePrompt[];
    favoriteResources: FavoriteResource[];
}

export default function Dashboard({
    stats,
    favoriteSnippets = [],
    favoritePrompts = [],
    favoriteResources = [],
}: DashboardProps) {
    const statCards = [
        {
            label: 'Code Snippets',
            count: stats.snippets,
            href: route('snippets.index'),
            icon: Code2,
            actionLabel: '+ Snippet',
            actionHref: route('snippets.create'),
        },
        {
            label: 'AI Prompts',
            count: stats.prompts,
            href: route('prompts.index'),
            icon: TerminalSquare,
            actionLabel: '+ Prompt',
            actionHref: route('prompts.create'),
        },
        {
            label: 'Bookmarks',
            count: stats.resources,
            href: route('resources.index'),
            icon: Bookmark,
            actionLabel: '+ Resource',
            actionHref: route('resources.create'),
        },
        {
            label: 'Kategori',
            count: stats.categories,
            href: route('categories.index'),
            icon: FolderKanban,
            actionLabel: 'Kelola',
            actionHref: route('categories.index'),
        },
    ];

    const hasFavorites =
        favoriteSnippets.length > 0 ||
        favoritePrompts.length > 0 ||
        favoriteResources.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Ringkasan Workspace
                    </span>
                </div>
            }
        >
            <Head title="Dashboard - DevVault" />

            <div className="space-y-8">
                {/* Section Header */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Selamat Datang di DevVault
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Pusat penyimpanan personal untuk kode, prompt AI, dan referensi harian Anda.
                    </p>
                </div>

                {/* 4 Stat Cards: 2x2 on mobile, 4 columns on desktop */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-[#141619]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        {card.label}
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                        {card.count}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
                                    <Link
                                        href={card.href}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    >
                                        Buka list
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                    <Link
                                        href={card.actionHref}
                                        className="inline-flex min-h-[32px] items-center gap-1 rounded px-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                                    >
                                        {card.actionLabel}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions Bar */}
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Aksi Cepat
                            </h2>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                Simpan item baru ke dalam vault dalam hitungan detik.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('snippets.create')}
                                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Snippet Baru</span>
                            </Link>
                            <Link
                                href={route('prompts.create')}
                                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Prompt Baru</span>
                            </Link>
                            <Link
                                href={route('resources.create')}
                                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Bookmark Baru</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Favorite Items Section (P0: DSH-2) */}
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
                                    <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-500">
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
                                    <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-500">
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
                                    <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-500">
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
            </div>
        </AuthenticatedLayout>
    );
}
