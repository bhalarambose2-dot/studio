
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, IndianRupee, CreditCard } from "lucide-react";
import Image from "next/image";

const guides = [
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://images.unsplash.com/photo-1673807095861-04b24a39b0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxqYWlwdXIlMjBwYWxhY2V8ZW58MHx8fHwxNzU1MDU4Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'jaipur palace', price: '20,000' },
  { name: 'Kedarnath, Uttarakhand', description: 'A sacred Hindu temple nestled in the Himalayas, a major pilgrimage site.', image: 'https://images.unsplash.com/photo-1698574996391-73f103113f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVdHJha2hhbmQlMjB8ZW58MHx8fHwxNzU1MDU4NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'himalayan temple', price: '25,000' },
];

export default function DestinationGuidesPage({params, searchParams}: {params: {}, searchParams: {}}) {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Destination Guides</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover your next adventure with our expert travel guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              <div className="flex items-center text-sm text-primary mt-2 font-semibold">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Read Guide</span>
              </div>
            </CardContent>
            {guide.price && (
              <div className="p-4 pt-0">
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
