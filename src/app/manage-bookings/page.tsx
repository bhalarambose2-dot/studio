import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plane, Hotel, Calendar, User, ArrowRight, Pencil, Trash2 } from "lucide-react";

const bookings = [
  {
    type: "Flight",
    icon: Plane,
    title: "Round-trip to Paris",
    reference: "BRT-XYZ123",
    status: "Confirmed",
    details: [
      { label: "Airline", value: "Air France" },
      { label: "Dates", value: "Oct 15, 2024 - Oct 22, 2024" },
      { label: "Passenger", value: "John Doe" },
    ],
  },
  {
    type: "Hotel",
    icon: Hotel,
    title: "Le Marais Boutique Hotel",
    reference: "BRT-HOTEL456",
    status: "Confirmed",
    details: [
      { label: "Location", value: "Paris, France" },
      { label: "Dates", value: "Oct 15, 2024 - Oct 22, 2024" },
      { label: "Guests", value: "2 Adults" },
    ],
  },
  {
    type: "Flight",
    icon: Plane,
    title: "One-way to Tokyo",
    reference: "BRT-ABC789",
    status: "Cancelled",
    details: [
      { label: "Airline", value: "Japan Airlines" },
      { label: "Date", value: "Nov 05, 2024" },
      { label: "Passenger", value: "Jane Smith" },
    ],
  },
];


export default function ManageBookingsPage({params, searchParams}: {params: {}, searchParams: {}}) {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Manage Your Bookings</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View, modify, or cancel your reservations all in one place.
        </p>
      </div>

      <div className="space-y-8">
        {bookings.map((booking, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                        <booking.icon className="w-6 h-6 text-primary"/>
                        <CardTitle>{booking.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">Reference: {booking.reference}</CardDescription>
                  </div>
                  <Badge variant={booking.status === 'Confirmed' ? 'default' : 'destructive'} className={booking.status === 'Confirmed' ? 'bg-accent text-accent-foreground' : ''}>
                      {booking.status}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {booking.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                    <p className="font-semibold">{detail.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" disabled={booking.status === 'Cancelled'}>
                    <Pencil className="mr-2 h-4 w-4"/> Modify
                </Button>
                 <Button variant="destructive" size="sm" disabled={booking.status === 'Cancelled'}>
                    <Trash2 className="mr-2 h-4 w-4"/> Cancel
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
