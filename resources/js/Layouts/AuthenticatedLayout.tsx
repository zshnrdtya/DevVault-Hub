import ApplicationLogo from '@/Components/ApplicationLogo';
import Breadcrumbs, { BreadcrumbItem } from '@/Components/Breadcrumbs';
import { Link, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Code2,
    FolderKanban,
    LayoutDashboard,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    Search,
    Settings,
    TerminalSquare,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import DesktopSidebar, { NavItem } from './Partials/DesktopSidebar';
import MobileBottomNav from './Partials/MobileBottomNav';
import MobileDrawer from './Partials/MobileDrawer';

interface AuthenticatedLayoutProps {
    header?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AuthenticatedLayout({
    header,
    breadcrumbs,
    children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
    const user = usePage().props.auth.user;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('devvault_sidebar_collapsed') === 'true';
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileDrawerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('devvault_sidebar_collapsed', String(next));
            }
            return next;
        });
    };

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
        {
            name: 'Settings',
            href: route('settings'),
            icon: Settings,
            active: route().current('settings*'),
        },
    ];

    const resolvedBreadcrumbs: BreadcrumbItem[] = (() => {
        if (breadcrumbs && breadcrumbs.length > 0) {
            return breadcrumbs;
        }

        if (route().current('dashboard')) {
            return [{ label: 'Dashboard' }];
        }

        const items: BreadcrumbItem[] = [{ label: 'Dashboard', href: route('dashboard') }];

        if (route().current('snippets.create')) {
            items.push({ label: 'Snippets', href: route('snippets.index') });
            items.push({ label: 'Snippet Baru' });
            return items;
        }

        if (route().current('snippets.edit')) {
            items.push({ label: 'Snippets', href: route('snippets.index') });
            items.push({ label: 'Edit' });
            return items;
        }

        if (route().current('snippets.show')) {
            items.push({ label: 'Snippets', href: route('snippets.index') });
            items.push({ label: 'Detail' });
            return items;
        }

        if (route().current('snippets.*')) {
            items.push({ label: 'Snippets' });
            return items;
        }

        if (route().current('prompts.*')) {
            items.push({ label: 'Prompts' });
            return items;
        }

        if (route().current('resources.*')) {
            items.push({ label: 'Resources' });
            return items;
        }

        if (route().current('categories.*')) {
            items.push({ label: 'Kategori' });
            return items;
        }

        if (route().current('profile.*')) {
            items.push({ label: 'Profil Pengguna' });
            return items;
        }

        if (route().current('settings*')) {
            items.push({ label: 'Settings' });
            return items;
        }

        return items;
    })();

    return (
        <div className="min-h-screen bg-[#fafafa] font-mono text-zinc-900 antialiased dark:bg-[#0c0d0e] dark:text-zinc-100">
            <DesktopSidebar
                navItems={navItems}
                user={user}
                collapsed={sidebarCollapsed}
            />

            <MobileDrawer
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                navItems={navItems}
                user={user}
            />

            <div
                className={`flex min-h-screen flex-col transition-all duration-200 ${
                    sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
                }`}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur dark:border-zinc-800 dark:bg-[#141619]/95 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2.5">
                        {/* Mobile Drawer Trigger (< 1024px) */}
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

                        {/* Desktop Sidebar Minimize / Expand Toggle (>= 1024px) */}
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="hidden lg:inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                            title={sidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
                            aria-label={sidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
                        >
                            {sidebarCollapsed ? (
                                <PanelLeftOpen className="h-4 w-4" />
                            ) : (
                                <PanelLeftClose className="h-4 w-4" />
                            )}
                        </button>

                        {/* Breadcrumbs Trail */}
                        <div className="hidden sm:block">
                            <Breadcrumbs items={resolvedBreadcrumbs} />
                        </div>
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

                {/* Mobile Breadcrumb Subheader */}
                <div className="border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-[#141619] sm:hidden">
                    <Breadcrumbs items={resolvedBreadcrumbs} />
                </div>

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
