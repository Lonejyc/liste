/**
 * App Router - Root Layout
 * 
 * Layout global pour toutes les pages de l'application App Router.
 * Inclut le SessionProvider NextAuth et les styles globaux.
 */

import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Liste - Coolify Control Plane',
  description: 'Dashboard centralisé pour gérer vos applications Coolify',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-grain-background bg-cover min-h-screen text-slate-300">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
