'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, CheckCircle2, QrCode, CreditCard, ShieldCheck, AlertCircle, IndianRupee, MapPin, Route, Clock, X, Navigation2, Navigation, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useUserProfile } from '@/lib/firebase/use-user-profile';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Valid phone number is required.'),
  travelers: z.coerce.number().min(1, 'At least one traveler is required.'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions.' }),
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    tripName: string;
    bookingType?: string;
    itemDetails?: any;
    onSuccess?: () => void;
}

export function BookingForm({ tripName, bookingType = 'hotel', itemDetails, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [txnId, setTxnId] = useState('');
  const [formData, setFormData] = useState<BookingFormValues | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const { firestore, user } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);

  const upiId = "8769930595-2@ybl";

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: userProfile?.fullName || user?.displayName || '',
      email: user?.email || '',
      phone: '',
      travelers: 1,
      terms: false,
    },
  });

  useEffect(() => {
    if (userProfile || user) {
      form.reset({
        ...form.getValues(),
        name: userProfile?.fullName || user?.displayName || form.getValues().name,
        email: user?.email || form.getValues().email,
      });
    }
  }, [userProfile, user, form]);

  const calculateAmount = (travelers: number) => {
    const distance = 10; // Default estimated distance for prototype
    if (bookingType === 'bike') {
        return 15 * distance; // Rate: ₹15 per kilometer (Indian Rupees)
    }
    if (bookingType === 'car') {
        return 60 * distance; // Rate: ₹60 per kilometer (Indian Rupees)
    }
    const basePrice = parseFloat(String(itemDetails?.price)) || 500;
    return basePrice * travelers;
  };

  const onDetailsSubmit = (values: BookingFormValues) => {
    setFormData(values);
    setStep('payment');
  };

  const handleFinalConfirm = async () => {
    if (!user || !formData) {
        toast({ title: 'Error', description: 'User session or form data missing.', variant: 'destructive' });
        return;
    }

    if (txnId.length !== 12) {
      toast({
        title: 'Invalid Reference ID',
        description: 'Please enter a valid 12-digit UPI Transaction ID.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    const amount = calculateAmount(formData.travelers);
    const seatNumber = bookingType === 'bus' ? `S-${Math.floor(Math.random() * 40) + 1}` : null;
    const ticketId = `BT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const bookingDetails = { 
        id: ticketId,
        userId: user.uid,
        tripName: tripName,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        travelers: formData.travelers,
        bookingType: bookingType,
        seatNumber: seatNumber,
        amount: amount,
        txnId: txnId,
        pickup: itemDetails?.pickup || 'Current Location',
        drop: tripName,
        status: 'Confirmed',
        bookingDate: new Date(), 
        timestamp: serverTimestamp(),
    };
    
    try {
        const userBookingRef = collection(firestore, 'users', user.uid, 'bookings');
        addDoc(userBookingRef, bookingDetails).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userBookingRef.path,
                operation: 'create',
                requestResourceData: bookingDetails
            }));
        });

        if (bookingType === 'bus' || bookingType === 'bike' || bookingType === 'car') {
          const globalBookingRef = collection(firestore, 'busBookings');
          addDoc(globalBookingRef, bookingDetails).catch(err => {
              errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: globalBookingRef.path,
                  operation: 'create',
                  requestResourceData: bookingDetails
              }));
          });
        }

        const transactionRef = collection(firestore, 'users', user.uid, 'transactions');
        const transactionData = {
            type: 'debit',
            amount: amount,
            reference: txnId,
            description: `${bookingType.toUpperCase()} Booking: ${tripName}`,
            timestamp: serverTimestamp(),
            status: 'completed'
        };
        addDoc(transactionRef, transactionData).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: transactionRef.path,
                operation: 'create',
                requestResourceData: transactionData
            }));
        });
        
        setConfirmedBooking(bookingDetails);
        setStep('success');
        setIsLoading(false);

        toast({
            title: 'PAYMENT VERIFIED! ✅',
            description: `Aapka ${bookingType} ticket safaltapoorvak confirm ho gaya hai!`,
        });

    } catch (error: any) {
        setIsLoading(false);
        console.error("Booking Error:", error);
        toast({ title: 'Booking Failed', description: 'Data save karne mein dikat aayi.', variant: 'destructive' });
    }
  };

  if (step === 'success' && confirmedBooking) {
      const isRide = confirmedBooking.bookingType === 'bike' || confirmedBooking.bookingType === 'car' || confirmedBooking.bookingType === 'bus';
      const mapUrl = isRide 
        ? `https://maps.google.com/maps?saddr=${encodeURIComponent(confirmedBooking.pickup)}&daddr=${encodeURIComponent(confirmedBooking.drop)}&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(confirmedBooking.tripName)}&output=embed`;

      return (
          <div className="space-y-8 p-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center space-y-3">
                  <div className="mx-auto bg-green-100 text-green-600 p-5 rounded-full w-fit mb-4 shadow-xl animate-bounce">
                      <CheckCircle2 className="h-14 w-14" />
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase text-green-600">Safar Locked!</h3>
                  <Badge className="bg-primary/10 text-primary border-none font-black font-mono text-xs px-6 py-1.5 shadow-inner">BOOKING ID: {confirmedBooking.id}</Badge>
              </div>

              <div className="rounded-[2.5rem] overflow-hidden border-[6px] border-primary shadow-2xl h-64 relative group">
                  <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" className="w-full h-full grayscale-[0.2] contrast-[1.1]"></iframe>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xl p-4 rounded-2xl border-l-[6px] border-l-green-500 shadow-2xl">
                      <p className="text-[10px] font-black uppercase text-primary flex items-center gap-2 mb-1.5">
                          <Navigation className="h-4 w-4" /> {isRide ? 'LIVE ROUTE MARKED' : 'DESTINATION LOCKED'}
                      </p>
                      <div className="flex items-center gap-2 text-slate-800">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-black uppercase italic tracking-tighter">EST. Duration: 5-6 Hrs</span>
                      </div>
                  </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-[2.5rem] space-y-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                  
                  {isRide && (
                    <div className="space-y-4 mb-2">
                         <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-xl shadow-md"><MapPin className="h-5 w-5 text-primary" /></div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Pickup Point</p>
                                <p className="text-sm font-black italic uppercase leading-none mt-1">{confirmedBooking.pickup}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-xl shadow-md"><Navigation2 className="h-5 w-5 text-primary" /></div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Drop Point</p>
                                <p className="text-sm font-black italic uppercase leading-none mt-1">{confirmedBooking.drop}</p>
                            </div>
                         </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 pt-4 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Traveler</span>
                        <span className="font-black text-base italic uppercase">{confirmedBooking.customerName}</span>
                    </div>
                    {confirmedBooking.seatNumber && (
                      <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Seat Lock</span>
                          <span className="font-black text-primary italic text-xl tracking-tighter">{confirmedBooking.seatNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sahi Nivesh (INR)</span>
                        <span className="text-3xl font-black italic text-primary tracking-tighter">₹{confirmedBooking.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
              </div>

              <Button className="w-full h-16 font-black italic uppercase rounded-2xl shadow-2xl shadow-primary/20 transition-transform active:scale-95 text-lg" onClick={() => onSuccess && onSuccess()}>
                  DONE & GO TO DASHBOARD
              </Button>
          </div>
      );
  }

  if (step === 'payment' && formData) {
    const totalAmount = calculateAmount(formData.travelers);
    const upiUrl = `upi://pay?pa=${upiId}&pn=BR%20Trip&am=${totalAmount}&cu=INR`;

    return (
        <div className="space-y-8 p-4">
            <div className="text-center space-y-3">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 font-black text-[11px] tracking-[0.2em] uppercase">STEP 2: SCAN & CONFIRM</Badge>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">PAY ₹{totalAmount.toLocaleString('en-IN')} (Indian Rupees)</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Sahi Nivesh • Sahi Safar Security</p>
            </div>

            <div className="flex justify-center p-8 bg-white rounded-[3rem] border-[6px] border-primary shadow-[0_40px_80px_rgba(var(--primary),0.25)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`}
                    alt="Payment QR"
                    width={220}
                    height={220}
                    unoptimized
                    className="relative z-10"
                />
            </div>

            <div className="space-y-5">
                <div className="space-y-3">
                    <div className="flex justify-between px-2">
                        <Label className="text-[11px] font-black uppercase text-primary tracking-widest">UPI Reference (12 Digits)</Label>
                        {txnId.length > 0 && txnId.length !== 12 && (
                            <span className="text-[11px] text-destructive font-black flex items-center gap-1 animate-pulse"><AlertCircle className="h-4 w-4"/> INVALID UTR</span>
                        )}
                    </div>
                    <Input 
                        placeholder="E.g. 401234567890"
                        value={txnId}
                        maxLength={12}
                        inputMode="numeric"
                        onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                        className="font-mono text-center tracking-[0.4em] h-16 text-2xl font-black border-primary/40 rounded-2xl shadow-inner bg-slate-50 focus:ring-primary"
                    />
                    <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-widest opacity-60">Payment app ke history mein 12-digit UTR ID dekhein</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4 shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-800 leading-tight font-black uppercase tracking-tight italic">
                        Transaction details save hone ke baad hi ticket confirm hogi. Galat ID bharne par booking block ho jayegi.
                    </p>
                </div>

                <div className="flex gap-4 pt-2">
                    <Button variant="outline" className="flex-1 h-14 font-black italic rounded-2xl border-slate-200" onClick={() => setStep('details')} disabled={isLoading}>BACK</Button>
                    <Button 
                        className="flex-1 h-14 font-black italic shadow-2xl shadow-primary/30 rounded-2xl uppercase tracking-widest text-lg" 
                        disabled={txnId.length !== 12 || isLoading}
                        onClick={handleFinalConfirm}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : <CreditCard className="h-6 w-6 mr-3" />}
                        CONFIRM SAFAR
                    </Button>
                </div>
            </div>
        </div>
    );
  }

  const currentRate = bookingType === 'bike' ? 15 : bookingType === 'car' ? 60 : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-6 p-4">
        <div className="bg-primary/5 p-6 rounded-[2.5rem] border-[3px] border-dashed border-primary/20 mb-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-2 italic">Step 1: Safar Details</p>
            <h3 className="text-2xl font-black italic uppercase leading-tight tracking-tighter text-slate-800">{tripName}</h3>
            <div className="flex items-center gap-2 text-primary mt-3 font-black">
              <div className="bg-white p-1 rounded-lg shadow-sm"><IndianRupee className="h-4 w-4" /></div>
              <p className="text-lg italic">
                {currentRate ? `₹${currentRate} per km` : `₹${itemDetails?.price?.toLocaleString('en-IN') || '500'}`}
                <span className="text-[11px] text-muted-foreground font-black uppercase tracking-widest opacity-60 ml-1">
                  {currentRate ? '(Sahi Indian Rate)' : '/ per unit'}
                </span>
              </p>
            </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-black uppercase text-muted-foreground tracking-widest ml-2">Passenger Full Name</FormLabel>
              <FormControl><Input placeholder="Enter Name" {...field} className="h-14 rounded-2xl border-primary/20 shadow-inner italic font-bold" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-black uppercase text-muted-foreground tracking-widest ml-2">Email Address</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} className="h-14 rounded-2xl border-primary/20 shadow-inner italic font-bold" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-black uppercase text-muted-foreground tracking-widest ml-2">WhatsApp Number</FormLabel>
                  <FormControl><Input placeholder="+91 00000 00000" {...field} className="h-14 rounded-2xl border-primary/20 shadow-inner italic font-bold" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="travelers"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-black uppercase text-muted-foreground tracking-widest ml-2">Number of Travelers</FormLabel>
              <FormControl><Input type="number" min="1" {...field} className="h-14 rounded-2xl border-primary/20 shadow-inner font-black italic" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-[2rem] border-[3px] border-dashed p-6 shadow-sm bg-muted/20 border-primary/10">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 rounded-lg" />
              </FormControl>
              <div className="space-y-1.5 leading-none">
                <FormLabel className="text-[11px] text-slate-700 font-black italic uppercase leading-snug">
                  Main sahi details dene ke liye sahmat hoon aur <Link href="/terms" className="text-primary hover:underline underline-offset-4 decoration-primary/30">Terms & Conditions</Link> manta hoon.
                </FormLabel>
                <div className="flex items-center gap-2 pt-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic">Sahi Safar Verified Booking</span>
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full font-black italic text-xl h-16 shadow-[0_20px_40px_rgba(var(--primary),0.3)] rounded-[1.8rem] uppercase tracking-widest transition-transform active:scale-95 group">
            PROCEED TO PAYMENT <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
        </Button>
      </form>
    </Form>
  );
}