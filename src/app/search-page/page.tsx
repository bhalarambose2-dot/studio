'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { 
  Calendar as CalendarIcon, 
  Hotel, 
  Search, 
  Car, 
  IndianRupee, 
  Star, 
  Bus, 
  MapPin, 
  Clock, 
  Info, 
  ShieldCheck, 
  Bike, 
  Zap, 
  Navigation, 
  Map, 
  X, 
  LocateFixed, 
  Loader2, 
  Sparkles, 
  Route 
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const rajasthanCities = [
  'Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Bikaner', 'Pushkar', 'Ajmer', 'Mount Abu', 'Chittorgarh', 'Alwar', 'Kota', 'Sikar'
];

const hotels = [
    {
        "name": "Hotel Lake View",
        "location": "Udaipur, Rajasthan",
        "price": 1200,
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
        "price": 3500,
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
        "price": 6500,
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
        "price": 1800,
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
        "price": 850,
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
        "price": 550,
        "type": "AC Seater",
        "rating": 4.4,
        "seats": 15,
        "amenities": ["Pushback Seats", "CCTV"]
    }
];

const bikeRides = [
    {
        "name": "Bullet Standard",
        "type": "Premium Ride",
        "price": 18,
        "location": "Jodhpur City",
        "rating": 4.9,
        "time": "4 min away",
        "status": "Available Now",
        "hint": "bullet bike"
    },
    {
        "name": "Activa Fast",
        "type": "Quick Ride",
        "price": 12,
        "location": "Sardarpura",
        "rating": 4.7,
        "time": "2 min away",
        "status": "Available Now",
        "hint": "scooter bike"
    }
];

const cabs = [
    {
        "name": "Mini Cab",
        "type": "Sedan",
        "price": 45,
        "rating": 4.8,
        "time": "5 min away",
        "description": "Perfect for city rides."
    },
    {
        "name": "Prime SUV",
        "type": "SUV",
        "price": 85,
        "rating": 4.9,
        "time": "8 min away",
        "description": "Extra space for family."
    }
];

export default function SearchCardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [displayedHotels, setDisplayedHotels] = useState(hotels);

  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [displayedBuses, setDisplayedBuses] = useState(buses);

  const [bikePickup, setBikePickup] = useState('');
  const [bikeDrop, setBikeDrop] = useState('');
  const [carPickup, setCarPickup] = useState('');
  const [carDrop, setCarDrop] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleBookNow = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  }

  const handleBookingSuccess = () => {
    setIsDialogOpen(false);
    if (activeTab === 'bike' || activeTab === 'car') {
      setIsRouteMapOpen(true);
    }
  };

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

  const detectLocation = (type: 'bike' | 'car') => {
    setIsDetectingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationStr = `Current Phone Location - Rajasthan`;
          if (type === 'bike') setBikePickup(locationStr);
          if (type === 'car') setCarPickup(locationStr);
          setIsDetectingLocation(false);
          toast({
            title: "Location Found!",
            description: "Aapki current phone location detect kar li gayi hai.",
          });
        },
        (error) => {
          const fallback = 'Current Location (Rajasthan)';
          if (type === 'bike') setBikePickup(fallback);
          if (type === 'car') setCarPickup(fallback);
          setIsDetectingLocation(false);
          toast({
            title: "Location Detected",
            description: "GPS permission ke bina humne aapki city estimate ki hai.",
          });
        },
        { timeout: 10000 }
      );
    } else {
        const fallback = 'Current Location (Rajasthan)';
        if (type === 'bike') setBikePickup(fallback);
        if (type === 'car') setCarPickup(fallback);
        setIsDetectingLocation(false);
        toast({
          title: "Browser Error",
          description: "Aapka browser location support nahi karta.",
          variant: "destructive"
        });
    }
  }

  const QuickSelectRajasthan = ({ onSelect }: { onSelect: (city: string) => void }) => (
    <div className="mt-3">
        <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Popular in Rajasthan
        </p>
        <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
                {rajasthanCities.map(city => (
                    <Badge 
                        key={city} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-all rounded-xl font-bold italic px-3"
                        onClick={() => onSelect(city)}
                    >
                        {city}
                    </Badge>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );

  const getMapLocations = () => {
    const pickup = activeTab === 'bike' ? bikePickup : carPickup;
    const drop = activeTab === 'bike' ? bikeDrop : carDrop;
    return { pickup: pickup || 'Jodhpur, Rajasthan', drop: drop || 'Udaipur, Rajasthan' };
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-16 bg-muted/30 p-1">
            <TabsTrigger value="hotel" className="text-[10px] md:text-xs font-black italic uppercase"><Hotel className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4"/>Hotel</TabsTrigger>
            <TabsTrigger value="bus" className="text-[10px] md:text-xs font-black italic uppercase"><Bus className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4"/>Bus</TabsTrigger>
            <TabsTrigger value="bike" className="text-[10px] md:text-xs font-black italic uppercase"><Bike className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4"/>Bike</TabsTrigger>
            <TabsTrigger value="car" className="text-[10px] md:text-xs font-black italic uppercase"><Car className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4"/>Cab</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotel">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rajasthan Location (All RJ)</Label>
                  <Input 
                    placeholder="Search Jaipur, Udaipur, Jodhpur..." 
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                    className="h-14 rounded-2xl border-muted"
                  />
                  <QuickSelectRajasthan onSelect={setHotelLocation} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check-in / Out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-14 rounded-2xl")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Pick Dates
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="range" selected={hotelDates} onSelect={(range) => setHotelDates({ from: range?.from, to: range?.to })} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={handleHotelSearch}>
                <Search className="mr-2 h-6 w-6" /> SEARCH HOTELS
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">From (Rajasthan)</Label>
                  <Input placeholder="Starting City" value={busFrom} onChange={(e) => setBusFrom(e.target.value)} className="h-14 rounded-2xl" />
                  <QuickSelectRajasthan onSelect={setBusFrom} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">To (Rajasthan)</Label>
                  <Input placeholder="Destination City" value={busTo} onChange={(e) => setBusTo(e.target.value)} className="h-14 rounded-2xl" />
                  <QuickSelectRajasthan onSelect={setBusTo} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</Label>
                  <Button variant="outline" className="w-full h-14 rounded-2xl justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Select Date
                  </Button>
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={handleBusSearch}>
                <Search className="mr-2 h-6 w-6" /> SEARCH BUSES
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bike">
            <CardContent className="p-6 md:p-10 space-y-6">
              <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-primary text-white p-3 rounded-2xl">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic tracking-tighter uppercase">Rajasthan Bike Taxi</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Live Tracking • Sahi Safar</p>
                    </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black italic px-4 py-1">GPS READY</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pick up (Rajasthan)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                    <Input 
                        placeholder="Search Pickup Point" 
                        value={bikePickup}
                        onChange={(e) => setBikePickup(e.target.value)}
                        className="h-14 pl-12 pr-12 rounded-2xl border-primary/20 focus:border-primary transition-all" 
                    />
                    <button 
                        type="button"
                        onClick={() => detectLocation('bike')}
                        disabled={isDetectingLocation}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 px-3"
                    >
                        {isDetectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                        <span className="text-[9px] font-black uppercase hidden sm:block">Use GPS</span>
                    </button>
                  </div>
                  <QuickSelectRajasthan onSelect={setBikePickup} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Drop Point</Label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                    <Input 
                        placeholder="Drop (e.g., Hotel, Fort, Mall)" 
                        value={bikeDrop}
                        onChange={(e) => setBikeDrop(e.target.value)}
                        className="h-14 pl-12 rounded-2xl" 
                    />
                  </div>
                  <QuickSelectRajasthan onSelect={setBikeDrop} />
                </div>
              </div>

              <Button 
                className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl"
                onClick={() => {
                    if (!bikePickup || !bikeDrop) {
                        toast({
                            title: "Location missing",
                            description: "Kripya pickup aur drop location bharein.",
                            variant: "destructive"
                        });
                        return;
                    }
                    handleBookNow(bikeRides[0]);
                }}
              >
                 <Zap className="mr-2 h-6 w-6" /> BOOK BIKE TAXI
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="car">
            <CardContent className="p-6 md:p-10 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup (Rajasthan)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                    <Input 
                        placeholder="Pickup Point" 
                        value={carPickup}
                        onChange={(e) => setCarPickup(e.target.value)}
                        className="h-14 pl-12 pr-12 rounded-2xl border-primary/20 focus:border-primary transition-all" 
                    />
                    <button 
                        type="button"
                        onClick={() => detectLocation('car')}
                        disabled={isDetectingLocation}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 px-3"
                    >
                        {isDetectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                        <span className="text-[9px] font-black uppercase hidden sm:block">Use Location</span>
                    </button>
                  </div>
                  <QuickSelectRajasthan onSelect={setCarPickup} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Drop</Label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5" />
                    <Input 
                        placeholder="Destination" 
                        value={carDrop}
                        onChange={(e) => setCarDrop(e.target.value)}
                        className="h-14 pl-12 rounded-2xl" 
                    />
                  </div>
                  <QuickSelectRajasthan onSelect={setCarDrop} />
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={() => {
                if (!carPickup || !carDrop) {
                    toast({
                        title: "Location missing",
                        description: "Kripya pickup aur drop location bharein.",
                        variant: "destructive"
                    });
                    return;
                }
                handleBookNow(cabs[0]);
              }}>
                <Search className="mr-2 h-6 w-6" /> SEARCH RAJASTHAN CABS
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {activeTab === 'hotel' && (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">RAJASTHAN HOTELS</h2>
                <Badge variant="outline" className="font-bold border-primary/20 text-primary">{displayedHotels.length} Results</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedHotels.map((hotel) => (
                    <Card key={hotel.name} className="overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] bg-white">
                        <div className="relative h-48">
                            <Image src={hotel.image} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" data-ai-hint={hotel.hint} />
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
                            <div className="flex items-center justify-between mt-auto border-t pt-4">
                                <div className="text-2xl font-black text-primary italic">
                                    ₹{hotel.price.toLocaleString('en-IN')}<span className="text-[10px] font-medium text-muted-foreground not-italic">/night</span>
                                </div>
                                <Button className="rounded-xl font-bold italic px-6" onClick={() => handleBookNow(hotel)}>BOOK NOW</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      )}

      {activeTab === 'bike' && (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">LIVE BIKE RIDES (RAJASTHAN)</h2>
                <Badge className="bg-primary text-white border-none font-black italic">FASTEST PICKUPS</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bikeRides.map((ride, idx) => (
                    <Card key={idx} className="border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden rounded-[2.5rem] bg-white border-l-8 border-l-primary">
                        <CardContent className="p-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-4 rounded-[2rem] text-primary">
                                    <Bike className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter">{ride.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">{ride.type}</Badge>
                                        <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><Clock className="h-3 w-3" /> {ride.time}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {ride.location}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="text-3xl font-black text-primary italic flex items-center justify-end">
                                    <IndianRupee className="h-6 w-6" />
                                    {ride.price}<span className="text-[10px] font-medium text-muted-foreground not-italic">/km</span>
                                </div>
                                <Button className="font-black italic uppercase rounded-xl px-6 h-10 shadow-lg shadow-primary/20" onClick={() => handleBookNow(ride)}>BOOK RIDE</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      )}

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-3xl font-black italic tracking-tighter uppercase">
                {activeTab === 'bike' ? <Bike className="text-primary h-8 w-8" /> : activeTab === 'car' ? <Car className="text-primary h-8 w-8" /> : <Hotel className="text-primary h-8 w-8" />}
                CONFIRM {activeTab === 'bike' || activeTab === 'car' ? 'RIDE' : 'BOOKING'}
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
                Confirming {selectedItem.name} in Rajasthan. "Sahi Nivesh" for your travel.
              </DialogDescription>
            </DialogHeader>
            <BookingForm 
                tripName={selectedItem.name} 
                bookingType={activeTab}
                itemDetails={selectedItem}
                onSuccess={handleBookingSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isRouteMapOpen} onOpenChange={setIsRouteMapOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden rounded-[2.5rem] border-4 border-primary shadow-2xl">
            <DialogHeader className="p-6 bg-primary text-white flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white text-primary p-2 rounded-xl">
                      <Route className="h-6 w-6" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">LIVE NAVIGATION GUIDE</DialogTitle>
                        <DialogDescription className="text-white/80 font-bold uppercase text-[10px] tracking-widest">
                            {getMapLocations().pickup} ➔ {getMapLocations().drop}
                        </DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsRouteMapOpen(false)} className="text-white hover:bg-white/20">
                    <X className="h-6 w-6" />
                </Button>
            </DialogHeader>
            <div className="flex-1 w-full h-full relative">
                <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(getMapLocations().pickup)}+to+${encodeURIComponent(getMapLocations().drop)}&output=embed`}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    className="w-full h-full"
                ></iframe>
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border-l-4 border-l-green-500 max-w-xs">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Navigation Alert</p>
                    <p className="text-xs font-bold text-slate-800">Aapka driver rasta follow kar raha hai. Payment confirm ho gaya hai, "Sahi Safar" ka anand lein!</p>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 bg-white rounded-full animate-ping"></div>
                        <p className="text-sm font-black italic uppercase">Ride in Progress (Automatic Mode)...</p>
                    </div>
                    <Badge className="bg-white text-primary font-black italic">SAHI NIVESH</Badge>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
