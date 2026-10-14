import { Link } from '@inertiajs/react';
import { NavItem } from './DesktopSidebar';

interface MobileBottomNavProps {
    items: NavItem[];
}

export default function MobileBottomNav({ items }: MobileBottomNavProps) {
    return (
        <nav
            className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-[#141619]/95 lg:hidden"
            aria-label="Navigasi Bawah"
        >
            {items.map((item) => {
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
    );
}
