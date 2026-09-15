import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { PortalProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'LeazeSure Partners — rent reporting portal',
  description:
    'Property managers offer rent reporting as a resident benefit. Enrolled tenants report as paid automatically; the landlord flags only the exceptions.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  );
}
