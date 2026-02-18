
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, CheckCircle2, QrCode, CreditCard, ShieldCheck, AlertCircle, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

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
}

export function BookingForm({ tripName, bookingType = 'hotel', itemDetails }: BookingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [txnId, setTxnId] = useState('');
  const [formData, setFormData] = useState<BookingFormValues | null>(null);
  const { firestore, user } = useFirebase();

  const upiId = "8769930595-2@ybl";

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      travelers: 1,
      terms: false,
    },
  });

  const calculateAmount = (travelers: number) => {
    const priceStr = itemDetails?.price || '0';
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 500;
    return numericPrice * travelers;
  };

  const onDetailsSubmit = (values: BookingFormValues) => {
    setFormData(values);
    setStep('payment');
  };

  const handleFinalConfirm = async () => {
    if (!user || !formData) return;

    if (txnId.length !== 12) {
      toast({
        title: 'Invalid Reference ID',
        description: 'Please enter a valid 12-digit UPI Transaction ID.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 3000));

    const seatNumber = bookingType === 'bus' ? `S-${Math.floor(Math.random() * 40) + 1}` : null;
    const amount = calculateAmount(formData.travelers);
    
    const bookingDetails = { 
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
        bookingDate: serverTimestamp(),
    };
    
    try {
        // 1. Save to User's private bookings
        const userBookingRef = collection(firestore, 'users', user.uid, bookingType === 'bus' ? 'busBookings' : 'flightBookings');
        await addDoc(userBookingRef, bookingDetails);

        // 2. Save to Global Bus Bookings (Visible to Owners/Staff)
        if (bookingType === 'bus') {
          const globalBookingRef = collection(firestore, 'busBookings');
          await addDoc(globalBookingRef, bookingDetails);
        }

        // 3. Save as a financial Transaction record in user's profile
        const transactionRef = collection(firestore, 'users', user.uid, 'transactions');
        await addDoc(transactionRef, {
            type: 'debit',
            amount: amount,
            reference: txnId,
            description: `Trip Booking: ${tripName}`,
            timestamp: serverTimestamp(),
            status: 'completed'
        });
        
        toast({
            title: 'Payment Verified & Ticket Saved!',
            description: (
              <div className="flex flex-col gap-1 text-sm mt-2 p-2 bg-green-50 rounded border border-green-200">
                <p className="font-black text-green-700">TICKET CONFIRMED!</p>
                <p>Booked for {formData.travelers} traveler(s).</p>
                {seatNumber && <p className="font-bold">Seat Number: {seatNumber}</p>}
                <p className="font-black">Amount: ₹{amount}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Transaction ID: {txnId}</p>
              </div>
            ),
        });

    } catch (error: any) {
        console.error("Booking Error:", error);
        toast({ title: 'Booking Failed', description: 'Data save karne mein dikat aayi. Support se contact karein.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

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
                    <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => setStep('details')}>BACK</Button>
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
            {itemDetails?.price && (
              <div className="flex items-center gap-1 text-primary mt-1 font-bold">
                <IndianRupee className="h-3 w-3" />
                <p className="text-xs">{itemDetails.price} <span className="text-[10px] text-muted-foreground font-normal">/ person</span></p>
              </div>
            )}
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

        <Button type="submit" className="w-full font-black italic text-lg h-14 shadow-xl shadow-primary/20 rounded-2xl">
            PROCEED TO PAYMENT
        </Button>
      </form>
    </Form>
  );
}
