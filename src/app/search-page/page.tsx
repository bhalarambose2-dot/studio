'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Calendar as CalendarIcon, Hotel, Search, Car, CreditCard, IndianRupee, Star, Bus, MapPin, Clock, Info, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

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
    }
];

const buses = [
    {
        "name": "Raj Travels",
        "busNumber": "RJ-14-PB-2024",
        "from": "Jaipur",
        "to": "Delhi",
        "departure": "10:30 PM",
        "arrival": "04:30 AM",
        "duration": "6h 00m",
        "price": "850",
        "type": "AC Sleeper (2+1)",
        "rating": 4.5,
        "seats": 12,
        "amenities": ["Water Bottle", "Blanket", "Charging Point"]
    },
    {
        "name": "Gujarat Travels",
        "busNumber": "GJ-01-AX-9988",
        "from": "Udaipur",
        "to": "Ahmedabad",
        "departure": "09:00 PM",
        "arrival": "03:00 AM",
        "duration": "6h 00m",
        "price": "700",
        "type": "Non-AC Sleeper",
        "rating": 4.2,
        "seats": 24,
        "amenities": ["Emergency Exit", "Reading Light"]
    },
    {
        "name": "Neeta Bus",
        "busNumber": "MH-04-BT-1122",
        "from": "Mumbai",
        "to": "Pune",
        "departure": "07:00 AM",
        "arrival": "10:30 AM",
        "duration": "3h 30m",
        "price": "450",
        "type": "AC Seater",
        "rating": 4.7,
        "seats": 5,
        "amenities": ["Leg Rest", "CCTV", "Movies"]
    },
    {
        "name": "Shrinath Travels",
        "busNumber": "DL-01-RT-5566",
        "from": "Delhi",
        "to": "Agra",
        "departure": "06:30 AM",
        "arrival": "10:30 AM",
        "duration": "4h 00m",
        "price": "550",
        "type": "AC Seater",
        "rating": 4.1,
        "seats": 18,
        "amenities": ["WiFi", "Water Bottle"]
    },
    {
        "name": "VRL Travels",
        "busNumber": "KA-01-VK-7744",
        "from": "Bangalore",
        "to": "Goa",
        "departure": "08:45 PM",
        "arrival": "08:00 AM",
        "duration": "11h 15m",
        "price": "1200",
        "type": "Multi-Axle AC Sleeper",
        "rating": 4.4,
        "seats": 10,
        "amenities": ["Pillow", "Snacks", "SOS Button"]
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
    <div className="flex flex-col gap-8 pb-20">
      <Card className="border-none shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1">
            <TabsTrigger value="hotel" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><Hotel className="mr-2 h-4 w-4"/>Hotel</TabsTrigger>
            <TabsTrigger value="bus" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><Bus className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
            <TabsTrigger value="car" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><Car className="mr-2 h-4 w-4"/>Car</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotel">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-location">Destination</Label>
                  <Input 
                    id="hotel-location" 
                    placeholder="Enter city or hotel name" 
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                    className="h-11"
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
                          "w-full justify-start text-left font-normal h-11",
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
              <Button className="w-full h-11 text-lg font-semibold shadow-lg shadow-primary/20" onClick={handleHotelSearch}>
                <Search className="mr-2 h-5 w-5" /> Search Hotels
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bus-from">From City</Label>
                  <Input 
                    id="bus-from" 
                    placeholder="Starting From" 
                    value={busFrom}
                    onChange={(e) => setBusFrom(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bus-to">To City</Label>
                  <Input 
                    id="bus-to" 
                    placeholder="Going To" 
                    value={busTo}
                    onChange={(e) => setBusTo(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Travel Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-11",
                          !busDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {busDate ? format(busDate, "PPP") : <span>Select Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={busDate} onSelect={setBusDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full h-11 text-lg font-semibold shadow-lg shadow-primary/20" onClick={handleBusSearch}>
                <Search className="mr-2 h-5 w-5" /> Search Buses
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="car">
            <CardContent className="p-4 md:p-6 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="pickup-location">Pick-up Location</Label>
                  <Input id="pickup-location" placeholder="e.g., Jaipur Airport" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff-location">Drop-off Location</Label>
                  <Input id="dropoff-location" placeholder="e.g., Hotel Name" className="h-11" />
                </div>
              </div>
              <Button className="w-full h-11 text-lg font-semibold shadow-lg shadow-primary/20">
                <Search className="mr-2 h-5 w-5" /> Search Cabs
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {activeTab === 'hotel' && (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Top Hotels</h2>
                <Badge variant="outline">{displayedHotels.length} Results</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedHotels.map((hotel) => (
                    <Card key={hotel.name} className="overflow-hidden group border-none shadow-md hover:shadow-xl transition-all">
                        <div className="relative h-48">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                data-ai-hint={hotel.hint}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{hotel.name}</h3>
                                <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                                    {hotel.rating} <Star className="w-3 h-3 ml-1 fill-green-700" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                                <MapPin className="w-3 h-3" /> {hotel.location}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {hotel.facilities.map(f => (
                                    <span key={f} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{f}</span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-lg font-bold text-primary">
                                    ₹{hotel.price}<span className="text-xs font-normal text-muted-foreground">/night</span>
                                </div>
                                <Button size="sm" onClick={() => handleBookNow(hotel)}>Book Now</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      )}

      {activeTab === 'bus' && (
          <section className="space-y-6">
              <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Available Bus Routes</h2>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{displayedBuses.length} Buses Found</Badge>
              </div>
              <div className="grid grid-cols-1 gap-6">
                  {displayedBuses.length > 0 ? (
                      displayedBuses.map((bus, idx) => (
                          <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden border-l-4 border-l-primary">
                              <CardContent className="p-0">
                                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                      <div className="flex-grow space-y-4">
                                          <div className="flex items-center justify-between md:justify-start gap-4">
                                              <h3 className="text-xl font-black text-foreground">{bus.name}</h3>
                                              <Badge variant="outline" className="text-[10px] font-mono tracking-tighter uppercase">{bus.busNumber}</Badge>
                                          </div>
                                          
                                          <div className="flex items-center gap-8 py-2 relative">
                                              <div className="flex flex-col">
                                                  <span className="text-2xl font-bold">{bus.departure}</span>
                                                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{bus.from}</span>
                                              </div>
                                              
                                              <div className="flex flex-col items-center flex-grow max-w-[120px]">
                                                  <span className="text-[10px] text-muted-foreground mb-1">{bus.duration}</span>
                                                  <div className="w-full h-[1px] bg-muted-foreground/30 relative flex justify-center items-center">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-primary absolute left-0"></div>
                                                      <Bus className="h-3 w-3 text-primary bg-background p-0.5" />
                                                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground absolute right-0"></div>
                                                  </div>
                                                  <span className="text-[10px] text-muted-foreground mt-1">Direct</span>
                                              </div>

                                              <div className="flex flex-col text-right">
                                                  <span className="text-2xl font-bold">{bus.arrival}</span>
                                                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{bus.to}</span>
                                              </div>
                                          </div>

                                          <div className="flex flex-wrap gap-2 pt-2">
                                              <Badge variant="secondary" className="text-[10px] font-normal">{bus.type}</Badge>
                                              {bus.amenities.map(a => (
                                                  <span key={a} className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded italic">
                                                      <ShieldCheck className="h-3 w-3 text-green-600" /> {a}
                                                  </span>
                                              ))}
                                          </div>
                                      </div>

                                      <div className="w-full md:w-px h-px md:h-24 bg-border"></div>

                                      <div className="flex flex-col items-end gap-3 w-full md:w-auto min-w-[150px]">
                                          <div className="flex flex-col items-end">
                                              <span className="text-xs text-muted-foreground">Fare Starts From</span>
                                              <div className="text-3xl font-black text-primary flex items-center">
                                                  <IndianRupee className="h-6 w-6" />
                                                  {bus.price}
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                  <Star className="h-3 w-3 fill-green-600" />
                                                  {bus.rating}
                                              </div>
                                              <span className="text-xs text-destructive font-bold">{bus.seats} Seats Left</span>
                                          </div>
                                          <Button className="w-full font-bold shadow-lg shadow-primary/20" onClick={() => handleBookNow(bus)}>Book Ticket</Button>
                                      </div>
                                  </div>
                                  <div className="bg-muted/30 px-6 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                                      <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Live Tracking Available</span>
                                      <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> Insured Trip</span>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                  ) : (
                      <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed border-muted">
                          <Bus className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
                          <h3 className="text-xl font-bold text-muted-foreground">No Buses Found</h3>
                          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">Humne koi buses nahi payi is route par. Kripya cities check karein.</p>
                          <Button variant="link" onClick={() => setDisplayedBuses(buses)}>Show All Routes</Button>
                      </div>
                  )}
              </div>
          </section>
      )}

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {activeTab === 'bus' ? <Bus className="text-primary" /> : <Hotel className="text-primary" />}
                Confirm {activeTab === 'bus' ? 'Bus Ticket' : 'Booking'}
              </DialogTitle>
              <DialogDescription>
                {activeTab === 'bus' 
                    ? `Booking seat on ${selectedItem.name} (${selectedItem.busNumber}) from ${selectedItem.from} to ${selectedItem.to}.` 
                    : `Confirming your stay at ${selectedItem.name}, ${selectedItem.location}.`
                }
              </DialogDescription>
            </DialogHeader>
            <BookingForm 
                tripName={activeTab === 'bus' 
                    ? `${selectedItem.name} - ${selectedItem.busNumber} (${selectedItem.from} to ${selectedItem.to})` 
                    : `${selectedItem.name} (${selectedItem.location})`
                } 
                bookingType={activeTab}
                itemDetails={selectedItem}
            />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
