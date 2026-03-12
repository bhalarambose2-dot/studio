
'use client';

import { 
  Wallet, 
  Hotel, 
  Bus, 
  Bike,
  Navigation,
  Star,
  MapPin,
  Briefcase,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { popularDestinations } from '../popularDestinations';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import images from '../lib/placeholder-images.json';

export default function SearchPage() {
  const { user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);

  const categories = [
    { name: 'Hotel', icon: Hotel, href: '/search-page?tab=hotel', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-resort-with-a-pool-and-palm-trees-4375-large.mp4' },
    { name: 'Bus Tickets', icon: Bus, href: '/search-page?tab=bus', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-highway-traffic-in-the-city-at-night-42284-large.mp4' },
    { name: 'Bike Ride', icon: Bike, href: '/search-page?tab=bike', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-on-the-road-during-sunset-31518-large.mp4' },
    { name: 'Book Trip', icon: Briefcase, href: '/destination-guides', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-fort-in-india-40246-large.mp4' },
  ];

  const deals = [
    { title: "25% OFF", sub: "ON HERITAGE", color: "bg-blue-500", icon: Hotel },
    { title: "SAHI RATE", sub: "₹15/KM RIDE", color: "bg-orange-500", icon: Bike },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FA] -mt-8 -mx-4 md:-mx-8 pb-20">
      {/* Blue Header Section */}
      <section className="blue-header pt-12 pb-20 px-6 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-[100px] pointer-events-none" />
        <header className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="h-14 w-14 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-2xl group cursor-pointer hover:rotate-12 transition-transform">
                <Navigation className="h-8 w-8 text-white rotate-45" />
             </div>
             <div>
                <h1 className="text-white text-3xl font-black tracking-tighter italic uppercase leading-none">HALORA</h1>
                <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em] mt-1 italic">Bharat Ka Sahi Safar</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wallet" className="text-white relative group">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl group-hover:bg-white/30 transition-all">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full border-2 border-primary animate-pulse" />
            </Link>
          </div>
        </header>

        <div className="mt-12 relative z-10 space-y-2">
          <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter leading-tight">नमस्कार <br/><span className="text-secondary">{userProfile?.fullName?.split(' ')[0] || 'Traveler'}!</span></h2>
          <p className="text-white/70 text-sm font-bold uppercase tracking-widest italic opacity-80 flex items-center gap-2">
            <Globe className="h-4 w-4 text-orange-400" /> Rajasthan Ke Sahi Safar Prarambh Karein
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <Card className="border-none shadow-2xl overflow-hidden bg-white/10 backdrop-blur-md group active:scale-95 transition-all border border-white/10 rounded-[2.5rem]">
                <CardContent className="p-0">
                  <div className="relative h-32 w-full">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                    >
                      <source src={cat.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                      <div className="bg-white/20 backdrop-blur-md w-fit p-2 rounded-xl mb-2">
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

      {/* Sahi Deals Section */}
      <section className="px-6 -mt-8 relative z-20">
        <ScrollArea className="w-full">
          <div className="flex gap-6 pb-6">
            {deals.map((deal, i) => (
              <Card key={i} className={cn("min-w-[220px] border-none shadow-2xl text-white overflow-hidden rounded-[2.5rem] group cursor-pointer active:scale-95 transition-all border-b-8 border-black/20", deal.color)}>
                <CardContent className="p-8 flex flex-col items-center text-center gap-4 relative">
                   <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-inner">
                    <deal.icon className="h-8 w-8 text-white" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-3xl font-black leading-none italic uppercase tracking-tighter">{deal.title}</p>
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
      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 flex items-center gap-3">
            <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
            Top Rated Safars
          </h3>
          <Link href="/destination-guides" className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">See All</Link>
        </div>
        <div className="space-y-6">
          {popularDestinations.slice(0, 6).map((dest, i) => (
            <Link key={i} href={`/search-page?tab=hotel&location=${dest.city}`}>
              <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white hover:bg-slate-50 transition-all group flex items-center border-b-4 border-primary/10">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  >
                    <source src={dest.videoUrl} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-lg uppercase italic tracking-tight text-slate-800 leading-tight group-hover:text-primary transition-colors">{dest.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-black flex items-center gap-1 uppercase mt-1 tracking-widest">
                        <MapPin className="h-3 w-3 text-primary" /> {dest.city}, Rajasthan
                      </p>
                    </div>
                    <Badge className="bg-primary text-white text-[10px] font-black border-none uppercase italic shadow-lg">₹{dest.price}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black italic">{dest.rating} Sahi Rating</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="px-6 mt-12 pb-12">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
           <div className="bg-primary/10 p-6 rounded-[2rem] shadow-inner">
             <ShieldCheck className="h-16 w-16 text-primary" />
           </div>
           <div className="space-y-2">
             <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">Bharat Ka Sahi Safar</h4>
             <p className="text-muted-foreground text-sm font-medium italic">Verified Heritage Stays • Honest Per Person Rates • Pay After Safar Policy.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
