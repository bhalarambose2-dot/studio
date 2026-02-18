'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Calendar as CalendarIcon, Hotel, Search, Car, CreditCard, IndianRupee, Star, Bus, MapPin, Clock } from 'lucide-react';
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
        "image": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop",
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
        "image": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1932&auto=format&fit=crop",
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
        "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
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
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
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
        "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
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
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
        "hint": "kedarnath guesthouse",
        "rooms_available": 7,
        "description": "Simple and clean accommodation close to the holy temple."
    }
];

const buses = [
    {
        "name": "Raj Travels",
        "from": "Jaipur",
        "to": "Delhi",
        "time": "10:30 PM",
        "price": "850",
        "type": "AC Sleeper (2+1)",
        "rating": 4.5,
        "seats": 12
    },
    {
        "name": "Gujarat Travels",
        "from": "Udaipur",
        "to": "Ahmedabad",
        "time": "09:00 PM",
        "price": "700",
        "type": "Non-AC Sleeper",
        "rating": 4.2,
        "seats": 24
    },
    {
        "name": "Neeta Bus",
        "from": "Mumbai",
        "to": "Pune",
        "time": "07:00 AM",
        "price": "450",
        "type": "AC Seater",
        "rating": 4.7,
        "seats": 5
    },
    {
        "name": "Shrinath Travels",
        "from": "Delhi",
        "to": "Agra",
        "time": "06:30 AM",
        "price": "550",
        "type": "AC Seater",
        "rating": 4.1,
        "seats": 18
    },
    {
        "name": "VRL Travels",
        "from": "Bangalore",
        "to": "Goa",
        "time": "08:45 PM",
        "price": "1200",
        "type": "Multi-Axle AC Sleeper",
        "rating": 4.4,
        "seats": 10
    }
];

export default function SearchCardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [busDate, setBusDate] = useState<Date | undefined>();
  const [carPickUpDate, setCarPickUpDate] = useState<Date | undefined>();
  const [carDropOffDate, setCarDropOffDate] = useState<Date | undefined>();
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [displayedHotels, setDisplayedHotels] = useState(hotels);

  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [displayedBuses, setDisplayedBuses] = useState(buses);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'hotel');
  }, [searchParams]);

  const handleBookNow = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  }

  const handleHotelSearch = () => {
    if (!hotelLocation) {
        setDisplayedHotels(hotels);
        return;
    }
    const filteredHotels = hotels.filter(hotel => 
        hotel.location.toLowerCase().includes(hotelLocation.toLowerCase())
    );
    setDisplayedHotels(filteredHotels);
  };

  const handleBusSearch = () => {
    if (!busFrom && !busTo) {
        setDisplayedBuses(buses);
        return;
    }
    const filteredBuses = buses.filter(bus => 
        (busFrom ? bus.from.toLowerCase().includes(busFrom.toLowerCase()) : true) &&
        (busTo ? bus.to.toLowerCase().includes(busTo.toLowerCase()) : true)
    );
    setDisplayedBuses(filteredBuses);
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hotel"><Hotel className="mr-2 h-4 w-4"/>Hotel</TabsTrigger>
            <TabsTrigger value="bus"><Bus className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
            <TabsTrigger value="car"><Car className="mr-2 h-4 w-4"/>Car</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotel">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-location">Location</Label>
                  <Input 
                    id="hotel-location" 
                    placeholder="e.g., Jaipur" 
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                  />
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
              <Button className="w-full" onClick={handleHotelSearch}><Search className="mr-2 h-4 w-4" /> Search Hotels</Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bus-from">From</Label>
                  <Input 
                    id="bus-from" 
                    placeholder="Starting City" 
                    value={busFrom}
                    onChange={(e) => setBusFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bus-to">To</Label>
                  <Input 
                    id="bus-to" 
                    placeholder="Destination City" 
                    value={busTo}
                    onChange={(e) => setBusTo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !busDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {busDate ? format(busDate, "PPP") : <span>Journey Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={busDate} onSelect={setBusDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full" onClick={handleBusSearch}><Search className="mr-2 h-4 w-4" /> Search Buses</Button>
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
              <Button className="w-full"><Search className="mr-2 h-4 w-4" /> Search Cars</Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {activeTab === 'hotel' && (
        <section>
            <h2 className="text-2xl font-bold mb-4">Major Hotels in India</h2>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="flex w-max space-x-4 pb-4">
                    {displayedHotels.length > 0 ? (
                        displayedHotels.map((hotel) => (
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
                                    <div className="flex items-center text-lg font-bold text-accent mt-4">
                                        <IndianRupee className="w-5 h-5 mr-1" />
                                        <span>{hotel.price} <span className="text-sm font-normal text-muted-foreground">/ night</span></span>
                                    </div>
                                    <Button className="w-full mt-4" onClick={() => handleBookNow(hotel)}>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Book Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="p-10 text-muted-foreground">No hotels found for the selected location.</p>
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
      )}

      {activeTab === 'bus' && (
          <section className="space-y-4">
              <h2 className="text-2xl font-bold">Available Buses</h2>
              <div className="grid grid-cols-1 gap-4">
                  {displayedBuses.length > 0 ? (
                      displayedBuses.map((bus, idx) => (
                          <Card key={idx} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                  <div className="space-y-1">
                                      <h3 className="text-xl font-bold">{bus.name}</h3>
                                      <p className="text-sm text-muted-foreground">{bus.type}</p>
                                      <div className="flex items-center gap-4 mt-2">
                                          <div className="flex items-center gap-1 text-sm font-medium">
                                              <MapPin className="h-4 w-4 text-primary" />
                                              {bus.from} → {bus.to}
                                          </div>
                                          <div className="flex items-center gap-1 text-sm font-medium">
                                              <Clock className="h-4 w-4 text-primary" />
                                              {bus.time}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm bg-primary/10 px-3 py-1 rounded-full text-primary font-semibold">
                                      <Star className="h-4 w-4 fill-primary" />
                                      {bus.rating}
                                  </div>
                                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                      <div className="text-2xl font-bold text-accent flex items-center">
                                          <IndianRupee className="h-5 w-5" />
                                          {bus.price}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{bus.seats} seats left</p>
                                      <Button className="w-full md:w-auto" onClick={() => handleBookNow(bus)}>Book Ticket</Button>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                  ) : (
                      <p className="p-10 text-center text-muted-foreground">No buses found for this route.</p>
                  )}
              </div>
          </section>
      )}

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking for {selectedItem.name}</DialogTitle>
            </DialogHeader>
            <BookingForm tripName={`${selectedItem.name} (${activeTab === 'bus' ? `${selectedItem.from} to ${selectedItem.to}` : selectedItem.location})`} />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
