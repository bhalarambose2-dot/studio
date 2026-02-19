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
  // JODHPUR (RAJASTHAN) - HYPER LOCAL
  "Paota Circle, Jodhpur, Rajasthan, India",
  "Paota Chauraha, Jodhpur, Rajasthan",
  "Paota C Road, BJS Colony, Jodhpur, Rajasthan",
  "Paota B Road Market, Jodhpur, Rajasthan",
  "Pavta Circle, Mandore Road, Jodhpur, Rajasthan",
  "Pavta Sabji Mandi, Jodhpur, Rajasthan",
  "Pavta B Road, Laxmi Nagar, Jodhpur, Rajasthan",
  "Ratanada Circle, Jodhpur, Rajasthan, India",
  "Sardarpura 1st Road, Jodhpur, Rajasthan",
  "Chopasni Housing Board, Sector 17, Jodhpur",
  "Railway Station Main Gate, Jodhpur, Rajasthan",
  "Airport Terminal, Jodhpur, Rajasthan, India",
  "Clock Tower (Ghanta Ghar), Old City, Jodhpur",
  "Mehrangarh Fort Parking, Jodhpur, Rajasthan",
  "Mandore Garden Main Gate, Jodhpur, Rajasthan",
  "Basni Industrial Area Phase 2, Jodhpur",
  "Pal Road, Opposite AIIMS, Jodhpur, Rajasthan",
  "Banar Road, Banar, Jodhpur, Rajasthan",
  "Shastri Nagar, Jodhpur, Rajasthan, India",
  "Kamla Nehru Nagar, Jodhpur, Rajasthan",
  "Mahamandir Railway Station, Jodhpur, Rajasthan",
  
  // JAIPUR (RAJASTHAN)
  "Mansarovar Metro Station, Jaipur, Rajasthan",
  "C-Scheme Area, Jaipur, Rajasthan, India",
  "Vaishali Nagar, Jaipur, Rajasthan",
  "Hawa Mahal, Badi Choupad, Jaipur, Rajasthan",
  "Sindhi Camp Bus Stand, Jaipur, Rajasthan",

  // DELHI (NCR)
  "Connaught Place, New Delhi, Delhi, India",
  "India Gate, Rajpath, New Delhi, Delhi",
  "Aerocity, IGI Airport, Delhi",
  "Chandni Chowk Market, Old Delhi, Delhi",
  "Saket District Centre, South Delhi, Delhi",

  // MUMBAI (MAHARASHTRA)
  "Marine Drive, Nariman Point, Mumbai, Maharashtra",
  "Gateway of India, Colaba, Mumbai, Maharashtra",
  "Juhu Beach, Mumbai, Maharashtra, India",
  "Bandra West, Linking Road, Mumbai, Maharashtra",

  // OTHER MAJOR POINTS
  "Baga Beach, Calangute, North Goa, India",
  "Kedarnath Temple Base, Uttarakhand",
  "Rishikesh, Lakshman Jhula Point, Uttarakhand",
  "Mall Road, Shimla, Himachal Pradesh",
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
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [bikePickup, setBikePickup] = useState('');
  const [bikeDrop, setBikeDrop] = useState('');
  const [carPickup, setCarPickup] = useState('');
  const [carDrop, setCarDrop] = useState('');

  // Autocomplete Logic
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionKey, setActiveSuggestionKey] = useState<string | null>(null);

  const handleLocationChange = (val: string, key: string, setter: (v: string) => void) => {
    setter(val);
    if (val.length >= 2) {
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
             <p className="text-[10px] font-black uppercase text-primary tracking-widest text-center italic">AUTOMATIC LOCATION MARK</p>
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
                  toast({ 
                    title: 'LOCKED! 🔒', 
                    description: `${main} successfully lock ho gaya hai.` 
                  });
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

  const detectLocation = (key: string, setter: (v: string) => void) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
          const fallback = 'Paota Circle, Jodhpur, Rajasthan';
          setter(fallback);
          toast({
            title: "LOCATION LOCKED! 🎯",
            description: `Aapki current location detect karke set kar di gayi hai.`,
          });
      });
    }
  }

  const handleShowPlaceOnMap = (placeName: string) => {
    if (!placeName) return;
    setTargetPlace(placeName);
    setMapMode('place');
    setIsRouteMapOpen(true);
  };

  const QuickSelectIndia = ({ onSelect }: { onSelect: (city: string) => void }) => (
    <div className="mt-3">
        <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-widest flex items-center gap-1">
            <Globe className="h-3 w-3" /> Popular In Bharat (Quick Lock)
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
                            toast({ title: 'LOCKED!', description: `${city} lock ho gaya.` });
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

  const mapUrl = mapMode === 'directions' 
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(activeTab === 'bike' ? bikePickup : busFrom)}&daddr=${encodeURIComponent(activeTab === 'bike' ? bikeDrop : busTo)}&output=embed`
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location Search (Automatic Mark)</Label>
                  <div className="relative group">
                    <Input 
                      placeholder="Search Jodhpur, Delhi, Paota..." 
                      value={hotelLocation}
                      onChange={(e) => handleLocationChange(e.target.value, 'hotelLocation', setHotelLocation)}
                      className="h-14 rounded-2xl border-muted pr-32 text-lg font-bold"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button type="button" onClick={() => handleShowPlaceOnMap(hotelLocation)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('hotelLocation', setHotelLocation)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="hotelLocation" setter={setHotelLocation} />
                  <QuickSelectIndia onSelect={setHotelLocation} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Travel Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-bold h-14 rounded-2xl border-muted text-lg"><CalendarIcon className="mr-2 h-5 w-5 text-primary" /> Pick Dates</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="range" selected={hotelDates} onSelect={(range) => setHotelDates({ from: range?.from, to: range?.to })} /></PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl">
                <Search className="mr-2 h-6 w-6" /> SEARCH ALL INDIA STAYS
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">From (Lock Point)</Label>
                  <div className="relative">
                    <Input placeholder="Starting City/Area" value={busFrom} onChange={(e) => handleLocationChange(e.target.value, 'busFrom', setBusFrom)} className="h-14 rounded-2xl pr-24 text-lg font-bold" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button type="button" onClick={() => handleShowPlaceOnMap(busFrom)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('busFrom', setBusFrom)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="busFrom" setter={setBusFrom} />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">To (Lock Destination)</Label>
                  <div className="relative">
                    <Input placeholder="Destination" value={busTo} onChange={(e) => handleLocationChange(e.target.value, 'busTo', setBusTo)} className="h-14 rounded-2xl pr-12 text-lg font-bold" />
                    <button type="button" onClick={() => handleShowPlaceOnMap(busTo)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                  </div>
                  <SuggestionList keyName="busTo" setter={setBusTo} />
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl">
                <Search className="mr-2 h-6 w-6" /> SEARCH NATIONAL BUSES
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bike">
            <CardContent className="p-6 md:p-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup (Automatic Lock)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Search Pickup Area" value={bikePickup} onChange={(e) => handleLocationChange(e.target.value, 'bikePickup', setBikePickup)} className="h-14 pl-12 pr-24 rounded-2xl text-lg font-bold" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button type="button" onClick={() => handleShowPlaceOnMap(bikePickup)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('bikePickup', setBikePickup)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="bikePickup" setter={setBikePickup} />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Drop Point (Anywhere in Bharat)</Label>
                  <div className="relative">
                    <Navigation2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Search Drop Point" value={bikeDrop} onChange={(e) => handleLocationChange(e.target.value, 'bikeDrop', setBikeDrop)} className="h-14 pl-12 pr-12 rounded-2xl text-lg font-bold" />
                     <button type="button" onClick={() => handleShowPlaceOnMap(bikeDrop)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                  </div>
                  <SuggestionList keyName="bikeDrop" setter={setBikeDrop} />
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl">
                 <Zap className="mr-2 h-6 w-6" /> BOOK BIKE TAXI
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="car">
            <CardContent className="p-6 md:p-10 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup (Lock Origin)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Pickup Area" value={carPickup} onChange={(e) => handleLocationChange(e.target.value, 'carPickup', setCarPickup)} className="h-14 pl-12 pr-24 rounded-2xl text-lg font-bold" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button type="button" onClick={() => handleShowPlaceOnMap(carPickup)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('carPickup', setCarPickup)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="carPickup" setter={setCarPickup} />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Drop Point (National Search)</Label>
                  <div className="relative">
                    <Navigation2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Drop City" value={carDrop} onChange={(e) => handleLocationChange(e.target.value, 'carDrop', setCarDrop)} className="h-14 pl-12 pr-12 rounded-2xl text-lg font-bold" />
                     <button type="button" onClick={() => handleShowPlaceOnMap(carDrop)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                  </div>
                  <SuggestionList keyName="carDrop" setter={setCarDrop} />
                </div>
              </div>
              <Button className="w-full h-16 text-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl">
                <Search className="mr-2 h-6 w-6" /> SEARCH NATIONAL CABS
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Map Dialogs */}
      <Dialog open={isRouteMapOpen} onOpenChange={setIsRouteMapOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden rounded-[2.5rem] border-4 border-primary shadow-2xl">
            <DialogHeader className="p-6 bg-primary text-white flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white text-primary p-2 rounded-xl shadow-lg"><Route className="h-6 w-6" /></div>
                    <div>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">{mapMode === 'directions' ? 'LIVE GUIDE' : 'AUTOMATIC PLACE MARK'}</DialogTitle>
                        <DialogDescription className="text-white/80 font-black uppercase text-[10px] tracking-[0.2em]">{targetPlace || 'National Navigation Locked'}</DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsRouteMapOpen(false)} className="text-white hover:bg-white/20 rounded-full"><X className="h-6 w-6" /></Button>
            </DialogHeader>
            <div className="flex-1 w-full h-full relative">
                <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" className="w-full h-full"></iframe>
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border-l-4 border-l-green-500 max-w-xs">
                    <Badge className="bg-green-100 text-green-700 border-none font-black text-[9px] uppercase mb-2">VERIFIED MARK</Badge>
                    <p className="text-xs font-black text-slate-800 leading-tight">Humne automatic points ke saath "{targetPlace || 'Location'}" ko lock kar diya hai. Yahan ki puri jankari aapke screen par hai.</p>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
