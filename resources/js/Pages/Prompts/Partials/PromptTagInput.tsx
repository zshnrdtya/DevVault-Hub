import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface PromptTagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    availableTags: string[];
}

export default function PromptTagInput({
    tags,
    onTagsChange,
    availableTags,
}: PromptTagInputProps) {
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (tagToAdd?: string) => {
        const raw = tagToAdd || tagInput;
        const clean = raw.trim().toLowerCase();
        if (clean && !tags.includes(clean) && tags.length < 10) {
            onTagsChange([...tags, clean]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((t) => t !== tagToRemove));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
            <label
                htmlFor="tags"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
            >
                Tag ({tags.length}/10)
            </label>

            <div className="mt-1.5 flex gap-1.5">
                <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Tambah tag..."
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
                <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="inline-flex min-h-[36px] items-center justify-center rounded-md border border-zinc-300 bg-zinc-100 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            {tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            #{tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-zinc-400 hover:text-rose-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {availableTags.length > 0 && (
                <div className="mt-3 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
                    <p className="text-[11px] text-zinc-400">Tag yang sering dipakai:</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {availableTags
                            .filter((t) => !tags.includes(t))
                            .slice(0, 6)
                            .map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => handleAddTag(t)}
                                    className="rounded border border-dashed border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 hover:border-sky-500 hover:text-sky-600 dark:border-zinc-700 dark:text-zinc-400"
                                >
                                    +{t}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
