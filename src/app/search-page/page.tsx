
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Hotel, Plane, Search, Car, Utensils, Package, Home, Train, HandCoins, Gift, Shield, CreditCard, IndianRupee, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';


const rajasthanStays = [
    { name: 'Rambagh Palace', location: 'Jaipur', type: 'Hotel', description: 'A former royal palace with ornate rooms, sprawling gardens, and a luxe spa.', image: 'https://images.unsplash.com/photo-1596386461350-326ccb383e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxSYW1iYWdoJTIwUGFsYWNlfGVufDB8fHx8MTc1NjA5NzE5OXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Rambagh Palace Jaipur', price: '45,000' },
    { name: 'Umaid Bhawan Palace', location: 'Jodhpur', type: 'Hotel', description: 'A grand, art deco palace offering opulent suites, a spa, and pools.', image: 'https://images.unsplash.com/photo-1618821434313-937a4a25de8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVbWFpZCUyMEJoYXdhbiUyMFBhbGFjZXxlbnwwfHx8fDE3NTYwOTcyODV8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Umaid Bhawan Palace Jodhpur', price: '55,000' },
    { name: 'The Oberoi Udaivilas', location: 'Udaipur', type: 'Hotel', description: 'A luxurious hotel with grand architecture, intricate domes, and serene pools.', image: 'https://images.unsplash.com/photo-1620177391308-4182dc7a77b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxUaGUlMjBPYmVyb2klMjBVZGFpdmlsYXN8ZW58MHx8fHwxNzU2MDk3MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'The Oberoi Udaivilas', price: '65,000' },
    { name: 'Suvarna Mahal', location: 'Jaipur', type: 'Restaurant', description: 'Located in Rambagh Palace, this restaurant offers authentic Indian cuisine.', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU2MDk3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'restaurant interior' },
    { name: '1135 AD', location: 'Amer, Jaipur', type: 'Restaurant', description: 'A fine-dining restaurant with regal, candlelit interiors, and live music.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU2MDk3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'luxury restaurant' },
    { name: 'Cinnamon', location: 'Jaipur', type: 'Restaurant', description: 'An elegant restaurant in a historic mansion, serving creative Indian cuisine.', image: 'https://images.unsplash.com/photo-1578422473879-05244197793d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU2MDk3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'elegant dining' },
];

export default function SearchCardPage() {
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [carPickUpDate, setCarPickUpDate] = useState<Date | undefined>();
  const [carDropOffDate, setCarDropOffDate] = useState<Date | undefined>();
  const [selectedStay, setSelectedStay] = useState<typeof rajasthanStays[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookNow = (stay: typeof rajasthanStays[0]) => {
    setSelectedStay(stay);
    setIsDialogOpen(true);
  }


  return (
    <div className="flex flex-col gap-8">
      <Card>
        <Tabs defaultValue="hotel">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hotel"><Hotel className="mr-2"/>Hotel</TabsTrigger>
            <TabsTrigger value="car"><Car className="mr-2"/>Car</TabsTrigger>
          </TabsList>
          <TabsContent value="hotel">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-location">Location</Label>
                  <Input id="hotel-location" placeholder="e.g., Jaipur" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-dates">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="hotel-dates"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !hotelDates.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelDates.from ? (
                          hotelDates.to ? (
                            <>
                              {format(hotelDates.from, "LLL dd, y")} -{" "}
                              {format(hotelDates.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(hotelDates.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick check-in/out dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={hotelDates.from}
                        selected={hotelDates}
                        onSelect={(range) => setHotelDates({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Guests</Label>
                <Select defaultValue="2">
                  <SelectTrigger id="guests">
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full"><Search className="mr-2" /> Search Hotels</Button>
              </div>
            </CardContent>
          </TabsContent>
           <TabsContent value="car">
            <CardContent className="p-4 md:p-6 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="pickup-location">Pick-up Location</Label>
                  <Input id="pickup-location" placeholder="e.g., Jaipur Airport" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff-location">Drop-off Location</Label>
                  <Input id="dropoff-location" placeholder="e.g., Jodhpur Hotel" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pickup-date">Pick-up Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !carPickUpDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {carPickUpDate ? format(carPickUpDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={carPickUpDate} onSelect={setCarPickUpDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="dropoff-date">Drop-off Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !carDropOffDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {carDropOffDate ? format(carDropOffDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={carDropOffDate} onSelect={setCarDropOffDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
              </div>
               <div>
                <Button className="w-full"><Search className="mr-2" /> Search Cars</Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Major Hotels & Restaurants in Rajasthan</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-4 pb-4">
                {rajasthanStays.map((stay) => (
                    <Card key={stay.name} className="w-[300px] overflow-hidden group">
                        <div className="relative h-40">
                            <Image
                                src={stay.image}
                                alt={`Image of ${stay.name}`}
                                data-ai-hint={stay.hint}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{stay.name}</h3>
                            <p className="text-sm text-muted-foreground">{stay.location}</p>
                            <p className="text-sm mt-2 h-10 overflow-hidden">{stay.description}</p>
                            {stay.price && (
                              <div className="flex items-center text-lg font-bold text-accent mt-4">
                                <IndianRupee className="w-5 h-5 mr-1" />
                                <span>{stay.price} <span className="text-sm font-normal text-muted-foreground">/ night</span></span>
                              </div>
                            )}
                             <div className="mt-4 flex flex-col gap-2">
                                <Button className="w-full" onClick={() => handleBookNow(stay)}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Book Now
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {selectedStay && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Your Stay at {selectedStay.name}</DialogTitle>
            </DialogHeader>
            <BookingForm tripName={selectedStay.name} />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
