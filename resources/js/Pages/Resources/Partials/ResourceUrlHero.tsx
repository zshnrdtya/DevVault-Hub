import { Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ResourceUrlHeroProps {
    url: string;
}

export default function ResourceUrlHero({ url }: ResourceUrlHeroProps) {
    const [copiedUrl, setCopiedUrl] = useState(false);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        } catch {
            setCopiedUrl(false);
        }
    };

    return (
        <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900/50 dark:bg-sky-950/20 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                        Alamat URL Tautan
                    </span>
                    <p className="font-mono text-sm break-all text-zinc-900 dark:text-zinc-100 font-medium">
                        {url}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={handleCopyUrl}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        {copiedUrl ? (
                            <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Salin URL</span>
                            </>
                        )}
                    </button>

                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                    >
                        <span>Buka di Tab Baru</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
