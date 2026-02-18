'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Briefcase, Gift, Users, Languages, Globe, LogOut, ShieldAlert, ClipboardList, Handshake, Bus, Wallet } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirebase } from "@/firebase";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function MenuPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const { userProfile } = useUserProfile(user?.uid);
  const router = useRouter();

  const displayName = userProfile?.fullName || user?.displayName || 'Traveler';
  const displayEmail = user?.email || 'Not signed in';

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/');
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 pb-20">
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-primary-foreground/50 shadow-inner">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} alt="User avatar" data-ai-hint="user avatar" />
            <AvatarFallback className="text-primary bg-white">{displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden flex flex-col gap-1">
            <CardTitle className="text-xl truncate">नमस्कार {displayName}</CardTitle>
            <CardDescription className="text-primary-foreground/80 truncate">{displayEmail}</CardDescription>
            {userProfile?.role && (
                <Badge className="bg-white/20 border-none text-[10px] w-fit uppercase font-bold tracking-widest">
                    {userProfile.role.replace('_', ' ')}
                </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {userProfile?.role === 'admin' && (
            <Link href="/admin">
                <Card className="p-6 bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer border-none shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ShieldAlert className="h-8 w-8" />
                        <div>
                            <p className="font-black uppercase tracking-tight">एडमिन कंसोल (Admin Console)</p>
                            <p className="text-[10px] opacity-80 font-bold">Manage Platform & Users</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                </Card>
            </Link>
        )}

        {userProfile?.role === 'staff' && (
             <Link href="/staff">
                <Card className="p-6 bg-accent text-white hover:bg-accent/90 transition-colors cursor-pointer border-none shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ClipboardList className="h-8 w-8" />
                        <div>
                            <p className="font-black uppercase tracking-tight">ड्यूटी डैशबोर्ड (Duty Dashboard)</p>
                            <p className="text-[10px] opacity-80 font-bold">Manage Operations & Boarding</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                </Card>
            </Link>
        )}

        {userProfile?.role === 'bus_owner' && (
             <Link href="/owner-dashboard">
                <Card className="p-6 bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer border-none shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Bus className="h-8 w-8" />
                        <div>
                            <p className="font-black uppercase tracking-tight">बस मालिक (Owner Dashboard)</p>
                            <p className="text-[10px] opacity-80 font-bold">Monitor Fleet & Earnings</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                </Card>
            </Link>
        )}

        <Link href="/profile">
          <Card className="p-6 hover:bg-muted transition-colors cursor-pointer border-none shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                    <p className="font-bold">मेरा खाता (My Account)</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Profile & Settings</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Card>
        </Link>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-2 border-b bg-muted/20">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">ट्रिप मैनेजमेंट (Trip Management)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Link href="/manage-bookings">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors border-b">
              <div className="flex items-center gap-4">
                <Briefcase className="h-5 w-5 text-primary"/>
                <p className="text-sm font-bold">ट्रिप्स देखें, मैनेज करें (View & Manage Trips)</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link href="/wallet">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
              <div className="flex items-center gap-4">
                <Wallet className="h-5 w-5 text-primary"/>
                <p className="text-sm font-bold">पैसा और वॉलेट (Money & Wallet)</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-2 border-b bg-muted/20">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">बिज़नेस और इनाम (Business & Rewards)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          <Link href="/partnership">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Handshake className="h-5 w-5 text-primary"/>
                    <div>
                        <p className="text-sm font-bold">पार्टनरशिप (Partnership - Sahi Nivesh)</p>
                        <p className="text-[9px] text-primary font-black uppercase italic">Invest Right for Growth</p>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
           <Link href="/gift-card">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Gift className="h-5 w-5 text-primary"/>
                    <p className="text-sm font-bold">गिफ्ट कार्ड (Gift Cards)</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
           <Link href="/refer-and-earn">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-primary"/>
                    <p className="text-sm font-bold">रेफर करें और कमाएं (Refer & Earn)</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">NEW</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
           </Link>
        </CardContent>
      </Card>

      <div className="px-4 pt-4">
        <Button 
          variant="destructive" 
          className="w-full flex items-center justify-center gap-2 h-14 font-black text-lg rounded-2xl shadow-lg shadow-destructive/10 uppercase tracking-widest italic" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          लॉग आउट (Log Out)
        </Button>
      </div>
    </div>
  );
}