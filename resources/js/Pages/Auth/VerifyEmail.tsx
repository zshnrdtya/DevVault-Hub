import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, LogOut, MailCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <MailCheck className="h-5 w-5" />
                    <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Verifikasi Alamat Email
                    </h1>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Terima kasih telah mendaftar. Silakan klik tautan verifikasi yang baru saja kami kirimkan ke email Anda untuk mengaktifkan akun.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda gunakan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <PrimaryButton
                        className="w-full text-xs font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span>Mengirim Ulang...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Kirim Ulang Email Verifikasi</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        )}
                    </PrimaryButton>
                </div>

                <div className="pt-2 text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Keluar dari Akun</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
