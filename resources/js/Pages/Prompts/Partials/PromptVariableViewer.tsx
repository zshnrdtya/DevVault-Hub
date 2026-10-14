import { router } from '@inertiajs/react';
import { Check, Copy, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PromptVariableViewerProps {
    promptId: number;
    content: string;
}

export default function PromptVariableViewer({
    promptId,
    content,
}: PromptVariableViewerProps) {
    const [copied, setCopied] = useState(false);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});

    // Find all unique {{variable}} occurrences
    const variables = useMemo(() => {
        const matches = content.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [];
        return Array.from(new Set(matches)).map((item) => ({
            raw: item,
            name: item.replace(/^\{\{|\}\}$/g, ''),
        }));
    }, [content]);

    // Compute generated content with variables replaced
    const populatedContent = useMemo(() => {
        let result = content;
        for (const v of variables) {
            const val = variableValues[v.name];
            if (val && val.trim() !== '') {
                result = result.replaceAll(v.raw, val);
            }
        }
        return result;
    }, [content, variables, variableValues]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(populatedContent);
            setCopied(true);
            router.post(route('prompts.copied', promptId), {}, { preserveScroll: true });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const handleVariableChange = (name: string, value: string) => {
        setVariableValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="space-y-4">
            {/* Variable Inputs (If placeholders exist) */}
            {variables.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                            Isi Variabel Placeholder ({variables.length} variabel)
                        </h3>
                    </div>
                    <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/80">
                        Masukkan nilai variabel di bawah untuk mengisi prompt secara otomatis sebelum disalin.
                    </p>

                    <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {variables.map((v) => (
                            <div key={v.name}>
                                <label
                                    htmlFor={`var-${v.name}`}
                                    className="block font-mono text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
                                >
                                    {v.raw}
                                </label>
                                <input
                                    id={`var-${v.name}`}
                                    type="text"
                                    value={variableValues[v.name] || ''}
                                    onChange={(e) => handleVariableChange(v.name, e.target.value)}
                                    placeholder={`Nilai untuk ${v.name}...`}
                                    className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Prompt Preview Container */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#141619]">
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5 dark:border-zinc-800 dark:bg-[#101114]">
                    <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {variables.length > 0 ? 'Hasil Prompt yang Dihasilkan' : 'Isi Prompt'}
                    </span>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors ${
                            copied
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Salin Prompt</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="p-4 sm:p-5">
                    <pre className="font-mono text-xs leading-relaxed text-zinc-800 whitespace-pre-wrap break-words dark:text-zinc-200">
                        {populatedContent}
                    </pre>
                </div>
            </div>
        </div>
    );
}
