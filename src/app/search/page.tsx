

'use client';

import { popularDestinations } from '../popularDestinations';
import { newSeasonDestinations } from '../newSeasonDestinations';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
    const router = useRouter();

    const handleSearchClick = () => {
        router.push('/search-page');
    };

    return (
        <div className="container mx-auto space-y-12">
            <section>
                <h2 className="text-3xl font-bold text-center">Popular Destinations</h2>
                <p className="text-center text-muted-foreground mt-2 mb-8">Explore breathtaking places curated for you.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularDestinations.map((dest) => (
                        <Link href="/destination-guides" key={dest.name} className="block">
                            <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                                <CardHeader className="p-0">
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={dest.image}
                                            alt={`Image of ${dest.name}`}
                                            data-ai-hint={dest.hint}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow">
                                    <h3 className="font-semibold text-lg">{dest.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>Destination Guide</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center">New Season Destinations</h2>
                <p className="text-center text-muted-foreground mt-2 mb-8">Discover perfect getaways for the current season.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newSeasonDestinations.map((dest) => (
                        <Link href="/destination-guides" key={dest.name} className="block">
                            <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                                <CardHeader className="p-0">
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={dest.image}
                                            alt={`Image of ${dest.name}`}
                                            data-ai-hint={dest.hint}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow">
                                    <h3 className="font-semibold text-lg">{dest.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>Destination Guide</span>
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
