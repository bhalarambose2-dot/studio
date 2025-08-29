{
  "hosting": {
    "public": "out", // Or ".next" depending on your Next.js configuration
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html" // Or your custom rewrite for Next.js routing
      }
    ]
  }
}

'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

export default function ManageBookingsPage() {
  return (
    <div className="flex flex-col h-full">
       <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">My Trips</h1>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-muted/20">
        <div className="flex flex-col items-center gap-4">
            <Image 
                src="https://placehold.co/128x128.png"
                alt="Backpacker icon"
                data-ai-hint="backpacker icon"
                width={128}
                height={128}
                className="opacity-60"
            />
            <h2 className="text-xl font-semibold text-muted-foreground">Your trips will appear here</h2>
        </div>
      </div>
       <div className="p-4 border-t">
        <Button className="w-full" size="lg">
          <Plus className="mr-2 h-5 w-5" /> Add PNR
        </Button>
      </div>
    </div>
  );
}
