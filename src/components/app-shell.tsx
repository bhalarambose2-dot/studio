
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpenCheck,
  Search,
  Wand2,
  User,
  Briefcase,
  Phone,
  Menu,
  Languages,
  Gift,
  HandCoins,
  FileText,
  Wallet,
  Settings,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

const navItems = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/itinerary-builder', label: 'Itinerary', icon: Wand2 },
  { href: '/manage-bookings', label: 'My Trips', icon: BookOpenCheck },
  { href: '/profile', label: 'Profile', icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Don't show nav on the root auth page
  if (pathname === '/auth') {
    return <main className="p-4 md:p-6">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        <div className="flex items-center gap-2">
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
                <Briefcase className="h-6 w-6 text-primary" />
                <span className='font-bold'>BR Trip</span>
            </Link>
             <Link href="/wallet">
              <Button variant="ghost" size="icon">
                <Wallet className="h-6 w-6 text-primary" />
                <span className="sr-only">Wallet</span>
              </Button>
            </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <a href="tel:8769930595" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <Phone className="h-4 w-4" />
                <span>8769930595</span>
            </a>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-24">
         <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
        <nav className="grid h-16 grid-cols-5 items-center justify-items-center gap-4 px-4 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              pathname === '/' && 'text-primary'
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
           <Link
            href="/itinerary-builder"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              pathname === '/itinerary-builder' && 'text-primary'
            )}
          >
            <Wand2 className="h-5 w-5" />
            <span className="text-xs">Itinerary</span>
          </Link>
          <Link
            href="/manage-bookings"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              pathname === '/manage-bookings' && 'text-primary'
            )}
          >
            <BookOpenCheck className="h-5 w-5" />
            <span className="text-xs">My Trips</span>
          </Link>
          <Link
            href="/destination-guides"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              pathname === '/destination-guides' && 'text-primary'
            )}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">Packages</span>
          </Link>
          <Link
            href="/menu"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              (pathname === '/menu' || pathname === '/language' || pathname === '/gift-card' || pathname === '/refer-and-earn' || pathname === '/terms' || pathname === '/settings') && 'text-primary'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">More</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
