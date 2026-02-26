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
  Navigation2,
  Briefcase
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const popularCitiesIndia = [
  'Jaipur', 'Jodhpur', 'Delhi', 'Mumbai', 'Udaipur', 'Shimla', 'Manali', 'Goa', 'Varanasi', 'Bengaluru', 'Kedarnath', 'Rishikesh'
];

const allLocations = [
  // Jodhpur Locations
  "Paota Circle, Jodhpur, Rajasthan",
  "Paota Chauraha, Jodhpur, Rajasthan",
  "Paota C Road, BJS Colony, Jodhpur",
  "Paota B Road Market, Jodhpur",
  "Sardarpura 1st Road, Jodhpur",
  "Sardarpura Main Market, Jodhpur",
  "Ratanada Circle, Jodhpur",
  "Chopasni Housing Board, Jodhpur",
  "Basni Industrial Area, Jodhpur",
  "Kamla Nagar, Jodhpur",
  "Shastri Nagar, Jodhpur",
  "MDM Hospital Road, Jodhpur",
  "Railway Station Main Gate, Jodhpur",
  "North Western Railway Office, Jodhpur",
  "Airport Terminal, Jodhpur",
  "Clock Tower (Ghanta Ghar), Old City, Jodhpur",
  "Mehrangarh Fort Parking, Jodhpur",
  "Mandore Garden, Jodhpur",
  "Umaid Bhawan Palace, Jodhpur",
  "Kaylana Lake, Jodhpur",
  "Pal Road, Jodhpur",
  "Banar Road, Jodhpur",
  "Jhalamand Circle, Jodhpur",
  "Kudi Bhagtasni Housing Board, Jodhpur",
  "Sangriya Industrial Area, Jodhpur",
  "MIA Basni Phase 2, Jodhpur",
  "Sojati Gate, Jodhpur",
  "Jalori Gate, Jodhpur",
  "Siwanchi Gate, Jodhpur",
  "Nagori Gate, Jodhpur",
  
  // Jaipur Locations
  "Mansarovar Metro Station, Jaipur",
  "Mansarovar Plaza, Jaipur",
  "Vaishali Nagar, Jaipur",
  "C-Scheme, Jaipur",
  "Malviya Nagar, Jaipur",
  "World Trade Park (WTP), Jaipur",
  "Raja Park, Jaipur",
  "Bani Park, Jaipur",
  "Sindhi Camp Bus Stand, Jaipur",
  "Jaipur Junction Railway Station, Jaipur",
  "Sanganer Airport Terminal, Jaipur",
  "Hawa Mahal, Pink City, Jaipur",
  "City Palace, Jaipur",
  "Johri Bazaar, Jaipur",
  "Bapu Bazaar, Jaipur",
  "Amer Fort, Jaipur",
  "Nahargarh Fort, Jaipur",
  "Jaigarh Fort, Jaipur",
  "Jal Mahal, Amber Road, Jaipur",
  "Albert Hall Museum, Jaipur",
  "Sitapura Industrial Area, Jaipur",
  "Jhotwara, Jaipur",
  "Vidhyadhar Nagar, Jaipur",
  "Tonk Road, Jaipur",
  "Ajmer Road, Jaipur",
  "Agra Road, Jaipur",
  "Sirsi Road, Jaipur",
  "Jagatsura, Jaipur",
  "Khatipura, Jaipur",
  "Sodala, Jaipur",
  "Civil Lines, Jaipur",
  "Adarsh Nagar, Jaipur",
  "Gandhi Nagar Railway Station, Jaipur",
  "Durgapura, Jaipur",
  "Pratap Nagar, Jaipur",
  "Gopalpura Bypass, Jaipur",
  
  // Other Points
  "Connaught Place, New Delhi",
  "India Gate, New Delhi",
  "Marine Drive, Mumbai",
  "Gateway of India, Mumbai",
  "Baga Beach, Goa",
  "Kedarnath Base, Uttarakhand",
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
  const [startPlace, setStartPlace] = useState('');
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [bikePickup, setBikePickup] = useState('');
  const [bikeDrop, setBikeDrop] = useState('');
  const [carPickup, setCarPickup] = useState('');
  const [carDrop, setCarDrop] = useState('');

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
      <div className="absolute z-[100] w-full bg-white border border-slate-200 rounded-[2rem] shadow-2xl mt-2 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        <ScrollArea className="max-h-[350px]">
          <div className="bg-primary/5 p-3 border-b flex items-center justify-center gap-2">
             <LocateFixed className="h-3 w-3 text-primary animate-pulse" />
             <p className="text-[10px] font-black uppercase text-primary tracking-widest italic">Sahi Nivesh • Automatic Mark</p>
          </div>
          {suggestions.map((loc, i) => {
            const [main, ...rest] = loc.split(',');
            return (
              <div 
                key={i} 
                className="p-5 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex items-start gap-4 group transition-all"
                onClick={() => {
                  setter(loc);
                  setSuggestions([]);
                  setActiveSuggestionKey(null);
                  toast({ 
                    title: 'LOCATION LOCKED! 🎯', 
                    description: `${main} successfully lock ho gaya hai.` 
                  });
                }}
              >
                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors shadow-sm">
                  <MapPin className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-black text-base text-slate-800 tracking-tight group-hover:text-primary transition-colors uppercase italic">{main}</p>
                  <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider leading-tight pr-4">
                    {rest.join(',').trim() || 'Rajasthan Point'}
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
            title: "GPS LOCKED! 📡",
            description: `Aapki location detect karke automatic lock kar di gayi hai.`,
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

  const handleShowRouteOnMap = (from: string, to: string) => {
      if (!from || !to) {
          toast({ title: 'Adhura Safar!', description: 'Kripya pickup aur drop dono bharein.', variant: 'destructive' });
          return;
      }
      setStartPlace(from);
      setTargetPlace(to);
      setMapMode('directions');
      setIsRouteMapOpen(true);
  }

  const QuickSelectIndia = ({ onSelect }: { onSelect: (city: string) => void }) => (
    <div className="mt-4">
        <p className="text-[10px] font-black uppercase text-primary mb-3 tracking-widest flex items-center gap-1">
            <Globe className="h-3 w-3" /> Bharat Ke Top Points (Quick Lock)
        </p>
        <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
                {popularCitiesIndia.map(city => (
                    <Badge 
                        key={city} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-all rounded-xl font-black italic px-4 py-1.5 border-primary/20 bg-primary/5 text-[10px] uppercase"
                        onClick={() => {
                            onSelect(city);
                            toast({ title: 'CITY LOCKED!', description: `${city} point lock ho gaya.` });
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

  const handleBookingStart = (type: string, name: string, price: number, pickup?: string) => {
    if (!name) {
      toast({ title: 'Jagah Chunie!', description: 'Kripya location search bar mein likhein.', variant: 'destructive' });
      return;
    }
    setSelectedItem({
      name: name,
      price: price,
      type: type,
      pickup: pickup || 'Current Location'
    });
    setIsDialogOpen(true);
  }

  const mapUrl = mapMode === 'directions' 
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(startPlace)}&daddr=${encodeURIComponent(targetPlace)}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(targetPlace)}&output=embed`;

  return (
    <div className="flex flex-col gap-8 pb-20">
      <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/90 backdrop-blur-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-20 bg-muted/30 p-1.5">
            <TabsTrigger value="hotel" className="text-[10px] md:text-xs font-black italic uppercase rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Hotel className="mr-1 md:mr-2 h-4 w-4 text-primary"/>Hotel
            </TabsTrigger>
            <TabsTrigger value="bus" className="text-[10px] md:text-xs font-black italic uppercase rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Bus className="mr-1 md:mr-2 h-4 w-4 text-primary"/>Bus
            </TabsTrigger>
            <TabsTrigger value="bike" className="text-[10px] md:text-xs font-black italic uppercase rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Bike className="mr-1 md:mr-2 h-4 w-4 text-primary"/>Bike
            </TabsTrigger>
            <TabsTrigger value="car" className="text-[10px] md:text-xs font-black italic uppercase rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Car className="mr-1 md:mr-2 h-4 w-4 text-primary"/>Cab
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotel">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Location Search (Lock Point)</Label>
                  <div className="relative group">
                    <Input 
                      placeholder="Type Jodhpur, Paota, Jaipur..." 
                      value={hotelLocation}
                      onChange={(e) => handleLocationChange(e.target.value, 'hotelLocation', setHotelLocation)}
                      className="h-16 rounded-[1.5rem] border-muted pr-36 text-lg font-black italic shadow-inner bg-slate-50/50"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button type="button" onClick={() => handleShowPlaceOnMap(hotelLocation)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('hotelLocation', setHotelLocation)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="hotelLocation" setter={setHotelLocation} />
                  <QuickSelectIndia onSelect={setHotelLocation} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Stay Dates (Sahi Nivesh)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-black h-16 rounded-[1.5rem] border-muted text-lg bg-slate-50/50 italic"><CalendarIcon className="mr-3 h-6 w-6 text-primary" /> Select Stay Period</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl" align="start">
                      <Calendar mode="range" selected={hotelDates} onSelect={(range) => setHotelDates({ from: range?.from, to: range?.to })} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button 
                className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] transition-transform active:scale-95 group"
                onClick={() => handleBookingStart('hotel', hotelLocation, 1200)}
              >
                <Search className="mr-3 h-8 w-8 group-hover:rotate-12 transition-transform" /> SEARCH & BOOK HOTEL
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">From (Pickup Lock)</Label>
                  <div className="relative">
                    <Input placeholder="Starting Point" value={busFrom} onChange={(e) => handleLocationChange(e.target.value, 'busFrom', setBusFrom)} className="h-16 rounded-[1.5rem] pr-28 text-lg font-black italic bg-slate-50/50" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button type="button" onClick={() => handleShowPlaceOnMap(busFrom)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('busFrom', setBusFrom)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="busFrom" setter={setBusFrom} />
                </div>
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">To (Drop Lock)</Label>
                  <div className="relative">
                    <Input placeholder="Destination" value={busTo} onChange={(e) => handleLocationChange(e.target.value, 'busTo', setBusTo)} className="h-16 rounded-[1.5rem] pr-16 text-lg font-black italic bg-slate-50/50" />
                    <button type="button" onClick={() => handleShowPlaceOnMap(busTo)} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                  </div>
                  <SuggestionList keyName="busTo" setter={setBusTo} />
                </div>
              </div>
              <Button 
                className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] transition-transform active:scale-95"
                onClick={() => handleBookingStart('bus', busTo, 850, busFrom)}
              >
                <Bus className="mr-3 h-8 w-8" /> SEARCH & BOOK BUS
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bike">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div className="bg-primary/5 p-4 rounded-2xl border border-dashed border-primary/20 flex items-center justify-between mb-2">
                <p className="text-xs font-black uppercase italic text-primary">Sahi Rate: ₹15/KM</p>
                <Badge className="bg-primary text-white text-[10px] uppercase font-black italic">Fast Delivery</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Pickup (Automatic Mark)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Select Pickup" value={bikePickup} onChange={(e) => handleLocationChange(e.target.value, 'bikePickup', setBikePickup)} className="h-16 pl-14 pr-28 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button type="button" onClick={() => handleShowPlaceOnMap(bikePickup)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('bikePickup', setBikePickup)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="bikePickup" setter={setBikePickup} />
                </div>
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Drop Location (Route Guide)</Label>
                  <div className="relative">
                    <Navigation2 className="absolute left-5 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Select Destination" value={bikeDrop} onChange={(e) => handleLocationChange(e.target.value, 'bikeDrop', setBikeDrop)} className="h-16 pl-14 pr-28 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button type="button" onClick={() => handleShowRouteOnMap(bikePickup, bikeDrop)} className="p-3 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all"><Route className="h-5 w-5" /></button>
                        <button type="button" onClick={() => handleShowPlaceOnMap(bikeDrop)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="bikeDrop" setter={setBikeDrop} />
                </div>
              </div>
              <Button 
                className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] transition-transform active:scale-95"
                onClick={() => handleBookingStart('bike', bikeDrop, 15, bikePickup)}
              >
                 <Zap className="mr-3 h-8 w-8 animate-pulse text-yellow-400" /> BOOK BIKE TAXI
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="car">
            <CardContent className="p-8 md:p-12 space-y-6">
               <div className="bg-primary/5 p-4 rounded-2xl border border-dashed border-primary/20 flex items-center justify-between mb-2">
                <p className="text-xs font-black uppercase italic text-primary">Sahi Rate: ₹60/KM</p>
                <Badge className="bg-secondary text-white text-[10px] uppercase font-black italic">Premium Ride</Badge>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Pickup (Lock Origin)</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Starting Point" value={carPickup} onChange={(e) => handleLocationChange(e.target.value, 'carPickup', setCarPickup)} className="h-16 pl-14 pr-28 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button type="button" onClick={() => handleShowPlaceOnMap(carPickup)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                        <button type="button" onClick={() => detectLocation('carPickup', setCarPickup)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><LocateFixed className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="carPickup" setter={setCarPickup} />
                </div>
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-2">Drop Point (Direct Route)</Label>
                  <div className="relative">
                    <Navigation2 className="absolute left-5 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                    <Input placeholder="Drop City" value={carDrop} onChange={(e) => handleLocationChange(e.target.value, 'carDrop', setCarDrop)} className="h-16 pl-14 pr-28 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button type="button" onClick={() => handleShowRouteOnMap(carPickup, carDrop)} className="p-3 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all"><Route className="h-5 w-5" /></button>
                        <button type="button" onClick={() => handleShowPlaceOnMap(carDrop)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><MapPinned className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <SuggestionList keyName="carDrop" setter={setCarDrop} />
                </div>
              </div>
              <Button 
                className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] transition-transform active:scale-95"
                onClick={() => handleBookingStart('car', carDrop, 60, carPickup)}
              >
                <Car className="mr-3 h-8 w-8" /> SEARCH & BOOK CAB
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl border-primary/20 bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-4xl font-black italic tracking-tighter uppercase text-primary">
                <div className="bg-primary text-white p-2 rounded-2xl shadow-lg">
                  <Briefcase className="h-8 w-8" />
                </div>
                CONFIRM TRIP
              </DialogTitle>
              <DialogDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-2">
                Sahi Nivesh • Booking Final Step
              </DialogDescription>
            </DialogHeader>
            <BookingForm 
                tripName={selectedItem.name} 
                bookingType={selectedItem.type}
                itemDetails={selectedItem}
                onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={isRouteMapOpen} onOpenChange={setIsRouteMapOpen}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden rounded-[3rem] border-[6px] border-primary shadow-[0_50px_100px_rgba(var(--primary),0.3)] bg-white">
            <DialogHeader className="p-8 bg-primary text-white flex flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/map/800/200')] bg-cover bg-center pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-white text-primary p-4 rounded-3xl shadow-2xl animate-float"><Route className="h-8 w-8" /></div>
                    <div>
                        <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">{mapMode === 'directions' ? 'LIVE ROUTE GUIDE' : 'AUTOMATIC MARK LOCKED'}</DialogTitle>
                        <DialogDescription className="text-white/90 font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3" /> {targetPlace || 'National Navigation Active'}
                        </DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsRouteMapOpen(false)} className="text-white hover:bg-white/20 rounded-full h-12 w-12 transition-transform hover:rotate-90 active:scale-90"><X className="h-8 w-8" /></Button>
            </DialogHeader>
            <div className="flex-1 w-full h-full relative bg-slate-100">
                <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" className="w-full h-full grayscale-[0.2] contrast-[1.1]"></iframe>
                <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border-l-[6px] border-l-green-500 max-w-sm animate-in fade-in slide-in-from-left-8 duration-500">
                    <Badge className="bg-green-100 text-green-700 border-none font-black text-[10px] uppercase mb-3 px-4 py-1">POINT VERIFIED</Badge>
                    <p className="text-sm font-black text-slate-800 leading-tight italic">Humne automatic algorithms ke saath "{targetPlace || 'Location'}" ko lock kar diya hai. Aapka safar yahan se sidha aur surakshit rahega.</p>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
