
'use client';

import { 
  Wallet, 
  Hotel, 
  Bus, 
  Bike,
  Navigation,
  TrendingUp,
  Map as MapIcon,
  Star,
  MapPin,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import images from '../lib/placeholder-images.json';
import { popularDestinations } from '../popularDestinations';
import { Badge } from '@/components/ui/badge';
import { use } from 'react';

export default function SearchPage({ searchParams }: { searchParams: Promise<any> }) {
  // Unwrap searchParams to satisfy Next.js 15 requirement
  use(searchParams);
  
  const { user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);

  const categories = [
    { name: 'Hotel', icon: Hotel, href: '/search-page?tab=hotel', color: 'bg-blue-600' },
    { name: 'Bus Tickets', icon: Bus, href: '/search-page?tab=bus', color: 'bg-blue-700' },
    { name: 'Bike Ride', icon: Bike, href: '/search-page?tab=bike', color: 'bg-blue-900' },
  ];

  const deals = [
    { title: "25% OFF", sub: "ON HOTELS", color: "bg-blue-500", icon: Hotel },
    { title: "SAHI RATE", sub: "₹15/KM BIKE", color: "bg-orange-500", icon: Bike },
  ];

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
                <h1 className="text-white text-2xl font-black tracking-tighter italic uppercase leading-none">HALORA</h1>
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
        <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
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
                      <span className="text-white text-[10px] font-black uppercase italic tracking-widest leading-none">{cat.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
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

      {/* Top Rated Safars */}
      <section className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Top Rated Safars
          </h3>
          <Link href="/destination-guides" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">See More</Link>
        </div>
        <div className="space-y-4">
          {popularDestinations.slice(0, 8).map((dest, i) => (
            <Link key={i} href={`/search-page?tab=hotel&location=${dest.city}`}>
              <Card className="border-none shadow-lg overflow-hidden rounded-[2rem] bg-white hover:bg-slate-50 transition-all group flex items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                  <Image 
                    src={dest.image} 
                    alt={dest.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    data-ai-hint={dest.hint}
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm uppercase italic tracking-tight text-slate-800 leading-tight">{dest.name}</h4>
                      <p className="text-[9px] text-muted-foreground font-bold flex items-center gap-1 uppercase mt-1">
                        <MapPin className="h-2 w-2 text-primary" /> {dest.city}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary uppercase italic">₹{dest.price}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

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
