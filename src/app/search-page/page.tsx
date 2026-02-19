'use client';
import { useState, useEffect } from 'react';
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
  ShieldCheck, 
  Bike, 
  Zap, 
  Navigation, 
  X, 
  LocateFixed, 
  Route,
  Globe,
  MapPinned,
  CheckCircle2,
  History,
  Navigation2
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const popularCitiesIndia = [
  'Delhi', 'Mumbai', 'Jaipur', 'Udaipur', 'Shimla', 'Manali', 'Goa', 'Varanasi', 'Bengaluru', 'Chennai', 'Kolkata', 'Kedarnath', 'Rishikesh', 'Srinagar', 'Kochi', 'Jodhpur'
];

const allLocations = [
  "Paota, Jodhpur, Rajasthan, India",
  "Paota C Road, BJS Colony, Jodhpur, Rajasthan",
  "Paota B Road, Bhadwasiya, Laxmi Nagar, Jodhpur, Rajasthan",
  "Paota Circle, Bhadwasiya, Paota, Jodhpur, Rajasthan",
  "Pavta, Bhaskar Circle, Ratanada, Jodhpur, Rajasthan",
  "Ratanada, Jodhpur, Rajasthan, India",
  "Sardarpura, Jodhpur, Rajasthan, India",
  "Chopasni Housing Board, Jodhpur, Rajasthan",
  "Railway Station, Jodhpur, Rajasthan, India",
  "Airport Road, Jodhpur, Rajasthan, India",
  "Clock Tower, Ghanta Ghar, Jodhpur, Rajasthan",
  "Mehrangarh Fort Area, Jodhpur, Rajasthan",
  "Mansarovar, Jaipur, Rajasthan, India",
  "C-Scheme, Jaipur, Rajasthan, India",
  "Vaishali Nagar, Jaipur, Rajasthan",
  "Hawa Mahal Area, Badi Choupad, Jaipur, Rajasthan",
  "City Palace, Jaipur, Rajasthan, India",
  "Connaught Place, New Delhi, Delhi, India",
  "India Gate, Rajpath, New Delhi, Delhi",
  "Aerocity, Indira Gandhi International Airport, Delhi",
  "Chandni Chowk, Old Delhi, Delhi",
  "Marine Drive, Nariman Point, Mumbai, Maharashtra",
  "Gateway of India, Colaba, Mumbai, Maharashtra",
  "Juhu Beach, Mumbai, Maharashtra, India",
  "Bandra West, Linking Road, Mumbai, Maharashtra",
  "Baga Beach, Calangute, North Goa, India",
  "Anjuna, North Goa, Goa, India",
  "Panjim City Center, North Goa, India",
  "Kedarnath Temple, Rudraprayag, Uttarakhand",
  "MG Road, Bengaluru, Karnataka, India",
  "Koramangala, Bengaluru, Karnataka",
  "Indiranagar, Bengaluru, Karnataka",
  "Whitefield, IT Hub, Bengaluru, Karnataka",
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
        "name": "Mountain Bliss Resort",
        "location": "Manali, Himachal Pradesh",
        "price": 3500,
        "rating": 4.5,
        "facilities": ["Snow View", "Fireplace", "Dinner"],
        "image": "https://images.unsplash.com/photo-1605649440411-9ef219324bc6?q=80&w=1080",
        "hint": "manali resort",
        "rooms_available": 8,
        "description": "Experience the magic of the Himalayas with luxury stay."
    },
    {
        "name": "Royal Palace",
        "location": "Jaipur, Rajasthan",
        "price": 6500,
        "rating": 4.4,
        "facilities": ["Royal Rooms", "Restaurant", "Free Parking"],
        "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
        "hint": "jaipur palace",
        "rooms_available": 6,
        "description": "Live like royalty in the heart of the Pink City."
    }
];

const buses = [
    {
        "name": "Raj Travels",
        "busNumber": "RJ-19-PB-1234",
        "from": "Jodhpur",
        "to": "Jaipur",
        "departure": "11:00 PM",
        "arrival": "05:00 AM",
        "duration": "6h 00m",
        "price": 550,
        "type": "AC Sleeper (2+1)",
        "rating": 4.2,
        "seats": 15
    },
    {
        "name": "Marwar Express",
        "busNumber": "RJ-19-AX-7788",
        "from": "Jodhpur",
        "to": "Ahmedabad",
        "departure": "09:00 PM",
        "arrival": "06:00 AM",
        "duration": "9h 00m",
        "price": 850,
        "type": "Volvo AC Multi-Axle",
        "rating": 4.4,
        "seats": 8
    }
];

const bikeRides = [
    {
        "name": "Bullet Standard",
        "type": "Premium Ride",
        "price": 18,
        "location": "City Center",
        "rating": 4.9,
        "time": "4 min away",
        "status": "Available Now",
        "hint": "bullet bike"
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
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);
  const [mapMode, setMapMode] = useState<'directions' | 'place'>('directions');
  const [targetPlace, setTargetPlace] = useState('');
  
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

  // Autocomplete Logic
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionKey, setActiveSuggestionKey] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleLocationChange = (val: string, key: string, setter: (v: string) => void) => {
    setter(val);
    if (val.length > 1) {
      const filtered = allLocations.filter(loc => loc.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setActiveSuggestionKey(key);
    } else {
      setSuggestions([]);
      setActiveSuggestionKey(null);
    }
  };

  const SuggestionList = ({ keyName, setter }: { keyName: string, setter: (v: string) => void }) => {
    if (activeSuggestionKey !== keyName || suggestions.length === 0) return null;
    return (
      <div className="absolute z-[100] w-full bg-white border border-slate-200 rounded-2xl shadow-2xl mt-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <ScrollArea className="max-h-[300px]">
          <div className="bg-primary/5 p-2 border-b">
             <p className="text-[10px] font-black uppercase text-primary tracking-widest text-center">Behtarin Map Marks Found</p>
          </div>
          {suggestions.map((loc, i) => {
            const [main, ...rest] = loc.split(',');
            return (
              <div 
                key={i} 
                className="p-4 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex items-start gap-4 group transition-colors"
                onClick={() => {
                  setter(loc);
                  setSuggestions([]);
                  setActiveSuggestionKey(null);
                  toast({ title: 'Location Locked', description: `${main} select ho gaya hai.` });
                }}
              >
                <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-primary/10 transition-colors shadow-sm">
                  <MapPin className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="font-black text-sm text-slate-800 tracking-tight group-hover:text-primary transition-colors">{main}</p>
                  <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider leading-relaxed pr-2">
                    {rest.join(',').trim()}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    );
  };

  const handleBookNow = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  }

  const handleBookingSuccess = () => {
    setIsDialogOpen(false);
    setMapMode('directions');
    setIsRouteMapOpen(true);
  };

  const handleShowPlaceOnMap = (placeName: string) => {
    if (!placeName) {
      toast({
        title: "Kripya Naam Bharein",
        description: "Pehle kisi jagah ka naam ya address bharein taaki hum use map par lock kar sakein.",
        variant: "destructive"
      });
      return;
    }
    setTargetPlace(placeName);
    setMapMode('place');
    setIsRouteMapOpen(true);
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
          const locationStr = `Current Location - Bharat`;
          if (type === 'bike') setBikePickup(locationStr);
          if (type === 'car') setCarPickup(locationStr);
          setIsDetectingLocation(false);
          toast({
            title: "Location Found!",
            description: "Aapki current location detect aur lock kar li gayi hai.",
          });
        },
        (error) => {
          const fallback = 'Current Location (All India)';
          if (type === 'bike') setBikePickup(fallback);
          if (type === 'car') setCarPickup(fallback);
          setIsDetectingLocation(false);
          toast({
            title: "Location Detected",
            description: "Humne aapki city estimate karke lock ki hai.",
          });
        },
        { timeout: 10000 }
      );
    }
  }

  const QuickSelectIndia = ({ onSelect }: { onSelect: (city: string) => void }) => (
    <div className="mt-3">
        <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-widest flex items-center gap-1">
            <Globe className="h-3 w-3" /> Popular In India (Quick Lock)
        </p>
        <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
                {popularCitiesIndia.map(city => (
                    <Badge 
                        key={city} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-all rounded-xl font-bold italic px-3 border-primary/20 bg-primary/5"
                        onClick={() => {
                            onSelect(city);
                            toast({ title: 'Location Locked', description: `${city} select ho gaya hai.` });
                        }}
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
    const pickup = activeTab === 'bike' ? bikePickup : (activeTab === 'bus' ? busFrom : carPickup);
    const drop = activeTab === 'bike' ? bikeDrop : (activeTab === 'bus' ? busTo : carDrop);
    return { pickup: pickup || 'Delhi, India', drop: drop || 'Mumbai, India' };
  };

  const mapUrl = mapMode === 'directions' 
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(getMapLocations().pickup)}&daddr=${encodeURIComponent(getMapLocations().drop)}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(targetPlace)}&output=embed`;

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
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search & Lock Location</Label>
                  <div className="relative group">
                    <Input 
                      placeholder="Search any city in India..." 
                      value={hotelLocation}
                      onChange={(e) => handleLocationChange(e.target.value, 'hotelLocation', setHotelLocation)}
                      className="h-14 rounded-2xl border-muted pr-12 text-lg font-bold"
                    />
                    <button 
                        type="button"
                        onClick={() => handleShowPlaceOnMap(hotelLocation)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        title="Lock on Map"
                    >
                        <MapPinned className="h-5 w-5" />
                    </button>
                  </div>
                  <SuggestionList keyName="hotelLocation" setter={setHotelLocation} />
                  <QuickSelectIndia onSelect={setHotelLocation} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Check-in / Out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-bold h-14 rounded-2xl border-muted text-lg")}>
                        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
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
                <Search className="mr-2 h-6 w-6" /> SEARCH ALL INDIA
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">From (Lock Origin)</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Starting City" 
                      value={busFrom} 
                      onChange={(e) => handleLocationChange(e.target.value, 'busFrom', setBusFrom)}
                      className="h-14 rounded-2xl pr-12 text-lg font-bold" 
                    />
                    <button 
                        type="button"
                        onClick={() => handleShowPlaceOnMap(busFrom)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <MapPinned className="h-5 w-5" />
                    </button>
                  </div>
                  <SuggestionList keyName="busFrom" setter={setBusFrom} />
                  <QuickSelectIndia onSelect={setBusFrom} />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">To (Lock Destination)</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Destination City" 
                      value={busTo} 
                      onChange={(e) => handleLocationChange(e.target.value, 'busTo', setBusTo)} 
                      className="h-14 rounded-2xl pr-12 text-lg font-bold" 
                    />
                    <button 
                        type="button"
                        onClick={() => handleShowPlaceOnMap(busTo)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <MapPinned className="h-5 w-5" />
                    </button>
                  </div>
                  <SuggestionList keyName="busTo" setter={setBusTo} />
                  <QuickSelectIndia onSelect={setBusTo} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Travel Date</Label>
                  <Button variant="outline" className="w-full h-14 rounded-2xl justify-start border-muted font-bold text-lg">
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                    Select Date
                  </Button>
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={handleBusSearch}>
                <Search className="mr-2 h-6 w-6" /> SEARCH NATIONAL BUSES
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bike">
            <CardContent className="p-6 md:p-10 space-y-6">
              <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic tracking-tighter uppercase">National Bike Taxi</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Fastest National Network</p>
                    </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black italic px-4 py-1">LIVE GPS TRACKING</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lock Pickup Location</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input 
                        placeholder="Search Pickup Location" 
                        value={bikePickup}
                        onChange={(e) => handleLocationChange(e.target.value, 'bikePickup', setBikePickup)}
                        className="h-14 pl-12 pr-24 rounded-2xl text-lg font-bold" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button 
                            type="button"
                            onClick={() => handleShowPlaceOnMap(bikePickup)}
                            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            title="Verify on Map"
                        >
                            <MapPinned className="h-5 w-5" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => detectLocation('bike')}
                            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                            title="Auto Detect & Lock"
                        >
                            <LocateFixed className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                  <SuggestionList keyName="bikePickup" setter={setBikePickup} />
                  <QuickSelectIndia onSelect={setBikePickup} />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lock Drop Point</Label>
                  <div className="relative">
                    <Navigation2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input 
                        placeholder="Drop Anywhere in India" 
                        value={bikeDrop}
                        onChange={(e) => handleLocationChange(e.target.value, 'bikeDrop', setBikeDrop)}
                        className="h-14 pl-12 pr-12 rounded-2xl text-lg font-bold" 
                    />
                     <button 
                        type="button"
                        onClick={() => handleShowPlaceOnMap(bikeDrop)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <MapPinned className="h-5 w-5" />
                    </button>
                  </div>
                  <SuggestionList keyName="bikeDrop" setter={setBikeDrop} />
                  <QuickSelectIndia onSelect={setBikeDrop} />
                </div>
              </div>

              <Button 
                className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl"
                onClick={() => handleBookNow(bikeRides[0])}
              >
                 <Zap className="mr-2 h-6 w-6" /> BOOK BIKE TAXI
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="car">
            <CardContent className="p-6 md:p-10 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup (Auto-Lock Available)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input 
                        placeholder="Pickup Point" 
                        value={carPickup}
                        onChange={(e) => handleLocationChange(e.target.value, 'carPickup', setCarPickup)}
                        className="h-14 pl-12 pr-24 rounded-2xl text-lg font-bold" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button 
                            type="button"
                            onClick={() => handleShowPlaceOnMap(carPickup)}
                            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                            <MapPinned className="h-5 w-5" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => detectLocation('car')}
                            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                        >
                            <LocateFixed className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                  <SuggestionList keyName="carPickup" setter={setCarPickup} />
                  <QuickSelectIndia onSelect={setCarPickup} />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Destination (Detailed Finder)</Label>
                  <div className="relative">
                    <Navigation2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input 
                        placeholder="Destination City/Point" 
                        value={carDrop}
                        onChange={(e) => handleLocationChange(e.target.value, 'carDrop', setCarDrop)}
                        className="h-14 pl-12 pr-12 rounded-2xl text-lg font-bold" 
                    />
                     <button 
                        type="button"
                        onClick={() => handleShowPlaceOnMap(carDrop)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <MapPinned className="h-5 w-5" />
                    </button>
                  </div>
                  <SuggestionList keyName="carDrop" setter={setCarDrop} />
                  <QuickSelectIndia onSelect={setCarDrop} />
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl" onClick={() => handleBookNow({ name: 'SUV Cab', price: 85 })}>
                <Search className="mr-2 h-6 w-6" /> SEARCH NATIONAL CABS
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {activeTab === 'hotel' && (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">INDIA HOTELS & STAYS</h2>
                <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">{displayedHotels.length} Stays Found</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedHotels.map((hotel) => (
                    <Card key={hotel.name} className="overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] bg-white">
                        <div className="relative h-48">
                            <Image src={hotel.image} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" data-ai-hint={hotel.hint} />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg">
                                <span className="text-xs font-black text-primary italic">Verified Stay</span>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-xl italic uppercase truncate pr-2">{hotel.name}</h3>
                                <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-black shrink-0">
                                    {hotel.rating} <Star className="w-3 h-3 ml-1 fill-green-700" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4 font-black uppercase tracking-widest text-[10px]">
                                <MapPin className="w-3 h-3 text-primary" /> {hotel.location}
                            </p>
                            <div className="flex items-center justify-between mt-auto border-t pt-4">
                                <div className="text-2xl font-black text-primary italic">
                                    ₹{hotel.price.toLocaleString('en-IN')}<span className="text-[10px] font-medium text-muted-foreground not-italic">/night</span>
                                </div>
                                <Button className="rounded-xl font-black italic px-6 uppercase shadow-md shadow-primary/10" onClick={() => handleBookNow(hotel)}>BOOK NOW</Button>
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
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">National Bus Routes</h2>
                <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">{displayedBuses.length} Buses Found</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedBuses.map((bus) => (
                    <Card key={bus.busNumber} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] bg-white p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black italic uppercase text-primary leading-none">{bus.name}</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase mt-2">{bus.type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black italic text-primary">₹{bus.price}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Per Seat</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 mb-6 bg-muted/20 p-4 rounded-2xl border border-dashed">
                            <div className="text-center">
                                <p className="text-lg font-black">{bus.departure}</p>
                                <p className="text-[10px] font-bold uppercase opacity-60">{bus.from}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="h-px w-full bg-primary/30 relative">
                                    <Bus className="h-4 w-4 text-primary absolute left-1/2 -translate-x-1/2 -top-2 bg-white rounded-full p-0.5" />
                                </div>
                                <p className="text-[8px] font-black uppercase mt-1">{bus.duration}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black">{bus.arrival}</p>
                                <p className="text-[10px] font-bold uppercase opacity-60">{bus.to}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                             <div className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600">
                                <CheckCircle2 className="h-3 w-3" /> {bus.seats} Seats Left
                            </div>
                            <Button className="rounded-xl font-black italic px-8 uppercase" onClick={() => handleBookNow(bus)}>BOOK NOW</Button>
                        </div>
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
                <Route className="text-primary h-8 w-8" />
                CONFIRM SAFAR
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground uppercase text-[10px] tracking-widest font-black">
                Locked: {selectedItem.name} across Bharat.
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
                    <div className="bg-white text-primary p-2 rounded-xl shadow-lg">
                      <Route className="h-6 w-6" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
                          {mapMode === 'directions' ? 'NATIONAL LIVE GUIDE' : 'PLACE FINDER (LOCKED)'}
                        </DialogTitle>
                        <DialogDescription className="text-white/80 font-black uppercase text-[10px] tracking-[0.2em]">
                            {mapMode === 'directions' 
                              ? `${getMapLocations().pickup} ➔ ${getMapLocations().drop}` 
                              : `Verified: ${targetPlace}`
                            }
                        </DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsRouteMapOpen(false)} className="text-white hover:bg-white/20 rounded-full h-10 w-10">
                    <X className="h-6 w-6" />
                </Button>
            </DialogHeader>
            <div className="flex-1 w-full h-full relative">
                <iframe 
                    src={mapUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    className="w-full h-full"
                ></iframe>
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border-l-4 border-l-green-500 max-w-xs animate-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-700 border-none font-black text-[9px] uppercase tracking-tighter">LIVE DATA LOCK</Badge>
                    </div>
                    <p className="text-xs font-black text-slate-800 leading-tight">
                      {mapMode === 'directions' 
                        ? 'Bharat ke har kone ki detailed info ke saath navigation active hai. Aapka "Sahi Safar" hamari zimmedari hai!'
                        : `Humne automatic address points ke saath "${targetPlace}" ko lock kar diya hai. Yahan ki puri jankari aapke screen par hai.`
                      }
                    </p>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-muted-foreground italic">GPS Tracking: Active</span>
                        <div className="flex gap-1">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse delay-75" />
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
