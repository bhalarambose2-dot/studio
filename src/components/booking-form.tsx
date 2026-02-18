
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, CheckCircle2, QrCode, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
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
        ownerId: 'MOCK_OWNER_ID',
        status: 'Confirmed',
        bookingDate: serverTimestamp(),
    };
    
    try {
        const userBookingRef = collection(firestore, 'users', user.uid, bookingType === 'bus' ? 'busBookings' : 'flightBookings');
        await addDoc(userBookingRef, bookingDetails);

        if (bookingType === 'bus') {
          const globalBookingRef = collection(firestore, 'busBookings');
          await addDoc(globalBookingRef, bookingDetails);
        }
        
        toast({
            title: 'Payment Verified & Ticket Confirmed!',
            description: (
              <div className="flex flex-col gap-1 text-sm">
                <p>Successfully booked for {formData.travelers} traveler(s).</p>
                {seatNumber && <p className="font-bold text-green-600">Seat Number: {seatNumber}</p>}
                <p className="font-medium">Amount Paid: ₹{amount}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Ref: {txnId}</p>
              </div>
            ),
        });

    } catch (error: any) {
        toast({ title: 'Booking Failed', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  if (step === 'payment' && formData) {
    const totalAmount = calculateAmount(formData.travelers);
    const upiUrl = `upi://pay?pa=${upiId}&pn=BR%20Trip&am=${totalAmount}&cu=INR`;

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <Badge variant="outline" className="bg-primary/5 text-primary">Step 2: Payment</Badge>
                <h3 className="text-xl font-bold">Pay ₹{totalAmount.toLocaleString('en-IN')}</h3>
                <p className="text-xs text-muted-foreground">Scan QR with GPay, PhonePe, or Paytm</p>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-xl border-2 border-primary/20 shadow-inner">
                <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`}
                    alt="Payment QR"
                    width={180}
                    height={180}
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label className="text-xs font-bold uppercase">UPI Reference (12 Digits)</Label>
                        {txnId.length > 0 && txnId.length !== 12 && (
                            <span className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Invalid</span>
                        )}
                    </div>
                    <Input 
                        placeholder="Enter 12-digit UTR from payment app"
                        value={txnId}
                        maxLength={12}
                        onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                        className="font-mono text-center tracking-widest h-12"
                    />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 leading-tight">
                        Payment karne ke baad, apna transaction reference number yahan bharein. Simulation ke liye koi bhi 12-digit number use karein.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep('details')}>Back</Button>
                    <Button 
                        className="flex-1 font-bold" 
                        disabled={txnId.length !== 12 || isLoading}
                        onClick={handleFinalConfirm}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                        Confirm Payment
                    </Button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4">
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 mb-4">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Step 1: Booking Details</p>
            <p className="text-sm font-semibold">{tripName}</p>
            {itemDetails?.price && <p className="text-xs text-muted-foreground mt-1">Base Price: ₹{itemDetails.price} / person</p>}
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passenger Name</FormLabel>
              <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="+91 00000 00000" {...field} /></FormControl>
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
              <FormLabel>Number of Travelers</FormLabel>
              <FormControl><Input type="number" min="1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-muted/20">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-[10px] text-muted-foreground">
                  I agree to provide accurate identification and accept the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full font-bold h-12 shadow-lg shadow-primary/20">
            Proceed to Payment
        </Button>
      </form>
    </Form>
  );
}
