
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, IndianRupee, Sparkles, Briefcase, Hotel as HotelIcon, Search } from "lucide-react";
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
    <div className="container mx-auto space-y-12 pb-24">
      {/* Header with Search */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic text-primary uppercase">Hotel & Stay Guides</h1>
        <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
          Sahi Nivesh • Sahi Safar • Pay After Stay
        </p>
        <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary h-6 w-6 group-focus-within:rotate-12 transition-transform" />
            <Input 
                placeholder="Search Hotels in Jaipur, Udaipur, Goa..." 
                className="h-16 pl-16 rounded-[2rem] border-primary/20 bg-white/50 backdrop-blur-md shadow-xl text-lg font-black italic italic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>
      
      {/* Featured Hotel List */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                <HotelIcon className="h-8 w-8 text-primary" /> Popular Stays
            </h2>
            <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px]">ALL OVER INDIA</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.name} className="overflow-hidden border-none shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col rounded-[2.5rem] bg-white group border-b-8 border-b-primary/10">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    data-ai-hint={hotel.hint}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-1 border border-primary/10">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      <span className="text-lg font-black italic text-primary">{hotel.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest shadow-lg">
                      Sahi Price
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow space-y-4 flex flex-col">
                <div className="space-y-1 flex-grow">
                  <h3 className="font-black text-xl italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{hotel.name}</h3>
                  <div className="flex items-center text-[11px] font-black uppercase text-muted-foreground tracking-widest">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    <span>City: {hotel.city}</span>
                  </div>
                </div>
                <Button className="w-full h-14 font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg transition-transform active:scale-95 group bg-primary hover:bg-primary/90" onClick={() => handleBookNow(hotel)}>
                    BOOK NOW <Briefcase className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Season Specials */}
      <section className="bg-primary/5 p-10 rounded-[3.5rem] border-4 border-dashed border-primary/20 shadow-inner">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Season Collection</h2>
            </div>
            <Badge className="bg-primary text-white border-none font-black italic px-4 py-1 uppercase text-[10px]">Winter Special</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newSeasonDestinations.map((hotel) => (
            <Card key={hotel.name} className="overflow-hidden border-none shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col rounded-[2.5rem] bg-white group border-b-8 border-b-secondary/10">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    data-ai-hint={hotel.hint}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                   <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-1 border border-secondary/10">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      <span className="text-lg font-black italic text-primary">{hotel.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow space-y-4 flex flex-col">
                <div className="space-y-1 flex-grow">
                  <h3 className="font-black text-xl italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{hotel.name}</h3>
                  <div className="flex items-center text-[11px] font-black uppercase text-muted-foreground tracking-widest">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    <span>City: {hotel.city}</span>
                  </div>
                </div>
                <Button className="w-full h-14 font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg transition-transform active:scale-95 group bg-primary hover:bg-primary/90" onClick={() => handleBookNow(hotel)}>
                    BOOK NOW
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Booking Dialog */}
      {isDialogOpen && selectedDest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl border-primary/20 bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-4xl font-black italic tracking-tighter uppercase text-primary">
                <div className="bg-primary text-white p-2 rounded-2xl shadow-lg">
                  <Briefcase className="h-8 w-8" />
                </div>
                CONFIRM STAY
              </DialogTitle>
              <DialogDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-2">
                Sahi Nivesh • Sahi Safar • Pay After Stay
              </DialogDescription>
            </DialogHeader>
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
