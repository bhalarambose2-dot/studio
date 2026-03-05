'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon, 
  Hotel, 
  Search, 
  Car, 
  Bus, 
  MapPin, 
  Bike, 
  Zap, 
  LocateFixed, 
  Globe,
  Navigation2,
  Briefcase,
  ChevronRight,
  IndianRupee,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';

const allLocations = [
  "Paota Circle, Jodhpur, Rajasthan",
  "Paota Chauraha, Jodhpur, Rajasthan",
  "Sardarpura 1st Road, Jodhpur, Rajasthan",
  "Ratanada Circle, Jodhpur, Rajasthan",
  "Mansarovar Metro Station, Jaipur",
  "Vaishali Nagar, Jaipur, Rajasthan",
  "C-Scheme, Jaipur, Rajasthan",
  "Malviya Nagar, Jaipur, Rajasthan",
  "Amer Fort Parking, Jaipur, Rajasthan",
  "Nahargarh Fort, Jaipur, Rajasthan",
  "Sindhi Camp Bus Stand, Jaipur",
  "Railway Station, Jodhpur",
  "Airport Terminal, Jaipur",
  "Clock Tower, Jodhpur",
];

const popularCitiesIndia = [
  'Jaipur', 'Jodhpur', 'Delhi', 'Mumbai', 'Udaipur', 'Shimla', 'Manali', 'Goa'
];

export default function SearchCardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [bikePickup, setBikePickup] = useState('');
  const [bikeDrop, setBikeDrop] = useState('');
  const [carPickup, setCarPickup] = useState('');
  const [carDrop, setCarDrop] = useState('');

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionKey, setActiveSuggestionKey] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearchHotels = () => {
    if (!hotelLocation) {
        toast({ title: 'Location Enter Karein', description: 'Kripya city ya area ka naam likhein.', variant: 'destructive' });
        return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    // Combine all available hotels
    const allHotels = [...popularDestinations, ...newSeasonDestinations];
    
    // Filter based on location input
    const filtered = allHotels.filter(hotel => 
        hotel.city.toLowerCase().includes(hotelLocation.toLowerCase()) || 
        hotelLocation.toLowerCase().includes(hotel.city.toLowerCase()) ||
        hotel.name.toLowerCase().includes(hotelLocation.toLowerCase())
    );

    // Simulate search delay
    setTimeout(() => {
        if (filtered.length > 0) {
            setSearchResults(filtered);
            toast({ title: 'Hotels Found! 🏨', description: `Humein ${hotelLocation} ke paas ${filtered.length} hotels mile hain.` });
        } else {
            // Show some random popular ones if no match to keep UI alive
            setSearchResults(popularDestinations.slice(0, 4));
            toast({ title: 'Top Recommendations', description: `Humein specific match nahi mila, lekin ye best options hain.` });
        }
        setIsSearching(false);
    }, 1500);
  };

  const SuggestionList = ({ keyName, setter }: { keyName: string, setter: (v: string) => void }) => {
    if (activeSuggestionKey !== keyName || suggestions.length === 0) return null;
    return (
      <div className="absolute z-[100] w-full bg-white border border-slate-200 rounded-[2rem] shadow-2xl mt-2 overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto">
          {suggestions.map((loc, i) => (
            <div 
              key={i} 
              className="p-5 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex items-start gap-4"
              onClick={() => {
                setter(loc);
                setSuggestions([]);
                setActiveSuggestionKey(null);
              }}
            >
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="font-black text-slate-800 uppercase italic">{loc.split(',')[0]}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const detectLocation = (setter: (v: string) => void) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
          setter('Paota Circle, Jodhpur, Rajasthan');
          toast({ title: "GPS LOCKED! 📡", description: `Aapki location detect kar li gayi hai.` });
      });
    }
  };

  const handleBookingStart = (type: string, item: any) => {
    setSelectedItem({
      ...item,
      type: type,
      pickup: item.pickup || 'Current Location'
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/90 backdrop-blur-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-20 bg-muted/30 p-1.5">
            <TabsTrigger value="hotel" className="font-black italic uppercase rounded-2xl transition-all">
              <Hotel className="mr-2 h-4 w-4 text-primary"/>Hotel
            </TabsTrigger>
            <TabsTrigger value="bus" className="font-black italic uppercase rounded-2xl transition-all">
              <Bus className="mr-2 h-4 w-4 text-primary"/>Bus
            </TabsTrigger>
            <TabsTrigger value="bike" className="font-black italic uppercase rounded-2xl transition-all">
              <Bike className="mr-2 h-4 w-4 text-primary"/>Bike
            </TabsTrigger>
            <TabsTrigger value="car" className="font-black italic uppercase rounded-2xl transition-all">
              <Car className="mr-2 h-4 w-4 text-primary"/>Cab
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotel">
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">Location Search</Label>
                  <div className="relative group">
                    <Input 
                      placeholder="Type Jodhpur, Jaipur..." 
                      value={hotelLocation}
                      onChange={(e) => handleLocationChange(e.target.value, 'hotelLocation', setHotelLocation)}
                      className="h-16 rounded-[1.5rem] pr-16 text-lg font-black italic shadow-inner bg-slate-50/50"
                    />
                    <button type="button" onClick={() => detectLocation(setHotelLocation)} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-primary"><LocateFixed className="h-5 w-5" /></button>
                  </div>
                  <SuggestionList keyName="hotelLocation" setter={setHotelLocation} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">Stay Dates</Label>
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
                className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] transition-transform active:scale-95 bg-primary hover:bg-primary/90"
                onClick={handleSearchHotels}
                disabled={isSearching}
              >
                {isSearching ? <Loader2 className="animate-spin h-8 w-8 mr-3" /> : <Search className="mr-3 h-8 w-8" />}
                SEARCH & BOOK HOTEL
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bus">
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">From</Label>
                  <Input placeholder="Pickup City" value={busFrom} onChange={(e) => handleLocationChange(e.target.value, 'busFrom', setBusFrom)} className="h-16 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                  <SuggestionList keyName="busFrom" setter={setBusFrom} />
                </div>
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">To</Label>
                  <Input placeholder="Drop City" value={busTo} onChange={(e) => handleLocationChange(e.target.value, 'busTo', setBusTo)} className="h-16 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                  <SuggestionList keyName="busTo" setter={setBusTo} />
                </div>
              </div>
              <Button 
                className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] bg-primary hover:bg-primary/90"
                onClick={() => handleBookingStart('bus', { name: busTo, price: 850, pickup: busFrom })}
              >
                <Bus className="mr-3 h-8 w-8" /> SEARCH & BOOK BUS
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="bike">
             <CardContent className="p-8 space-y-6">
               <div className="bg-primary/5 p-4 rounded-2xl border border-dashed border-primary/20 flex items-center justify-between">
                <p className="text-xs font-black uppercase italic text-primary">Sahi Indian Rate: ₹15 Per Kilometer</p>
                <Badge className="bg-primary text-white text-[10px] uppercase font-black italic">Fast Safar</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">Pickup</Label>
                  <Input placeholder="Select Pickup" value={bikePickup} onChange={(e) => handleLocationChange(e.target.value, 'bikePickup', setBikePickup)} className="h-16 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                  <SuggestionList keyName="bikePickup" setter={setBikePickup} />
                </div>
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">Drop</Label>
                  <Input placeholder="Select Drop" value={bikeDrop} onChange={(e) => handleLocationChange(e.target.value, 'bikeDrop', setBikeDrop)} className="h-16 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                  <SuggestionList keyName="bikeDrop" setter={setBikeDrop} />
                </div>
              </div>
              <Button className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] bg-primary hover:bg-primary/90" onClick={() => handleBookingStart('bike', { name: bikeDrop, price: 15, pickup: bikePickup })}>
                <Zap className="mr-3 h-8 w-8" /> BOOK BIKE TAXI (₹15/KM)
              </Button>
             </CardContent>
          </TabsContent>

          <TabsContent value="car">
            <CardContent className="p-8 space-y-6">
               <div className="bg-primary/5 p-4 rounded-2xl border border-dashed border-primary/20 flex items-center justify-between">
                <p className="text-xs font-black uppercase italic text-primary">Sahi Indian Rate: ₹60 Per Kilometer</p>
                <Badge className="bg-secondary text-white text-[10px] uppercase font-black italic">Premium Ride</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">Pickup</Label>
                  <Input placeholder="Starting Point" value={carPickup} onChange={(e) => handleLocationChange(e.target.value, 'carPickup', setCarPickup)} className="h-16 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                  <SuggestionList keyName="carPickup" setter={setCarPickup} />
                </div>
                <div className="space-y-3 relative">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground ml-2">Drop</Label>
                  <Input placeholder="Drop City" value={carDrop} onChange={(e) => handleLocationChange(e.target.value, 'carDrop', setCarDrop)} className="h-16 rounded-[1.5rem] text-lg font-black italic bg-slate-50/50" />
                  <SuggestionList keyName="carDrop" setter={setCarDrop} />
                </div>
              </div>
              <Button className="w-full h-20 text-2xl font-black italic uppercase tracking-[0.1em] shadow-2xl shadow-primary/30 rounded-[2rem] bg-primary hover:bg-primary/90" onClick={() => handleBookingStart('car', { name: carDrop, price: 60, pickup: carPickup })}>
                <Car className="mr-3 h-8 w-8" /> SEARCH & BOOK CAB (₹60/KM)
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-slate-800">
                    <Hotel className="h-8 w-8 text-primary" /> Hotels Paas Mein
                </h2>
                <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest">{hotelLocation}</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {searchResults.map((hotel, i) => (
                    <Card key={i} className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white group hover:translate-y-[-5px] transition-all">
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image src={hotel.image} alt={hotel.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-primary/10 flex items-center gap-1">
                                <IndianRupee className="h-3 w-3 text-primary" />
                                <span className="text-sm font-black italic text-primary">{hotel.price.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <h3 className="font-black text-lg italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{hotel.name}</h3>
                                <div className="flex items-center text-[10px] font-bold text-muted-foreground uppercase mt-1">
                                    <MapPin className="h-3 w-3 mr-1 text-primary" /> {hotel.city}
                                </div>
                            </div>
                            <Button className="w-full h-12 font-black italic uppercase rounded-xl bg-primary hover:bg-primary/90 text-sm shadow-xl shadow-primary/10" onClick={() => handleBookingStart('hotel', hotel)}>
                                BOOK NOW <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      )}

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[3rem] p-10 shadow-2xl border-primary/20 bg-white/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-4xl font-black italic tracking-tighter uppercase text-primary">
                <Briefcase className="h-8 w-8" /> CONFIRM TRIP
              </DialogTitle>
              <DialogDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-2">
                Sahi Safar • Pay After Ride/Stay
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
    </div>
  );
}

import { Loader2 } from 'lucide-react';
