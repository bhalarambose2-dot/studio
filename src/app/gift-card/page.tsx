
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";

export default function GiftCardPage() {
  return (
    <div className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift />Gift Cards</CardTitle>
                <CardDescription>Purchase or redeem a gift card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="redeem-code">Redeem a Gift Card</Label>
                    <div className="flex gap-2">
                        <Input id="redeem-code" placeholder="Enter gift card code" />
                        <Button>Redeem</Button>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold">Purchase a Gift Card</h3>
                    <div className="space-y-2">
                         <Label htmlFor="amount">Amount</Label>
                         <Input id="amount" type="number" placeholder="Enter amount" />
                    </div>
                     <div className="space-y-2">
                         <Label htmlFor="recipient-email">Recipient's Email</Label>
                         <Input id="recipient-email" type="email" placeholder="recipient@example.com" />
                    </div>
                    <Button className="w-full">Purchase Now</Button>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
