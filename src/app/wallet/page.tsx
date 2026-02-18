
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, IndianRupee, Plus, CreditCard, Loader2, Trash2, Smartphone, Copy, CheckCircle2, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function WalletPage() {
  const { user } = useUser();
  const { userProfile, updateUserProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const [addAmount, setAddAmount] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', type: 'Visa' });
  const { toast } = useToast();

  const balance = userProfile?.walletBalance || 0;
  const savedCards = userProfile?.savedCards || [];
  const upiId = "8769930595-2@ybl";

  // Generate UPI URL for QR Code
  const getUpiUrl = () => {
    const amount = addAmount || '0';
    const name = "BR Trip";
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  };

  const handleShowQR = () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Amount Enter Karein',
        description: 'Kripya payment ke liye sahi raashi bharein.',
        variant: 'destructive'
      });
      return;
    }
    setShowQR(true);
  };

  const handleVerifyPayment = () => {
    setIsProcessingPayment(true);
    setShowQR(false);
    
    toast({
      title: 'Verifying Payment',
      description: 'Bank servers se confirmation ka intezar hai...',
    });

    // SIMULATION: After user scans and pays, they click verify.
    // We wait 5 seconds and update the balance.
    setTimeout(async () => {
      const amountToAdd = parseFloat(addAmount);
      const currentBalance = userProfile?.walletBalance || 0;
      await updateUserProfile({ walletBalance: currentBalance + amountToAdd });
      
      setIsProcessingPayment(false);
      setAddAmount('');
      
      toast({
        title: 'Payment Success!',
        description: `₹${amountToAdd} aapke wallet mein add kar diye gaye hain.`,
      });
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
            <p className="text-muted-foreground">Apne funds aur payment methods manage karein.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col h-full border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden">
                {isProcessingPayment && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-black/95 z-20 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <h3 className="text-xl font-bold">Verifying Payment...</h3>
                        <p className="text-sm text-muted-foreground mt-2">Hum bank se aapki transaction verify kar rahe hain. Kripya back na karein.</p>
                    </div>
                )}
                
                {showQR && (
                    <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 space-y-4">
                        <h3 className="text-lg font-bold">Scan to Pay ₹{addAmount}</h3>
                        <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-inner">
                            <Image 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUpiUrl())}`}
                                alt="Payment QR Code"
                                width={200}
                                height={200}
                                className="mx-auto"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Apne kisi bhi UPI App (GPay, PhonePe, Paytm) se scan karein aur payment ke baad 'Verify' button dabayein.</p>
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1" onClick={() => setShowQR(false)}>Cancel</Button>
                            <Button className="flex-1" onClick={handleVerifyPayment}>Verify Payment</Button>
                        </div>
                    </div>
                )}

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><Wallet /> Wallet Balance</CardTitle>
                    <CardDescription>Aapka current balance jo trips ke liye use ho sakta hai.</CardDescription>
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
                            <Label htmlFor="amount">Raashi (Amount)</Label>
                            <Input 
                                id="amount" 
                                type="number" 
                                placeholder="Kitne paise add karne hain? (e.g. 500)" 
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                className="h-12 text-lg"
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button onClick={handleShowQR} variant="default" className="w-full h-12 shadow-lg shadow-primary/20" disabled={!addAmount || isProcessingPayment}>
                                <QrCode className="mr-2 h-5 w-5" />
                                Generate Payment QR
                            </Button>
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={copyUPI} disabled={isProcessingPayment}>
                                <Copy className="mr-1 h-3 w-3" /> UPI ID: {upiId}
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary" /> Saved Cards</CardTitle>
                        <CardDescription>Aapke saved cards.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Card</DialogTitle>
                                <DialogDescription>Card details bharein.</DialogDescription>
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
                                        <Label>Type</Label>
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
                            <p>Koi card saved nahi hai.</p>
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
        
        <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-accent">Payment Note</p>
                    <p className="text-muted-foreground">Yeh QR code real hai. Scan karne par aapke bank se paise kat sakte hain. Verify button dabane par wallet balance simulation ke taur par 5 second mein update ho jayega.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
