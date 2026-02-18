'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CreditCard, IndianRupee, MapPin, Hotel, Car, Utensils, Package, Home, HandCoins, Gift, Shield, Calendar as CalendarIcon, Map } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const guides = [
  { name: 'Shimla, Himachal Pradesh', description: 'The Queen of Hills, perfect for a budget-friendly mountain escape.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1974&auto=format&fit=crop', hint: 'shimla mountains', price: '12,500' },
  { name: 'Manali, Himachal Pradesh', description: 'Popular adventure hub known for its stunning valleys and snow-capped peaks.', image: 'https://images.unsplash.com/photo-1593134257782-e89567b7684d?q=80&w=1965&auto=format&fit=crop', hint: 'manali valley', price: '15,000' },
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxKYWlwdXIlMjB8ZW58MHx8fHwxNzU1MDU2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaipur palace', price: '20,000' },
  { name: 'Kedarnath, Uttarakhand', description: 'A sacred Hindu temple nestled in the Himalayas, a major pilgrimage site.', image: 'https://images.unsplash.com/photo-1649147313351-c86537fda0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxLZWRhcm5hdGglMjB8ZW58MHx8fHwxNzU1MDU2NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'himalayan temple', price: '45,000' },
  { name: 'Goa, India', description: 'Famous for its beaches, nightlife, and Portuguese-influenced architecture.', image: 'https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxHb2F8ZW58MHx8fHwxNzU1MDU2MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'goa beach', price: '12,000' },
  { name: 'Kerala, India', description: "Known as 'God's Own Country', famous for its backwaters, lush greenery, and serene beaches.", image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzfGVufDB8fHx8MTc1NTExODc0MXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'kerala backwaters', price: '35,000' },
  { name: 'Jaisalmer, Rajasthan', description: 'The Golden City, known for its massive fort and camel safaris in the Thar Desert.', image: 'https://images.unsplash.com/photo-1713349881676-594b95a5742b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8SmFpc2FsbWVyJTIwfGVufDB8fHx8MTc1NTA2MDQ5NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaisalmer fort', price: '2,500 par parshan' },
  { name: 'Jodhpur, Rajasthan', description: 'The Blue City, famous for the Mehrangarh Fort and its blue-painted houses.', image: 'https://images.unsplash.com/photo-1721973733816-1791a072295a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8Sm9kaHB1ciUyMHxlbnwwfHx8fDE3NTUwNjA3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jodhpur fort', price: '26,000' },
  { name: 'Rishikesh, Uttarakhand', description: 'The Yoga Capital of the World, known for its ashrams and adventure sports.', image: 'https://images.unsplash.com/photo-1650341259809-9314b0de9268?q=80&w=2070&auto=format&fit=crop', hint: 'rishikesh bridge', price: '18,000' },
  { name: 'Nainital, Uttarakhand', description: 'A charming Himalayan lake town with a bustling market and scenic views.', image: 'https://images.unsplash.com/photo-1601622256416-d7f757f99eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxOYWluaXRhbCUyMHxlbnwwfHx8fDE3NTUwNjE0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'nainital lake', price: '22,000' },
  { name: 'Mumbai, Maharashtra', description: 'The bustling financial capital, famous for Bollywood, street food, and colonial architecture.', image: 'https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxNdW1iYWklMjB8ZW58MHx8fHwxNzU1MDYxNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'mumbai skyline', price: '32,000' },
  { name: 'Varanasi, Uttar Pradesh', description: 'The spiritual capital of India, known for its sacred ghats and Ganga Aarti.', image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMHxlbnwwfHx8fDE3NTUwNTk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'varanasi ghats', price: '25,000' },
  { name: 'Agra, Uttar Pradesh', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbHxlbnwwfHx8fDE3NTUwNjE4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'taj mahal', price: '24,000' },
  { name: 'Vrindavan, Uttar Pradesh', description: 'A holy town famous for its temples, including the stunning Prem Mandir.', image: 'https://images.unsplash.com/photo-1707938233687-47e61e5ad7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxQcmVtJTIwbWFuZGlyJTIwfGVufDB8fHx8MTc1NTA2MjI3NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'vrindavan temple', price: '20,000' },
  { name: 'Khajuraho, Madhya Pradesh', description: 'A UNESCO World Heritage site, famous for its stunning temples adorned with intricate and erotic sculptures.', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxLaGFqdXJhaG8lMjB8ZW58MHx8fHwxNzU1MDYyNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'khajuraho temple', price: '27,000' },
  { name: 'Ujjain, Madhya Pradesh', description: 'An ancient and sacred city on the Kshipra River, home to the Mahakaleshwar Jyotirlinga.', image: 'https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVamphaW4lMjB8ZW58MHx8fHwxNzU1MDYyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'ujjain temple', price: '23,000' },
];

const services = [
    { name: 'Hotels', icon: Hotel, href: '/search-page' },
    { name: 'Holiday Packages', icon: Package, href: '/destination-guides' },
    { name: 'Airport Cabs', icon: Car, href: '#' },
    { name: 'Homestays', icon: Home, href: '#' },
    { name: 'Outstation Cabs', icon: Car, href: '#' },
    { name: 'Foreign Currency', icon: HandCoins, href: '#' },
    { name: 'Gift Cards', icon: Gift, href: '/gift-card' },
    { name: 'Travel Insurance', icon: Shield, href: '#' },
];

const ServiceCard = ({ icon: Icon, name, href }: { icon: React.ElementType, name: string, href: string }) => (
    <Link href={href}>
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-muted transition-colors h-full border-primary/20 shadow-sm hover:shadow-md">
            <Icon className="w-8 h-8 text-primary mb-2" />
            <p className="text-sm font-medium">{name}</p>
        </Card>
    </Link>
);


export default function SearchPage() {
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });


  const handleBookNow = (guide: typeof guides[0]) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  }

  const handleSearchClick = () => {
    router.push('/search-page');
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-10">
      {/* Explore Services section moved to the top */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Explore Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {services.map((service) => (
                <ServiceCard key={service.name} icon={service.icon} name={service.name} href={service.href} />
            ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Popular New Trips</h2>
        <p className="text-center text-muted-foreground mb-8">Best prices for your next big adventure.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Card key={guide.name} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col border-none shadow-lg">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full">
                  <Image
                    src={guide.image}
                    alt={`Image of ${guide.name}`}
                    data-ai-hint={guide.hint}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {guide.name.includes('Shimla') || guide.name.includes('Manali') ? (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">POPULAR</div>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{guide.name}</h2>
                <p className="text-muted-foreground flex-grow text-sm">{guide.description}</p>
                {guide.price && (
                  <div className="flex items-center text-lg font-bold text-accent mt-4">
                    <IndianRupee className="w-5 h-5 mr-2" />
                    <span>{guide.price}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-primary font-semibold hover:underline">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>View on Map</span>
                  </Link>
                </div>
              </CardContent>
              {guide.price && (
                <div className="p-4 pt-0">
                   <Button className="w-full shadow-primary/20 shadow-lg" onClick={() => handleBookNow(guide)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 relative z-10">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Map className="text-primary"/>
                    Plan Your Customized Trip
                </CardTitle>
                <CardDescription>Plan your next adventure across India.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" placeholder="e.g., Jaipur" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip-dates">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="trip-dates"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !tripDates.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tripDates.from ? (
                          tripDates.to ? (
                            <>
                              {format(tripDates.from, "LLL dd, y")} -{" "}
                              {format(tripDates.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(tripDates.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={tripDates.from}
                        selected={tripDates}
                        onSelect={(range) => setTripDates({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Activities / Interests</Label>
                  <Input id="interests" placeholder="e.g., Museums, Hiking" />
                </div>
                <Button type="submit" className="w-full h-10 lg:col-span-4 mt-2"><Search className="mr-2" /> Search Now</Button>
              </form>
            </CardContent>
        </Card>
      </section>

      {selectedGuide && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Your Trip to {selectedGuide.name}</DialogTitle>
            </DialogHeader>
            <BookingForm tripName={selectedGuide.name} />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
