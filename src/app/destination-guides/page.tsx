
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

const guides = [
  { name: 'Jaipur, Rajasthan', description: 'The Pink City, known for its stunning forts and palaces.', image: 'https://placehold.co/600x400.png', hint: 'jaipur palace' },
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
              <div className="flex items-center text-sm text-primary mt-4 font-semibold">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Read Guide</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
