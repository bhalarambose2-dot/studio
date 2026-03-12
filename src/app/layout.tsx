
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { Suspense } from 'react';
import { SplashLoader } from '@/components/splash-loader';
import { Loader2 } from 'lucide-react';

export const viewport: Viewport = {
  themeColor: '#004488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'HALORA',
  description: 'Your next adventure across India starts here with HALORA.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HALORA',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <FirebaseClientProvider>
          {/* Initial 3D Splash Screen */}
          <SplashLoader />
          
          <Suspense fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9998]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-black italic text-primary uppercase tracking-widest text-xs">Sahi Safar Loading...</p>
            </div>
          }>
            <AppShell>{children}</AppShell>
          </Suspense>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
