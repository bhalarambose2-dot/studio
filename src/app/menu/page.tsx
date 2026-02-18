'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Briefcase, Gift, Users, Languages, Globe, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirebase } from "@/firebase";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

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
            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user/100/100"} alt="User avatar" data-ai-hint="user avatar" />
            <AvatarFallback className="text-primary bg-white">{displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <CardTitle className="text-xl truncate">नमस्कार {displayName}</CardTitle>
            <CardDescription className="text-primary-foreground/80 truncate">{displayEmail}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Link href="/profile">
          <Card className="text-center p-6 hover:bg-muted transition-colors cursor-pointer border-none shadow-sm flex items-center justify-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <p className="font-semibold text-sm">मेरा खाता (My Account)</p>
          </Card>
        </Link>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">मेरी ट्रिप्स</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Link href="/manage-bookings">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
              <div className="flex items-center gap-4">
                <Briefcase className="h-5 w-5 text-primary"/>
                <p className="text-sm font-medium">ट्रिप्स देखें, मैनेज करें</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Rewards</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
           <Link href="/gift-card">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Gift className="h-5 w-5 text-primary"/>
                    <p className="text-sm font-medium">गिफ्ट कार्ड</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
           <Link href="/refer-and-earn">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-primary"/>
                    <p className="text-sm font-medium">रेफर करें और कमाएं</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">NEW</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
           </Link>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">सेटिंग</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
            <Link href="/language">
                <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-4">
                        <Languages className="h-5 w-5 text-primary"/>
                        <div>
                            <p className="text-sm font-medium">भाषा</p>
                            <p className="text-xs text-muted-foreground">हिंदी</p>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </Link>
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <Globe className="h-5 w-5 text-primary"/>
                     <div>
                        <p className="text-sm font-medium">देश / क्षेत्र</p>
                        <p className="text-xs text-muted-foreground">भारत</p>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </CardContent>
      </Card>

      <div className="px-4 pt-4">
        <Button 
          variant="destructive" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          लॉग आउट (Log Out)
        </Button>
      </div>
    </div>
  );
}
