'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const { user } = useFirebase();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname === '/') {
    return <main className="relative min-h-screen bg-white">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA] relative">
      <main className="flex-1 overflow-y-auto pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
        <nav className="flex h-16 items-center justify-around px-4">
          <Link
            href="/search"
            className={cn(
              'flex flex-col items-center gap-1 transition-all',
              pathname === '/search' ? 'text-primary' : 'text-slate-400'
            )}
          >
            <Home className="h-6 w-6" />
          </Link>
          
          <Link
            href="/manage-bookings"
            className={cn(
              'flex flex-col items-center gap-1 transition-all',
              pathname === '/manage-bookings' ? 'text-primary' : 'text-slate-400'
            )}
          >
            <Briefcase className="h-6 w-6" />
          </Link>

          <Link
            href="/profile"
            className={cn(
              'flex flex-col items-center gap-1 transition-all',
              pathname === '/profile' ? 'text-primary' : 'text-slate-400'
            )}
          >
            <User className="h-6 w-6" />
          </Link>
        </nav>
      </footer>
    </div>
  );
}
