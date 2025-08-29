
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
import { Calendar as CalendarIcon, Hotel, Plane, Search, Car, Train, CreditCard, IndianRupee, Star } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


const hotels = [
    {
        "name": "Hotel Lake View",
        "location": "Udaipur",
        "price": "1200",
        "rating": 4.3,
        "facilities": ["Wi-Fi", "Breakfast", "Lake View Rooms"],
        "image": "https://placehold.co/600x400.png",
        "hint": "udaipur hotel",
        "rooms_available": 10,
        "description": "Enjoy stunning views of the lake from our comfortable rooms."
    },
    {
        "name": "Desert Safari Camp",
        "location": "Jaisalmer",
        "price": "1800",
        "rating": 4.5,
        "facilities": ["Camel Safari", "Cultural Show", "Dinner"],
        "image": "https://placehold.co/600x400.png",
        "hint": "jaisalmer desert",
        "rooms_available": 8,
        "description": "Experience the magic of the desert with our safari camps."
    },
    {
        "name": "Heritage Haveli",
        "location": "Jaipur",
        "price": "2500",
        "rating": 4.4,
        "facilities": ["Royal Rooms", "Restaurant", "Free Parking"],
        "image": "https://placehold.co/600x400.png",
        "hint": "jaipur haveli",
        "rooms_available": 6,
        "description": "Live like royalty in this beautifully restored heritage haveli."
    },
    {
        "name": "Blue City Guest House",
        "location": "Jodhpur",
        "price": "900",
        "rating": 4,
        "facilities": ["Budget Stay", "Rooftop View", "Wi-Fi"],
        "image": "https://placehold.co/600x400.png",
        "hint": "jodhpur guesthouse",
        "rooms_available": 12,
        "description": "Affordable comfort in the heart of the Blue City."
    },
    {
        "name": "Mount Abu Hill Resort",
        "location": "Mount Abu",
        "price": "2000",
        "rating": 4.2,
        "facilities": ["Hill View", "Garden", "Restaurant"],
        "image": "https://placehold.co/600x400.png",
        "hint": "mount abu resort",
        "rooms_available": 5,
        "description": "Relax and rejuvenate amidst the serene hills of Mount Abu."
    },
    {
        "name": "Kedarnath Guest House",
        "location": "Kedarnath",
        "price": "1500",
        "rating": 4.1,
        "facilities": ["Basic Stay", "Hot Water", "Near Temple"],
        "image": "https://placehold.co/600x400.png",
        "hint": "kedarnath guesthouse",
        "rooms_available": 7,
        "description": "Simple and clean accommodation close to the holy temple."
    },
    {
        "name": "Vaishno Devi Lodge",
        "location": "Katra",
        "price": "1000",
        "rating": 3.9,
        "facilities": ["Budget Rooms", "Restaurant", "Taxi Service"],
        "image": "https://placehold.co/600x400.png",
        "hint": "katra lodge",
        "rooms_available": 9,
        "description": "Conveniently located for pilgrims visiting Vaishno Devi."
    },
    {
        "name": "Mumbai Beach Hotel",
        "location": "Mumbai",
        "price": "3500",
        "rating": 4.6,
        "facilities": ["Sea View", "Swimming Pool", "Restaurant"],
        "image": "https://placehold.co/600x400.png",
        "hint": "mumbai hotel",
        "rooms_available": 15,
        "description": "Luxurious stay with breathtaking views of the Arabian Sea."
    },
    {
        "name": "Delhi City Inn",
        "location": "Delhi",
        "price": "2200",
        "rating": 4.2,
        "facilities": ["AC Rooms", "Free Wi-Fi", "Restaurant"],
        "image": "https://placehold.co/600x400.png",
        "hint": "delhi inn",
        "rooms_available": 11,
        "description": "A comfortable and modern hotel in the bustling capital city."
    },
    {
        "name": "Bangalore Tech Park Hotel",
        "location": "Bangalore",
        "price": "2800",
        "rating": 4.4,
        "facilities": ["Business Rooms", "Gym", "Wi-Fi"],
        "image": "https://placehold.co/600x400.png",
        "hint": "bangalore hotel",
        "rooms_available": 10,
        "description": "Ideal for business travelers with state-of-the-art facilities."
    }
];

export default function SearchCardPage() {
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [carPickUpDate, setCarPickUpDate] = useState<Date | undefined>();
  const [carDropOffDate, setCarDropOffDate] = useState<Date | undefined>();
  const [selectedStay, setSelectedStay] = useState<typeof hotels[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainDate, setTrainDate] = useState<Date | undefined>();

  const handleBookNow = (stay: typeof hotels[0]) => {
    setSelectedStay(stay);
    setIsDialogOpen(true);
  }


  return (
    <div className="flex flex-col gap-8">
      <Card>
        <Tabs defaultValue="hotel">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hotel"><Hotel className="mr-2"/>Hotel</TabsTrigger>
            <TabsTrigger value="car"><Car className="mr-2"/>Car</TabsTrigger>
            <TabsTrigger value="train"><Train className="mr-2"/>Train & Bus</TabsTrigger>
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
          <TabsContent value="train">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-location">From</Label>
                  <Input id="from-location" placeholder="e.g., Jaipur" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-location">To</Label>
                  <Input id="to-location" placeholder="e.g., Jodhpur" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="train-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !trainDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {trainDate ? format(trainDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={trainDate} onSelect={setTrainDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Button className="w-full"><Search className="mr-2" /> Search Trains & Buses</Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Major Hotels in India</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-4 pb-4">
                {hotels.map((hotel) => (
                    <Card key={hotel.name} className="w-[300px] overflow-hidden group">
                        <div className="relative h-40">
                            <Image
                                src={hotel.image}
                                alt={`Image of ${hotel.name}`}
                                data-ai-hint={hotel.hint}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{hotel.name}</h3>
                            <p className="text-sm text-muted-foreground">{hotel.location}</p>
                            <div className="flex items-center text-sm mt-1">
                                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{hotel.rating}</span>
                                <span className="text-muted-foreground ml-1">({hotel.rooms_available} rooms)</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-2 items-center">
                                {hotel.facilities.map(f => (
                                    <span key={f} className="flex items-center text-xs bg-muted px-2 py-1 rounded-full">{f}</span>
                                ))}
                            </div>
                            {hotel.price && (
                              <div className="flex items-center text-lg font-bold text-accent mt-4">
                                <IndianRupee className="w-5 h-5 mr-1" />
                                <span>{hotel.price} <span className="text-sm font-normal text-muted-foreground">/ night</span></span>
                              </div>
                            )}
                             <div className="mt-4 flex flex-col gap-2">
                                <Button className="w-full" onClick={() => handleBookNow(hotel)}>
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
