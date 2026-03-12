
'use client';
import { useState, useMemo, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Hotel, 
  Search, 
  Car, 
  Bus, 
  MapPin, 
  Bike, 
  ChevronRight,
  ChevronLeft,
  Loader2,
  Navigation,
  ArrowRightLeft,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { useToast } from '@/hooks/use-toast';
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Massive list of 100+ locations in Jaipur and Jodhpur
const RAJASTHAN_LOCATIONS = [
  "Paota Circle, Jodhpur", "Ratanada, Jodhpur", "Shastri Nagar, Jodhpur", "Basni, Jodhpur", "Pal Road, Jodhpur",
  "Sardarpura, Jodhpur", "Railway Station, Jodhpur", "Airport Road, Jodhpur", "AIIMS, Jodhpur", "Mandore, Jodhpur",
  "Banar Road, Jodhpur", "Kudi Bhagtasni, Jodhpur", "Jhalamand, Jodhpur", "Chopasni, Jodhpur", "Luni, Jodhpur",
  "Sindhi Camp, Jaipur", "Railway Station, Jaipur", "Amer Fort, Jaipur", "Hawa Mahal, Jaipur", "Johari Bazar, Jaipur",
  "C-Scheme, Jaipur", "Malviya Nagar, Jaipur", "Vaishali Nagar, Jaipur", "Mansarovar, Jaipur", "Raja Park, Jaipur",
  "Bani Park, Jaipur", "Jhotwara, Jaipur", "Sanganer, Jaipur", "Sitapura, Jaipur", "VKI Area, Jaipur",
  "Tonk Road, Jaipur", "Ajmer Road, Jaipur", "Gopalpura, Jaipur", "Civil Lines, Jaipur", "Adarsh Nagar, Jaipur",
  "Bapu Bazar, Jaipur", "MI Road, Jaipur", "World Trade Park, Jaipur", "Airport, Jaipur", "Galta Ji, Jaipur",
  "Nahargarh, Jaipur", "Jaigarh, Jaipur", "Jal Mahal, Jaipur", "Birla Mandir, Jaipur", "Albert Hall, Jaipur",
  "Science Park, Jaipur", "Kanak Vrindavan, Jaipur", "Ramniwas Bagh, Jaipur", "Vidhyadhar Nagar, Jaipur",
  "Murlipura, Jaipur", "Ambabari, Jaipur", "Shastri Nagar, Jaipur", "Nehru Bazar, Jaipur", "Chaura Rasta, Jaipur",
  "Tripolia Bazar, Jaipur", "Kishanpole Bazar, Jaipur", "Chandpole, Jaipur", "Ramganj, Jaipur", "Ghat Gate, Jaipur",
  "Surajpole, Jaipur", "Sethi Colony, Jaipur", "Transport Nagar, Jaipur", "Jawahar Nagar, Jaipur", "Tilak Nagar, Jaipur",
  "Lalkothi, Jaipur", "Gandhi Nagar, Jaipur", "Bajaj Nagar, Jaipur", "Durgapura, Jaipur", "Pratap Nagar, Jaipur",
  "Jagatspura, Jaipur", "Khatipura, Jaipur", "Sirsi Road, Jaipur", "Kalwar Road, Jaipur", "Niwaru Road, Jaipur",
  "Goner Road, Jaipur", "Agra Road, Jaipur", "Delhi Road, Jaipur", "Sikar Road, Jaipur", "Diggi Road, Jaipur",
  "Phagi Road, Jaipur", "New Sanganer Road, Jaipur", "Mahapura, Jaipur", "Bagru, Jaipur", "Chomu, Jaipur",
  "Shahpura, Jaipur", "Kotputli, Jaipur", "Dudu, Jaipur", "Sambhar, Jaipur", "Phulera, Jaipur", "Jobner, Jaipur",
  "Bassi, Jaipur", "Jamwa Ramgarh, Jaipur", "Achrol, Jaipur", "Kukas, Jaipur", "Chandwaji, Jaipur", "Paota, Jaipur"
];

export default function SearchCardPage({ searchParams: searchParamsProp }: { searchParams: Promise<any> }) {
  // Unwrap searchParams to satisfy Next.js 15 requirement
  use(searchParamsProp);
  
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  const router = useRouter();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [locationQuery, setLocationQuery] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Filter locations based on input
  const filteredPickup = useMemo(() => RAJASTHAN_LOCATIONS.filter(l => l.toLowerCase().includes(pickup.toLowerCase())), [pickup]);
  const filteredDrop = useMemo(() => RAJASTHAN_LOCATIONS.filter(l => l.toLowerCase().includes(drop.toLowerCase())), [drop]);
  const filteredHotelLocs = useMemo(() => RAJASTHAN_LOCATIONS.filter(l => l.toLowerCase().includes(locationQuery.toLowerCase())), [locationQuery]);

  const handleSearchHotels = () => {
    if (!locationQuery) {
        toast({ title: 'Location Required', description: 'Please select a location.', variant: 'destructive' });
        return;
    }
    setIsSearching(true);
    setTimeout(() => {
        const all = [...popularDestinations, ...newSeasonDestinations];
        const filtered = all.filter(h => h.city.toLowerCase().includes(locationQuery.toLowerCase()) || locationQuery.toLowerCase().includes(h.city.toLowerCase()));
        setSearchResults(filtered.length > 0 ? filtered : popularDestinations.slice(0, 4));
        setIsSearching(false);
    }, 800);
  };

  const handleBookingStart = (type: string, item: any) => {
    setSelectedItem({ ...item, type });
    setIsDialogOpen(true);
  };

  const handleRideRequest = (type: 'bike' | 'taxi') => {
    if (!pickup || !drop) {
      toast({ title: 'Adhuri Jankari', description: 'Pickup aur Drop location bharein.', variant: 'destructive' });
      return;
    }
    const rate = type === 'bike' ? 15 : 60;
    const distance = Math.floor(Math.random() * 15) + 5; // Simulated distance
    const amount = distance * rate;

    handleBookingStart(type, {
      name: `${type.toUpperCase()} Ride: ${pickup} to ${drop}`,
      pickup,
      drop,
      distance,
      price: amount,
      rate
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-32">
      {/* Blue Header */}
      <div className="blue-header -mx-4 -mt-8 p-6 pb-12 rounded-b-[3rem] flex items-center gap-4 shadow-xl">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter">
            {activeTab === 'hotel' ? 'Sahi Hotel Stay' : activeTab === 'bus' ? 'Sahi Bus Safar' : 'Sahi Safar Ride'}
          </h1>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Rajasthan's No. 1 Travel Network</p>
        </div>
      </div>

      <div className="-mt-10 px-2">
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea className="w-full">
              <TabsList className="flex w-max min-w-full bg-slate-50 p-1">
                 <TabsTrigger value="hotel" className="rounded-2xl text-[9px] font-black uppercase tracking-tighter px-4 py-2"><Hotel className="h-3 w-3 mr-1"/> Hotel</TabsTrigger>
                 <TabsTrigger value="bus" className="rounded-2xl text-[9px] font-black uppercase tracking-tighter px-4 py-2"><Bus className="h-3 w-3 mr-1"/> Bus</TabsTrigger>
                 <TabsTrigger value="bike" className="rounded-2xl text-[9px] font-black uppercase tracking-tighter px-4 py-2"><Bike className="h-3 w-3 mr-1"/> Bike</TabsTrigger>
                 <TabsTrigger value="taxi" className="rounded-2xl text-[9px] font-black uppercase tracking-tighter px-4 py-2"><Car className="h-3 w-3 mr-1"/> Taxi</TabsTrigger>
              </TabsList>
            </ScrollArea>

            {/* Hotel Search */}
            <TabsContent value="hotel" className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:rotate-12 transition-transform" />
                  <Input 
                    placeholder="Search Location in Jaipur/Jodhpur..." 
                    className="pl-12 h-14 bg-slate-50 border-none shadow-inner font-black italic rounded-2xl"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                {locationQuery && (
                  <ScrollArea className="h-40 border rounded-2xl p-2 bg-slate-50/50">
                    {filteredHotelLocs.map(l => (
                      <button key={l} className="w-full text-left p-2 hover:bg-white rounded-xl text-xs font-bold transition-colors" onClick={() => setLocationQuery(l)}>{l}</button>
                    ))}
                  </ScrollArea>
                )}
                <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg" onClick={handleSearchHotels} disabled={isSearching}>
                  {isSearching ? <Loader2 className="animate-spin h-6 w-6" /> : <><Search className="mr-2 h-6 w-6"/> SEARCH HOTELS</>}
                </Button>
              </div>
            </TabsContent>

            {/* Ride Search (Bike & Taxi) */}
            {(activeTab === 'bike' || activeTab === 'taxi') && (
              <TabsContent value={activeTab} className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="h-4 w-0.5 bg-slate-200" />
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <div className="space-y-2 pl-10">
                      <Input 
                        placeholder="Pickup Point" 
                        className="h-12 bg-slate-50 border-none shadow-inner font-bold rounded-xl"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                      />
                      <Input 
                        placeholder="Drop Destination" 
                        className="h-12 bg-slate-50 border-none shadow-inner font-bold rounded-xl"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Suggestion Lists */}
                  {(pickup.length > 1 && pickup !== RAJASTHAN_LOCATIONS.find(l => l === pickup)) && (
                    <ScrollArea className="h-32 border rounded-xl p-2 bg-slate-50">
                      {filteredPickup.map(l => (
                        <button key={l} className="w-full text-left p-2 hover:bg-white rounded-lg text-[10px] font-bold" onClick={() => setPickup(l)}>{l}</button>
                      ))}
                    </ScrollArea>
                  )}
                  {(drop.length > 1 && drop !== RAJASTHAN_LOCATIONS.find(l => l === drop)) && (
                    <ScrollArea className="h-32 border rounded-xl p-2 bg-slate-50">
                      {filteredDrop.map(l => (
                        <button key={l} className="w-full text-left p-2 hover:bg-white rounded-lg text-[10px] font-bold" onClick={() => setDrop(l)}>{l}</button>
                      ))}
                    </ScrollArea>
                  )}

                  <div className="bg-primary/5 p-4 rounded-2xl border border-dashed border-primary/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-primary">Sahi Indian Rate</p>
                      <p className="text-xl font-black italic">₹{activeTab === 'bike' ? '15' : '60'}<span className="text-xs">/km</span></p>
                    </div>
                    <ArrowRightLeft className="h-5 w-5 text-primary opacity-30" />
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Estimate</p>
                      <p className="text-xs font-bold text-slate-500 italic">Pay After Ride</p>
                    </div>
                  </div>

                  <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg" onClick={() => handleRideRequest(activeTab as any)}>
                    {activeTab === 'bike' ? <Bike className="mr-2 h-6 w-6"/> : <Car className="mr-2 h-6 w-6"/>}
                    REQUEST {activeTab.toUpperCase()} RIDE
                  </Button>
                </div>
              </TabsContent>
            )}

            {/* Bus Tab */}
            <TabsContent value="bus" className="p-6 space-y-4">
               <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Input placeholder="Delhi / Jaipur" className="h-14 bg-slate-50 border-none shadow-inner font-bold rounded-2xl" />
                    <Button variant="outline" className="h-14 rounded-2xl bg-slate-50 font-bold justify-between">
                      Select Travel Date <CalendarIcon className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                  <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg">
                    SEARCH BUSES
                  </Button>
               </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Results Section (Standard Results) */}
      {searchResults.length > 0 && (
        <section className="px-4 space-y-4">
          <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 px-2">
            <Navigation className="h-5 w-5 text-primary" />
            Sahi Results For You
          </h2>
          <div className="space-y-4">
            {searchResults.map((hotel, i) => (
              <Card key={i} className="border-none shadow-xl overflow-hidden rounded-3xl bg-white flex group hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => handleBookingStart('hotel', hotel)}>
                 <div className="relative w-32 h-32 shrink-0 overflow-hidden">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source src={hotel.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic">Top Stay</div>
                 </div>
                 <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-md text-slate-800 leading-tight uppercase italic group-hover:text-primary transition-colors">{hotel.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {hotel.city}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black italic text-primary">₹{hotel.price.toLocaleString('en-IN')}</p>
                      <Button size="sm" className="h-8 bg-secondary hover:bg-secondary/90 text-white text-[10px] font-black uppercase rounded-xl shadow-lg">
                        BOOK <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                 </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Booking Dialog */}
      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-[3rem] p-8 bg-white border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-primary flex items-center gap-2">
                {selectedItem.type === 'bike' ? <Bike className="h-8 w-8"/> : selectedItem.type === 'taxi' ? <Car className="h-8 w-8"/> : <Hotel className="h-8 w-8"/>}
                Confirm {selectedItem.type.toUpperCase()}
              </DialogTitle>
              <DialogDescription className="font-bold text-slate-500 text-[10px] uppercase tracking-[0.2em] mt-2">
                Sahi Safar • Sahi Price • Pay After Ride
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
