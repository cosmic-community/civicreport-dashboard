import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import CosmicBadge from '@/components/CosmicBadge';

export const metadata: Metadata = {
  title: 'CivicReport Dashboard',
  description: 'Manage civic issue reports and municipal operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16">
          {children}
        </main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}