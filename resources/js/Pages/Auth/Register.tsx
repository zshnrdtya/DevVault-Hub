import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Buat Akun Baru" />

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <UserPlus className="h-5 w-5" />
                    <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Buat Akun Baru
                    </h1>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Mulai simpan dan kelola snippet, prompt, serta bookmark developer Anda.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <User className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            placeholder="cth. Raditya Rai Zeeshan"
                            className="pl-9"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

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
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" />
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            className="pl-9 pr-11"
                            autoComplete="new-password"
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

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi"
                    />
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi"
                            className="pl-9 pr-11"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:text-zinc-200"
                            aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full text-xs font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span>Mendaftarkan Akun...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Daftar Akun Baru</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        )}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 border-t border-zinc-200 pt-5 text-center text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                <span>Sudah memiliki akun? </span>
                <Link
                    href={route('login')}
                    className="inline-flex min-h-[44px] items-center font-semibold text-sky-700 transition-colors hover:text-sky-800 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                >
                    Masuk di sini
                </Link>
            </div>
        </GuestLayout>
    );
}
