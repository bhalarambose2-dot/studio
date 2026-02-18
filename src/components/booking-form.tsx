'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';

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
}

export function BookingForm({ tripName, bookingType = 'hotel' }: BookingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { firestore, user } = useFirebase();

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

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) {
        toast({
            title: 'Authentication Error',
            description: 'You must be logged in to book.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    
    // Assign a mock seat number for bus bookings
    const seatNumber = bookingType === 'bus' ? `S-${Math.floor(Math.random() * 40) + 1}` : null;
    
    const bookingDetails = { 
        userId: user.uid,
        tripName: tripName,
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
        travelers: values.travelers,
        bookingType: bookingType,
        seatNumber: seatNumber,
        status: 'Confirmed',
        bookingDate: serverTimestamp(),
    };
    
    try {
        const collectionName = bookingType === 'bus' ? 'busBookings' : 'flightBookings';
        const bookingsColRef = collection(firestore, 'users', user.uid, collectionName);
        await addDoc(bookingsColRef, bookingDetails);
        
        toast({
            title: bookingType === 'bus' ? 'Bus Ticket Confirmed!' : 'Booking Confirmed!',
            description: (
              <div className="flex flex-col gap-1">
                <p>Successfully booked for {values.travelers} traveler(s).</p>
                {seatNumber && <p className="font-bold text-green-600">Seat Number: {seatNumber}</p>}
              </div>
            ),
        });

    } catch (error: any) {
        console.error("Booking Error: ", error);
        toast({
            title: 'Booking Failed',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 mb-4">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Trip Details</p>
            <p className="text-sm font-semibold">{tripName}</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passenger Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
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
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 00000 00000" {...field} />
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
              <FormLabel>Travelers</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-xs">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full font-bold h-12 shadow-lg shadow-primary/20">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (bookingType === 'bus' ? <Ticket className="mr-2 h-5 w-5" /> : <CheckCircle2 className="mr-2 h-5 w-5" />)}
            {bookingType === 'bus' ? 'Confirm Ticket' : 'Confirm Booking'}
        </Button>
      </form>
    </Form>
  );
}
