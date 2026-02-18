
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
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
  Hotel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show nav on the root auth page
  if (pathname === '/') {
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 z-40">
        <div className="flex items-center gap-2">
            <Link
                href="/search"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
                <Briefcase className="h-6 w-6 text-primary" />
                <span className='font-bold tracking-tight'>BR Trip</span>
            </Link>
             <Link href="/wallet">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="sr-only">Wallet</span>
              </Button>
            </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
           <a href="tel:8306930595">
              <Button variant="outline" size="sm" className="h-9 font-medium">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </a>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-24 bg-[#FAF9F6]">
         <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md">
        <nav className="grid h-16 grid-cols-5 items-center justify-items-center gap-1 px-2 text-sm font-medium">
          <Link
            href="/search"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              pathname === '/search' && 'text-primary'
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>
           <Link
            href="/search-page"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              pathname === '/search-page' && 'text-primary'
            )}
          >
            <Hotel className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Hotel</span>
          </Link>
          <Link
            href="/search"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
               pathname.startsWith('/explore') && 'text-primary'
            )}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Explore</span>
          </Link>
          <Link
            href="/destination-guides"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              pathname === '/destination-guides' && 'text-primary'
            )}
          >
            <Package className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Packages</span>
          </Link>
          <Link
            href="/menu"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              (pathname === '/menu' || pathname === '/language' || pathname === '/gift-card' || pathname === '/refer-and-earn' || pathname === '/terms' || pathname === '/settings' || pathname === '/partnership' || pathname === '/profile') && 'text-primary'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-semibold">More</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
