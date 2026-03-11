
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
  ChevronRight, 
  User as UserIcon, 
  Mail, 
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Badge } from './ui/badge';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const bookingSchema = z.object({
  name: z.string().min(2, 'Pura naam likhein.'),
  email: z.string().email('Sahi email bharein.'),
  phone: z.string().min(10, 'Valid 10-digit mobile number bharein.'),
  travelers: z.coerce.number().min(1, 'Kam se kam 1 traveler.'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'I agree par click karein.' }),
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
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        import('leaflet').then(mod => {
            setL(mod.default);
        });
    }
  }, []);

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
        toast({ title: 'Kripya Login Karein', description: 'Pehle login hona zaroori hai.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    
    const finalAmount = parseFloat(String(itemDetails?.price || 500)) * (bookingType === 'hotel' ? values.travelers : 1);
    const pnrId = `ST${Math.floor(100000 + Math.random() * 900000)}`;
    
    const bookingData = { 
        id: pnrId,
        userId: user.uid,
        tripName,
        customerName: values.name,
        customerPhone: values.phone,
        bookingType,
        amount: finalAmount,
        status: 'Confirmed (Pay After Ride)',
        bookingDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: serverTimestamp(),
        pickup: itemDetails?.pickup || '',
        drop: itemDetails?.drop || '',
        distance: itemDetails?.distance || 0,
        seatNumber: bookingType === 'bus' ? `S${Math.floor(Math.random() * 40) + 1}` : null
    };
    
    try {
        await updateUserProfile({ 
          fullName: values.name, 
          email: values.email, 
          phone: values.phone 
        });

        await addDoc(collection(firestore, 'users', user.uid, 'bookings'), bookingData);
        await addDoc(collection(firestore, 'busBookings'), bookingData);
        
        setConfirmedBooking(bookingData);
        setStep('success');
        
        toast({ title: 'SAFAR BOOKED! ✅', description: `Aapka booking confirm ho gaya hai.` });
    } catch (error: any) {
        toast({ title: 'Booking Failed', description: 'Kripya dobara koshish karein.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  if (step === 'success' && confirmedBooking) {
      return (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-primary/5 -mx-8 -mt-8 p-10 rounded-b-[3.5rem] flex flex-col items-center gap-4 border-b-4 border-primary/10">
                  <div className="bg-primary text-white p-4 rounded-3xl shadow-2xl animate-bounce">
                      <CheckCircle2 className="h-16 w-16" />
                  </div>
                  <h3 className="text-primary text-2xl font-black italic uppercase tracking-tighter">Booking Confirmed!</h3>
              </div>

              <Card className="border-none shadow-2xl bg-slate-50 overflow-hidden mx-auto max-w-sm rounded-[2rem] border-b-4 border-primary/20">
                  <CardContent className="p-8 space-y-6">
                      <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Trip Name</p>
                          <h4 className="text-xl font-black text-slate-800 uppercase italic leading-tight">{confirmedBooking.tripName}</h4>
                      </div>
                      <div className="h-px bg-slate-200 w-full border-dashed border-b" />
                      <div className="grid grid-cols-2 gap-4 text-left">
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">PNR ID</p>
                              <p className="text-sm font-black text-primary italic">{confirmedBooking.id}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                              <Badge className="bg-orange-100 text-orange-700 h-5 text-[9px] font-black uppercase border-none">PAY LATER</Badge>
                          </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl flex items-center justify-between border">
                          <p className="text-xs font-black uppercase text-slate-500">Total Amount</p>
                          <p className="text-2xl font-black italic text-primary">₹{confirmedBooking.amount}</p>
                      </div>
                  </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white mt-4">
                  <CardHeader className="bg-primary/5 pb-2 text-left">
                    <CardTitle className="text-sm font-black italic uppercase tracking-tighter">
                        BR TRIP CITIES MAP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div key={`map-container-${confirmedBooking.id}`} className="h-[300px] w-full relative z-0">
                      {typeof window !== 'undefined' && L && confirmedBooking && (
                        <MapContainer 
                          key={`map-instance-${confirmedBooking.id}`}
                          center={[26.9124, 75.7873]} 
                          zoom={6} 
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={false}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker position={[26.9124, 75.7873]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                            <Popup>Jaipur City</Popup>
                          </Marker>
                          <Marker position={[26.2389, 73.0243]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                            <Popup>Jodhpur City</Popup>
                          </Marker>
                        </MapContainer>
                      )}
                    </div>
                  </CardContent>
              </Card>

              <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black italic uppercase rounded-2xl shadow-xl shadow-primary/20 text-lg group" onClick={() => onSuccess && onSuccess()}>
                  MY SAFAR HISTORY <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
          </div>
      );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-5">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[10px] font-black uppercase text-slate-500 ml-1">Sahi Naam (Full Name)</FormLabel>
            <FormControl>
                <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                    <Input {...field} placeholder="Jaise: Rajesh Kumar" className="h-12 pl-12 bg-slate-50 border-none shadow-inner font-bold rounded-xl" />
                </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase text-slate-500 ml-1">Email</FormLabel>
              <FormControl>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                    <Input {...field} placeholder="Email" className="h-12 pl-12 bg-slate-50 border-none shadow-inner font-bold rounded-xl" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase text-slate-500 ml-1">Mobile No.</FormLabel>
              <FormControl>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                    <Input {...field} placeholder="9876543210" className="h-12 pl-12 bg-slate-50 border-none shadow-inner font-bold rounded-xl" maxLength={10} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="bg-primary/5 p-4 rounded-2xl border border-dashed border-primary/20 space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Booking Type</p>
                <Badge className="bg-primary text-white border-none uppercase text-[9px] italic font-black">{bookingType.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <p className="text-[10px] font-black uppercase text-primary">Total Sahi Price</p>
                <p className="text-2xl font-black italic text-primary">₹{String(itemDetails?.price || 500)}</p>
            </div>
        </div>

        <FormField control={form.control} name="terms" render={({ field }) => (
          <FormItem className="flex items-start space-x-3 space-y-0 p-4 bg-slate-50 rounded-2xl border border-primary/10 shadow-sm">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <div className="space-y-1">
                <FormLabel className="text-[10px] font-black uppercase text-slate-500 leading-none">Main pushti karta hoon ki payment ride/stay ke baad karunga.</FormLabel>
                <p className="text-[9px] text-primary font-bold italic">Pay After Safar Policy applies.</p>
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isLoading} className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black italic uppercase rounded-2xl shadow-xl shadow-primary/30 text-lg group">
            {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : <><ShieldCheck className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" /> CONFIRM SAFAR BOOKING</>}
        </Button>
      </form>
    </Form>
  );
}
