'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query, Timestamp, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { 
    Briefcase, 
    Loader2, 
    Plus, 
    Calendar, 
    Users, 
    Bus, 
    Car, 
    Bike, 
    Hotel, 
    MapPin, 
    ChevronRight, 
    History, 
    CreditCard, 
    QrCode, 
    CheckCircle2, 
    AlertCircle,
    X
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TripBooking {
    id: string;
    tripName: string;
    travelers: number;
    bookingDate: string | Timestamp;
    bookingType: 'hotel' | 'bus' | 'bike' | 'car';
    amount: number;
    status: string;
    seatNumber?: string;
    pickup?: string;
    drop?: string;
}

function BookingCard({ booking, onPay }: { booking: TripBooking, onPay: (b: TripBooking) => void }) {
    const Icon = {
        hotel: Hotel,
        bus: Bus,
        bike: Bike,
        car: Car
    }[booking.bookingType] || Briefcase;

    const isPendingPayment = booking.status.includes('Pending') || booking.status.includes('Confirm (Pay');

    return (
        <Card className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all rounded-[2rem] bg-white border-b-4 border-b-primary/10">
            <CardHeader className="bg-primary/5 pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl font-black italic uppercase tracking-tighter text-slate-800">
                        <div className="bg-primary text-white p-2 rounded-xl shadow-lg">
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className="truncate max-w-[150px]">{booking.tripName}</span>
                    </CardTitle>
                    <Badge className={`${isPendingPayment ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} border-none font-black text-[10px] uppercase shadow-inner`}>
                        {booking.status}
                    </Badge>
                </div>
                <CardDescription className="text-[10px] font-bold uppercase opacity-60 flex justify-between items-center mt-1">
                    <span>ID: {booking.id.slice(0, 10).toUpperCase()}</span>
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
                        <span>
                            {typeof booking.bookingDate === 'string' 
                                ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                                : booking.bookingDate?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                            }
                        </span>
                    </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-xl border border-dashed flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">From</span>
                        <span className="text-[10px] font-bold text-primary italic">{booking.pickup || 'Paota Circle, Jodhpur'}</span>
                    </div>
                    {booking.seatNumber && (
                        <div className="flex items-center justify-between border-t border-dashed mt-1 pt-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground">Seat</span>
                            <span className="font-black text-primary italic">{booking.seatNumber}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">{isPendingPayment ? 'Amount to Pay' : 'Total Paid'}</span>
                    <span className="text-2xl font-black italic text-primary">₹{booking.amount?.toLocaleString('en-IN')}</span>
                </div>
            </CardContent>
            {isPendingPayment && (
                <CardFooter className="px-6 pb-6 pt-0">
                    <Button 
                        onClick={() => onPay(booking)}
                        className="w-full h-12 rounded-xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 group bg-primary hover:bg-primary/90"
                    >
                        <CreditCard className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                        Finish Ride & Pay
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

export default function ManageBookingsPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [selectedForPayment, setSelectedForPayment] = useState<TripBooking | null>(null);
  const [txnId, setTxnId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const bookingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'bookings'),
        orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: bookings, isLoading } = useCollection<TripBooking>(bookingsQuery);

  const handleVerifyPayment = async () => {
    if (txnId.length !== 12) {
        toast({ title: 'Invalid UTR', description: 'Kripya 12-digit ka transaction ID bharein.', variant: 'destructive' });
        return;
    }

    setIsVerifying(true);
    
    // Simulate bank verification
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        if (!user || !selectedForPayment) return;

        // In a real app, we'd update the specific document. 
        // For prototype, we'll find the document in the list or use its internal firestore id if available.
        // Since useCollection adds an 'id' field which is the doc ID:
        const bookingRef = doc(firestore, 'users', user.uid, 'bookings', (selectedForPayment as any).id);
        await updateDoc(bookingRef, {
            status: 'Confirmed & Paid',
            txnId: txnId
        });

        // Add to transactions history
        await addDoc(collection(firestore, 'users', user.uid, 'transactions'), {
            type: 'debit',
            amount: selectedForPayment.amount,
            reference: txnId,
            description: `Payment for ${selectedForPayment.bookingType.toUpperCase()} Safar`,
            timestamp: serverTimestamp(),
            status: 'completed'
        });

        setIsVerifying(false);
        setSelectedForPayment(null);
        setTxnId('');
        toast({ title: 'PAYMENT SUCCESS! ✅', description: 'Aapka transaction safal raha.' });
    } catch (e) {
        setIsVerifying(false);
        toast({ title: 'Error', description: 'Payment update karne mein dikkat aayi.', variant: 'destructive' });
    }
  };

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
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter italic text-primary uppercase flex items-center gap-2">
                <History className="h-8 w-8" />
                Aapka Safar History
            </h1>
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Sahi Safar • Sahi Nivesh • Sahi Rate</p>
        </div>
        <Link href="/search">
            <Button className="h-12 px-6 font-black italic uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white">
                <Plus className="mr-2 h-5 w-5" /> New Safar
            </Button>
        </Link>
      </header>
      
      {bookings && bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
                <BookingCard 
                    key={(booking as any).id} 
                    booking={booking} 
                    onPay={setSelectedForPayment} 
                />
            ))}
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
                    <Button className="h-14 px-8 font-black italic uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-5 w-5" /> Start Your First Safar
                    </Button>
                </Link>
            </div>
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={!!selectedForPayment} onOpenChange={(open) => !open && setSelectedForPayment(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-primary/20">
            {selectedForPayment && (
                <div className="space-y-6">
                    <DialogHeader>
                        <div className="flex justify-between items-center mb-2">
                            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-primary">Ride Complete! 🏁</DialogTitle>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedForPayment(null)} className="rounded-full h-8 w-8"><X className="h-4 w-4"/></Button>
                        </div>
                        <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                            Sahi Indian Rate Payment Gateway
                        </DialogDescription>
                    </DialogHeader>

                    <div className="text-center space-y-2 py-4 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Amount to Pay</p>
                        <p className="text-5xl font-black italic text-primary">₹{selectedForPayment.amount}</p>
                        <Badge variant="outline" className="bg-white border-primary/20 text-[9px] uppercase font-black tracking-widest">{selectedForPayment.tripName}</Badge>
                    </div>

                    <div className="flex justify-center p-6 bg-white rounded-[2.5rem] border-4 border-primary shadow-2xl relative overflow-hidden">
                        {isVerifying && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                                <p className="font-black italic text-lg text-primary uppercase">Verifying With Bank...</p>
                                <p className="text-[10px] font-bold text-muted-foreground mt-2">Kripya wait karein, hum status check kar rahe hain.</p>
                            </div>
                        )}
                        <Image 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=8769930595-2@ybl&pn=BR%20Trip&am=${selectedForPayment.amount}&cu=INR`)}`}
                            alt="Payment QR"
                            width={200}
                            height={200}
                            className="mx-auto"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-primary ml-1">UPI Ref Number (UTR - 12 Digits)</Label>
                            <Input 
                                placeholder="E.g. 401234567890"
                                value={txnId}
                                maxLength={12}
                                onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                                className="h-14 font-mono text-center text-xl font-black tracking-[0.4em] bg-slate-50 border-primary/30 rounded-xl shadow-inner"
                            />
                        </div>
                        <Button 
                            onClick={handleVerifyPayment} 
                            disabled={txnId.length !== 12 || isVerifying}
                            className="w-full h-14 rounded-xl font-black italic uppercase tracking-[0.1em] shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90"
                        >
                            {isVerifying ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Payment ✅'}
                        </Button>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
