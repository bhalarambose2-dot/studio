'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CreditCard, IndianRupee, MapPin, Hotel, Car, Utensils, Package, Home, HandCoins, Gift, Shield, Calendar as CalendarIcon, Map, Bus, Bike, Zap } from 'lucide-react';
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

const guides = [
  { name: 'Shimla, Himachal Pradesh', description: 'The Queen of Hills, perfect for a budget-friendly mountain escape.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1974&auto=format&fit=crop', hint: 'shimla mountains', price: '12,500' },
  { name: 'Manali, Himachal Pradesh', description: 'Popular adventure hub known for its stunning valleys and snow-capped peaks.', image: 'https://images.unsplash.com/photo-1593134257782-e89567b7684d?q=80&w=1965&auto=format&fit=crop', hint: 'manali valley', price: '15,000' },
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxKYWlwdXIlMjB8ZW58MHx8fHwxNzU1MDU2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaipur palace', price: '20,000' },
  { name: 'Kedarnath, Uttarakhand', description: 'A sacred Hindu temple nestled in the Himalayas, a major pilgrimage site.', image: 'https://images.unsplash.com/photo-1649147313351-c86537fda0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxLZWRhcm5hdGglMjB8ZW58MHx8fHwxNzU1MDU2NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'himalayan temple', price: '45,000' },
  { name: 'Goa, India', description: 'Famous for its beaches, nightlife, and Portuguese-influenced architecture.', image: 'https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxHb2F8ZW58MHx8fHwxNzU1MDU2MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'goa beach', price: '12,000' },
  { name: 'Kerala, India', description: "Known as 'God's Own Country', famous for its backwaters, lush greenery, and serene beaches.", image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzfGVufDB8fHx8MTc1NTExODc0MXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'kerala backwaters', price: '35,000' },
  { name: 'Jaisalmer, Rajasthan', description: 'The Golden City, known for its massive fort and camel safaris in the Thar Desert.', image: 'https://images.unsplash.com/photo-1713349881676-594b95a5742b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8SmFpc2FsbWVyJTIwfGVufDB8fHx8MTc1NTA2MDQ5NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaisalmer fort', price: '2,500 par parshan' },
  { name: 'Jodhpur, Rajasthan', description: 'The Blue City, famous for the Mehrangarh Fort and its blue-painted houses.', image: 'https://images.unsplash.com/photo-1721973733816-1791a072295a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8Sm9kaHB1ciUyMHxlbnwwfHx8fDE3NTUwNjA3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jodhpur fort', price: '26,000' },
];

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
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });


  const handleBookNow = (guide: typeof guides[0]) => {
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

      {/* Jodhpur Bike Taxi Banner */}
      <section className="container mx-auto px-4">
        <Link href="/search-page?tab=bike">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-2xl overflow-hidden relative group cursor-pointer">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 group-hover:opacity-30 transition-opacity">
              <Bike className="w-full h-full -rotate-12 translate-x-10 scale-150" />
            </div>
            <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <Badge className="bg-white text-primary border-none font-black italic mb-2">JODHPUR SPECIAL</Badge>
                <h2 className="text-4xl font-black italic tracking-tighter">BIKE TAXI AVAILABLE NOW!</h2>
                <p className="font-medium opacity-90">Rapido ki tarah asani se bike ride book karein Blue City mein.</p>
              </div>
              <Button size="lg" variant="secondary" className="font-black italic uppercase tracking-widest h-14 px-8 rounded-2xl shadow-xl">
                BOOK RIDE NOW
              </Button>
            </CardContent>
          </Card>
        </Link>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-black italic tracking-tighter text-center mb-2">POPULAR NEW TRIPS</h2>
        <p className="text-center text-muted-foreground font-medium uppercase text-xs tracking-widest mb-8">Best prices for your next big adventure.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide) => (
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
                  {guide.name.includes('Shimla') || guide.name.includes('Manali') ? (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">POPULAR</div>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-black italic tracking-tight mb-2">{guide.name}</h2>
                <p className="text-muted-foreground flex-grow text-xs font-medium leading-relaxed">{guide.description}</p>
                {guide.price && (
                  <div className="flex items-center text-xl font-black text-primary mt-4">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    <span>{guide.price}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-[10px] text-primary font-black uppercase tracking-widest hover:underline">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>View on Map</span>
                  </Link>
                </div>
              </CardContent>
              {guide.price && (
                <div className="p-4 pt-0">
                   <Button className="w-full shadow-primary/20 shadow-lg font-black italic uppercase rounded-xl" onClick={() => handleBookNow(guide)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 relative z-10">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/10 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2 font-black italic">
                    <Map className="text-primary"/>
                    PLAN YOUR CUSTOMIZED TRIP
                </CardTitle>
                <CardDescription className="font-medium">Sahi Nivesh se Sahi Safar tak.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="destination" className="text-[10px] font-black uppercase text-muted-foreground ml-1">Destination</Label>
                  <Input id="destination" placeholder="e.g., Jaipur" className="h-12 rounded-xl" />
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
                              {format(tripDates.from, "LLL dd, y")} -{" "}
                              {format(tripDates.to, "LLL dd, y")}
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
                  <Input id="interests" placeholder="e.g., Hiking" className="h-12 rounded-xl" />
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
