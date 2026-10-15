import { useForm } from '@inertiajs/react';
import { FolderPlus, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';

export interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    type: 'snippet' | 'prompt' | 'resource';
    color: string | null;
    snippets_count?: number;
    prompts_count?: number;
    resources_count?: number;
}

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    categoryToEdit?: CategoryItem | null;
    defaultType?: 'snippet' | 'prompt' | 'resource';
}

const PRESET_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#0284C7', // Sky
    '#64748B', // Slate
];

export default function CategoryModal({
    open,
    onClose,
    categoryToEdit,
    defaultType = 'snippet',
}: CategoryModalProps) {
    const isEditing = Boolean(categoryToEdit);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            type: defaultType,
            color: '#3B82F6',
        });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (categoryToEdit) {
                setData({
                    name: categoryToEdit.name,
                    type: categoryToEdit.type,
                    color: categoryToEdit.color || '#3B82F6',
                });
            } else {
                setData({
                    name: '',
                    type: defaultType,
                    color: '#3B82F6',
                });
            }
        }
    }, [open, categoryToEdit, defaultType]);

    if (!open) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditing && categoryToEdit) {
            put(route('categories.update', categoryToEdit.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
            <div
                className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-[#141619] sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <FolderPlus className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        aria-label="Tutup modal"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Category Type (only when creating) */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                            Tipe Modul
                        </label>
                        <select
                            value={data.type}
                            disabled={isEditing}
                            onChange={(e) =>
                                setData(
                                    'type',
                                    e.target.value as 'snippet' | 'prompt' | 'resource'
                                )
                            }
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white pl-2.5 pr-8 py-2 text-sm text-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:disabled:bg-zinc-800"
                        >
                            <option value="snippet">Code Snippets</option>
                            <option value="prompt">AI Prompts</option>
                            <option value="resource">Resource Bookmarks</option>
                        </select>
                    </div>

                    {/* Category Name */}
                    <div>
                        <label
                            htmlFor="cat-name"
                            className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Nama Kategori <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="cat-name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Frontend, DevSecOps, Referensi API"
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Color Preset Palette */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                            Warna Penanda
                        </label>
                        <div className="flex flex-wrap items-center gap-2.5">
                            {PRESET_COLORS.map((col) => (
                                <button
                                    key={col}
                                    type="button"
                                    onClick={() => setData('color', col)}
                                    className={`h-7 w-7 rounded-full transition-transform ${
                                        data.color === col
                                            ? 'scale-125 ring-2 ring-offset-2 ring-sky-500 dark:ring-offset-zinc-900'
                                            : 'hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: col }}
                                    aria-label={`Pilih warna ${col}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex min-h-[44px] items-center rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEditing
                                ? 'Simpan Perubahan'
                                : 'Tambah Kategori'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
