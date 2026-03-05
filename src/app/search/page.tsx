'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Hotel, 
  Train, 
  Bus, 
  Bike,
  Map as MapIcon,
  Globe,
  ChevronRight,
  TrendingUp,
  History,
  Navigation
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import images from '../lib/placeholder-images.json';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function SearchPage() {
  const { user, firestore } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);

  const categories = [
    { name: 'Hotel Booking', icon: Hotel, href: '/search-page?tab=hotel', color: 'bg-blue-600' },
    { name: 'Bus Tickets', icon: Bus, href: '/search-page?tab=bus', color: 'bg-blue-700' },
    { name: 'Train Tickets', icon: Train, href: '/search-page?tab=train', color: 'bg-blue-800' },
    { name: 'Bike Ride', icon: Bike, href: '/search-page?tab=bike', color: 'bg-blue-900' },
  ];

  const deals = [
    { title: "25% OFF", sub: "ON HOTELS", color: "bg-blue-500", icon: Hotel },
    { title: "FLAT ₹100 OFF", sub: "ON TRAINS", color: "bg-blue-600", icon: Train },
    { title: "SAHI RATE", sub: "₹15/KM BIKE", color: "bg-orange-500", icon: Bike },
  ];

  // Fetch recent bookings for "My Recent Safar" section
  const recentBookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'bookings'),
      orderBy('timestamp', 'desc'),
      limit(3)
    );
  }, [firestore, user]);

  const { data: recentBookings } = useCollection(recentBookingsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FA] -mt-8 -mx-4 md:-mx-8">
      {/* Blue Header Section */}
      <section className="blue-header pt-12 pb-16 px-6 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <header className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                <Navigation className="h-6 w-6 text-white rotate-45" />
             </div>
             <div>
                <h1 className="text-white text-2xl font-black tracking-tighter italic uppercase leading-none">BR Trip</h1>
                <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.3em] mt-1">Sahi Safar • Sahi Nivesh</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/wallet" className="text-white relative group">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl group-hover:bg-white/30 transition-all">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full border-2 border-primary animate-pulse" />
            </Link>
          </div>
        </header>

        <div className="mt-10 relative z-10">
          <h2 className="text-white text-3xl font-black italic uppercase tracking-tight">नमस्कार {userProfile?.fullName?.split(' ')[0] || 'Traveler'}!</h2>
          <p className="text-white/70 text-sm font-medium mt-1">Aaj aap kahan ka safar karenge?</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <Card className="border-none shadow-2xl overflow-hidden bg-white/10 backdrop-blur-md group active:scale-95 transition-all border border-white/10 rounded-[2rem]">
                <CardContent className="p-0">
                  <div className="relative h-28 w-full">
                    <Image 
                      src={`https://picsum.photos/seed/${cat.name}/400/300`} 
                      alt={cat.name} 
                      fill 
                      className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                      data-ai-hint={cat.name.toLowerCase()} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <div className="bg-white/20 backdrop-blur-md w-fit p-1.5 rounded-lg mb-2">
                        <cat.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white text-xs font-black uppercase italic tracking-widest">{cat.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Travel Cities Section */}
      <section className="px-6 mt-10">
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white border-b-8 border-b-primary/10">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-black italic uppercase tracking-tighter text-slate-800">Explore India Map</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Sahi Indian Travel Routes</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
              <iframe
                src="https://www.google.com/maps?q=India&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-primary/20 text-center">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest mb-3">Popular Travel Cities</h3>
              <p className="text-xs font-bold text-slate-600 mb-6 italic">Delhi | Mumbai | Jaipur | Jodhpur | Goa | Kedarnath</p>
              <Link href="/search-page">
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg group">
                  BOOK TRIP <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Popular Deals Section */}
      <section className="px-6 mt-10">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Sahi Deals
          </h3>
          <Link href="/destination-guides" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-6 pb-6 px-2">
            {deals.map((deal, i) => (
              <Card key={i} className={cn("min-w-[180px] border-none shadow-xl text-white overflow-hidden rounded-[2rem] group cursor-pointer active:scale-95 transition-all", deal.color)}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                   <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <deal.icon className="h-8 w-8 text-white" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-2xl font-black leading-none italic uppercase">{deal.title}</p>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{deal.sub}</p>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Recent Safar Section */}
      {recentBookings && recentBookings.length > 0 && (
        <section className="px-6 mt-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent Safar
            </h3>
          </div>
          <div className="space-y-4">
            {recentBookings.map((b) => (
              <Link key={b.id} href="/manage-bookings">
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-white hover:bg-slate-50 transition-colors mb-4">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        {b.bookingType === 'bike' ? <Bike className="h-5 w-5" /> : <Bus className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-black italic uppercase text-xs text-slate-800">{b.tripName}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">
                          {b.bookingDate && (typeof b.bookingDate === 'string' 
                            ? b.bookingDate 
                            : b.bookingDate.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary italic">₹{b.amount}</p>
                      <Badge className="bg-green-100 text-green-700 text-[8px] h-4 font-black px-2 border-none">CONFIRMED</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Banner */}
      <section className="px-6 mt-8 pb-32">
        <div className="relative h-32 w-full rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer">
           <Image 
            src={images.citySkyline} 
            alt="Skyline" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-1000" 
            data-ai-hint="city skyline" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center p-8">
              <h4 className="text-white text-xl font-black italic uppercase tracking-tighter leading-tight">Sahi Safar,<br/>Sahi Indian Price.</h4>
              <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mt-2">No Hidden Charges • Pay After Ride</p>
           </div>
        </div>
      </section>
    </div>
  );
}
