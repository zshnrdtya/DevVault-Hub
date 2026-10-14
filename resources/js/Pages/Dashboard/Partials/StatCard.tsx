import { Link } from '@inertiajs/react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    count: number;
    href: string;
    icon: LucideIcon;
    actionLabel: string;
    actionHref: string;
}

export default function StatCard({
    label,
    count,
    href,
    icon: Icon,
    actionLabel,
    actionHref,
}: StatCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-[#141619]">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            <div className="mt-3">
                <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                    {count}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
                <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                    Buka list
                    <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                    href={actionHref}
                    className="inline-flex min-h-[32px] items-center gap-1 rounded px-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                >
                    {actionLabel}
                </Link>
            </div>
        </div>
    );
}
