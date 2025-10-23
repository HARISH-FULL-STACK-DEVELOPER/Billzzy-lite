// In: src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import NextAuthSessionProvider from '@/components/SessionProvider';

// vvv 1. ADD THE "async" KEYWORD HERE vvv
export default async function RootLayout({ children }: { children: ReactNode }) {
  
  // vvv 2. CALL THE FUNCTION TO CREATE THE "session" VARIABLE vvv
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <title>Billzzy Lite</title>
        <meta name="description" content="A lightweight billing PWA" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className='bg-gray-50'>
        {/* Now this line will work because 'session' has been defined above */}
        <NextAuthSessionProvider session={session}>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}