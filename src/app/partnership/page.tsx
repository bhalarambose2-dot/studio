'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Handshake, Loader2, Star, ShieldCheck, TrendingUp } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Image from 'next/image';

const partnershipSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  businessName: z.string().min(2, 'Business name is required.'),
  businessType: z.enum(['hotel', 'car_rental', 'bus_operator', 'other']),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  message: z.string().optional(),
});

type PartnershipFormValues = z.infer<typeof partnershipSchema>;

export default function PartnershipPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      fullName: '',
      businessName: '',
      businessType: 'hotel',
      email: '',
      phone: '',
      message: '',
    },
  });

  const handlePartnerSubmit = async (values: PartnershipFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: 'Inquiry Submitted!',
      description: "Humein aapka request mil gaya hai. Hamari team aapse jald hi sampark karegi.",
    });
    form.reset();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden flex items-center justify-center text-center p-6">
        <Image 
          src="https://images.unsplash.com/photo-1557426282-08695039fc27?q=80&w=2070&auto=format&fit=crop"
          alt="Partnership handshake"
          data-ai-hint="partnership handshake"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 max-w-2xl text-white space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight italic">Partner With BR TRIP</h1>
          <p className="text-lg font-medium opacity-90">India ke sabse tezi se badhte travel network ka hissa banein aur apne business ko nayi unchaiyon par le jayein.</p>
        </div>
      </section>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none shadow-md bg-primary/5 p-6 text-center space-y-4">
          <div className="mx-auto bg-primary text-white p-3 rounded-2xl w-fit">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="font-black text-lg">Increased Revenue</h3>
          <p className="text-sm text-muted-foreground">Hazaaron naye customers tak pahunchein aur apne bookings ko 40% tak badhayein.</p>
        </Card>
        <Card className="border-none shadow-md bg-primary/5 p-6 text-center space-y-4">
          <div className="mx-auto bg-primary text-white p-3 rounded-2xl w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-black text-lg">Trusted Platform</h3>
          <p className="text-sm text-muted-foreground">BR TRIP ke bharosemand brand ke saath jud kar apne business ki credibility badhayein.</p>
        </Card>
        <Card className="border-none shadow-md bg-primary/5 p-6 text-center space-y-4">
          <div className="mx-auto bg-primary text-white p-3 rounded-2xl w-fit">
            <Star className="h-6 w-6" />
          </div>
          <h3 className="font-black text-lg">Priority Support</h3>
          <p className="text-sm text-muted-foreground">Hamare dedicated partner support manager se 24/7 help lein.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight">Kyon Chunein BR TRIP?</h2>
          <p className="text-muted-foreground">Hum sirf ek platform nahi, aapke growth partner hain. Hamara mission hai travel industry ko digital banana aur har chote-bade partner ko ek bada platform dena.</p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">✓</div>
              <p className="text-sm font-medium">Koi hidden charges nahi, simple commission model.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">✓</div>
              <p className="text-sm font-medium">Real-time dashboard se bookings track karein.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">✓</div>
              <p className="text-sm font-medium">Marketing aur promotion hamari taraf se.</p>
            </li>
          </ul>

          <div className="bg-muted p-6 rounded-2xl border-2 border-dashed">
            <p className="text-xs font-black uppercase text-muted-foreground mb-2">Direct Help Line</p>
            <p className="text-2xl font-bold text-primary italic">8306930595</p>
            <p className="text-xs text-muted-foreground mt-1">Call us for immediate support</p>
          </div>
        </div>

        <Card className="w-full shadow-2xl border-primary/10 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <CardTitle className="text-2xl font-black italic">Partner Inquiry Form</CardTitle>
            <CardDescription className="text-primary-foreground/80">Details bharein aur hum aapse 24 ghante mein sampark karenge.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePartnerSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sunrise Hotels" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel / Resort</SelectItem>
                          <SelectItem value="car_rental">Car Rental / Cab Service</SelectItem>
                          <SelectItem value="bus_operator">Bus Operator</SelectItem>
                          <SelectItem value="other">Other Travel Service</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} className="h-11" />
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
                          <Input type="tel" placeholder="+91 12345 67890" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Humein apne business ke baare mein bataiye..." {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20">
                  {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Handshake className="mr-2" />}
                  Submit Inquiry
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
