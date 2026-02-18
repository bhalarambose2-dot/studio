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

export default function SearchCardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  
  const [activeTab, setActiveTab] = useState(initialTab === 'bike' ? 'hotel' : initialTab);
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [busDate, setBusDate] = useState<Date | undefined>();
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [displayedHotels, setDisplayedHotels] = useState(hotels);

  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [displayedBuses, setDisplayedBuses] = useState(buses);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== 'bike') {
      setActiveTab(tab);
    }
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

  return (
    <div className="flex flex-col gap-8 pb-20">
      <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-16 bg-muted/30 p-1">
            <TabsTrigger value="hotel" className="text-xs font-black italic uppercase"><Hotel className="mr-2 h-4 w-4"/>Hotel</TabsTrigger>
            <TabsTrigger value="bus" className="text-xs font-black italic uppercase"><Bus className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
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

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-3xl font-black italic tracking-tighter">
                {activeTab === 'bus' ? <Bus className="text-primary h-8 w-8" /> : <Hotel className="text-primary h-8 w-8" />}
                CONFIRM {activeTab === 'bus' ? 'BUS TICKET' : 'BOOKING'}
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
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
