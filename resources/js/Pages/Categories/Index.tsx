import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Bookmark, Code2, FolderKanban, Hash, Plus, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import CategoryList from './Partials/CategoryList';
import CategoryModal, { CategoryItem } from './Partials/CategoryModal';
import TagManager, { TagItemWithCount } from './Partials/TagManager';

interface IndexProps {
    categories: CategoryItem[];
    tags: TagItemWithCount[];
}

type TabType = 'snippet' | 'prompt' | 'resource' | 'tags';

export default function Index({ categories = [], tags = [] }: IndexProps) {
    const [activeTab, setActiveTab] = useState<TabType>('snippet');
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryItem | null>(null);

    const snippetCategoriesCount = categories.filter((c) => c.type === 'snippet').length;
    const promptCategoriesCount = categories.filter((c) => c.type === 'prompt').length;
    const resourceCategoriesCount = categories.filter((c) => c.type === 'resource').length;

    const handleOpenAdd = () => {
        setCategoryToEdit(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (cat: CategoryItem) => {
        setCategoryToEdit(cat);
        setModalOpen(true);
    };

    const tabs = [
        {
            id: 'snippet' as const,
            label: 'Code Snippets',
            icon: Code2,
            count: snippetCategoriesCount,
        },
        {
            id: 'prompt' as const,
            label: 'AI Prompts',
            icon: TerminalSquare,
            count: promptCategoriesCount,
        },
        {
            id: 'resource' as const,
            label: 'Bookmarks',
            icon: Bookmark,
            count: resourceCategoriesCount,
        },
        {
            id: 'tags' as const,
            label: 'Tag Vault',
            icon: Hash,
            count: tags.length,
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Kelola Kategori & Tag' },
            ]}
        >
            <Head title="Kelola Kategori & Tag - DevVault" />

            <div className="space-y-6">
                {/* Header Title & Action Button */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                            Kelola Kategori & Tag
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Atur taksonomi konten per modul dan rapikan seluruh tag Anda di satu tempat.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenAdd}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Kategori Baru</span>
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`inline-flex min-h-[44px] items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                                            : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                                            isActive
                                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'tags' ? (
                        <TagManager tags={tags} />
                    ) : (
                        <CategoryList
                            categories={categories}
                            type={activeTab}
                            onEdit={handleOpenEdit}
                            onAdd={handleOpenAdd}
                        />
                    )}
                </div>
            </div>

            {/* Modal Tambah/Edit Kategori */}
            <CategoryModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                categoryToEdit={categoryToEdit}
                defaultType={activeTab === 'tags' ? 'snippet' : activeTab}
            />
        </AuthenticatedLayout>
    );
}
