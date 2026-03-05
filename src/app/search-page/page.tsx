'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  ChevronRight,
  IndianRupee,
  Star,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';

export default function SearchCardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  const router = useRouter();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [hotelLocation, setHotelLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchHotels = () => {
    if (!hotelLocation) {
        toast({ title: 'Location Required', description: 'Please enter a city name.', variant: 'destructive' });
        return;
    }
    setIsSearching(true);
    setTimeout(() => {
        const all = [...popularDestinations, ...newSeasonDestinations];
        const filtered = all.filter(h => h.city.toLowerCase().includes(hotelLocation.toLowerCase()));
        setSearchResults(filtered.length > 0 ? filtered : popularDestinations.slice(0, 3));
        setIsSearching(false);
    }, 1000);
  };

  const handleBookingStart = (type: string, item: any) => {
    setSelectedItem({ ...item, type });
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 pb-32">
      {/* Blue Header with Back Button */}
      <div className="blue-header -mx-4 -mt-8 p-6 pb-12 rounded-b-[2rem] flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-xl font-bold">
          {activeTab === 'hotel' ? `Hotel Listings - ${hotelLocation || 'India'}` : 'Bus Ticket Booking'}
        </h1>
      </div>

      <div className="-mt-8 px-2">
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="hotel" className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <Input 
                    placeholder="Search Hotels in Jaipur, Udaipur..." 
                    className="pl-10 h-12 bg-slate-50 border-none shadow-inner font-medium"
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                  />
                </div>
                <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold" onClick={handleSearchHotels} disabled={isSearching}>
                  {isSearching ? <Loader2 className="animate-spin h-5 w-5" /> : 'Search Hotels'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="bus" className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                   <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">From</Label>
                      <Input placeholder="Delhi" className="h-12 bg-slate-50" />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">To</Label>
                      <Input placeholder="Jaipur" className="h-12 bg-slate-50" />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Date</Label>
                      <Button variant="outline" className="w-full justify-between h-12 font-medium bg-slate-50">
                        14 Feb 2022 <CalendarIcon className="h-4 w-4 text-blue-600" />
                      </Button>
                   </div>
                </div>
                <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold">
                  Search Buses
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Results List View */}
      <section className="px-2 space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((hotel, i) => (
            <Card key={i} className="border-none shadow-md overflow-hidden rounded-xl bg-white flex">
               <div className="relative w-24 h-24 shrink-0">
                  <Image src={hotel.image} alt={hotel.name} fill className="object-cover" data-ai-hint={hotel.name.toLowerCase()} />
               </div>
               <CardContent className="p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 leading-tight">{hotel.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-black text-blue-700">₹{hotel.price.toLocaleString('en-IN')} / night</p>
                      <div className="flex items-center gap-1">
                         <span className="text-[10px] font-bold text-slate-500">Rating:</span>
                         <span className="text-[10px] font-bold text-yellow-600">4.5</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-fit h-7 bg-secondary hover:bg-secondary/90 text-white text-[10px] font-bold px-4" onClick={() => handleBookingStart('hotel', hotel)}>
                    Book Now
                  </Button>
               </CardContent>
            </Card>
          ))
        ) : activeTab === 'bus' && (
          <>
            {[
              { name: 'Volvo AC Sleeper', price: 900, time: '8:00 AM - 2:00 PM' },
              { name: 'Express Bus', price: 650, time: '9:30 AM - 3:30 PM' }
            ].map((bus, i) => (
              <Card key={i} className="border-none shadow-md overflow-hidden rounded-xl bg-white flex">
                 <div className="relative w-24 h-24 shrink-0">
                    <Image src={`https://picsum.photos/seed/${bus.name}/200/200`} alt={bus.name} fill className="object-cover" data-ai-hint="bus" />
                 </div>
                 <CardContent className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 leading-tight">{bus.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{bus.time}</p>
                      <p className="text-xs font-black text-blue-700 mt-1">₹{bus.price.toLocaleString('en-IN')}</p>
                    </div>
                    <Button size="sm" className="w-fit h-7 bg-secondary hover:bg-secondary/90 text-white text-[10px] font-bold px-4" onClick={() => handleBookingStart('bus', { name: bus.name, price: bus.price })}>
                      Book Now
                    </Button>
                 </CardContent>
              </Card>
            ))}
          </>
        )}
      </section>

      {isDialogOpen && selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-800">Confirm Booking</DialogTitle>
              <DialogDescription className="font-bold text-slate-500 text-xs">Sahi Safar • Sahi Price</DialogDescription>
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
