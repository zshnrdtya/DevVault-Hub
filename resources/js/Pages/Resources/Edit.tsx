import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import ResourceForm, { ResourceFormData } from './Partials/ResourceForm';

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
    category_id: number | null;
    is_favorite: boolean;
    tags: TagItem[];
}

interface CategoryOption {
    id: number;
    name: string;
}

interface EditProps {
    resource: ResourceData;
    categories: CategoryOption[];
    availableTags: string[];
}

export default function Edit({
    resource,
    categories = [],
    availableTags = [],
}: EditProps) {
    const { data, setData, put, processing, errors } = useForm<ResourceFormData>({
        title: resource.title || '',
        url: resource.url || '',
        note: resource.note || '',
        category_id: (resource.category_id ?? '') as string | number,
        tags: resource.tags ? resource.tags.map((t) => t.name) : [],
        is_favorite: Boolean(resource.is_favorite),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('resources.update', resource.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Resource Bookmarks', href: route('resources.index') },
                { label: resource.title, href: route('resources.show', resource.id) },
                { label: 'Edit' },
            ]}
        >
            <Head title={`Edit ${resource.title} - DevVault`} />

            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <Link
                        href={route('resources.show', resource.id)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Detail Bookmark</span>
                    </Link>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Edit Bookmark
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
                    submitLabel="Perbarui Bookmark"
                    cancelHref={route('resources.show', resource.id)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
