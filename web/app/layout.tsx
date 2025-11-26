import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'TPAistos',
  description: 'Test technique - dettes et paiement Stripe'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
