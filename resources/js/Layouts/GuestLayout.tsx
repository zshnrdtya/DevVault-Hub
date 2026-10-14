import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#fafafa] pt-6 font-mono sm:justify-center sm:pt-0 dark:bg-[#0c0d0e]">
            <div>
                <Link href="/">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white px-6 py-5 shadow-xs sm:max-w-md dark:border-zinc-800 dark:bg-[#141619]">
                {children}
            </div>
        </div>
    );
}
