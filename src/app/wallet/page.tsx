'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, IndianRupee, CreditCard, Loader2, QrCode, ShieldAlert, CheckCircle2, AlertCircle, BadgeCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function WalletPage() {
  const { user } = useUser();
  const { userProfile, updateUserProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const [addAmount, setAddAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', type: 'Visa' });
  const { toast } = useToast();

  const balance = userProfile?.walletBalance || 0;
  const savedCards = userProfile?.savedCards || [];
  const upiId = "8769930595-2@ybl";

  const getUpiUrl = () => {
    const amount = addAmount || '0';
    return `upi://pay?pa=${upiId}&pn=BR%20Trip&am=${amount}&cu=INR`;
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
    // UPI Reference Number (UTR) is always 12 digits in India
    const utrRegex = /^\d{12}$/;
    
    if (!utrRegex.test(txnId)) {
        toast({
            title: 'Invalid Reference Number',
            description: 'Kripya apna 12-digit ka UPI Transaction ID (UTR) bharein jo aapke payment app mein dikh raha hai.',
            variant: 'destructive'
        });
        return;
    }

    setIsProcessingPayment(true);
    setShowQR(false);
    
    toast({
      title: 'Verifying with Bank',
      description: 'Aapka transaction status bank se confirm kiya ja raha hai...',
    });

    // Simulate bank confirmation delay
    setTimeout(async () => {
      const amountToAdd = parseFloat(addAmount);
      const currentBalance = userProfile?.walletBalance || 0;
      await updateUserProfile({ walletBalance: currentBalance + amountToAdd });
      
      setIsProcessingPayment(false);
      setAddAmount('');
      setTxnId('');
      
      toast({
        title: 'Payment Successful!',
        description: `₹${amountToAdd} aapke wallet mein safaltapoorvak add kar diye gaye hain.`,
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
            <Card className="flex flex-col h-full border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden min-h-[500px]">
                {isProcessingPayment && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-black/95 z-20 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <h3 className="text-xl font-bold">Verifying Status...</h3>
                        <p className="text-sm text-muted-foreground mt-2">Ref ID: <span className="font-mono text-primary">{txnId}</span></p>
                        <p className="text-xs text-muted-foreground mt-4 italic">Kripya Page Refresh Na Karein. Hum bank se confirmation le rahe hain.</p>
                    </div>
                )}
                
                {showQR && (
                    <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 space-y-4 overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-lg font-bold">Scan to Pay ₹{addAmount}</h3>
                            <BadgeCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-inner">
                            <Image 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUpiUrl())}`}
                                alt="Payment QR Code"
                                width={200}
                                height={200}
                                className="mx-auto"
                            />
                        </div>
                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="txn-id" className="text-xs font-bold text-primary">UPI Reference Number (12 Digits)</Label>
                                {txnId.length > 0 && txnId.length !== 12 && (
                                    <span className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Need 12 digits</span>
                                )}
                            </div>
                            <Input 
                                id="txn-id" 
                                type="text"
                                inputMode="numeric"
                                placeholder="E.g. 401234567890" 
                                value={txnId}
                                maxLength={12}
                                onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                                className={`border-primary/40 focus:ring-primary h-11 text-center font-mono tracking-widest ${txnId.length === 12 ? 'border-green-500' : ''}`}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">Apne GPay/PhonePe/Paytm app mein Transaction History se 12-digit ka UTR number yahan bharein.</p>
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1" onClick={() => { setShowQR(false); setTxnId(''); }}>Back</Button>
                            <Button className="flex-1" onClick={handleVerifyPayment} disabled={txnId.length !== 12}>Confirm Payment</Button>
                        </div>
                    </div>
                )}

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary"><Wallet /> Wallet Balance</CardTitle>
                    <CardDescription>Aapka current balance jo trips ke liye use ho sakta hai.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center py-6">
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
                                placeholder="E.g. 500" 
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                className="h-12 text-lg"
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <Button onClick={handleShowQR} variant="default" className="w-full h-12 shadow-lg shadow-primary/20" disabled={!addAmount || isProcessingPayment}>
                            <QrCode className="mr-2 h-5 w-5" />
                            Scan & Pay Now
                        </Button>
                        <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={copyUPI}>
                             UPI ID: {upiId}
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <div className="space-y-6">
                <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4 flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <p className="font-bold text-blue-700 uppercase">Verification Rules</p>
                            <p className="text-blue-600 mt-1">Payment confirm karne ke liye aapko sahi **12-digit numeric Reference ID** daalna hoga. Simulation ke liye aap koi bhi 12-digit number (jaise 123456789012) use kar sakte hain.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="text-primary" /> Saved Cards</CardTitle>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm"><Wallet className="h-4 w-4 mr-1" /> Add New</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Card</DialogTitle>
                                    <DialogDescription>Card details bharein (Testing purpose only).</DialogDescription>
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
                                            <Input placeholder="12/26" value={newCard.expiry} onChange={(e) => setNewCard({...newCard, expiry: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Input placeholder="Visa" value={newCard.type} onChange={(e) => setNewCard({...newCard, type: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full" onClick={handleAddCard} disabled={isAddingCard}>Save Card</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                         {savedCards.length === 0 ? (
                            <p className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">Koi card saved nahi hai.</p>
                        ) : (
                            <div className="space-y-3">
                                {savedCards.map((card, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-sm">{card.cardNumber}</p>
                                                <p className="text-xs text-muted-foreground">{card.cardType}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
        
        <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-accent">Safe & Secure Payments</p>
                    <p className="text-muted-foreground italic">BR Trip aapke payments ko monitor karta hai. Galat Transaction ID bharna kanoonan jurm ho sakta hai.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
