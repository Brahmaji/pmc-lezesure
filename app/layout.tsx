import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import './globals.css';
import { PortalProvider } from '@/lib/store';

// Self-hosted at build time by next/font: removes the render-blocking
// fonts.googleapis.com -> fonts.gstatic.com request chain the CSS @import created.
// Weight 800 is deliberately absent — nothing in the app uses it.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'LeazeSure Partners — rent reporting portal',
  description:
    'Property managers offer rent reporting as a resident benefit. Enrolled tenants report as paid automatically; the landlord flags only the exceptions.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" className={poppins.variable}>
      <body>
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  );
}
