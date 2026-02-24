
'use client';

import { useState } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ClipboardList, CheckCircle2, User, Phone, MapPin, Bus, Power, Bell, Navigation, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { useToast } from "@/hooks/use-toast";

export default function CaptainDashboardPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const [isOnline, setIsOnline] = useState(false);
  const { toast } = useToast();

  const handleOnlineToggle = (val: boolean) => {
    setIsOnline(val);
    toast({
      title: val ? "CAPTAIN ONLINE! 🟢" : "CAPTAIN OFFLINE 🔴",
      description: val ? "Ab aap naye ride requests receive kar sakte hain." : "Aapki duty ab band hai.",
    });
  };

  const boardingQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'busBookings'), orderBy('bookingDate', 'desc'));
  }, [firestore]);

  const { data: bookings, isLoading } = useCollection(boardingQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-bold italic">Checking Captain Status...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 pb-24">
      <header className="bg-white p-8 rounded-[3rem] shadow-xl border flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
            <div className={`p-4 rounded-[2rem] shadow-lg transition-colors ${isOnline ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                <Power className="h-10 w-10" />
            </div>
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-800">Captain Dashboard</h1>
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mt-1">Sahi Safar • Partner Connect</p>
            </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3 bg-slate-50 p-4 rounded-3xl border">
            <div className="flex items-center gap-3">
                <Label htmlFor="duty-mode" className={`font-black uppercase text-xs italic ${isOnline ? 'text-green-600' : 'text-slate-400'}`}>
                    {isOnline ? 'Active Duty' : 'Go Online'}
                </Label>
                <Switch id="duty-mode" checked={isOnline} onCheckedChange={handleOnlineToggle} />
            </div>
            <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px]">#CAP-{user?.uid.slice(0, 6).toUpperCase()}</Badge>
            </div>
        </div>
      </header>

      {isOnline ? (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                    <Bell className="text-primary animate-ring" />
                    New Ride Requests
                </h2>
                <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px]">{bookings?.length || 0} Waiting</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings && bookings.length > 0 ? (
                    bookings.map((b: any) => (
                        <Card key={b.id} className="border-none shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden rounded-[2.5rem] bg-white group">
                            <CardHeader className="bg-primary/5 pb-3 flex flex-row justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white p-2 rounded-xl shadow-sm"><IndianRupee className="h-4 w-4 text-primary" /></div>
                                    <span className="font-black italic text-lg text-primary">₹{b.amount}</span>
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-none uppercase text-[10px] font-black">Ready to Pick</Badge>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <User className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-black text-lg leading-none italic uppercase">{b.customerName}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-bold">
                                            <Phone className="h-3 w-3" /> {b.customerPhone}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-dashed">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-primary mt-1" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">Pickup</p>
                                            <p className="text-[11px] font-bold mt-1 leading-tight">{b.pickup || 'Paota Circle, Jodhpur'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Navigation className="h-4 w-4 text-secondary mt-1" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">Drop</p>
                                            <p className="text-[11px] font-bold mt-1 leading-tight">{b.tripName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[10px] uppercase h-12 rounded-xl transition-all">REJECT</button>
                                    <button className="flex-[2] bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase h-12 rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
                                        <CheckCircle2 className="h-4 w-4 group-hover:scale-125 transition-transform" />
                                        ACCEPT RIDE
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center opacity-40">
                        <Bell className="h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-xl font-black italic uppercase text-slate-400">Waiting for Rides...</p>
                        <p className="text-xs font-bold uppercase tracking-widest mt-1">Aapki location par koi booking nahi hai</p>
                    </div>
                )}
            </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center animate-in zoom-in-95 duration-500">
             <div className="h-32 w-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mb-6 shadow-inner">
                <Power className="h-16 w-16 text-slate-300" />
             </div>
             <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-300">Aap Abhi Offline Hain</h2>
             <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mt-2 max-w-xs">Duty shuru karne ke liye upar diye gaye switch ko on karein.</p>
        </div>
      )}
    </div>
  );
}
