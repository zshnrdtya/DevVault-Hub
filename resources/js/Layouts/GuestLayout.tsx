import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Terminal } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-[#fafafa] font-mono text-zinc-900 antialiased dark:bg-[#0c0d0e] dark:text-zinc-100">
            {/* Minimalist Topbar */}
            <header className="border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-[#141619]/80 sm:px-6">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Gateway Aman
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Auth Content Area */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
                <div className="w-full max-w-md">
                    {/* Brand Emblem */}
                    <div className="mb-6 flex flex-col items-center text-center">
                        <Link href="/" className="inline-flex min-h-[44px] items-center">
                            <ApplicationLogo />
                        </Link>
                    </div>

                    {/* Terminal Window Card */}
                    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#141619]">
                        {/* Terminal Header Bar */}
                        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/60">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                <Terminal className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                                <span>vault://session.auth</span>
                            </div>
                            <div className="flex items-center text-zinc-400 dark:text-zinc-500">
                                <ShieldCheck className="h-3.5 w-3.5" />
                            </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-6 sm:p-8">
                            {children}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <footer className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
                        <p>DevVault Hub • Ruang Penyimpanan Kode & Prompt</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
