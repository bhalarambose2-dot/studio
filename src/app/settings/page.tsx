
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings />
                    Settings
                </CardTitle>
                <CardDescription>Manage your application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="font-semibold">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="font-semibold">Push Notifications</Label>
                    <Switch id="push-notifications" />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="font-semibold">Dark Mode</Label>
                    <Switch id="dark-mode" />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="data-saver" className="font-semibold">Data Saver</Label>
                    <Switch id="data-saver" />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
