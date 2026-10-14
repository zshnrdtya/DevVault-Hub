import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-zinc-800 dark:bg-[#141619] dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${className}`}
        >
            {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
            ) : (
                <Moon className="h-4 w-4 text-zinc-700" />
            )}
        </button>
    );
}
