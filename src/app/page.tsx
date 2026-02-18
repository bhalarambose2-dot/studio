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
import { LogIn, UserPlus, Loader2, Bus, Briefcase } from 'lucide-react';
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
        <div className="flex items-center justify-center min-h-screen bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-slate-50">
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-white shadow-2xl relative z-10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pb-2 pt-10">
          <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-4 shadow-inner">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black italic tracking-tighter text-foreground">BR TRIP</CardTitle>
          <CardDescription className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mt-1">Sahi Nivesh • Sahi Safar</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-2xl mb-8">
              <TabsTrigger value="signin" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-black uppercase text-xs">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all font-black uppercase text-xs">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-slate-50 border-slate-200 focus:border-primary/50 h-14 rounded-2xl font-medium" />
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50 border-slate-200 focus:border-primary/50 h-14 rounded-2xl font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl shadow-primary/20 rounded-2xl uppercase tracking-widest">
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-slate-50 border-slate-200 focus:border-primary/50 h-12 rounded-2xl font-medium"/>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-slate-50 border-slate-200 focus:border-primary/50 h-12 rounded-2xl font-medium"/>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Register As</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-50 border-slate-200 focus:border-primary/50 h-12 rounded-2xl font-medium">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl">
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50 border-slate-200 focus:border-primary/50 h-12 rounded-2xl font-medium"/>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50 border-slate-200 focus:border-primary/50 h-12 rounded-2xl font-medium"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl shadow-primary/20 rounded-2xl uppercase tracking-widest mt-6">
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