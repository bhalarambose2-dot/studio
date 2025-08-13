
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
import { Calendar as CalendarIcon, Hotel, Plane, Search, Car, Utensils, User, Globe, IndianRupee, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const guides = [
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://images.unsplash.com/photo-1673807095861-04b24a39b0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxqYWlwdXIlMjBwYWxhY2V8ZW58MHx8fHwxNzU1MDU4Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaipur palace', price: '20,000' },
  { name: 'Kedarnath, Uttarakhand', description: 'A sacred Hindu temple nestled in the Himalayas, a major pilgrimage site.', image: 'https://images.unsplash.com/photo-1698574996391-73f103113f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVdHJha2hhbmQlMjB8ZW58MHx8fHwxNzU1MDU4NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'himalayan temple', price: '45,000' },
  { name: 'Goa, India', description: 'Famous for its beaches, nightlife, and Portuguese-influenced architecture.', image: 'https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxHb2F8ZW58MHx8fHwxNzU1MDU2MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'goa beach', price: '30,000' },
  { name: 'Kerala, India', description: "Known as 'God's Own Country', famous for its backwaters, lush greenery, and serene beaches.", image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzfGVufDB8fHx8MTc1NTExODc0MXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'kerala backwaters', price: '35,000' },
  { name: 'Jaisalmer, Rajasthan', description: 'The Golden City, known for its massive fort and camel safaris in the Thar Desert.', image: 'https://images.unsplash.com/photo-1713349881676-594b95a5742b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8SmFpc2FsbWVyJTIwfGVufDB8fHx8MTc1NTA2MDQ5NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaisalmer fort', price: '28,000' },
  { name: 'Jodhpur, Rajasthan', description: 'The Blue City, famous for the Mehrangarh Fort and its blue-painted houses.', image: 'https://images.unsplash.com/photo-1721973733816-1791a072295a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8Sm9kaHB1ciUyMHxlbnwwfHx8fDE3NTUwNjA3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jodhpur fort', price: '26,000' },
  { name: 'Rishikesh, Uttarakhand', description: 'The Yoga Capital of the World, known for its ashrams and adventure sports.', image: 'https://images.unsplash.com/photo-1650341259809-9314b0de9268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxSaXNoaWtlc2glMjB8ZW58MHx8fHwxNzU1MDYxMzMzfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'rishikesh bridge', price: '18,000' },
  { name: 'Nainital, Uttarakhand', description: 'A charming Himalayan lake town with a bustling market and scenic views.', image: 'https://images.unsplash.com/photo-1601622256416-d7f757f99eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxOYWluaXRhbCUyMHxlbnwwfHx8fDE3NTUwNjE0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'nainital lake', price: '22,000' },
  { name: 'Mumbai, Maharashtra', description: 'The bustling financial capital, famous for Bollywood, street food, and colonial architecture.', image: 'https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxNdW1iYWklMjB8ZW58MHx8fHwxNzU1MDYxNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'mumbai skyline', price: '32,000' },
  { name: 'Varanasi, Uttar Pradesh', description: 'The spiritual capital of India, known for its sacred ghats and Ganga Aarti.', image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMHxlbnwwfHx8fDE3NTUwNTk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'varanasi ghats', price: '25,000' },
  { name: 'Agra, Uttar Pradesh', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbHxlbnwwfHx8fDE3NTUwNjE4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'taj mahal', price: '24,000' },
  { name: 'Vrindavan, Uttar Pradesh', description: 'A holy town famous for its temples, including the stunning Prem Mandir.', image: 'https://images.unsplash.com/photo-1707938233687-47e61e5ad7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxQcmVtJTIwbWFuZGlyJTIwfGVufDB8fHx8MTc1NTA2MjI3NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'vrindavan temple', price: '20,000' },
  { name: 'Khajuraho, Madhya Pradesh', description: 'A UNESCO World Heritage site, famous for its stunning temples adorned with intricate and erotic sculptures.', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxLaGFqdXJhaG8lMjB8ZW58MHx8fHwxNzU1MDYyNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'khajuraho temple', price: '27,000' },
  { name: 'Ujjain, Madhya Pradesh', description: 'An ancient and sacred city on the Kshipra River, home to the Mahakaleshwar Jyotirlinga.', image: 'https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVamphaW4lMjB8ZW58MHx8fHwxNzU1MDYyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'ujjain temple', price: '23,000' },
];


export default function SearchCardPage() {
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [carPickUpDate, setCarPickUpDate] = useState<Date | undefined>();
  const [carDropOffDate, setCarDropOffDate] = useState<Date | undefined>();
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookNow = (guide: typeof guides[0]) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  }


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="trip" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="trip"><Plane className="mr-2" /> Trip</TabsTrigger>
              <TabsTrigger value="hotel"><Hotel className="mr-2" /> Hotel</TabsTrigger>
              <TabsTrigger value="car"><Car className="mr-2" /> Car</TabsTrigger>
              <TabsTrigger value="menu"><Utensils className="mr-2" /> Menu</TabsTrigger>
            </TabsList>
            <TabsContent value="trip" className="pt-4">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" placeholder="e.g., Paris, France" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="trip-dates">Dates</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="trip-dates"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
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
                        onSelect={(range) => setTripDates({from: range?.from, to: range?.to})}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Activities / Interests</Label>
                  <Input id="interests" placeholder="e.g., Museums, Hiking" />
                </div>
                <Button type="submit" className="w-full h-10 lg:col-span-4"><Search className="mr-2" /> Search</Button>
              </form>
            </TabsContent>
             <TabsContent value="hotel" className="pt-4">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="hotel-location">Location</Label>
                  <Input id="hotel-location" placeholder="e.g., Jaipur, India" />
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
                        onSelect={(range) => setHotelDates({from: range?.from, to: range?.to})}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Select defaultValue="2">
                    <SelectTrigger id="guests">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5+">5+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full h-10 lg:col-span-4"><Search className="mr-2" /> Search Hotels</Button>
              </form>
            </TabsContent>
            <TabsContent value="car" className="pt-4">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="pickup-location">Pick-up Location</Label>
                  <Input id="pickup-location" placeholder="e.g., Delhi Airport" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff-location">Drop-off Location</Label>
                  <Input id="dropoff-location" placeholder="e.g., Jaipur City" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-date">Pick-up Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="pickup-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !carPickUpDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {carPickUpDate ? format(carPickUpDate, "LLL dd, y") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={carPickUpDate}
                        onSelect={setCarPickUpDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="dropoff-date">Drop-off Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dropoff-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !carDropOffDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {carDropOffDate ? format(carDropOffDate, "LLL dd, y") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={carDropOffDate}
                        onSelect={setCarDropOffDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="car-type">Car Type</Label>
                  <Select defaultValue="sedan">
                    <SelectTrigger id="car-type">
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full h-10 lg:col-span-2"><Search className="mr-2" /> Search Cars</Button>
              </form>
            </TabsContent>
            <TabsContent value="menu" className="pt-4">
              <div className="text-center text-muted-foreground p-8">
                <Utensils className="mx-auto h-12 w-12" />
                <p className="mt-4">Menu section coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
          {selectedGuide && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book Your Trip to {selectedGuide.name}</DialogTitle>
                </DialogHeader>
                <BookingForm tripName={selectedGuide.name} />
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
