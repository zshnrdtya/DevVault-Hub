import Pagination, { PaginationLink } from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Bookmark, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import ResourceCard, { ResourceItem } from './Partials/ResourceCard';
import ResourceFilterToolbar, {
    CategoryOption,
    FilterState,
} from './Partials/ResourceFilterToolbar';

interface PaginatedResources {
    data: ResourceItem[];
    links: PaginationLink[];
    total: number;
    current_page: number;
    last_page: number;
}

interface IndexProps {
    resources: PaginatedResources;
    categories: CategoryOption[];
    filters: FilterState;
}

export default function Index({
    resources,
    categories = [],
    filters = {},
}: IndexProps) {
    const [search, setSearch] = useState(filters.q || '');

    const applyFilter = (key: string, value: string | boolean) => {
        router.get(
            route('resources.index'),
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
        router.get(route('resources.index'));
    };

    const hasActiveFilters = Boolean(
        filters.q || filters.category_id || filters.favorite || filters.tag || filters.sort
    );

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Resource Bookmarks' },
            ]}
        >
            <Head title="Resource Bookmarks - DevVault" />

            <div className="space-y-6">
                {/* Header Title & Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                            Resource Bookmarks
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Koleksi tautan dokumentasi, repositori GitHub, library, dan referensi penting.
                        </p>
                    </div>

                    <Link
                        href={route('resources.create')}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Bookmark Baru</span>
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <ResourceFilterToolbar
                    search={search}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearchSubmit}
                    filters={filters}
                    onFilterChange={applyFilter}
                    onClearFilters={clearAllFilters}
                    categories={categories}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Resources Grid or Empty State */}
                {resources.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
                        <Bookmark className="mx-auto h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                        <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {hasActiveFilters ? 'Tidak ada bookmark yang cocok' : 'Belum ada tautan bookmark'}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                            {hasActiveFilters
                                ? 'Coba ubah kata kunci atau bersihkan filter di atas.'
                                : 'Mulai simpan referensi web, dokumentasi, dan repositori penting Anda di sini.'}
                        </p>
                        {!hasActiveFilters && (
                            <Link
                                href={route('resources.create')}
                                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Simpan Bookmark Pertama</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {resources.data.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                onTagClick={(tagSlug) => applyFilter('tag', tagSlug)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {resources.last_page > 1 && (
                    <div className="pt-2">
                        <Pagination links={resources.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
