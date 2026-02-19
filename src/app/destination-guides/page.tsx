'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, IndianRupee, Sparkles, Briefcase } from "lucide-react";
import Image from "next/image";
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';

export default function DestinationGuidesPage() {
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookNow = (dest: any) => {
    setSelectedDest(dest);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto space-y-12 pb-24">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter italic text-primary">DESTINATION GUIDES</h1>
        <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest text-xs">
          Sahi Nivesh • Sahi Safar • Best Price Guaranteed
        </p>
      </div>
      
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Popular Destinations</h2>
            <Badge variant="outline" className="border-primary/20 text-primary font-bold">ALL RAJASTHAN</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <Card key={dest.name} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col rounded-[2rem] bg-white group">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={`Image of ${dest.name}`}
                    data-ai-hint={dest.hint}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg flex items-center gap-1">
                      <IndianRupee className="h-3 w-3 text-primary" />
                      <span className="text-xs font-black italic text-primary">{dest.price.toLocaleString('en-IN')}</span>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase ml-1">Starts</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 flex-grow space-y-4 flex flex-col">
                <div className="space-y-2 flex-grow">
                  <h3 className="font-black text-lg italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="flex items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                    <span>Rajasthan Guide</span>
                  </div>
                </div>
                <Button className="w-full font-black italic uppercase rounded-xl shadow-lg shadow-primary/10" onClick={() => handleBookNow(dest)}>BOOK TRIP</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 p-8 rounded-[3rem] border-2 border-dashed border-primary/20">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Season Special</h2>
            </div>
            <Badge className="bg-primary text-white border-none font-black italic">WINTER COLLECTION</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newSeasonDestinations.map((dest) => (
            <Card key={dest.name} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col rounded-[2rem] bg-white group">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={`Image of ${dest.name}`}
                    data-ai-hint={dest.hint}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg flex items-center gap-1">
                      <IndianRupee className="h-3 w-3 text-primary" />
                      <span className="text-xs font-black italic text-primary">{dest.price.toLocaleString('en-IN')}</span>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase ml-1">Starts</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 flex-grow space-y-4 flex flex-col">
                <div className="space-y-2 flex-grow">
                  <h3 className="font-black text-lg italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="flex items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                    <span>Himalayan Guide</span>
                  </div>
                </div>
                <Button className="w-full font-black italic uppercase rounded-xl shadow-lg shadow-primary/10" onClick={() => handleBookNow(dest)}>BOOK TRIP</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {isDialogOpen && selectedDest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-3xl font-black italic tracking-tighter uppercase">
                <Briefcase className="text-primary h-8 w-8" />
                CONFIRM TRIP
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
                Confirming your trip to {selectedDest.name}. Experience Rajasthan like never before.
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

