import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Code2,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Search,
    TerminalSquare,
    User as UserIcon,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

interface NavItem {
    name: string;
    href: string;
    icon: typeof LayoutDashboard;
    active: boolean;
}

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    // Close drawer when route changes or window resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileDrawerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: route().current('dashboard'),
        },
        {
            name: 'Snippets',
            href: route('snippets.index'),
            icon: Code2,
            active: route().current('snippets.*'),
        },
        {
            name: 'Prompts',
            href: route('prompts.index'),
            icon: TerminalSquare,
            active: route().current('prompts.*'),
        },
        {
            name: 'Resources',
            href: route('resources.index'),
            icon: Bookmark,
            active: route().current('resources.*'),
        },
        {
            name: 'Kategori',
            href: route('categories.index'),
            icon: FolderKanban,
            active: route().current('categories.*'),
        },
    ];

    // Core 4 items for mobile bottom navigation
    const bottomNavItems = navItems.slice(0, 4);

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 antialiased dark:bg-[#0c0d0e] dark:text-zinc-100">
            {/* Desktop Left Sidebar */}
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

            {/* Mobile Drawer (Slide-Over) */}
            {mobileDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileDrawerOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#141619]">
                        <div className="flex items-center justify-between pb-4">
                            <ApplicationLogo />
                            <button
                                type="button"
                                onClick={() => setMobileDrawerOpen(false)}
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
                                        onClick={() => setMobileDrawerOpen(false)}
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
                            <div className="flex items-center justify-between pb-3">
                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    Tema
                                </span>
                                <ThemeToggle />
                            </div>

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
            )}

            {/* Desktop & Mobile Main Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur dark:border-zinc-800 dark:bg-[#141619]/95 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileDrawerOpen(true)}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:hidden"
                            aria-label="Buka Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="lg:hidden">
                            <ApplicationLogo />
                        </div>
                        {header && (
                            <div className="hidden lg:block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Global Search Pill (Shortcut Ctrl+K) */}
                        <div className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                            <Search className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-zinc-500">Cari item...</span>
                            <kbd className="ml-2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                ⌘K
                            </kbd>
                        </div>

                        {/* Quick CTA "+ Baru" */}
                        <Link
                            href={route('snippets.create')}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                        >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span className="hidden xs:inline">Snippet Baru</span>
                        </Link>
                    </div>
                </header>

                {/* Mobile Subheader (if header prop provided) */}
                {header && (
                    <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-[#141619] lg:hidden">
                        {header}
                    </div>
                )}

                {/* Main Content Body */}
                <main className="flex-1 pb-20 lg:pb-10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar (< 640px) */}
            <nav
                className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-[#141619]/95 lg:hidden"
                aria-label="Navigasi Bawah"
            >
                {bottomNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                                item.active
                                    ? 'text-sky-600 dark:text-sky-400 font-semibold'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="text-[10px] tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
