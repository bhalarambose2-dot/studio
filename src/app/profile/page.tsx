'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirebase } from "@/firebase";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { useEffect, useState } from "react";
import { Camera, ShieldCheck, BadgeCheck, Clock, Wallet, Briefcase, LogOut, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, auth } = useFirebase();
    const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.fullName || '');
        }
    }, [userProfile]);

    const handleUpdateProfile = async () => {
        if (user) {
            await updateUserProfile({ fullName: name });
        }
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            router.push('/');
        });
    };

    if (!user || !userProfile) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-24 w-24 bg-muted rounded-full"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
        );
    }

    const renderKycBadge = () => {
        if (userProfile.kycStatus === 'verified') {
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 border-green-200">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                </Badge>
            );
        } else if (userProfile.kycStatus === 'pending') {
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 flex items-center gap-1 border-yellow-200">
                    <Clock className="h-3 w-3" />
                    Pending
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-muted-foreground border-dashed bg-muted/30">
                KYC Not Verified
            </Badge>
        );
    };

    return (
        <div className="container mx-auto max-w-2xl space-y-8 pb-24">
            {/* Cover Section */}
            <div className="relative h-40 w-full bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl overflow-hidden shadow-inner">
                <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/travel/800/200')] bg-cover bg-center" />
                <div className="absolute top-4 right-4">
                  <Link href="/settings">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/50 backdrop-blur-md">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="px-4 -mt-20 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                    <Avatar className="h-36 w-36 border-[6px] border-background shadow-2xl">
                        <AvatarImage src={user.photoURL ?? `https://picsum.photos/seed/${user.uid}/200/200`} alt="User avatar" data-ai-hint="user avatar" />
                        <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                          {userProfile.fullName?.[0] || user.email?.[0] || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-2 right-2 bg-primary text-white p-2.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-background">
                        <Camera className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">{userProfile.fullName}</h1>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-muted-foreground text-sm font-medium">{user.email}</span>
                        <div className="flex gap-2">
                          {renderKycBadge()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 px-2">
                <Card className="border-none shadow-md bg-white dark:bg-card">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                        <div className="bg-primary/10 p-2 rounded-full mb-1">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Wallet Balance</p>
                        <p className="text-2xl font-black text-primary">₹{userProfile.walletBalance?.toLocaleString('en-IN') || 0}</p>
                    </CardContent>
                </Card>
                <Link href="/manage-bookings" className="block">
                    <Card className="border-none shadow-md bg-white dark:bg-card hover:bg-primary/5 transition-all cursor-pointer h-full border-b-4 border-b-primary/20">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                            <div className="bg-primary/10 p-2 rounded-full mb-1">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active Trips</p>
                            <p className="text-2xl font-black">Manage</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Profile Settings Form */}
            <Card className="border-none shadow-xl bg-white dark:bg-card overflow-hidden">
                <div className="bg-muted/30 px-6 py-3 border-b">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Account Information</h3>
                </div>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-5">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase text-muted-foreground">Display Name</Label>
                            <Input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="h-12 text-lg font-medium focus-visible:ring-primary border-primary/20"
                                placeholder="Aapka Naam"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2 opacity-60">
                            <Label htmlFor="email" className="text-xs font-black uppercase text-muted-foreground">Registered Email</Label>
                            <Input 
                                type="email" 
                                id="email" 
                                value={user.email ?? ''} 
                                disabled 
                                className="h-12 bg-muted/50 cursor-not-allowed font-medium"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button className="w-full h-12 shadow-lg shadow-primary/20 font-bold text-lg" onClick={handleUpdateProfile}>
                            Update My Profile
                        </Button>
                        
                        <Separator />
                        
                        <Link href="/kyc" className="block">
                            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-primary/10 hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${userProfile.kycStatus === 'verified' ? 'bg-green-100' : 'bg-primary/10'}`}>
                                      <ShieldCheck className={`h-6 w-6 ${userProfile.kycStatus === 'verified' ? 'text-green-600' : 'text-primary'}`} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold">Identity Verification (KYC)</p>
                                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                        {userProfile.kycStatus === 'verified' ? 'Verified Account' : 'Action Required'}
                                      </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`text-xs font-bold ${userProfile.kycStatus === 'verified' ? 'text-green-600' : 'text-primary'}`}>
                                      {userProfile.kycStatus === 'verified' ? 'DONE' : userProfile.kycStatus === 'pending' ? 'PENDING' : 'START'}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="px-4">
              <Button 
                  variant="ghost" 
                  className="w-full text-destructive hover:bg-destructive/10 h-14 font-black uppercase tracking-widest rounded-xl border-2 border-destructive/20"
                  onClick={handleLogout}
              >
                  <LogOut className="h-5 w-5 mr-3" />
                  लॉग आउट (Log Out)
              </Button>
            </div>
        </div>
    );
}

import { Separator } from "@/components/ui/separator";
