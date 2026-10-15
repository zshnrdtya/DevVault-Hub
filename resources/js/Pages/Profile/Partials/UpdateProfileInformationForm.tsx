import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, Mail, Save, User } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                    <User className="h-5 w-5" />
                    <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Informasi Profil
                    </h2>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Perbarui informasi identitas profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <User className="h-4 w-4" />
                        </div>
                        <TextInput
                            id="name"
                            className="pl-9"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Nama Lengkap Anda"
                        />
                    </div>
                    <InputError className="mt-1.5" message={errors.name} />
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
                            className="pl-9"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="nama@domain.com"
                        />
                    </div>
                    <InputError className="mt-1.5" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800/60 dark:bg-amber-950/40">
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1.5 inline-flex min-h-[44px] items-center font-semibold text-sky-700 underline hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <PrimaryButton
                        disabled={processing}
                        className="text-xs font-semibold"
                    >
                        {processing ? (
                            <span>Menyimpan...</span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <Save className="h-3.5 w-3.5" />
                                <span>Simpan Profil</span>
                            </span>
                        )}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-200"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                            <span>Profil berhasil diperbarui.</span>
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
