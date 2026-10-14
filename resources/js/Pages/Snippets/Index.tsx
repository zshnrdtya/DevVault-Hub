import Pagination, { PaginationLink } from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Code2, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import SnippetCard, {
    CategoryItem,
    SnippetItem,
} from './Partials/SnippetCard';
import SnippetFilterToolbar, {
    FilterState,
} from './Partials/SnippetFilterToolbar';

interface PaginatedSnippets {
    data: SnippetItem[];
    links: PaginationLink[];
    total: number;
    current_page: number;
    last_page: number;
}

interface IndexProps {
    snippets: PaginatedSnippets;
    categories: CategoryItem[];
    languages: Record<string, string>;
    filters: FilterState;
}

export default function Index({
    snippets,
    categories = [],
    languages = {},
    filters = {},
}: IndexProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const applyFilter = (key: string, value: string | boolean) => {
        router.get(
            route('snippets.index'),
            {
                ...filters,
                [key]: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilter('q', search);
    };

    const clearAllFilters = () => {
        setSearch('');
        router.get(route('snippets.index'));
    };

    const handleCopy = async (id: number, code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            router.post(route('snippets.copied', id), {}, { preserveScroll: true });
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            setCopiedId(null);
        }
    };

    const toggleFavorite = (id: number) => {
        router.patch(route('snippets.favorite', id), {}, { preserveScroll: true });
    };

    const hasActiveFilters = Boolean(
        filters.q ||
            filters.language ||
            filters.category_id ||
            filters.favorite ||
            filters.tag ||
            filters.sort
    );

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Code Snippets' },
            ]}
        >
            <Head title="Code Snippets - DevVault" />

            <div className="space-y-6">
                {/* Header Title & Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                            Code Snippets
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Kelola dan salin potongan kode harian Anda dengan cepat.
                        </p>
                    </div>

                    <Link
                        href={route('snippets.create')}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Snippet Baru</span>
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <SnippetFilterToolbar
                    search={search}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearchSubmit}
                    filters={filters}
                    onFilterChange={applyFilter}
                    onClearFilters={clearAllFilters}
                    categories={categories}
                    languages={languages}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Snippets Grid or Empty State */}
                {snippets.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
                        <Code2 className="mx-auto h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                        <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {hasActiveFilters ? 'Tidak ada snippet yang cocok' : 'Belum ada code snippet'}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                            {hasActiveFilters
                                ? 'Coba ubah kata kunci atau bersihkan filter di atas.'
                                : 'Mulai simpan potongan kode yang sering Anda gunakan agar tidak perlu menulis ulang.'}
                        </p>
                        <div className="mt-5">
                            {hasActiveFilters ? (
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    Bersihkan Filter
                                </button>
                            ) : (
                                <Link
                                    href={route('snippets.create')}
                                    className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Buat Snippet Pertama</span>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {snippets.data.map((item) => (
                            <SnippetCard
                                key={item.id}
                                item={item}
                                isCopied={copiedId === item.id}
                                onCopy={handleCopy}
                                onToggleFavorite={toggleFavorite}
                                onTagClick={(tagSlug) => applyFilter('tag', tagSlug)}
                            />
                        ))}
                    </div>
                )}

                <Pagination links={snippets.links} />
            </div>
        </AuthenticatedLayout>
    );
}
