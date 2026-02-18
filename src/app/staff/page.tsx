
'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ClipboardList, CheckCircle2, User, Phone, MapPin, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from "@/lib/firebase/use-user-profile";

export default function StaffDashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && userProfile && userProfile.role !== 'staff') {
      router.push('/search');
    }
  }, [userProfile, isUserLoading, router]);

  const boardingQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'busBookings'), orderBy('bookingDate', 'desc'));
  }, [firestore]);

  const { data: bookings, isLoading } = useCollection(boardingQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-bold italic">Checking Staff Access...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 pb-20">
      <header className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-end">
        <div>
          <Badge className="bg-white/20 text-white border-none uppercase mb-2 tracking-widest text-[10px]">Operation Staff</Badge>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <ClipboardList className="h-10 w-10" />
            DUTY BOARD
          </h1>
          <p className="text-primary-foreground/80 mt-2 font-medium">Manage passenger boarding and live operations.</p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p className="text-xs uppercase font-black opacity-60">Working Boy ID</p>
          <p className="text-lg font-bold">#ST-{user?.uid.slice(0, 6).toUpperCase()}</p>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
            <Bus className="text-primary" />
            LIVE PASSENGER LIST
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings && bookings.length > 0 ? (
                bookings.map((b: any) => (
                    <Card key={b.id} className="border-none shadow-md hover:shadow-xl transition-all overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-3 flex flex-row justify-between items-center">
                            <Badge className="font-mono bg-primary/10 text-primary border-none">SEAT: {b.seatNumber}</Badge>
                            <Badge className="bg-green-100 text-green-700 border-none uppercase text-[10px]">PAID</Badge>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-lg leading-none">{b.customerName}</p>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Phone className="h-3 w-3" /> {b.customerPhone}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">Bus Info:</span>
                                    <span className="font-bold">{b.busNumber}</span>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground italic px-6">{b.busName}</p>
                            </div>

                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                MARK BOARDED
                            </button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                    <p className="text-muted-foreground font-bold">No passengers listed for today's duty.</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
