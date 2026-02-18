
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const kycSchema = z.object({
  docType: z.string(),
  docNumber: z.string().min(1, 'Document number is required.'),
}).refine((data) => {
  if (data.docType === 'aadhar') {
    // Aadhar: 12 digits
    return /^\d{12}$/.test(data.docNumber);
  }
  if (data.docType === 'pan') {
    // PAN: 5 letters, 4 digits, 1 letter
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.docNumber.toUpperCase());
  }
  return data.docNumber.length >= 5;
}, {
  message: "Invalid format for the selected document type. (e.g. Aadhar: 12 digits, PAN: ABCDE1234F)",
  path: ['docNumber'],
});

type KYCFormValues = z.infer<typeof kycSchema>;

export default function KYCPage() {
  const { user } = useUser();
  const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<KYCFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      docType: 'aadhar',
      docNumber: '',
    },
  });

  const onSubmit = async (values: KYCFormValues) => {
    setIsSubmitting(true);
    
    // Simulate a brief delay for the submission process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (user) {
      await updateUserProfile({
        kycStatus: 'pending',
        kycDocumentType: values.docType
      });
    }
    
    setIsSubmitting(false);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Please sign in to complete KYC.</div>;
  }

  if (userProfile?.kycStatus === 'pending') {
    return (
      <div className="flex justify-center items-center flex-1 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-yellow-100 text-yellow-600 p-4 rounded-full w-fit mb-4">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <CardTitle>Verification in Progress</CardTitle>
            <CardDescription>
              We are currently reviewing your documents. This usually takes 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push('/profile')} className="w-full">
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProfile?.kycStatus === 'verified') {
    return (
      <div className="flex justify-center items-center flex-1 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 text-green-600 p-4 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <CardTitle>KYC Verified</CardTitle>
            <CardDescription>
              Your identity has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/profile')} className="w-full">
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-1 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Complete Your KYC</CardTitle>
          <CardDescription>
            Please provide your identification details to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="docType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="voter_id">Voter ID</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="docNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your ID number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Upload Document Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors border-primary/20 bg-primary/5">
                  <Upload className="h-8 w-8 text-primary/60" />
                  <span className="text-sm font-medium text-muted-foreground text-center">Click to upload front side</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG or PDF (max. 5MB)</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Verification'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
