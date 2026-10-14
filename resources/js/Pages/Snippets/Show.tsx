import CodeBlock from '@/Components/CodeBlock';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Copy,
    Edit3,
    Star,
    Tag as TagIcon,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

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

interface SnippetData {
    id: number;
    title: string;
    description: string | null;
    code: string;
    language: string;
    is_favorite: boolean;
    copy_count: number;
    last_copied_at: string | null;
    created_at: string;
    updated_at: string;
    category?: CategoryItem | null;
    tags: TagItem[];
}

interface ShowProps {
    snippet: SnippetData;
    languages: Record<string, string>;
}

export default function Show({ snippet, languages = {} }: ShowProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const toggleFavorite = () => {
        router.patch(route('snippets.favorite', snippet.id), {}, { preserveScroll: true });
    };

    const handleCopyRecorded = () => {
        router.post(route('snippets.copied', snippet.id), {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        router.delete(route('snippets.destroy', snippet.id));
    };

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(dateString));
        } catch {
            return dateString;
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Snippets', href: route('snippets.index') },
                { label: snippet.title },
            ]}
        >
            <Head title={`${snippet.title} - DevVault Snippet`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Link */}
                <div>
                    <Link
                        href={route('snippets.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke List Snippet</span>
                    </Link>
                </div>

                {/* Header Card: Title, Badges, and Action Bar */}
                <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded bg-sky-50 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                    {languages[snippet.language] || snippet.language}
                                </span>
                                {snippet.category && (
                                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {snippet.category.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                                {snippet.title}
                            </h1>

                            {snippet.description && (
                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    {snippet.description}
                                </p>
                            )}

                            {/* Tags */}
                            {snippet.tags.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <TagIcon className="h-3.5 w-3.5 text-zinc-400" />
                                    {snippet.tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('snippets.index', { tag: tag.slug })}
                                            className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs text-zinc-700 hover:border-sky-500 hover:text-sky-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-sky-400"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={toggleFavorite}
                                title={snippet.is_favorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                                    snippet.is_favorite
                                        ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                                }`}
                            >
                                <Star
                                    className={`h-4 w-4 ${
                                        snippet.is_favorite
                                            ? 'fill-amber-400 text-amber-500'
                                            : 'text-zinc-400'
                                    }`}
                                />
                                <span>{snippet.is_favorite ? 'Favorit' : 'Favoritkan'}</span>
                            </button>

                            <Link
                                href={route('snippets.edit', snippet.id)}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                            >
                                <Edit3 className="h-4 w-4" />
                                <span>Edit</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>

                    {/* Meta Bar */}
                    <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-zinc-100 pt-4 font-mono text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Dibuat: {formatDate(snippet.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Copy className="h-3.5 w-3.5" />
                            <span>Disalin {snippet.copy_count} kali</span>
                        </div>
                        {snippet.last_copied_at && (
                            <div>Terakhir disalin: {formatDate(snippet.last_copied_at)}</div>
                        )}
                    </div>
                </div>

                {/* Highlighted Code Block */}
                <div className="space-y-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                        Isi Kode
                    </h2>
                    <CodeBlock
                        code={snippet.code}
                        language={snippet.language}
                        onCopied={handleCopyRecorded}
                    />
                </div>

                {/* Delete Confirmation Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-[#141619] sm:p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        Hapus Snippet Ini?
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Snippet akan dipindahkan ke tong sampah (soft delete).
                                    </p>
                                </div>
                            </div>

                            <p className="rounded-md border border-zinc-100 bg-zinc-50 p-2.5 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                                {snippet.title}
                            </p>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex min-h-[44px] items-center rounded-md bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-500"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
