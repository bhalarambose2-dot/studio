'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, Search, Star, Clock, ShieldCheck, ChevronRight, History } from "lucide-react";
import { popularDestinations } from '../popularDestinations';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { Input } from '@/components/ui/input';
import images from '../lib/placeholder-images.json';

export default function DestinationGuidesPage() {
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookNow = (dest: any) => {
    setSelectedDest(dest);
    setIsDialogOpen(true);
  };

  const filteredTrips = popularDestinations.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white -mx-4 md:-mx-8 -mt-8 pb-32">
      {/* Cinematic Header */}
      <section className="relative h-[450px] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
        <Image 
          src={images.citySkyline}
          alt="Rajasthan Heritage"
          data-ai-hint="rajasthan heritage"
          fill
          className="object-cover opacity-40 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1b2a]/80 to-[#0d1b2a]" />
        
        <div className="relative z-10 text-center space-y-4 max-w-4xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <Badge className="bg-primary text-white border-none px-6 py-1 text-[10px] font-black uppercase tracking-[0.3em] italic">
            Rajasthan Ke Sahi Safar
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white drop-shadow-2xl leading-none">
            Padharo <br/> <span className="text-primary">Mhare Desh</span>
          </h1>
          <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-xs mt-4">
            Exclusive 2D/2N Heritage Packages • Best Per Person Rates
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20 space-y-16">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary h-6 w-6 group-focus-within:rotate-12 transition-all" />
            <Input 
              placeholder="Jaipur, Jodhpur, Udaipur, Jaisalmer..." 
              className="h-16 pl-16 rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl text-lg font-black italic text-white placeholder:text-white/30 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Rajasthan Heritage Section */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-primary pl-4">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                <History className="h-6 w-6 text-primary" /> Rajasthan Heritage Group
              </h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Sahi Nivesh • Best Price Guaranteed • 2 Days 2 Nights</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black italic px-4">{filteredTrips.length} BEST TRIPS FOUND</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredTrips.map((hotel) => (
              <Card key={hotel.name} className="overflow-hidden border-none shadow-[0_0_50px_rgba(0,0,0,0.6)] bg-white/5 backdrop-blur-md rounded-[3rem] group hover:bg-white/10 transition-all duration-500 border-b-8 border-primary/20">
                <div className="flex flex-col h-full">
                  <div className="relative h-72 overflow-hidden">
                    <Image 
                      src={hotel.image}
                      alt={hotel.name}
                      data-ai-hint={hotel.hint}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    
                    <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-widest shadow-xl">
                      {hotel.tag}
                    </div>
                    <div className="absolute bottom-4 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-xs font-black italic text-white">{hotel.duration}</span>
                    </div>
                  </div>
                  <CardContent className="p-10 flex flex-col justify-between flex-grow gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-3xl italic uppercase tracking-tighter leading-tight text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
                          <div className="flex items-center text-[11px] font-black uppercase text-white/40 tracking-widest mt-2">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" /> {hotel.city}, Rajasthan
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-[11px] font-black">{hotel.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white/60 font-medium leading-relaxed italic line-clamp-3">
                        {hotel.description}
                      </p>
                    </div>
                    
                    <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black uppercase text-primary tracking-widest">Sahi Price/Person</p>
                        <p className="text-4xl font-black italic text-white">₹{hotel.price.toLocaleString('en-IN')}</p>
                      </div>
                      <Button 
                        className="h-16 px-10 font-black italic uppercase rounded-2xl shadow-2xl shadow-primary/30 text-xl transition-all active:scale-95 group bg-primary hover:bg-primary/90" 
                        onClick={() => handleBookNow(hotel)}
                      >
                        BOOK SAFAR <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="text-center space-y-6 py-24 bg-primary/5 rounded-[5rem] border-2 border-dashed border-primary/20">
            <ShieldCheck className="h-20 w-20 text-primary mx-auto opacity-60 animate-pulse" />
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Bharat Ka Sahi Safar</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-base font-medium italic px-6">
                From the sand dunes of Jaisalmer to the lakes of Udaipur, HALORA brings you verified 2D/2N heritage packages at the most honest rates. No hidden charges, only local Sahi Rates for every group.
            </p>
        </section>
      </div>

      {/* Booking Dialog */}
      {isDialogOpen && selectedDest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-[3.5rem] p-12 max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/10 bg-[#0d1b2a] text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 text-4xl font-black italic tracking-tighter uppercase text-primary">
                <div className="bg-primary text-white p-3 rounded-3xl shadow-2xl">
                  <Briefcase className="h-8 w-8" />
                </div>
                CONFIRM SAFAR
              </DialogTitle>
              <DialogDescription className="font-bold text-white/40 uppercase text-[11px] tracking-[0.3em] mt-3">
                Rajasthan 2D/2N Heritage Package • Pay Later
              </DialogDescription>
            </DialogHeader>
            <div className="bg-white/5 p-6 rounded-[2rem] my-8 border border-dashed border-white/20">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[11px] font-black uppercase text-primary tracking-widest">Selected Destination</p>
                        <p className="text-2xl font-black italic mt-1">{selectedDest.name}</p>
                        <p className="text-[11px] text-white/40 font-bold uppercase mt-1">{selectedDest.city}, Rajasthan</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black">{selectedDest.duration}</Badge>
                </div>
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
