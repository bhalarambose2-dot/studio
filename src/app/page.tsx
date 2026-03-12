
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
import { LogIn, UserPlus, Loader2, Navigation, Phone, Sparkles, User, Bike, ShieldCheck } from 'lucide-react';
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
import Image from 'next/image';
import images from './lib/placeholder-images.json';

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

const otpSchema = z.object({
  emailOrPhone: z.string().min(5, 'Email ya Phone Number bharein.'),
  otpCode: z.string().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOtpStep, setCurrentOtpStep] = useState<'input' | 'code'>('input');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [stars, setStars] = useState<{ left: string; top: string; delay: string; size: string }[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { auth, firestore, user, isUserLoading } = useFirebase();

  useEffect(() => {
    const newStars = Array.from({ length: 80 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1}s`,
      size: `${Math.random() * 2 + 1}px`,
    }));
    setStars(newStars);
  }, []);

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

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { emailOrPhone: '', otpCode: '' },
  });

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const userDocRef = doc(firestore, "users", userCredential.user.uid);
      setDocumentNonBlocking(userDocRef, { 
        lastLogin: new Date().toISOString() 
      }, { merge: true });
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
        lastLogin: new Date().toISOString(),
      }, { merge: true });
      toast({ title: 'Welcome!', description: `HALORA mein aapka swagat hai.` });
    } catch (error: any) {
      setIsLoading(false);
      toast({ title: 'Signup Fail', description: error.message, variant: 'destructive' });
    }
  };

  const handleSendOTP = async (values: OTPFormValues) => {
    setIsLoading(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      alert("Your OTP is: " + otp);
      if (values.emailOrPhone.includes('@')) {
        await sendOtpEmail({ email: values.emailOrPhone, otpCode: otp });
      }
      setCurrentOtpStep('code');
      toast({ title: 'OTP DISPATCHED! 📲', description: `Sahi code screen par ya terminal mein dekhein.` });
    } catch (error: any) {
      toast({ title: 'Error', description: 'OTP bhejne mein dikat aayi.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (values: OTPFormValues) => {
    if (values.otpCode !== generatedOtp) {
        toast({ title: 'Wrong OTP ❌', description: 'Kripya sahi code bharein.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const newUser = userCredential.user;
      const userDocRef = doc(firestore, "users", newUser.uid);
      const isEmail = values.emailOrPhone.includes('@');
      setDocumentNonBlocking(userDocRef, {
          id: newUser.uid,
          fullName: 'Sahi Traveler',
          email: isEmail ? values.emailOrPhone : '',
          phone: !isEmail ? values.emailOrPhone : '',
          role: 'traveler',
          walletBalance: 0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
      }, { merge: true });
      toast({ title: 'LOGIN SUCCESSFUL! ✅', description: 'HALORA mein aapka swagat hai.' });
    } catch (error: any) {
      setIsLoading(false);
      toast({ title: 'Verification Failed', variant: 'destructive' });
    }
  };

  if (isUserLoading) return <div className="flex items-center justify-center min-h-screen bg-[#0d1b2a]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#0d1b2a] p-4 overflow-hidden">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle pointer-events-none opacity-40"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: '1.5s',
          }}
        />
      ))}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border-none relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="text-center pt-10 pb-2">
          <div className="mx-auto mb-4 group hover:scale-110 transition-transform cursor-pointer">
            <Image 
              src={images.haloraLogo} 
              alt="HALORA Logo" 
              width={100} 
              height={100} 
              className="rounded-3xl shadow-lg border-4 border-white"
            />
          </div>
          <CardTitle className="text-4xl font-black italic tracking-tighter uppercase text-primary flex items-center justify-center gap-2">
            HALORA
            <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground font-black uppercase text-[10px] mt-1 italic tracking-[0.2em]">Sahi Nivesh • Sahi Safar</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 rounded-2xl mb-8">
              <TabsTrigger value="signin" className="rounded-xl font-black uppercase text-[10px]">Sign in</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl font-black uppercase text-[10px]">Sign up</TabsTrigger>
              <TabsTrigger value="otp" className="rounded-xl font-black uppercase text-[10px]">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="animate-in fade-in slide-in-from-left-2 duration-200">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} className="h-14 rounded-2xl font-medium shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl font-medium shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl rounded-2xl uppercase bg-primary hover:bg-primary/90 active:scale-95 transition-all">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <LogIn className="mr-2 h-6 w-6" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup" className="animate-in fade-in slide-in-from-right-2 duration-200">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField control={signUpForm.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Full Name</FormLabel>
                      <FormControl><Input placeholder="Jaise: Rajesh Kumar" {...field} className="h-12 rounded-2xl shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} className="h-12 rounded-2xl shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-12 rounded-2xl shadow-inner border-none bg-slate-50 focus:ring-primary/20"><SelectValue placeholder="Select Role" /></SelectTrigger></FormControl>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="traveler" className="rounded-xl"><span className="flex items-center gap-2"><User className="h-4 w-4" /> Traveler</span></SelectItem>
                          <SelectItem value="staff" className="rounded-xl"><span className="flex items-center gap-2"><Bike className="h-4 w-4" /> Captain</span></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={signUpForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-2xl shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl rounded-2xl uppercase mt-4 bg-primary hover:bg-primary/90 active:scale-95 transition-all">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <UserPlus className="mr-2 h-6 w-6" />}
                    Register Now
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="otp" className="animate-in fade-in zoom-in-95 duration-200">
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(currentOtpStep === 'input' ? handleSendOTP : handleVerifyOTP)} className="space-y-6">
                  {currentOtpStep === 'input' ? (
                    <FormField control={otpForm.control} name="emailOrPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground ml-1">Email / Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                              <Input placeholder="E.g. 9876543210 or email" {...field} className="h-14 pl-12 rounded-2xl font-black italic text-lg shadow-inner border-none bg-slate-50 focus-visible:ring-primary/20" />
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
                          <Input placeholder="XXXXXX" {...field} className="h-16 rounded-2xl font-black text-center text-3xl tracking-[0.5em] italic bg-slate-50 shadow-inner border-none focus-visible:ring-primary/20" maxLength={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <Button type="submit" disabled={isLoading} className="w-full h-16 text-lg font-black italic shadow-xl rounded-2xl uppercase bg-primary hover:bg-primary/90 active:scale-95 transition-all">
                    {isLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : currentOtpStep === 'input' ? 'SEND OTP' : 'VERIFY & LOGIN'}
                  </Button>
                  {currentOtpStep === 'code' && (
                    <Button variant="ghost" className="w-full font-bold text-xs uppercase opacity-60 hover:bg-transparent" onClick={() => setCurrentOtpStep('input')}>Back to Change Number</Button>
                  )}
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 text-white/20 text-[10px] font-black uppercase tracking-widest z-0 pointer-events-none">
        HALORA v1.0.0-PROD • PROJECT PUBLIC
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
        .animate-twinkle {
          animation: twinkle 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
