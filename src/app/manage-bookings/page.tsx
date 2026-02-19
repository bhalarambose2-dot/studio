
'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query, Timestamp } from "firebase/firestore";
import { Briefcase, Loader2, Plus, Calendar, Users, Bus, Car, Bike, Hotel, MapPin, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TripBooking {
    id: string;
    tripName: string;
    travelers: number;
    bookingDate: Timestamp;
    bookingType: 'hotel' | 'bus' | 'bike' | 'car';
    amount: number;
    status: string;
    seatNumber?: string;
    pickup?: string;
    drop?: string;
}

function BookingCard({ booking }: { booking: TripBooking }) {
    const Icon = {
        hotel: Hotel,
        bus: Bus,
        bike: Bike,
        car: Car
    }[booking.bookingType] || Briefcase;

    return (
        <Card className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all rounded-[2rem] bg-white">
            <CardHeader className="bg-primary/5 pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl font-black italic uppercase tracking-tighter">
                        <div className="bg-primary text-white p-2 rounded-xl">
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className="truncate max-w-[150px]">{booking.tripName}</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black text-[10px] uppercase">
                        {booking.status}
                    </Badge>
                </div>
                <CardDescription className="text-[10px] font-bold uppercase opacity-60 flex justify-between items-center mt-1">
                    <span>ID: {booking.id.slice(0, 8).toUpperCase()}</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{booking.bookingType}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-muted-foreground">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>{booking.travelers} Traveler(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{booking.bookingDate?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </div>
                </div>
                
                {booking.seatNumber && (
                    <div className="bg-muted/30 p-2 rounded-xl border border-dashed flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Seat Number</span>
                        <span className="font-black text-primary italic">{booking.seatNumber}</span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Total Paid</span>
                    <span className="text-xl font-black italic text-primary">₹{booking.amount?.toLocaleString('en-IN')}</span>
                </div>

                {(booking.bookingType === 'bike' || booking.bookingType === 'car') && (
                    <Link href={`/search-page?tab=${booking.bookingType}`} className="w-full">
                        <Button variant="outline" className="w-full mt-2 h-10 rounded-xl border-primary/20 text-primary font-black italic uppercase text-[10px] hover:bg-primary hover:text-white transition-all group">
                            <MapPin className="w-3 h-3 mr-2 group-hover:animate-bounce" />
                            Open Route Guide
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}

export default function ManageBookingsPage() {
  const { firestore, user } = useFirebase();

  const bookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'bookings'),
        orderBy('bookingDate', 'desc')
    );
  }, [firestore, user]);

  const { data: bookings, isLoading } = useCollection<TripBooking>(bookingsQuery);

  if (isLoading) {
      return (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[400px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-black italic text-primary uppercase tracking-widest">Loading Your Safar History...</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto space-y-8 pb-24 max-w-6xl">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter italic text-primary uppercase flex items-center gap-2">
                <History className="h-8 w-8" />
                Booking History
            </h1>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.2em]">Aapka purana aur naya safar</p>
        </div>
        <Link href="/search">
            <Button className="h-12 px-6 font-black italic uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                <Plus className="mr-2 h-5 w-5" /> New Booking
            </Button>
        </Link>
      </header>
      
      {bookings && bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
            <div className="flex flex-col items-center gap-6">
                <div className="relative h-32 w-32 opacity-20">
                    <Briefcase className="w-full h-full text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">No bookings found</h2>
                    <p className="text-sm text-muted-foreground max-w-xs font-medium">Abhi tak aapne koi trip book nahi ki hai. Chaliye ek naya safar shuru karte hain!</p>
                </div>
                <Link href="/search">
                    <Button className="h-14 px-8 font-black italic uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                        <Plus className="mr-2 h-5 w-5" /> Start Your First Safar
                    </Button>
                </Link>
            </div>
        </div>
      )}
    </div>
  );
}
