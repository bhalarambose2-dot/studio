
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, IndianRupee, Sparkles, Briefcase, Hotel as HotelIcon, Search, Star, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { Input } from '@/components/ui/input';

export default function DestinationGuidesPage() {
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookNow = (dest: any) => {
    setSelectedDest(dest);
    setIsDialogOpen(true);
  };

  const filteredHotels = popularDestinations.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white -mx-4 md:-mx-8 -mt-8 pb-32">
      {/* Cinematic Header */}
      <section className="relative h-[400px] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/india/1080/600')] bg-cover bg-center opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1b2a]/80 to-[#0d1b2a]" />
        
        <div className="relative z-10 text-center space-y-4 max-w-3xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <Badge className="bg-primary text-white border-none px-6 py-1 text-[10px] font-black uppercase tracking-[0.3em] italic">
            Exclusively India
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white drop-shadow-2xl">
            Sahi Safar <br/> <span className="text-primary">Sahi India</span>
          </h1>
          <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-xs">
            Discover the Soul of India with HALORA
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20 space-y-16">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary h-6 w-6 group-focus-within:rotate-12 transition-all" />
            <Input 
              placeholder="Search Indian Gems: Jaipur, Goa, Ladakh..." 
              className="h-16 pl-16 rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl text-lg font-black italic text-white placeholder:text-white/30 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Featured Stays */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-l-4 border-primary pl-4">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                <HotelIcon className="h-6 w-6 text-primary" /> Popular Safars
              </h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Sahi Nivesh • Sahi Choice</p>
            </div>
            <Badge variant="outline" className="text-white/40 border-white/10 text-[9px] uppercase font-black">ALL ACROSS BHARAT</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredHotels.map((hotel) => (
              <Card key={hotel.name} className="overflow-hidden border-none shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-md rounded-[2.5rem] group hover:bg-white/10 transition-all duration-500 border-b-8 border-primary/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      data-ai-hint={hotel.hint}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase italic tracking-widest shadow-lg">
                      {hotel.tag}
                    </div>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-2xl italic uppercase tracking-tighter leading-tight text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
                          <div className="flex items-center text-[10px] font-black uppercase text-white/40 tracking-widest mt-1">
                            <MapPin className="w-3 h-3 mr-1 text-primary" /> {hotel.city}, India
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] font-black">{hotel.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white/60 font-medium leading-relaxed italic">
                        {hotel.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                         <Badge className="bg-white/5 text-[8px] font-bold uppercase border-none text-white/40">Includes Breakfast</Badge>
                         <Badge className="bg-white/5 text-[8px] font-bold uppercase border-none text-white/40">Free WiFi</Badge>
                         <Badge className="bg-white/5 text-[8px] font-bold uppercase border-none text-white/40">Sahi Price</Badge>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-primary">Sahi Rate</p>
                        <p className="text-3xl font-black italic text-white">₹{hotel.price.toLocaleString('en-IN')}</p>
                      </div>
                      <Button 
                        className="h-14 px-8 font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg transition-all active:scale-95 group bg-primary hover:bg-primary/90" 
                        onClick={() => handleBookNow(hotel)}
                      >
                        BOOK SAFAR <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Season Collection */}
        <section className="bg-white/5 p-8 md:p-12 rounded-[3.5rem] border border-white/10">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" /> Season Specials
              </h2>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] italic">Limited Time Sahi Deals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newSeasonDestinations.map((hotel) => (
              <Card key={hotel.name} className="overflow-hidden border-none shadow-2xl bg-black/40 backdrop-blur-xl rounded-[2.5rem] group hover:scale-[1.02] transition-all duration-500 flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    data-ai-hint={hotel.hint}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-1 border border-white/10">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <span className="text-lg font-black italic text-white">{hotel.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <CardContent className="p-8 flex-grow flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase mb-2">{hotel.tag}</Badge>
                    <h3 className="font-black text-xl italic uppercase tracking-tighter leading-tight text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
                    <p className="text-xs text-white/50 italic leading-relaxed">{hotel.description}</p>
                  </div>
                  <Button 
                    className="w-full h-14 font-black italic uppercase rounded-2xl bg-white text-primary hover:bg-white/90 shadow-xl" 
                    onClick={() => handleBookNow(hotel)}
                  >
                    SELECT STAY
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* India Pride Footer */}
        <section className="text-center space-y-6 py-20 bg-primary/5 rounded-[4rem] border-2 border-dashed border-primary/20">
            <ShieldCheck className="h-16 w-16 text-primary mx-auto opacity-50" />
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Bharat Ka Sahi Safar</h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm font-medium italic">
                From the peaks of Himalayas to the shores of Goa, HALORA brings you the most detailed and verified stays across India. No international hidden fees, only local Sahi Rates.
            </p>
            <div className="flex justify-center gap-8 pt-4">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-primary">100+</span>
                    <span className="text-[10px] font-bold uppercase text-white/30">Cities</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-primary">24/7</span>
                    <span className="text-[10px] font-bold uppercase text-white/30">Support</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-primary">0</span>
                    <span className="text-[10px] font-bold uppercase text-white/30">Hidden Fees</span>
                </div>
            </div>
        </section>
      </div>

      {/* Booking Dialog */}
      {isDialogOpen && selectedDest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl border-white/10 bg-[#0d1b2a] text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-4xl font-black italic tracking-tighter uppercase text-primary">
                <div className="bg-primary text-white p-2 rounded-2xl shadow-lg">
                  <Briefcase className="h-8 w-8" />
                </div>
                CONFIRM SAFAR
              </DialogTitle>
              <DialogDescription className="font-bold text-white/40 uppercase text-[10px] tracking-widest mt-2">
                Sahi Indian Safar • Pay After Stay
              </DialogDescription>
            </DialogHeader>
            <div className="bg-white/5 p-4 rounded-2xl mb-6 border border-dashed border-white/10">
                <p className="text-[10px] font-black uppercase text-primary">Selected Destination</p>
                <p className="text-lg font-black italic">{selectedDest.name}</p>
                <p className="text-[10px] text-white/40 font-bold uppercase">{selectedDest.city}, Bharat</p>
            </div>
            <BookingForm 
                tripName={selectedDest.name} 
                bookingType="hotel"
                itemDetails={selectedDest}
                onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
