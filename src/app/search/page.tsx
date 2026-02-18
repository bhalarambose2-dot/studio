
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CreditCard, IndianRupee, MapPin, Hotel, Car, Utensils, Package, Home, HandCoins, Gift, Shield, Calendar as CalendarIcon, Map, Bus, Bike, Zap, Flag } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { popularDestinations } from '../popularDestinations';

const rajasthanGuides = popularDestinations.filter(d => d.name.includes('Rajasthan'));

const services = [
    { name: 'Hotels', icon: Hotel, href: '/search-page' },
    { name: 'Bus Tickets', icon: Bus, href: '/search-page?tab=bus' },
    { name: 'Bike Taxi', icon: Bike, href: '/search-page?tab=bike', isNew: true },
    { name: 'Holiday Packages', icon: Package, href: '/destination-guides' },
    { name: 'Airport Cabs', icon: Car, href: '#' },
    { name: 'Gift Cards', icon: Gift, href: '/gift-card' },
];

const ServiceCard = ({ icon: Icon, name, href, isNew }: { icon: React.ElementType, name: string, href: string, isNew?: boolean }) => (
    <Link href={href}>
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-muted transition-colors h-full border-primary/20 shadow-sm hover:shadow-md relative overflow-hidden group">
            {isNew && (
              <Badge className="absolute top-2 right-2 bg-primary text-white border-none text-[8px] px-1 py-0 h-4 uppercase animate-pulse">New</Badge>
            )}
            <Icon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-bold uppercase tracking-tighter italic">{name}</p>
        </Card>
    </Link>
);


export default function SearchPage() {
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });


  const handleBookNow = (guide: any) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-10">
      {/* Explore Services section moved to the top */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-black italic tracking-tighter text-center mb-6 flex items-center justify-center gap-2">
          <Zap className="text-primary h-6 w-6" />
          EXPLORE SERVICES
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {services.map((service) => (
                <ServiceCard key={service.name} icon={service.icon} name={service.name} href={service.href} isNew={service.isNew} />
            ))}
        </div>
      </section>

      {/* Rajasthan Special Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="text-left">
                <h2 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
                    <Flag className="text-primary h-8 w-8" />
                    DISCOVER RAJASTHAN
                </h2>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em] mt-1">Sahi Safar Across the Desert Jewel</p>
            </div>
            <Link href="/search-page?tab=bike">
              <Button variant="outline" className="border-primary text-primary font-black italic rounded-xl h-12 uppercase tracking-widest text-[10px]">Jodhpur Bike Taxi Available Now</Button>
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rajasthanGuides.map((guide) => (
            <Card key={guide.name} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col border-none shadow-lg bg-white rounded-[2rem]">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full">
                  <Image
                    src={guide.image}
                    alt={`Image of ${guide.name}`}
                    data-ai-hint={guide.hint}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-black italic px-2 py-1 rounded-lg shadow-lg">RAJASTHAN SPECIAL</div>
                  {guide.name.includes('Jodhpur') && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> Live Status
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-black italic tracking-tight mb-2 uppercase">{guide.name.split(',')[0]}</h2>
                <p className="text-muted-foreground flex-grow text-[10px] font-bold uppercase tracking-widest opacity-60">Experience the Royal Heritage</p>
                <div className="flex items-center text-xl font-black text-primary mt-4 italic">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    <span>₹2,499 Onwards</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-[10px] text-primary font-black uppercase tracking-widest hover:underline">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>View Map</span>
                  </Link>
                  {guide.name.includes('Jodhpur') && (
                    <Link href="/search-page?tab=bike" className="flex items-center text-[10px] text-green-600 font-black uppercase tracking-widest hover:underline">
                        <Zap className="w-3 h-3 mr-1" />
                        <span>Live Taxi</span>
                    </Link>
                  )}
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                  <Button className="w-full shadow-primary/20 shadow-lg font-black italic uppercase rounded-xl h-12" onClick={() => handleBookNow(guide)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Jodhpur Bike Taxi Banner */}
      <section className="container mx-auto px-4">
        <Link href="/search-page?tab=bike">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-2xl overflow-hidden relative group cursor-pointer rounded-[2.5rem]">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 group-hover:opacity-30 transition-opacity">
              <Bike className="w-full h-full -rotate-12 translate-x-10 scale-150" />
            </div>
            <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <Badge className="bg-white text-primary border-none font-black italic mb-2">JODHPUR SPECIAL</Badge>
                <h2 className="text-4xl font-black italic tracking-tighter">BIKE TAXI & LIVE MAP STATUS!</h2>
                <p className="font-medium opacity-90 max-w-md">Rapido ki tarah asani se bike ride book karein Blue City mein. Jodhpur ki galliyon mein live status aur "Sahi Safar" shuru karein.</p>
              </div>
              <Button size="lg" variant="secondary" className="font-black italic uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl">
                VIEW LIVE STATUS
              </Button>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Plan Custom Trip section */}
      <section className="container mx-auto px-4 relative z-10">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/10 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2 font-black italic">
                    <Map className="text-primary"/>
                    PLAN YOUR CUSTOMIZED RAJASTHAN TRIP
                </CardTitle>
                <CardDescription className="font-medium">Sahi Nivesh se Sahi Safar tak. Plan your desert adventure.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="destination" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Rajasthan Destination</Label>
                  <Input id="destination" placeholder="e.g., Udaipur, Jaisalmer" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip-dates" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="trip-dates"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 rounded-xl",
                          !tripDates.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tripDates.from ? (
                          tripDates.to ? (
                            <>
                              {format(tripDates.from, "LLL dd")} - {format(tripDates.to, "LLL dd")}
                            </>
                          ) : (
                            format(tripDates.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={tripDates.from}
                        selected={tripDates}
                        onSelect={(range) => setTripDates({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Activities</Label>
                  <Input id="interests" placeholder="e.g., Desert Safari" className="h-12 rounded-xl" />
                </div>
                <Button type="submit" className="w-full h-12 lg:col-span-4 mt-4 font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-xl"><Search className="mr-2" /> Search Now</Button>
              </form>
            </CardContent>
        </Card>
      </section>

      {selectedGuide && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="font-black italic text-2xl">Book Trip to {selectedGuide.name}</DialogTitle>
            </DialogHeader>
            <BookingForm tripName={selectedGuide.name} />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
