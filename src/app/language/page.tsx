
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function LanguagePage() {
  return (
    <div className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Languages />
                    Select Language
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup defaultValue="en" className="space-y-2">
                    <div>
                        <RadioGroupItem value="en" id="en" />
                        <Label htmlFor="en" className="ml-2">English</Label>
                    </div>
                    <div>
                        <RadioGroupItem value="hi" id="hi" />
                        <Label htmlFor="hi" className="ml-2">हिंदी (Hindi)</Label>
                    </div>
                     <div>
                        <RadioGroupItem value="es" id="es" />
                        <Label htmlFor="es" className="ml-2">Español (Spanish)</Label>
                    </div>
                </RadioGroup>
                <Button className="w-full">Save Changes</Button>
            </CardContent>
        </Card>
    </div>
  );
}
