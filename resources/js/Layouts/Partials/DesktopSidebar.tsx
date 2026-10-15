import ApplicationLogo from '@/Components/ApplicationLogo';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ExternalLink,
    Globe,
    LayoutDashboard,
    LogOut,
    Terminal,
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
    collapsed: boolean;
}

export default function DesktopSidebar({
    navItems,
    user,
    collapsed,
}: DesktopSidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-zinc-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-[#141619] lg:flex ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            {/* Sidebar Header / Logo */}
            <div
                className={`flex h-14 shrink-0 items-center border-b border-zinc-200 dark:border-zinc-800 ${
                    collapsed ? 'justify-center px-2' : 'px-6'
                }`}
            >
                <Link href={route('dashboard')} className="flex items-center gap-2">
                    {collapsed ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-sky-400 dark:bg-zinc-100 dark:text-sky-600">
                            <Terminal className="h-4 w-4 stroke-[2.5]" />
                        </div>
                    ) : (
                        <ApplicationLogo />
                    )}
                </Link>
            </div>

            {/* Navigation Body */}
            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-4">
                <nav className="space-y-1">
                    {!collapsed && (
                        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            Workspace
                        </div>
                    )}
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={`group flex min-h-[44px] items-center rounded-md text-sm font-medium transition-colors duration-150 ${
                                    collapsed
                                        ? 'justify-center px-2'
                                        : 'gap-3 px-3'
                                } ${
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
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Bottom: Live View Page & User Profile */}
                <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800 space-y-2">
                    {/* Live View Page */}
                    {collapsed ? (
                        <div className="flex justify-center">
                            <Link
                                href="/"
                                title="Live View Page"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-sky-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-sky-400"
                            >
                                <Globe className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/"
                            title="Buka Halaman Utama (Live View)"
                            className="group flex min-h-[38px] items-center justify-between rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-sky-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-sky-400"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Globe className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-sky-600 dark:text-zinc-400 dark:group-hover:text-sky-400" />
                                <span className="truncate">Live View Page</span>
                            </div>
                            <ExternalLink className="h-3 w-3 shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                        </Link>
                    )}

                    {collapsed ? (
                        <div className="flex flex-col items-center gap-2 pt-1">
                            <Link
                                href={route('profile.edit')}
                                title={`Profil (${user.name})`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            >
                                <UserIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                title="Keluar"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-rose-100 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </aside>
    );
}
