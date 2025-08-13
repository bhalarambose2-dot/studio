'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Calendar as CalendarIcon, Users, Hotel, Plane, Search, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const popularDestinations = [
  { name: 'Kyoto, Japan', image: 'https://placehold.co/400x300.png', hint: 'temple pagoda' },
  { name: 'Santorini, Greece', image: 'https://placehold.co/400x300.png', hint: 'white buildings coast' },
  { name: 'Paris, France', image: 'https://placehold.co/400x300.png', hint: 'eiffel tower' },
  { name: 'Bora Bora, French Polynesia', image: 'https://placehold.co/400x300.png', hint: 'overwater bungalow' },
];

export default function Home() {
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="relative -mx-4 -mt-4 md:-mx-6 md:-mt-6">
        <div className="relative h-[560px] w-full overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
           <Image
              src="https://placehold.co/1920x1080.png"
              alt="Tropical beach background"
              data-ai-hint="tropical beach"
              fill
              className="object-cover"
              priority
            />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground drop-shadow-md">
              Your Next Adventure Starts Here
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow-sm">
              Search and book flights & hotels with ease. Let BR TRIP handle the planning.
            </p>
          </div>
          <Card className="mt-8 w-full max-w-4xl shadow-2xl">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="trip" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="trip"><Search className="mr-2" /> Trip Search</TabsTrigger>
                </TabsList>
                <TabsContent value="trip" className="pt-4">
                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input id="destination" placeholder="e.g., Paris, France" />
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
                            onSelect={(range) => setTripDates({from: range?.from, to: range?.to})}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interests">Activities / Interests</Label>
                      <Input id="interests" placeholder="e.g., Museums, Hiking" />
                    </div>
                    <Button type="submit" className="w-full h-10 lg:col-span-3"><Search className="mr-2" /> Search</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">Popular Destinations</h2>
        <p className="text-center text-muted-foreground mt-2 mb-8">Explore breathtaking places curated for you.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <Link href="/destination-guides" key={dest.name}>
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={dest.image}
                      alt={`Image of ${dest.name}`}
                      data-ai-hint={dest.hint}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{dest.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Destination Guide</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
