import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    LogOut,
    User as UserIcon,
} from 'lucide-react';

export interface NavItem {
    name: string;
    href: string;
    icon: typeof LayoutDashboard;
    active: boolean;
}

interface DesktopSidebarProps {
    navItems: NavItem[];
    user: User;
}

export default function DesktopSidebar({ navItems, user }: DesktopSidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#141619] lg:flex">
            <div className="flex h-16 shrink-0 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
                <Link href={route('dashboard')} className="flex items-center gap-2">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-4">
                <nav className="space-y-1">
                    <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                        Workspace
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
                                    item.active
                                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 font-semibold'
                                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                                }`}
                            >
                                <Icon
                                    className={`h-4 w-4 shrink-0 transition-colors ${
                                        item.active
                                            ? 'text-sky-600 dark:text-sky-400'
                                            : 'text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                                    }`}
                                />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <div className="flex items-center justify-between px-2 pb-3">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Tema Antarmuka
                        </span>
                        <ThemeToggle />
                    </div>

                    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {user.name}
                                </p>
                                <p className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                                    {user.email}
                                </p>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                title="Edit Profil"
                                className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            >
                                <UserIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                title="Keluar"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-rose-100 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
