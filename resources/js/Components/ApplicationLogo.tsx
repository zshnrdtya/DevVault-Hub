import { Terminal } from 'lucide-react';

export default function ApplicationLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 font-sans font-bold tracking-tight ${className}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-sky-400 dark:bg-zinc-100 dark:text-sky-600">
                <Terminal className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Dev<span className="text-sky-600 dark:text-sky-400">Vault</span>
                </span>
                <span className="font-mono text-[10px] font-normal text-zinc-500 dark:text-zinc-400">
                    hub
                </span>
            </div>
        </div>
    );
}
