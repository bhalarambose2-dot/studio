
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, IndianRupee, Plus, CreditCard, Loader2, Trash2, Smartphone, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export default function WalletPage() {
  const { user } = useUser();
  const { userProfile, updateUserProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const [addAmount, setAddAmount] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', type: 'Visa' });
  const { toast } = useToast();

  const balance = userProfile?.walletBalance || 0;
  const savedCards = userProfile?.savedCards || [];
  const upiId = "8769930595-2@ybl";

  const handleUPIPayment = () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount for UPI payment.',
        variant: 'destructive'
      });
      return;
    }

    // This deep link will attempt to open UPI apps on a mobile device
    const name = "BR Trip";
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    window.location.href = upiLink;
    
    toast({
      title: 'UPI Payment Initiated',
      description: 'Opening your UPI app... (Simulating Success in 5s)',
    });

    // SIMULATION: In a prototype, we manually update the balance since we don't have a real payment gateway callback.
    setTimeout(async () => {
      const currentBalance = userProfile?.walletBalance || 0;
      await updateUserProfile({ walletBalance: currentBalance + amount });
      toast({
        title: 'Payment Confirmed',
        description: `₹${amount} has been added to your wallet.`,
      });
      setAddAmount('');
    }, 5000);
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId);
    toast({ title: "Copied!", description: "UPI ID copied to clipboard." });
  }

  const handleAddCard = async () => {
    if (newCard.number.length < 16) {
        toast({ title: "Invalid Card", description: "Please enter a valid card number.", variant: "destructive" });
        return;
    }

    setIsAddingCard(true);
    const updatedCards = [...savedCards, { cardNumber: `**** **** **** ${newCard.number.slice(-4)}`, expiryDate: newCard.expiry, cardType: newCard.type }];
    
    await updateUserProfile({ savedCards: updatedCards });
    
    setNewCard({ number: '', expiry: '', type: 'Visa' });
    setIsAddingCard(false);
    toast({ title: "Card Added", description: "Your payment method has been saved." });
  };

  const removeCard = async (index: number) => {
    const updatedCards = savedCards.filter((_, i) => i !== index);
    await updateUserProfile({ savedCards: updatedCards });
    toast({ title: "Card Removed", description: "Payment method deleted." });
  };

  if (isProfileLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-20">
        <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Payments & Wallet</h1>
            <p className="text-muted-foreground">Manage your funds and saved payment methods.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col h-full border-primary/20 bg-primary/5 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><Wallet /> My Balance</CardTitle>
                    <CardDescription>Available funds for your next booking.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center py-10">
                    <div className="text-center">
                        <p className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
                            <IndianRupee className="h-10 w-10" />
                            <span>{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount to Add</Label>
                            <Input 
                                id="amount" 
                                type="number" 
                                placeholder="Enter amount (e.g. 1000)" 
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                className="h-12 text-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button onClick={handleUPIPayment} variant="default" className="w-full h-12 shadow-lg shadow-primary/20" disabled={!addAmount}>
                                <Smartphone className="mr-2 h-5 w-5" /> Pay via UPI (Mobile)
                            </Button>
                            <Button variant="outline" className="w-full h-12 border-dashed" onClick={copyUPI}>
                                <Copy className="mr-2 h-4 w-4" /> Copy UPI ID: {upiId}
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary" /> Saved Cards</CardTitle>
                        <CardDescription>Your saved payment methods.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add Card</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Payment System</DialogTitle>
                                <DialogDescription>Enter your card details to save for future use.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <Input 
                                        placeholder="0000 0000 0000 0000" 
                                        maxLength={16}
                                        value={newCard.number}
                                        onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiry (MM/YY)</Label>
                                        <Input 
                                            placeholder="12/26" 
                                            value={newCard.expiry}
                                            onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Card Type</Label>
                                        <Input 
                                            placeholder="Visa / Mastercard" 
                                            value={newCard.type}
                                            onChange={(e) => setNewCard({...newCard, type: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full" onClick={handleAddCard} disabled={isAddingCard}>
                                    {isAddingCard ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Save Card'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    {savedCards.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                            <CreditCard className="mx-auto h-10 w-10 opacity-20 mb-2" />
                            <p>No saved cards yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedCards.map((card, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{card.cardNumber}</p>
                                            <p className="text-xs text-muted-foreground">{card.cardType} • Exp {card.expiryDate}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeCard(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
