import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Operational Memory',
  description: 'Knowledge continuity app for engineering teams'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
