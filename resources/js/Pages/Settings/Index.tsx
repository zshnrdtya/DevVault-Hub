import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Settings as SettingsIcon, ShieldCheck, User as UserIcon } from 'lucide-react';
import ThemeSetting from './Partials/ThemeSetting';

interface SettingsProps {
    user: User;
}

export default function Index({ user }: SettingsProps) {
    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Settings' },
            ]}
        >
            <Head title="Pengaturan Workspace - DevVault" />

            <div className="space-y-6">
                {/* Header Title */}
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                        <SettingsIcon className="h-4 w-4" />
                        <span>Workspace Settings</span>
                    </div>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Pengaturan Workspace
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Kelola tema tampilan antarmuka dan preferensi lingkungan kerja Anda di DevVault.
                    </p>
                </div>

                {/* Theme Selector (Light, Dark, Auto/System) */}
                <ThemeSetting />

                {/* Account & Security Link Card */}
                <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    Profil & Keamanan Akun
                                </h2>
                                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    Masuk sebagai <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.email}</span>. Perbarui nama, kata sandi, atau hapus akun.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route('profile.edit')}
                            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                            <span>Kelola Akun</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>

                {/* System Information */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                            Data Anda diisolasi per akun pengguna (user-scoped database queries).
                        </span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
