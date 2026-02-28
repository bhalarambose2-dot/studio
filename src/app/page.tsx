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
import { LogIn, UserPlus, Loader2, Briefcase, Mail, Bike, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { sendOtpEmail } from '@/ai/flows/send-otp-email';

const signInSchema = z.object({
  email: z.string().email('Sahi email bharein.'),
  password: z.string().min(1, 'Password zaroori hai.'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Pura naam likhein.'),
  email: z.string().email('Sahi email bharein.'),
  role: z.enum(['traveler', 'admin', 'staff', 'bus_owner']),
  password: z.string().min(8, 'Password kam se kam 8 digits ka ho.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords match nahi kar rahe.",
  path: ['confirmPassword'],
});

const emailOtpSchema = z.object({
  email: z.string().email('Kripya valid email bharein.'),
  otpCode: z.string().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type EmailOTPFormValues = z.infer<typeof emailOtpSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOtpStep, setCurrentOtpStep] = useState<'email' | 'code'>('email');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { auth, firestore, user, isUserLoading } = useFirebase();

  useEffect(() => {
    const checkRedirect = async () => {
        if (!isUserLoading && user) {
            try {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                const userData = userDoc.data();
                if (!userData) { router.push('/search'); return; }
                if (userData.role === 'admin') router.push('/admin');
                else if (userData.role === 'staff' || userData.role === 'bus_owner') router.push('/staff');
                else router.push('/search');
            } catch (error) {
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

  const otpForm = useForm<EmailOTPFormValues>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: { email: '', otpCode: '' },
  });

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error: any) {
      setIsLoading(false);
      toast({ title: 'Login Fail', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;
      const userDocRef = doc(firestore, "users", newUser.uid);
      setDocumentNonBlocking(userDocRef, {
        id: newUser.uid,
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      toast({ title: 'Welcome!', description: `Sahi Safar mein aapka swagat hai.` });
    } catch (error: any) {
      setIsLoading(false);
      toast({ title: 'Signup Fail', description: error.message, variant: 'destructive' });
    }
  };

  const handleSendEmailOTP = async (values: EmailOTPFormValues) => {
    setIsLoading(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      await sendOtpEmail({ email: values.email, otpCode: otp });
      setCurrentOtpStep('code');
      toast({ title: 'OTP DISPATCHED! 📧', description: `Check dispatch terminal.` });
    } catch (error: any) {
      toast({ title: 'Error', description: 'OTP bhejne mein dikat aayi.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (values: EmailOTPFormValues) => {
    if (values.otpCode !== generatedOtp) {
        toast({ title: 'Wrong OTP ❌', description: 'Kripya sahi code bharein.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const newUser = userCredential.user;
      const userDocRef = doc(firestore, "users", newUser.uid);
      setDocumentNonBlocking(userDocRef, {
          id: newUser.uid,
          fullName: 'Sahi Traveler',
          email: values.email,
          role: 'traveler',
          walletBalance: 0,
          createdAt: new Date().toISOString(),
      }, { merge: true });
      toast({ title: 'LOGIN SUCCESS! ✅' });
    } catch (error: any) {
      setIsLoading(false);
      toast({ title: 'Verification Failed', variant: 'destructive' });
    }
  };

  if (isUserLoading) return <div className="flex items-center justify-center min-h-screen bg-white"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-slate-50 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-2">
          <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black italic tracking-tighter uppercase">BR TRIP</CardTitle>
          <CardDescription className="text-muted-foreground font-black uppercase text-[10px] mt-1 italic tracking-[0.2em]">Sahi Nivesh • Sahi Safar</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="otp" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 rounded-2xl mb-8">
              <TabsTrigger value="signin" className="rounded-xl font-black uppercase text-[10px]">Email</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl font-black uppercase text-[10px]">Join</TabsTrigger>
              <TabsTrigger value="otp" className="rounded-xl font-black uppercase text-[10px]">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="otp">
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(currentOtpStep === 'email' ? handleSendEmailOTP : handleVerifyEmailOTP)} className="space-y-6">
                  {currentOtpStep === 'email' ? (
                    <FormField control={otpForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Login via OTP (Email)</FormLabel>
                        <FormControl>
                          <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                              <Input placeholder="name@email.com" {...field} className="h-14 pl-12 rounded-2xl font-black italic text-lg shadow-inner" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : (
                    <FormField control={otpForm.control} name="otpCode" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground text-center block">Enter 6-Digit Code</FormLabel>
                        <FormControl>
                          <Input placeholder="XXXXXX" {...field} className="h-16 rounded-2xl font-black text-center text-3xl tracking-[0.5em] italic bg-slate-50 shadow-inner" maxLength={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl rounded-2xl uppercase bg-primary hover:bg-primary/90">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : currentOtpStep === 'email' ? 'SEND OTP TO EMAIL' : 'VERIFY & LOGIN'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} className="h-14 rounded-2xl font-medium shadow-inner" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl font-medium shadow-inner" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl rounded-2xl uppercase bg-primary hover:bg-primary/90">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <LogIn className="mr-2 h-6 w-6" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField control={signUpForm.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} className="h-12 rounded-2xl shadow-inner"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} className="h-12 rounded-2xl shadow-inner"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-12 rounded-2xl shadow-inner"><SelectValue placeholder="Select Role" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="traveler"><span className="flex items-center gap-2"><User className="h-4 w-4" /> Traveler</span></SelectItem>
                          <SelectItem value="staff"><span className="flex items-center gap-2"><Bike className="h-4 w-4" /> Captain</span></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl shadow-inner"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={signUpForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl shadow-inner"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl rounded-2xl uppercase mt-4 bg-primary hover:bg-primary/90">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <UserPlus className="mr-2 h-6 w-6" />}
                    Register Now
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
