import { Check, Moon, Monitor, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOption {
    id: ThemeMode;
    label: string;
    description: string;
    icon: typeof Sun;
}

export default function ThemeSetting() {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        if (typeof window === 'undefined') return 'system';
        const saved = localStorage.getItem('theme') as ThemeMode;
        return saved === 'light' || saved === 'dark' || saved === 'system'
            ? saved
            : 'system';
    });

    const applyTheme = (mode: ThemeMode) => {
        const root = document.documentElement;
        localStorage.setItem('theme', mode);
        setTheme(mode);

        if (mode === 'dark') {
            root.classList.add('dark');
        } else if (mode === 'light') {
            root.classList.remove('dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    // Listen to OS system theme changes when in 'system' mode
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const options: ThemeOption[] = [
        {
            id: 'light',
            label: 'Mode Terang',
            description: 'Latar cerah untuk lingkungan kerja dengan pencahayaan terang.',
            icon: Sun,
        },
        {
            id: 'dark',
            label: 'Mode Gelap',
            description: 'Latar gelap pekat untuk kenyamanan membaca kode di malam hari.',
            icon: Moon,
        },
        {
            id: 'system',
            label: 'Sistem (Otomatis)',
            description: 'Menyesuaikan tema secara otomatis mengikuti preferensi OS Anda.',
            icon: Monitor,
        },
    ];

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141619] sm:p-6">
            <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Tema Tampilan Workspace
                </h2>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Pilih skema warna yang paling nyaman untuk mata Anda saat bekerja di DevVault.
                </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => applyTheme(opt.id)}
                            className={`flex min-h-[44px] flex-col justify-between rounded-lg border p-4 text-left transition-all ${
                                isSelected
                                    ? 'border-sky-600 bg-sky-50/60 dark:border-sky-500 dark:bg-sky-950/40 ring-1 ring-sky-600 dark:ring-sky-500'
                                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-md border ${
                                        isSelected
                                            ? 'border-sky-300 bg-white text-sky-700 dark:border-sky-800 dark:bg-zinc-900 dark:text-sky-300'
                                            : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                {isSelected && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-700 text-white dark:bg-sky-600">
                                        <Check className="h-3 w-3 stroke-[3]" />
                                    </span>
                                )}
                            </div>

                            <div className="mt-3">
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                    {opt.label}
                                </p>
                                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {opt.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
