'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Bus, Users, IndianRupee, Calendar, TrendingUp, Ticket, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OwnerDashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && userProfile && userProfile.role !== 'bus_owner' && userProfile.role !== 'admin') {
      router.push('/search');
    }
  }, [userProfile, isUserLoading, router]);

  // For prototype, we show all bookings as if this user owns the buses
  const bookingsQuery = useMemoFirebase(() => {
    return query(
      collection(firestore, 'busBookings'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore]);

  const { data: bookings, isLoading } = useCollection(bookingsQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium italic">Best Part Loading: Your Business Insights...</p>
      </div>
    );
  }

  const totalEarnings = bookings?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;
  const totalTickets = bookings?.length || 0;
  const totalPassengers = bookings?.reduce((sum, b) => sum + (b.travelers || 0), 0) || 0;

  return (
    <div className="container mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Bus className="text-primary h-8 w-8" />
            Bus Malik Dashboard
          </h1>
          <p className="text-muted-foreground font-medium">Manage your fleet and track every rupee earned.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm py-1 px-3 font-bold">
              Owner: {userProfile?.fullName || 'Bus Malik'}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono uppercase">ID: {user?.uid.slice(0, 12)}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 opacity-90">
              <IndianRupee className="h-4 w-4" /> Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black italic">₹{totalEarnings.toLocaleString('en-IN')}</p>
            <p className="text-[10px] mt-2 flex items-center gap-1 opacity-80">
              <TrendingUp className="h-3 w-3" /> +12.5% Profit this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
              <Ticket className="h-4 w-4" /> Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{totalTickets}</p>
            <p className="text-[10px] text-muted-foreground mt-2">Total bookings processed</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
              <Users className="h-4 w-4" /> Total Passengers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{totalPassengers}</p>
            <p className="text-[10px] text-muted-foreground mt-2">Active travelers on-board</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
              <BarChart3 className="h-4 w-4" /> Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">98.2%</p>
            <p className="text-[10px] text-muted-foreground mt-2">Confirmed payment ratio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-black tracking-tight">LIVE PASSENGER MANIFEST</CardTitle>
                    <CardDescription>Real-time list of travelers for all your active routes.</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary uppercase font-bold tracking-tighter">Live Feed</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase">Customer</TableHead>
                      <TableHead className="font-bold text-xs uppercase">Bus / Route</TableHead>
                      <TableHead className="font-bold text-xs uppercase">Seat</TableHead>
                      <TableHead className="font-bold text-xs uppercase">Travelers</TableHead>
                      <TableHead className="font-bold text-xs uppercase">Amount</TableHead>
                      <TableHead className="font-bold text-xs uppercase">Booking Date</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings && bookings.length > 0 ? (
                      bookings.map((booking: any) => (
                        <TableRow key={booking.id} className="hover:bg-primary/5 transition-colors border-b last:border-0">
                          <TableCell>
                            <div className="font-bold text-sm">{booking.customerName}</div>
                            <div className="text-[10px] text-muted-foreground font-medium">{booking.customerPhone}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-[11px] bg-muted px-1 rounded inline-block">{booking.busNumber || 'BR-TRIP'}</div>
                            <div className="text-[10px] italic text-muted-foreground mt-1">{booking.tripName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary border-none font-mono text-xs">{booking.seatNumber || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{booking.travelers}</TableCell>
                          <TableCell className="font-black text-primary">₹{booking.amount}</TableCell>
                          <TableCell className="text-[11px] text-muted-foreground">
                            {booking.bookingDate && (typeof booking.bookingDate === 'string' 
                              ? new Date(booking.bookingDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                              : booking.bookingDate.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none uppercase text-[10px] font-black">
                              Confirmed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-24 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2 opacity-30">
                            <Calendar className="h-16 w-16" />
                            <p className="text-xl font-bold">No Bookings Yet</p>
                            <p className="text-sm">Wait for passengers to book seats on your buses.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
