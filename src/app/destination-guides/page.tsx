
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, IndianRupee, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';
import { Badge } from "@/components/ui/badge";

export default function DestinationGuidesPage() {

  return (
    <div className="container mx-auto space-y-12 pb-24">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter italic text-primary">DESTINATION GUIDES</h1>
        <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest text-xs">
          Sahi Nivesh • Sahi Safar • Best Price Guaranteed
        </p>
      </div>
      
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Popular Destinations</h2>
            <Badge variant="outline" className="border-primary/20 text-primary font-bold">ALL RAJASTHAN</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <Link href="/search" key={dest.name} className="block group">
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col rounded-[2rem] bg-white">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={`Image of ${dest.name}`}
                      data-ai-hint={dest.hint}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg flex items-center gap-1">
                        <IndianRupee className="h-3 w-3 text-primary" />
                        <span className="text-xs font-black italic text-primary">{dest.price.toLocaleString('en-IN')}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase ml-1">Starts</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow space-y-2">
                  <h3 className="font-black text-lg italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="flex items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                    <span>Rajasthan Guide</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 p-8 rounded-[3rem] border-2 border-dashed border-primary/20">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Season Special</h2>
            </div>
            <Badge className="bg-primary text-white border-none font-black italic">WINTER COLLECTION</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newSeasonDestinations.map((dest) => (
            <Link href="/search" key={dest.name} className="block group">
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col rounded-[2rem] bg-white">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={`Image of ${dest.name}`}
                      data-ai-hint={dest.hint}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg flex items-center gap-1">
                        <IndianRupee className="h-3 w-3 text-primary" />
                        <span className="text-xs font-black italic text-primary">{dest.price.toLocaleString('en-IN')}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase ml-1">Starts</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow space-y-2">
                  <h3 className="font-black text-lg italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="flex items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                    <span>Himalayan Guide</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
