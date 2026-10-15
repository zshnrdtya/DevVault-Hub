import axios from 'axios';
import { AlertCircle, Check, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export interface AiGenerateResult {
    title?: string;
    language?: string;
    category_id?: number | string;
    category_name?: string;
    description?: string;
    note?: string;
    tags?: string[];
}

interface AiGenerateButtonProps {
    type: 'snippet' | 'prompt' | 'resource';
    content: string;
    onSuccess: (data: AiGenerateResult) => void;
    className?: string;
    buttonLabel?: string;
}

export default function AiGenerateButton({
    type,
    content,
    onSuccess,
    className = '',
    buttonLabel = 'Auto-Deteksi AI',
}: AiGenerateButtonProps) {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const triggerAi = async () => {
        const trimmed = (content || '').trim();

        if (trimmed.length < 5) {
            setNotification({
                type: 'error',
                message:
                    type === 'resource'
                        ? 'Masukkan URL atau tautan terlebih dahulu.'
                        : type === 'prompt'
                        ? 'Tuliskan isi prompt terlebih dahulu.'
                        : 'Tempelkan kode snippet terlebih dahulu.',
            });
            setTimeout(() => setNotification(null), 4000);
            return;
        }

        setLoading(true);
        setNotification(null);

        try {
            const response = await axios.post(route('ai.generate'), {
                type,
                content: trimmed,
            });

            if (response.data?.success && response.data?.data) {
                onSuccess(response.data.data);
                setNotification({
                    type: 'success',
                    message: 'Metadata berhasil di-generate oleh Gemini AI!',
                });
                setTimeout(() => setNotification(null), 4000);
            } else {
                throw new Error('Respon tidak valid dari server.');
            }
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.message ||
                'Gagal menganalisis konten dengan AI. Periksa koneksi atau coba lagi.';
            setNotification({
                type: 'error',
                message: errorMsg,
            });
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`relative inline-flex flex-col items-start ${className}`}>
            <button
                type="button"
                onClick={triggerAi}
                disabled={loading}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-800 shadow-xs transition-colors hover:border-sky-400 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:border-sky-700 dark:hover:bg-sky-900/60"
                title="Gunakan AI untuk mendeteksi judul, bahasa, kategori, deskripsi, dan tag secara otomatis"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin text-sky-600 dark:text-sky-400" />
                        <span>Menganalisis Konten...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        <span>{buttonLabel}</span>
                    </>
                )}
            </button>

            {/* Status Feedback Notification */}
            {notification && (
                <div
                    className={`mt-2 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        notification.type === 'success'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}
                >
                    {notification.type === 'success' ? (
                        <Check className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}
        </div>
    );
}
