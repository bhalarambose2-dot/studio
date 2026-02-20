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
import { LogIn, UserPlus, Loader2, Briefcase, Mail, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
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
  email: z.string().email('Sahi email address bharein.'),
  password: z.string().min(1, 'Password zaroori hai.'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Pura naam likhein.'),
  email: z.string().email('Sahi email address bharein.'),
  role: z.enum(['traveler', 'admin', 'staff', 'bus_owner']),
  password: z.string().min(8, 'Password kam se kam 8 characters ka ho.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords match nahi kar rahe.",
  path: ['confirmPassword'],
});

const emailOtpSchema = z.object({
  email: z.string().email('Kripya ek valid email address bharein.'),
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

  const otpForm = useForm<EmailOTPFormValues>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: { email: '', otpCode: '' },
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

  const handleSendEmailOTP = async (values: EmailOTPFormValues) => {
    setIsLoading(true);
    try {
      // 1. Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 2. Set state immediately
      setGeneratedOtp(otp);
      
      // 3. Log to Browser Console for easy access
      console.log(`\n====================================================`);
      console.log(`BR TRIP OTP: ${otp}`);
      console.log(`====================================================\n`);
      
      // 4. Call server flow for Terminal logging
      await sendOtpEmail({
        email: values.email,
        otpCode: otp,
      });
      
      setCurrentOtpStep('code');
      toast({
        title: 'OTP DISPATCHED! 📧',
        description: `Kripya Terminal ya Browser Console check karein.`,
      });
    } catch (error: any) {
      console.error("OTP Dispatch Error:", error);
      toast({
        title: 'OTP Error',
        description: 'OTP bhejne mein dikat aayi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (values: EmailOTPFormValues) => {
    const inputOtp = values.otpCode || '';
    
    if (inputOtp.length !== 6) {
        toast({
            title: 'Code Adhura Hai',
            description: 'Kripya 6-digit code bharein.',
            variant: 'destructive'
        });
        return;
    }

    // Strict state-based comparison
    if (inputOtp !== generatedOtp) {
        toast({
            title: 'Galat OTP ❌',
            description: 'Kripya sahi 6-digit code bharein.',
            variant: 'destructive'
        });
        return;
    }

    setIsLoading(true);
    try {
      // Sign in anonymously for prototype access
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        setDocumentNonBlocking(userDocRef, {
          id: user.uid,
          fullName: 'Sahi Traveler',
          email: values.email,
          role: 'traveler',
          walletBalance: 0,
          kycStatus: 'none',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      toast({
        title: 'LOGIN SUCCESS! ✅',
        description: 'Sahi Safar mein swagat hai.',
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Verification Failed',
        description: 'Login nahi ho saka.',
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
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
        
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-white shadow-2xl relative z-10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pb-2 pt-10">
          <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black italic tracking-tighter text-foreground uppercase">BR TRIP</CardTitle>
          <CardDescription className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mt-1 italic">Sahi Nivesh • Sahi Safar</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 rounded-2xl mb-8">
              <TabsTrigger value="signin" className="rounded-xl font-black uppercase text-[10px]">Email</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl font-black uppercase text-[10px]">Join</TabsTrigger>
              <TabsTrigger value="otp" className="rounded-xl font-black uppercase text-[10px]">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="h-14 rounded-2xl font-medium" />
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl shadow-primary/20 rounded-2xl uppercase">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <LogIn className="mr-2 h-6 w-6" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-12 rounded-2xl font-medium"/>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="h-12 rounded-2xl font-medium"/>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-2xl font-medium">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="traveler">Traveler</SelectItem>
                            <SelectItem value="bus_owner">Bus Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl font-medium"/>
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl font-medium"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl shadow-primary/20 rounded-2xl uppercase mt-4">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <UserPlus className="mr-2 h-6 w-6" />}
                    Sign Up
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="otp">
              <Form {...otpForm}>
                <form 
                  onSubmit={otpForm.handleSubmit(currentOtpStep === 'email' ? handleSendEmailOTP : handleVerifyEmailOTP)} 
                  className="space-y-6"
                >
                  {currentOtpStep === 'email' ? (
                    <FormField
                      control={otpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email for OTP</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                                <Input 
                                  placeholder="name@gmail.com" 
                                  {...field} 
                                  className="h-14 pl-12 rounded-2xl font-black italic text-lg" 
                                />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={otpForm.control}
                      name="otpCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black text-muted-foreground text-center block">Enter 6-Digit Code</FormLabel>
                          <FormControl>
                            <Input 
                                placeholder="XXXXXX" 
                                {...field} 
                                className="h-16 rounded-2xl font-black text-center text-3xl tracking-[0.5em] italic" 
                                maxLength={6}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-[9px] text-center text-muted-foreground font-bold uppercase mt-2">Code Terminal ya Console mein dekhein.</p>
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl shadow-primary/20 rounded-2xl uppercase">
                    {isLoading ? (
                      <Loader2 className="mr-2 animate-spin h-6 w-6" />
                    ) : currentOtpStep === 'email' ? (
                      <><Mail className="mr-2 h-6 w-6" /> Send OTP</>
                    ) : (
                      <><ShieldCheck className="mr-2 h-6 w-6" /> Verify Code</>
                    )}
                  </Button>

                  {currentOtpStep === 'code' && (
                    <Button 
                        variant="ghost" 
                        type="button"
                        className="w-full text-[10px] font-black uppercase text-primary"
                        onClick={() => setCurrentOtpStep('email')}
                    >
                        <ArrowLeft className="h-3 w-3 mr-2" /> Change Email
                    </Button>
                  )}
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
