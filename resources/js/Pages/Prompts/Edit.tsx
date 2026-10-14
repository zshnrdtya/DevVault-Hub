import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import PromptForm from './Partials/PromptForm';

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
    category_id: number | null;
    is_favorite: boolean;
    tags: TagItem[];
}

interface CategoryOption {
    id: number;
    name: string;
}

interface EditProps {
    prompt: PromptData;
    categories: CategoryOption[];
    availableTags: string[];
}

export default function Edit({
    prompt,
    categories = [],
    availableTags = [],
}: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: prompt.title || '',
        content: prompt.content || '',
        description: prompt.description || '',
        category_id: (prompt.category_id ?? '') as string | number,
        tags: prompt.tags ? prompt.tags.map((t) => t.name) : [],
        is_favorite: Boolean(prompt.is_favorite),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('prompts.update', prompt.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Prompt Library', href: route('prompts.index') },
                { label: prompt.title, href: route('prompts.show', prompt.id) },
                { label: 'Edit' },
            ]}
        >
            <Head title={`Edit ${prompt.title} - DevVault`} />

            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <Link
                        href={route('prompts.show', prompt.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Detail Prompt</span>
                    </Link>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Edit Prompt
                    </h1>
                </div>

                <PromptForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    categories={categories}
                    availableTags={availableTags}
                    onSubmit={handleSubmit}
                    submitLabel="Perbarui Prompt"
                    cancelHref={route('prompts.show', prompt.id)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
