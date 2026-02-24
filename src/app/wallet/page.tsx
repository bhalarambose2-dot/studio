'use client';

import { useState } from 'react';
import { useUser, useFirebase, useMemoFirebase, useCollection } from '@/firebase';
import { useUserProfile } from '@/lib/firebase/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, IndianRupee, CreditCard, Loader2, QrCode, ShieldAlert, CheckCircle2, AlertCircle, BadgeCheck, History, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

export default function WalletPage() {
  const { user, firestore } = useFirebase();
  const { userProfile, updateUserProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const [addAmount, setAddAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const balance = userProfile?.walletBalance || 0;
  const upiId = "8769930595-2@ybl";

  // Fetch recent transactions
  const transactionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'transactions'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
  }, [firestore, user]);

  const { data: transactions, isLoading: isTxnLoading } = useCollection(transactionsQuery);

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

    setTimeout(async () => {
      const amountToAdd = parseFloat(addAmount);
      const currentBalance = userProfile?.walletBalance || 0;
      
      try {
        // 1. Update Profile Balance
        await updateUserProfile({ walletBalance: currentBalance + amountToAdd });
        
        // 2. Save Transaction Detail (Record keeping)
        if (user) {
          await addDoc(collection(firestore, 'users', user.uid, 'transactions'), {
            type: 'credit',
            amount: amountToAdd,
            reference: txnId,
            description: 'Wallet Top-up via UPI',
            timestamp: serverTimestamp(),
            status: 'completed'
          });
        }
        
        setIsProcessingPayment(false);
        setAddAmount('');
        setTxnId('');
        
        toast({
          title: 'Payment Successful!',
          description: `₹${amountToAdd} aapke wallet mein safaltapoorvak add aur save kar diye gaye hain.`,
        });
      } catch (e) {
        setIsProcessingPayment(false);
        toast({
          title: 'Error Saving Transaction',
          description: 'Payment verify ho gaya par detail save nahi ho saki. Please contact support.',
          variant: 'destructive'
        });
      }
    }, 4000);
  };

  if (isProfileLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-8 pb-24">
        <header className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tighter italic text-primary">PAISA & WALLET</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Secure Transaction Hub</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Section */}
            <Card className="lg:col-span-2 flex flex-col h-full border-primary/20 bg-white shadow-xl relative overflow-hidden min-h-[500px]">
                {isProcessingPayment && (
                    <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                        <h3 className="text-2xl font-black italic">VERIFYING STATUS...</h3>
                        <p className="text-sm text-muted-foreground mt-2">Ref ID: <span className="font-mono text-primary font-bold">{txnId}</span></p>
                        <p className="text-xs text-muted-foreground mt-6 max-w-xs uppercase font-bold opacity-60">Kripya Page Refresh Na Karein. Hum bank se confirmation le rahe hain.</p>
                    </div>
                )}
                
                {showQR && (
                    <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 space-y-6">
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-2xl font-black italic">SCAN & PAY ₹{addAmount}</h3>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 border-none font-black text-[10px] px-3">
                                <BadgeCheck className="h-3 w-3" /> SECURE GATEWAY
                            </Badge>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border-4 border-primary shadow-2xl">
                            <Image 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getUpiUrl())}`}
                                alt="Payment QR Code"
                                width={220}
                                height={220}
                                className="mx-auto"
                            />
                        </div>
                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="txn-id" className="text-[10px] font-black uppercase text-primary">UPI Ref Number (UTR - 12 Digits)</Label>
                                {txnId.length > 0 && txnId.length !== 12 && (
                                    <span className="text-[10px] text-destructive font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Invalid ID</span>
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
                                className={`border-primary/40 focus:ring-primary h-14 text-center font-mono text-xl font-black tracking-[0.3em] ${txnId.length === 12 ? 'border-green-500 bg-green-50' : ''}`}
                            />
                            <p className="text-[9px] text-muted-foreground text-center font-medium italic">Payment app mein 'Transaction History' se UTR number dekhein.</p>
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => { setShowQR(false); setTxnId(''); }}>BACK</Button>
                            <Button className="flex-1 h-12 font-bold shadow-lg shadow-primary/20" onClick={handleVerifyPayment} disabled={txnId.length !== 12}>CONFIRM PAYMENT</Button>
                        </div>
                    </div>
                )}

                <CardHeader className="bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-primary font-black italic"><Wallet className="h-6 w-6" /> TOTAL BALANCE</CardTitle>
                    <CardDescription className="font-medium text-xs">Current available funds for your trips.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center py-10">
                    <div className="text-center">
                        <p className="text-6xl font-black flex items-center justify-center gap-2 text-primary italic">
                            <IndianRupee className="h-12 w-12" />
                            <span>{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </p>
                        <Badge variant="outline" className="mt-4 border-primary/20 text-[10px] font-black tracking-widest uppercase">Verified Account</Badge>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-6 p-8 bg-muted/20 border-t">
                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="font-black text-[10px] uppercase text-muted-foreground ml-1">Kitna Paisa Add Karna Hai?</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="500" 
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    className="h-16 pl-12 text-2xl font-black border-primary/20"
                                    disabled={isProcessingPayment}
                                />
                            </div>
                        </div>
                        <Button onClick={handleShowQR} variant="default" className="w-full h-16 text-lg font-black italic shadow-2xl shadow-primary/20 rounded-2xl" disabled={!addAmount || isProcessingPayment}>
                            <QrCode className="mr-3 h-6 w-6" />
                            SCAN & PAY NOW
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* History Section */}
            <div className="space-y-6">
                <Card className="shadow-lg border-none">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg font-black italic flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" /> RECENT HISTORY
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {isTxnLoading ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
                        ) : transactions && transactions.length > 0 ? (
                            transactions.map((txn: any) => (
                                <div key={txn.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${txn.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {txn.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">{txn.description}</p>
                                            <p className="text-[9px] text-muted-foreground font-mono">Ref: {txn.reference}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-black ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount}
                                        </p>
                                        <p className="text-[8px] text-muted-foreground uppercase font-bold">
                                            {txn.timestamp?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-40">
                                <History className="h-10 w-10 mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase">No Transactions Yet</p>
                            </div>
                        )}
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">View Full Statement</Button>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-dashed border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-[10px] font-medium leading-relaxed">
                            <p className="font-black text-primary uppercase mb-1">DATA SAVING NOTICE</p>
                            <p className="text-muted-foreground italic">Har transaction details (UTR ID) platform par hamesha ke liye save hoti hai. Galat details bharne par wallet block kiya ja sakta hai.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
