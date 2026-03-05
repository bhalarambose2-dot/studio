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
  IndianRupee, 
  ChevronRight, 
  User as UserIcon, 
  Mail, 
  Phone,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Badge } from './ui/badge';
import { useUserProfile } from '@/lib/firebase/use-user-profile';

const bookingSchema = z.object({
  name: z.string().min(2, 'Pura naam likhein.'),
  email: z.string().email('Sahi email bharein.'),
  phone: z.string().min(10, 'Valid mobile number bharein.'),
  travelers: z.coerce.number().min(1, 'Kam se kam 1 traveler.'),
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
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const { firestore, user } = useFirebase();
  const { userProfile, updateUserProfile } = useUserProfile(user?.uid);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      travelers: 1,
      terms: false,
    },
  });

  useEffect(() => {
    if (userProfile || user) {
      form.reset({
        name: userProfile?.fullName || user?.displayName || '',
        email: userProfile?.email || user?.email || '',
        phone: userProfile?.phone || '',
        travelers: 1,
        terms: false,
      });
    }
  }, [userProfile, user, form]);

  const calculateAmount = (travelers: number) => {
    const distance = 10; // Default distance for prototype
    if (bookingType === 'bike') return 15 * distance; 
    if (bookingType === 'car') return 60 * distance;
    const basePrice = parseFloat(String(itemDetails?.price)) || 500;
    return basePrice * travelers;
  };

  const onDetailsSubmit = async (values: BookingFormValues) => {
    if (!user) {
        toast({ title: 'Sign In Required', description: 'Kripya booking se pehle login karein.', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    
    const amount = calculateAmount(values.travelers);
    const ticketId = `BT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const bookingData = { 
        id: ticketId,
        userId: user.uid,
        tripName: tripName,
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
        travelers: values.travelers,
        bookingType: bookingType,
        amount: amount,
        pickup: itemDetails?.pickup || 'Current Location',
        status: 'Confirmed (Pay After Ride)',
        bookingDate: new Date().toISOString(), 
        timestamp: serverTimestamp(),
    };
    
    try {
        // Save user profile details for next time
        await updateUserProfile({
            fullName: values.name,
            email: values.email,
            phone: values.phone
        });

        // Add to user's private bookings
        const bookingsRef = collection(firestore, 'users', user.uid, 'bookings');
        await addDoc(bookingsRef, bookingData);

        // Add to global manifest for staff/admin
        const globalRef = collection(firestore, 'busBookings');
        await addDoc(globalRef, bookingData);
        
        setConfirmedBooking(bookingData);
        setStep('success');
        setIsLoading(false);
        toast({ title: 'BOOKING CONFIRMED! ✅', description: `Aapka safar lock ho gaya hai. Payment ride ke baad karein.` });

    } catch (error: any) {
        setIsLoading(false);
        toast({ title: 'Booking Error', description: 'Data save nahi ho saka. Kripya phir se koshish karein.', variant: 'destructive' });
    }
  };

  if (step === 'success' && confirmedBooking) {
      return (
          <div className="space-y-8 p-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center space-y-3">
                  <div className="mx-auto bg-green-100 text-green-600 p-5 rounded-full w-fit mb-4 shadow-xl">
                      <CheckCircle2 className="h-14 w-14" />
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase text-green-600">Safar Locked!</h3>
                  <Badge className="bg-primary/10 text-primary border-none font-black font-mono text-xs px-6 py-1.5 uppercase">Ticket ID: {confirmedBooking.id}</Badge>
              </div>

              <div className="bg-muted/30 p-8 rounded-[2.5rem] space-y-4 shadow-inner border-2 border-dashed border-primary/10">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Passenger</span>
                      <span className="font-black text-sm italic">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Estimate</span>
                      <span className="text-xl font-black italic text-primary">₹{confirmedBooking.amount}</span>
                  </div>
                  <div className="pt-4 border-t flex items-center gap-2 text-primary font-black uppercase text-[9px] italic justify-center text-center">
                      <Clock className="h-3 w-3" />
                      <span>Ride complete hone ke baad payment karein</span>
                  </div>
              </div>

              <Button className="w-full h-16 font-black italic uppercase rounded-2xl shadow-xl bg-primary hover:bg-primary/90" onClick={() => onSuccess && onSuccess()}>
                  DONE & GO HOME
              </Button>
          </div>
      );
  }

  const ratePerKm = bookingType === 'bike' ? 15 : bookingType === 'car' ? 60 : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-6 p-4">
        <div className="bg-primary/5 p-6 rounded-[2rem] border-[3px] border-dashed border-primary/20">
            <p className="text-[11px] font-black text-primary uppercase mb-1 italic">Sahi Safar Details</p>
            <h3 className="text-2xl font-black italic uppercase leading-tight tracking-tighter">{tripName}</h3>
            <div className="flex items-center gap-2 text-primary mt-2 font-black italic">
              <IndianRupee className="h-4 w-4" />
              <p>{ratePerKm ? `₹${ratePerKm} Per Kilometer (Indian Rupees)` : `₹${itemDetails?.price || '500'} per person`}</p>
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
                        <Input placeholder="Full Name" {...field} className="h-14 pl-10 rounded-xl border-primary/20 shadow-inner font-bold italic" />
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
                        <Input placeholder="name@example.com" {...field} className="h-14 pl-10 rounded-xl border-primary/20 shadow-inner font-bold italic" />
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
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground ml-1">Mobile Number (WhatsApp)</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                        <Input placeholder="+91 00000 00000" {...field} className="h-14 pl-10 rounded-xl border-primary/20 shadow-inner font-bold italic" />
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
              <FormLabel className="text-[10px] font-black uppercase text-muted-foreground ml-1">Total Travelers</FormLabel>
              <FormControl><Input type="number" min="1" {...field} className="h-14 rounded-xl border-primary/20 font-black italic" /></FormControl>
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
                <FormLabel className="text-[10px] font-black italic uppercase leading-tight">Main pushti karta hoon ki ride ke baad payment karunga.</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full font-black italic text-xl h-16 shadow-[0_20px_40px_rgba(var(--primary),0.3)] rounded-[1.8rem] uppercase tracking-widest transition-transform active:scale-95 group bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <>CONFIRM BOOKING <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" /></>
            )}
        </Button>
      </form>
    </Form>
  );
}
