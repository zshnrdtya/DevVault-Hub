import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bookmark, Code2, FolderKanban, Plus, TerminalSquare } from 'lucide-react';
import DashboardFavorites, {
    FavoritePrompt,
    FavoriteResource,
    FavoriteSnippet,
} from './Dashboard/Partials/DashboardFavorites';
import StatCard from './Dashboard/Partials/StatCard';

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

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard' },
            ]}
        >
            <Head title="Dashboard - DevVault" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Selamat Datang di DevVault
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Pusat penyimpanan personal untuk kode, prompt AI, dan referensi harian Anda.
                    </p>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
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

                {/* Favorite Items Section */}
                <DashboardFavorites
                    favoriteSnippets={favoriteSnippets}
                    favoritePrompts={favoritePrompts}
                    favoriteResources={favoriteResources}
                />
            </div>
        </AuthenticatedLayout>
    );
}
