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
  Clock, 
  Bed, 
  Umbrella, 
  Car, 
  ShieldCheck, 
  Users, 
  Star,
  Zap,
  Ticket,
  MapPin,
  Plane
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function SearchPage() {
  const { user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const [activeOfferTab, setActiveOfferTab] = useState('All');

  const offers = [
    { title: "Special Deal: Get up to 25% OFF* on Hotels!", date: "Limited period offer", type: "Hotels", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1080" },
    { title: "Hottest Deals: Up to 30% OFF on Jaipur Hotels!", date: "Limited period offer", type: "Hotels", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1080" },
    { title: "Rajasthan Road Trip: Book Bus & Save Big!", date: "Limited period offer", type: "Bus", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1080" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 -mt-8 -mx-4 md:-mx-8">
      {/* Top Header Section */}
      <section className="bg-primary pt-12 pb-24 px-4 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <header className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
              <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} data-ai-hint="user avatar" />
              <AvatarFallback className="bg-white text-primary font-black uppercase">{userProfile?.fullName?.[0] || 'B'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-black tracking-tight leading-none">Hey {userProfile?.fullName?.split(' ')[0] || 'Bhala'}</h1>
              <Link href="/menu" className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 mt-1 flex items-center gap-1 group transition-all hover:bg-white/30">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Explore goTribe</span>
                <ChevronRight className="h-3 w-3 text-white transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/wallet" className="bg-secondary text-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg shadow-secondary/30 transition-transform active:scale-95">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-black italic">₹{userProfile?.walletBalance || 0}</span>
            </Link>
            <Button variant="ghost" size="icon" className="text-white bg-white/10 rounded-full h-10 w-10 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-primary" />
            </Button>
          </div>
        </header>

        {/* Main Service Grid (Floating) */}
        <div className="absolute bottom-[-100px] left-4 right-4 z-20">
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-4 md:p-6 bg-white">
              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
                {[
                  { name: 'Hotels', icon: Hotel, color: 'text-orange-500', bg: 'bg-orange-50', href: '/search-page?tab=hotel' },
                  { name: 'Trains', icon: Train, color: 'text-gray-600', bg: 'bg-gray-50', href: '#' },
                  { name: 'Bus', icon: Bus, color: 'text-orange-600', bg: 'bg-orange-50', href: '/search-page?tab=bus' },
                ].map((service) => (
                  <Link href={service.href} key={service.name} className="flex flex-col items-center gap-2 group">
                    <div className={cn("h-16 w-16 md:h-20 md:w-20 rounded-3xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 shadow-inner", service.bg)}>
                      <service.icon className={cn("h-8 w-8 md:h-10 md:w-10", service.color)} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{service.name}</span>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2 md:gap-4">
                {[
                  { name: 'Hourly Stays', icon: Clock },
                  { name: 'Hostels', icon: Bed },
                  { name: 'Holiday Packages', icon: Umbrella },
                  { name: 'Cabs', icon: Car },
                  { name: 'Travel Insurance', icon: ShieldCheck },
                ].map((sub) => (
                  <Link href="#" key={sub.name} className="flex flex-col items-center gap-2 group">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-all group-hover:bg-primary/5">
                      <sub.icon className="h-5 w-5 md:h-6 md:w-6 text-slate-600 group-hover:text-primary" />
                    </div>
                    <span className="text-[9px] font-bold text-center leading-tight text-slate-500">{sub.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Spacer for floating grid */}
      <div className="h-28" />

      {/* Hero Offer Banner */}
      <section className="px-4 mt-8">
        <Link href="/destination-guides">
          <Card className="bg-gradient-to-r from-orange-600 to-orange-400 text-white border-none shadow-xl rounded-[2rem] overflow-hidden relative group">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
                <Hotel className="w-full h-full -rotate-12 translate-x-12 scale-150" />
            </div>
            <CardContent className="p-8 relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Make Your</p>
                <h2 className="text-3xl font-black italic tracking-tighter">1st Hotel Booking</h2>
                <p className="text-sm font-bold mt-1">Grab <span className="bg-white text-orange-600 px-2 py-0.5 rounded-lg">FLAT 25% OFF*</span></p>
                <p className="text-[10px] font-black mt-4 uppercase tracking-tighter">Code: GOIBIBO</p>
              </div>
              <div className="relative h-24 w-24 hidden md:block">
                 <Image src="https://picsum.photos/seed/travel/200/200" alt="Traveler" fill className="object-cover rounded-2xl shadow-lg border-2 border-white/50" data-ai-hint="traveler" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <div className="flex justify-center gap-1.5 mt-4">
          <div className="h-1 w-6 bg-primary rounded-full" />
          <div className="h-1 w-3 bg-slate-200 rounded-full" />
        </div>
      </section>

      {/* Rajasthan Special Section */}
      <section className="mt-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Rajasthan Specials</h2>
          <Link href="/destination-guides" className="text-primary text-xs font-black uppercase">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/destination-guides" className="relative h-40 rounded-[2rem] overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1080" alt="Jaipur" fill className="object-cover transition-transform group-hover:scale-110" data-ai-hint="jaipur palace" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
              <MapPin className="h-8 w-8 text-orange-400 mb-1" />
              <span className="text-white font-black italic uppercase text-sm">Jaipur</span>
              <span className="text-white/80 text-[10px] font-bold">PINK CITY</span>
            </div>
          </Link>
          <Link href="/destination-guides" className="relative h-40 rounded-[2rem] overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1080" alt="Hotels" fill className="object-cover transition-transform group-hover:scale-110" data-ai-hint="udaipur" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
              <Hotel className="h-8 w-8 text-orange-400 mb-1" />
              <span className="text-white font-black italic uppercase text-sm">Top Hotels</span>
              <span className="text-white/80 text-[10px] font-bold">RAJASTHAN</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Offers Section */}
      <section className="mt-12 space-y-6 pb-12">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-2xl font-black italic tracking-tighter">Offers For You</h2>
        </div>

        <ScrollArea className="w-full px-4">
          <div className="flex gap-3 pb-4">
            {['All', 'Hotels', 'Bus', 'Trains'].map((tab) => (
              <Button 
                key={tab} 
                onClick={() => setActiveOfferTab(tab)}
                variant={activeOfferTab === tab ? "default" : "outline"}
                className={cn(
                    "rounded-xl font-black uppercase text-xs h-10 px-6 tracking-tight",
                    activeOfferTab !== tab && "bg-white border-slate-200 text-slate-500"
                )}
              >
                {tab}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <ScrollArea className="w-full px-4">
          <div className="flex gap-6 pb-10">
            {offers.map((offer, idx) => (
              <Card key={idx} className="min-w-[300px] border-none shadow-lg rounded-[2rem] overflow-hidden bg-white group hover:shadow-2xl transition-all">
                <div className="relative h-44 w-full">
                  <Image src={offer.image} alt={offer.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" data-ai-hint="travel offer" />
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-white/90 backdrop-blur-sm text-primary border-none font-black text-[10px] italic">{offer.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-black text-lg italic leading-tight uppercase line-clamp-2">{offer.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-destructive font-bold uppercase italic">
                      <Clock className="h-3 w-3" />
                      {offer.date}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-secondary/10 text-secondary">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}
