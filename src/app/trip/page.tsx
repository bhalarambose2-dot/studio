
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plane, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function TripPage() {
  const [tripDates, setTripDates] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Plane className="text-primary"/>
                Plan Your Trip
            </CardTitle>
            <CardDescription>Find the best flights and plan your next adventure.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
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
            <Button type="submit" className="w-full h-10 lg:col-span-4"><Search className="mr-2" /> Search</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
