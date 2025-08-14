
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Bell, Briefcase, Gift, Award, Users, Languages, Globe, IndianRupee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MenuPage() {
  return (
    <div className="container mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-primary-foreground/50">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="user avatar" />
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>नमस्कार Bhala</CardTitle>
            <CardDescription className="text-primary-foreground/80">bhalarambose2@gmail.com</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/profile">
          <Card className="text-center p-4 hover:bg-muted transition-colors">
              <User className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="font-semibold">मेरा खाता</p>
          </Card>
        </Link>
         <Card className="text-center p-4 hover:bg-muted transition-colors">
            <Bell className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="font-semibold">सूचनाएं</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>मेरी ट्रिप्स</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/manage-bookings">
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-4">
                <Briefcase className="h-6 w-6 text-primary"/>
                <p>ट्रिप्स देखें, मैनेज करें</p>
              </div>
              <ChevronRight />
            </div>
          </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
           <Link href="/gift-card">
            <div className="flex items-center justify-between p-4 rounded-t-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Gift className="h-6 w-6 text-primary"/>
                    <p>गिफ्ट कार्ड</p>
                </div>
                <ChevronRight />
            </div>
          </Link>
           <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Award className="h-6 w-6 text-primary"/>
                    <p>रिवाईस</p>
                </div>
                <ChevronRight />
            </div>
           <Link href="/refer-and-earn">
            <div className="flex items-center justify-between p-4 rounded-b-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-primary"/>
                    <p>रेफर करें और कमाएं</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">NEW</span>
                    <ChevronRight />
                </div>
            </div>
           </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>सेटिंग</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
            <Link href="/language">
                <div className="flex items-center justify-between p-4 rounded-t-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-4">
                        <Languages className="h-6 w-6 text-primary"/>
                        <div>
                            <p>भाषा</p>
                            <p className="text-sm text-muted-foreground">हिंदी</p>
                        </div>
                    </div>
                    <ChevronRight />
                </div>
            </Link>
            <div className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <Globe className="h-6 w-6 text-primary"/>
                     <div>
                        <p>देश / क्षेत्र</p>
                        <p className="text-sm text-muted-foreground">भारत</p>
                    </div>
                </div>
                <ChevronRight />
            </div>
             <div className="flex items-center justify-between p-4 rounded-b-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <IndianRupee className="h-6 w-6 text-primary"/>
                     <div>
                        <p>मुद्रा</p>
                        <p className="text-sm text-muted-foreground">INR</p>
                    </div>
                </div>
                <ChevronRight />
            </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <div className="flex justify-center gap-4">
            <Link href="#" className="text-primary hover:underline">रेट करें</Link>
            <span>•</span>
            <Link href="/terms" className="text-primary hover:underline">प्राइवेसी पॉलिसी</Link>
        </div>
        <p>एप्लिकेशन प्रारूप 10.5.1</p>
      </div>

    </div>
  );
}
