import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/kibi/Header';

export const metadata: Metadata = {
  title: 'KIBI Sponsorship Matchmaker',
  description: 'AI-powered brand matchmaking for sports sponsorships.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'h-full font-body antialiased flex flex-col',
          'bg-background'
        )}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
