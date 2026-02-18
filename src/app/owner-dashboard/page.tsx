'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Bus, Users, IndianRupee, Calendar, TrendingUp, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OwnerDashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();

  // For prototype, we show all bookings as if this user owns the buses
  const bookingsQuery = useMemoFirebase(() => {
    return query(
      collection(firestore, 'busBookings'),
      orderBy('bookingDate', 'desc')
    );
  }, [firestore]);

  const { data: bookings, isLoading } = useCollection(bookingsQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Fetching Owner Data...</p>
      </div>
    );
  }

  const totalEarnings = bookings?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;
  const totalTickets = bookings?.length || 0;
  const totalPassengers = bookings?.reduce((sum, b) => sum + (b.travelers || 0), 0) || 0;

  return (
    <div className="container mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Bus className="text-primary h-8 w-8" />
            Bus Malik Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your buses and track your earnings.</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 text-sm py-1 px-3">
          Owner ID: {user?.uid.slice(0, 8)}...
        </Badge>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <IndianRupee className="h-4 w-4" /> Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">₹{totalEarnings.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" /> +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <Ticket className="h-4 w-4" /> Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{totalTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all active routes</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <Users className="h-4 w-4" /> Total Passengers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{totalPassengers}</p>
            <p className="text-xs text-muted-foreground mt-1">Confirmed travelers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Ticket Bookings</CardTitle>
          <CardDescription>Live list of all passengers who booked seats on your buses.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Bus Number</TableHead>
                  <TableHead className="font-bold">Seat</TableHead>
                  <TableHead className="font-bold">Travelers</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <TableRow key={booking.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-[10px] text-muted-foreground">{booking.customerPhone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-xs">{booking.busNumber}</div>
                        <div className="text-[10px] italic">{booking.busName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">{booking.seatNumber}</Badge>
                      </TableCell>
                      <TableCell>{booking.travelers}</TableCell>
                      <TableCell className="font-bold">₹{booking.amount}</TableCell>
                      <TableCell className="text-xs">
                        {booking.bookingDate?.toDate().toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none uppercase text-[10px]">
                          Paid
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto opacity-20 mb-2" />
                      Abhi tak koi bookings nahi hui hain.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}