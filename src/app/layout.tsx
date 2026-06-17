import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoinTrack Pro - Professional Investment Gateway',
  description: 'Secure local-first investment tracker for professional advisors',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CoinTrack Pro',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className="font-body antialiased bg-background text-foreground scroll-hide">
        <main className="min-h-screen flex flex-col max-w-md mx-auto relative shadow-2xl bg-background overflow-x-hidden border-x border-white/5">
          {children}
        </main>
      </body>
    </html>
  );
}
