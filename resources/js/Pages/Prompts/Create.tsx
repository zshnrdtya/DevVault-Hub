import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import PromptForm from './Partials/PromptForm';

interface CategoryOption {
    id: number;
    name: string;
}

interface CreateProps {
    categories: CategoryOption[];
    availableTags: string[];
}

export default function Create({
    categories = [],
    availableTags = [],
}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        description: '',
        category_id: '' as string | number,
        tags: [] as string[],
        is_favorite: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('prompts.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Prompt Library', href: route('prompts.index') },
                { label: 'Prompt Baru' },
            ]}
        >
            <Head title="Buat Prompt Baru - DevVault" />

            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <Link
                        href={route('prompts.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Prompt Library</span>
                    </Link>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Buat Prompt Baru
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
                    submitLabel="Simpan Prompt"
                    cancelHref={route('prompts.index')}
                />
            </div>
        </AuthenticatedLayout>
    );
}
