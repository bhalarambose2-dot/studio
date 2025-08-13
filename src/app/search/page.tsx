
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
import { Calendar as CalendarIcon, Users, Hotel, Plane, Search, MapPin, Car, Utensils, User, Globe } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';

export default function SearchPage() {
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [hotelDates, setHotelDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [carPickUpDate, setCarPickUpDate] = useState<Date | undefined>();
  const [carDropOffDate, setCarDropOffDate] = useState<Date | undefined>();


  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="relative -mx-4 -mt-8 md:-mx-8 md:-mt-8">
        <div className="relative h-[560px] w-full overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
           <Image
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbHxlbnwwfHx8fDE3MTY0OTQzMTB8MA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="Taj Mahal"
              data-ai-hint="taj mahal"
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
              Search and book flights & hotels with ease. Let All India Trip handle the planning.
            </p>
          </div>
          <Card className="mt-8 w-full max-w-4xl shadow-2xl">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="trip" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                  <TabsTrigger value="trip"><Search className="mr-2" /> Trip</TabsTrigger>
                  <TabsTrigger value="hotel"><Hotel className="mr-2" /> Hotel</TabsTrigger>
                  <TabsTrigger value="car"><Car className="mr-2" /> Car</TabsTrigger>
                  <TabsTrigger value="menu"><Utensils className="mr-2" /> Menu</TabsTrigger>
                  <TabsTrigger value="profile"><User className="mr-2" /> Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="trip" className="pt-4">
                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2 lg:col-span-2">
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
                    <Button type="submit" className="w-full h-10 lg:col-span-2"><Search className="mr-2" /> Search</Button>
                    <Link href="/destination-guides" className="w-full h-10 lg:col-span-2">
                      <Button variant="outline" className="w-full h-10"><Globe className="mr-2" /> Destination Guides</Button>
                    </Link>
                  </form>
                </TabsContent>
                 <TabsContent value="hotel" className="pt-4">
                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="hotel-location">Location</Label>
                      <Input id="hotel-location" placeholder="e.g., Jaipur, India" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotel-dates">Dates</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="hotel-dates"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !hotelDates.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {hotelDates.from ? (
                              hotelDates.to ? (
                                <>
                                  {format(hotelDates.from, "LLL dd, y")} -{" "}
                                  {format(hotelDates.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(hotelDates.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick check-in/out dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={hotelDates.from}
                            selected={hotelDates}
                            onSelect={(range) => setHotelDates({from: range?.from, to: range?.to})}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Guests</Label>
                      <Select defaultValue="2">
                        <SelectTrigger id="guests">
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                          <SelectItem value="5+">5+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full h-10 lg:col-span-4"><Search className="mr-2" /> Search Hotels</Button>
                  </form>
                </TabsContent>
                <TabsContent value="car" className="pt-4">
                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-location">Pick-up Location</Label>
                      <Input id="pickup-location" placeholder="e.g., Delhi Airport" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoff-location">Drop-off Location</Label>
                      <Input id="dropoff-location" placeholder="e.g., Jaipur City" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickup-date">Pick-up Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="pickup-date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !carPickUpDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {carPickUpDate ? format(carPickUpDate, "LLL dd, y") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={carPickUpDate}
                            onSelect={setCarPickUpDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="dropoff-date">Drop-off Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dropoff-date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !carDropOffDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {carDropOffDate ? format(carDropOffDate, "LLL dd, y") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={carDropOffDate}
                            onSelect={setCarDropOffDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                     <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="car-type">Car Type</Label>
                      <Select defaultValue="sedan">
                        <SelectTrigger id="car-type">
                          <SelectValue placeholder="Select car type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full h-10 lg:col-span-2"><Search className="mr-2" /> Search Cars</Button>
                  </form>
                </TabsContent>
                <TabsContent value="menu" className="pt-4">
                   <div className="text-center text-muted-foreground p-8">
                    <Utensils className="mx-auto h-12 w-12" />
                    <p className="mt-4">Menu options coming soon!</p>
                  </div>
                </TabsContent>
                <TabsContent value="profile" className="pt-4">
                   <div className="text-center text-muted-foreground p-8">
                    <User className="mx-auto h-12 w-12" />
                    <p className="mt-4">User profile section coming soon!</p>
                  </div>
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

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">New Season Destinations</h2>
        <p className="text-center text-muted-foreground mt-2 mb-8">Discover perfect getaways for the current season.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newSeasonDestinations.map((dest) => (
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
