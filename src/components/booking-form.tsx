'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, CheckCircle2, QrCode, CreditCard, ShieldCheck, AlertCircle, IndianRupee, MapPin, Route, Clock, X } from 'lucide-react';
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
    const basePrice = parseFloat(String(itemDetails?.price)) || 500;
    if (bookingType === 'bike' || bookingType === 'car') {
        return basePrice * 10;
    }
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
        busNumber: itemDetails?.busNumber || 'N/A',
        busName: itemDetails?.name || tripName,
        amount: amount,
        txnId: txnId,
        ownerId: itemDetails?.ownerId || 'MOCK_OWNER_ID',
        status: 'Confirmed',
        bookingDate: new Date(), // Using JS date for immediate display
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

        if (bookingType === 'bus') {
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
            title: 'Payment Verified!',
            description: `Aapka ${bookingType} ticket confirm ho gaya hai!`,
        });

    } catch (error: any) {
        setIsLoading(false);
        console.error("Booking Error:", error);
        toast({ title: 'Booking Failed', description: 'Data save karne mein dikat aayi.', variant: 'destructive' });
    }
  };

  if (step === 'success' && confirmedBooking) {
      const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(confirmedBooking.tripName)}&output=embed`;
      return (
          <div className="space-y-6 p-2 animate-in fade-in zoom-in duration-300">
              <div className="text-center space-y-2">
                  <div className="mx-auto bg-green-100 text-green-600 p-4 rounded-full w-fit mb-4">
                      <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase text-green-600">Safar Confirmed!</h3>
                  <Badge className="bg-primary/10 text-primary border-none font-mono text-xs px-4 py-1">TICKET ID: {confirmedBooking.id}</Badge>
              </div>

              {/* Map in Booking Complete */}
              <div className="rounded-[2rem] overflow-hidden border-4 border-primary shadow-xl h-48 relative">
                  <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" className="w-full h-full grayscale-[0.2]"></iframe>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-primary/20 shadow-md">
                      <p className="text-[8px] font-black uppercase text-primary flex items-center gap-1">
                          <Clock className="h-2 w-2" /> Duration: 5-6 Hrs (Est.)
                      </p>
                  </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed pb-3">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Location</span>
                      <span className="font-bold text-sm italic">{confirmedBooking.tripName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed pb-3">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Travelers</span>
                      <span className="font-bold text-sm italic">{confirmedBooking.travelers} Persons</span>
                  </div>
                  {confirmedBooking.seatNumber && (
                    <div className="flex justify-between items-center border-b border-dashed pb-3">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Seat Lock</span>
                        <span className="font-black text-primary italic">{confirmedBooking.seatNumber}</span>
                    </div>
                  )}
                   <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Total Paid</span>
                      <span className="text-2xl font-black italic text-primary">₹{confirmedBooking.amount?.toLocaleString('en-IN')}</span>
                  </div>
              </div>

              <Button className="w-full h-14 font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20" onClick={() => onSuccess && onSuccess()}>
                  GO TO DASHBOARD
              </Button>
          </div>
      );
  }

  if (step === 'payment' && formData) {
    const totalAmount = calculateAmount(formData.travelers);
    const upiUrl = `upi://pay?pa=${upiId}&pn=BR%20Trip&am=${totalAmount}&cu=INR`;

    return (
        <div className="space-y-6 p-2">
            <div className="text-center space-y-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 font-black text-[10px] tracking-widest">STEP 2: PAYMENT & SAVING</Badge>
                <h3 className="text-2xl font-black italic">PAY ₹{totalAmount.toLocaleString('en-IN')}</h3>
                <p className="text-xs text-muted-foreground font-medium">Scan QR and enter UTR to save booking</p>
            </div>

            <div className="flex justify-center p-6 bg-white rounded-3xl border-4 border-primary shadow-2xl">
                <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`}
                    alt="Payment QR"
                    width={180}
                    height={180}
                    unoptimized
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between px-1">
                        <Label className="text-[10px] font-black uppercase text-primary">UPI Reference (12 Digits)</Label>
                        {txnId.length > 0 && txnId.length !== 12 && (
                            <span className="text-[10px] text-destructive font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Invalid ID</span>
                        )}
                    </div>
                    <Input 
                        placeholder="E.g. 401234567890"
                        value={txnId}
                        maxLength={12}
                        inputMode="numeric"
                        onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                        className="font-mono text-center tracking-[0.2em] h-14 text-xl font-black border-primary/40"
                    />
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-blue-800 leading-tight font-medium italic">
                        Transaction details save hone ke baad hi ticket valid hogi. Galat Transaction ID dalne par booking reject ho sakti hai.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => setStep('details')} disabled={isLoading}>BACK</Button>
                    <Button 
                        className="flex-1 h-12 font-black italic shadow-lg shadow-primary/20" 
                        disabled={txnId.length !== 12 || isLoading}
                        onClick={handleFinalConfirm}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                        PAY & CONFIRM
                    </Button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4 p-2">
        <div className="bg-primary/5 p-4 rounded-2xl border-2 border-dashed border-primary/20 mb-4">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Step 1: Booking Details</p>
            <p className="text-lg font-black italic leading-tight">{tripName}</p>
            <div className="flex items-center gap-1 text-primary mt-1 font-bold">
              <IndianRupee className="h-3 w-3" />
              <p className="text-xs">₹{itemDetails?.price?.toLocaleString('en-IN') || '500'} <span className="text-[10px] text-muted-foreground font-normal">/ {bookingType === 'bike' || bookingType === 'car' ? 'per km' : 'per unit'}</span></p>
            </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Passenger Name</FormLabel>
              <FormControl><Input placeholder="Aapka Naam" {...field} className="h-12 border-primary/10" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Email</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} className="h-12 border-primary/10" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Phone Number</FormLabel>
                  <FormControl><Input placeholder="+91 00000 00000" {...field} className="h-12 border-primary/10" /></FormControl>
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
              <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Number of Travelers</FormLabel>
              <FormControl><Input type="number" min="1" {...field} className="h-12 border-primary/10" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 shadow-sm bg-muted/20">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-[10px] text-muted-foreground font-medium">
                  Main sahi identification details dene ke liye taiyar hoon aur <Link href="/terms" className="text-primary font-bold hover:underline">Terms & Conditions</Link> se sahmat hoon.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full font-black italic text-lg h-14 shadow-xl shadow-primary/20 rounded-2xl uppercase tracking-widest">
            PROCEED TO PAYMENT
        </Button>
      </form>
    </Form>
  );
}
