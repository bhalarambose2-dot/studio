import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

const guides = [
  { name: 'Kyoto, Japan', description: 'Ancient temples, sublime gardens, and traditional geishas.', image: 'https://placehold.co/600x400.png', hint: 'kyoto temple' },
  { name: 'Paris, France', description: 'The city of light, love, and the Eiffel Tower.', image: 'https://placehold.co/600x400.png', hint: 'paris street' },
  { name: 'Santorini, Greece', description: 'Iconic blue-domed churches and stunning sunsets.', image: 'https://placehold.co/600x400.png', hint: 'santorini buildings' },
  { name: 'Rome, Italy', description: 'A journey through history with the Colosseum and Roman Forum.', image: 'https://placehold.co/600x400.png', hint: 'rome colosseum' },
  { name: 'New York, USA', description: 'The city that never sleeps, full of iconic landmarks.', image: 'https://placehold.co/600x400.png', hint: 'new york city' },
  { name: 'Maui, Hawaii', description: 'Lush landscapes, beautiful beaches, and volcanic craters.', image: 'https://placehold.co/600x400.png', hint: 'maui beach' },
  { name: 'London, UK', description: 'A vibrant mix of history, culture, and modernity.', image: 'https://placehold.co/600x400.png', hint: 'london bridge' },
  { name: 'Bora Bora', description: 'Ultimate tropical paradise with overwater bungalows.', image: 'https://placehold.co/600x400.png', hint: 'bora bora' },
];

export default function DestinationGuidesPage() {
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
