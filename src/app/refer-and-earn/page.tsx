
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HandCoins, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReferAndEarnPage() {
  const referralCode = "REF123XYZ";
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  }

  return (
     <div className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <HandCoins className="h-10 w-10" />
                </div>
                <CardTitle className="mt-4">Refer & Earn</CardTitle>
                <CardDescription>Share your referral code with friends and earn rewards when they book a trip!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Your unique referral code:</p>
                <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4">
                    <p className="text-2xl font-bold tracking-widest">{referralCode}</p>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-5 w-5" />
                    </Button>
                </div>
                <Button className="w-full">Share with Friends</Button>
            </CardContent>
        </Card>
    </div>
  );
}
