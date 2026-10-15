import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bookmark,
    Clock,
    Edit3,
    Globe,
    Star,
    Tag as TagIcon,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import ResourceUrlHero from './Partials/ResourceUrlHero';

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

interface ResourceData {
    id: number;
    title: string;
    url: string;
    note: string | null;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
    category?: CategoryItem | null;
    tags: TagItem[];
}

interface ShowProps {
    resource: ResourceData;
}

export default function Show({ resource }: ShowProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const toggleFavorite = () => {
        router.patch(
            route('resources.favorite', resource.id),
            {},
            { preserveScroll: true }
        );
    };

    const handleDelete = () => {
        router.delete(route('resources.destroy', resource.id));
    };

    const getHostname = (rawUrl: string): string => {
        try {
            const parsed = new URL(rawUrl);
            return parsed.hostname.replace(/^www\./, '');
        } catch {
            return rawUrl;
        }
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
                { label: 'Resource Bookmarks', href: route('resources.index') },
                { label: resource.title },
            ]}
        >
            <Head title={`${resource.title} - DevVault Bookmark`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Link */}
                <div>
                    <Link
                        href={route('resources.index')}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Resource Bookmarks</span>
                    </Link>
                </div>

                {/* Header Card */}
                <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                    <Bookmark className="h-3 w-3" />
                                    <span>
                                        {resource.category
                                            ? resource.category.name
                                            : 'Resource'}
                                    </span>
                                </span>

                                <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    <Globe className="h-3 w-3" />
                                    <span>{getHostname(resource.url)}</span>
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                                {resource.title}
                            </h1>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleFavorite}
                                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border p-2 transition-colors ${
                                    resource.is_favorite
                                        ? 'border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-900 dark:bg-amber-950/40'
                                        : 'border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                                }`}
                                aria-label="Toggle Favorit"
                            >
                                <Star
                                    className={`h-4 w-4 ${
                                        resource.is_favorite
                                            ? 'fill-amber-400 text-amber-500'
                                            : ''
                                    }`}
                                />
                            </button>

                            <Link
                                href={route('resources.edit', resource.id)}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Edit</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>

                    {/* Delete Confirmation Alert */}
                    {confirmDelete && (
                        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
                            <p className="text-xs font-semibold text-rose-800 dark:text-rose-200">
                                Yakin ingin menghapus bookmark "{resource.title}"?
                            </p>
                            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                Data akan dipindahkan ke tong sampah dan bisa dipulihkan jika diperlukan.
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex min-h-[44px] items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                                >
                                    Ya, Hapus Bookmark
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Primary URL Action Box */}
                <ResourceUrlHero url={resource.url} />

                {/* Note Section */}
                <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] sm:p-6 space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Catatan Pribadi
                    </h2>
                    {resource.note ? (
                        <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                            {resource.note}
                        </p>
                    ) : (
                        <p className="text-xs italic text-zinc-500 dark:text-zinc-400">
                            Belum ada catatan pribadi untuk bookmark ini.
                        </p>
                    )}
                </div>

                {/* Tags & Metadata */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Tags */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            <TagIcon className="h-3.5 w-3.5 text-zinc-400" />
                            <span>Tag Terkait</span>
                        </div>
                        {resource.tags && resource.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {resource.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Tidak ada tag yang disematkan.
                            </p>
                        )}
                    </div>

                    {/* Metadata Timestamps */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            <span>Informasi Waktu</span>
                        </div>
                        <div className="space-y-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                            <div className="flex justify-between">
                                <span>Dibuat:</span>
                                <span className="text-zinc-900 dark:text-zinc-200">
                                    {formatDate(resource.created_at)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Diperbarui:</span>
                                <span className="text-zinc-900 dark:text-zinc-200">
                                    {formatDate(resource.updated_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
