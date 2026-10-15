import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi" />

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <ShieldAlert className="h-5 w-5" />
                    <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Area Aman DevVault
                    </h1>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Ini adalah area terlindungi. Masukkan kata sandi akun Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
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
                            placeholder="Masukkan kata sandi"
                            className="pl-9 pr-11"
                            isFocused={true}
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

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full text-xs font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span>Mengonfirmasi...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Konfirmasi Tindakan</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
