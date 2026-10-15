import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, KeyRound, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <KeyRound className="h-5 w-5" />
                    <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Atur Ulang Kata Sandi
                    </h1>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Masukkan email terdaftar Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="pengembang@devvault.io"
                            className="pl-9"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full text-xs font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span>Mengirim Tautan...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Kirim Tautan Reset</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        )}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 border-t border-zinc-200 pt-5 text-center text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                <Link
                    href={route('login')}
                    className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-sky-700 transition-colors hover:text-sky-800 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Kembali ke halaman masuk</span>
                </Link>
            </div>
        </GuestLayout>
    );
}
