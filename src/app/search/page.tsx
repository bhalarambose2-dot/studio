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
  Bike,
  History,
  ZapIcon,
  BellRing
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const { firestore, user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const [activeOfferTab, setActiveOfferTab] = useState('All');
  const { toast } = useToast();

  const handleStartNotifications = () => {
    toast({
      title: "NOTIFICATIONS STARTED! 🔔",
      description: "Ab aapko Bharat ke har kone ke 'Sahi Safar' updates milte rahenge.",
      variant: "default",
    });
  };

  const recentBookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'bookings'),
        orderBy('bookingDate', 'desc'),
        limit(5)
    );
  }, [firestore, user]);

  const { data: recentBookings } = useCollection(recentBookingsQuery);

  const offers = [
    { title: "Special Deal: Get up to 25% OFF* on Hotels!", date: "Limited period offer", type: "Hotels", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1080" },
    { title: "Hottest Deals: Up to 30% OFF on Jaipur Hotels!", date: "Limited period offer", type: "Hotels", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1080" },
    { title: "Rajasthan Road Trip: Book Bus & Save Big!", date: "Limited period offer", type: "Bus", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1080" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-transparent -mt-8 -mx-4 md:-mx-8">
      {/* Top Header Section */}
      <section className="bg-primary pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        
        <header className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-4 border-white shadow-2xl">
              <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} data-ai-hint="user avatar" />
              <AvatarFallback className="bg-white text-primary font-black uppercase text-xl">{userProfile?.fullName?.[0] || 'B'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-white text-xl font-black tracking-tighter leading-none italic uppercase">Hey {userProfile?.fullName?.split(' ')[0] || 'Traveler'}</h1>
              <Link href="/manage-bookings" className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mt-1.5 flex items-center gap-2 group transition-all hover:bg-white/30 border border-white/10">
                <History className="h-3.5 w-3.5 text-white" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest italic">My History</span>
                <ChevronRight className="h-3.5 w-3.5 text-white transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleStartNotifications}
              className="bg-white text-primary h-12 rounded-2xl px-5 font-black italic text-xs uppercase shadow-2xl hover:bg-white/90 active:scale-95 transition-all flex items-center gap-3 border-none"
            >
              <BellRing className="h-5 w-5 animate-bounce" />
              Start Alerts
            </Button>
            <Link href="/wallet" className="bg-secondary text-white rounded-2xl h-12 px-5 flex items-center gap-3 shadow-2xl shadow-secondary/40 transition-transform active:scale-95 border border-white/20">
              <Wallet className="h-5 w-5" />
              <span className="text-lg font-black italic tracking-tighter">₹{userProfile?.walletBalance || 0}</span>
            </Link>
          </div>
        </header>

        {/* Main Service Grid (Floating) */}
        <div className="absolute bottom-[-100px] left-4 right-4 z-20">
          <Card className="border-none shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden">
            <CardContent className="p-6 md:p-8 bg-white/95 backdrop-blur-xl">
              <div className="grid grid-cols-4 gap-4 md:gap-6 mb-10">
                {[
                  { name: 'Hotels', icon: Hotel, color: 'text-orange-500', bg: 'bg-orange-50', href: '/search-page?tab=hotel' },
                  { name: 'Cab Ride', icon: Car, color: 'text-blue-600', bg: 'bg-blue-50', href: '/search-page?tab=car' },
                  { name: 'Bus', icon: Bus, color: 'text-orange-600', bg: 'bg-orange-50', href: '/search-page?tab=bus' },
                  { name: 'Bike', icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50', href: '/search-page?tab=bike' },
                ].map((service) => (
                  <Link href={service.href} key={service.name} className="flex flex-col items-center gap-3 group">
                    <div className={cn("h-16 w-16 md:h-24 md:w-24 rounded-[1.8rem] md:rounded-[2.2rem] flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 shadow-lg border border-slate-100", service.bg)}>
                      <service.icon className={cn("h-8 w-8 md:h-12 md:w-12", service.color)} />
                    </div>
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.1em] italic text-slate-800">{service.name}</span>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 md:gap-6">
                {[
                  { name: 'Hourly Stays', icon: Clock },
                  { name: 'Hostels', icon: Bed },
                  { name: 'Packages', icon: Umbrella },
                  { name: 'Rentals', icon: Car },
                  { name: 'Security', icon: ShieldCheck },
                ].map((sub) => (
                  <Link href="#" key={sub.name} className="flex flex-col items-center gap-2 group">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:border-primary/20">
                      <sub.icon className="h-5 w-5 md:h-8 md:w-8 text-slate-500 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase text-center leading-tight text-slate-500 italic tracking-tighter">{sub.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Spacer for floating grid */}
      <div className="h-32" />

      {/* Hero Offer Banner */}
      <section className="px-4 mt-8">
        <Link href="/destination-guides">
          <Card className="bg-gradient-to-r from-orange-600 to-orange-400 text-white border-none shadow-[0_20px_50px_rgba(var(--primary),0.3)] rounded-[2.5rem] overflow-hidden relative group transition-all hover:scale-[1.02]">
            <div className="absolute right-[-10%] top-[-20%] bottom-[-20%] w-2/3 opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <Hotel className="w-full h-full scale-150" />
            </div>
            <CardContent className="p-10 relative z-10 flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80 italic">Bharat Special Offer</p>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">First Hotel<br/>Booking</h2>
                <div className="flex items-center gap-3 mt-4">
                  <span className="bg-white text-orange-600 px-4 py-1.5 rounded-xl font-black text-lg shadow-lg">FLAT 25% OFF*</span>
                </div>
                <p className="text-[11px] font-black mt-6 uppercase tracking-widest bg-black/20 w-fit px-3 py-1 rounded-full border border-white/20">Use Code: SAHISAFAR</p>
              </div>
              <div className="relative h-40 w-40 hidden md:block group-hover:scale-110 transition-transform duration-700">
                 <Image src="https://picsum.photos/seed/traveler/400/400" alt="Traveler" fill className="object-cover rounded-[2.5rem] shadow-2xl border-4 border-white/30" data-ai-hint="traveler" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Rajasthan Special Section */}
      <section className="mt-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-slate-800">
            <MapPin className="h-8 w-8 text-primary" /> Rajasthan Specials
          </h2>
          <Link href="/destination-guides" className="bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full text-primary text-[10px] font-black uppercase tracking-widest transition-colors">View All Guides</Link>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Link href="/destination-guides" className="relative h-56 rounded-[2.5rem] overflow-hidden group shadow-xl">
            <Image src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1080" alt="Jaipur" fill className="object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" data-ai-hint="jaipur palace" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-2"><MapPin className="h-8 w-8 text-orange-400" /></div>
              <span className="text-white font-black italic uppercase text-xl tracking-tighter">Jaipur</span>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">Pink City Guide</span>
            </div>
          </Link>
          <Link href="/destination-guides" className="relative h-56 rounded-[2.5rem] overflow-hidden group shadow-xl">
            <Image src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1080" alt="Udaipur" fill className="object-cover transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-2" data-ai-hint="udaipur" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-2"><Hotel className="h-8 w-8 text-orange-400" /></div>
              <span className="text-white font-black italic uppercase text-xl tracking-tighter">Lake Palace</span>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">Luxury Collection</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Offers Section */}
      <section className="mt-16 space-y-8">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800">Hot Deals For You</h2>
        </div>

        <ScrollArea className="w-full px-4">
          <div className="flex gap-4 pb-4">
            {['All', 'Hotels', 'Bus', 'Trains', 'Cabs'].map((tab) => (
              <Button 
                key={tab} 
                onClick={() => setActiveOfferTab(tab)}
                variant={activeOfferTab === tab ? "default" : "outline"}
                className={cn(
                    "rounded-2xl font-black uppercase text-xs h-12 px-8 tracking-widest italic transition-all shadow-sm",
                    activeOfferTab === tab ? "shadow-lg shadow-primary/20 scale-105" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                {tab}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <ScrollArea className="w-full px-4">
          <div className="flex gap-8 pb-12">
            {offers.map((offer, idx) => (
              <Card key={idx} className="min-w-[340px] border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white group hover:shadow-primary/5 transition-all hover:translate-y-[-5px]">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={offer.image} alt={offer.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" data-ai-hint="travel offer" />
                  <div className="absolute top-6 left-6">
                     <Badge className="bg-white/95 backdrop-blur-md text-primary border-none font-black text-[10px] italic uppercase px-4 py-1.5 rounded-full shadow-lg">{offer.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                  <h3 className="font-black text-xl italic leading-tight uppercase line-clamp-2 tracking-tight">{offer.title}</h3>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[10px] text-destructive font-black uppercase italic tracking-wider">
                      <Clock className="h-4 w-4 animate-spin-slow" />
                      {offer.date}
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all shadow-inner">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Recent History Shortcut - MOVED TO BOTTOM */}
      {recentBookings && recentBookings.length > 0 && (
        <section className="px-4 mt-12 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-slate-800">
                    <History className="h-8 w-8 text-primary" /> My Recent Safar
                </h2>
                <Link href="/manage-bookings" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Full Statement</Link>
            </div>
            <div className="space-y-4">
                {recentBookings.map((b: any) => (
                    <Link href="/manage-bookings" key={b.id} className="block group">
                        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-all group-hover:translate-x-2">
                            <div className="flex items-center gap-5">
                                <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                                    {b.bookingType === 'hotel' ? <Hotel className="h-6 w-6" /> : b.bookingType === 'bus' ? <Bus className="h-6 w-6" /> : <Bike className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-lg font-black uppercase tracking-tighter italic leading-none mb-1">{b.tripName}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{b.bookingDate?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                      <Badge variant="outline" className="text-[8px] h-4 font-black px-2 py-0 border-slate-200 text-slate-400">{b.bookingType}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black italic text-primary leading-none mb-1">₹{b.amount?.toLocaleString('en-IN')}</p>
                                <Badge className="text-[9px] h-5 bg-green-100 text-green-700 border-none font-black uppercase px-3 shadow-inner">Confirmed</Badge>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
      )}
    </div>
  );
}
