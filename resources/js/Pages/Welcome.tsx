import ApplicationLogo from '@/Components/ApplicationLogo';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bookmark,
    Check,
    Code2,
    Copy,
    KeyRound,
    Sparkles,
    Star,
    TerminalSquare,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    auth,
}: PageProps) {
    const [copiedSnippet, setCopiedSnippet] = useState(false);

    const sampleCode = `// DevVault: Simpan sekali, temukan dalam hitungan detik
public function scopeForUser(Builder $query, int $userId): void
{
    $query->where('user_id', $userId);
}`;

    const handleCopySample = () => {
        navigator.clipboard.writeText(sampleCode);
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-mono text-zinc-900 antialiased dark:bg-[#0c0d0e] dark:text-zinc-100 flex flex-col justify-between">
            <Head title="DevVault: Personal Developer Hub" />

            {/* Navbar */}
            <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur dark:border-zinc-800 dark:bg-[#141619]/90 sm:px-6 lg:px-8">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo />
                    </Link>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                            >
                                <span>Buka Dashboard</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('login')}
                                    className="inline-flex min-h-[40px] items-center rounded-md px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                                >
                                    <span>Daftar Akun</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-300">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Personal Developer Hub & Second Brain</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                        Simpan sekali, temukan dalam{' '}
                        <span className="text-sky-700 dark:text-sky-400">hitungan detik.</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
                        Pusat pengelolaan mandiri untuk code snippet, prompt AI, dan resource bookmark harian Anda. Terisolasi per user, cepat dicari, dan siap disalin dengan satu klik.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex min-h-[48px] items-center gap-2 rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                            >
                                <span>Masuk ke Dashboard</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-flex min-h-[48px] items-center gap-2 rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                                >
                                    <span>Masuk ke Vault</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex min-h-[48px] items-center rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-[#141619] dark:text-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    Buat Akun Baru
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Quick Demo Credentials Info */}
                    {!auth.user && (
                        <div className="mx-auto max-w-md rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                            <div className="flex items-center justify-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                                <KeyRound className="h-3.5 w-3.5" />
                                <span>Akun Uji Demo Siap Pakai:</span>
                            </div>
                            <p className="mt-1 font-mono text-[11px]">
                                Email: <span className="text-zinc-900 dark:text-zinc-100 font-bold">test@example.com</span> · Password: <span className="text-zinc-900 dark:text-zinc-100 font-bold">password</span>
                            </p>
                        </div>
                    )}

                    {/* Interactive Code Preview Card */}
                    <div className="pt-6">
                        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-200 bg-white text-left dark:border-zinc-800 dark:bg-[#141619] overflow-hidden">
                            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-[#101114]">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                    </div>
                                    <span className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-400 ml-2">
                                        Snippet.php
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopySample}
                                    className="inline-flex min-h-[32px] items-center gap-1 rounded border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    {copiedSnippet ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5" />
                                            <span>Salin Kode</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="p-4 font-mono text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200 overflow-x-auto">
                                <pre>
                                    <code>{sampleCode}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* 3 Pillars of DevVault */}
                    <div className="grid grid-cols-1 gap-4 pt-10 text-left sm:grid-cols-3">
                        {/* Snippets */}
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] space-y-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                <Code2 className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Code Snippet Manager
                            </h2>
                            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Simpan pattern query, form, hook, dan helper function favorit dengan syntax highlight dan tombol copy instan.
                            </p>
                        </div>

                        {/* Prompts */}
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] space-y-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                <TerminalSquare className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Prompt AI Library
                            </h2>
                            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Simpan instruksi prompt debugging, refactoring, dan analisis requirement agar tidak hilang di riwayat chat.
                            </p>
                        </div>

                        {/* Resources */}
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] space-y-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                <Bookmark className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Resource Bookmark
                            </h2>
                            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Kumpulkan link dokumentasi resmi, repositori GitHub, dan tools penting beserta catatan pribadi Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-[#141619]">
                <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">DevVault</span>
                        <span>· Personal developer hub & second brain</span>
                    </div>
                    <div>
                        <span>Dibuat dengan Laravel 13, React, Inertia, dan Tailwind CSS</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
