import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, ShieldAlert, UserCheck } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;
    const isVerified = user.email_verified_at !== null;

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Profil Pengguna' },
            ]}
        >
            <Head title="Pengaturan Profil" />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header Profile Summary Hero */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-[#141619] sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-sky-400 dark:bg-zinc-800 dark:text-sky-400">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-xl">
                                        {user.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                        <UserCheck className="h-3 w-3" />
                                        Developer
                                    </span>
                                </div>
                                <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div>
                            {isVerified ? (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Email Terverifikasi</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>Belum Terverifikasi</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 1: Update Profile Information */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-[#141619] sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-2xl"
                    />
                </div>

                {/* Section 2: Update Password */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-[#141619] sm:p-8">
                    <UpdatePasswordForm className="max-w-2xl" />
                </div>

                {/* Section 3: Delete Account (Danger Zone) */}
                <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-xs dark:border-rose-950/60 dark:bg-[#141619] sm:p-8">
                    <DeleteUserForm className="max-w-2xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
