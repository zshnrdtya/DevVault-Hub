import TagInput from '@/Components/TagInput';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Bookmark, ExternalLink } from 'lucide-react';
import { FormEvent } from 'react';

export interface ResourceFormData {
    title: string;
    url: string;
    note: string;
    category_id: number | string;
    tags: string[];
    is_favorite: boolean;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface ResourceFormProps {
    data: ResourceFormData;
    setData: (key: any, value?: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    onSubmit: (e: FormEvent) => void;
    submitLabel: string;
    categories: CategoryOption[];
    availableTags: string[];
    cancelHref: string;
}

export default function ResourceForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    categories,
    availableTags,
    cancelHref,
}: ResourceFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content Column (2 cols on lg) */}
                <div className="space-y-5 lg:col-span-2">
                    {/* URL Input */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="url"
                            className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            URL Tautan <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                id="url"
                                type="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                placeholder="https://github.com/laravel/laravel"
                                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                            />
                        </div>
                        {errors.url && (
                            <p className="mt-1 text-xs text-rose-500">{errors.url}</p>
                        )}
                        <p className="mt-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                            Wajib menggunakan format tautan lengkap seperti http:// atau https://.
                        </p>
                    </div>

                    {/* Title Input */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="title"
                            className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Judul Bookmark <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Laravel Framework Repository Official"
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
                        )}
                    </div>

                    {/* Note Input */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="note"
                                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                            >
                                Catatan Pribadi (Opsional)
                            </label>
                            <span className="font-mono text-[11px] text-zinc-400">
                                {data.note.length}/2000
                            </span>
                        </div>
                        <textarea
                            id="note"
                            rows={5}
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            maxLength={2000}
                            placeholder="Tulis ringkasan, alasan menyimpan bookmark, atau panduan singkat cara memakainya..."
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 leading-relaxed"
                        />
                        {errors.note && (
                            <p className="mt-1 text-xs text-rose-500">{errors.note}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Column (1 col on lg) */}
                <div className="space-y-5">
                    {/* Category & Tags Card */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5 space-y-4">
                        <div>
                            <label
                                htmlFor="category_id"
                                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                            >
                                Kategori
                            </label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="">Tanpa Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Tag Terkait
                            </label>
                            <TagInput
                                value={data.tags}
                                onChange={(tags) => setData('tags', tags)}
                                availableTags={availableTags}
                                maxTags={10}
                                placeholder="Ketik tag dan Enter..."
                            />
                            {errors.tags && (
                                <p className="mt-1 text-xs text-rose-500">{errors.tags}</p>
                            )}
                        </div>

                        {/* Favorite Checkbox */}
                        <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_favorite}
                                    onChange={(e) => setData('is_favorite', e.target.checked)}
                                    className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900"
                                />
                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    Tandai sebagai Favorit
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit & Cancel Actions */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5 space-y-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
                        >
                            <Bookmark className="h-4 w-4" />
                            <span>{processing ? 'Menyimpan...' : submitLabel}</span>
                        </button>

                        <Link
                            href={cancelHref}
                            className="w-full inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Batal</span>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
