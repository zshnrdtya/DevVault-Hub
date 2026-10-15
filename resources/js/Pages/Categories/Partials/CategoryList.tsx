import { router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CategoryItem } from './CategoryModal';

interface CategoryListProps {
    categories: CategoryItem[];
    type: 'snippet' | 'prompt' | 'resource';
    onEdit: (category: CategoryItem) => void;
    onAdd: () => void;
}

export default function CategoryList({
    categories,
    type,
    onEdit,
    onAdd,
}: CategoryListProps) {
    const filteredCategories = categories.filter((c) => c.type === type);

    const getItemCount = (category: CategoryItem): number => {
        if (type === 'snippet') return category.snippets_count || 0;
        if (type === 'prompt') return category.prompts_count || 0;
        return category.resources_count || 0;
    };

    const getItemLabel = (count: number): string => {
        if (type === 'snippet') return `${count} snippet`;
        if (type === 'prompt') return `${count} prompt`;
        return `${count} bookmark`;
    };

    const handleDelete = (category: CategoryItem) => {
        if (
            confirm(
                `Hapus kategori "${category.name}"? Item di dalamnya tidak akan terhapus, melainkan beralih menjadi tanpa kategori.`
            )
        ) {
            router.delete(route('categories.destroy', category.id));
        }
    };

    if (filteredCategories.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Belum ada kategori untuk modul ini
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Kategori membantu Anda mengelompokkan koleksi secara terstruktur.
                </p>
                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                    <Plus className="h-4 w-4" />
                    <span>Buat Kategori Pertama</span>
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#141619]">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredCategories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex flex-col gap-2 p-4 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="h-3.5 w-3.5 shrink-0 rounded-full"
                                style={{ backgroundColor: cat.color || '#3B82F6' }}
                            />
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {cat.name}
                                </h3>
                                <p className="font-mono text-xs text-zinc-400">
                                    /{cat.slug} ·{' '}
                                    <span className="text-zinc-600 dark:text-zinc-300">
                                        {getItemLabel(getItemCount(cat))}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 self-end sm:self-center">
                            <button
                                type="button"
                                onClick={() => onEdit(cat)}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                title="Edit Kategori"
                                aria-label={`Edit ${cat.name}`}
                            >
                                <Pencil className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(cat)}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                title="Hapus Kategori"
                                aria-label={`Hapus ${cat.name}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
