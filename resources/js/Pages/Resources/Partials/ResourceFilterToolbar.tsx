import { Filter, Search, Star, X } from 'lucide-react';
import { FormEvent } from 'react';

export interface CategoryOption {
    id: number;
    name: string;
}

export interface FilterState {
    q?: string;
    category_id?: string;
    favorite?: string;
    tag?: string;
    sort?: string;
}

interface ResourceFilterToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: FormEvent) => void;
    filters: FilterState;
    onFilterChange: (key: string, value: string | boolean) => void;
    onClearFilters: () => void;
    categories: CategoryOption[];
    hasActiveFilters: boolean;
}

export default function ResourceFilterToolbar({
    search,
    onSearchChange,
    onSearchSubmit,
    filters,
    onFilterChange,
    onClearFilters,
    categories,
    hasActiveFilters,
}: ResourceFilterToolbarProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-[#141619] sm:p-4">
            <form onSubmit={onSearchSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Cari judul bookmark, domain, catatan, atau tag..."
                            className="w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        Cari
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <span className="flex items-center gap-1 font-medium text-zinc-500">
                        <Filter className="h-3.5 w-3.5" />
                        Filter:
                    </span>

                    <select
                        value={filters.category_id || ''}
                        onChange={(e) => onFilterChange('category_id', e.target.value)}
                        className="rounded-md border border-zinc-200 bg-white pl-2.5 pr-8 py-1.5 text-xs text-zinc-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => onFilterChange('favorite', filters.favorite ? '' : '1')}
                        className={`inline-flex min-h-[36px] items-center gap-1 rounded-md border px-2.5 py-1.5 font-medium transition-colors ${
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

                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-zinc-500">Urut:</span>
                        <select
                            value={filters.sort || 'latest'}
                            onChange={(e) => onFilterChange('sort', e.target.value)}
                            className="rounded-md border border-zinc-200 bg-white pl-2.5 pr-8 py-1.5 text-xs text-zinc-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                            <option value="latest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                            <option value="title_asc">Judul A - Z</option>
                            <option value="updated">Terakhir Diubah</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800"
                        >
                            <X className="h-3.5 w-3.5" />
                            <span>Reset Filter</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
