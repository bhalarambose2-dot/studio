
'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ShieldAlert, Users, IndianRupee, TrendingUp, Ticket, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserProfile } from "@/lib/firebase/use-user-profile";

export default function AdminDashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && userProfile && userProfile.role !== 'admin') {
      router.push('/search');
    }
  }, [userProfile, isUserLoading, router]);

  const bookingsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'busBookings'), orderBy('bookingDate', 'desc'), limit(10));
  }, [firestore]);

  const usersQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'users'), limit(5));
  }, [firestore]);

  const { data: bookings, isLoading: isBookingsLoading } = useCollection(bookingsQuery);
  const { data: users, isLoading: isUsersLoading } = useCollection(usersQuery);

  if (isUserLoading || isBookingsLoading || isUsersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-bold">Loading Admin Power...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">
            <ShieldAlert className="text-primary h-10 w-10" />
            ADMIN CONSOLE
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-1">Platform Control Center</p>
        </div>
        <div className="text-right">
            <p className="font-bold">{userProfile?.fullName}</p>
            <Badge className="bg-red-500 text-white border-none uppercase text-[10px]">Super Admin</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg bg-primary/5">
            <CardContent className="p-6">
                <IndianRupee className="h-5 w-5 text-primary mb-2" />
                <p className="text-xs font-black uppercase text-muted-foreground">Global Revenue</p>
                <p className="text-3xl font-black">₹{bookings?.reduce((s, b) => s + (b.amount || 0), 0).toLocaleString('en-IN')}</p>
            </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
            <CardContent className="p-6">
                <Users className="h-5 w-5 text-primary mb-2" />
                <p className="text-xs font-black uppercase text-muted-foreground">Total Users</p>
                <p className="text-3xl font-black">{users?.length}+</p>
            </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
            <CardContent className="p-6">
                <Ticket className="h-5 w-5 text-primary mb-2" />
                <p className="text-xs font-black uppercase text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-black">{bookings?.length}</p>
            </CardContent>
        </Card>
         <Card className="border-none shadow-lg">
            <CardContent className="p-6">
                <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-xs font-black uppercase text-muted-foreground">Platform Growth</p>
                <p className="text-3xl font-black">+24%</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl">
            <CardHeader>
                <CardTitle className="font-black text-xl">LIVE BOOKING FEED</CardTitle>
                <CardDescription>Recent transactions across all routes.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Customer</TableHead>
                            <TableHead className="font-bold">Route</TableHead>
                            <TableHead className="font-bold">Amount</TableHead>
                            <TableHead className="font-bold text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings?.map((b: any) => (
                            <TableRow key={b.id}>
                                <TableCell className="font-medium">{b.customerName}</TableCell>
                                <TableCell className="text-xs">{b.busName}</TableCell>
                                <TableCell className="font-bold">₹{b.amount}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className="bg-green-100 text-green-700 uppercase text-[10px]">SUCCESS</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card className="border-none shadow-xl">
            <CardHeader>
                <CardTitle className="font-black text-xl">STAFF & USERS</CardTitle>
                <CardDescription>Recently joined accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {users?.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                            <UserCircle className="h-8 w-8 text-primary/40" />
                            <div>
                                <p className="text-sm font-bold leading-none">{u.fullName}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{u.email}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter">
                            {u.role}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
