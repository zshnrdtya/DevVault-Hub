import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Code2,
    FolderKanban,
    LayoutDashboard,
    Menu,
    Plus,
    Search,
    TerminalSquare,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import DesktopSidebar, { NavItem } from './Partials/DesktopSidebar';
import MobileBottomNav from './Partials/MobileBottomNav';
import MobileDrawer from './Partials/MobileDrawer';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-[#fafafa] font-mono text-zinc-900 antialiased dark:bg-[#0c0d0e] dark:text-zinc-100">
            <DesktopSidebar navItems={navItems} user={user} />

            <MobileDrawer
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                navItems={navItems}
                user={user}
            />

            <div className="lg:pl-64 flex flex-col min-h-screen">
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
                        <div className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                            <Search className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-zinc-500">Cari item...</span>
                            <kbd className="ml-2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                ⌘K
                            </kbd>
                        </div>

                        <Link
                            href={route('snippets.create')}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                        >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span className="hidden xs:inline">Snippet Baru</span>
                        </Link>
                    </div>
                </header>

                {header && (
                    <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-[#141619] lg:hidden">
                        {header}
                    </div>
                )}

                <main className="flex-1 pb-20 lg:pb-10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>

            <MobileBottomNav items={navItems.slice(0, 4)} />
        </div>
    );
}
