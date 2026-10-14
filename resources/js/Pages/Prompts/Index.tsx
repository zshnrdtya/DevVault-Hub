import Pagination, { PaginationLink } from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import PromptCard, { CategoryItem, PromptItem } from './Partials/PromptCard';
import PromptFilterToolbar, {
    CategoryOption,
    FilterState,
} from './Partials/PromptFilterToolbar';

interface PaginatedPrompts {
    data: PromptItem[];
    links: PaginationLink[];
    total: number;
    current_page: number;
    last_page: number;
}

interface IndexProps {
    prompts: PaginatedPrompts;
    categories: CategoryOption[];
    filters: FilterState;
}

export default function Index({
    prompts,
    categories = [],
    filters = {},
}: IndexProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const applyFilter = (key: string, value: string | boolean) => {
        router.get(
            route('prompts.index'),
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
        router.get(route('prompts.index'));
    };

    const handleCopy = async (id: number, content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            router.post(route('prompts.copied', id), {}, { preserveScroll: true });
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            setCopiedId(null);
        }
    };

    const toggleFavorite = (id: number) => {
        router.patch(route('prompts.favorite', id), {}, { preserveScroll: true });
    };

    const hasActiveFilters = Boolean(
        filters.q || filters.category_id || filters.favorite || filters.tag || filters.sort
    );

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Prompt Library' },
            ]}
        >
            <Head title="Prompt Library - DevVault" />

            <div className="space-y-6">
                {/* Header Title & Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                            Prompt Library
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Koleksi instruksi AI berkualitas untuk coding, debugging, dan dokumentasi.
                        </p>
                    </div>

                    <Link
                        href={route('prompts.create')}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Prompt Baru</span>
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <PromptFilterToolbar
                    search={search}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearchSubmit}
                    filters={filters}
                    onFilterChange={applyFilter}
                    onClearFilters={clearAllFilters}
                    categories={categories}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Prompts Grid or Empty State */}
                {prompts.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
                        <Sparkles className="mx-auto h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                        <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {hasActiveFilters ? 'Tidak ada prompt yang cocok' : 'Belum ada prompt AI'}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                            {hasActiveFilters
                                ? 'Coba ubah kata kunci atau bersihkan filter di atas.'
                                : 'Mulai simpan prompt AI yang terbukti efektif agar bisa Anda gunakan berulang kali.'}
                        </p>
                        {!hasActiveFilters && (
                            <Link
                                href={route('prompts.create')}
                                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Buat Prompt Pertama</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {prompts.data.map((item) => (
                            <PromptCard
                                key={item.id}
                                item={item}
                                isCopied={copiedId === item.id}
                                onCopy={handleCopy}
                                onToggleFavorite={toggleFavorite}
                                onTagClick={(slug) => applyFilter('tag', slug)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {prompts.total > 0 && <Pagination links={prompts.links} />}
            </div>
        </AuthenticatedLayout>
    );
}
