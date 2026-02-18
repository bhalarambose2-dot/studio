
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { Calendar as CalendarIcon, Hotel, Search, Car, CreditCard, IndianRupee, Star, Bus, MapPin, Clock, Info, ShieldCheck, Bike, Zap, Navigation, Map } from 'lucide-react';
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
        "location": "Udaipur, Rajasthan",
        "price": "1200",
        "rating": 4.3,
        "facilities": ["Wi-Fi", "Breakfast", "Lake View Rooms"],
        "image": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop",
        "hint": "udaipur hotel",
        "rooms_available": 10,
        "description": "Enjoy stunning views of the lake from our comfortable rooms in the City of Lakes."
    },
    {
        "name": "Desert Safari Camp",
        "location": "Jaisalmer, Rajasthan",
        "price": "1800",
        "rating": 4.5,
        "facilities": ["Camel Safari", "Cultural Show", "Dinner"],
        "image": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1932&auto=format&fit=crop",
        "hint": "jaisalmer desert",
        "rooms_available": 8,
        "description": "Experience the magic of the Thar desert with our premium safari camps."
    },
    {
        "name": "Heritage Haveli",
        "location": "Jaipur, Rajasthan",
        "price": "2500",
        "rating": 4.4,
        "facilities": ["Royal Rooms", "Restaurant", "Free Parking"],
        "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
        "hint": "jaipur haveli",
        "rooms_available": 6,
        "description": "Live like royalty in this beautifully restored heritage haveli in the Pink City."
    },
    {
        "name": "Blue City Boutique",
        "location": "Jodhpur, Rajasthan",
        "price": "1500",
        "rating": 4.6,
        "facilities": ["Fort View", "Rooftop Cafe", "Guided Tours"],
        "image": "https://images.unsplash.com/photo-1721973733816-1791a072295a?q=80&w=1080&auto=format&fit=crop",
        "hint": "jodhpur boutique",
        "rooms_available": 5,
        "description": "Beautiful rooms with a stunning view of Mehrangarh Fort."
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
        "name": "Marwar Express",
        "busNumber": "RJ-19-AX-7788",
        "from": "Jodhpur",
        "to": "Udaipur",
        "departure": "08:00 AM",
        "arrival": "02:00 PM",
        "duration": "6h 00m",
        "price": "550",
        "type": "AC Seater",
        "rating": 4.4,
        "seats": 15,
        "amenities": ["Pushback Seats", "CCTV"]
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
    }
];

const bikes = [
    {
        "name": "Standard Ride (Bike Taxi)",
        "location": "Jodhpur",
        "price": "15",
        "priceUnit": "/km",
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop",
        "hint": "bike ride",
        "type": "Rapido Style",
        "isTaxi": true,
        "description": "Sahi Nivesh ke saath sahi safar. Jodhpur city mein asani se ride book karein."
    },
    {
        "name": "Premium Ride (Royal Enfield)",
        "location": "Jodhpur",
        "price": "30",
        "priceUnit": "/km",
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop",
        "hint": "bullet ride",
        "type": "Premium Taxi",
        "isTaxi": true,
        "description": "Blue City ki galliyon mein Bullet ride ka maza."
    },
    {
        "name": "Quick Activa Ride",
        "location": "Jodhpur",
        "price": "10",
        "priceUnit": "/km",
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1620939511593-3cd71350645f?q=80&w=1974&auto=format&fit=crop",
        "hint": "scooter ride",
        "type": "Economy Taxi",
        "isTaxi": true,
        "description": "Short distance ke liye fast aur sasti bike taxi."
    }
];

export default function SearchCardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [busDate, setBusDate] = useState<Date | undefined>();
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [displayedHotels, setDisplayedHotels] = useState(hotels);

  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [displayedBuses, setDisplayedBuses] = useState(buses);

  const [bikeLocation, setBikeLocation] = useState('Jodhpur');
  const [displayedBikes, setDisplayedBikes] = useState(bikes);

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
        hotel.location.toLowerCase().includes(hotelLocation.toLowerCase()) ||
        hotel.name.toLowerCase().includes(hotelLocation.toLowerCase())
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

  const handleBikeSearch = () => {
    if (!bikeLocation) {
        setDisplayedBikes(bikes);
        return;
    }
    const filteredBikes = bikes.filter(bike => 
        bike.location.toLowerCase().includes(bikeLocation.toLowerCase())
    );
    setDisplayedBikes(filteredBikes);
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-16 bg-muted/30 p-1">
            <TabsTrigger value="hotel" className="text-xs font-black italic uppercase"><Hotel className="mr-2 h-4 w-4"/>Hotel</TabsTrigger>
            <TabsTrigger value="bus" className="text-xs font-black italic uppercase"><Bus className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
            <TabsTrigger value="bike" className="text-xs font-black italic uppercase relative">
                <Bike className="mr-2 h-4 w-4"/>Bike Taxi
                <Badge className="absolute -top-1 -right-1 bg-primary text-white text-[8px] h-4 px-1 border-none animate-pulse">LIVE</Badge>
            </TabsTrigger>
            <TabsTrigger value="car" className="text-xs font-black italic uppercase"><Car className="mr-2 h-4 w-4"/>Cab</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotel">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rajasthan Location</Label>
                  <Input 
                    placeholder="e.g., Udaipur, Jaipur" 
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                    className="h-14 rounded-2xl border-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check-in / Out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-14 rounded-2xl",
                          !hotelDates.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelDates.from ? (
                          hotelDates.to ? (
                            <>
                              {format(hotelDates.from, "LLL dd")} - {format(hotelDates.to, "LLL dd")}
                            </>
                          ) : (
                            format(hotelDates.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick Dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={hotelDates}
                        onSelect={(range) => setHotelDates({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={handleHotelSearch}>
                <Search className="mr-2 h-6 w-6" /> SEARCH RAJASTHAN HOTELS
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">From City</Label>
                  <Input 
                    placeholder="Starting From" 
                    value={busFrom}
                    onChange={(e) => setBusFrom(e.target.value)}
                    className="h-14 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">To City</Label>
                  <Input 
                    placeholder="Going To" 
                    value={busTo}
                    onChange={(e) => setBusTo(e.target.value)}
                    className="h-14 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 rounded-2xl justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {busDate ? format(busDate, "PPP") : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={busDate} onSelect={setBusDate} /></PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={handleBusSearch}>
                <Search className="mr-2 h-6 w-6" /> SEARCH RAJASTHAN BUSES
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bike">
            <CardContent className="p-6 md:p-10 space-y-6">
              <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-primary p-3 rounded-2xl shadow-lg">
                        <Zap className="text-white h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tighter">RAPIDO STYLE RIDE</h3>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Available in Jodhpur (Expanding Soon in Rajasthan)</p>
                    </div>
                </div>
                <Badge className="bg-green-500 text-white border-none font-black italic">ACTIVE NOW</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup Location</Label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                    <Input 
                        placeholder="Current Location in Jodhpur" 
                        value={bikeLocation}
                        onChange={(e) => setBikeLocation(e.target.value)}
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-primary/5 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ride Time</Label>
                  <Button variant="outline" className="w-full h-14 rounded-2xl justify-start font-bold">
                    <Clock className="mr-2 h-4 w-4" /> Immediate (Within 5 mins)
                  </Button>
                </div>
              </div>

              {/* Live Map Status Section */}
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white relative h-64 md:h-80 group">
                  <Image 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                    alt="Jodhpur Live Map"
                    data-ai-hint="jodhpur map"
                    fill
                    className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Simulated Live Biker Icons */}
                  <div className="absolute top-1/4 left-1/3 animate-bounce">
                    <div className="bg-primary p-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),1)] border-2 border-white">
                        <Bike className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 animate-pulse">
                    <div className="bg-primary p-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),1)] border-2 border-white">
                        <Bike className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-1/2 animate-bounce delay-700">
                    <div className="bg-primary p-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),1)] border-2 border-white">
                        <Bike className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-black italic tracking-tighter text-xl">LIVE MAP STATUS</h4>
                        <div className="flex items-center gap-2 text-[10px] text-white/80 font-bold uppercase tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                            8 Bikers Near You (Jodhpur)
                        </div>
                    </div>
                    <Link href={`https://www.google.com/maps/search/Jodhpur+Traffic/@26.2389,73.0243,13z`} target="_blank">
                        <Button variant="secondary" size="sm" className="font-black italic uppercase text-[10px] h-10 rounded-xl">
                            <Map className="mr-2 h-4 w-4" /> Full Map
                        </Button>
                    </Link>
                  </div>
              </Card>

              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={handleBikeSearch}>
                <Zap className="mr-2 h-6 w-6" /> FIND RIDE IN JODHPUR
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="car">
            <CardContent className="p-6 md:p-10 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup (Rajasthan)</Label>
                  <Input placeholder="e.g., Jaipur Airport" className="h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Drop</Label>
                  <Input placeholder="e.g., Hotel Name" className="h-14 rounded-2xl" />
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl">
                <Search className="mr-2 h-6 w-6" /> SEARCH RAJASTHAN CABS
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {activeTab === 'hotel' && (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic tracking-tighter">RAJASTHAN HOTELS</h2>
                <Badge variant="outline" className="font-bold border-primary/20 text-primary">{displayedHotels.length} Results</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedHotels.map((hotel) => (
                    <Card key={hotel.name} className="overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] bg-white">
                        <div className="relative h-48">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                data-ai-hint={hotel.hint}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-xl italic uppercase">{hotel.name}</h3>
                                <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-black">
                                    {hotel.rating} <Star className="w-3 h-3 ml-1 fill-green-700" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4 font-medium uppercase tracking-widest text-[10px]">
                                <MapPin className="w-3 h-3" /> {hotel.location}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {hotel.facilities.map(f => (
                                    <span key={f} className="text-[10px] bg-muted px-3 py-1 rounded-full text-muted-foreground font-bold uppercase tracking-tighter">{f}</span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-auto border-t pt-4">
                                <div className="text-2xl font-black text-primary italic">
                                    ₹{hotel.price}<span className="text-[10px] font-medium text-muted-foreground not-italic">/night</span>
                                </div>
                                <Button className="rounded-xl font-bold italic px-6" onClick={() => handleBookNow(hotel)}>BOOK NOW</Button>
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
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">Rajasthan Bus Routes</h2>
                  <Badge className="bg-primary text-white border-none font-black italic">{displayedBuses.length} Buses Found</Badge>
              </div>
              <div className="grid grid-cols-1 gap-8">
                  {displayedBuses.length > 0 ? (
                      displayedBuses.map((bus, idx) => (
                          <Card key={idx} className="border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden rounded-[2.5rem] bg-white border-l-8 border-l-primary">
                              <CardContent className="p-0">
                                  <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                      <div className="flex-grow space-y-6">
                                          <div className="flex items-center justify-between md:justify-start gap-4">
                                              <h3 className="text-2xl font-black italic tracking-tighter text-foreground">{bus.name}</h3>
                                              <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-primary/20 text-primary">{bus.busNumber}</Badge>
                                          </div>
                                          
                                          <div className="flex items-center gap-12 py-2 relative">
                                              <div className="flex flex-col">
                                                  <span className="text-3xl font-black italic">{bus.departure}</span>
                                                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{bus.from}</span>
                                              </div>
                                              
                                              <div className="flex flex-col items-center flex-grow max-w-[150px]">
                                                  <span className="text-[10px] font-black text-primary mb-2 italic">{bus.duration}</span>
                                                  <div className="w-full h-[2px] bg-primary/20 relative flex justify-center items-center">
                                                      <div className="w-2.5 h-2.5 rounded-full bg-primary absolute left-0 shadow-lg shadow-primary/40"></div>
                                                      <Bus className="h-5 w-5 text-primary bg-white p-1 rounded-full border border-primary/20 z-10" />
                                                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 absolute right-0"></div>
                                                  </div>
                                                  <span className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest">Express Trip</span>
                                              </div>

                                              <div className="flex flex-col text-right">
                                                  <span className="text-3xl font-black italic">{bus.arrival}</span>
                                                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{bus.to}</span>
                                              </div>
                                          </div>

                                          <div className="flex flex-wrap gap-2 pt-2">
                                              <Badge className="bg-muted text-foreground border-none text-[10px] font-black uppercase">{bus.type}</Badge>
                                              {bus.amenities.map(a => (
                                                  <span key={a} className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-3 py-1 rounded-full italic font-medium">
                                                      <ShieldCheck className="h-3 w-3 text-green-600" /> {a}
                                                  </span>
                                              ))}
                                          </div>
                                      </div>

                                      <div className="w-full md:w-px h-px md:h-32 bg-border"></div>

                                      <div className="flex flex-col items-end gap-4 w-full md:w-auto min-w-[180px]">
                                          <div className="flex flex-col items-end">
                                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fare Starts From</span>
                                              <div className="text-4xl font-black text-primary italic flex items-center">
                                                  <IndianRupee className="h-8 w-8" />
                                                  {bus.price}
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-1 text-xs font-black text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                  <Star className="h-3 w-3 fill-green-700" />
                                                  {bus.rating}
                                              </div>
                                              <span className="text-[10px] text-destructive font-black uppercase tracking-tighter">{bus.seats} Seats Left</span>
                                          </div>
                                          <Button className="w-full h-12 font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-xl" onClick={() => handleBookNow(bus)}>BOOK TICKET</Button>
                                      </div>
                                  </div>
                                  <div className="bg-muted/30 px-8 py-3 flex items-center gap-6 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                      <span className="flex items-center gap-2"><Info className="h-3.5 w-3.5 text-primary" /> Live Tracking</span>
                                      <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Sahi Nivesh Insured</span>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                  ) : (
                      <div className="text-center py-24 bg-muted/10 rounded-[3rem] border-4 border-dashed border-muted/30">
                          <Bus className="h-20 w-20 mx-auto text-muted-foreground opacity-20 mb-6" />
                          <h3 className="text-2xl font-black italic tracking-tighter text-muted-foreground">No Buses Found</h3>
                          <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto mt-2">Humne koi buses nahi payi is route par. Kripya cities check karein.</p>
                          <Button variant="link" className="mt-4 font-black italic uppercase" onClick={() => setDisplayedBuses(buses)}>Show All Routes</Button>
                      </div>
                  )}
              </div>
          </section>
      )}

      {activeTab === 'bike' && (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic tracking-tighter text-primary">BIKE TAXI IN {bikeLocation}</h2>
                <Badge className="bg-primary text-white border-none font-black italic animate-bounce">RAPIDO STYLE</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedBikes.map((bike) => (
                    <Card key={bike.name} className="overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all rounded-[2.5rem] bg-white relative">
                        {bike.isTaxi && (
                          <div className="absolute top-4 left-4 z-20">
                            <Badge className="bg-primary text-white border-none font-black italic px-3 py-1 shadow-lg">TAXI RIDE</Badge>
                          </div>
                        )}
                        <div className="relative h-56">
                            <Image
                                src={bike.image}
                                alt={bike.name}
                                data-ai-hint={bike.hint}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-6 text-white">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Jodhpur City</p>
                                <h3 className="font-black text-2xl italic tracking-tighter">{bike.name}</h3>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Badge variant="secondary" className="text-[10px] font-black uppercase italic tracking-widest bg-primary/10 text-primary border-none">{bike.type}</Badge>
                                <div className="flex items-center text-primary font-black">
                                    <Star className="w-4 h-4 mr-1 fill-primary" />
                                    {bike.rating}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-6 line-clamp-2 font-medium">{bike.description}</p>
                            <div className="flex items-center justify-between mt-auto border-t pt-4">
                                <div className="text-3xl font-black text-primary italic">
                                    ₹{bike.price}<span className="text-[10px] font-medium text-muted-foreground not-italic">{bike.priceUnit || '/day'}</span>
                                </div>
                                <Button className="h-12 rounded-xl font-black italic uppercase px-6 shadow-lg shadow-primary/20" onClick={() => handleBookNow(bike)}>
                                  <Zap className="mr-2 h-4 w-4" />
                                  BOOK RIDE
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="bg-primary/5 p-8 rounded-[3rem] border-2 border-dashed border-primary/20 text-center space-y-4">
                <h3 className="text-2xl font-black italic tracking-tighter">BIKE CHALAYEIN AUR KAMAYEIN (PARTNER WITH US)</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-2xl mx-auto">Agar aapke paas bike hai aur aap Rajasthan mein extra kamai karna chahte hain, toh aaj hi humare saath judiye. "Sahi Nivesh" se apni bike ko taxi banayein.</p>
                <Link href="/partnership">
                  <Button variant="outline" className="mt-4 border-primary text-primary font-black italic uppercase h-12 rounded-xl hover:bg-primary hover:text-white transition-all">BECOME A PARTNER</Button>
                </Link>
            </div>
        </section>
      )}

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-3xl font-black italic tracking-tighter">
                {activeTab === 'bus' ? <Bus className="text-primary h-8 w-8" /> : activeTab === 'bike' ? <Zap className="text-primary h-8 w-8" /> : <Hotel className="text-primary h-8 w-8" />}
                CONFIRM {activeTab === 'bus' ? 'BUS TICKET' : activeTab === 'bike' ? 'BIKE RIDE' : 'BOOKING'}
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
                {activeTab === 'bus' 
                    ? `Booking seat on ${selectedItem.name} (${selectedItem.busNumber}) from ${selectedItem.from} to ${selectedItem.to}.` 
                    : activeTab === 'bike'
                    ? `Confirming ${selectedItem.name} for your immediate ride in Jodhpur.`
                    : `Confirming your stay at ${selectedItem.name}, ${selectedItem.location}.`
                }
              </DialogDescription>
            </DialogHeader>
            <BookingForm 
                tripName={activeTab === 'bus' 
                    ? `${selectedItem.name} - ${selectedItem.busNumber} (${selectedItem.from} to ${selectedItem.to})` 
                    : activeTab === 'bike'
                    ? `${selectedItem.name} (Bike Taxi Jodhpur)`
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
