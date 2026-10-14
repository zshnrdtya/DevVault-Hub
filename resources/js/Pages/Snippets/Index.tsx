import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    Code2,
    Copy,
    Filter,
    Plus,
    Search,
    Star,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
}

interface TagItem {
    id: number;
    name: string;
    slug: string;
}

interface SnippetItem {
    id: number;
    title: string;
    description: string | null;
    code: string;
    language: string;
    is_favorite: boolean;
    copy_count: number;
    created_at: string;
    category?: CategoryItem | null;
    tags: TagItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

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
    filters: {
        q?: string;
        language?: string;
        category_id?: string;
        favorite?: string;
        tag?: string;
        sort?: string;
    };
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
            header={
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Code Snippets
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                        ({snippets.total})
                    </span>
                </div>
            }
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

                {/* DataToolbar: Search, Filters, and Sorting */}
                <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-[#141619] sm:p-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul, kode, atau tag..."
                                    className="w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                            >
                                Cari
                            </button>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                            <span className="flex items-center gap-1 font-medium text-zinc-500">
                                <Filter className="h-3.5 w-3.5" />
                                Filter:
                            </span>

                            {/* Language Filter */}
                            <select
                                value={filters.language || ''}
                                onChange={(e) => applyFilter('language', e.target.value)}
                                className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                            >
                                <option value="">Semua Bahasa</option>
                                {Object.entries(languages).map(([val, label]) => (
                                    <option key={val} value={val}>
                                        {label}
                                    </option>
                                ))}
                            </select>

                            {/* Category Filter */}
                            <select
                                value={filters.category_id || ''}
                                onChange={(e) => applyFilter('category_id', e.target.value)}
                                className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Favorite Toggle Button */}
                            <button
                                type="button"
                                onClick={() => applyFilter('favorite', filters.favorite ? '' : '1')}
                                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 font-medium transition-colors ${
                                    filters.favorite
                                        ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                                }`}
                            >
                                <Star
                                    className={`h-3.5 w-3.5 ${
                                        filters.favorite
                                            ? 'fill-amber-400 text-amber-500'
                                            : 'text-zinc-400'
                                    }`}
                                />
                                <span>Favorit Saja</span>
                            </button>

                            {/* Sorting */}
                            <div className="ml-auto flex items-center gap-1.5">
                                <span className="text-zinc-500">Urut:</span>
                                <select
                                    value={filters.sort || 'latest'}
                                    onChange={(e) => applyFilter('sort', e.target.value)}
                                    className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                                >
                                    <option value="latest">Terbaru</option>
                                    <option value="oldest">Terlama</option>
                                    <option value="title_asc">Judul A–Z</option>
                                    <option value="updated">Terakhir Diubah</option>
                                </select>
                            </div>

                            {/* Reset Filters */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reset Filter</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Snippets Grid */}
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
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-[#141619] dark:hover:border-zinc-700"
                            >
                                {/* Card Header */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                                                {item.language}
                                            </span>
                                            {item.category && (
                                                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                    {item.category.name}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(item.id)}
                                            title={item.is_favorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                            aria-label="Toggle Favorit"
                                            className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded text-zinc-400 hover:text-amber-500"
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

                                    {/* Title & Description */}
                                    <Link
                                        href={route('snippets.show', item.id)}
                                        className="mt-2 block group-hover:text-sky-700 dark:group-hover:text-sky-400"
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

                                    {/* Code Preview Box */}
                                    <div className="mt-3 overflow-hidden rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-[#101114]">
                                        <pre className="font-mono text-[11px] leading-relaxed text-zinc-700 line-clamp-4 dark:text-zinc-300">
                                            <code>{item.code}</code>
                                        </pre>
                                    </div>

                                    {/* Tags */}
                                    {item.tags.length > 0 && (
                                        <div className="mt-2.5 flex flex-wrap gap-1">
                                            {item.tags.slice(0, 3).map((tag) => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => applyFilter('tag', tag.slug)}
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

                                {/* Card Footer Actions */}
                                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
                                    <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                                        Disalin {item.copy_count}x
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item.id, item.code)}
                                            className={`inline-flex min-h-[32px] items-center gap-1 rounded border px-2.5 text-xs font-semibold transition-colors ${
                                                copiedId === item.id
                                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                                            }`}
                                        >
                                            {copiedId === item.id ? (
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

                                        <Link
                                            href={route('snippets.show', item.id)}
                                            className="inline-flex min-h-[32px] items-center rounded border border-transparent px-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {snippets.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-4">
                        {snippets.links.map((link, idx) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={idx}
                                        className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded px-3 text-xs text-zinc-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }
                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    preserveScroll
                                    className={`inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded px-3 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-sky-700 font-bold text-white dark:bg-sky-600'
                                            : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-300 dark:hover:bg-zinc-800'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
