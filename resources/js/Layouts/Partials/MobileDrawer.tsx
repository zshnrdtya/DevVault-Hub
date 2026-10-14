import ApplicationLogo from '@/Components/ApplicationLogo';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogOut, User as UserIcon, X } from 'lucide-react';
import { NavItem } from './DesktopSidebar';

interface MobileDrawerProps {
    open: boolean;
    onClose: () => void;
    navItems: NavItem[];
    user: User;
}

export default function MobileDrawer({
    open,
    onClose,
    navItems,
    user,
}: MobileDrawerProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />
            <div className="fixed inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619]">
                <div className="flex items-center justify-between pb-4">
                    <ApplicationLogo />
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        aria-label="Tutup Menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm font-medium ${
                                    item.active
                                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 font-semibold'
                                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
                    <div className="flex items-center justify-between rounded-md border border-zinc-200 p-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                {user.name}
                            </p>
                            <p className="truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                                {user.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                aria-label="Profil"
                            >
                                <UserIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
                                aria-label="Keluar"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
