
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, IndianRupee, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BookingForm } from "@/components/booking-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

const guides = [
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://images.unsplash.com/photo-1673807095861-04b24a39b0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxqYWlwdXIlMjBwYWxhY2V8ZW58MHx8fHwxNzU1MDU4Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaipur palace', price: '20,000' },
  { name: 'Kedarnath, Uttarakhand', description: 'A sacred Hindu temple nestled in the Himalayas, a major pilgrimage site.', image: 'https://images.unsplash.com/photo-1698574996391-73f103113f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVdHJha2hhbmQlMjB8ZW58MHx8fHwxNzU1MDU4NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'himalayan temple', price: '45,000' },
  { name: 'Goa, India', description: 'Famous for its beaches, nightlife, and Portuguese-influenced architecture.', image: 'https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxHb2F8ZW58MHx8fHwxNzU1MDU2MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'goa beach', price: '30,000' },
  { name: 'Kerala, India', description: "Known as 'God's Own Country', famous for its backwaters, lush greenery, and serene beaches.", image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzfGVufDB8fHx8MTc1NTExODc0MXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'kerala backwaters', price: '35,000' },
  { name: 'Jaisalmer, Rajasthan', description: 'The Golden City, known for its massive fort and camel safaris in the Thar Desert.', image: 'https://images.unsplash.com/photo-1713349881676-594b95a5742b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8SmFpc2FsbWVyJTIwfGVufDB8fHx8MTc1NTA2MDQ5NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaisalmer fort', price: '28,000' },
  { name: 'Jodhpur, Rajasthan', description: 'The Blue City, famous for the Mehrangarh Fort and its blue-painted houses.', image: 'https://images.unsplash.com/photo-1721973733816-1791a072295a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8Sm9kaHB1ciUyMHxlbnwwfHx8fDE3NTUwNjA3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jodhpur fort', price: '26,000' },
  { name: 'Rishikesh, Uttarakhand', description: 'The Yoga Capital of the World, known for its ashrams and adventure sports.', image: 'https://images.unsplash.com/photo-1650341259809-9314b0de9268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxSaXNoaWtlc2glMjB8ZW58MHx8fHwxNzU1MDYxMzMzfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'rishikesh bridge', price: '18,000' },
  { name: 'Nainital, Uttarakhand', description: 'A charming Himalayan lake town with a bustling market and scenic views.', image: 'https://images.unsplash.com/photo-1601622256416-d7f757f99eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxOYWluaXRhbCUyMHxlbnwwfHx8fDE3NTUwNjE0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'nainital lake', price: '22,000' },
  { name: 'Mumbai, Maharashtra', description: 'The bustling financial capital, famous for Bollywood, street food, and colonial architecture.', image: 'https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxNdW1iYWklMjB8ZW58MHx8fHwxNzU1MDYxNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'mumbai skyline', price: '32,000' },
  { name: 'Varanasi, Uttar Pradesh', description: 'The spiritual capital of India, known for its sacred ghats and Ganga Aarti.', image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMHxlbnwwfHx8fDE3NTUwNTk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'varanasi ghats', price: '25,000' },
  { name: 'Agra, Uttar Pradesh', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbHxlbnwwfHx8fDE3NTUwNjE4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'taj mahal', price: '24,000' },
  { name: 'Vrindavan, Uttar Pradesh', description: 'A holy town famous for its temples, including the stunning Prem Mandir.', image: 'https://images.unsplash.com/photo-1707938233687-47e61e5ad7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxQcmVtJTIwbWFuZGlyJTIwfGVufDB8fHx8MTc1NTA2MjI3NXww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'vrindavan temple', price: '20,000' },
  { name: 'Khajuraho, Madhya Pradesh', description: 'A UNESCO World Heritage site, famous for its stunning temples adorned with intricate and erotic sculptures.', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxLaGFqdXJhaG8lMjB8ZW58MHx8fHwxNzU1MDYyNzIyfDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'khajuraho temple', price: '27,000' },
  { name: 'Ujjain, Madhya Pradesh', description: 'An ancient and sacred city on the Kshipra River, home to the Mahakaleshwar Jyotirlinga.', image: 'https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVamphaW4lMjB8ZW58MHx8fHwxNzU1MDYyNjM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'ujjain temple', price: '23,000' },
];

export default function DestinationGuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBookNow = (guide: typeof guides[0]) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Destination Guides</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover your next adventure with our expert travel guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <Card key={guide.name} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="p-0">
              <div className="relative h-56 w-full">
                <Image
                  src={guide.image}
                  alt={`Image of ${guide.name}`}
                  data-ai-hint={guide.hint}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{guide.name}</h2>
              <p className="text-muted-foreground flex-grow">{guide.description}</p>
              {guide.price && (
                <div className="flex items-center text-lg font-bold text-accent mt-4">
                  <IndianRupee className="w-5 h-5 mr-2" />
                  <span>{guide.price}</span>
                </div>
              )}
              <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary mt-2 font-semibold hover:underline">
                <MapPin className="w-4 h-4 mr-2" />
                <span>View on Map</span>
              </Link>
            </CardContent>
            {guide.price && (
              <div className="p-4 pt-0">
                 <Button className="w-full" onClick={() => handleBookNow(guide)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
       {selectedGuide && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
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

    

    

    
