
'use client';
import { useState } from 'react';
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
import { Calendar as CalendarIcon, Hotel, Plane, Search, Car, Utensils, Package, Home, Train, HandCoins, Gift, Shield } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';


const guides = [
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://images.unsplash.com/photo-1673807095861-04b24a39b0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxqYWlwdXIlMjBwYWxhY2V8ZW58MHx8fHwxNzU1MDU4Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaipur palace', price: '20,000' },
  { name: 'Kedarnath, Uttarakhand', description: 'A sacred Hindu temple nestled in the Himalayas, a major pilgrimage site.', image: 'https://images.unsplash.com/photo-1698574996391-73f103113f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHxVdHJha2hhbmQlMjB8ZW58MHx8fHwxNzU1MDU4NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'himalayan temple', price: '45,000' },
  { name: 'Goa, India', description: 'Famous for its beaches, nightlife, and Portuguese-influenced architecture.', image: 'https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxHb2F8ZW58MHx8fHwxNzU1MDU2MzAyfDA&ixlib-rb-4.1.0&q=80&w=1080', hint: 'goa beach', price: '30,000' },
  { name: 'Kerala, India', description: "Known as 'God's Own Country', famous for its backwaters, lush greenery, and serene beaches.", image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzfGVufDB8fHx8MTc1NTExODc0MXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'kerala backwaters', price: '35,000' },
  { name: 'Jaisalmer, Rajasthan', description: 'The Golden City, known for its massive fort and camel safaris in the Thar Desert.', image: 'https://images.unsplash.com/photo-1713349881676-594b95a5742b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8SmFpc2FsbWVyJTIwfGVufDB8fHx8MTc1NTA2MDQ5NXww&ixlib-rb-4.1.0&q=80&w=1080', hint: 'jaisalmer fort', price: '28,000' },
  { name: 'Jodhpur, Rajasthan', description: 'The Blue City, famous for the Mehrangarh Fort and its blue-painted houses.', image: 'https://images.unsplash.com/photo-1721973733816-1791a072295a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8Sm9kaHB1ciUyMHxlbnwwfHx8fDE3NTUwNjA3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jodhpur fort', price: '26,000' },
  { name: 'Rishikesh, Uttarakhand', description: 'The Yoga Capital of the World, known for its ashrams and adventure sports.', image: 'https://images.unsplash.com/photo-1650341259809-9314b0de9268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxSaXNoaWtlc2glMjB8ZW58MHx8fHwxNzU1MDYxMzMzfDA&ixlib-rb-4.1.0&q=80&w=1080', hint: 'rishikesh bridge', price: '18,000' },
  { name: 'Nainital, Uttarakhand', description: 'A charming Himalayan lake town with a bustling market and scenic views.', image: 'https://images.unsplash.com/photo-1601622256416-d7f757f99eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxOYWluaXRhbCUyMHxlbnwwfHx8fDE3NTUwNjE0ODF8MA&ixlib-rb-4.1.0&q=80&w=1080', hint: 'nainital lake', price: '22,000' },
  { name: 'Mumbai, Maharashtra', description: 'The bustling financial capital, famous for Bollywood, street food, and colonial architecture.', image: 'https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxNdW1iYWklMjB8ZW58MHx8fHwxNzU1MDYxNzUzfDA&ixlib-rb-4.1.0&q=80&w=1080', hint: 'mumbai skyline', price: '32,000' },
  { name: 'Varanasi, Uttar Pradesh', description: 'The spiritual capital of India, known for its sacred ghats and Ganga Aarti.', image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMHxlbnwwfHx8fDE3NTUwNTk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'varanasi ghats', price: '25,000' },
  { name: 'Agra, Uttar Pradesh', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbHxlbnwwfHx8fDE3NTUwNjE4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'taj mahal', price: '24,000' },
  { name: 'Vrindavan, Uttar Pradesh', description: 'A holy town famous for its temples, including the stunning Prem Mandir.', image: 'https://images.unsplash.com/photo-1707938233687-47e61e5ad7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxQcmVtJTIwbWFuZGlyJTIwfGVufDB8fHx8MTc1NTA2MjI3NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'vrindavan temple', price: '20,000' },
  { name: 'Khajuraho, Madhya Pradesh', description: 'A UNESCO World Heritage site, famous for its stunning temples adorned with intricate and erotic sculptures.', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxLaGFqdXJhaG8lMjB8ZW58MHx8fHwxNzU1MDYyNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'khajuraho temple', price: '27,000' },
  { name: 'Ujjain, Madhya Pradesh', description: 'An ancient and sacred city on the Kshipra River, home to the Mahakaleshwar Jyotirlinga.', image: 'https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVamphaW4lMjB8ZW58MHx8fHwxNzU1MDYyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'ujjain temple', price: '23,000' },
];

const rajasthanStays = [
    { name: 'Rambagh Palace', location: 'Jaipur', type: 'Hotel', description: 'A former royal palace with ornate rooms, sprawling gardens, and a luxe spa.', image: 'https://images.unsplash.com/photo-1596386461350-326ccb383e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxSYW1iYWdoJTIwUGFsYWNlfGVufDB8fHx8MTc1NjA5NzE5OXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Rambagh Palace Jaipur' },
    { name: 'Umaid Bhawan Palace', location: 'Jodhpur', type: 'Hotel', description: 'A grand, art deco palace offering opulent suites, a spa, and pools.', image: 'https://images.unsplash.com/photo-1618821434313-937a4a25de8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVbWFpZCUyMEJoYXdhbiUyMFBhbGFjZXxlbnwwfHx8fDE3NTYwOTcyODV8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Umaid Bhawan Palace Jodhpur' },
    { name: 'The Oberoi Udaivilas', location: 'Udaipur', type: 'Hotel', description: 'A luxurious hotel with grand architecture, intricate domes, and serene pools.', image: 'https://images.unsplash.com/photo-1620177391308-4182dc7a77b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxUaGUlMjBPYmVyb2klMjBVZGFpdmlsYXN8ZW58MHx8fHwxNzU2MDk3MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'The Oberoi Udaivilas' },
    { name: 'Suvarna Mahal', location: 'Jaipur', type: 'Restaurant', description: 'Located in Rambagh Palace, this restaurant offers authentic Indian cuisine.', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU2MDk3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'restaurant interior' },
    { name: '1135 AD', location: 'Amer, Jaipur', type: 'Restaurant', description: 'A fine-dining restaurant with regal, candlelit interiors, and live music.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU2MDk3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'luxury restaurant' },
    { name: 'Cinnamon', location: 'Jaipur', type: 'Restaurant', description: 'An elegant restaurant in a historic mansion, serving creative Indian cuisine.', image: 'https://images.unsplash.com/photo-1578422473879-05244197793d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzU2MDk3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'elegant dining' },
];

const services = [
    { name: 'Flights', icon: Plane, href: '/trip' },
    { name: 'Hotels', icon: Hotel, href: '/search-page' },
    { name: 'Train & Bus', icon: Train, href: '#' },
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
        <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-muted transition-colors h-full">
            <Icon className="w-8 h-8 text-primary mb-2" />
            <p className="text-sm font-medium">{name}</p>
        </Card>
    </Link>
);

export default function SearchCardPage() {
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [carPickUpDate, setCarPickUpDate] = useState<Date | undefined>();
  const [carDropOffDate, setCarDropOffDate] = useState<Date | undefined>();
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookNow = (guide: typeof guides[0]) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  }


  return (
    <div className="flex flex-col gap-8">
      
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Explore Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {services.map((service) => (
                <ServiceCard key={service.name} icon={service.icon} name={service.name} href={service.href} />
            ))}
        </div>
      </section>
    </div>
  );
}
