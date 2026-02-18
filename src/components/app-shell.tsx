'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  Search,
  Wand2,
  User,
  Briefcase,
  MessageCircle,
  Menu,
  Languages,
  Gift,
  HandCoins,
  FileText,
  Wallet,
  Settings,
  Package,
  Hotel,
  Bus,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch for early return paths
  if (!mounted) {
    return <main className="relative min-h-screen bg-white">{children}</main>;
  }

  if (pathname === '/') {
    return <main className="relative min-h-screen overflow-hidden">{children}</main>;
  }

  const currentTab = searchParams.get('tab');
  const isHotelActive = pathname === '/search-page' && (!currentTab || currentTab === 'hotel');
  const isBusActive = pathname === '/search-page' && currentTab === 'bus';

  const isAdmin = userProfile?.role === 'admin';
  const isStaff = userProfile?.role === 'staff';

  return (
    <div className="flex min-h-screen w-full flex-col bg-white relative overflow-hidden">
      {/* Background Lighting Blobs - Refined for White Background */}
      <div className="bg-lighting-blob bg-lighting-blob-primary" />
      <div className="bg-lighting-blob bg-lighting-blob-accent" />
      
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white/60 backdrop-blur-xl px-4 md:px-6 z-40">
        <div className="flex items-center gap-2">
            <Link
                href="/search"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
                <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/20">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className='font-black tracking-tighter italic text-xl text-foreground'>BR TRIP</span>
            </Link>
             <Link href="/wallet">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="sr-only">Wallet</span>
              </Button>
            </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
           <a href="https://wa.me/918306930595" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-9 font-black border-primary/20 hover:bg-primary text-primary hover:text-white rounded-xl transition-all uppercase text-[10px] tracking-widest italic">
                <MessageCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
            </a>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-24 bg-transparent">
         <div className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <nav className="grid h-16 grid-cols-6 items-center justify-items-center gap-1 px-2 text-[10px] font-black uppercase tracking-tighter leading-tight">
          <Link
            href="/search"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              pathname === '/search' && 'text-primary'
            )}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          
          {isAdmin ? (
            <Link
                href="/admin"
                className={cn(
                'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95 font-black text-red-500',
                pathname === '/admin' && 'text-red-600'
                )}
            >
                <ShieldAlert className="h-5 w-5" />
                <span>Admin</span>
            </Link>
          ) : isStaff ? (
            <Link
                href="/staff"
                className={cn(
                'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95 font-black text-accent',
                pathname === '/staff' && 'text-accent'
                )}
            >
                <ClipboardList className="h-5 w-5" />
                <span>Duty</span>
            </Link>
          ) : (
            <Link
                href="/search-page?tab=hotel"
                className={cn(
                'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
                isHotelActive && 'text-primary'
                )}
            >
                <Hotel className="h-5 w-5" />
                <span>Hotel</span>
            </Link>
          )}

          <Link
            href="/search-page?tab=bus"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              isBusActive && 'text-primary'
            )}
          >
            <Bus className="h-5 w-5" />
            <span>Bus</span>
          </Link>
          <Link
            href="/search"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
               pathname.startsWith('/explore') && 'text-primary'
            )}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Explore</span>
          </Link>
          <Link
            href="/destination-guides"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              pathname === '/destination-guides' && 'text-primary'
            )}
          >
            <Package className="h-5 w-5" />
            <span>Deals</span>
          </Link>
          <Link
            href="/menu"
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-all hover:text-primary active:scale-95',
              (pathname === '/menu' || pathname === '/profile' || pathname === '/admin' || pathname === '/staff') && 'text-primary'
            )}
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
