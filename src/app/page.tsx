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
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
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

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/search');
    }
  }, [user, isUserLoading, router]);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSignIn = (values: SignInFormValues) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        toast({
          title: 'Signed In Successfully',
          description: `Welcome back!`,
        });
      })
      .catch((error: any) => {
        setIsLoading(false);
        toast({
          title: 'Sign In Failed',
          description: error.message || 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      });
  };

  const handleSignUp = (values: SignUpFormValues) => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        // Split full name for backend entity compliance
        const names = values.fullName.split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';

        // Create a user profile in Firestore (Non-Blocking)
        const userDocRef = doc(firestore, "users", user.uid);
        setDocumentNonBlocking(userDocRef, {
          id: user.uid,
          firstName,
          lastName,
          email: values.email,
          preferredCurrency: 'INR',
          languagePreference: 'hi',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        toast({
          title: 'Account Created',
          description: 'Your account has been created successfully.',
        });
      })
      .catch((error: any) => {
        setIsLoading(false);
        toast({
          title: 'Sign Up Failed',
          description: error.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">
       <Image
          src="https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=2062&auto=format&fit=crop"
          alt="Starry night sky"
          data-ai-hint="starry night"
          fill
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />
      <Card className="w-full max-w-md bg-transparent border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle>Welcome to BR Trip</CardTitle>
          <CardDescription className="text-white/80">Sign in or create an account to plan your next adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white/70">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="pt-6">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50" />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <LogIn className="mr-2" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup" className="pt-6">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-6">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50"/>
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50"/>
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
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <UserPlus className="mr-2" />}
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
