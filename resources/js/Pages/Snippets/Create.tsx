import TagInput from '@/Components/TagInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Code2, Save } from 'lucide-react';
import { FormEvent } from 'react';

interface CategoryItem {
    id: number;
    name: string;
    color: string | null;
}

interface CreateProps {
    categories: CategoryItem[];
    languages: Record<string, string>;
    availableTags: string[];
}

export default function Create({
    categories = [],
    languages = {},
    availableTags = [],
}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        language: 'javascript',
        category_id: '' as string | number,
        code: '',
        description: '',
        tags: [] as string[],
        is_favorite: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('snippets.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <Link
                        href={route('snippets.index')}
                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                        Snippets
                    </Link>
                    <span className="text-zinc-400">/</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Buat Snippet Baru
                    </span>
                </div>
            }
        >
            <Head title="Buat Snippet Baru - DevVault" />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Button & Title */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href={route('snippets.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke List Snippet</span>
                        </Link>
                        <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                            Buat Snippet Baru
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 2 Columns on Desktop, 1 Column on Mobile */}
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
                                    placeholder="Jelaskan tujuan atau konteks penggunaan kode ini..."
                                    className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs text-rose-500">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Metadata Column (1 col on lg) */}
                        <div className="space-y-5">
                            {/* Language & Category Card */}
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5 space-y-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                    Metadata
                                </h3>

                                {/* Language Selector */}
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
                                    >
                                        {Object.entries(languages).map(([val, label]) => (
                                            <option key={val} value={val}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.language && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.language}</p>
                                    )}
                                </div>

                                {/* Category Selector */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="category_id"
                                            className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                                        >
                                            Kategori (Opsional)
                                        </label>
                                        <Link
                                            href={route('categories.index')}
                                            className="text-[11px] font-medium text-sky-600 hover:underline dark:text-sky-400"
                                        >
                                            + Kategori
                                        </Link>
                                    </div>
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
                                        <p className="mt-1 text-xs text-rose-500">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* Favorite Checkbox */}
                                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_favorite}
                                            onChange={(e) => setData('is_favorite', e.target.checked)}
                                            className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900"
                                        />
                                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                            Tandai sebagai favorit
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Tags Input Card */}
                            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                                    Tags
                                </label>
                                <TagInput
                                    value={data.tags}
                                    onChange={(newTags) => setData('tags', newTags)}
                                    availableTags={availableTags}
                                />
                                {errors.tags && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.tags}</p>
                                )}
                            </div>

                            {/* Submit & Cancel Actions */}
                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{processing ? 'Menyimpan...' : 'Simpan Snippet'}</span>
                                </button>
                                <Link
                                    href={route('snippets.index')}
                                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Batal
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
