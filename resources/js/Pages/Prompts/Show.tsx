import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Copy,
    Edit3,
    Sparkles,
    Star,
    Tag as TagIcon,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import PromptVariableViewer from './Partials/PromptVariableViewer';

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

interface PromptData {
    id: number;
    title: string;
    description: string | null;
    content: string;
    is_favorite: boolean;
    copy_count: number;
    last_copied_at: string | null;
    created_at: string;
    updated_at: string;
    category?: CategoryItem | null;
    tags: TagItem[];
}

interface ShowProps {
    prompt: PromptData;
}

export default function Show({ prompt }: ShowProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const toggleFavorite = () => {
        router.patch(route('prompts.favorite', prompt.id), {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        router.delete(route('prompts.destroy', prompt.id));
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
                { label: 'Prompt Library', href: route('prompts.index') },
                { label: prompt.title },
            ]}
        >
            <Head title={`${prompt.title} - DevVault Prompt`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Link */}
                <div>
                    <Link
                        href={route('prompts.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Prompt Library</span>
                    </Link>
                </div>

                {/* Header Card */}
                <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                    {prompt.category ? prompt.category.name : 'Prompt AI'}
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                                {prompt.title}
                            </h1>

                            {prompt.description && (
                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    {prompt.description}
                                </p>
                            )}

                            {/* Tags */}
                            {prompt.tags.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <TagIcon className="h-3.5 w-3.5 text-zinc-400" />
                                    {prompt.tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('prompts.index', { tag: tag.slug })}
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
                                title={prompt.is_favorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                                    prompt.is_favorite
                                        ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                                }`}
                            >
                                <Star
                                    className={`h-4 w-4 ${
                                        prompt.is_favorite ? 'fill-amber-400 text-amber-500' : 'text-zinc-400'
                                    }`}
                                />
                                <span className="hidden sm:inline">
                                    {prompt.is_favorite ? 'Favorit' : 'Jadikan Favorit'}
                                </span>
                            </button>

                            <Link
                                href={route('prompts.edit', prompt.id)}
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

                    {/* Metadata Footer */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Dibuat: {formatDate(prompt.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Copy className="h-3.5 w-3.5" />
                            Disalin {prompt.copy_count} kali
                        </span>
                        {prompt.last_copied_at && (
                            <span>Terakhir disalin: {formatDate(prompt.last_copied_at)}</span>
                        )}
                    </div>
                </div>

                {/* Prompt Interactive Variable Viewer */}
                <PromptVariableViewer promptId={prompt.id} content={prompt.content} />

                {/* Confirm Delete Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-[#141619] sm:p-6 space-y-4">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Hapus Prompt Ini?
                            </h3>
                            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Prompt &quot;{prompt.title}&quot; akan dipindahkan ke tong sampah (soft delete). Tindakan ini aman dan dapat dipulihkan bila diperlukan.
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
                                    className="inline-flex min-h-[44px] items-center rounded-md bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                                >
                                    Ya, Hapus Prompt
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
