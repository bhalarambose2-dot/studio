

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plane,
  Wand2,
  BookOpenCheck,
  Globe,
  Briefcase,
  PanelLeft,
  Home,
  Phone,
  User,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const navItems = [
  { href: '/trip', label: 'Trip', icon: Plane },
  { href: '/search-page', label: 'Hotels & Cars', icon: Wand2 },
  { href: '/manage-bookings', label: 'Manage Bookings', icon: BookOpenCheck },
  { href: '/destination-guides', label: 'Destination Guides', icon: Globe },
  { href: '/menu', label: 'Menu', icon: Menu },
  { href: '/profile', label: 'Profile', icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const mobileNav = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <PanelLeft />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
             <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg">
                    <Briefcase className="text-primary-foreground" />
                </div>
              <h2 className="text-xl font-semibold font-headline text-foreground">
                BR trip
              </h2>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
           <Link href="/" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", pathname === '/' && "text-primary bg-muted")}>
              <Home className="h-4 w-4" />
              Home
            </Link>
          {navItems.map((item) => (
             <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", pathname === item.href && "text-primary bg-muted")}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  if (pathname === '/') {
    return <main className="p-4 md:p-6">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="sr-only">BR Trip</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("transition-colors hover:text-foreground", pathname === item.href ? "text-foreground" : "text-muted-foreground")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {isMobile && <div className="md:hidden">{mobileNav}</div>}
         <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial" />
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:8769930595" className="font-semibold text-sm">8769930595</a>
            </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
