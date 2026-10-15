import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import ResourceForm, { ResourceFormData } from './Partials/ResourceForm';

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
    const { data, setData, post, processing, errors } = useForm<ResourceFormData>({
        title: '',
        url: '',
        note: '',
        category_id: '',
        tags: [],
        is_favorite: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('resources.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Resource Bookmarks', href: route('resources.index') },
                { label: 'Bookmark Baru' },
            ]}
        >
            <Head title="Tambah Bookmark Baru - DevVault" />

            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <Link
                        href={route('resources.index')}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Resource Bookmarks</span>
                    </Link>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Simpan Bookmark Baru
                    </h1>
                </div>

                <ResourceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    categories={categories}
                    availableTags={availableTags}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan Bookmark"
                    cancelHref={route('resources.index')}
                />
            </div>
        </AuthenticatedLayout>
    );
}
