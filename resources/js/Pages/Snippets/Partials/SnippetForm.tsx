import TagInput from '@/Components/TagInput';
import { Link } from '@inertiajs/react';
import { Code2, Save, Star } from 'lucide-react';
import { FormEvent } from 'react';

export interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
}

export interface SnippetFormData {
    title: string;
    language: string;
    category_id: string | number;
    code: string;
    description: string;
    tags: string[];
    is_favorite: boolean;
}

interface SnippetFormProps {
    data: SnippetFormData;
    setData: <K extends keyof SnippetFormData>(key: K, value: SnippetFormData[K]) => void;
    errors: Partial<Record<keyof SnippetFormData, string>>;
    processing: boolean;
    categories: CategoryItem[];
    languages: Record<string, string>;
    availableTags: string[];
    onSubmit: (e: FormEvent) => void;
    submitLabel: string;
    cancelHref: string;
}

export default function SnippetForm({
    data,
    setData,
    errors,
    processing,
    categories,
    languages,
    availableTags,
    onSubmit,
    submitLabel,
    cancelHref,
}: SnippetFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Editor Column (2 cols on lg) */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Title */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="title"
                            className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Judul Snippet <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Eloquent Query Scope per User"
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1.5 text-xs text-rose-500">{errors.title}</p>
                        )}
                    </div>

                    {/* Code Area */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="code"
                                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                            >
                                <Code2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                <span>Kode Snippet</span>
                                <span className="text-rose-500">*</span>
                            </label>
                            <span className="font-mono text-[11px] text-zinc-400">
                                Space Mono · ~100 KB max
                            </span>
                        </div>
                        <div className="mt-2">
                            <textarea
                                id="code"
                                rows={14}
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="// Tulis atau tempel kode Anda di sini..."
                                spellCheck={false}
                                className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-[13px] leading-relaxed text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-[#101114] dark:text-zinc-100 dark:placeholder-zinc-600"
                                required
                            />
                        </div>
                        {errors.code && (
                            <p className="mt-1.5 text-xs text-rose-500">{errors.code}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="description"
                            className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Catatan / Penjelasan Singkat (Opsional)
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Catatan kontekstual, dependensi yang dibutuhkan, atau cara penggunaan..."
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                        />
                        {errors.description && (
                            <p className="mt-1.5 text-xs text-rose-500">{errors.description}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Metadata Column (1 col on lg) */}
                <div className="space-y-5">
                    {/* Language & Category */}
                    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                            Bahasa & Kategori
                        </h2>

                        <div>
                            <label
                                htmlFor="language"
                                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                            >
                                Bahasa Pemrograman <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="language"
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                                className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                required
                            >
                                {Object.entries(languages).map(([val, label]) => (
                                    <option key={val} value={val}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.language && (
                                <p className="mt-1.5 text-xs text-rose-500">{errors.language}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="category_id"
                                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                            >
                                Kategori (Opsional)
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
                                <p className="mt-1.5 text-xs text-rose-500">{errors.category_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Tag Input */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <TagInput
                            value={data.tags}
                            onChange={(newTags) => setData('tags', newTags)}
                            availableTags={availableTags}
                            placeholder="Ketik tag lalu tekan enter..."
                        />
                        {errors.tags && (
                            <p className="mt-1.5 text-xs text-rose-500">{errors.tags}</p>
                        )}
                    </div>

                    {/* Favorite Switch & Actions */}
                    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label className="flex cursor-pointer items-center justify-between">
                            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                <Star
                                    className={`h-4 w-4 ${
                                        data.is_favorite
                                            ? 'fill-amber-400 text-amber-500'
                                            : 'text-zinc-400'
                                    }`}
                                />
                                <span>Tandai Favorit</span>
                            </span>
                            <input
                                type="checkbox"
                                checked={data.is_favorite}
                                onChange={(e) => setData('is_favorite', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900"
                            />
                        </label>

                        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
                            >
                                <Save className="h-4 w-4" />
                                <span>{processing ? 'Menyimpan...' : submitLabel}</span>
                            </button>

                            <Link
                                href={cancelHref}
                                className="mt-2.5 flex min-h-[44px] w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
