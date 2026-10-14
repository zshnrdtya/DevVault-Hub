import { Tag as TagIcon, X } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    availableTags?: string[];
    maxTags?: number;
    placeholder?: string;
}

export default function TagInput({
    value = [],
    onChange,
    availableTags = [],
    maxTags = 10,
    placeholder = 'Ketik tag lalu tekan Enter...',
}: TagInputProps) {
    const [input, setInput] = useState('');

    const addTag = (rawTag: string) => {
        const cleaned = rawTag.toLowerCase().trim().replace(/,/g, '');
        if (!cleaned || value.includes(cleaned) || value.length >= maxTags) {
            return;
        }
        onChange([...value, cleaned]);
        setInput('');
    };

    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, idx) => idx !== indexToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const suggestions = availableTags
        .filter(
            (tag) =>
                tag.toLowerCase().includes(input.toLowerCase().trim()) &&
                !value.includes(tag.toLowerCase())
        )
        .slice(0, 5);

    return (
        <div className="space-y-1.5">
            <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 dark:border-zinc-800 dark:bg-[#141619]">
                <TagIcon className="h-4 w-4 shrink-0 text-zinc-400" />
                {value.map((tag, idx) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                        <span>#{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(idx)}
                            className="text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400"
                            aria-label={`Hapus tag ${tag}`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                {value.length < maxTags && (
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={value.length === 0 ? placeholder : ''}
                        className="flex-1 min-w-[120px] border-none bg-transparent p-0 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-100"
                    />
                )}
            </div>

            {/* Autocomplete Suggestions */}
            {input.trim() !== '' && suggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
                    <span className="text-[11px]">Saran:</span>
                    {suggestions.map((sug) => (
                        <button
                            key={sug}
                            type="button"
                            onClick={() => addTag(sug)}
                            className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            +{sug}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>Tekan Enter atau koma untuk menambahkan tag</span>
                <span>{value.length}/{maxTags}</span>
            </div>
        </div>
    );
}
