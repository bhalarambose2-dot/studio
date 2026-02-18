
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { useEffect, useState } from "react";
import { Camera, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const { user } = useUser();
    const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
    const [name, setName] = useState('');

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.fullName);
        }
    }, [userProfile]);

    const handleUpdateProfile = async () => {
        if (user) {
            await updateUserProfile({ fullName: name });
        }
    };

    if (!user || !userProfile) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
        return null;
    };

    return (
        <div className="flex justify-center items-center flex-1">
            <div className="flex flex-col items-center space-y-4 p-8 max-w-md w-full">
                <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                        <AvatarImage src={user.photoURL ?? "https://picsum.photos/seed/user/100/100"} alt="User avatar" data-ai-hint="user avatar" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{userProfile.fullName?.[0] ?? user.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Add photo</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Add photo
                        </Button>
                        <Link href="/kyc">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className={`flex items-center gap-2 ${userProfile.kycStatus === 'verified' ? 'border-green-500 text-green-600 bg-green-50' : 'border-accent text-accent hover:bg-accent/10'}`}
                                disabled={userProfile.kycStatus === 'pending' || userProfile.kycStatus === 'verified'}
                            >
                                <ShieldCheck className="h-4 w-4" />
                                {userProfile.kycStatus === 'verified' ? 'KYC Done' : 'Add KYC'}
                            </Button>
                        </Link>
                    </div>
                    {renderKycBadge()}
                </div>

                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{userProfile.fullName}</h2>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                
                <div className="w-full max-w-sm space-y-4 pt-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                        <Input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="bg-muted/30 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                        <Input 
                            type="email" 
                            id="email" 
                            defaultValue={user.email ?? ''} 
                            disabled 
                            className="bg-muted/50 cursor-not-allowed opacity-70"
                        />
                    </div>
                    <Button className="w-full shadow-lg shadow-primary/20 mt-2" onClick={handleUpdateProfile}>
                        Update Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
