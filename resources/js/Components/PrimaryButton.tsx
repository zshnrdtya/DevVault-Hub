import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex min-h-[44px] items-center justify-center rounded-md bg-sky-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus-visible:ring-offset-zinc-900 ${
                    disabled ? 'opacity-50' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
