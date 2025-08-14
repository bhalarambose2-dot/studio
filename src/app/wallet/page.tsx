
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, IndianRupee } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet /> My Wallet</CardTitle>
                <CardDescription>View your balance and manage payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-6 rounded-lg bg-primary/10 text-center">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-4xl font-bold flex items-center justify-center gap-2">
                        <IndianRupee className="h-8 w-8" />
                        <span>500.00</span>
                    </p>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold">Add Money</h3>
                    <div className="space-y-2">
                         <Label htmlFor="amount">Amount</Label>
                         <Input id="amount" type="number" placeholder="Enter amount to add" />
                    </div>
                    <Button className="w-full">Add to Wallet</Button>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
