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
import { Building2, Handshake, Loader2, Star, ShieldCheck, TrendingUp, MessageCircle, BarChart3, Coins } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

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
      <section className="relative h-64 md:h-96 w-full rounded-[3rem] overflow-hidden flex items-center justify-center text-center p-6 shadow-2xl">
        <Image 
          src="https://images.unsplash.com/photo-1557426282-08695039fc27?q=80&w=2070&auto=format&fit=crop"
          alt="Partnership handshake"
          data-ai-hint="partnership handshake"
          fill
          className="object-cover brightness-[0.4]"
        />
        <div className="relative z-10 max-w-3xl text-white space-y-4">
          <Badge className="bg-primary text-white border-none font-black px-4 py-1 mb-2">SAHI NIVESH (RIGHT INVEST)</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">Partner With BR TRIP</h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto">India ke sabse tezi se badhte travel network ka hissa banein. Apne business ko digital banayein aur sahi nivesh se growth payein.</p>
        </div>
      </section>

      {/* Stats/Investment Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none shadow-xl bg-primary/5 p-8 text-center space-y-4 border-b-4 border-b-primary">
          <div className="mx-auto bg-primary text-white p-4 rounded-3xl w-fit shadow-lg shadow-primary/20">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h3 className="font-black text-xl italic uppercase">High Returns</h3>
          <p className="text-sm text-muted-foreground font-medium">Hazaaron naye customers tak pahunchein aur apne bookings ko 40% tak badhayein. Sahi nivesh, sahi munafa.</p>
        </Card>
        <Card className="border-none shadow-xl bg-primary/5 p-8 text-center space-y-4 border-b-4 border-b-green-500">
          <div className="mx-auto bg-green-500 text-white p-4 rounded-3xl w-fit shadow-lg shadow-green-200">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="font-black text-xl italic uppercase">Secure Platform</h3>
          <p className="text-sm text-muted-foreground font-medium">BR TRIP ke bharosemand brand ke saath jud kar apne business ki credibility badhayein. Aapka data aur transactions secure hain.</p>
        </Card>
        <Card className="border-none shadow-xl bg-primary/5 p-8 text-center space-y-4 border-b-4 border-b-accent">
          <div className="mx-auto bg-accent text-white p-4 rounded-3xl w-fit shadow-lg shadow-accent/20">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="font-black text-xl italic uppercase">Digital Growth</h3>
          <p className="text-sm text-muted-foreground font-medium">Real-time analytics aur dashboard se apne business ki growth track karein. Business ko digital banane ka sahi waqt.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight italic">Kyon Chunein BR TRIP?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">Hum sirf ek platform nahi, aapke growth partner hain. Hamara mission hai travel industry ko digital banana aur har partner ko ek bada platform dena.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: "No Hidden Charges", desc: "Simple commission model, koi extra fees nahi." },
              { title: "Real-time Tracking", desc: "Live dashboard se har booking aur payment track karein." },
              { title: "Free Marketing", desc: "Aapke business ki branding aur promotion hamari team karegi." },
              { title: "Sahi Nivesh Policy", desc: "Partners ke liye special business benefits aur loyalty rewards." }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 font-bold">✓</div>
                <div>
                  <p className="font-black uppercase text-xs tracking-wide">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 p-8 rounded-[2rem] border-2 border-dashed border-primary/30 shadow-inner">
            <p className="text-xs font-black uppercase text-primary mb-2 tracking-widest">WhatsApp Support (24/7)</p>
            <a href="https://wa.me/918306930595" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-3xl font-black text-primary italic hover:underline">
              <MessageCircle className="h-8 w-8" />
              8306930595
            </a>
            <p className="text-xs text-muted-foreground mt-2 font-bold uppercase italic opacity-60">Message us for immediate business support</p>
          </div>
        </div>

        <Card className="w-full shadow-2xl border-primary/10 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-primary text-primary-foreground p-10">
            <div className="flex items-center gap-3 mb-2">
                <Coins className="h-6 w-6" />
                <Badge variant="outline" className="text-white border-white/40 text-[10px] uppercase font-black">Investment Inquiry</Badge>
            </div>
            <CardTitle className="text-3xl font-black italic">Partner Inquiry Form</CardTitle>
            <CardDescription className="text-primary-foreground/80 font-medium">Details bharein aur hum aapse 24 ghante mein sampark karenge.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePartnerSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold uppercase text-[10px]">Aapka Naam (Full Name)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-12 border-muted" />
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
                        <FormLabel className="font-bold uppercase text-[10px]">Business Ka Naam</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sunrise Hotels" {...field} className="h-12 border-muted" />
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
                      <FormLabel className="font-bold uppercase text-[10px]">Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-muted">
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
                        <FormLabel className="font-bold uppercase text-[10px]">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} className="h-12 border-muted" />
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
                        <FormLabel className="font-bold uppercase text-[10px]">Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 12345 67890" {...field} className="h-12 border-muted" />
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
                      <FormLabel className="font-bold uppercase text-[10px]">Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Humein apne business ke baare mein bataiye..." {...field} className="min-h-[120px] border-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full h-14 text-xl font-black italic shadow-2xl shadow-primary/30 rounded-2xl uppercase tracking-widest">
                  {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <Handshake className="mr-2 h-6 w-6" />}
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