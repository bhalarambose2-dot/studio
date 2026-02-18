
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

export default function KYCPage() {
  const { user } = useUser();
  const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docType, setDocType] = useState('aadhar');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate a brief delay for the submission process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await updateUserProfile({
      kycStatus: 'pending',
      kycDocumentType: docType
    });
    
    setIsSubmitting(false);
    // The success toast is already handled in updateUserProfile
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="doc-type">Document Type</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="voter_id">Voter ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doc-number">Document Number</Label>
              <Input id="doc-number" placeholder="Enter your ID number" required />
            </div>

            <div className="space-y-2">
              <Label>Upload Document Image</Label>
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors border-primary/20 bg-primary/5">
                <Upload className="h-8 w-8 text-primary/60" />
                <span className="text-sm font-medium text-muted-foreground text-center">Click to upload or drag and drop front side</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
