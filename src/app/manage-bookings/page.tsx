
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query, Timestamp } from "firebase/firestore";
import { Briefcase, Loader2, Plus, Calendar, Users } from "lucide-react";
import Image from "next/image";

interface FlightBooking {
    id: string;
    tripName: string;
    travelers: number;
    bookingDate: Timestamp;
}

function BookingCard({ booking }: { booking: FlightBooking }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="text-primary" />
                    {booking.tripName}
                </CardTitle>
                <CardDescription>
                    Booking ID: {booking.id}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.travelers} Traveler(s)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Booked on: {booking.bookingDate?.toDate().toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}


export default function ManageBookingsPage() {
  const { firestore, user } = useFirebase();

  const bookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'flightBookings'),
        orderBy('bookingDate', 'desc')
    );
  }, [firestore, user]);

  const { data: bookings, isLoading } = useCollection<FlightBooking>(bookingsQuery);

  if (isLoading) {
      return (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-semibold text-muted-foreground">Loading your trips...</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full gap-6">
       <header>
        <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
        <p className="text-muted-foreground">View and manage your upcoming and past bookings.</p>
      </header>
      
      {bookings && bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex flex-col items-center gap-4">
                <Image 
                    src="https://placehold.co/128x128.png"
                    alt="Backpacker icon"
                    data-ai-hint="backpacker icon"
                    width={128}
                    height={128}
                    className="opacity-60"
                />
                <h2 className="text-xl font-semibold text-muted-foreground">Your trips will appear here</h2>
                <p className="text-sm text-muted-foreground max-w-xs">Once you book a trip, you'll be able to see all the details right here.</p>
                <Button>
                    <Plus className="mr-2 h-5 w-5" /> Find a Trip
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
