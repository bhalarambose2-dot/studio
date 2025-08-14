
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 pr-4">
                    <div className="prose dark:prose-invert">
                        <p><strong>Last Updated:</strong> August 13, 2025</p>

                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to BR Trip. These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms.
                        </p>

                        <h2>2. Bookings and Payments</h2>
                        <p>
                            All bookings are subject to availability. Prices are quoted in Indian Rupees (INR) and are subject to change without notice. Payment must be made in full at the time of booking unless otherwise specified. We accept various payment methods, including credit/debit cards and online banking.
                        </p>

                        <h2>3. Cancellations and Refunds</h2>
                        <p>
                            Cancellation policies vary depending on the service booked (flights, hotels, packages). Please refer to the specific cancellation policy provided at the time of booking. Refunds, if applicable, will be processed within 7-10 business days.
                        </p>

                        <h2>4. User Responsibilities</h2>
                        <p>
                            You are responsible for ensuring that all information you provide is accurate. You must also ensure you have the necessary travel documents, including passports and visas, for your trip.
                        </p>

                        <h2>5. Limitation of Liability</h2>
                        <p>
                            BR Trip acts as an agent for third-party suppliers, such as airlines and hotels. We are not liable for any acts, errors, omissions, or negligence of any such suppliers. Our liability is limited to the amount paid for the booking.
                        </p>

                        <h2>6. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.
                        </p>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}
