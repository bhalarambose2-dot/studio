'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogIn, UserPlus, Loader2, Bus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  role: z.enum(['traveler', 'admin', 'staff', 'bus_owner']),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { auth, firestore, user, isUserLoading } = useFirebase();

  useEffect(() => {
    const checkRedirect = async () => {
        if (!isUserLoading && user) {
            try {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                const userData = userDoc.data();
                
                if (!userData) {
                    router.push('/search');
                    return;
                }

                if (userData.role === 'admin') {
                    router.push('/admin');
                } else if (userData.role === 'staff') {
                    router.push('/staff');
                } else if (userData.role === 'bus_owner') {
                    router.push('/owner-dashboard');
                } else {
                    router.push('/search');
                }
            } catch (error) {
                console.error("Redirection error:", error);
                router.push('/search');
            }
        }
    };
    checkRedirect();
  }, [user, isUserLoading, router, firestore]);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', role: 'traveler', password: '', confirmPassword: '' },
  });

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Signed In Successfully',
        description: `Welcome back!`,
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      const names = values.fullName.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const userDocRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        firstName,
        lastName,
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        walletBalance: 0,
        kycStatus: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: 'Account Created',
        description: `Account created as ${values.role}.`,
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-black">
       <Image
          src="https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=2062&auto=format&fit=crop"
          alt="Starry night sky"
          data-ai-hint="starry night"
          fill
          className="object-cover -z-20 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 -z-10" />
        
        {/* Animated Glow Backdrops */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <Card className="w-full max-w-md bg-white/5 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-white/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/20 p-3 rounded-2xl w-fit mb-4 border border-white/10 shadow-lg">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">BR TRIP</CardTitle>
          <CardDescription className="text-white/60 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Sahi Nivesh • Sahi Safar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl mb-6">
              <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-white/20 text-white h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-white/20 text-white h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-black italic shadow-2xl shadow-primary/30 rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <LogIn className="mr-2 h-6 w-6" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-white/20 text-white h-12 rounded-xl"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-white/20 text-white h-12 rounded-xl"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Register As</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-12 rounded-xl">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-900 border-white/10 text-white">
                            <SelectItem value="traveler">Traveler / Customer</SelectItem>
                            <SelectItem value="bus_owner">Bus Malik / Owner</SelectItem>
                            <SelectItem value="admin">Platform Admin</SelectItem>
                            <SelectItem value="staff">Working Boy / Staff</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-white/20 text-white h-12 rounded-xl"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-black text-white/50 tracking-widest">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-white/20 text-white h-12 rounded-xl"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-black italic shadow-2xl shadow-primary/30 rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 mt-4">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <UserPlus className="mr-2 h-6 w-6" />}
                    Sign Up
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

import { Briefcase } from 'lucide-react';