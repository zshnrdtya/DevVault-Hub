import AiGenerateButton from '@/Components/AiGenerateButton';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { FormEvent } from 'react';
import PromptTagInput from './PromptTagInput';

export interface PromptFormData {
    title: string;
    description: string;
    content: string;
    category_id: number | string;
    tags: string[];
    is_favorite: boolean;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface PromptFormProps {
    data: PromptFormData;
    setData: (key: any, value?: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    onSubmit: (e: FormEvent) => void;
    submitLabel: string;
    categories: CategoryOption[];
    availableTags: string[];
    cancelHref: string;
}

export default function PromptForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    categories,
    availableTags,
    cancelHref,
}: PromptFormProps) {
    // Detect variables inside content
    const detectedVariables = Array.from(
        new Set(data.content.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [])
    );

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content Column (2 cols on lg) */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Title */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="title"
                            className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Judul Prompt <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Refactoring Kode Bersih (Antislop)"
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
                        )}
                    </div>

                    {/* Prompt Content */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <label
                                htmlFor="content"
                                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                            >
                                Isi Prompt AI <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <AiGenerateButton
                                    type="prompt"
                                    content={data.content}
                                    onSuccess={(result) => {
                                        if (result.title) setData('title', result.title);
                                        if (result.category_id) setData('category_id', result.category_id);
                                        if (result.description) setData('description', result.description);
                                        if (result.tags && result.tags.length > 0) {
                                            const merged = Array.from(new Set([...data.tags, ...result.tags]));
                                            setData('tags', merged);
                                        }
                                    }}
                                    buttonLabel="Auto-Deteksi AI (Gemini)"
                                />
                                <span className="font-mono text-[11px] text-zinc-400">
                                    {data.content.length} karakter
                                </span>
                            </div>
                        </div>

                        <div className="mt-1.5 overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500">
                            <textarea
                                id="content"
                                rows={10}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Tulis instruksi prompt AI di sini. Gunakan {{placeholder}} untuk input dinamis..."
                                className="w-full border-0 bg-zinc-50 p-3 font-mono text-[13px] leading-relaxed text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-0 dark:bg-[#101114] dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:bg-[#101114]"
                            />
                        </div>

                        {errors.content && (
                            <p className="mt-1 text-xs text-rose-500">{errors.content}</p>
                        )}

                        {detectedVariables.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50/70 p-2.5 text-xs dark:border-amber-900/60 dark:bg-amber-950/30">
                                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span className="font-semibold text-amber-800 dark:text-amber-300">
                                    Placeholder variabel terdeteksi:
                                </span>
                                {detectedVariables.map((v) => (
                                    <span
                                        key={v}
                                        className="rounded bg-amber-200/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-900 dark:bg-amber-900/70 dark:text-amber-200"
                                    >
                                        {v}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                            Tips: Gunakan format {'{{nama_variabel}}'} (contoh: {'{{bahasa}}'} atau {'{{error}}'}) untuk membuat prompt dinamis.
                        </p>
                    </div>

                    {/* Description */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="description"
                            className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Deskripsi Konteks (Opsional)
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Kapan atau untuk skenario apa prompt ini efektif digunakan..."
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Column (Metadata) */}
                <div className="space-y-5">
                    {/* Category */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label
                            htmlFor="category_id"
                            className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                        >
                            Kategori Prompt
                        </label>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="">Pilih Kategori (Opsional)</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="mt-1 text-xs text-rose-500">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Tags via sub-component */}
                    <PromptTagInput
                        tags={data.tags}
                        onTagsChange={(newTags) => setData('tags', newTags)}
                        availableTags={availableTags}
                    />

                    {/* Favorite */}
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619] sm:p-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_favorite}
                                onChange={(e) => setData('is_favorite', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900"
                            />
                            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                Tandai sebagai prompt favorit
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2.5 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex min-h-[44px] w-full items-center justify-center rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
                        >
                            {processing ? 'Menyimpan...' : submitLabel}
                        </button>

                        <Link
                            href={cancelHref}
                            className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Batal</span>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
