
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/lib/firebase/use-user-profile";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

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

    return (
        <div className="flex justify-center items-center flex-1">
            <div className="flex flex-col items-center space-y-4 p-8 max-w-md w-full">
                <div className="relative group">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photoURL ?? "https://picsum.photos/seed/user/100/100"} alt="User avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>{userProfile.fullName?.[0] ?? user.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Add photo</span>
                    </div>
                </div>
                
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Add photo
                </Button>

                <div className="text-center">
                    <h2 className="text-2xl font-bold">{userProfile.fullName}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-full max-w-sm space-y-4 pt-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input type="email" id="email" defaultValue={user.email ?? ''} disabled />
                    </div>
                    <Button className="w-full" onClick={handleUpdateProfile}>Update Profile</Button>
                </div>
            </div>
        </div>
    );
}
