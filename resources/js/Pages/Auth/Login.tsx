import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <LogIn className="h-5 w-5" />
                    <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Masuk ke Vault
                    </h1>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Akses koleksi snippet kode, prompt, dan bookmark Anda.
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

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Kata Sandi" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="inline-flex min-h-[44px] items-center text-xs font-medium text-sky-700 transition-colors hover:text-sky-800 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Masukkan kata sandi"
                            className="pl-9 pr-11"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:text-zinc-200"
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="pt-1">
                    <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span>Ingat sesi di perangkat ini</span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full text-xs font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span>Memproses Autentikasi...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Masuk ke Akun</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        )}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 border-t border-zinc-200 pt-5 text-center text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                <span>Belum memiliki akun? </span>
                <Link
                    href={route('register')}
                    className="inline-flex min-h-[44px] items-center font-semibold text-sky-700 transition-colors hover:text-sky-800 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                >
                    Daftar akun baru
                </Link>
            </div>
        </GuestLayout>
    );
}
