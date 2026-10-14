import { Link } from '@inertiajs/react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-1 pt-4">
            {links.map((link, idx) => {
                if (!link.url) {
                    return (
                        <span
                            key={idx}
                            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded px-3 text-xs text-zinc-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={idx}
                        href={link.url}
                        preserveScroll
                        className={`inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded px-3 text-xs font-medium transition-colors ${
                            link.active
                                ? 'bg-sky-700 font-bold text-white dark:bg-sky-600'
                                : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
