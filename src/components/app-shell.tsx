
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
  if (pathname === '/') {
    return <main className="p-4 md:p-6">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        <div className="flex items-center gap-2">
            <Link
                href="/search"
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
            href="/search"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              pathname === '/search' && 'text-primary'
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
            href="/profile"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              pathname === '/profile' && 'text-primary'
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
                  (pathname === '/language' || pathname === '/gift-card' || pathname === '/refer-and-earn' || pathname === '/terms' || pathname === '/settings') && 'text-primary'
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="rounded-r-lg">
              <SheetHeader>
                <SheetTitle>More Options</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Link href="/language" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted">
                    <Languages className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Language</span>
                </Link>
                 <Link href="/gift-card" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted">
                    <Gift className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Gift Card</span>
                </Link>
                 <Link href="/refer-and-earn" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted">
                    <HandCoins className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Refer & Earn</span>
                </Link>
                <Link href="/terms" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Terms</span>
                </Link>
                 <Link href="/settings" onClick={() => setIsSheetOpen(false)} className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted">
                    <Settings className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </footer>
    </div>
  );
}
