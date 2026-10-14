import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import SnippetForm, { CategoryItem } from './Partials/SnippetForm';

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
    category_id: number | null;
    is_favorite: boolean;
    tags: TagItem[];
}

interface EditProps {
    snippet: SnippetData;
    categories: CategoryItem[];
    languages: Record<string, string>;
    availableTags: string[];
}

export default function Edit({
    snippet,
    categories = [],
    languages = {},
    availableTags = [],
}: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: snippet.title || '',
        language: snippet.language || 'javascript',
        category_id: (snippet.category_id ?? '') as string | number,
        code: snippet.code || '',
        description: snippet.description || '',
        tags: snippet.tags ? snippet.tags.map((t) => t.name) : [],
        is_favorite: Boolean(snippet.is_favorite),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('snippets.update', snippet.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Snippets', href: route('snippets.index') },
                { label: snippet.title, href: route('snippets.show', snippet.id) },
                { label: 'Edit' },
            ]}
        >
            <Head title={`Edit ${snippet.title} - DevVault`} />

            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <Link
                        href={route('snippets.show', snippet.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Detail Snippet</span>
                    </Link>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Edit Snippet
                    </h1>
                </div>

                <SnippetForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    categories={categories}
                    languages={languages}
                    availableTags={availableTags}
                    onSubmit={handleSubmit}
                    submitLabel="Perbarui Snippet"
                    cancelHref={route('snippets.show', snippet.id)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
