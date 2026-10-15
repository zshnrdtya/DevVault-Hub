import { router } from '@inertiajs/react';
import { Check, Edit2, Hash, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export interface TagItemWithCount {
    id: number;
    name: string;
    slug: string;
    snippets_count?: number;
    prompts_count?: number;
    resources_count?: number;
}

interface TagManagerProps {
    tags: TagItemWithCount[];
}

export default function TagManager({ tags }: TagManagerProps) {
    const [search, setSearch] = useState('');
    const [editingTagId, setEditingTagId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const filteredTags = tags.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase().trim())
    );

    const startEdit = (tag: TagItemWithCount) => {
        setEditingTagId(tag.id);
        setEditName(tag.name);
    };

    const cancelEdit = () => {
        setEditingTagId(null);
        setEditName('');
    };

    const submitEdit = (tagId: number) => {
        const clean = editName.toLowerCase().trim();
        if (!clean) return;

        router.patch(
            route('tags.update', tagId),
            { name: clean },
            {
                onSuccess: () => cancelEdit(),
            }
        );
    };

    const handleDelete = (tag: TagItemWithCount) => {
        if (
            confirm(
                `Hapus tag #${tag.name} dari vault? Tag ini akan dilepas dari seluruh snippet, prompt, dan bookmark terkait.`
            )
        ) {
            router.delete(route('tags.destroy', tag.id));
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Input for Tags */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari tag..."
                        className="w-full rounded-md border border-zinc-200 bg-white pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                </div>
                <span className="font-mono text-xs text-zinc-500">
                    Total: {tags.length} tag tersimpan
                </span>
            </div>

            {filteredTags.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
                    <Hash className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                    <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {search.trim() ? 'Tidak ada tag yang cocok' : 'Belum ada tag yang dibuat'}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Tag dibuat secara otomatis saat Anda mengetik tag pada snippet, prompt, atau bookmark.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTags.map((tag) => {
                        const totalUses =
                            (tag.snippets_count || 0) +
                            (tag.prompts_count || 0) +
                            (tag.resources_count || 0);

                        const isEditingThis = editingTagId === tag.id;

                        return (
                            <div
                                key={tag.id}
                                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-[#141619]"
                            >
                                {isEditingThis ? (
                                    <div className="flex flex-1 items-center gap-1.5">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full rounded border border-sky-500 bg-zinc-50 px-2 py-1 font-mono text-xs text-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') submitEdit(tag.id);
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => submitEdit(tag.id)}
                                            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded bg-sky-600 text-white hover:bg-sky-500"
                                            title="Simpan"
                                            aria-label="Simpan perubahan nama tag"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                                            title="Batal"
                                            aria-label="Batal edit tag"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                #{tag.name}
                                            </span>
                                            <p className="font-mono text-[10px] text-zinc-400">
                                                {totalUses} item terkait
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(tag)}
                                                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                                title="Ubah Nama Tag"
                                                aria-label={`Ubah nama tag ${tag.name}`}
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(tag)}
                                                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400"
                                                title="Hapus Tag"
                                                aria-label={`Hapus tag ${tag.name}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
