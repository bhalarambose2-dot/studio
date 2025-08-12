'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Plane,
  Wand2,
  BookOpenCheck,
  Globe,
  CircleUserRound,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/', label: 'Search & Book', icon: Plane },
  { href: '/itinerary-builder', label: 'Itinerary Builder', icon: Wand2 },
  { href: '/manage-bookings', label: 'Manage Bookings', icon: BookOpenCheck },
  { href: '/destination-guides', label: 'Destination Guides', icon: Globe },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
                <Briefcase className="text-primary-foreground" />
            </div>
          <h2 className="text-xl font-semibold font-headline text-foreground group-data-[collapsible=icon]:hidden">
            BR TRIP
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  asChild
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-3 p-2 rounded-md transition-colors">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="person smiling"/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-foreground">User</span>
                <span className="text-xs text-muted-foreground">user@email.com</span>
            </div>
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        variant={isMobile ? 'sidebar' : 'inset'}
        className="bg-card/80 backdrop-blur-sm"
      >
        {sidebarContent}
      </Sidebar>
      <SidebarInset>
        <header className={cn("flex items-center justify-between p-2 md:hidden", isMobile ? "sticky top-0 z-40 bg-background/80 backdrop-blur-sm" : "")}>
           <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
                <Briefcase className="text-primary-foreground" />
            </div>
             <h2 className="text-lg font-semibold font-headline text-foreground">
                BR TRIP
             </h2>
           </div>
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" />
          </SidebarTrigger>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
