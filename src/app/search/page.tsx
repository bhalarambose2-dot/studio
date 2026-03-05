'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Wallet, 
  ChevronRight, 
  Hotel, 
  Train, 
  Bus, 
  History,
  Bike,
  Star,
  Zap,
  Ticket,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function SearchPage() {
  const { firestore, user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);

  const categories = [
    { name: 'Hotel Booking', icon: Hotel, href: '/search-page?tab=hotel', bg: 'bg-blue-600' },
    { name: 'Bus Tickets', icon: Bus, href: '/search-page?tab=bus', bg: 'bg-blue-700' },
    { name: 'Train Tickets', icon: Train, href: '/search-page?tab=train', bg: 'bg-blue-800' },
    { name: 'Bike Ride', icon: Bike, href: '/search-page?tab=bike', bg: 'bg-blue-900' },
  ];

  const deals = [
    { title: "25% OFF", sub: "ON HOTELS", color: "bg-blue-500", icon: Hotel },
    { title: "FLAT 100 OFF", sub: "ON TRAINS", color: "bg-blue-600", icon: Train },
    { title: "SPECIAL DEAL", sub: "ON BUSES", color: "bg-orange-500", icon: Bus },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FA] -mt-8 -mx-4 md:-mx-8">
      {/* Blue Header Section */}
      <section className="blue-header pt-12 pb-16 px-6 rounded-b-[2rem] shadow-lg">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-white/20 rounded-md flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-white rounded-sm" />
             </div>
             <h1 className="text-white text-2xl font-black tracking-tighter italic uppercase">BR Trip</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/wallet" className="text-white relative">
              <div className="h-10 w-10 bg-white/20 rounded-md flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
            </Link>
          </div>
        </header>

        <div className="mt-8">
          <h2 className="text-white text-2xl font-bold">Hi, {userProfile?.fullName?.split(' ')[0] || 'Rajesh'}!</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <Card className="border-none shadow-md overflow-hidden bg-white/10 backdrop-blur-sm group active:scale-95 transition-all">
                <CardContent className="p-0">
                  <div className="relative h-24 w-full">
                    <Image 
                      src={`https://picsum.photos/seed/${cat.name}/300/200`} 
                      alt={cat.name} 
                      fill 
                      className="object-cover opacity-80" 
                      data-ai-hint={cat.name.toLowerCase()} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold">{cat.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Deals Section */}
      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Popular Deals</h3>
          <Link href="#" className="text-blue-600 text-xs font-bold">●●●</Link>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {deals.map((deal, i) => (
              <Card key={i} className={cn("min-w-[160px] border-none shadow-md text-white overflow-hidden", deal.color)}>
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                   <deal.icon className="h-8 w-8 opacity-80" />
                   <div className="space-y-0.5">
                     <p className="text-xl font-black leading-none italic">{deal.title}</p>
                     <p className="text-[10px] font-bold opacity-80">{deal.sub}</p>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Bottom Image Banner */}
      <section className="px-6 mt-4 pb-24">
        <div className="relative h-24 w-full rounded-xl overflow-hidden shadow-lg">
           <Image 
            src="https://images.unsplash.com/photo-1557426282-08695039fc27?q=80&w=1080" 
            alt="Skyline" 
            fill 
            className="object-cover" 
            data-ai-hint="city skyline" 
           />
           <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>
    </div>
  );
}

import { cn } from '@/lib/utils';
