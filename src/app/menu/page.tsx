
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Bell, Briefcase, Gift, Award, Users, Languages, Globe, IndianRupee, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MenuPage() {
  return (
    <div className="container mx-auto space-y-6 pb-20">
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-primary-foreground/50 shadow-inner">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User avatar" data-ai-hint="user avatar" />
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">नमस्कार Bhala</CardTitle>
            <CardDescription className="text-primary-foreground/80">bhalarambose2@gmail.com</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/profile">
          <Card className="text-center p-6 hover:bg-muted transition-colors cursor-pointer border-none shadow-sm">
              <User className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="font-semibold text-sm">मेरा खाता</p>
          </Card>
        </Link>
        <Card className="text-center p-6 hover:bg-muted transition-colors cursor-pointer border-none shadow-sm">
            <Bell className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="font-semibold text-sm">सूचनाएं</p>
        </Card>
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
           <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <Award className="h-5 w-5 text-primary"/>
                    <p className="text-sm font-medium">रिवाईस</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
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
          <CardTitle className="text-lg font-bold">For Business</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Link href="/partnership">
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
              <div className="flex items-center gap-4">
                <Building2 className="h-5 w-5 text-primary"/>
                <p className="text-sm font-medium">Partner with Us</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
             <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <IndianRupee className="h-5 w-5 text-primary"/>
                     <div>
                        <p className="text-sm font-medium">मुद्रा</p>
                        <p className="text-xs text-muted-foreground">INR</p>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground space-y-4 pt-4 pb-8">
        <div className="flex justify-center gap-4">
            <Link href="#" className="text-primary hover:underline font-medium">रेट करें</Link>
            <span className="opacity-30">•</span>
            <Link href="/terms" className="text-primary hover:underline font-medium">प्राइवेसी पॉलिसी</Link>
        </div>
        <p className="opacity-60 uppercase tracking-widest text-[10px]">एप्लिकेशन प्रारूप 10.5.1</p>
      </div>

    </div>
  );
}
