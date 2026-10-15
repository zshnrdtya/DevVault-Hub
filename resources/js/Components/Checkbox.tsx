import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded border-zinc-300 text-sky-600 shadow-xs transition-colors focus:ring-2 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-sky-400 dark:focus:ring-offset-zinc-900 ' +
                className
            }
        />
    );
}
