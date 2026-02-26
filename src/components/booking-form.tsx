'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  IndianRupee, 
  MapPin, 
  Clock, 
  Navigation2, 
  Navigation, 
  ChevronRight, 
  User as UserIcon, 
  Mail, 
  Phone 
} from 'lucide-react';
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
    errorMap: () => ({ message: 'Terms accept karna zaroori hai.' }),
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
  const { userProfile, updateUserProfile } = useUserProfile(user?.uid);

  const upiId = "8769930595-2@ybl";

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: userProfile?.fullName || user?.displayName || '',
      email: userProfile?.email || user?.email || '',
      phone: userProfile?.phone || '',
      travelers: 1,
      terms: false,
    },
  });

  // Effect to auto-fill details when profile loads
  useEffect(() => {
    if (userProfile) {
      form.reset({
        ...form.getValues(),
        name: userProfile.fullName || form.getValues().name,
        email: userProfile.email || user?.email || form.getValues().email,
        phone: userProfile.phone || form.getValues().phone,
      });
    }
  }, [userProfile, user, form]);

  const calculateAmount = (travelers: number) => {
    const distance = 10; // Default estimate for prototype
    if (bookingType === 'bike') return 15 * distance; 
    if (bookingType === 'car') return 60 * distance;
    const basePrice = parseFloat(String(itemDetails?.price)) || 500;
    return basePrice * travelers;
  };

  const onDetailsSubmit = (values: BookingFormValues) => {
    setFormData(values);
    setStep('payment');
  };

  const handleFinalConfirm = async () => {
    if (!user || !formData) return;

    if (txnId.length !== 12) {
      toast({ title: 'Invalid Reference', description: 'Kripya sahi 12-digit UTR ID bharein.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    const amount = calculateAmount(formData.travelers);
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
        amount: amount,
        txnId: txnId,
        pickup: itemDetails?.pickup || 'Current Location',
        drop: tripName,
        status: 'Confirmed',
        bookingDate: new Date(), 
        timestamp: serverTimestamp(),
    };
    
    try {
        // Save details to user profile for next time (Smart Saving)
        await updateUserProfile({
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone
        });

        const userBookingRef = collection(firestore, 'users', user.uid, 'bookings');
        addDoc(userBookingRef, bookingDetails).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userBookingRef.path,
                operation: 'create',
                requestResourceData: bookingDetails
            }));
        });

        const transactionRef = collection(firestore, 'users', user.uid, 'transactions');
        addDoc(transactionRef, {
            type: 'debit',
            amount: amount,
            reference: txnId,
            description: `${bookingType.toUpperCase()} Booking: ${tripName}`,
            timestamp: serverTimestamp(),
            status: 'completed'
        });
        
        setConfirmedBooking(bookingDetails);
        setStep('success');
        setIsLoading(false);
        toast({ title: 'PAYMENT VERIFIED! ✅', description: `Aapka safar confirm ho gaya hai!` });

    } catch (error: any) {
        setIsLoading(false);
        toast({ title: 'Booking Failed', description: 'Data save nahi ho saka.', variant: 'destructive' });
    }
  };

  if (step === 'success' && confirmedBooking) {
      return (
          <div className="space-y-8 p-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center space-y-3">
                  <div className="mx-auto bg-green-100 text-green-600 p-5 rounded-full w-fit mb-4 shadow-xl animate-bounce">
                      <CheckCircle2 className="h-14 w-14" />
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase text-green-600">Safar Locked!</h3>
                  <Badge className="bg-primary/10 text-primary border-none font-black font-mono text-xs px-6 py-1.5">ID: {confirmedBooking.id}</Badge>
              </div>

              <div className="bg-muted/30 p-8 rounded-[2.5rem] space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Passenger</span>
                      <span className="font-black text-sm italic">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Phone</span>
                      <span className="font-black text-sm italic">{confirmedBooking.customerPhone}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Amount Paid</span>
                      <span className="text-2xl font-black italic text-primary">₹{confirmedBooking.amount}</span>
                  </div>
              </div>

              <Button className="w-full h-16 font-black italic uppercase rounded-2xl shadow-xl" onClick={() => onSuccess && onSuccess()}>
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
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">PAY ₹{totalAmount} (Indian Rupees)</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Scan & Enter UTR below</p>
            </div>

            <div className="flex justify-center p-8 bg-white rounded-[3rem] border-[6px] border-primary shadow-2xl">
                <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`}
                    alt="Payment QR"
                    width={220}
                    height={220}
                    unoptimized
                />
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase text-primary">UPI Reference (12 Digits)</Label>
                    <Input 
                        placeholder="E.g. 401234567890"
                        value={txnId}
                        maxLength={12}
                        onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                        className="font-mono text-center tracking-[0.4em] h-16 text-2xl font-black border-primary/40 rounded-2xl shadow-inner"
                    />
                </div>

                <div className="flex gap-4 pt-2">
                    <Button variant="outline" className="flex-1 h-14 font-black italic rounded-2xl" onClick={() => setStep('details')} disabled={isLoading}>BACK</Button>
                    <Button className="flex-1 h-14 font-black italic shadow-xl rounded-2xl uppercase" disabled={txnId.length !== 12 || isLoading} onClick={handleFinalConfirm}>
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
        <div className="bg-primary/5 p-6 rounded-[2rem] border-[3px] border-dashed border-primary/20">
            <p className="text-[11px] font-black text-primary uppercase mb-1 italic">Safar Details</p>
            <h3 className="text-2xl font-black italic uppercase leading-tight tracking-tighter">{tripName}</h3>
            <div className="flex items-center gap-2 text-primary mt-2 font-black italic">
              <IndianRupee className="h-4 w-4" />
              <p>{currentRate ? `₹${currentRate} per km (Indian Rupees)` : `₹${itemDetails?.price || '500'}`}</p>
            </div>
        </div>

        <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground ml-1">Passenger Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                        <Input placeholder="Aapka Naam" {...field} className="h-12 pl-10 rounded-xl border-primary/20 shadow-inner italic font-bold" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                        <Input placeholder="you@example.com" {...field} className="h-12 pl-10 rounded-xl border-primary/20 shadow-inner italic font-bold" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground ml-1">WhatsApp Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                        <Input placeholder="+91 00000 00000" {...field} className="h-12 pl-10 rounded-xl border-primary/20 shadow-inner italic font-bold" />
                    </div>
                  </FormControl>
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
              <FormLabel className="text-[10px] font-black uppercase text-muted-foreground ml-1">Travelers</FormLabel>
              <FormControl><Input type="number" min="1" {...field} className="h-12 rounded-xl border-primary/20 italic font-black" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border-[2px] border-dashed p-4 shadow-sm bg-muted/20 border-primary/10">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-[10px] font-black italic uppercase">Main sahi details dene ke liye sahmat hoon.</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full font-black italic text-xl h-16 shadow-2xl rounded-[1.5rem] uppercase tracking-widest group">
            PROCEED TO PAYMENT <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
        </Button>
      </form>
    </Form>
  );
}
