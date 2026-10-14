import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import SnippetForm, { CategoryItem } from './Partials/SnippetForm';

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
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Snippets', href: route('snippets.index') },
                { label: 'Snippet Baru' },
            ]}
        >
            <Head title="Buat Snippet Baru - DevVault" />

            <div className="mx-auto max-w-5xl space-y-6">
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

                <SnippetForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    categories={categories}
                    languages={languages}
                    availableTags={availableTags}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan Snippet"
                    cancelHref={route('snippets.index')}
                />
            </div>
        </AuthenticatedLayout>
    );
}
