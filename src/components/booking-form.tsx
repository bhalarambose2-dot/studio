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
  Clock,
  MapPin,
  Hotel as HotelIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Badge } from './ui/badge';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent } from './ui/card';

const bookingSchema = z.object({
  name: z.string().min(2, 'Pura naam likhein.'),
  email: z.string().email('Sahi email bharein.'),
  phone: z.string().min(10, 'Valid mobile number bharein.'),
  travelers: z.coerce.number().min(1, 'Kam se kam 1 traveler.'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Main pushti karta hoon ki payment baad mein karunga.' }),
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
    defaultValues: { name: '', email: '', phone: '', travelers: 1, terms: false },
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

  const onDetailsSubmit = async (values: BookingFormValues) => {
    if (!user) {
        toast({ title: 'Sign In Required', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    const amount = (parseFloat(String(itemDetails?.price)) || 500) * values.travelers;
    const ticketId = `ABC${Math.floor(10000 + Math.random() * 90000)}`;
    
    const bookingData = { 
        id: ticketId,
        userId: user.uid,
        tripName,
        customerName: values.name,
        customerPhone: values.phone,
        bookingType,
        amount,
        status: 'Confirmed (Pay Later)',
        bookingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: serverTimestamp(),
    };
    
    try {
        await updateUserProfile({ fullName: values.name, email: values.email, phone: values.phone });
        await addDoc(collection(firestore, 'users', user.uid, 'bookings'), bookingData);
        await addDoc(collection(firestore, 'busBookings'), bookingData);
        setConfirmedBooking(bookingData);
        setStep('success');
    } catch (error: any) {
        toast({ title: 'Booking Error', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  if (step === 'success' && confirmedBooking) {
      return (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="blue-header -mx-6 -mt-6 p-10 rounded-b-[2rem] flex flex-col items-center gap-4">
                  <div className="bg-white text-green-600 p-4 rounded-full shadow-lg">
                      <CheckCircle2 className="h-16 w-16" />
                  </div>
                  <h3 className="text-white text-xl font-bold">Hotel Booked Successfully!</h3>
              </div>

              <Card className="border-none shadow-md bg-slate-50 overflow-hidden mx-auto max-w-xs">
                  <CardContent className="p-6 space-y-4">
                      <div className="space-y-1">
                          <h4 className="text-xl font-black text-blue-900 uppercase italic">{confirmedBooking.tripName}</h4>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{itemDetails?.city || 'Mumbai'}</p>
                      </div>
                      <div className="h-px bg-slate-200 w-full" />
                      <div className="grid grid-cols-2 gap-4 text-left">
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Booking ID</p>
                              <p className="text-xs font-black text-slate-800">{confirmedBooking.id}</p>
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                              <p className="text-xs font-black text-slate-800">{confirmedBooking.bookingDate}</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm" onClick={() => onSuccess && onSuccess()}>
                  View Booking
              </Button>
          </div>
      );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[10px] font-bold text-slate-500">Full Name</FormLabel>
            <FormControl><Input {...field} className="h-10 bg-slate-50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold text-slate-500">Email</FormLabel>
              <FormControl><Input {...field} className="h-10 bg-slate-50 text-xs" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold text-slate-500">Phone</FormLabel>
              <FormControl><Input {...field} className="h-10 bg-slate-50 text-xs" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="terms" render={({ field }) => (
          <FormItem className="flex items-start space-x-2 space-y-0 p-2 bg-slate-50 rounded-lg">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <FormLabel className="text-[10px] font-bold text-slate-500">I agree to pay after ride/stay.</FormLabel>
          </FormItem>
        )} />
        <Button type="submit" disabled={isLoading} className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold">
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Booking'}
        </Button>
      </form>
    </Form>
  );
}
