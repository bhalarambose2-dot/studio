
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  Gift,
  Handshake,
  Menu,
  Bike,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const { user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="relative min-h-screen bg-white">{children}</main>;
  }

  // Auth pages don't get the shell
  if (pathname === '/') {
    return <main className="relative min-h-screen overflow-hidden">{children}</main>;
  }

  const isCaptain = userProfile?.role === 'staff' || userProfile?.role === 'bus_owner';

  return (
    <div className="flex min-h-screen w-full flex-col bg-white relative overflow-hidden">
      {/* Background Lighting Blobs with Moonlight effect */}
      <div className="bg-lighting-blob bg-lighting-blob-primary" />
      <div className="bg-lighting-blob bg-lighting-blob-accent" />
      <div className="bg-moonlight" />
      
      <main className="flex-1 overflow-y-auto pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-xl shadow-[0_-5px_25px_rgba(0,0,0,0.1)]">
        <nav className="grid h-20 grid-cols-5 items-center justify-items-center px-1">
          <Link
            href={isCaptain ? "/staff" : "/search"}
            className={cn(
              'flex flex-col items-center gap-1 transition-all group',
              (pathname === '/search' || pathname === '/staff') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Home className={cn("h-6 w-6 transition-transform group-active:scale-90", (pathname === '/search' || pathname === '/staff') && "fill-primary/20")} />
            <span className="text-[10px] font-black uppercase tracking-tight">{isCaptain ? 'Duty' : 'Home'}</span>
          </Link>
          
          <Link
            href="/manage-bookings"
            className={cn(
              'flex flex-col items-center gap-1 transition-all group',
              pathname === '/manage-bookings' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Briefcase className={cn("h-6 w-6 transition-transform group-active:scale-90", pathname === '/manage-bookings' && "fill-primary/20")} />
            <span className="text-[10px] font-black uppercase tracking-tight">{isCaptain ? 'Earning' : 'My Safar'}</span>
          </Link>

          <div className="relative -top-4">
             <Link
                href="/destination-guides"
                className="flex flex-col items-center justify-center h-16 w-16 rounded-full bg-secondary shadow-xl shadow-secondary/30 text-white transition-transform active:scale-95 border-4 border-white"
              >
                {isCaptain ? <Bike className="h-7 w-7" /> : <Gift className="h-7 w-7" />}
                <span className="text-[8px] font-black uppercase">{isCaptain ? 'Rides' : 'Offers'}</span>
              </Link>
          </div>

          <Link
            href="/partnership"
            className={cn(
              'flex flex-col items-center gap-1 transition-all group',
              pathname === '/partnership' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Handshake className={cn("h-6 w-6 transition-transform group-active:scale-90", pathname === '/partnership' && "fill-primary/20")} />
            <span className="text-[10px] font-black uppercase tracking-tight">Support</span>
          </Link>

          <Link
            href="/menu"
            className={cn(
              'flex flex-col items-center gap-1 transition-all group',
              pathname === '/menu' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Menu className={cn("h-6 w-6 transition-transform group-active:scale-90", pathname === '/menu' && "fill-primary/20")} />
            <span className="text-[10px] font-black uppercase tracking-tight">Menu</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
