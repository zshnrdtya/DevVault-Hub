import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Eye, EyeOff, Lock, Trash2 } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Trash2 className="h-5 w-5" />
                    <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Hapus Akun Pengguna
                    </h2>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Tindakan ini tidak dapat dibatalkan. Seluruh data vault, snippet kode, bookmark, dan prompt Anda akan dihapus secara permanen.
                </p>
            </header>

            <div>
                <DangerButton onClick={confirmUserDeletion} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Hapus Akun Saya</span>
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8">
                    <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/60">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Konfirmasi Penghapusan Akun
                            </h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Area Verifikasi Keamanan Akun
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
                        Apakah Anda yakin ingin menghapus akun ini secara permanen? Masukkan kata sandi akun Anda untuk mengonfirmasi tindakan ini.
                    </p>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="delete_password"
                            value="Kata Sandi Anda"
                        />

                        <div className="relative mt-1.5">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <TextInput
                                id="delete_password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="pl-9 pr-11"
                                isFocused
                                placeholder="Masukkan kata sandi untuk verifikasi"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:text-zinc-200"
                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-1.5"
                        />
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton disabled={processing} className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            <span>{processing ? 'Menghapus...' : 'Ya, Hapus Akun Permanen'}</span>
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
