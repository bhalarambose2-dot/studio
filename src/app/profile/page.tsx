
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    return (
        <div className="flex justify-center items-center flex-1">
            <div className="flex flex-col items-center space-y-4 p-8 max-w-md w-full">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">John Doe</h2>
                    <p className="text-muted-foreground">john.doe@example.com</p>
                </div>
                <div className="w-full max-w-sm space-y-4 pt-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input type="text" id="name" defaultValue="John Doe" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input type="email" id="email" defaultValue="john.doe@example.com" />
                    </div>
                    <Button className="w-full">Update Profile</Button>
                </div>
            </div>
        </div>
    );
}
